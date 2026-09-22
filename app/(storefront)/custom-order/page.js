'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Send, Sparkles } from 'lucide-react';

export default function CustomOrderPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding Preservation',
    budget: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'custom_requests'), {
        ...formData,
        status: 'New',
        createdAt: serverTimestamp()
      });

      toast.success('Your custom request has been sent successfully!');
      setFormData({
        name: '', email: '', phone: '', eventType: 'Wedding Preservation', budget: '', description: ''
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl text-text-primary font-bold mb-4 flex items-center justify-center gap-3">
          Custom Masterpieces <Sparkles className="text-champagne-gold" />
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
          Want to preserve your wedding garland or have a unique resin art idea? Fill out the form below and our artisans will bring your vision to life.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-sm border border-soft-beige shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Request Category</label>
              <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30">
                <option value="Wedding Preservation">Wedding Varmala Preservation</option>
                <option value="Custom Jewelry">Custom Jewelry</option>
                <option value="Home Decor">Home Decor / Nameplate</option>
                <option value="Corporate Gifting">Corporate Gifting</option>
                <option value="Other">Other Unique Idea</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Estimated Budget (₹)</label>
              <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g., 3000 - 5000" className="w-full p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Describe Your Vision</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" required placeholder="Tell us about colors, flowers to include, dimensions, or any special meaning..." className="w-full p-3 border border-soft-beige rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-warm-cream/30 resize-none"></textarea>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-12 py-4 flex items-center justify-center gap-2 mx-auto disabled:opacity-70">
              {loading ? 'Submitting...' : 'Send Custom Request'} <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}