import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UtensilsCrossed, 
  Flame, 
  Sparkles, 
  Store, 
  Users, 
  ChefHat, 
  ShieldCheck, 
  ShoppingBag,
  BellRing
} from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const [outlets, setOutlets] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { login } = useAuth();
  const [demoLoginLoading, setDemoLoginLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const outletRes = await api.getOutlets();
        if (outletRes.success && outletRes.data) {
          setOutlets(outletRes.data);
          
          // Fetch full menu from the first outlet to extract popular featured items
          if (outletRes.data.length > 0) {
            const firstOutletMenu = await api.getOutletById(outletRes.data[0].id);
            if (firstOutletMenu.success && firstOutletMenu.data?.menuItems) {
              setFeaturedItems(firstOutletMenu.data.menuItems.slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickDemo = async (email, password) => {
    setDemoLoginLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoginLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#590004] via-[#590004] to-[#250001] text-white pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Playful background decorative shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#A91314]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FFB607]/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB607] text-[#250001] font-extrabold text-xs tracking-wider uppercase shadow-md">
              <Flame className="w-4 h-4 fill-current text-[#A91314]" />
              <span>Campus Food Pre-Ordering Platform</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Skip the Queue. <br />
              <span className="text-[#FFB607]">Order Ahead.</span> <br />
              Pick Up Between Classes.
            </h1>

            <p className="text-lg sm:text-xl text-[#FCECCB]/90 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Browse your campus canteens, order your favourite food before the rush, and collect it when it’s ready. Spend your break enjoying your food, not standing in line.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/outlets"
                className="w-full sm:w-auto px-8 py-4 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-display text-lg tracking-wide rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 border-2 border-[#ffc634]"
              >
                <span>Order Ahead</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <a
                href="#canteens"
                className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl backdrop-blur-xs transition-colors flex items-center justify-center gap-2 border border-white/20"
              >
                <span>Explore Campus Canteens</span>
              </a>
            </div>

            {/* Value bullets */}
            <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/15 text-left">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFB607] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-[#FCECCB]">Counter Pickup</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFB607] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-[#FCECCB]">Live Status Tracker</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFB607] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-[#FCECCB]">Zero Delivery Fee</span>
              </div>
            </div>

          </div>

          {/* Hero Right: Engaging Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border-4 border-[#FFB607] text-[#250001]">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#590004] text-[#FFB607] flex items-center justify-center font-bold">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#250001]">Central Food Court</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#A91314]" /> SAC Level 1 Counter 3
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase">
                  Open
                </span>
              </div>

              {/* Sample live order state preview */}
              <div className="my-5 p-4 rounded-2xl bg-[#FCECCB]/50 border border-[#FCECCB] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Order #EL-1049</span>
                  <span className="text-[#A91314] font-black uppercase">Kitchen Preparing</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FFB607] h-full w-2/3 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Pickup Counter Token:</span>
                  <span className="px-3 py-1 rounded-lg bg-[#590004] text-[#FFB607] font-mono font-black text-sm">
                    PIN 4291
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=120&auto=format&fit=crop&q=80" 
                      alt="Butter Masala Dosa"
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div>
                      <div className="font-bold text-xs text-gray-900">Butter Masala Dosa</div>
                      <div className="text-[11px] text-gray-500">Ready in ~8 mins</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-[#A91314]">₹65.00</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=120&auto=format&fit=crop&q=80" 
                      alt="Tandoori Paneer Roll"
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div>
                      <div className="font-bold text-xs text-gray-900">Tandoori Paneer Roll</div>
                      <div className="text-[11px] text-gray-500">Ready in ~8 mins</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-[#A91314]">₹75.00</span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  to="/outlets"
                  className="w-full py-3 bg-[#A91314] hover:bg-[#850003] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Canteen Menus</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* QUICK DEMO TEST BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-[#FFFDF9] rounded-2xl p-5 shadow-xl border border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#236092]/10 text-[#236092] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#250001]">Instant Demo Access</h4>
                <p className="text-xs text-gray-500">Test eatLays right away without signing up</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleQuickDemo('student@campus.edu', 'Student123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#FCECCB] hover:bg-[#fbd99c] text-[#250001] font-bold text-xs transition-colors border border-[#e8cda1]"
              >
                🎓 Student: Alex
              </button>

              <button
                onClick={() => handleQuickDemo('vendor.central@campus.edu', 'Vendor123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#A91314]/10 hover:bg-[#A91314]/20 text-[#A91314] font-bold text-xs transition-colors border border-[#A91314]/20"
              >
                🍳 Vendor: Central Canteen
              </button>

              <button
                onClick={() => handleQuickDemo('admin@campus.edu', 'Admin123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#236092]/10 hover:bg-[#236092]/20 text-[#236092] font-bold text-xs transition-colors border border-[#236092]/20"
              >
                🛡️ Campus Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A91314]/10 text-[#A91314] font-bold text-xs uppercase tracking-wider">
            Simple 4-Step Flow
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-[#250001]">
            How eatLays Works on Campus
          </h2>
          <p className="text-gray-600 text-base">
            No delivery drivers. No street addresses. Just smart pre-ordering tailored to college class schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative group hover:border-[#FFB607] hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#590004] text-[#FFB607] flex items-center justify-center font-display text-xl font-black mb-4">
              1
            </div>
            <h3 className="font-bold text-lg text-[#250001] mb-2">Pick Canteen</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Find campus food spots near your lecture hall or hostel quad with live operating hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative group hover:border-[#FFB607] hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#A91314] text-white flex items-center justify-center font-display text-xl font-black mb-4">
              2
            </div>
            <h3 className="font-bold text-lg text-[#250001] mb-2">Order Ahead</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Select dishes, customize special notes, and place your pre-order 10-15 minutes before your break.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative group hover:border-[#FFB607] hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#236092] text-white flex items-center justify-center font-display text-xl font-black mb-4">
              3
            </div>
            <h3 className="font-bold text-lg text-[#250001] mb-2">Track Status</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Watch real-time kitchen updates: Placed → Accepted → Preparing → Ready for Counter Pickup.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative group hover:border-[#FFB607] hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFB607] text-[#250001] flex items-center justify-center font-display text-xl font-black mb-4">
              4
            </div>
            <h3 className="font-bold text-lg text-[#250001] mb-2">Collect & Eat</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Flash your 4-digit token at the express pickup counter, grab your piping hot food, and enjoy!
            </p>
          </div>

        </div>
      </section>

      {/* CAMPUS CANTEENS / OUTLETS SECTION */}
      <section id="canteens" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-3xl font-black text-[#250001]">
              Campus Food Outlets
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Select an outlet to explore live menus and order ahead for counter pickup.
            </p>
          </div>
          <Link
            to="/outlets"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-[#A91314] hover:text-[#590004] transition-colors"
          >
            <span>View all outlets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#FFB607] transition-all flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={outlet.imageUrl}
                    alt={outlet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-black uppercase shadow ${
                        outlet.isOpen && outlet.acceptsOrders
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {outlet.isOpen && outlet.acceptsOrders ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[#250001] mb-1 group-hover:text-[#A91314] transition-colors">
                      {outlet.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-[#A91314] shrink-0" />
                      <span className="truncate">{outlet.location}</span>
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {outlet.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">
                      {outlet._count?.menuItems || 0} items available
                    </span>
                    <Link
                      to={`/outlets/${outlet.id}`}
                      className="px-3.5 py-1.5 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span>View Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* POPULAR CAMPUS BITES */}
      {featuredItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-[#FCECCB]/30 rounded-3xl p-8 border border-[#FCECCB]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#A91314]">
                  Campus Favourites
                </span>
                <h3 className="font-display text-2xl font-black text-[#250001]">
                  Popular Between-Class Bites
                </h3>
              </div>
              <Link
                to="/outlets"
                className="text-xs font-bold text-[#A91314] hover:underline"
              >
                Browse all food
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#FFB607] transition-colors"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-sm text-[#250001] leading-tight line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mb-2">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>~{item.prepTimeMinutes || 10} min prep</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="font-display text-base font-black text-[#A91314]">
                        ₹{Number(item.price).toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(item, outlets[0])}
                        className="px-3 py-1 bg-[#590004] hover:bg-[#850003] text-[#FFB607] font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Add</span>
                        <ShoppingBag className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STUDENT BENEFITS VS VENDOR BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* For Students */}
          <div className="bg-[#FFFDF9] rounded-3xl p-8 border-2 border-[#A91314]/20 shadow-md space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#A91314] text-white flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-black text-[#250001]">
              Why Students Love eatLays
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No more 20-minute lines:</strong> Order before lecture ends and pick up hot food right as your break begins.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Live preparation feedback:</strong> Check whether the kitchen has accepted and started your meal.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero delivery markup:</strong> Pay standard canteen prices without courier fees or packing charges.</span>
              </li>
            </ul>
          </div>

          {/* For Canteen Vendors */}
          <div className="bg-[#FFFDF9] rounded-3xl p-8 border-2 border-[#236092]/20 shadow-md space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#236092] text-white flex items-center justify-center font-bold">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-black text-[#250001]">
              Built for Campus Canteen Vendors
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Flatten the lunch rush:</strong> Receive pre-orders systematically instead of dealing with chaotic crowds.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Live menu & stock control:</strong> Mark sold-out items instantly or toggle rush-hour pre-orders with one tap.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Simple 4-digit token verification:</strong> Confirm pickup quickly and prevent order mix-ups at the counter.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-[#590004] to-[#A91314] rounded-3xl p-10 md:p-14 text-white text-center shadow-xl border-4 border-[#FFB607]">
          <h2 className="font-display text-3xl sm:text-4xl font-black mb-4">
            Ready to reclaim your lunch break?
          </h2>
          <p className="text-base sm:text-lg text-[#FCECCB] max-w-2xl mx-auto mb-8 font-medium">
            Join hundreds of campus students ordering meals ahead from Central Food Court, North Block Tuck, and Science Cafe.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/outlets"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-display text-base tracking-wide rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              Start Pre-Ordering Now
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-colors border border-white/20"
            >
              Create Free Student Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
