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
  ArrowRight,
  Utensils
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
      setLoading(true);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-64 bg-gray-200 rounded-3xl animate-pulse border-2 border-gray-300" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-3xl animate-pulse border-2 border-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#FCECCB] text-[#590004] border-2 border-[#17130F] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#17130F]">
          <AlertCircle className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="font-display text-2xl font-black text-[#17130F] mb-2">Campus Outlet Not Found</h2>
        <p className="text-gray-600 text-sm mb-6">The canteen you are looking for may have moved or is temporarily unavailable.</p>
        <Link
          to="/outlets"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5AD24] text-[#17130F] font-black rounded-xl text-sm border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      
      {/* Back button */}
      <div>
        <Link
          to="/outlets"
          className="inline-flex items-center gap-2 text-xs font-black text-[#17130F] hover:text-[#A91314] transition-colors bg-white px-3 py-1.5 rounded-xl border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
          <span>Back to All Canteens</span>
        </Link>
      </div>

      {/* Outlet Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#17130F] shadow-[6px_6px_0px_#17130F] bg-[#590004] text-white">
        <div className="absolute inset-0">
          <img
            src={outlet.imageUrl}
            alt={outlet.name}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#590004] via-[#590004]/85 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] ${
                  isAcceptingOrders
                    ? 'bg-emerald-400 text-[#17130F]'
                    : 'bg-rose-400 text-[#17130F]'
                }`}
              >
                {isAcceptingOrders ? 'Accepting Pre-Orders' : 'Currently Closed'}
              </span>

              <span className="px-3 py-1 rounded-full bg-[#E5AD24] text-[#17130F] text-xs font-black border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Express Counter Pickup</span>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-white drop-shadow-sm">
              {outlet.name}
            </h1>

            <p className="text-sm text-[#FCECCB] flex items-center gap-1.5 font-bold">
              <MapPin className="w-4 h-4 text-[#E5AD24] shrink-0 stroke-[2.5]" />
              <span>{outlet.location}</span>
            </p>

            <p className="text-xs sm:text-sm text-[#FCECCB]/90 leading-relaxed font-medium">
              {outlet.description}
            </p>
          </div>

          <div className="bg-[#17130F] p-4 rounded-2xl border-2 border-[#E5AD24] shadow-[4px_4px_0px_#E5AD24] text-center min-w-[170px]">
            <div className="text-3xl font-black text-[#E5AD24] font-display">
              {outlet.menuItems?.length || 0}
            </div>
            <div className="text-[11px] text-[#FCECCB] font-black uppercase tracking-wider mt-0.5">
              Dishes on Menu
            </div>
          </div>
        </div>
      </div>

      {/* Warning if outlet is not accepting orders */}
      {!isAcceptingOrders && (
        <div className="bg-[#FCECCB] border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#A91314] shrink-0 stroke-[2.5]" />
          <p className="text-xs sm:text-sm text-[#17130F] font-bold">
            This canteen is not currently taking orders. You can browse the menu, but placing orders is temporarily paused.
          </p>
        </div>
      )}

      {/* Search & Categories Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items in this menu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#17130F] ${
              selectedCategory === 'ALL'
                ? 'bg-[#E5AD24] text-[#17130F] shadow-[3px_3px_0px_#17130F]'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#17130F]'
            }`}
          >
            All Items ({outlet.menuItems?.length || 0})
          </button>

          {outlet.categories && outlet.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border-2 border-[#17130F] ${
                selectedCategory === cat.id
                  ? 'bg-[#E5AD24] text-[#17130F] shadow-[3px_3px_0px_#17130F]'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#17130F]'
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
              className={`bg-white rounded-3xl overflow-hidden border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[7px_7px_0px_#17130F] hover:-translate-x-0.5 hover:-translate-y-0.5 flex flex-col justify-between transition-all ${
                !isItemAvailable ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              {/* Item Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden border-b-2 border-[#17130F]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-[#17130F]/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#A91314] text-white text-xs font-black uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_#17130F]">
                      Sold Out
                    </span>
                  </div>
                )}
                {item.prepTimeMinutes && (
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#17130F]/85 backdrop-blur-xs text-[#FCECCB] text-[11px] font-black flex items-center gap-1 border border-white/20">
                    <Clock className="w-3 h-3 text-[#E5AD24]" />
                    <span>~{item.prepTimeMinutes} mins prep</span>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-display text-lg font-black text-[#17130F] leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Price and Cart Controls */}
                <div className="pt-3 border-t-2 border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="font-display text-xl font-black text-[#A91314]">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    {!isItemAvailable ? (
                      <span className="text-xs font-black text-gray-400">Unavailable</span>
                    ) : qtyInCart > 0 ? (
                      <div className="flex items-center gap-2 bg-[#590004] text-[#E5AD24] rounded-xl px-2.5 py-1 border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                        <button
                          onClick={() => updateQuantity(item.id, qtyInCart - 1)}
                          className="p-1 hover:bg-white/10 rounded-lg active:scale-90 transition-transform"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <span className="font-mono font-black text-xs px-1 text-white">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, qtyInCart + 1)}
                          className="p-1 hover:bg-white/10 rounded-lg active:scale-90 transition-transform"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item, outlet)}
                        className="px-4 py-2 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-xs rounded-xl border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
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
        <div className="text-center py-12 bg-white rounded-3xl border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] p-6 max-w-md mx-auto">
          <p className="text-gray-600 font-bold text-sm">No items match your filter.</p>
        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {itemCount > 0 && cartOutlet?.id === outlet.id && (
        <div className="fixed bottom-5 left-0 right-0 z-30 px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="bg-[#590004] text-white rounded-3xl p-4 sm:p-5 shadow-[6px_6px_0px_#17130F] border-3 border-[#E5AD24] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E5AD24] text-[#17130F] border-2 border-[#17130F] flex items-center justify-center font-black shadow-[2px_2px_0px_#17130F]">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs text-[#FCECCB] font-bold">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in pre-order cart
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-white">
                  ₹{subtotal.toFixed(2)}
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="px-5 py-3 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-xs sm:text-sm rounded-2xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] flex items-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5 shrink-0"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
