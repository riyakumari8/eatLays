import prisma from '../config/db.js';

// Helper to get vendor's outlet ID
const getVendorOutletId = async (userId) => {
  const vendorOutlet = await prisma.vendorOutlet.findFirst({
    where: { userId },
  });
  return vendorOutlet ? vendorOutlet.outletId : null;
};

// Allowed status transitions state machine
const ALLOWED_TRANSITIONS = {
  PLACED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export const getVendorOrders = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const { status } = req.query;
    const where = { outletId };
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
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

export const updateOrderStatus = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Verify ownership: vendor can only manage orders for their assigned outlet
    if (order.outletId !== outletId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You cannot manage orders belonging to another outlet.',
      });
    }

    // Validate state machine transition
    const validNextStatuses = ALLOWED_TRANSITIONS[order.status] || [];
    if (!validNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from "${order.status}" to "${status}". Permitted: ${validNextStatuses.join(', ') || 'none'}.`,
      });
    }

    // Map timestamps
    const updateData = { status };
    const now = new Date();
    if (status === 'ACCEPTED') updateData.acceptedAt = now;
    if (status === 'PREPARING') updateData.preparingAt = now;
    if (status === 'READY') updateData.readyAt = now;
    if (status === 'COMPLETED') updateData.completedAt = now;
    if (status === 'CANCELLED') updateData.cancelledAt = now;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
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

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getVendorOutletInfo = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const outlet = await prisma.outlet.findUnique({
      where: { id: outletId },
      include: {
        categories: true,
        _count: {
          select: {
            menuItems: true,
            orders: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: outlet,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOutletStatus = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const { isOpen, acceptsOrders } = req.body;
    const data = {};
    if (typeof isOpen === 'boolean') data.isOpen = isOpen;
    if (typeof acceptsOrders === 'boolean') data.acceptsOrders = acceptsOrders;

    const updated = await prisma.outlet.update({
      where: { id: outletId },
      data,
    });

    res.status(200).json({
      success: true,
      message: 'Outlet status updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getVendorMenuItems = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const items = await prisma.menuItem.findMany({
      where: { outletId },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ isAvailable: 'desc' }, { name: 'asc' }],
    });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const { name, description, price, categoryId, imageUrl, prepTimeMinutes, stockQuantity } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Item name, price, and category are required.',
      });
    }

    const newItem = await prisma.menuItem.create({
      data: {
        outletId,
        categoryId,
        name: name.trim(),
        description: description?.trim() || '',
        price: Number(price),
        imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        prepTimeMinutes: prepTimeMinutes ? Number(prepTimeMinutes) : 10,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 50,
        isAvailable: true,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully.',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const { id } = req.params;
    const { name, description, price, categoryId, imageUrl, isAvailable, prepTimeMinutes, stockQuantity } = req.body;

    const existing = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existing || existing.outletId !== outletId) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or does not belong to your outlet.',
      });
    }

    const data = {};
    if (name) data.name = name.trim();
    if (description !== undefined) data.description = description.trim();
    if (price !== undefined) data.price = Number(price);
    if (categoryId) data.categoryId = categoryId;
    if (imageUrl) data.imageUrl = imageUrl.trim();
    if (typeof isAvailable === 'boolean') data.isAvailable = isAvailable;
    if (prepTimeMinutes !== undefined) data.prepTimeMinutes = Number(prepTimeMinutes);
    if (stockQuantity !== undefined) data.stockQuantity = Number(stockQuantity);

    const updated = await prisma.menuItem.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleItemAvailability = async (req, res, next) => {
  try {
    const outletId = await getVendorOutletId(req.user.id);
    if (!outletId) {
      return res.status(403).json({
        success: false,
        message: 'No outlet assigned to this vendor account.',
      });
    }

    const { id } = req.params;
    const existing = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existing || existing.outletId !== outletId) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or does not belong to your outlet.',
      });
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !existing.isAvailable },
    });

    res.status(200).json({
      success: true,
      message: `Item availability set to ${updated.isAvailable ? 'Available' : 'Unavailable'}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
