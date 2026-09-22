'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { TrendingUp, ShoppingBag, Package, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Orders ka data fetch kar rahe hain
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let revenue = 0;
        let ordersCount = 0;
        let pendingCount = 0;

        ordersSnap.forEach((doc) => {
          const data = doc.data();
          ordersCount++;
          revenue += data.totalAmount || 0;
          if (data.orderStatus === 'Processing' || data.orderStatus === 'Pending') {
            pendingCount++;
          }
        });

        // 2. Products ka data fetch kar rahe hain
        const productsSnap = await getDocs(collection(db, 'products'));
        let productsCount = 0;
        let lowStockCount = 0;

        productsSnap.forEach((doc) => {
          const data = doc.data();
          productsCount++;
          if (data.stock <= 5) {
            lowStockCount++;
          }
        });

        // State update
        setStats({
          totalRevenue: revenue,
          totalOrders: ordersCount,
          pendingOrders: pendingCount,
          totalProducts: productsCount,
          lowStockItems: lowStockCount,
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-champagne-gold mb-4" />
        <p className="text-gray-500">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here is what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <ShoppingBag size={20} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Orders</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
            <AlertCircle size={20} />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
            <Package size={20} />
          </div>
        </div>
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Inventory Alerts</h3>
          {stats.lowStockItems > 0 ? (
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-sm">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <span className="font-medium text-sm">{stats.lowStockItems} products are running low on stock!</span>
              </div>
              <Link href="/admin/products" className="text-sm font-bold text-red-700 hover:underline">
                View Inventory
              </Link>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">All products are well stocked right now.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Link href="/admin/products/add" className="bg-champagne-gold hover:bg-deep-gold text-white transition-colors flex-1 text-center py-3 text-sm font-bold tracking-widest uppercase rounded-sm">
              Add Product
            </Link>
            <Link href="/admin/orders" className="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex-1 text-center py-3 text-sm font-bold tracking-widest uppercase rounded-sm">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}