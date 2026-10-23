export const validateOrderCreation = (req, res, next) => {
  const { outletId, items, specialInstructions } = req.body;
  const errors = [];

  if (!outletId || typeof outletId !== 'string') {
    errors.push('A valid outlet ID is required.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one item.');
  } else {
    items.forEach((item, index) => {
      if (!item.menuItemId || typeof item.menuItemId !== 'string') {
        errors.push(`Item at index ${index} must have a valid menuItemId.`);
      }
      if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        errors.push(`Item at index ${index} must have a positive integer quantity.`);
      }
      if (item.quantity > 50) {
        errors.push(`Item at index ${index} quantity cannot exceed 50.`);
      }
    });
  }

  if (specialInstructions && typeof specialInstructions === 'string' && specialInstructions.length > 200) {
    errors.push('Special instructions cannot exceed 200 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors,
    });
  }

  next();
};
