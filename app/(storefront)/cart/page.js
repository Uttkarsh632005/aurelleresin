import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  // Dummy cart items (Baad mein ye global state / React Context se aayenge)
  const cartItems = [
    {
      id: 1,
      name: "Ocean Wave Resin Platter",
      price: 2499,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Gold Flake Geode Coasters",
      price: 1299,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 150; // Flat shipping rate
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <h1 className="font-heading text-4xl text-text-primary font-bold mb-10 tracking-wider">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 bg-white border border-soft-beige shadow-sm items-center relative">
                  <div className="w-24 h-24 bg-soft-beige flex-shrink-0 relative border border-champagne-gold/30">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-bold text-text-primary mb-1">{item.name}</h3>
                    <p className="text-champagne-gold font-medium">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-soft-beige bg-warm-cream/30">
                      <button className="p-2 hover:text-champagne-gold transition-colors text-text-secondary">
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-text-primary">{item.quantity}</span>
                      <button className="p-2 hover:text-champagne-gold transition-colors text-text-secondary">
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Remove Item Button */}
                    <button className="text-text-secondary hover:text-red-500 transition-colors p-2 absolute top-2 right-2 sm:static">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-soft-beige shadow-sm">
              <p className="text-text-secondary mb-6 text-lg">Your cart is currently empty.</p>
              <Link href="/shop" className="btn-primary inline-block">Explore Collection</Link>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-8 border border-soft-beige shadow-sm sticky top-28">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6 border-b border-soft-beige pb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-text-primary font-medium tracking-wide">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping Estimate</span>
                <span className="text-text-primary font-medium tracking-wide">₹{shipping}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-text-primary text-lg">Total</span>
              <span className="font-bold text-champagne-gold text-2xl tracking-wide">₹{total}</span>
            </div>
            
            <Link href="/checkout" className="w-full btn-primary py-4 flex justify-center items-center gap-2 font-bold tracking-widest text-sm">
              PROCEED TO CHECKOUT <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}