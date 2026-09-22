'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Loader2, User, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Firebase Auth mein user create karna
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. User ka naam update karna
      await updateProfile(user, { displayName: formData.name });

      // 3. Firestore Database mein user ki profile save karna
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'customer',
        createdAt: serverTimestamp(),
      });

      toast.success('Account created successfully! Welcome to Aurelle.');
      router.push('/shop'); // Account banne ke baad shop par bhej do

    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="font-heading text-4xl font-bold text-text-primary mb-2">Create Account</h2>
        <p className="text-text-secondary text-sm">Join us to preserve your beautiful memories.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-soft-beige sm:rounded-sm sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input name="name" type="text" required value={formData.name} onChange={handleInputChange} className="block w-full pl-10 p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" placeholder="John Doe" />
              </div>
            </div>

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
                <input name="password" type="password" required value={formData.password} onChange={handleInputChange} className="block w-full pl-10 p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" placeholder="••••••••" minLength="6" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex justify-center items-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-champagne-gold hover:text-deep-gold">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}