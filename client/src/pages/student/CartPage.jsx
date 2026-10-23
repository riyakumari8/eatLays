import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Store, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';

export default function CartPage() {
  const { items, outlet, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#FCECCB] text-[#590004] flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-display text-3xl font-black text-[#250001] mb-2">
          Your Pre-Order Cart is Empty
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Select your college canteen, browse hot meals or snacks, and order ahead so your food is ready when your class ends!
        </p>
        <Link
          to="/outlets"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-display text-sm tracking-wide rounded-2xl shadow-md transition-transform hover:scale-105"
        >
          <span>Explore Campus Canteens</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-[#250001]">
            Pre-Order Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review items before submitting your kitchen pre-order
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-gray-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Selected Outlet banner */}
          {outlet && (
            <div className="bg-[#590004] text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFB607] text-[#250001] flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#FCECCB] uppercase font-bold tracking-wider">
                    Counter Pickup Outlet
                  </div>
                  <div className="font-bold text-sm text-white">
                    {outlet.name}
                  </div>
                  <div className="text-xs text-white/70 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FFB607]" />
                    <span>{outlet.location}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/outlets/${outlet.id}`}
                className="text-xs font-bold text-[#FFB607] hover:underline"
              >
                + Add more
              </Link>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-sm overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#250001] leading-tight">
                      {item.name}
                    </h4>
                    <div className="text-xs text-gray-500 mt-1">
                      ₹{Number(item.price).toFixed(2)} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#FCECCB]/60 rounded-xl px-2 py-1 border border-[#ebd8b1]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-[#250001] hover:bg-white/50 rounded-lg"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-xs px-1 text-[#250001]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-[#250001] hover:bg-white/50 rounded-lg"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <div className="font-display text-sm font-black text-[#A91314]">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1.5 px-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Orders are freshly prepared by canteen staff upon acceptance.</span>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-6 sticky top-24">
            <h3 className="font-display text-xl font-black text-[#250001] pb-3 border-b border-gray-100">
              Pickup Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal ({itemCount})</span>
                <span className="font-bold text-gray-800">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <span>Delivery Charges</span>
                </span>
                <span className="font-bold text-emerald-600 uppercase text-xs">
                  ₹0.00 (Campus Pickup)
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Express Counter Service</span>
                <span className="font-bold text-emerald-600 uppercase text-xs">
                  Free
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-bold text-base text-[#250001]">Authoritative Total</span>
                <span className="font-display text-2xl font-black text-[#A91314]">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-[#FCECCB]/40 rounded-2xl p-4 border border-[#FCECCB] text-xs text-gray-700 space-y-1.5">
              <div className="font-bold text-[#590004] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Pickup Instructions</span>
              </div>
              <p>
                After placing your order, track preparation in real-time. Present your 4-digit code at the canteen counter to collect your food.
              </p>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-display text-base tracking-wide rounded-2xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <span>{isAuthenticated ? 'Proceed to Confirmation' : 'Sign In to Order Ahead'}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="text-center">
              <Link
                to={outlet ? `/outlets/${outlet.id}` : '/outlets'}
                className="text-xs font-bold text-gray-500 hover:text-[#A91314] inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue adding food</span>
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
