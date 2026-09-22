import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-soft-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-heading text-2xl font-bold text-text-primary tracking-widest">
              AURELLE
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/shop" className="text-sm uppercase tracking-widest text-text-secondary hover:text-champagne-gold transition-colors font-medium">
              Shop
            </Link>
            <Link href="/custom-order" className="text-sm uppercase tracking-widest text-text-secondary hover:text-champagne-gold transition-colors font-medium">
              Custom Order
            </Link>
            <Link href="/gallery" className="text-sm uppercase tracking-widest text-text-secondary hover:text-champagne-gold transition-colors font-medium">
              Gallery
            </Link>
          </nav>

          {/* Icons Area (User & Cart) */}
          <div className="flex items-center space-x-6">
            <Link href="/account" className="text-text-secondary hover:text-champagne-gold transition-colors">
              <User size={22} strokeWidth={1.5} />
            </Link>
            <Link href="/cart" className="text-text-secondary hover:text-champagne-gold transition-colors relative">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {/* Temporary Cart Badge Indicator */}
              <span className="absolute -top-1.5 -right-2 bg-champagne-gold text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}