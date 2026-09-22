import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-warm-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="font-heading text-4xl font-bold text-text-primary tracking-widest">
          AURELLE
        </Link>
      </div>
      {children}
    </div>
  );
}