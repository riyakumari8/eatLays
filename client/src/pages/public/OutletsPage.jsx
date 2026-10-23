import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Store, Filter, Clock, Utensils } from 'lucide-react';
import api from '../../services/api';

export default function OutletsPage() {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [acceptingOnly, setAcceptingOnly] = useState(false);

  useEffect(() => {
    const fetchOutlets = async () => {
      setLoading(true);
      try {
        const res = await api.getOutlets({
          search,
          acceptingOnly: acceptingOnly ? 'true' : 'false',
        });
        if (res.success && res.data) {
          setOutlets(res.data);
        }
      } catch (err) {
        console.error('Error fetching outlets:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchOutlets();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, acceptingOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A91314]/10 text-[#A91314] text-xs font-black uppercase tracking-wider">
          <Store className="w-3.5 h-3.5" />
          <span>Campus Food Locations</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-[#250001]">
          Explore Campus Canteens
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
          Browse food outlets across the campus, check live menu availability, and pre-order for immediate pickup between lectures.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by outlet name, dish, or block..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB607] focus:ring-2 focus:ring-[#FFB607]/30 text-sm"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={acceptingOnly}
              onChange={(e) => setAcceptingOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#A91314] focus:ring-[#A91314] accent-[#A91314]"
            />
            <span>Open & Accepting Orders Only</span>
          </label>
        </div>

      </div>

      {/* Outlets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-200" />
          ))}
        </div>
      ) : outlets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-gray-800 mb-1">No campus outlets found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or uncheck the "Accepting Orders Only" filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setAcceptingOnly(false);
            }}
            className="px-4 py-2 bg-[#A91314] text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outlets.map((outlet) => {
            const isAccepting = outlet.isOpen && outlet.acceptsOrders;
            return (
              <div
                key={outlet.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#FFB607] transition-all flex flex-col group"
              >
                {/* Outlet Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={outlet.imageUrl}
                    alt={outlet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase shadow-md ${
                        isAccepting
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isAccepting ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                {/* Outlet Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-black text-[#250001] mb-1 group-hover:text-[#A91314] transition-colors">
                      {outlet.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#A91314] shrink-0" />
                      <span className="truncate">{outlet.location}</span>
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {outlet.description}
                    </p>

                    {/* Category Tags */}
                    {outlet.categories && outlet.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {outlet.categories.map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded-md bg-[#FCECCB]/60 text-[#250001] text-[11px] font-semibold border border-[#e8d7b3]"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-gray-400" />
                      <span>{outlet._count?.menuItems || 0} items on menu</span>
                    </span>

                    <Link
                      to={`/outlets/${outlet.id}`}
                      className="px-4 py-2 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>View Menu</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
