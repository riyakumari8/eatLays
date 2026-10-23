import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Search, 
  Check, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function OutletMenuPage() {
  const { id } = useParams();
  const [outlet, setOutlet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { items: cartItems, addToCart, updateQuantity, subtotal, itemCount, outlet: cartOutlet } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(false);
      try {
        const res = await api.getOutletById(id);
        if (res.success && res.data) {
          setOutlet(res.data);
        }
      } catch (err) {
        console.error('Error fetching outlet menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-64 bg-gray-200 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="font-display text-2xl text-[#250001] mb-2">Campus Outlet Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">The canteen you are looking for may have moved or is temporarily unavailable.</p>
        <Link
          to="/outlets"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A91314] text-white font-bold rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Canteens</span>
        </Link>
      </div>
    );
  }

  const isAcceptingOrders = outlet.isOpen && outlet.acceptsOrders;

  // Filter items
  const filteredItems = (outlet.menuItems || []).filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getItemCartQuantity = (itemId) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28">
      
      {/* Back button */}
      <div>
        <Link
          to="/outlets"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#A91314] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all canteens</span>
        </Link>
      </div>

      {/* Outlet Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-gray-100 bg-[#250001] text-white">
        <div className="absolute inset-0">
          <img
            src={outlet.imageUrl}
            alt={outlet.name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#250001] via-[#250001]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isAcceptingOrders
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {isAcceptingOrders ? 'Accepting Pre-Orders' : 'Currently Closed'}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-[#FCECCB] text-xs font-bold backdrop-blur-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FFB607]" />
                <span>Express Counter Pickup</span>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-white">
              {outlet.name}
            </h1>

            <p className="text-sm text-[#FCECCB]/90 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#FFB607] shrink-0" />
              <span>{outlet.location}</span>
            </p>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {outlet.description}
            </p>
          </div>

          <div className="bg-[#FFFDF9]/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center min-w-[180px]">
            <div className="text-2xl font-black text-[#FFB607] font-display">
              {outlet.menuItems?.length || 0}
            </div>
            <div className="text-xs text-white/80 font-bold uppercase tracking-wider">
              Dishes Available
            </div>
          </div>
        </div>
      </div>

      {/* Warning if outlet is not accepting orders */}
      {!isAcceptingOrders && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs sm:text-sm text-rose-800 font-semibold">
            This canteen is not currently taking orders. You can browse the menu, but placing orders is temporarily paused.
          </p>
        </div>
      )}

      {/* Search & Categories Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items in this menu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB607] text-sm bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-[#590004] text-[#FFB607] shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            All Items ({outlet.menuItems?.length || 0})
          </button>

          {outlet.categories && outlet.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#590004] text-[#FFB607] shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const qtyInCart = getItemCartQuantity(item.id);
          const isItemAvailable = item.isAvailable && isAcceptingOrders;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden border shadow-sm flex flex-col justify-between transition-all ${
                isItemAvailable
                  ? 'border-gray-200 hover:border-[#FFB607] hover:shadow-md'
                  : 'border-gray-200 opacity-60 bg-gray-50/50'
              }`}
            >
              {/* Item Image */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase">
                      Sold Out
                    </span>
                  </div>
                )}
                {item.prepTimeMinutes && (
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#FFB607]" />
                    <span>~{item.prepTimeMinutes} mins prep</span>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-[#250001] leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Cart Controls */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-display text-lg font-black text-[#A91314]">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    {!isItemAvailable ? (
                      <span className="text-xs font-bold text-gray-400">Unavailable</span>
                    ) : qtyInCart > 0 ? (
                      <div className="flex items-center gap-2 bg-[#590004] text-[#FFB607] rounded-xl px-2 py-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, qtyInCart - 1)}
                          className="p-1 hover:bg-white/10 rounded-lg active:scale-90 transition-transform"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-xs px-1 text-white">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, qtyInCart + 1)}
                          className="p-1 hover:bg-white/10 rounded-lg active:scale-90 transition-transform"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item, outlet)}
                        className="px-4 py-2 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-sm">No items match your filter.</p>
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {itemCount > 0 && cartOutlet?.id === outlet.id && (
        <div className="fixed bottom-4 left-0 right-0 z-30 px-4 sm:px-6 max-w-3xl mx-auto animate-slideUp">
          <div className="bg-[#590004] text-white rounded-2xl p-4 shadow-2xl border-2 border-[#FFB607] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB607] text-[#250001] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#FCECCB]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in pre-order cart
                </div>
                <div className="font-display text-lg font-black text-white">
                  ₹{subtotal.toFixed(2)}
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="px-5 py-2.5 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
