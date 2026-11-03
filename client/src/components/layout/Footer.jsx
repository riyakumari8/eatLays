import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#19130F] text-white pt-14 pb-8 border-t-4 border-[#FF7900]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b-2 border-white/10">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF7900] flex items-center justify-center text-[#19130F] border-2 border-white shadow-[2.5px_2.5px_0px_white]">
                <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display text-2xl font-black text-[#FF7900] tracking-tight">
                eatLays
              </span>
            </div>
            <p className="text-sm text-[#FFF0B8]/85 leading-relaxed font-medium">
              Campus food pre-ordering & queue management platform. Browse college canteens, order ahead, and collect your fresh food directly at the counter between classes.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FF3D0A] border-2 border-white text-xs font-black text-white shadow-[2px_2px_0px_white]">
              <Clock className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              <span>Campus Counter Pickup Only</span>
            </div>
          </div>

          {/* Student Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-[#FF7900] mb-4">
              Students
            </h4>
            <ul className="space-y-2.5 text-sm text-white/85">
              <li>
                <Link to="/outlets" className="hover:text-[#FF7900] transition-colors font-bold">
                  Explore Canteens
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FF7900] transition-colors font-bold">
                  Pre-Order Cart
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-[#FF7900] transition-colors font-bold">
                  Track Preparation
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FF7900] transition-colors font-bold">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors & Staff */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-[#FF7900] mb-4">
              Canteen Vendors
            </h4>
            <ul className="space-y-2.5 text-sm text-white/85">
              <li>
                <Link to="/login" className="hover:text-[#FF7900] transition-colors font-bold">
                  Vendor Portal Sign In
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-[#FF7900] transition-colors font-bold">
                  Kitchen Live Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vendor/menu" className="hover:text-[#FF7900] transition-colors font-bold">
                  Menu & Stock Control
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#FF7900] transition-colors text-white/60 hover:text-white font-bold">
                  Campus Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Pickup Guidelines */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-[#FF7900] mb-4">
              How Pickup Works
            </h4>
            <p className="text-xs text-[#FFF0B8]/80 leading-relaxed mb-3 font-medium">
              1. Place pre-order before your lecture ends.<br />
              2. Watch real-time status: Placed → Preparing → Ready.<br />
              3. Walk to the outlet counter, display your 4-digit pickup code, and collect your food hot & fresh.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/70 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#FF7900] stroke-[2.5]" />
              <span>Available across all campus dining zones</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-4">
          <p className="font-medium">© {new Date().getFullYear()} eatLays. Engineered for faster campus breaks.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#FFF0B8] font-bold">Zero Delivery Fees • Zero Courier Delays • Pure Campus Speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
