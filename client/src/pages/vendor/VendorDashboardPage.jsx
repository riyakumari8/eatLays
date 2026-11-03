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
        <div className="w-16 h-16 rounded-3xl bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#19130F]">
          <RefreshCw className="w-8 h-8 animate-spin text-[#FF3D0A] stroke-[2.5]" />
        </div>
        <p className="font-display font-black text-[#19130F]">Connecting to vendor kitchen system...</p>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 border-2 border-[#19130F] shadow-[6px_6px_0px_#19130F] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0B8] text-[#FF3D0A] border-2 border-[#19130F] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#19130F]">
            <AlertCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="font-display text-2xl font-black text-[#19130F]">No Assigned Outlet</h2>
          <p className="text-gray-600 text-sm font-semibold">Your vendor account has not yet been linked to a campus outlet. Please contact the campus admin.</p>
        </div>
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
      <div className="bg-[#FF7900] text-[#19130F] rounded-3xl p-6 sm:p-8 border-2 border-[#19130F] shadow-[6px_6px_0px_#19130F] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FFF0B8] text-[#19130F] font-black text-xs uppercase tracking-wider border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
              Canteen Kitchen Terminal
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#19130F]">
            {outlet.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#19130F] flex items-center gap-1.5 font-bold">
            <MapPin className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
            <span>{outlet.location}</span>
          </p>
        </div>

        {/* Operating Status Toggles */}
        <div className="bg-[#19130F] p-4 rounded-2xl border-2 border-[#19130F] shadow-[4px_4px_0px_#FFF0B8] flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <span className="text-xs font-black text-white uppercase tracking-wider">Gate:</span>
            <button
              onClick={handleToggleOpen}
              disabled={updatingStatus}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 border-white shadow-[2px_2px_0px_white] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                outlet.isOpen
                  ? 'bg-emerald-300 text-[#19130F]'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {outlet.isOpen ? 'OPEN' : 'CLOSED'}
            </button>
          </div>

          <div className="h-px sm:h-8 w-full sm:w-px bg-white/20" />

          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <span className="text-xs font-black text-white uppercase tracking-wider">Pre-Orders:</span>
            <button
              onClick={handleToggleAccepting}
              disabled={updatingStatus}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs border-2 border-white shadow-[2px_2px_0px_white] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                outlet.acceptsOrders
                  ? 'bg-[#FF7900] text-[#19130F]'
                  : 'bg-gray-600 text-white'
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
        <div className="bg-white rounded-3xl p-6 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] relative overflow-hidden">
          <div className="text-xs uppercase font-black text-blue-700 tracking-wider mb-1">
            New Orders
          </div>
          <div className="font-display text-4xl font-black text-[#19130F]">
            {placedOrders.length}
          </div>
          <p className="text-[11px] text-gray-600 font-bold mt-2">Waiting for acceptance</p>
        </div>

        {/* Preparing */}
        <div className="bg-[#FFF0B8] rounded-3xl p-6 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] relative overflow-hidden">
          <div className="text-xs uppercase font-black text-[#FF3D0A] tracking-wider mb-1 flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>In Kitchen</span>
          </div>
          <div className="font-display text-4xl font-black text-[#19130F]">
            {preparingOrders.length}
          </div>
          <p className="text-[11px] text-gray-800 font-bold mt-2">Cooking & assembling</p>
        </div>

        {/* Ready */}
        <div className="bg-emerald-100 rounded-3xl p-6 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] relative overflow-hidden">
          <div className="text-xs uppercase font-black text-emerald-800 tracking-wider mb-1 flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Ready at Counter</span>
          </div>
          <div className="font-display text-4xl font-black text-emerald-950">
            {readyOrders.length}
          </div>
          <p className="text-[11px] text-emerald-800 font-bold mt-2">Waiting for student pickup</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] relative overflow-hidden">
          <div className="text-xs uppercase font-black text-gray-600 tracking-wider mb-1">
            Completed Today
          </div>
          <div className="font-display text-4xl font-black text-gray-800">
            {completedOrders.length}
          </div>
          <p className="text-[11px] text-gray-500 font-bold mt-2">Successfully collected</p>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Link
          to="/vendor/orders"
          className="bg-white rounded-3xl p-6 border-2 border-[#19130F] shadow-[5px_5px_0px_#19130F] hover:shadow-[8px_8px_0px_#19130F] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-black text-[#FF3D0A] uppercase tracking-wider">
              Kitchen Workflow
            </span>
            <h3 className="font-display text-2xl font-black text-[#19130F] group-hover:text-[#FF3D0A] transition-colors">
              Manage Live Orders Queue
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Accept incoming orders, change statuses, and verify 4-digit student pickup PINs.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FF7900] text-[#19130F] border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] flex items-center justify-center shrink-0 group-hover:bg-[#FF3D0A] group-hover:text-white transition-colors">
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </div>
        </Link>

        <Link
          to="/vendor/menu"
          className="bg-white rounded-3xl p-6 border-2 border-[#19130F] shadow-[5px_5px_0px_#19130F] hover:shadow-[8px_8px_0px_#19130F] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-black text-[#FF7900] uppercase tracking-wider">
              Food & Pricing
            </span>
            <h3 className="font-display text-2xl font-black text-[#19130F] group-hover:text-[#FF7900] transition-colors">
              Menu & Stock Control
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Toggle sold out items, modify prices, and add new dishes to this outlet's menu.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] flex items-center justify-center shrink-0 group-hover:bg-[#FF7900] transition-colors">
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </div>
        </Link>

      </div>

    </div>
  );
}
