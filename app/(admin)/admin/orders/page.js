'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Link import add kiya
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Loader2, Eye, Search } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore se saare orders fetch karne ka function
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
        
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Timestamp ko readable date mein convert karne ka helper
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-champagne-gold text-sm"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select className="border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-champagne-gold text-gray-600 bg-white">
          <option>All Status</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500 bg-gray-50">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-champagne-gold mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No orders found yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">{order.id}</td>
                    <td className="p-4 text-gray-700">{formatDate(order.createdAt)}</td>
                    <td className="p-4 font-medium text-gray-800">
                      {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                    </td>
                    <td className="p-4 text-gray-500">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="p-4 text-gray-700 font-bold">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded-sm font-medium bg-blue-100 text-blue-700">
                        {order.orderStatus || 'Processing'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {/* Button ko Link mein convert kiya */}
                      <Link href={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-champagne-gold transition-colors inline-flex items-center gap-1">
                        <Eye size={18} /> <span className="text-xs">View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}