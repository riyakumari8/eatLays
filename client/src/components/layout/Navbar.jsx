import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Store, 
  ShieldAlert, 
  Clock, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isStudent, isVendor, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FF7900] text-[#19130F] border-b-2 border-[#19130F] shadow-[0_4px_0px_#19130F]">
      {/* Top micro ticker */}
      <div className="bg-[#FFF0B8] text-[#19130F] text-[11px] font-black uppercase tracking-widest py-1 px-4 text-center border-b-2 border-[#19130F] flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FF3D0A] animate-pulse"></span>
        <span>Campus Food Pre-Ordering & Express Counter Pickup</span>
        <span className="hidden sm:inline text-[#19130F]/70">• Skip Canteen Lines Completely</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF0B8] flex items-center justify-center text-[#19130F] border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] group-hover:rotate-3 transition-transform">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black text-[#19130F] tracking-tight leading-none group-hover:text-white transition-colors">
                eatLays
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#FFF0B8] mt-0.5 drop-shadow-[0_1px_1px_rgba(25,19,15,0.4)]">
                Campus Pre-Order
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/outlets"
              className={`font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl transition-all ${
                isActive('/outlets')
                  ? 'bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F]'
                  : 'text-[#19130F] hover:bg-[#FFF0B8]/50'
              }`}
            >
              Campus Canteens
            </Link>

            <Link
              to="/#how-it-works"
              className="font-black text-xs sm:text-sm text-[#19130F] hover:bg-[#FFF0B8]/50 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              How It Works
            </Link>

            {/* Role-specific Nav Links */}
            {isStudent && (
              <Link
                to="/my-orders"
                className={`font-black text-xs sm:text-sm flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                  isActive('/my-orders')
                    ? 'bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F]'
                    : 'text-[#19130F] hover:bg-[#FFF0B8]/50'
                }`}
              >
                <Clock className="w-4 h-4 text-[#19130F] shrink-0 stroke-[2.5]" />
                <span>My Orders</span>
              </Link>
            )}

            {isVendor && (
              <>
                <Link
                  to="/vendor/dashboard"
                  className={`font-black text-xs sm:text-sm flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                    isActive('/vendor/dashboard')
                      ? 'bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F]'
                      : 'text-[#19130F] hover:bg-[#FFF0B8]/50'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#19130F] stroke-[2.5]" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/vendor/orders"
                  className={`font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl transition-colors ${
                    isActive('/vendor/orders')
                      ? 'bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]'
                      : 'text-[#19130F] hover:bg-[#FFF0B8]/50'
                  }`}
                >
                  Live Orders
                </Link>
                <Link
                  to="/vendor/menu"
                  className={`font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl transition-colors ${
                    isActive('/vendor/menu')
                      ? 'bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]'
                      : 'text-[#19130F] hover:bg-[#FFF0B8]/50'
                  }`}
                >
                  Menu & Stock
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`font-black text-xs sm:text-sm flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                  isActive('/admin')
                    ? 'bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F]'
                    : 'text-[#19130F] hover:bg-[#FFF0B8]/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#19130F] stroke-[2.5]" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Desktop Right Actions: Cart & Auth */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Student Cart Icon */}
            {(!user || isStudent) && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-[#FFF0B8] hover:bg-white border-2 border-[#19130F] text-[#19130F] transition-all shadow-[2.5px_2.5px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5"
                title="View Pre-Order Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#FF3D0A] text-white font-black text-[11px] rounded-full flex items-center justify-center border-2 border-[#19130F] shadow-[1px_1px_0px_#19130F]">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l-2 border-[#19130F]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3D0A] border-2 border-[#19130F] flex items-center justify-center text-white font-black text-xs uppercase shadow-[1.5px_1.5px_0px_#19130F]">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black leading-tight truncate max-w-[110px] text-[#19130F]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-[#19130F]/80 font-bold capitalize">
                      {user.role?.toLowerCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-[#19130F] hover:bg-[#FFF0B8] rounded-xl border border-transparent hover:border-[#19130F] transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-black text-[#19130F] hover:bg-[#FFF0B8]/50 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/outlets"
                  className="px-4 py-2 bg-[#FF3D0A] hover:bg-[#E03508] text-white text-sm font-display tracking-wide rounded-xl border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] hover:shadow-[4px_4px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#19130F] transition-all flex items-center gap-1.5"
                >
                  <span>Order Ahead</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex md:hidden items-center gap-2">
            {(!user || isStudent) && (
              <Link
                to="/cart"
                className="relative p-2 rounded-xl bg-[#FFF0B8] border-2 border-[#19130F] text-[#19130F] shadow-[2px_2px_0px_#19130F]"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3D0A] text-white font-black text-[10px] rounded-full flex items-center justify-center border border-[#19130F]">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#FFF0B8] border-2 border-[#19130F] text-[#19130F] hover:bg-white focus:outline-none shadow-[2px_2px_0px_#19130F]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FF7900] border-t-2 border-[#19130F] px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/outlets"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl font-black text-[#19130F] bg-[#FFF0B8]/60 hover:bg-[#FFF0B8] flex items-center justify-between border-2 border-[#19130F]"
          >
            <span>Campus Canteens</span>
            <ChevronRight className="w-4 h-4 text-[#19130F] stroke-[2.5]" />
          </Link>

          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl font-black text-[#19130F] bg-[#FFF0B8]/40 hover:bg-[#FFF0B8] flex items-center justify-between border border-[#19130F]"
          >
            <span>How It Works</span>
            <ChevronRight className="w-4 h-4 text-[#19130F] stroke-[2.5]" />
          </Link>

          {isStudent && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl font-black text-[#19130F] bg-[#FFF0B8]/40 hover:bg-[#FFF0B8] flex items-center justify-between border border-[#19130F]"
            >
              <span>My Orders</span>
              <ChevronRight className="w-4 h-4 text-[#19130F] stroke-[2.5]" />
            </Link>
          )}

          {isVendor && (
            <>
              <Link
                to="/vendor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl font-black text-[#19130F] bg-[#FFF0B8]/40 hover:bg-[#FFF0B8] border border-[#19130F]"
              >
                Vendor Dashboard
              </Link>
              <Link
                to="/vendor/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl font-black text-[#19130F] bg-[#FFF0B8]/40 hover:bg-[#FFF0B8] border border-[#19130F]"
              >
                Live Orders
              </Link>
              <Link
                to="/vendor/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl font-black text-[#19130F] bg-[#FFF0B8]/40 hover:bg-[#FFF0B8] border border-[#19130F]"
              >
                Menu Management
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl font-black text-[#19130F] bg-[#FFF0B8]/80 hover:bg-[#FFF0B8] border-2 border-[#19130F]"
            >
              Admin Console
            </Link>
          )}

          <div className="pt-3 border-t-2 border-[#19130F]/20">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-1 bg-[#FFF0B8] rounded-xl border-2 border-[#19130F]">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3D0A] text-white font-black flex items-center justify-center text-xs border border-[#19130F]">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#19130F]">{user.name}</div>
                    <div className="text-xs text-[#19130F]/70 font-semibold">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 bg-[#FF3D0A] text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-[#E03508] border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-black text-[#19130F] bg-white rounded-xl border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-black text-white bg-[#FF3D0A] rounded-xl border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
