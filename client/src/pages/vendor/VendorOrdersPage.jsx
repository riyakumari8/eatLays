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
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#19130F] hover:text-[#FF3D0A] transition-colors mb-2 bg-white px-3.5 py-1.5 rounded-xl border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span>Vendor Dashboard</span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#19130F]">
            Kitchen Pre-Orders Queue
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mt-1">
            Accept pre-orders, update kitchen states, and verify counter pickup tokens
          </p>
        </div>

        <button
          onClick={() => fetchOrders(false)}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-gray-50 text-[#19130F] text-xs font-black rounded-xl border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl flex items-center gap-3 text-xs text-rose-800 font-bold shadow-[3px_3px_0px_#19130F]">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 stroke-[2.5]" />
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
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#19130F] ${
              filterStatus === tab.key
                ? 'bg-[#FF7900] text-[#19130F] shadow-[3px_3px_0px_#19130F]'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#19130F]'
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
            <div key={i} className="h-44 bg-gray-100 rounded-3xl animate-pulse border-2 border-gray-200" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#19130F] shadow-[5px_5px_0px_#19130F] p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#19130F]">
            <ChefHat className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="font-display text-xl font-black text-[#19130F] mb-1">
            No orders found in this category
          </h3>
          <p className="text-xs text-gray-600 font-bold">
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
                className="bg-white rounded-3xl p-6 border-2 border-[#19130F] shadow-[5px_5px_0px_#19130F] space-y-4"
              >
                {/* Top Row: Order ID, Status, Pickup Token & Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-gray-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-lg text-[#19130F]">
                      #{order.orderNumber}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] ${
                        order.status === 'PLACED'
                          ? 'bg-blue-300 text-[#19130F]'
                          : order.status === 'ACCEPTED'
                          ? 'bg-amber-300 text-[#19130F]'
                          : order.status === 'PREPARING'
                          ? 'bg-[#FF7900] text-[#19130F]'
                          : order.status === 'READY'
                          ? 'bg-emerald-300 text-[#19130F] animate-pulse'
                          : order.status === 'COMPLETED'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-rose-300 text-[#19130F]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF0B8] border-2 border-[#19130F] text-[#19130F] flex items-center gap-1.5 shadow-[2px_2px_0px_#19130F]">
                      <span className="text-[10px] font-black uppercase text-[#FF3D0A]">Pickup PIN:</span>
                      <span className="font-mono font-black text-sm">{order.pickupCode}</span>
                    </div>

                    <span className="text-xs text-gray-500 font-bold">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Middle: Student Details & Items List */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items */}
                  <div className="md:col-span-8 space-y-2">
                    <div className="text-xs font-black text-gray-500 uppercase tracking-wider">
                      Ordered Dishes ({order.items?.length})
                    </div>
                    <div className="divide-y-2 divide-gray-100">
                      {order.items?.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-[#FFF0B8] text-[#19130F] font-black text-xs flex items-center justify-center border border-[#19130F]">
                              {item.quantity}×
                            </span>
                            <span className="font-black text-[#19130F]">
                              {item.itemNameSnapshot}
                            </span>
                          </div>
                          <span className="font-mono text-[#19130F] font-bold">
                            ₹{Number(item.lineTotal).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.specialInstructions && (
                      <div className="p-3 bg-[#FFF0B8] border-2 border-[#19130F] rounded-2xl text-xs text-[#19130F] flex items-start gap-2 mt-2 font-bold">
                        <MessageSquare className="w-4 h-4 text-[#FF3D0A] shrink-0 mt-0.5 stroke-[2.5]" />
                        <div>
                          <strong className="font-black text-[#FF3D0A]">Student Note:</strong> {order.specialInstructions}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Student & Price Summary */}
                  <div className="md:col-span-4 bg-[#FFF0B8]/40 rounded-2xl p-4 border-2 border-[#19130F] flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Student</span>
                      <div className="font-black text-xs text-[#19130F] mt-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-500 stroke-[2.5]" />
                        <span>{order.student?.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-600 pl-5 font-semibold truncate">{order.student?.email}</div>
                    </div>

                    <div className="pt-2 border-t-2 border-[#19130F] flex justify-between items-baseline">
                      <span className="text-xs font-black text-[#19130F]">Total to Collect:</span>
                      <span className="font-display text-xl font-black text-[#FF3D0A]">
                        ₹{Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Kitchen Action Controls */}
                <div className="pt-3 border-t-2 border-gray-100 flex flex-wrap items-center justify-end gap-2.5">
                  {order.status === 'PLACED' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-emerald-300 hover:bg-emerald-400 text-[#19130F] font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Accept Pre-Order</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        disabled={isProcessing}
                        className="px-3.5 py-2 bg-rose-100 text-[#19130F] hover:bg-rose-200 font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      disabled={isProcessing}
                      className="px-5 py-2.5 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                    >
                      <ChefHat className="w-4 h-4 stroke-[2.5]" />
                      <span>Start Cooking / Preparing</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      disabled={isProcessing}
                      className="px-5 py-2.5 bg-emerald-300 hover:bg-emerald-400 text-[#19130F] font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 animate-pulse"
                    >
                      <BellRing className="w-4 h-4 stroke-[2.5]" />
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      disabled={isProcessing}
                      className="px-5 py-2.5 bg-[#FF3D0A] hover:bg-[#E03508] text-white font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Verify PIN & Mark Collected at Counter</span>
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <span className="text-xs font-black text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      <span>Collected by student</span>
                    </span>
                  )}

                  {order.status === 'CANCELLED' && (
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-300">
                      Order cancelled
                    </span>
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
