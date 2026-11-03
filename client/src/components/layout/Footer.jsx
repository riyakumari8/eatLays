import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#250001] text-white pt-14 pb-8 border-t-4 border-[#E5AD24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E5AD24] flex items-center justify-center text-[#17130F] border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
                <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display text-2xl font-black text-[#E5AD24] tracking-tight">
                eatLays
              </span>
            </div>
            <p className="text-sm text-[#FCECCB]/85 leading-relaxed">
              Campus food pre-ordering & queue management platform. Browse college canteens, order ahead, and collect your fresh food directly at the counter between classes.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#A91314]/80 border-2 border-[#17130F] text-xs font-bold text-white shadow-[2px_2px_0px_#17130F]">
              <Clock className="w-3.5 h-3.5 text-[#E5AD24]" />
              <span>Campus Counter Pickup Only</span>
            </div>
          </div>

          {/* Student Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-[#E5AD24] mb-4">
              Students
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/outlets" className="hover:text-[#E5AD24] transition-colors font-medium">
                  Explore Canteens
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#E5AD24] transition-colors font-medium">
                  Pre-Order Cart
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-[#E5AD24] transition-colors font-medium">
                  Track Preparation
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#E5AD24] transition-colors font-medium">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendors & Staff */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-[#E5AD24] mb-4">
              Canteen Vendors
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/login" className="hover:text-[#E5AD24] transition-colors font-medium">
                  Vendor Portal Sign In
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-[#E5AD24] transition-colors font-medium">
                  Kitchen Live Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vendor/menu" className="hover:text-[#E5AD24] transition-colors font-medium">
                  Menu & Stock Control
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#E5AD24] transition-colors text-white/50 hover:text-white font-medium">
                  Campus Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Pickup Guidelines */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-[#E5AD24] mb-4">
              How Pickup Works
            </h4>
            <p className="text-xs text-[#FCECCB]/75 leading-relaxed mb-3">
              1. Place pre-order before your lecture ends.<br />
              2. Watch real-time status: Placed → Preparing → Ready.<br />
              3. Walk to the outlet counter, display your 4-digit pickup code, and collect your food hot & fresh.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <MapPin className="w-3.5 h-3.5 text-[#E5AD24]" />
              <span>Available across all campus dining zones</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} eatLays. Engineered for faster campus breaks.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#FCECCB]/70 font-semibold">Zero Delivery Fees • Zero Courier Delays • Pure Campus Speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
