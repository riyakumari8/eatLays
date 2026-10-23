import prisma from '../config/db.js';

export const createOrder = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { outletId, items, specialInstructions } = req.body;

    // 1. Check if outlet exists and is accepting orders
    const outlet = await prisma.outlet.findUnique({
      where: { id: outletId },
    });

    if (!outlet) {
      return res.status(404).json({
        success: false,
        message: 'Selected outlet was not found.',
      });
    }

    if (!outlet.isOpen || !outlet.acceptsOrders) {
      return res.status(400).json({
        success: false,
        message: `${outlet.name} is currently closed or not accepting pre-orders.`,
      });
    }

    // 2. Fetch all menu items from database to verify prices, outlet matching, and availability
    const menuItemIds = items.map((i) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (dbMenuItems.length !== menuItemIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected menu items do not exist.',
      });
    }

    const itemsMap = new Map();
    dbMenuItems.forEach((item) => itemsMap.set(item.id, item));

    let calculatedSubtotal = 0;
    const validatedOrderItems = [];

    for (const requestedItem of items) {
      const dbItem = itemsMap.get(requestedItem.menuItemId);

      // Verify item belongs to the selected outlet
      if (dbItem.outletId !== outletId) {
        return res.status(400).json({
          success: false,
          message: `Item "${dbItem.name}" does not belong to ${outlet.name}. All items must be from the same outlet.`,
        });
      }

      // Verify item is available
      if (!dbItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `"${dbItem.name}" is currently sold out or unavailable.`,
        });
      }

      // Check stock if applicable
      if (dbItem.stockQuantity !== null && dbItem.stockQuantity < requestedItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbItem.name}". Only ${dbItem.stockQuantity} remaining.`,
        });
      }

      // Authoritative server-side price calculation
      const unitPrice = Number(dbItem.price);
      const lineTotal = Number((unitPrice * requestedItem.quantity).toFixed(2));
      calculatedSubtotal = Number((calculatedSubtotal + lineTotal).toFixed(2));

      validatedOrderItems.push({
        menuItemId: dbItem.id,
        itemNameSnapshot: dbItem.name,
        unitPriceSnapshot: unitPrice,
        quantity: requestedItem.quantity,
        lineTotal,
      });
    }

    // Unique order number and 4-digit pickup code
    const orderNumber = `EL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 3. Execute order creation in a database transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          pickupCode,
          studentId,
          outletId,
          status: 'PLACED',
          subtotal: calculatedSubtotal,
          total: calculatedSubtotal,
          specialInstructions: specialInstructions?.trim() || null,
          items: {
            create: validatedOrderItems.map((item) => ({
              menuItemId: item.menuItemId,
              itemNameSnapshot: item.itemNameSnapshot,
              unitPriceSnapshot: item.unitPriceSnapshot,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
          },
        },
        include: {
          outlet: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
          items: true,
        },
      });

      // Decrement stock for tracked items
      for (const item of items) {
        const dbItem = itemsMap.get(item.menuItemId);
        if (dbItem.stockQuantity !== null) {
          await tx.menuItem.update({
            where: { id: item.menuItemId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Check your pickup code and status.',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const studentId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { studentId },
      include: {
        outlet: {
          select: {
            id: true,
            name: true,
            location: true,
            imageUrl: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        outlet: {
          select: {
            id: true,
            name: true,
            location: true,
            imageUrl: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Authorization checks
    if (user.role === 'STUDENT' && order.studentId !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only view your own orders.',
      });
    }

    if (user.role === 'VENDOR') {
      const authorizedOutlet = user.vendorOutlets?.some(
        (vo) => vo.outletId === order.outletId
      );
      if (!authorizedOutlet) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You are not authorized to view orders from this outlet.',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
