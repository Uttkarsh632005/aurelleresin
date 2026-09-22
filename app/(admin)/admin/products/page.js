'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore se products fetch karne ka function
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Product Delete karne ka function
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      // UI se bhi turant hata do bina page refresh kiye
      setProducts(products.filter(product => product.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link href="/admin/products/add" className="bg-champagne-gold hover:bg-deep-gold text-white px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select className="border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-champagne-gold text-gray-600 bg-white">
          <option>All Categories</option>
          <option>Home Decor</option>
          <option>Jewellery</option>
          <option>Coasters</option>
          <option>Preservation</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500 bg-gray-50">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-champagne-gold mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-sm border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-sm text-xs text-gray-400 border border-gray-200">No Img</div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                    <td className="p-4 text-gray-500">{product.category}</td>
                    <td className="p-4 text-gray-700">₹{product.price}</td>
                    <td className="p-4 text-gray-700">{product.stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-sm font-medium ${
                        product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-3 mt-2">
                      <button className="text-gray-400 hover:text-champagne-gold transition-colors">
                        <Edit size={18} />
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>Total {products.length} products</span>
        </div>
      </div>
    </div>
  );
}