'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Loader2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const q = query(collection(db, 'custom_requests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const reqData = [];
      querySnapshot.forEach((document) => {
        reqData.push({ id: document.id, ...document.data() });
      });
      
      setRequests(reqData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (reqId, newStatus) => {
    try {
      await updateDoc(doc(db, 'custom_requests', reqId), { status: newStatus });
      toast.success('Status updated!');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-champagne-gold mb-4" />
        <p className="text-gray-500">Loading requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Custom Order Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Manage personalized client requirements and preservation inquiries.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-sm border border-gray-200">
            <p className="text-gray-500">No custom requests found.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{req.name}</h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-champagne-gold">{req.eventType}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{req.createdAt?.toDate().toLocaleDateString()}</p>
                    <p className="text-sm font-bold text-gray-700 mt-1">Budget: {req.budget ? `₹${req.budget}` : 'Not specified'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 text-sm text-gray-700">
                  <p className="whitespace-pre-line">{req.description}</p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <a href={`mailto:${req.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Mail size={16} /> {req.email}
                  </a>
                  <a href={`tel:${req.phone}`} className="flex items-center gap-2 text-sm text-green-600 hover:underline">
                    <Phone size={16} /> {req.phone}
                  </a>
                </div>
              </div>

              <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Update Status</label>
                <select 
                  value={req.status}
                  onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  className={`w-full p-2 border rounded-sm text-sm font-medium focus:outline-none focus:border-champagne-gold ${
                    req.status === 'New' ? 'bg-red-50 border-red-200 text-red-700' : 
                    req.status === 'Contacted' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 
                    'bg-green-50 border-green-200 text-green-700'
                  }`}
                >
                  <option value="New">New Request</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted to Order</option>
                  <option value="Closed">Closed / Rejected</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}