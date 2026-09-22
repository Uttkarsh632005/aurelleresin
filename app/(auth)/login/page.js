'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success('Welcome back to Aurelle!');
      router.push('/shop'); // Login hone ke baad shop par bhej do
    } catch (error) {
      console.error("Login Error:", error);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="font-heading text-4xl font-bold text-text-primary mb-2">Welcome Back</h2>
        <p className="text-text-secondary text-sm">Log in to your account to view your orders and cart.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-soft-beige sm:rounded-sm sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="block w-full pl-10 p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input name="password" type="password" required value={formData.password} onChange={handleInputChange} className="block w-full pl-10 p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex justify-center items-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-champagne-gold hover:text-deep-gold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}