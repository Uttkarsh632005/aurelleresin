'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-sm border border-soft-beige shadow-sm text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">Order Confirmed!</h1>
        <p className="text-text-secondary mb-6">
          Thank you for choosing Aurelle Resin. Your masterpiece is now being prepared.
        </p>
        
        {orderId && (
          <div className="bg-warm-cream/50 p-4 rounded-sm border border-soft-beige mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">Order Reference ID</p>
            <p className="text-sm font-mono text-text-primary">{orderId}</p>
          </div>
        )}

        <Link 
          href="/shop" 
          className="w-full bg-champagne-gold hover:bg-deep-gold text-white py-4 font-bold tracking-widest uppercase text-sm rounded-sm transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}