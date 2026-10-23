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
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="font-display text-2xl text-[#250001] mb-2">No Active Order</h2>
        <p className="text-gray-500 text-sm mb-6">Your cart is currently empty. Please select food items to order ahead.</p>
        <Link
          to="/outlets"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A91314] text-white font-bold rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Canteens</span>
        </Link>
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
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#A91314] transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="font-display text-3xl font-black text-[#250001]">
          Confirm Pickup Pre-Order
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review counter pickup details and submit order to the kitchen.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Order Submission Failed</h4>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Outlet, Student & Notes */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Pickup Outlet Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#590004] text-[#FFB607] flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-[#A91314] tracking-wider">
                  Pickup Counter
                </span>
                <h3 className="font-display text-xl font-black text-[#250001]">
                  {outlet.name}
                </h3>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-2.5 text-xs text-gray-700">
              <MapPin className="w-4 h-4 text-[#A91314] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-gray-900">Counter Location:</strong>
                <span>{outlet.location}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Prepared fresh upon order confirmation.</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#250001] uppercase tracking-wider">
              Student Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Name</span>
                <span className="font-bold text-gray-800 text-sm">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block">College Email</span>
                <span className="font-bold text-gray-800 text-sm truncate block">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions Input */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-2">
            <label className="block font-bold text-sm text-[#250001]">
              Kitchen Notes / Special Requests (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="E.g., extra spicy, no onions, keep chutney separate..."
              className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB607] focus:ring-2 focus:ring-[#FFB607]/20 text-xs sm:text-sm resize-none"
            />
            <div className="text-right text-[11px] text-gray-400">
              {specialInstructions.length}/200 characters
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border-2 border-[#FFB607] shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB607] text-[#250001] flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#250001]">Pay at Counter upon Pickup</h4>
                <p className="text-xs text-gray-500">Fast express verification</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              No online payment gateway needed! Pay via <strong>UPI (GPay / PhonePe / Paytm)</strong>, <strong>Campus Meal Card</strong>, or <strong>Cash</strong> when collecting your food at the counter.
            </p>
          </div>

        </div>

        {/* Right Column: Order Items Summary & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-5 sticky top-24">
            <h3 className="font-display text-xl font-black text-[#250001] pb-3 border-b border-gray-100">
              Order Items ({items.length})
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#FCECCB] text-[#590004] font-bold flex items-center justify-center text-[10px]">
                      {item.quantity}×
                    </span>
                    <span className="font-bold text-gray-800 truncate max-w-[170px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-gray-900">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Pickup Fee</span>
                <span className="text-emerald-600 font-bold uppercase">₹0.00</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#250001]">Total Payable</span>
                <span className="font-display text-2xl font-black text-[#A91314]">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-display text-base tracking-wide rounded-2xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Pre-Order...</span>
                </>
              ) : (
                <>
                  <span>Place Pickup Order</span>
                  <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-gray-400">
              By placing this order, you confirm you will pick up your meal at {outlet.name}.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
