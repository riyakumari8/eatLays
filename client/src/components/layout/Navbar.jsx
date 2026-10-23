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
  ChevronRight 
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
    <header className="sticky top-0 z-40 bg-[#590004] text-white shadow-lg border-b-2 border-[#FFB607]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Tagline */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFB607] flex items-center justify-center text-[#250001] shadow-md group-hover:rotate-3 transition-transform">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black text-[#FFB607] tracking-tight leading-none group-hover:text-[#FCECCB] transition-colors">
                eatLays
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FCECCB]/80">
                Campus Pre-Order
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/outlets"
              className={`font-semibold text-sm transition-colors py-1 border-b-2 ${
                isActive('/outlets')
                  ? 'border-[#FFB607] text-[#FFB607]'
                  : 'border-transparent text-white/90 hover:text-[#FFB607]'
              }`}
            >
              Campus Canteens
            </Link>

            <Link
              to="/#how-it-works"
              className="font-semibold text-sm text-white/90 hover:text-[#FFB607] transition-colors"
            >
              How It Works
            </Link>

            {/* Role-specific Nav Links */}
            {isStudent && (
              <Link
                to="/my-orders"
                className={`font-semibold text-sm transition-colors flex items-center gap-1.5 py-1 border-b-2 ${
                  isActive('/my-orders')
                    ? 'border-[#FFB607] text-[#FFB607]'
                    : 'border-transparent text-white/90 hover:text-[#FFB607]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#FFB607]" />
                My Orders
              </Link>
            )}

            {isVendor && (
              <>
                <Link
                  to="/vendor/dashboard"
                  className={`font-semibold text-sm transition-colors flex items-center gap-1.5 py-1 border-b-2 ${
                    isActive('/vendor/dashboard')
                      ? 'border-[#FFB607] text-[#FFB607]'
                      : 'border-transparent text-[#FCECCB] hover:text-[#FFB607]'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#FFB607]" />
                  Vendor Dashboard
                </Link>
                <Link
                  to="/vendor/orders"
                  className={`font-semibold text-sm transition-colors ${
                    isActive('/vendor/orders')
                      ? 'text-[#FFB607]'
                      : 'text-white/90 hover:text-[#FFB607]'
                  }`}
                >
                  Live Orders
                </Link>
                <Link
                  to="/vendor/menu"
                  className={`font-semibold text-sm transition-colors ${
                    isActive('/vendor/menu')
                      ? 'text-[#FFB607]'
                      : 'text-white/90 hover:text-[#FFB607]'
                  }`}
                >
                  Edit Menu
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`font-semibold text-sm transition-colors flex items-center gap-1.5 py-1 border-b-2 ${
                  isActive('/admin')
                    ? 'border-[#FFB607] text-[#FFB607]'
                    : 'border-transparent text-[#FCECCB] hover:text-[#FFB607]'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#FFB607]" />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Desktop Right Actions: Cart & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Student Cart Icon */}
            {(!user || isStudent) && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full bg-[#250001]/40 hover:bg-[#250001]/70 text-white transition-colors"
                title="View Pre-Order Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#FFB607]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFB607] text-[#250001] font-black text-xs rounded-full flex items-center justify-center shadow">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l border-white/20">
                  <div className="w-8 h-8 rounded-full bg-[#A91314] flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-[#FCECCB]/80 font-medium capitalize">
                      {user.role?.toLowerCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-white/70 hover:text-[#FFB607] hover:bg-white/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-white hover:text-[#FFB607] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/outlets"
                  className="px-4 py-2 bg-[#FFB607] hover:bg-[#ffb607]/90 text-[#250001] text-sm font-black rounded-lg shadow hover:shadow-md transition-all active:scale-95"
                >
                  Order Ahead
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex md:hidden items-center gap-2">
            {(!user || isStudent) && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg bg-[#250001]/40 text-white"
              >
                <ShoppingBag className="w-5 h-5 text-[#FFB607]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFB607] text-[#250001] font-black text-[10px] rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#250001] border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
          <Link
            to="/outlets"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-3 rounded-lg font-bold text-white hover:bg-white/10 flex items-center justify-between"
          >
            <span>Campus Canteens</span>
            <ChevronRight className="w-4 h-4 text-[#FFB607]" />
          </Link>

          {isStudent && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-bold text-white hover:bg-white/10 flex items-center justify-between"
            >
              <span>My Orders</span>
              <ChevronRight className="w-4 h-4 text-[#FFB607]" />
            </Link>
          )}

          {isVendor && (
            <>
              <Link
                to="/vendor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg font-bold text-[#FCECCB] hover:bg-white/10"
              >
                Vendor Dashboard
              </Link>
              <Link
                to="/vendor/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg font-bold text-white hover:bg-white/10"
              >
                Live Orders
              </Link>
              <Link
                to="/vendor/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg font-bold text-white hover:bg-white/10"
              >
                Menu Management
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg font-bold text-[#FFB607] hover:bg-white/10"
            >
              Admin Console
            </Link>
          )}

          <div className="pt-3 border-t border-white/15">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-[#A91314] text-white font-bold flex items-center justify-center text-xs">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user.name}</div>
                    <div className="text-xs text-[#FCECCB]/70">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 bg-[#A91314] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#A91314]/90"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-bold text-white bg-white/10 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center font-black text-[#250001] bg-[#FFB607] rounded-lg"
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
