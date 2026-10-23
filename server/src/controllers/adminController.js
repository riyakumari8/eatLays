import prisma from '../config/db.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalVendors,
      totalOutlets,
      totalOrders,
      activeOrders,
      completedOrders,
      ordersAggregate,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'VENDOR' } }),
      prisma.outlet.count(),
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: { in: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY'] },
        },
      }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { total: true },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        outlet: { select: { name: true } },
        student: { select: { name: true, email: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalVendors,
        totalOutlets,
        totalOrders,
        activeOrders,
        completedOrders,
        totalRevenue: ordersAggregate._sum.total ? Number(ordersAggregate._sum.total) : 0,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOutlets = async (req, res, next) => {
  try {
    const outlets = await prisma.outlet.findMany({
      include: {
        vendorOutlets: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { menuItems: true, orders: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: outlets,
    });
  } catch (error) {
    next(error);
  }
};

export const createOutlet = async (req, res, next) => {
  try {
    const { name, description, location, imageUrl, isOpen, acceptsOrders } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Outlet name and location are required.',
      });
    }

    const outlet = await prisma.outlet.create({
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        location: location.trim(),
        imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
        acceptsOrders: acceptsOrders !== undefined ? Boolean(acceptsOrders) : true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Campus outlet created successfully.',
      data: outlet,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOutlet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, location, imageUrl, isOpen, acceptsOrders } = req.body;

    const data = {};
    if (name) data.name = name.trim();
    if (description !== undefined) data.description = description.trim();
    if (location) data.location = location.trim();
    if (imageUrl) data.imageUrl = imageUrl.trim();
    if (typeof isOpen === 'boolean') data.isOpen = isOpen;
    if (typeof acceptsOrders === 'boolean') data.acceptsOrders = acceptsOrders;

    const outlet = await prisma.outlet.update({
      where: { id },
      data,
    });

    res.status(200).json({
      success: true,
      message: 'Outlet updated successfully.',
      data: outlet,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        vendorOutlets: {
          include: {
            outlet: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const assignVendorOutlet = async (req, res, next) => {
  try {
    const { userId, outletId } = req.body;

    if (!userId || !outletId) {
      return res.status(400).json({
        success: false,
        message: 'Both userId and outletId are required.',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Ensure role is updated to VENDOR if it was STUDENT
    if (user.role !== 'VENDOR') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'VENDOR' },
      });
    }

    // Upsert or create VendorOutlet relation
    const existing = await prisma.vendorOutlet.findFirst({
      where: { userId, outletId },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Vendor already assigned to this outlet.',
        data: existing,
      });
    }

    const assignment = await prisma.vendorOutlet.create({
      data: { userId, outletId },
      include: {
        outlet: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Vendor assigned to outlet successfully.',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, outletId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (outletId) where.outletId = outletId;

    const orders = await prisma.order.findMany({
      where,
      include: {
        outlet: { select: { id: true, name: true, location: true } },
        student: { select: { id: true, name: true, email: true } },
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
