import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import { Toaster } from 'react-hot-toast'; // Toaster import kiya
import './globals.css';

export const metadata = {
  title: 'Aurelle Resin | Crafted in Resin, Preserved in Gold',
  description: 'Premium handmade resin jewellery, customized photo frames, and wedding memory preservation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-warm-cream text-text-primary min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer /> 
            {/* Toaster component yahan laga diya */}
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                  fontSize: '14px',
                  borderRadius: '4px',
                  letterSpacing: '0.05em'
                },
                success: {
                  style: { background: '#D4AF37', color: '#fff' }, // Champagne Gold color
                }
              }} 
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}