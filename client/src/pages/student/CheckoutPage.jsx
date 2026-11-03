import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Store, 
  MapPin, 
  Clock, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  ArrowLeft,
  ShieldCheck,
  Coins
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, outlet, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0 || !outlet) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 border-2 border-[#17130F] shadow-[6px_6px_0px_#17130F] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FCECCB] text-[#590004] border-2 border-[#17130F] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#17130F]">
            <AlertCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="font-display text-2xl font-black text-[#17130F]">No Active Order</h2>
          <p className="text-gray-600 text-sm max-w-sm mx-auto">Your cart is currently empty. Please select food items to order ahead.</p>
          <Link
            to="/outlets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5AD24] text-[#17130F] font-black rounded-xl text-sm border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F]"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Browse Canteens</span>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const orderPayload = {
        outletId: outlet.id,
        specialInstructions: specialInstructions.trim() || undefined,
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
      };

      const response = await api.createOrder(orderPayload);
      if (response.success && response.data) {
        clearCart();
        navigate(`/orders/${response.data.id}`);
      } else {
        throw new Error(response.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-black text-[#17130F] hover:text-[#A91314] transition-colors mb-3 bg-white px-3 py-1.5 rounded-xl border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-[#17130F]">
          Confirm Pickup Pre-Order
        </h1>
        <p className="text-sm text-gray-600 font-medium mt-1">
          Review counter pickup details and submit your order directly to the kitchen queue.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border-2 border-rose-500 p-4 rounded-2xl flex items-start gap-3 shadow-[3px_3px_0px_#17130F]">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Order Submission Failed</h4>
            <p className="text-xs text-rose-700 mt-0.5 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Outlet, Student & Notes */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Pickup Outlet Box */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#590004] text-[#E5AD24] border-2 border-[#17130F] flex items-center justify-center font-black shadow-[2px_2px_0px_#17130F]">
                <Store className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-[#A91314] tracking-wider">
                  Pickup Counter
                </span>
                <h3 className="font-display text-xl font-black text-[#17130F]">
                  {outlet.name}
                </h3>
              </div>
            </div>

            <div className="p-3.5 bg-[#FCECCB]/50 rounded-2xl border-2 border-[#17130F] flex items-start gap-2.5 text-xs text-gray-800 font-medium">
              <MapPin className="w-4 h-4 text-[#A91314] shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <strong className="block text-[#17130F] font-black">Counter Location:</strong>
                <span>{outlet.location}</span>
              </div>
            </div>

            <div className="text-xs text-gray-600 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Prepared fresh upon kitchen confirmation.</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] space-y-3">
            <h3 className="font-display text-sm font-black text-[#17130F] uppercase tracking-wider">
              Student Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 font-bold block">Name</span>
                <span className="font-black text-[#17130F] text-sm">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold block">College Email</span>
                <span className="font-black text-[#17130F] text-sm truncate block">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions Input */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] space-y-2">
            <label className="block font-black text-sm text-[#17130F]">
              Kitchen Notes / Special Requests (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="E.g., extra spicy, no onions, keep sauce separate..."
              className="w-full p-3.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-xs sm:text-sm font-medium resize-none"
            />
            <div className="text-right text-[11px] text-gray-500 font-bold">
              {specialInstructions.length}/200 characters
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-[#FCECCB] rounded-3xl p-6 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5AD24] text-[#17130F] border-2 border-[#17130F] flex items-center justify-center font-black shadow-[2px_2px_0px_#17130F]">
                <Coins className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-display text-base font-black text-[#17130F]">Pay at Counter upon Pickup</h4>
                <p className="text-xs text-gray-700 font-semibold">Fast express verification</p>
              </div>
            </div>
            <p className="text-xs text-gray-800 leading-relaxed font-medium">
              No online payment gateway needed! Pay via <strong>UPI (GPay / PhonePe / Paytm)</strong>, <strong>Campus Meal Card</strong>, or <strong>Cash</strong> when collecting your food at the counter.
            </p>
          </div>

        </div>

        {/* Right Column: Order Items Summary & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#17130F] shadow-[5px_5px_0px_#17130F] space-y-5 sticky top-24">
            <h3 className="font-display text-xl font-black text-[#17130F] pb-3 border-b-2 border-gray-100">
              Order Items ({items.length})
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#590004] text-[#E5AD24] font-black flex items-center justify-center text-[10px] border border-[#17130F]">
                      {item.quantity}×
                    </span>
                    <span className="font-bold text-gray-800 truncate max-w-[170px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-black text-gray-900">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-[#17130F] space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 font-semibold">
                <span>Subtotal</span>
                <span className="font-black text-[#17130F]">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-semibold">
                <span>Pickup Fee</span>
                <span className="text-emerald-600 font-black uppercase">₹0.00</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-black text-sm text-[#17130F]">Total Payable</span>
                <span className="font-display text-2xl font-black text-[#A91314]">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-base rounded-2xl border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
                  <span>Submitting Pre-Order...</span>
                </>
              ) : (
                <>
                  <span>Place Pickup Order</span>
                  <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-gray-500 font-medium">
              By placing this order, you confirm you will pick up your meal at {outlet.name}.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
