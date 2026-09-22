import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-soft-beige mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center flex flex-col items-center">
          <h2 className="font-heading text-2xl font-bold text-text-primary tracking-widest mb-3">
            AURELLE RESIN
          </h2>
          <p className="text-champagne-gold italic mb-8 font-serif">
            "Crafted in Resin, Preserved in Gold"
          </p>
          
          <div className="flex space-x-6 mb-10">
            <Link href="/about" className="text-xs uppercase tracking-widest text-text-secondary hover:text-champagne-gold transition-colors">About Us</Link>
            <Link href="/faq" className="text-xs uppercase tracking-widest text-text-secondary hover:text-champagne-gold transition-colors">FAQ</Link>
            <Link href="/contact" className="text-xs uppercase tracking-widest text-text-secondary hover:text-champagne-gold transition-colors">Contact</Link>
          </div>

          <p className="text-[10px] text-text-secondary tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Aurelle Resin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}