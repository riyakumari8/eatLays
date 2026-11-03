import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Store, Filter, Clock, Utensils, Sparkles } from 'lucide-react';
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5AD24] text-[#17130F] text-xs font-black uppercase tracking-wider border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F]">
          <Store className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Campus Food Locations</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#17130F] tracking-tight">
          Explore Campus Canteens
        </h1>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
          Browse food outlets across the campus, check live menu availability, and pre-order for immediate pickup between lectures.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#17130F] shadow-[4px_4px_0px_#17130F] flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by canteen name, dish, or block..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold placeholder:font-normal placeholder:text-gray-400"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-bold text-[#17130F] select-none bg-[#FCECCB]/60 hover:bg-[#FCECCB] px-3.5 py-2 rounded-xl border-2 border-[#17130F] transition-colors">
            <input
              type="checkbox"
              checked={acceptingOnly}
              onChange={(e) => setAcceptingOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#A91314] focus:ring-[#A91314] accent-[#A91314]"
            />
            <span>Accepting Orders Only</span>
          </label>
        </div>

      </div>

      {/* Outlets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-88 animate-pulse border-2 border-gray-200" />
          ))}
        </div>
      ) : outlets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#17130F] shadow-[5px_5px_0px_#17130F] p-8 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#FCECCB] text-[#590004] border-2 border-[#17130F] flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#17130F]">
            <Store className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="font-display text-xl font-black text-[#17130F] mb-2">No campus outlets found</h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto mb-6">
            Try adjusting your search criteria or uncheck the "Accepting Orders Only" filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setAcceptingOnly(false);
            }}
            className="px-5 py-2.5 bg-[#E5AD24] text-[#17130F] text-xs font-black rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
                className="bg-white rounded-3xl overflow-hidden border-2 border-[#17130F] shadow-[5px_5px_0px_#17130F] hover:shadow-[8px_8px_0px_#17130F] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col group"
              >
                {/* Outlet Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden border-b-2 border-[#17130F]">
                  <img
                    src={outlet.imageUrl}
                    alt={outlet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border-2 border-[#17130F] shadow-[2px_2px_0px_#17130F] ${
                        isAccepting
                          ? 'bg-emerald-400 text-[#17130F]'
                          : 'bg-rose-400 text-[#17130F]'
                      }`}
                    >
                      {isAccepting ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>

                {/* Outlet Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-black text-[#17130F] mb-1 group-hover:text-[#A91314] transition-colors leading-snug">
                      {outlet.name}
                    </h3>
                    
                    <p className="text-xs text-gray-600 flex items-center gap-1.5 mb-2.5 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#A91314] shrink-0 stroke-[2.5]" />
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
                            className="px-2 py-0.5 rounded-md bg-[#FCECCB] text-[#17130F] text-[11px] font-black border border-[#17130F]"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-gray-500" />
                      <span>{outlet._count?.menuItems || 0} items</span>
                    </span>

                    <Link
                      to={`/outlets/${outlet.id}`}
                      className="px-4 py-2 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-xs rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                    >
                      <span>View Menu</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
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
