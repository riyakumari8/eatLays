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
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#19130F] shadow-[6px_6px_0px_#19130F] space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#19130F]">
            <ShoppingBag className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-black text-[#19130F]">
              Your Pre-Order Cart is Empty
            </h2>
            <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed font-semibold">
              Select your college canteen, choose your favorite meal or snacks, and order ahead so it's ready when class ends!
            </p>
          </div>
          <Link
            to="/outlets"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-sm rounded-2xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[1px_1px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <span>Explore Campus Canteens</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
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
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#19130F]">
            Pre-Order Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-bold mt-1">
            Review items before submitting your kitchen pre-order
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-black text-[#FF3D0A] hover:text-[#19130F] flex items-center gap-1.5 transition-colors bg-[#FFF0B8] hover:bg-[#FFE699] px-3.5 py-2 rounded-xl border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]"
        >
          <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Selected Outlet banner */}
          {outlet && (
            <div className="bg-[#FF7900] text-[#19130F] p-4 sm:p-5 rounded-3xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] flex items-center justify-center font-black shadow-[2px_2px_0px_#19130F]">
                  <Store className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#19130F] uppercase font-black tracking-wider">
                    Counter Pickup Outlet
                  </div>
                  <div className="font-display text-base font-black text-[#19130F]">
                    {outlet.name}
                  </div>
                  <div className="text-xs text-[#19130F] flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#FF3D0A] shrink-0 stroke-[2.5]" />
                    <span>{outlet.location}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/outlets/${outlet.id}`}
                className="text-xs font-black text-[#19130F] hover:underline bg-[#FFF0B8] px-3 py-1.5 rounded-xl border-2 border-[#19130F] shadow-[1.5px_1.5px_0px_#19130F]"
              >
                + Add more
              </Link>
            </div>
          )}

          {/* Items Container */}
          <div className="bg-white rounded-3xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] divide-y-2 divide-gray-100 overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-[#19130F]"
                  />
                  <div className="min-w-0">
                    <h4 className="font-display text-base font-black text-[#19130F] leading-tight truncate">
                      {item.name}
                    </h4>
                    <div className="text-xs text-gray-500 font-bold mt-1">
                      ₹{Number(item.price).toFixed(2)} each
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="flex items-center gap-1.5 bg-[#FFF0B8] text-[#19130F] rounded-xl px-2.5 py-1 border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-black/10 rounded-lg text-[#19130F]"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="font-mono font-black text-xs px-1 text-[#19130F]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-black/10 rounded-lg text-[#19130F]"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  </div>

                  <div className="text-right min-w-[65px]">
                    <div className="font-display text-base font-black text-[#FF3D0A]">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-gray-400 hover:text-[#FF3D0A] rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="text-xs text-gray-700 font-bold flex items-center gap-1.5 px-2">
            <Clock className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>Orders are freshly prepared by canteen staff upon acceptance.</span>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#19130F] shadow-[5px_5px_0px_#19130F] space-y-6 sticky top-24">
            <h3 className="font-display text-xl font-black text-[#19130F] pb-3 border-b-2 border-gray-100">
              Pickup Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-700 font-bold">
                <span>Items Subtotal ({itemCount})</span>
                <span className="font-black text-[#19130F]">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700 font-bold">
                <span>Delivery Charges</span>
                <span className="font-black text-emerald-600 uppercase text-xs">
                  ₹0.00 (Campus Pickup)
                </span>
              </div>

              <div className="flex justify-between text-gray-700 font-bold">
                <span>Express Counter Service</span>
                <span className="font-black text-emerald-600 uppercase text-xs">
                  Free
                </span>
              </div>

              <div className="pt-4 border-t-2 border-[#19130F] flex justify-between items-baseline">
                <span className="font-black text-sm text-[#19130F]">Authoritative Total</span>
                <span className="font-display text-2xl font-black text-[#FF3D0A]">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-[#FFF0B8] rounded-2xl p-4 border-2 border-[#19130F] text-xs text-gray-800 space-y-1">
              <div className="font-black text-[#19130F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
                <span>Pickup Instructions</span>
              </div>
              <p className="font-bold leading-relaxed">
                After placing your order, track preparation in real-time. Present your 4-digit token code at the counter to collect your food.
              </p>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-sm sm:text-base rounded-2xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[1px_1px_0px_#19130F] transition-all active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>{isAuthenticated ? 'Proceed to Confirmation' : 'Sign In to Order Ahead'}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            <div className="text-center">
              <Link
                to={outlet ? `/outlets/${outlet.id}` : '/outlets'}
                className="text-xs font-black text-gray-600 hover:text-[#FF3D0A] inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Continue adding food</span>
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
