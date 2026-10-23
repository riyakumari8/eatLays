import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { signToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // CRITICAL SECURITY RULE: Public registration creates STUDENT accounts ONLY
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'STUDENT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = signToken({ id: user.id, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        vendorOutlets: {
          include: {
            outlet: {
              select: {
                id: true,
                name: true,
                isOpen: true,
                acceptsOrders: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken({ id: user.id, role: user.role });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorOutlet: user.vendorOutlets?.[0]?.outlet || null,
    };

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        vendorOutlets: {
          include: {
            outlet: {
              select: {
                id: true,
                name: true,
                isOpen: true,
                acceptsOrders: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorOutlet: user.vendorOutlets?.[0]?.outlet || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};
