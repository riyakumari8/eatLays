export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log error internally without leaking sensitive details
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${target} already exists.`,
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'The requested resource was not found.',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    ...(isDevelopment && { stack: err.stack }),
  });
};
