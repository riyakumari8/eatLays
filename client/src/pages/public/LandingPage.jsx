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
  BellRing,
  GraduationCap,
  Search,
  Check,
  CreditCard,
  QrCode
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
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* HERO SECTION — VIBRANT MUSTARD & MAROON RETRO-COMIC AESTHETIC */}
      <section className="relative overflow-hidden bg-[#E5AD24] border-b-4 border-[#17130F] pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle retro dot pattern overlay */}
        <div className="absolute inset-0 bg-halftone-subtle opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#590004] text-[#FCECCB] font-extrabold text-xs tracking-wider uppercase border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F]">
              <Flame className="w-4 h-4 text-[#E5AD24]" />
              <span>Campus Food Pre-Ordering Platform</span>
            </div>

            {/* Primary Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-[#17130F]">
              Skip the Queue. <br />
              <span className="text-[#590004] drop-shadow-[2px_2px_0px_#FCECCB]">Order Ahead.</span> <br />
              Pick Up Between Classes.
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg md:text-xl text-[#250001] font-semibold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Browse your campus canteens, order your favourite food before the rush, and collect it when it’s ready. Spend your break enjoying your food, not standing in line.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/outlets"
                className="w-full sm:w-auto px-8 py-4 bg-[#590004] hover:bg-[#3F0002] text-[#FCECCB] font-display text-lg tracking-wide rounded-2xl border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[6px_6px_0px_#17130F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all flex items-center justify-center gap-2.5"
              >
                <span>Order Ahead</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] text-[#E5AD24]" />
              </Link>

              <a
                href="#canteens"
                className="w-full sm:w-auto px-7 py-4 bg-[#FFFFFF] hover:bg-[#FCECCB] text-[#17130F] font-bold text-base rounded-2xl border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[6px_6px_0px_#17130F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Campus Canteens</span>
              </a>
            </div>

            {/* Value bullets */}
            <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t-2 border-[#17130F]/20 text-left">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#590004] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-bold text-[#17130F]">Counter Pickup Only</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#590004] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-bold text-[#17130F]">Live Queue Tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#590004] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-bold text-[#17130F]">Zero Delivery Fee</span>
              </div>
            </div>

          </div>

          {/* Hero Right: Engaging Retro Comic Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-[26px] p-6 border-3 border-[#17130F] shadow-[7px_7px_0px_#17130F] text-[#17130F]">
              
              {/* Outlet Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#590004] text-[#E5AD24] flex items-center justify-center font-bold border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-black text-[#17130F]">Central Food Court</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#A91314]" /> SAC Level 1 Counter 3
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase border-2 border-emerald-600 shadow-[1.5px_1.5px_0px_#17130F]">
                  Open
                </span>
              </div>

              {/* Sample live order state preview */}
              <div className="my-5 p-4 rounded-2xl bg-[#FCECCB] border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-[#17130F]">
                  <span>Order #EL-1049</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#A91314] text-white text-[10px] uppercase font-black tracking-wider">
                    Kitchen Preparing
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#17130F]">
                  <div className="bg-[#E5AD24] h-full w-3/4 rounded-full" />
                </div>
                
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#250001] font-bold">Counter Pickup Token:</span>
                  <span className="px-3 py-1 rounded-xl bg-[#590004] text-[#E5AD24] font-mono font-black text-sm border-2 border-[#17130F] shadow-[1.5px_1.5px_0px_#17130F]">
                    PIN 4291
                  </span>
                </div>
              </div>

              {/* Sample items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=120&auto=format&fit=crop&q=80" 
                      alt="Butter Masala Dosa"
                      className="w-12 h-12 rounded-xl object-cover border border-[#17130F]" 
                    />
                    <div>
                      <div className="font-bold text-xs text-[#17130F]">Butter Masala Dosa</div>
                      <div className="text-[11px] text-gray-500 font-medium">Ready in ~8 mins</div>
                    </div>
                  </div>
                  <span className="font-display text-sm font-black text-[#A91314]">₹65.00</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=120&auto=format&fit=crop&q=80" 
                      alt="Tandoori Paneer Roll"
                      className="w-12 h-12 rounded-xl object-cover border border-[#17130F]" 
                    />
                    <div>
                      <div className="font-bold text-xs text-[#17130F]">Tandoori Paneer Roll</div>
                      <div className="text-[11px] text-gray-500 font-medium">Ready in ~8 mins</div>
                    </div>
                  </div>
                  <span className="font-display text-sm font-black text-[#A91314]">₹75.00</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5">
                <Link
                  to="/outlets"
                  className="w-full py-3 bg-[#E5AD24] hover:bg-[#D49D18] text-[#17130F] font-display text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Browse Canteen Menus</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* QUICK DEMO TEST BAR — CLEAN & ACCESSIBLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#17130F] shadow-[5px_5px_0px_#17130F]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#E5AD24] text-[#17130F] flex items-center justify-center font-bold border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-black text-[#17130F]">1-Click Demo Evaluation</h4>
                <p className="text-xs text-gray-600 font-medium">Instant session access without manual registration</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => handleQuickDemo('student@campus.edu', 'Student123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#FCECCB] hover:bg-[#E5AD24] text-[#17130F] font-bold text-xs transition-all border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-[#A91314]" />
                <span>Student (Alex)</span>
              </button>

              <button
                onClick={() => handleQuickDemo('vendor.central@campus.edu', 'Vendor123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#FCECCB] hover:bg-[#E5AD24] text-[#17130F] font-bold text-xs transition-all border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-[#590004]" />
                <span>Vendor (Central)</span>
              </button>

              <button
                onClick={() => handleQuickDemo('admin@campus.edu', 'Admin123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#FCECCB] hover:bg-[#E5AD24] text-[#17130F] font-bold text-xs transition-all border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#A91314]" />
                <span>Campus Admin</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DISTINCTIVE 5-STEP STUDENT JOURNEY — THE SPECIFIED CORE WORKFLOW */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF7] rounded-[32px] p-6 sm:p-12 border-3 border-[#17130F] shadow-[7px_7px_0px_#17130F] space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E5AD24] text-[#17130F] text-xs font-black uppercase tracking-wider border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
              <span>How eatLays Works</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#17130F]">
              The 5-Step Campus Student Journey
            </h2>
            <p className="text-gray-700 text-sm sm:text-base font-semibold">
              Browse Canteen → Choose Food → Place Order → Track Preparation → Collect at Counter.
            </p>
          </div>

          {/* 5 Distinctive Journey Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            
            {/* Step 01 */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[6px_6px_0px_#17130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#590004] text-white flex items-center justify-center font-display font-black text-base border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                    01
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FCECCB] border border-[#17130F] rounded-md text-[#590004]">
                    Discover
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#17130F] leading-snug">
                  1. Browse a Canteen
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Find outlets near your department block or hostel concourse with real operating hours.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#590004]">
                <MapPin className="w-3.5 h-3.5 text-[#A91314]" />
                <span>Campus block locator</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[6px_6px_0px_#17130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#E5AD24] text-[#17130F] flex items-center justify-center font-display font-black text-base border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                    02
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FCECCB] border border-[#17130F] rounded-md text-[#17130F]">
                    Select
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#17130F] leading-snug">
                  2. Choose Your Food
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Explore full canteen menus, prices, prep times, and select fresh hot items into your pre-order cart.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#17130F]">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#E5AD24]" />
                <span>Live prices & stock</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[6px_6px_0px_#17130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#A91314] text-white flex items-center justify-center font-display font-black text-base border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                    03
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FCECCB] border border-[#17130F] rounded-md text-[#A91314]">
                    Pre-Order
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#17130F] leading-snug">
                  3. Place Your Order
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Submit order before your break starts. Add optional kitchen notes like extra chutney or spice level.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#A91314]">
                <Clock className="w-3.5 h-3.5 text-[#A91314]" />
                <span>Ahead of break rush</span>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[6px_6px_0px_#17130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#250001] text-[#E5AD24] flex items-center justify-center font-display font-black text-base border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                    04
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FCECCB] border border-[#17130F] rounded-md text-[#250001]">
                    Queue Live
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#17130F] leading-snug">
                  4. Track Preparation
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Watch kitchen updates in real time: Placed → Accepted → Cooking → Ready for Pickup.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#250001]">
                <BellRing className="w-3.5 h-3.5 text-[#E5AD24]" />
                <span>Real-time polling</span>
              </div>
            </div>

            {/* Step 05 */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[6px_6px_0px_#17130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#E5AD24] text-[#17130F] flex items-center justify-center font-display font-black text-base border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                    05
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 border border-[#17130F] rounded-md text-emerald-800">
                    Fast Pass
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#17130F] leading-snug">
                  5. Collect at Counter
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Bypass the long queue! Show your 4-digit pickup PIN at the express counter and grab your food hot.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero queue waiting</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CAMPUS CANTEENS / OUTLETS SECTION */}
      <section id="canteens" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5AD24] text-[#17130F] text-xs font-black uppercase tracking-wider border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Campus Locations</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#17130F]">
              Campus Food Outlets
            </h2>
            <p className="text-gray-600 text-sm mt-1 font-medium">
              Select an outlet to explore live menus and order ahead for counter pickup.
            </p>
          </div>
          
          <Link
            to="/outlets"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-[#A91314] hover:text-[#590004] transition-colors"
          >
            <span>View all campus canteens</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border-2 border-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                className="bg-white rounded-2xl overflow-hidden border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] hover:shadow-[7px_7px_0px_#17130F] hover:-translate-y-1 transition-all flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100 border-b-2 border-[#17130F]">
                  <img
                    src={outlet.imageUrl}
                    alt={outlet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] ${
                        outlet.isOpen && outlet.acceptsOrders
                          ? 'bg-emerald-400 text-[#17130F]'
                          : 'bg-rose-400 text-white'
                      }`}
                    >
                      {outlet.isOpen && outlet.acceptsOrders ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-black text-[#17130F] mb-1 group-hover:text-[#A91314] transition-colors">
                      {outlet.name}
                    </h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mb-2 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#A91314] shrink-0" />
                      <span className="truncate">{outlet.location}</span>
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-medium">
                      {outlet.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">
                      {outlet._count?.menuItems || 0} items available
                    </span>
                    <Link
                      to={`/outlets/${outlet.id}`}
                      className="px-4 py-2 bg-[#E5AD24] hover:bg-[#D49D18] text-[#17130F] font-bold text-xs rounded-xl border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all flex items-center gap-1"
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FCECCB] rounded-[28px] p-6 sm:p-8 border-3 border-[#17130F] shadow-[6px_6px_0px_#17130F]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#A91314] px-2.5 py-0.5 bg-white border border-[#17130F] rounded-md inline-block mb-1">
                  Campus Favourites
                </span>
                <h3 className="font-display text-2xl font-black text-[#17130F]">
                  Popular Between-Class Bites
                </h3>
              </div>
              <Link
                to="/outlets"
                className="text-xs font-extrabold text-[#590004] hover:text-[#A91314] hover:underline"
              >
                Browse all food & menus →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border-2 border-[#17130F] shadow-[3.5px_3.5px_0px_#17130F] hover:shadow-[5px_5px_0px_#17130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div className="h-36 overflow-hidden border-b-2 border-[#17130F]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm font-black text-[#17130F] leading-tight line-clamp-1 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 font-semibold mb-2">
                        <Clock className="w-3 h-3 text-[#A91314]" />
                        <span>~{item.prepTimeMinutes || 10} min prep</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="font-display text-base font-black text-[#A91314]">
                        ₹{Number(item.price).toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(item, outlets[0])}
                        className="px-3.5 py-1.5 bg-[#E5AD24] hover:bg-[#D49D18] text-[#17130F] font-extrabold text-xs rounded-xl border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all flex items-center gap-1"
                      >
                        <span>Add</span>
                        <ShoppingBag className="w-3.5 h-3.5" />
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* For Students */}
          <div className="bg-white rounded-[26px] p-7 sm:p-8 border-3 border-[#17130F] shadow-[6px_6px_0px_#17130F] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#590004] text-[#E5AD24] flex items-center justify-center font-bold border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-[#A91314] tracking-wider">For College Diners</span>
                <h3 className="font-display text-2xl font-black text-[#17130F]">
                  Why Students Love eatLays
                </h3>
              </div>
            </div>

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
          <div className="bg-white rounded-[26px] p-7 sm:p-8 border-3 border-[#17130F] shadow-[6px_6px_0px_#17130F] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E5AD24] text-[#17130F] flex items-center justify-center font-bold border-2 border-[#17130F] shadow-[2.5px_2.5px_0px_#17130F]">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-[#590004] tracking-wider">For Canteen Kitchens</span>
                <h3 className="font-display text-2xl font-black text-[#17130F]">
                  Built for Campus Vendors
                </h3>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Flatten the lunch rush:</strong> Receive pre-orders systematically instead of dealing with chaotic counter crowds.</span>
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

      {/* FINAL CALL TO ACTION — BOLD & INVITING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#590004] rounded-[32px] p-10 md:p-14 text-white text-center border-3 border-[#17130F] shadow-[8px_8px_0px_#17130F] relative overflow-hidden">
          
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#E5AD24]">
              Ready to reclaim your lunch break?
            </h2>
            <p className="text-base sm:text-lg text-[#FCECCB] font-medium leading-relaxed">
              Join hundreds of campus students ordering meals ahead from Central Food Court, North Block Tuck, and Science Cafe.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/outlets"
                className="w-full sm:w-auto px-8 py-4 bg-[#E5AD24] hover:bg-[#D49D18] text-[#17130F] font-display text-base tracking-wide rounded-2xl border-2 border-[#17130F] shadow-[3.5px_3.5px_0px_#17130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all flex items-center justify-center gap-2"
              >
                <span>Start Pre-Ordering Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-[#FCECCB] text-[#17130F] font-bold text-base rounded-2xl border-2 border-[#17130F] shadow-[3.5px_3.5px_0px_#17130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all"
              >
                Create Free Student Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
