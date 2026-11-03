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
  PLACED: { bg: 'bg-blue-300 text-[#17130F]', label: 'Placed' },
  ACCEPTED: { bg: 'bg-amber-300 text-[#17130F]', label: 'Accepted' },
  PREPARING: { bg: 'bg-[#E5AD24] text-[#17130F]', label: 'Cooking' },
  READY: { bg: 'bg-emerald-300 text-[#17130F] animate-pulse', label: 'Ready for Pickup' },
  COMPLETED: { bg: 'bg-gray-200 text-gray-700', label: 'Collected' },
  CANCELLED: { bg: 'bg-rose-300 text-[#17130F]', label: 'Cancelled' },
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
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#17130F]">
            My Pre-Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            Track live kitchen queues and view your past counter pickups
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-gray-50 text-[#17130F] text-xs font-black rounded-xl border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 border-2 ${
            activeTab === 'ACTIVE'
              ? 'bg-[#E5AD24] text-[#17130F] border-[#17130F] shadow-[3px_3px_0px_#17130F]'
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#17130F]'
          }`}
        >
          <span>Active Orders</span>
          {activeOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#590004] text-[#E5AD24] font-black text-[11px] flex items-center justify-center border border-[#17130F]">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 border-2 ${
            activeTab === 'HISTORY'
              ? 'bg-[#E5AD24] text-[#17130F] border-[#17130F] shadow-[3px_3px_0px_#17130F]'
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#17130F]'
          }`}
        >
          <span>Order History ({pastOrders.length})</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-3xl animate-pulse border-2 border-gray-200" />
          ))}
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#17130F] shadow-[5px_5px_0px_#17130F] p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#FCECCB] text-[#590004] border-2 border-[#17130F] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#17130F]">
            <ShoppingBag className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="font-display text-xl font-black text-[#17130F] mb-1">
            {activeTab === 'ACTIVE' ? 'No active orders in progress' : 'No past orders yet'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto mb-6 font-medium">
            {activeTab === 'ACTIVE'
              ? 'Browse campus canteens to order delicious food ahead of your break.'
              : 'Your completed or collected food orders will appear here.'}
          </p>
          <Link
            to="/outlets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5AD24] text-[#17130F] font-black text-xs rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <span>Explore Campus Menus</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const badge = STATUS_BADGES[order.status] || {
              bg: 'bg-gray-200 text-gray-800',
              label: order.status,
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[7px_7px_0px_#17130F] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-black text-xs text-gray-500">
                      #{order.orderNumber}
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-[11px] font-black border-2 border-[#17130F] shadow-[1.5px_1.5px_0px_#17130F] ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-gray-500 font-bold">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-black text-[#17130F]">
                    {order.outlet?.name}
                  </h3>

                  <div className="text-xs text-gray-600 flex items-center gap-1 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#A91314] shrink-0 stroke-[2.5]" />
                    <span>{order.outlet?.location}</span>
                  </div>

                  {/* Items snapshot summary */}
                  <div className="text-xs text-gray-700 font-semibold pt-1">
                    {order.items?.map((item, idx) => (
                      <span key={item.id}>
                        {item.quantity}× {item.itemNameSnapshot}
                        {idx < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t-2 sm:border-t-0 pt-3 sm:pt-0 border-gray-100 gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
                      Total
                    </div>
                    <div className="font-display text-xl font-black text-[#A91314]">
                      ₹{Number(order.total).toFixed(2)}
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2.5 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-xs rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
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
