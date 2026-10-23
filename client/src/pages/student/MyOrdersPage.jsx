import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Clock, 
  Store, 
  MapPin, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';

const STATUS_BADGES = {
  PLACED: { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Placed' },
  ACCEPTED: { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Accepted' },
  PREPARING: { bg: 'bg-[#FFB607]/20 text-[#590004] border-[#FFB607]', label: 'Cooking 🍳' },
  READY: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black animate-pulse', label: 'Ready for Pickup 🔔' },
  COMPLETED: { bg: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Collected' },
  CANCELLED: { bg: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Cancelled' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' or 'HISTORY'

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching student orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeOrders = orders.filter((o) =>
    ['PLACED', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status)
  );

  const pastOrders = orders.filter((o) =>
    ['COMPLETED', 'CANCELLED'].includes(o.status)
  );

  const displayedOrders = activeTab === 'ACTIVE' ? activeOrders : pastOrders;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-[#250001]">
            My Pre-Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track live kitchen queues and view your past counter pickups
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`font-bold text-sm pb-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ACTIVE'
              ? 'border-[#A91314] text-[#A91314]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Active Orders</span>
          {activeOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#FFB607] text-[#250001] font-black text-[11px] flex items-center justify-center">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`font-bold text-sm pb-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'HISTORY'
              ? 'border-[#A91314] text-[#A91314]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Order History ({pastOrders.length})</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {activeTab === 'ACTIVE' ? 'No active orders in progress' : 'No past orders yet'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
            {activeTab === 'ACTIVE'
              ? 'Browse campus canteens to order delicious food ahead of your break.'
              : 'Your completed or collected food orders will appear here.'}
          </p>
          <Link
            to="/outlets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-bold text-xs rounded-xl shadow-xs"
          >
            <span>Explore Campus Menus</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const badge = STATUS_BADGES[order.status] || {
              bg: 'bg-gray-100 text-gray-800 border-gray-200',
              label: order.status,
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:border-[#FFB607] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-xs text-gray-400">
                      #{order.orderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-black text-[#250001]">
                    {order.outlet?.name}
                  </h3>

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A91314] shrink-0" />
                    <span>{order.outlet?.location}</span>
                  </div>

                  {/* Items snapshot summary */}
                  <div className="text-xs text-gray-700 font-medium">
                    {order.items?.map((item, idx) => (
                      <span key={item.id}>
                        {item.quantity}× {item.itemNameSnapshot}
                        {idx < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-gray-400 font-bold uppercase">
                      Total
                    </div>
                    <div className="font-display text-xl font-black text-[#A91314]">
                      ₹{Number(order.total).toFixed(2)}
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 bg-[#590004] hover:bg-[#850003] text-[#FFB607] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
