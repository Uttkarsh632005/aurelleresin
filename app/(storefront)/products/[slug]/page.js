import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ArrowLeft } from 'lucide-react';

export default function ProductDetailsPage({ params }) {
  // Dummy product data (Baad mein ye Firestore se ID ya slug ke base par fetch hoga)
  const product = {
    id: params.slug,
    name: "Ocean Wave Resin Platter",
    price: 2499,
    category: "Home Decor",
    description: "Bring the calming energy of the ocean into your home. This handcrafted resin platter features mesmerizing, multi-layered ocean waves with subtle gold flakes catching the light. Perfect for serving, displaying jewellery, or as a standalone centerpiece.",
    features: [
      "Handmade with premium epoxy resin",
      "Food-safe coating",
      "Heat resistant up to 50°C",
      "Dimensions: 12 x 8 inches"
    ],
   image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Back Button */}
      <Link href="/shop" className="inline-flex items-center text-sm text-text-secondary hover:text-champagne-gold transition-colors mb-8 uppercase tracking-widest">
        <ArrowLeft size={16} className="mr-2" /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Product Image Gallery */}
        <div className="w-full md:w-1/2">
          <div className="aspect-[4/5] bg-white rounded-sm overflow-hidden shadow-sm relative">
            <Image 
              src={product.image} 
              alt={product.name}
              width={800}
              height={1000}
              className="w-full h-full object-cover object-center"
              priority
            />
          </div>
          {/* Thumbnail placeholders */}
          <div className="flex gap-4 mt-4">
            <div className="w-20 h-20 bg-soft-beige cursor-pointer border border-champagne-gold"></div>
            <div className="w-20 h-20 bg-soft-beige cursor-pointer opacity-50 hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 bg-soft-beige cursor-pointer opacity-50 hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <p className="text-xs text-text-secondary uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="font-heading text-3xl md:text-4xl text-text-primary font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-champagne-gold font-medium mb-6">₹{product.price}</p>
          
          <div className="w-full h-px bg-soft-beige mb-6"></div>
          
          <p className="text-text-secondary leading-relaxed mb-8">
            {product.description}
          </p>

          <ul className="list-disc list-inside text-text-secondary mb-8 space-y-2">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button className="flex-1 btn-primary flex justify-center items-center gap-2">
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button className="p-3 border border-champagne-gold text-champagne-gold rounded-sm hover:bg-soft-beige transition-colors flex justify-center items-center">
              <Heart size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Customization Note */}
          <div className="mt-8 p-4 border border-dashed border-champagne-gold bg-white/50 text-center">
            <p className="text-sm text-text-secondary mb-2">Want to add names, dates, or specific colors?</p>
            <Link href="/custom-order" className="text-sm font-bold text-champagne-gold hover:text-deep-gold uppercase tracking-widest transition-colors">
              Request Customization
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}