'use client';

import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Agar cart open nahi hai, toh isko hide rakho
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Black overlay background - click karne par cart band ho jayega */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Slide-out Sidebar */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-soft-beige">
          <h2 className="font-heading text-2xl font-bold flex items-center gap-2 text-text-primary">
            <ShoppingBag size={24} className="text-champagne-gold" /> Your Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
              <ShoppingBag size={48} className="text-gray-200 mb-4" />
              <p className="text-lg text-text-secondary">Your cart is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 text-champagne-gold font-bold uppercase tracking-widest text-sm hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-3 border border-soft-beige rounded-sm shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover border border-soft-beige rounded-sm" />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-text-primary line-clamp-1">{item.name}</h3>
                      <p className="text-champagne-gold font-bold text-sm mt-1">₹{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Plus / Minus Buttons */}
                  <div className="flex items-center mt-3 border border-soft-beige bg-warm-cream/30 w-fit h-8 rounded-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 h-full hover:text-champagne-gold transition-colors text-text-secondary"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-text-primary">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 h-full hover:text-champagne-gold transition-colors text-text-secondary"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-soft-beige p-6 bg-white">
            <div className="flex justify-between text-lg font-bold mb-6 text-text-primary">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <button className="w-full bg-champagne-gold hover:bg-deep-gold text-white py-4 font-bold tracking-widest uppercase text-sm rounded-sm transition-colors shadow-md">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}