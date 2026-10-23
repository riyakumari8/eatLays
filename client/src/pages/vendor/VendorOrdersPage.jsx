import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  BellRing, 
  Check, 
  X, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft,
  User,
  MessageSquare
} from 'lucide-react';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [processingId, setProcessingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.getVendorOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      if (!silent) setErrorMsg(err.message || 'Failed to fetch vendor orders.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setProcessingId(orderId);
    setErrorMsg('');
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success && res.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.data : o))
        );
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update order status.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') return ['PLACED', 'ACCEPTED', 'PREPARING', 'READY'].includes(order.status);
    return order.status === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#A91314] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vendor Dashboard</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-[#250001]">
            Kitchen Pre-Orders Queue
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Accept pre-orders, update kitchen states, and verify counter pickup tokens
          </p>
        </div>

        <button
          onClick={() => fetchOrders(false)}
          className="self-start sm:self-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl flex items-center gap-3 text-xs text-rose-800 font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'ALL', label: `All Orders (${orders.length})` },
          { key: 'ACTIVE', label: 'Active Queue' },
          { key: 'PLACED', label: 'New (Placed)' },
          { key: 'ACCEPTED', label: 'Accepted' },
          { key: 'PREPARING', label: 'Preparing' },
          { key: 'READY', label: 'Ready for Pickup' },
          { key: 'COMPLETED', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterStatus === tab.key
                ? 'bg-[#590004] text-[#FFB607] shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
          <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            No orders found in this category
          </h3>
          <p className="text-xs text-gray-500">
            Incoming orders will appear here automatically with live polling.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isProcessing = processingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm hover:border-[#FFB607] transition-all space-y-4"
              >
                {/* Top Row: Order ID, Status, Pickup Token & Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-base text-[#250001]">
                      #{order.orderNumber}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        order.status === 'PLACED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'ACCEPTED'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'PREPARING'
                          ? 'bg-[#FFB607]/20 text-[#590004]'
                          : order.status === 'READY'
                          ? 'bg-emerald-100 text-emerald-800 font-extrabold animate-pulse'
                          : order.status === 'COMPLETED'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 rounded-xl bg-[#FCECCB] border border-[#e5d4b0] text-[#250001] flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase text-[#A91314]">Pickup PIN:</span>
                      <span className="font-mono font-black text-sm">{order.pickupCode}</span>
                    </div>

                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Middle: Student Details & Items List */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items */}
                  <div className="md:col-span-8 space-y-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Ordered Dishes ({order.items?.length})
                    </div>
                    <div className="divide-y divide-gray-100">
                      {order.items?.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#590004] text-[#FFB607] font-bold text-xs flex items-center justify-center">
                              {item.quantity}×
                            </span>
                            <span className="font-bold text-gray-800">
                              {item.itemNameSnapshot}
                            </span>
                          </div>
                          <span className="font-mono text-gray-600 font-semibold">
                            ₹{Number(item.lineTotal).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.specialInstructions && (
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 mt-2">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Student Note:</strong> {order.specialInstructions}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Student & Price Summary */}
                  <div className="md:col-span-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase">Student</span>
                      <div className="font-bold text-xs text-gray-900 mt-0.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.student?.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 pl-5">{order.student?.email}</div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-gray-500">Total to Collect:</span>
                      <span className="font-display text-xl font-black text-[#A91314]">
                        ₹{Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Kitchen Action Controls */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2.5">
                  {order.status === 'PLACED' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Accept Pre-Order</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        disabled={isProcessing}
                        className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      disabled={isProcessing}
                      className="px-5 py-2 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Start Cooking / Preparing</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      disabled={isProcessing}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 animate-pulse"
                    >
                      <BellRing className="w-4 h-4" />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      disabled={isProcessing}
                      className="px-5 py-2.5 bg-[#590004] hover:bg-[#850003] text-[#FFB607] font-black text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify PIN & Mark Collected at Counter</span>
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Collected by student</span>
                    </span>
                  )}

                  {order.status === 'CANCELLED' && (
                    <span className="text-xs font-bold text-rose-500">Order cancelled</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
