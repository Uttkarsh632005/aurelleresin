'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UploadCloud, Save, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload a product image!");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Image to Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', imageFile);
      
      // Upload Preset Name updated
      cloudinaryData.append('upload_preset', 'aurelle_products'); 
      
      // Cloud Name updated
      const cloudName = 'gfyleclg'; 
      
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudinaryData
      });

      const uploadedImage = await cloudinaryResponse.json();
      
      // Checking for Cloudinary upload error
      if (uploadedImage.error) {
        throw new Error(uploadedImage.error.message);
      }
      
      const imageUrl = uploadedImage.secure_url;

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      // 2. Save Product Data to Firestore Database
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: formData.status,
        description: formData.description,
        image: imageUrl,
        createdAt: serverTimestamp()
      });

      alert('Product added successfully!');
      router.push('/admin/products'); 
      
    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Failed to add product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Ocean Wave Resin Platter" className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-white" required>
                <option value="">Select Category</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Coasters">Coasters</option>
                <option value="Preservation">Preservation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="2499" className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Stock Quantity</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="10" className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm" required />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm bg-white">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-2">Product Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" placeholder="Detailed description of the product..." className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm resize-none" required></textarea>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm">
          <label className="block text-sm font-bold uppercase tracking-widest text-gray-700 mb-4">Product Image</label>
          <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 py-12 px-6 text-center flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
            
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            
            {imagePreview ? (
              <div className="flex flex-col items-center">
                <img src={imagePreview} alt="Preview" className="h-40 object-contain mb-4 rounded-sm shadow-sm" />
                <p className="text-sm font-bold text-champagne-gold flex items-center gap-2"><ImageIcon size={16}/> Change Image</p>
              </div>
            ) : (
              <>
                <UploadCloud size={36} className="text-gray-400 mb-3" />
                <p className="text-sm font-bold text-gray-700 mb-1">Click or drag image to upload</p>
                <p className="text-xs text-gray-500 tracking-wide">SVG, PNG, JPG or GIF</p>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-50 transition-colors text-sm uppercase tracking-widest">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-3 bg-champagne-gold text-white rounded-sm font-bold hover:bg-deep-gold transition-colors text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-70">
            <Save size={18} /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}