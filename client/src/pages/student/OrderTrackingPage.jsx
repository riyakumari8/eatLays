import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Store, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  ChefHat, 
  Check, 
  XCircle,
  BellRing
} from 'lucide-react';

const STEPS = [
  { key: 'PLACED', label: 'Order Placed', desc: 'Received by outlet system' },
  { key: 'ACCEPTED', label: 'Order Accepted', desc: 'Kitchen acknowledged order' },
  { key: 'PREPARING', label: 'Cooking & Packing', desc: 'Dishes are on the stove' },
  { key: 'READY', label: 'Ready for Pickup', desc: 'Waiting at the express counter' },
  { key: 'COMPLETED', label: 'Collected', desc: 'Picked up by student' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchOrder = async (isPolling = false) => {
    try {
      const res = await api.getOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      if (!isPolling) {
        setError(err.message || 'Failed to load order details.');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(false);

    // Auto-polling every 4 seconds for live kitchen updates
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-10 h-10 animate-spin text-[#A91314] mx-auto mb-4" />
        <p className="font-semibold text-gray-700">Connecting to campus kitchen queue...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="font-display text-2xl text-[#250001] mb-2">Order Not Accessible</h2>
        <p className="text-gray-600 text-sm mb-6">{error || 'This order does not exist or you do not have permission to view it.'}</p>
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A91314] text-white font-bold rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to My Orders</span>
        </Link>
      </div>
    );
  }

  // Calculate current step index
  const isCancelled = order.status === 'CANCELLED';
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#A91314] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All My Orders</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-[#250001] flex items-center gap-2.5">
            <span>Order #{order.orderNumber}</span>
          </h1>
          <p className="text-xs text-gray-500">
            Placed on {new Date(order.placedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <button
          onClick={() => fetchOrder(false)}
          className="self-start sm:self-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          title="Refresh current status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Live Refreshed</span>
        </button>
      </div>

      {/* Prominent Pickup PIN Callout */}
      {!isCancelled && (
        <div className={`p-6 rounded-3xl border-2 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 ${
          order.status === 'READY' 
            ? 'bg-emerald-500 text-white border-emerald-400 animate-bounceOnce' 
            : 'bg-[#590004] text-white border-[#FFB607]'
        }`}>
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              {order.status === 'READY' ? (
                <>
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Order is Ready for Collection!</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-[#FFB607]" />
                  <span>Preparation in Progress</span>
                </>
              )}
            </div>
            <h3 className="font-display text-2xl font-black">
              Collect at {order.outlet?.name}
            </h3>
            <p className="text-xs text-white/80 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FFB607]" />
              <span>{order.outlet?.location}</span>
            </p>
          </div>

          <div className="bg-[#FFFDF9] text-[#250001] px-6 py-4 rounded-2xl text-center shadow-md border-2 border-[#FFB607] shrink-0">
            <span className="block text-[10px] uppercase font-black tracking-widest text-[#A91314]">
              Pickup Token Code
            </span>
            <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-[#250001]">
              {order.pickupCode}
            </span>
            <span className="block text-[10px] text-gray-500 font-bold mt-0.5">
              Show to counter staff
            </span>
          </div>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="bg-rose-50 border-2 border-rose-400 p-6 rounded-3xl flex items-center gap-4 text-rose-900">
          <XCircle className="w-10 h-10 text-rose-600 shrink-0" />
          <div>
            <h3 className="font-bold text-base">This Order Was Cancelled</h3>
            <p className="text-xs text-rose-700 mt-1">
              The canteen was unable to fulfill this order. Any issues can be addressed directly at the counter.
            </p>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-display text-lg font-black text-[#250001]">
            Kitchen Preparation Status
          </h3>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {STEPS.map((step, index) => {
              const isPast = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;
              const isFuture = currentStepIndex < index;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Step Icon Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#FFB607] text-[#250001] ring-4 ring-[#FFB607]/30'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-[#A91314] font-black'
                            : isPast
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FFB607]/20 text-[#590004] text-[10px] font-black uppercase tracking-wider animate-pulse">
                          Active Now
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Item Snapshot Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-display text-lg font-black text-[#250001] pb-3 border-b border-gray-100">
          Ordered Food Items
        </h3>

        <div className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#FCECCB] text-[#590004] font-bold flex items-center justify-center text-xs">
                  {item.quantity}×
                </span>
                <span className="font-bold text-gray-800">
                  {item.itemNameSnapshot}
                </span>
              </div>
              <span className="font-mono font-bold text-gray-900">
                ₹{Number(item.lineTotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100">
            <strong>Your Kitchen Note:</strong> {order.specialInstructions}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
          <span className="font-bold text-gray-700">Total Paid / Payable at Counter</span>
          <span className="font-display text-2xl font-black text-[#A91314]">
            ₹{Number(order.total).toFixed(2)}
          </span>
        </div>
      </div>

    </div>
  );
}
