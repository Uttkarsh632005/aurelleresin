'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '@/context/CartContext'; // 1. Cart Context import kiya

export default function ProductDetailsPage() {
  const params = useParams();
  const { id } = params; 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // 2. Context se addToCart function nikala
  const { addToCart } = useCart(); 

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-champagne-gold mb-4" />
        <p className="text-text-secondary tracking-widest uppercase text-sm font-bold">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">Product Not Found</h2>
        <p className="text-text-secondary mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-text-secondary hover:text-champagne-gold transition-colors mb-10">
        <ArrowLeft size={16} /> Back to Collection
      </Link>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square bg-soft-beige border border-soft-beige shadow-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-sm font-bold tracking-widest uppercase text-champagne-gold mb-3 block">
            {product.category}
          </span>
          <h1 className="font-heading text-4xl text-text-primary font-bold mb-4">{product.name}</h1>
          <p className="text-3xl text-text-primary font-medium mb-6">₹{product.price}</p>
          
          <div className="prose prose-sm text-text-secondary mb-8">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          {/* Add to Cart Section */}
          <div className="border-t border-b border-soft-beige py-8 mb-8">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center border border-soft-beige bg-warm-cream/30 h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 h-full hover:text-champagne-gold transition-colors text-text-secondary flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-text-primary">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 h-full hover:text-champagne-gold transition-colors text-text-secondary flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {/* 3. Button action change kar diya */}
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="btn-primary h-12 flex-1 flex items-center justify-center gap-2 font-bold tracking-widest text-sm w-full sm:w-auto"
                >
                  <ShoppingBag size={18} /> ADD TO CART
                </button>
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 text-center font-bold tracking-widest uppercase text-sm">
                Out of Stock
              </div>
            )}
            
            {/* Low Stock Warning */}
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-orange-500 font-bold tracking-wide mt-3">
                Only {product.stock} items left in stock!
              </p>
            )}
          </div>
          
          {/* Static Info */}
          <div className="space-y-4 text-sm">
            <div className="border-b border-soft-beige pb-4">
              <h4 className="font-bold text-text-primary uppercase tracking-widest mb-2">Shipping & Returns</h4>
              <p className="text-text-secondary">Free shipping on all orders over ₹2000. Delivered within 5-7 business days safely.</p>
            </div>
            <div>
              <h4 className="font-bold text-text-primary uppercase tracking-widest mb-2">Care Instructions</h4>
              <p className="text-text-secondary">Keep away from direct prolonged sunlight. Wipe gently with a microfiber cloth.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}