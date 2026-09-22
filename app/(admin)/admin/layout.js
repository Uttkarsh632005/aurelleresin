import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, PaintBucket, LogOut } from 'lucide-react';
import '@/app/globals.css'; // Ensure global styles are loaded

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="font-heading text-xl font-bold tracking-widest text-text-primary">
            AURELLE ADMIN
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm bg-warm-cream text-champagne-gold">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm text-gray-600 hover:bg-gray-50">
            <Package size={18} /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm text-gray-600 hover:bg-gray-50">
            <ShoppingCart size={18} /> Orders
          </Link>
          <Link href="/admin/custom-orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm text-gray-600 hover:bg-gray-50">
            <PaintBucket size={18} /> Custom Requests
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 w-full hover:bg-red-50 rounded-sm transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-8 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-champagne-gold flex items-center justify-center text-white font-bold text-xs">A</div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          {children}
        </div>
      </main>
      
    </div>
  );
}