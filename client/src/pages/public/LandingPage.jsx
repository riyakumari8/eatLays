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
  GraduationCap
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
      
      {/* HERO SECTION — VIBRANT PRIMARY ORANGE & BUTTER CREAM THEME */}
      <section className="relative overflow-hidden bg-[#FF7900] border-b-4 border-[#19130F] pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle halftone dot pattern */}
        <div className="absolute inset-0 bg-halftone-subtle opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0B8] text-[#19130F] font-black text-xs tracking-wider uppercase border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F]">
              <Flame className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
              <span>Campus Food Pre-Ordering Platform</span>
            </div>

            {/* Primary Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-[#19130F]">
              Skip the Queue. <br />
              <span className="text-[#FF3D0A] drop-shadow-[2.5px_2.5px_0px_#FFF0B8]">Order Ahead.</span> <br />
              Pick Up Between Classes.
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg md:text-xl text-[#19130F] font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Browse your campus canteens, order your favourite food before the rush, and collect it when it’s ready. Spend your break enjoying your food, not standing in line.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/outlets"
                className="w-full sm:w-auto px-8 py-4 bg-[#FF3D0A] hover:bg-[#E03508] text-white font-display text-lg tracking-wide rounded-2xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all flex items-center justify-center gap-2.5"
              >
                <span>Order Ahead</span>
                <ArrowRight className="w-5 h-5 stroke-[3] text-white" />
              </Link>

              <a
                href="#canteens"
                className="w-full sm:w-auto px-7 py-4 bg-[#FFF0B8] hover:bg-white text-[#19130F] font-black text-base rounded-2xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Campus Canteens</span>
              </a>
            </div>

            {/* Value bullets */}
            <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t-2 border-[#19130F]/20 text-left">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#19130F] shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="text-xs sm:text-sm font-black text-[#19130F]">Counter Pickup Only</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#19130F] shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="text-xs sm:text-sm font-black text-[#19130F]">Live Queue Tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#19130F] shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="text-xs sm:text-sm font-black text-[#19130F]">Zero Delivery Fee</span>
              </div>
            </div>

          </div>

          {/* Hero Right: Engaging Retro Comic Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 border-3 border-[#19130F] shadow-[7px_7px_0px_#19130F] text-[#19130F]">
              
              {/* Outlet Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7900] text-[#19130F] flex items-center justify-center font-black border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
                    <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-black text-[#19130F]">Central Food Court</h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3D0A] stroke-[2.5]" /> SAC Level 1 Counter 3
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-300 text-[#19130F] text-xs font-black uppercase border-2 border-[#19130F] shadow-[1.5px_1.5px_0px_#19130F]">
                  Open
                </span>
              </div>

              {/* Sample live order state preview */}
              <div className="my-5 p-4 rounded-2xl bg-[#FFF0B8] border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-[#19130F]">
                  <span>Order #EL-1049</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF3D0A] text-white text-[10px] uppercase font-black tracking-wider border border-[#19130F]">
                    Kitchen Preparing
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#19130F]">
                  <div className="bg-[#FF7900] h-full w-3/4 rounded-full" />
                </div>
                
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#19130F] font-bold">Counter Pickup Token:</span>
                  <span className="px-3 py-1 rounded-xl bg-[#19130F] text-[#FFF0B8] font-mono font-black text-sm border-2 border-[#19130F] shadow-[1.5px_1.5px_0px_#19130F]">
                    PIN 4291
                  </span>
                </div>
              </div>

              {/* Sample items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=120&auto=format&fit=crop&q=80" 
                      alt="Butter Masala Dosa"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#19130F]" 
                    />
                    <div>
                      <div className="font-bold text-xs text-[#19130F]">Butter Masala Dosa</div>
                      <div className="text-[11px] text-gray-500 font-semibold">Ready in ~8 mins</div>
                    </div>
                  </div>
                  <span className="font-display text-sm font-black text-[#FF3D0A]">₹65.00</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=120&auto=format&fit=crop&q=80" 
                      alt="Tandoori Paneer Roll"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#19130F]" 
                    />
                    <div>
                      <div className="font-bold text-xs text-[#19130F]">Tandoori Paneer Roll</div>
                      <div className="text-[11px] text-gray-500 font-semibold">Ready in ~8 mins</div>
                    </div>
                  </div>
                  <span className="font-display text-sm font-black text-[#FF3D0A]">₹75.00</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5">
                <Link
                  to="/outlets"
                  className="w-full py-3.5 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-sm rounded-xl flex items-center justify-center gap-2 border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all"
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
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#19130F] shadow-[5px_5px_0px_#19130F]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#FFF0B8] text-[#19130F] flex items-center justify-center font-black border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] shrink-0">
                <Sparkles className="w-5 h-5 text-[#FF3D0A]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-black text-[#19130F]">1-Click Demo Evaluation</h4>
                <p className="text-xs text-gray-600 font-bold">Instant session access without manual registration</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => handleQuickDemo('student@campus.edu', 'Student123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#FFF0B8] hover:bg-[#FFE699] text-[#19130F] font-black text-xs transition-all border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
                <span>Student (Alex)</span>
              </button>

              <button
                onClick={() => handleQuickDemo('vendor.central@campus.edu', 'Vendor123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#FFF0B8] hover:bg-[#FFE699] text-[#19130F] font-black text-xs transition-all border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-[#FF7900] stroke-[2.5]" />
                <span>Vendor (Central)</span>
              </button>

              <button
                onClick={() => handleQuickDemo('admin@campus.edu', 'Admin123!')}
                disabled={demoLoginLoading}
                className="px-3.5 py-2 rounded-xl bg-[#FFF0B8] hover:bg-[#FFE699] text-[#19130F] font-black text-xs transition-all border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
                <span>Campus Admin</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DISTINCTIVE 5-STEP STUDENT JOURNEY */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] p-6 sm:p-12 border-3 border-[#19130F] shadow-[7px_7px_0px_#19130F] space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0B8] text-[#19130F] text-xs font-black uppercase tracking-wider border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
              <span>How eatLays Works</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#19130F]">
              The 5-Step Campus Student Journey
            </h2>
            <p className="text-gray-700 text-sm sm:text-base font-bold">
              Browse Canteen → Choose Food → Place Order → Track Preparation → Collect at Counter.
            </p>
          </div>

          {/* 5 Distinctive Journey Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            
            {/* Step 01 */}
            <div className="bg-[#FFFBF0] rounded-3xl p-5 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#FF7900] text-[#19130F] flex items-center justify-center font-display font-black text-base border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
                    01
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FFF0B8] border border-[#19130F] rounded-md text-[#19130F]">
                    Discover
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#19130F] leading-snug">
                  1. Browse a Canteen
                </h3>

                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Find outlets near your department block or hostel concourse with real operating hours.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-gray-100 flex items-center gap-1.5 text-[11px] font-black text-[#FF3D0A]">
                <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Campus block locator</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-[#FFFBF0] rounded-3xl p-5 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#FF3D0A] text-white flex items-center justify-center font-display font-black text-base border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
                    02
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FFF0B8] border border-[#19130F] rounded-md text-[#19130F]">
                    Select
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#19130F] leading-snug">
                  2. Choose Your Food
                </h3>

                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Explore full canteen menus, prices, prep times, and select fresh hot items into your pre-order cart.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-gray-100 flex items-center gap-1.5 text-[11px] font-black text-[#19130F]">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#FF7900] stroke-[2.5]" />
                <span>Live prices & stock</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-[#FFFBF0] rounded-3xl p-5 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#19130F] text-[#FFF0B8] flex items-center justify-center font-display font-black text-base border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
                    03
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FFF0B8] border border-[#19130F] rounded-md text-[#19130F]">
                    Pre-Order
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#19130F] leading-snug">
                  3. Place Your Order
                </h3>

                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Submit order before your break starts. Add optional kitchen notes like extra chutney or spice level.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-gray-100 flex items-center gap-1.5 text-[11px] font-black text-[#FF3D0A]">
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Ahead of break rush</span>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-[#FFFBF0] rounded-3xl p-5 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#FF7900] text-[#19130F] flex items-center justify-center font-display font-black text-base border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
                    04
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FFF0B8] border border-[#19130F] rounded-md text-[#19130F]">
                    Queue Live
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#19130F] leading-snug">
                  4. Track Preparation
                </h3>

                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Watch kitchen updates in real time: Placed → Accepted → Cooking → Ready for Pickup.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-gray-100 flex items-center gap-1.5 text-[11px] font-black text-[#19130F]">
                <BellRing className="w-3.5 h-3.5 text-[#FF7900] stroke-[2.5]" />
                <span>Real-time polling</span>
              </div>
            </div>

            {/* Step 05 */}
            <div className="bg-[#FFFBF0] rounded-3xl p-5 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-9 rounded-xl bg-[#FF3D0A] text-white flex items-center justify-center font-display font-black text-base border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
                    05
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 border border-[#19130F] rounded-md text-emerald-800">
                    Fast Pass
                  </span>
                </div>

                <h3 className="font-display text-lg font-black text-[#19130F] leading-snug">
                  5. Collect at Counter
                </h3>

                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Bypass the long queue! Show your 4-digit pickup PIN at the express counter and grab your food hot.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-gray-100 flex items-center gap-1.5 text-[11px] font-black text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>Zero queue waiting</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CAMPUS CANTEENS SECTION */}
      <section id="canteens" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7900] text-[#19130F] text-xs font-black uppercase tracking-wider border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] mb-2">
              <Store className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Campus Locations</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#19130F]">
              Campus Food Outlets
            </h2>
            <p className="text-gray-700 text-sm mt-1 font-bold">
              Select an outlet to explore live menus and order ahead for counter pickup.
            </p>
          </div>
          
          <Link
            to="/outlets"
            className="inline-flex items-center gap-1.5 font-black text-sm text-[#FF3D0A] hover:text-[#19130F] transition-colors"
          >
            <span>View all campus canteens</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border-2 border-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-[#19130F] shadow-[5px_5px_0px_#19130F] hover:shadow-[8px_8px_0px_#19130F] hover:-translate-y-1 transition-all flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-gray-100 border-b-2 border-[#19130F]">
                  <img
                    src={outlet.imageUrl}
                    alt={outlet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] ${
                        outlet.isOpen && outlet.acceptsOrders
                          ? 'bg-emerald-300 text-[#19130F]'
                          : 'bg-rose-400 text-white'
                      }`}
                    >
                      {outlet.isOpen && outlet.acceptsOrders ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display text-lg font-black text-[#19130F] mb-1 group-hover:text-[#FF3D0A] transition-colors leading-snug">
                      {outlet.name}
                    </h3>
                    <p className="text-xs text-gray-700 flex items-center gap-1 mb-2 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3D0A] shrink-0 stroke-[2.5]" />
                      <span className="truncate">{outlet.location}</span>
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-semibold">
                      {outlet.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">
                      {outlet._count?.menuItems || 0} items
                    </span>
                    <Link
                      to={`/outlets/${outlet.id}`}
                      className="px-4 py-2 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all flex items-center gap-1"
                    >
                      <span>View Menu</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
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
          <div className="bg-[#FFF0B8] rounded-[32px] p-6 sm:p-8 border-3 border-[#19130F] shadow-[7px_7px_0px_#19130F]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
              <div>
                <span className="text-xs uppercase font-black tracking-wider text-[#FF3D0A] px-2.5 py-0.5 bg-white border border-[#19130F] rounded-md inline-block mb-1">
                  Campus Favourites
                </span>
                <h3 className="font-display text-2xl font-black text-[#19130F]">
                  Popular Between-Class Bites
                </h3>
              </div>
              <Link
                to="/outlets"
                className="text-xs font-black text-[#FF3D0A] hover:underline"
              >
                Browse all food & menus →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] hover:shadow-[6px_6px_0px_#19130F] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div className="h-36 overflow-hidden border-b-2 border-[#19130F]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm font-black text-[#19130F] leading-tight line-clamp-1 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-600 flex items-center gap-1 font-bold mb-2">
                        <Clock className="w-3 h-3 text-[#FF3D0A] stroke-[2.5]" />
                        <span>~{item.prepTimeMinutes || 10} min prep</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
                      <span className="font-display text-base font-black text-[#FF3D0A]">
                        ₹{Number(item.price).toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(item, outlets[0])}
                        className="px-3.5 py-1.5 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all flex items-center gap-1"
                      >
                        <span>Add</span>
                        <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
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
          <div className="bg-white rounded-3xl p-7 sm:p-8 border-3 border-[#19130F] shadow-[6px_6px_0px_#19130F] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF3D0A] text-white flex items-center justify-center font-bold border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F]">
                <Users className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-[#FF3D0A] tracking-wider">For College Diners</span>
                <h3 className="font-display text-2xl font-black text-[#19130F]">
                  Why Students Love eatLays
                </h3>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-gray-800 font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong className="text-[#19130F]">No more 20-minute lines:</strong> Order before lecture ends and pick up hot food right as your break begins.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong className="text-[#19130F]">Live preparation feedback:</strong> Check whether the kitchen has accepted and started cooking your meal.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong className="text-[#19130F]">Zero delivery markup:</strong> Pay standard canteen prices without courier fees or packing surcharges.</span>
              </li>
            </ul>
          </div>

          {/* For Canteen Vendors */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border-3 border-[#19130F] shadow-[6px_6px_0px_#19130F] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF7900] text-[#19130F] flex items-center justify-center font-bold border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F]">
                <ChefHat className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-[#FF7900] tracking-wider">For Canteen Kitchens</span>
                <h3 className="font-display text-2xl font-black text-[#19130F]">
                  Built for Campus Vendors
                </h3>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-gray-800 font-medium">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong className="text-[#19130F]">Flatten the lunch rush:</strong> Receive pre-orders systematically instead of dealing with chaotic counter crowds.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong className="text-[#19130F]">Live menu & stock control:</strong> Mark sold-out items instantly or toggle rush-hour pre-orders with one tap.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                <span><strong className="text-[#19130F]">Simple 4-digit token verification:</strong> Confirm pickup quickly and prevent order mix-ups at the counter.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FF7900] rounded-[32px] p-10 md:p-14 text-[#19130F] text-center border-3 border-[#19130F] shadow-[8px_8px_0px_#19130F] relative overflow-hidden">
          
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#19130F]">
              Ready to reclaim your lunch break?
            </h2>
            <p className="text-base sm:text-lg text-[#19130F] font-bold leading-relaxed">
              Join hundreds of campus students ordering meals ahead from Central Food Court, North Block Tuck, and Science Cafe.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/outlets"
                className="w-full sm:w-auto px-8 py-4 bg-[#FF3D0A] hover:bg-[#E03508] text-white font-display text-base tracking-wide rounded-2xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all flex items-center justify-center gap-2"
              >
                <span>Start Pre-Ordering Now</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-4 bg-[#FFF0B8] hover:bg-white text-[#19130F] font-black text-base rounded-2xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all"
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
