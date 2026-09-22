import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function StorefrontLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}