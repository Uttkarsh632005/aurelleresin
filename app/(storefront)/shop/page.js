'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore se Live Products fetch karne ka function
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const productsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Customer ko sirf 'Active' status wale products dikhayenge
          if (data.status === 'Active') {
            productsData.push({ id: doc.id, ...data });
          }
        });
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching live products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-heading text-4xl md:text-5xl text-text-primary font-bold mb-4 tracking-wider">Our Collection</h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
          Handcrafted resin masterpieces designed to elevate your space and preserve your most cherished memories.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-soft-beige">
              <h3 className="font-bold text-text-primary tracking-widest uppercase text-sm">Filters</h3>
              <Filter size={18} className="text-text-secondary" />
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-text-primary mb-3 text-sm">Categories</h4>
                <div className="space-y-3 text-sm text-text-secondary">
                  <label className="flex items-center gap-3 cursor-pointer hover:text-champagne-gold transition-colors">
                    <input type="checkbox" className="accent-champagne-gold w-4 h-4" defaultChecked /> All Products
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:text-champagne-gold transition-colors">
                    <input type="checkbox" className="accent-champagne-gold w-4 h-4" /> Home Decor
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:text-champagne-gold transition-colors">
                    <input type="checkbox" className="accent-champagne-gold w-4 h-4" /> Jewellery
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:text-champagne-gold transition-colors">
                    <input type="checkbox" className="accent-champagne-gold w-4 h-4" /> Preservation
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-soft-beige">
            <span className="text-sm text-text-secondary font-medium">Showing {products.length} products</span>
            <div className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-champagne-gold transition-colors">
              <span className="font-medium">Sort by: Featured</span>
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Loader or Products */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 size={40} className="animate-spin text-champagne-gold mb-4" />
              <p className="text-text-secondary tracking-widest uppercase text-sm font-bold">Loading Collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white border border-soft-beige shadow-sm">
              <p className="text-text-secondary text-lg mb-4">No active products available right now.</p>
              <p className="text-sm text-text-secondary">Check back soon for new arrivals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                  {/* Image Box */}
                  <div className="relative aspect-square mb-5 overflow-hidden bg-soft-beige border border-soft-beige shadow-sm group-hover:shadow-md transition-all duration-300">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    {/* Out of Stock Badge */}
                    {product.stock <= 0 && (
                      <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-primary shadow-sm border border-soft-beige">
                        Sold Out
                      </div>
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="text-center px-2">
                    <h3 className="text-text-primary font-bold mb-2 group-hover:text-champagne-gold transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-champagne-gold font-bold tracking-wide">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}