import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Store, 
  MapPin, 
  Clock, 
  ChefHat, 
  BellRing, 
  CheckCircle2, 
  Utensils, 
  Power, 
  ArrowRight, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function VendorDashboardPage() {
  const [outlet, setOutlet] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = async () => {
    try {
      const [outletRes, ordersRes] = await Promise.all([
        api.getVendorOutlet(),
        api.getVendorOrders(),
      ]);

      if (outletRes.success && outletRes.data) {
        setOutlet(outletRes.data);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      }
    } catch (err) {
      console.error('Error loading vendor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleOpen = async () => {
    if (!outlet) return;
    setUpdatingStatus(true);
    try {
      const res = await api.updateOutletStatus({
        isOpen: !outlet.isOpen,
      });
      if (res.success && res.data) {
        setOutlet((prev) => ({ ...prev, isOpen: res.data.isOpen }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update outlet status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleAccepting = async () => {
    if (!outlet) return;
    setUpdatingStatus(true);
    try {
      const res = await api.updateOutletStatus({
        acceptsOrders: !outlet.acceptsOrders,
      });
      if (res.success && res.data) {
        setOutlet((prev) => ({ ...prev, acceptsOrders: res.data.acceptsOrders }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update pre-order acceptance');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <RefreshCw className="w-10 h-10 animate-spin text-[#A91314] mx-auto mb-3" />
        <p className="font-semibold text-gray-700">Connecting to vendor kitchen system...</p>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="font-display text-2xl text-[#250001] mb-2">No Assigned Outlet</h2>
        <p className="text-gray-500 text-sm">Your vendor account has not yet been linked to a campus outlet. Please contact the campus admin.</p>
      </div>
    );
  }

  const placedOrders = orders.filter((o) => o.status === 'PLACED');
  const preparingOrders = orders.filter((o) => ['ACCEPTED', 'PREPARING'].includes(o.status));
  const readyOrders = orders.filter((o) => o.status === 'READY');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#590004] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#FFB607] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FFB607] text-[#250001] font-black text-xs uppercase tracking-wider">
              Canteen Kitchen Terminal
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
            {outlet.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#FCECCB] flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-[#FFB607]" />
            <span>{outlet.location}</span>
          </p>
        </div>

        {/* Operating Status Toggles */}
        <div className="bg-[#250001]/60 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-bold text-white">Outlet Gate:</span>
            <button
              onClick={handleToggleOpen}
              disabled={updatingStatus}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors shadow ${
                outlet.isOpen
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {outlet.isOpen ? 'OPEN' : 'CLOSED'}
            </button>
          </div>

          <div className="h-px sm:h-8 w-full sm:w-px bg-white/20" />

          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-bold text-white">Pre-Orders:</span>
            <button
              onClick={handleToggleAccepting}
              disabled={updatingStatus}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors shadow ${
                outlet.acceptsOrders
                  ? 'bg-[#FFB607] text-[#250001] hover:bg-[#ffc634]'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {outlet.acceptsOrders ? 'ACCEPTING' : 'PAUSED'}
            </button>
          </div>
        </div>
      </div>

      {/* Queue Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Placed */}
        <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-sm relative overflow-hidden">
          <div className="text-xs uppercase font-extrabold text-blue-700 tracking-wider mb-1">
            New Orders
          </div>
          <div className="font-display text-4xl font-black text-blue-900">
            {placedOrders.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Waiting for acceptance</p>
        </div>

        {/* Preparing */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#FFB607] shadow-sm relative overflow-hidden">
          <div className="text-xs uppercase font-extrabold text-[#A91314] tracking-wider mb-1 flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5" />
            <span>In Kitchen</span>
          </div>
          <div className="font-display text-4xl font-black text-[#590004]">
            {preparingOrders.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Cooking & assembling</p>
        </div>

        {/* Ready */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-sm relative overflow-hidden">
          <div className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider mb-1 flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5" />
            <span>Ready at Counter</span>
          </div>
          <div className="font-display text-4xl font-black text-emerald-800">
            {readyOrders.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Waiting for student pickup</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm relative overflow-hidden">
          <div className="text-xs uppercase font-extrabold text-gray-600 tracking-wider mb-1">
            Completed Today
          </div>
          <div className="font-display text-4xl font-black text-gray-800">
            {completedOrders.length}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Successfully collected</p>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Link
          to="/vendor/orders"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-[#A91314] hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#A91314] uppercase tracking-wider">
              Kitchen Workflow
            </span>
            <h3 className="font-display text-2xl font-black text-[#250001] group-hover:text-[#A91314] transition-colors">
              Manage Live Orders Queue
            </h3>
            <p className="text-xs text-gray-500">
              Accept incoming orders, change statuses, and verify 4-digit student pickup PINs.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#A91314]/10 text-[#A91314] flex items-center justify-center shrink-0 group-hover:bg-[#A91314] group-hover:text-white transition-colors">
            <ArrowRight className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/vendor/menu"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-[#236092] hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#236092] uppercase tracking-wider">
              Food & Pricing
            </span>
            <h3 className="font-display text-2xl font-black text-[#250001] group-hover:text-[#236092] transition-colors">
              Menu & Stock Control
            </h3>
            <p className="text-xs text-gray-500">
              Toggle sold out items, modify prices, and add new dishes to this outlet's menu.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#236092]/10 text-[#236092] flex items-center justify-center shrink-0 group-hover:bg-[#236092] group-hover:text-white transition-colors">
            <ArrowRight className="w-6 h-6" />
          </div>
        </Link>

      </div>

    </div>
  );
}
