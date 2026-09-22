'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, MapPin, User, Package, CreditCard } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function OrderDetailsPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const orderData = docSnap.data();
          setOrder({ id: docSnap.id, ...orderData });
          setStatus(orderData.orderStatus || 'Processing');
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        orderStatus: status
      });
      alert('Order status updated successfully!');
    } catch (error) {
      console.error("Error updating status:", error);
      alert('Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={40} className="animate-spin text-champagne-gold mb-4" />
        <p className="text-gray-500">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) return <div>Order not found.</div>;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
            <p className="text-sm text-gray-500">Placed on: {order.createdAt?.toDate().toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-sm border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-600 ml-2">Status:</span>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-champagne-gold bg-white"
          >
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            onClick={handleStatusUpdate}
            disabled={saving || status === order.orderStatus}
            className="bg-champagne-gold hover:bg-deep-gold text-white px-4 py-1.5 rounded-sm text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-champagne-gold"/> Order Items
            </h2>
            <div className="space-y-4 divide-y divide-gray-100">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 pt-4 first:pt-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm border border-gray-200" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-champagne-gold font-bold mt-1">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-8">
          {/* Customer Details */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-champagne-gold"/> Customer
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Name:</span> {order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
              <p><span className="font-medium text-gray-800">Email:</span> {order.customerInfo?.email}</p>
              <p><span className="font-medium text-gray-800">Phone:</span> {order.customerInfo?.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-champagne-gold"/> Shipping Address
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
              <p>{order.customerInfo?.address}</p>
              <p>{order.customerInfo?.city}, {order.customerInfo?.state}</p>
              <p>PIN: {order.customerInfo?.pincode}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-champagne-gold"/> Payment Details
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">Status:</span> 
                <span className="ml-2 px-2 py-1 text-xs rounded-sm font-medium bg-yellow-100 text-yellow-700">
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}   