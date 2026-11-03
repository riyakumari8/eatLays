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
    <header className="sticky top-0 z-40 bg-[#590004] text-white border-b-2 border-[#17130F] shadow-[0_4px_0px_#17130F]">
      {/* Top micro banner */}
      <div className="bg-[#E5AD24] text-[#17130F] text-[11px] font-extrabold uppercase tracking-widest py-1 px-4 text-center border-b border-[#17130F]/30 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#A91314]"></span>
        <span>Campus Food Pre-Ordering & Express Counter Pickup</span>
        <span className="hidden sm:inline text-[#590004]/70">• Zero Waiting In Line</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5AD24] flex items-center justify-center text-[#17130F] border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] group-hover:rotate-3 transition-transform">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black text-[#E5AD24] tracking-tight leading-none group-hover:text-[#FCECCB] transition-colors">
                eatLays
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#FCECCB]/85 mt-0.5">
                Pre-Order Campus
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/outlets"
              className={`font-bold text-sm px-3 py-1.5 rounded-lg transition-all ${
                isActive('/outlets')
                  ? 'bg-[#E5AD24] text-[#17130F] border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]'
                  : 'text-white/90 hover:text-[#E5AD24]'
              }`}
            >
              Campus Canteens
            </Link>

            <Link
              to="/#how-it-works"
              className="font-bold text-sm text-white/90 hover:text-[#E5AD24] transition-colors"
            >
              How It Works
            </Link>

            {/* Role-specific Nav Links */}
            {isStudent && (
              <Link
                to="/my-orders"
                className={`font-bold text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/my-orders')
                    ? 'bg-[#E5AD24] text-[#17130F] border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]'
                    : 'text-white/90 hover:text-[#E5AD24]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#E5AD24] shrink-0" />
                <span>My Orders</span>
              </Link>
            )}

            {isVendor && (
              <>
                <Link
                  to="/vendor/dashboard"
                  className={`font-bold text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isActive('/vendor/dashboard')
                      ? 'bg-[#E5AD24] text-[#17130F] border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]'
                      : 'text-[#FCECCB] hover:text-[#E5AD24]'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#E5AD24]" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/vendor/orders"
                  className={`font-bold text-sm transition-colors ${
                    isActive('/vendor/orders')
                      ? 'text-[#E5AD24]'
                      : 'text-white/90 hover:text-[#E5AD24]'
                  }`}
                >
                  Live Orders
                </Link>
                <Link
                  to="/vendor/menu"
                  className={`font-bold text-sm transition-colors ${
                    isActive('/vendor/menu')
                      ? 'text-[#E5AD24]'
                      : 'text-white/90 hover:text-[#E5AD24]'
                  }`}
                >
                  Menu & Stock
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`font-bold text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/admin')
                    ? 'bg-[#E5AD24] text-[#17130F] border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]'
                    : 'text-[#FCECCB] hover:text-[#E5AD24]'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#E5AD24]" />
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
                className="relative p-2.5 rounded-xl bg-[#250001] hover:bg-[#17130F] border-2 border-[#17130F] text-white transition-all shadow-[2px_2px_0px_#17130F]"
                title="View Pre-Order Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#E5AD24]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#A91314] text-white font-black text-[11px] rounded-full flex items-center justify-center border-2 border-[#17130F]">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l-2 border-white/20">
                  <div className="w-8 h-8 rounded-lg bg-[#A91314] border-2 border-[#17130F] flex items-center justify-center text-white font-bold text-xs uppercase shadow-[1.5px_1.5px_0px_#17130F]">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight truncate max-w-[110px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-[#FCECCB]/80 font-medium capitalize">
                      {user.role?.toLowerCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-white/80 hover:text-[#E5AD24] hover:bg-white/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-bold text-white hover:text-[#E5AD24] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/outlets"
                  className="px-4 py-2 bg-[#E5AD24] hover:bg-[#D49D18] text-[#17130F] text-sm font-display tracking-wide rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] hover:shadow-[4px_4px_0px_#17130F] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#17130F] transition-all flex items-center gap-1.5"
                >
                  <span>Order Ahead</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex md:hidden items-center gap-2">
            {(!user || isStudent) && (
              <Link
                to="/cart"
                className="relative p-2 rounded-xl bg-[#250001] border-2 border-[#17130F] text-white shadow-[2px_2px_0px_#17130F]"
              >
                <ShoppingBag className="w-5 h-5 text-[#E5AD24]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A91314] text-white font-black text-[10px] rounded-full flex items-center justify-center border border-[#17130F]">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#250001] border-2 border-[#17130F] text-white hover:bg-[#17130F] focus:outline-none shadow-[2px_2px_0px_#17130F]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#250001] border-t-2 border-[#17130F] px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/outlets"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>Campus Canteens</span>
            <ChevronRight className="w-4 h-4 text-[#E5AD24]" />
          </Link>

          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-xl font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>How It Works</span>
            <ChevronRight className="w-4 h-4 text-[#E5AD24]" />
          </Link>

          {isStudent && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl font-bold text-white hover:bg-white/10 flex items-center justify-between"
            >
              <span>My Orders</span>
              <ChevronRight className="w-4 h-4 text-[#E5AD24]" />
            </Link>
          )}

          {isVendor && (
            <>
              <Link
                to="/vendor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl font-bold text-[#FCECCB] hover:bg-white/10"
              >
                Vendor Dashboard
              </Link>
              <Link
                to="/vendor/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl font-bold text-white hover:bg-white/10"
              >
                Live Orders
              </Link>
              <Link
                to="/vendor/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl font-bold text-white hover:bg-white/10"
              >
                Menu Management
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-xl font-bold text-[#E5AD24] hover:bg-white/10"
            >
              Admin Console
            </Link>
          )}

          <div className="pt-3 border-t border-white/15">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-1">
                  <div className="w-8 h-8 rounded-lg bg-[#A91314] text-white font-bold flex items-center justify-center text-xs border border-[#17130F]">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user.name}</div>
                    <div className="text-xs text-[#FCECCB]/70">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 bg-[#A91314] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#8E0E0F] border-2 border-[#17130F]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-bold text-white bg-white/10 rounded-xl border border-white/20"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-black text-[#17130F] bg-[#E5AD24] rounded-xl border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]"
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
