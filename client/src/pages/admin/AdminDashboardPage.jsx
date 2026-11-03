import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ShieldAlert, 
  Store, 
  Users, 
  ShoppingBag, 
  Plus, 
  RefreshCw, 
  Check, 
  X, 
  MapPin, 
  AlertCircle,
  Coins
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OUTLETS'); // 'OUTLETS', 'USERS', 'ORDERS'

  // Add Outlet modal
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [outletName, setOutletName] = useState('');
  const [outletDesc, setOutletDesc] = useState('');
  const [outletLoc, setOutletLoc] = useState('');
  const [outletImg, setOutletImg] = useState('');

  // Assign Vendor modal
  const [showAssignVendor, setShowAssignVendor] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedOutletId, setSelectedOutletId] = useState('');

  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, outletsRes, usersRes, ordersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOutlets(),
        api.getAdminUsers(),
        api.getAdminOrders(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (outletsRes.success) setOutlets(outletsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setActionError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOutlet = async (e) => {
    e.preventDefault();
    setActionMsg('');
    setActionError('');
    try {
      const res = await api.createAdminOutlet({
        name: outletName,
        description: outletDesc,
        location: outletLoc,
        imageUrl: outletImg || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      });
      if (res.success && res.data) {
        setOutlets((prev) => [...prev, res.data]);
        setShowAddOutlet(false);
        setOutletName('');
        setOutletDesc('');
        setOutletLoc('');
        setActionMsg('New campus outlet created successfully!');
      }
    } catch (err) {
      setActionError(err.message || 'Failed to create outlet.');
    }
  };

  const handleAssignVendor = async (e) => {
    e.preventDefault();
    setActionMsg('');
    setActionError('');
    try {
      const res = await api.assignVendor(selectedUserId, selectedOutletId);
      if (res.success) {
        setShowAssignVendor(false);
        setActionMsg('Vendor assigned to outlet successfully!');
        fetchData();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to assign vendor.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7900] text-[#19130F] text-xs font-black uppercase tracking-wider mb-2 border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
            <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Campus Dining Authority</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#19130F]">
            Platform Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mt-1">
            Manage campus outlets, vendor assignments, and monitor real-time queue volumes
          </p>
        </div>

        <button
          onClick={fetchData}
          className="self-start sm:self-center px-4 py-2 bg-white hover:bg-gray-50 text-[#19130F] text-xs font-black rounded-xl border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-xs font-black text-emerald-800 shadow-[2px_2px_0px_#19130F]">
          {actionMsg}
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl text-xs font-black text-rose-800 shadow-[2px_2px_0px_#19130F]">
          {actionError}
        </div>
      )}

      {/* Operational Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F]">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Outlets</span>
            <div className="font-display text-3xl font-black text-[#19130F] mt-1">
              {stats.totalOutlets}
            </div>
            <p className="text-[11px] text-gray-600 font-bold mt-1">Campus food spots</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F]">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Registered Students</span>
            <div className="font-display text-3xl font-black text-[#FF3D0A] mt-1">
              {stats.totalStudents}
            </div>
            <p className="text-[11px] text-gray-600 font-bold mt-1">Active college diners</p>
          </div>

          <div className="bg-[#FFF0B8] p-5 rounded-3xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F]">
            <span className="text-[10px] font-black text-[#19130F] uppercase tracking-wider">Active Queue</span>
            <div className="font-display text-3xl font-black text-[#19130F] mt-1">
              {stats.activeOrders}
            </div>
            <p className="text-[11px] text-gray-800 font-bold mt-1">Cooking / Ready now</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F]">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="font-display text-3xl font-black text-[#FF7900] mt-1">
              {stats.totalOrders}
            </div>
            <p className="text-[11px] text-gray-600 font-bold mt-1">Lifetime pre-orders</p>
          </div>

          <div className="bg-emerald-100 p-5 rounded-3xl border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F] col-span-2 lg:col-span-1">
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">Campus Volume</span>
            <div className="font-display text-3xl font-black text-emerald-950 mt-1">
              ₹{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-800 font-bold mt-1">Completed orders value</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('OUTLETS')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all border-2 ${
            activeTab === 'OUTLETS'
              ? 'bg-[#FF7900] text-[#19130F] border-[#19130F] shadow-[3px_3px_0px_#19130F]'
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#19130F]'
          }`}
        >
          Campus Outlets ({outlets.length})
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all border-2 ${
            activeTab === 'USERS'
              ? 'bg-[#FF7900] text-[#19130F] border-[#19130F] shadow-[3px_3px_0px_#19130F]'
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#19130F]'
          }`}
        >
          Users & Vendors ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all border-2 ${
            activeTab === 'ORDERS'
              ? 'bg-[#FF7900] text-[#19130F] border-[#19130F] shadow-[3px_3px_0px_#19130F]'
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#19130F]'
          }`}
        >
          Global Order Audit ({orders.length})
        </button>
      </div>

      {/* Tab: Outlets */}
      {activeTab === 'OUTLETS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-xl font-black text-[#19130F]">
              Registered Food Outlets
            </h3>
            <button
              onClick={() => setShowAddOutlet(true)}
              className="px-4 py-2 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Outlet</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#19130F] overflow-hidden shadow-[5px_5px_0px_#19130F]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-800">
                <thead className="bg-[#FFF0B8] text-[#19130F] uppercase font-black tracking-wider text-[11px] border-b-2 border-[#19130F]">
                  <tr>
                    <th className="p-4">Outlet</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Gate & Pre-Orders</th>
                    <th className="p-4">Assigned Vendor</th>
                    <th className="p-4">Menu Items</th>
                    <th className="p-4">Total Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100 font-bold">
                  {outlets.map((outlet) => (
                    <tr key={outlet.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-black text-[#19130F] text-sm">{outlet.name}</div>
                        <div className="text-[11px] text-gray-500 font-medium truncate max-w-xs">{outlet.description}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-gray-700 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-[#FF3D0A] stroke-[2.5]" />
                          <span>{outlet.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-[#19130F] ${
                            outlet.isOpen ? 'bg-emerald-300 text-[#19130F]' : 'bg-rose-300 text-[#19130F]'
                          }`}>
                            {outlet.isOpen ? 'Open' : 'Closed'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border border-[#19130F] ${
                            outlet.acceptsOrders ? 'bg-[#FF7900] text-[#19130F]' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {outlet.acceptsOrders ? 'Orders OK' : 'Paused'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {outlet.vendorOutlets && outlet.vendorOutlets.length > 0 ? (
                          <div>
                            <span className="font-black text-[#19130F] block">
                              {outlet.vendorOutlets[0]?.user?.name}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              {outlet.vendorOutlets[0]?.user?.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#FF3D0A] font-black text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-black">{outlet._count?.menuItems || 0}</td>
                      <td className="p-4 font-mono font-black text-[#FF3D0A]">{outlet._count?.orders || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users & Vendors */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-xl font-black text-[#19130F]">
              Platform Users & Vendor Assignments
            </h3>
            <button
              onClick={() => {
                if (users.length > 0) setSelectedUserId(users[0].id);
                if (outlets.length > 0) setSelectedOutletId(outlets[0].id);
                setShowAssignVendor(true);
              }}
              className="px-4 py-2 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-xs rounded-xl border-2 border-[#19130F] shadow-[2.5px_2.5px_0px_#19130F] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Store className="w-4 h-4 stroke-[2.5]" />
              <span>Assign Vendor to Outlet</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#19130F] overflow-hidden shadow-[5px_5px_0px_#19130F]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-800">
                <thead className="bg-[#FFF0B8] text-[#19130F] uppercase font-black tracking-wider text-[11px] border-b-2 border-[#19130F]">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Linked Outlet</th>
                    <th className="p-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100 font-bold">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-4 font-black text-[#19130F]">{u.name}</td>
                      <td className="p-4 text-gray-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border border-[#19130F] ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-200 text-[#19130F]'
                            : u.role === 'VENDOR'
                            ? 'bg-[#FF7900] text-[#19130F]'
                            : 'bg-emerald-200 text-[#19130F]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.vendorOutlets && u.vendorOutlets.length > 0 ? (
                          <span className="font-black text-[#FF3D0A]">
                            {u.vendorOutlets[0]?.outlet?.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500 font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orders Ledger */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <h3 className="font-display text-xl font-black text-[#19130F]">
            Global Orders Audit Ledger
          </h3>

          <div className="bg-white rounded-3xl border-2 border-[#19130F] overflow-hidden shadow-[5px_5px_0px_#19130F]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-800">
                <thead className="bg-[#FFF0B8] text-[#19130F] uppercase font-black tracking-wider text-[11px] border-b-2 border-[#19130F]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Token PIN</th>
                    <th className="p-4">Canteen</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Items Count</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100 font-bold">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono font-black text-[#19130F]">
                        {order.orderNumber}
                      </td>
                      <td className="p-4 font-mono font-black text-[#FF7900]">
                        {order.pickupCode}
                      </td>
                      <td className="p-4 font-bold text-[#19130F]">
                        {order.outlet?.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {order.student?.name}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-gray-200 text-gray-800 border border-[#19130F]">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-black">{order.items?.length || 0}</td>
                      <td className="p-4 font-display font-black text-[#FF3D0A]">
                        ₹{Number(order.total).toFixed(2)}
                      </td>
                      <td className="p-4 text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Outlet Modal */}
      {showAddOutlet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#19130F] relative border-2 border-[#19130F]">
            <button
              onClick={() => setShowAddOutlet(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h3 className="font-display text-2xl font-black text-[#19130F] mb-1">
              Create Campus Outlet
            </h3>
            <p className="text-xs text-gray-600 font-bold mb-6">
              Add a new canteen or snack counter to the campus pre-ordering system.
            </p>

            <form onSubmit={handleCreateOutlet} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1">
                  Outlet Name *
                </label>
                <input
                  type="text"
                  required
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  placeholder="e.g. South Campus Cafe"
                  className="w-full p-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1">
                  Campus Location *
                </label>
                <input
                  type="text"
                  required
                  value={outletLoc}
                  onChange={(e) => setOutletLoc(e.target.value)}
                  placeholder="e.g. Science Quad, Ground Floor"
                  className="w-full p-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={outletDesc}
                  onChange={(e) => setOutletDesc(e.target.value)}
                  placeholder="Fresh snacks, quick lunch boxes, and beverages..."
                  className="w-full p-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={outletImg}
                  onChange={(e) => setOutletImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-sm rounded-xl border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Create Outlet
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddOutlet(false)}
                  className="py-3 px-5 border-2 border-[#19130F] text-gray-700 font-black text-sm rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Vendor Modal */}
      {showAssignVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_#19130F] relative border-2 border-[#19130F]">
            <button
              onClick={() => setShowAssignVendor(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h3 className="font-display text-2xl font-black text-[#19130F] mb-1">
              Assign Vendor to Outlet
            </h3>
            <p className="text-xs text-gray-600 font-bold mb-6">
              Link an account to manage kitchen orders and menus for a specific canteen.
            </p>

            <form onSubmit={handleAssignVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1">
                  Select User Account
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-semibold bg-white"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) — [{u.role}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1">
                  Assign to Campus Outlet
                </label>
                <select
                  value={selectedOutletId}
                  onChange={(e) => setSelectedOutletId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-semibold bg-white"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-sm rounded-xl border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Confirm Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignVendor(false)}
                  className="py-3 px-5 border-2 border-[#19130F] text-gray-700 font-black text-sm rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
