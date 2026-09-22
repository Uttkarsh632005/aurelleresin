'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Context Create kiya
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Sidebar open/close control
  const [isMounted, setIsMounted] = useState(false);

  // Page load hone par LocalStorage se purana cart uthana
  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem('aurelle_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);

  // Jab bhi cart update ho, use LocalStorage mein save kar do
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aurelle_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  // Cart mein item add karne ka logic
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    
    // Yahan humne Naya Toast Notification add kar diya
    toast.success(`${quantity} ${product.name} added!`);
    
    // Item add hote hi Cart Sidebar open kar do
    setIsCartOpen(true);
  };

  // Item ko cart se hatane ka logic
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    
    // Jab item remove ho tab bhi ek halka notification
    toast('Item removed from cart', {
      icon: '🗑️',
    });
  };

  // Cart ke andar quantity + / - karne ka logic
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Pura cart khali karna
  const clearCart = () => setCartItems([]);

  // Total items aur Total Price calculate karna
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook taaki hum asani se data nikal sakein
export const useCart = () => useContext(CartContext);