import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'eatlays_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored).items || [] : [];
    } catch {
      return [];
    }
  });

  const [outlet, setOutlet] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored).outlet || null : null;
    } catch {
      return null;
    }
  });

  const [conflictModal, setConflictModal] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items, outlet })
      );
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items, outlet]);

  const addToCart = (item, outletData) => {
    // If cart has items from a different outlet
    if (items.length > 0 && outlet && outlet.id !== outletData.id) {
      setConflictModal({
        existingOutlet: outlet,
        newOutlet: outletData,
        newItem: item,
      });
      return false;
    }

    setOutlet({
      id: outletData.id,
      name: outletData.name,
      location: outletData.location,
    });

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });

    return true;
  };

  const confirmSwitchOutlet = () => {
    if (!conflictModal) return;
    const { newOutlet, newItem } = conflictModal;
    setOutlet({
      id: newOutlet.id,
      name: newOutlet.name,
      location: newOutlet.location,
    });
    setItems([{ ...newItem, quantity: 1 }]);
    setConflictModal(null);
  };

  const cancelSwitchOutlet = () => {
    setConflictModal(null);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setItems((prevItems) => {
      const updated = prevItems.filter((i) => i.id !== itemId);
      if (updated.length === 0) {
        setOutlet(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setOutlet(null);
  };

  // Subtotal calculation
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    outlet,
    subtotal: Number(subtotal.toFixed(2)),
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    conflictModal,
    confirmSwitchOutlet,
    cancelSwitchOutlet,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
