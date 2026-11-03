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
  BellRing,
  Ticket
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
        <div className="w-16 h-16 rounded-3xl bg-[#FCECCB] text-[#590004] border-2 border-[#17130F] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#17130F]">
          <RefreshCw className="w-8 h-8 animate-spin text-[#A91314]" />
        </div>
        <p className="font-display font-black text-[#17130F]">Connecting to campus kitchen queue...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 border-2 border-[#17130F] shadow-[6px_6px_0px_#17130F] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FCECCB] text-[#A91314] border-2 border-[#17130F] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#17130F]">
            <AlertCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="font-display text-2xl font-black text-[#17130F]">Order Not Accessible</h2>
          <p className="text-gray-600 text-sm">{error || 'This order does not exist or you do not have permission to view it.'}</p>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5AD24] text-[#17130F] font-black rounded-xl text-sm border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F]"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Go to My Orders</span>
          </Link>
        </div>
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
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#17130F] hover:text-[#A91314] transition-colors mb-2 bg-white px-3 py-1.5 rounded-xl border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span>All My Orders</span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#17130F] flex items-center gap-2.5 mt-2">
            <span>Order #{order.orderNumber}</span>
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Placed on {new Date(order.placedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <button
          onClick={() => fetchOrder(false)}
          className="self-start sm:self-center px-3.5 py-2 bg-white hover:bg-gray-50 text-[#17130F] text-xs font-black rounded-xl border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
          title="Refresh current status"
        >
          <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Live Refreshed</span>
        </button>
      </div>

      {/* Prominent Pickup PIN Callout */}
      {!isCancelled && (
        <div className={`p-6 sm:p-8 rounded-3xl border-2 border-[#17130F] shadow-[6px_6px_0px_#17130F] flex flex-col sm:flex-row items-center justify-between gap-6 ${
          order.status === 'READY' 
            ? 'bg-emerald-400 text-[#17130F]' 
            : 'bg-[#590004] text-white'
        }`}>
          <div className="space-y-2 text-center sm:text-left">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] ${
              order.status === 'READY'
                ? 'bg-white text-[#17130F]'
                : 'bg-[#E5AD24] text-[#17130F]'
            }`}>
              {order.status === 'READY' ? (
                <>
                  <BellRing className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Order is Ready for Collection!</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Preparation in Progress</span>
                </>
              )}
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black">
              Collect at {order.outlet?.name}
            </h3>

            <p className={`text-xs flex items-center justify-center sm:justify-start gap-1 font-bold ${
              order.status === 'READY' ? 'text-gray-800' : 'text-[#FCECCB]'
            }`}>
              <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{order.outlet?.location}</span>
            </p>
          </div>

          <div className="bg-white text-[#17130F] px-7 py-5 rounded-3xl text-center shadow-[4px_4px_0px_#17130F] border-2 border-[#17130F] shrink-0">
            <span className="block text-[10px] uppercase font-black tracking-widest text-[#A91314]">
              Pickup Token Code
            </span>
            <span className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-[#17130F] my-1 block">
              {order.pickupCode}
            </span>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FCECCB] text-[10px] font-black text-[#590004] border border-[#17130F]">
              Show to counter staff
            </span>
          </div>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="bg-rose-100 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] p-6 rounded-3xl flex items-center gap-4 text-rose-950">
          <XCircle className="w-10 h-10 text-rose-700 shrink-0 stroke-[2.5]" />
          <div>
            <h3 className="font-display text-lg font-black">This Order Was Cancelled</h3>
            <p className="text-xs text-rose-800 mt-1 font-medium">
              The canteen was unable to fulfill this order. Any issues can be addressed directly at the counter.
            </p>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#17130F] shadow-[5px_5px_0px_#17130F] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-2 border-gray-100">
            <h3 className="font-display text-lg font-black text-[#17130F]">
              Kitchen Preparation Status
            </h3>
            <span className="text-xs font-bold text-gray-500">
              Live updates active
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-gray-200">
            {STEPS.map((step, index) => {
              const isPast = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;
              const isFuture = currentStepIndex < index;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Step Icon Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs transition-all border-2 border-[#17130F] ${
                      isPast
                        ? 'bg-emerald-400 text-[#17130F] shadow-[2px_2px_0px_#17130F]'
                        : isCurrent
                        ? 'bg-[#E5AD24] text-[#17130F] shadow-[3px_3px_0px_#17130F] scale-110'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 pl-2">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-black ${
                          isCurrent
                            ? 'text-[#A91314] text-base'
                            : isPast
                            ? 'text-[#17130F]'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E5AD24] text-[#17130F] text-[10px] font-black uppercase tracking-wider border border-[#17130F] shadow-[1.5px_1.5px_0px_#17130F] animate-pulse">
                          Active Now
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Item Snapshot Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#17130F] shadow-[5px_5px_0px_#17130F] space-y-4">
        <h3 className="font-display text-lg font-black text-[#17130F] pb-3 border-b-2 border-gray-100">
          Ordered Food Items
        </h3>

        <div className="divide-y-2 divide-gray-100">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#590004] text-[#E5AD24] font-black flex items-center justify-center text-xs border border-[#17130F]">
                  {item.quantity}×
                </span>
                <span className="font-black text-[#17130F]">
                  {item.itemNameSnapshot}
                </span>
              </div>
              <span className="font-mono font-black text-[#17130F]">
                ₹{Number(item.lineTotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div className="p-3 bg-[#FCECCB] rounded-xl text-xs text-gray-800 border-2 border-[#17130F] font-medium">
            <strong className="font-black text-[#590004]">Your Kitchen Note:</strong> {order.specialInstructions}
          </div>
        )}

        <div className="pt-4 border-t-2 border-[#17130F] flex justify-between items-baseline">
          <span className="font-black text-[#17130F]">Total Paid / Payable at Counter</span>
          <span className="font-display text-2xl font-black text-[#A91314]">
            ₹{Number(order.total).toFixed(2)}
          </span>
        </div>
      </div>

    </div>
  );
}
