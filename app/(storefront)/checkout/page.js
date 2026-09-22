'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Order data taiyar karna
      const orderData = {
        customerInfo: formData,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: cartTotal,
        paymentStatus: 'Pending', // Razorpay aane ke baad update hoga
        orderStatus: 'Processing',
        createdAt: serverTimestamp(),
      };

      // 2. Firebase Database mein 'orders' collection ke andar save karna
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // 3. Cart khali karna
      clearCart();

      // 4. Success page par bhejna order ID ke sath
      router.push(`/checkout/success?orderId=${docRef.id}`);

    } catch (error) {
      console.error("Error saving order: ", error);
      alert("Something went wrong while placing the order. Please try again.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">Your Cart is Empty</h2>
        <p className="text-text-secondary mb-8">Add some beautiful resin pieces to your cart before checking out.</p>
        <Link href="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-text-secondary hover:text-champagne-gold transition-colors mb-10">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="font-heading text-4xl text-text-primary font-bold mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-3/5">
          <div className="bg-white p-8 rounded-sm border border-soft-beige shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-6">Shipping Information</h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Full Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">PIN Code</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-champagne-gold hover:bg-deep-gold text-white py-4 font-bold tracking-widest uppercase text-sm rounded-sm transition-colors shadow-md mt-8 disabled:opacity-70 flex justify-center items-center gap-2">
                {loading ? 'Saving Order...' : 'Place Order Securely'} <CheckCircle size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <div className="bg-warm-cream/30 p-8 border border-soft-beige rounded-sm sticky top-24">
            <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-soft-beige pb-4">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-soft-beige rounded-sm" />
                    <span className="absolute -top-2 -right-2 bg-text-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-text-primary line-clamp-2 pr-4">{item.name}</h3>
                    <p className="text-text-primary font-bold text-sm whitespace-nowrap">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-text-secondary border-b border-soft-beige pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-text-primary">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}