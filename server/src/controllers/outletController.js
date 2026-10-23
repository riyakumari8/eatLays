import prisma from '../config/db.js';

export const getOutlets = async (req, res, next) => {
  try {
    const { search, acceptingOnly } = req.query;

    const where = {};
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { location: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (acceptingOnly === 'true') {
      where.isOpen = true;
      where.acceptsOrders = true;
    }

    const outlets = await prisma.outlet.findMany({
      where,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            menuItems: {
              where: { isAvailable: true },
            },
          },
        },
      },
      orderBy: [
        { isOpen: 'desc' },
        { acceptsOrders: 'desc' },
        { name: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      data: outlets,
    });
  } catch (error) {
    next(error);
  }
};

export const getOutletById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const outlet = await prisma.outlet.findUnique({
      where: { id },
      include: {
        categories: {
          orderBy: { name: 'asc' },
        },
        menuItems: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [
            { isAvailable: 'desc' },
            { name: 'asc' },
          ],
        },
      },
    });

    if (!outlet) {
      return res.status(404).json({
        success: false,
        message: 'Campus outlet not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: outlet,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const { outletId } = req.query;
    const where = outletId ? { outletId } : {};

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
