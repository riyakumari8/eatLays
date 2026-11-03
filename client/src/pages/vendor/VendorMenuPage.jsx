import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Plus, 
  Clock, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  Edit, 
  Check, 
  X, 
  Utensils, 
  ImageIcon 
} from 'lucide-react';

export default function VendorMenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategoryId, setNewItemCategoryId] = useState('');
  const [newItemPrepTime, setNewItemPrepTime] = useState('10');
  const [newItemImageUrl, setNewItemImageUrl] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, outletRes] = await Promise.all([
        api.getVendorMenuItems(),
        api.getVendorOutlet(),
      ]);

      if (itemsRes.success && itemsRes.data) {
        setItems(itemsRes.data);
      }
      if (outletRes.success && outletRes.data?.categories) {
        setCategories(outletRes.data.categories);
        if (outletRes.data.categories.length > 0) {
          setNewItemCategoryId(outletRes.data.categories[0].id);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch vendor menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async (itemId) => {
    try {
      const res = await api.toggleItemAvailability(itemId);
      if (res.success && res.data) {
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, isAvailable: res.data.isAvailable } : i))
        );
        setSuccessMsg(`Availability updated for item.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle availability.');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.createMenuItem({
        name: newItemName,
        description: newItemDesc,
        price: parseFloat(newItemPrice),
        categoryId: newItemCategoryId,
        prepTimeMinutes: parseInt(newItemPrepTime, 10) || 10,
        imageUrl: newItemImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      });

      if (res.success && res.data) {
        setItems((prev) => [res.data, ...prev]);
        setShowAddModal(false);
        setNewItemName('');
        setNewItemDesc('');
        setNewItemPrice('');
        setSuccessMsg('New dish added to menu successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create menu item.');
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#17130F] hover:text-[#A91314] transition-colors mb-2 bg-white px-3 py-1.5 rounded-xl border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            <span>Vendor Dashboard</span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#17130F]">
            Menu & Availability Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            Toggle sold-out items instantly during peak rush or add new dishes
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-center px-4 py-2.5 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-xs rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Dish</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-xs font-black text-emerald-800 shadow-[2px_2px_0px_#17130F]">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl text-xs font-black text-rose-800 shadow-[2px_2px_0px_#17130F]">
          {errorMsg}
        </div>
      )}

      {/* Menu Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse border-2 border-gray-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] flex flex-col justify-between transition-all ${
                !item.isAvailable ? 'bg-gray-50 opacity-75' : ''
              }`}
            >
              <div className="flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border-2 border-[#17130F]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    {item.category?.name || 'General'}
                  </span>
                  <h3 className="font-display text-base font-black text-[#17130F] truncate mt-0.5">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 font-medium">
                    {item.description}
                  </p>
                  <div className="font-display text-lg font-black text-[#A91314] mt-2">
                    ₹{Number(item.price).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>~{item.prepTimeMinutes || 10}m prep</span>
                </div>

                {/* Availability Toggle */}
                <button
                  onClick={() => handleToggleAvailability(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 ${
                    item.isAvailable
                      ? 'bg-emerald-300 text-[#17130F]'
                      : 'bg-rose-300 text-[#17130F]'
                  }`}
                >
                  {item.isAvailable ? 'In Stock (Available)' : 'Sold Out (Hidden)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#17130F] relative border-2 border-[#17130F]">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h3 className="font-display text-2xl font-black text-[#17130F] mb-1">
              Add New Dish to Menu
            </h3>
            <p className="text-xs text-gray-600 font-medium mb-6">
              Create a new item available for student counter pickup pre-orders.
            </p>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Schezwan Noodles"
                  className="w-full p-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="75.00"
                    className="w-full p-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    value={newItemPrepTime}
                    onChange={(e) => setNewItemPrepTime(e.target.value)}
                    placeholder="10"
                    className="w-full p-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newItemCategoryId}
                  onChange={(e) => setNewItemCategoryId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Crispy fried noodles tossed with wok veggies and fiery sauce..."
                  className="w-full p-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={newItemImageUrl}
                  onChange={(e) => setNewItemImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="flex-1 py-3 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-sm rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {modalSubmitting ? 'Adding...' : 'Add Dish to Menu'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-5 border-2 border-[#17130F] text-gray-700 font-black text-sm rounded-xl hover:bg-gray-50"
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
