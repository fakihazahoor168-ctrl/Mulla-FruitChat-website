import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('mulla_cart');
      // Normalize all loaded items: ensure size & flavor are null not undefined
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return parsed.map((item) => ({
        ...item,
        size: item.size ?? null,
        flavor: item.flavor ?? null,
      }));
    } catch {
      return [];
    }
  });
  
  // State for slide-out cart drawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mulla_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Normalize undefined → null so comparisons always work correctly
  const matches = (cartItem, itemId, size, flavor) =>
    cartItem._id === itemId &&
    (cartItem.size ?? null) === (size ?? null) &&
    (cartItem.flavor ?? null) === (flavor ?? null);

  const addToCart = (item, selectedSize = null, selectedFlavor = null) => {
    const size = selectedSize ?? null;
    const flavor = selectedFlavor ?? null;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((c) => matches(c, item._id, size, flavor));

      let itemPrice = item.price;
      if (size && item.sizes) {
        itemPrice = item.sizes instanceof Map ? item.sizes.get(size) : item.sizes[size];
      }

      if (existingIndex > -1) {
        // Return entirely new objects — never mutate in place
        return prevItems.map((cartItem, idx) =>
          idx === existingIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prevItems,
          {
            _id: item._id,
            nameEnglish: item.nameEnglish,
            nameUrdu: item.nameUrdu,
            category: item.category,
            price: itemPrice,
            image: item.image,
            size,
            flavor,
            quantity: 1,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId, size = null, flavor = null) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !matches(item, itemId, size, flavor))
    );
  };

  const updateQuantity = (itemId, size = null, flavor = null, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          matches(item, itemId, size, flavor)
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalQuantity,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
