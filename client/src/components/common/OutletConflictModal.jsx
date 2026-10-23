import React from 'react';
import { useCart } from '../../context/CartContext';
import { AlertCircle, Store, ArrowRight, X } from 'lucide-react';

export default function OutletConflictModal() {
  const { conflictModal, confirmSwitchOutlet, cancelSwitchOutlet } = useCart();

  if (!conflictModal) return null;

  const { existingOutlet, newOutlet, newItem } = conflictModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#A91314]/20 relative">
        <button
          onClick={cancelSwitchOutlet}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#A91314]/10 text-[#A91314] flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="font-display text-xl text-[#250001] mb-2">
          Replace Cart Items?
        </h3>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Your cart currently contains items from <strong className="text-[#590004]">{existingOutlet.name}</strong>. Because food is prepared fresh for counter pickup, each order must belong to a single campus canteen.
        </p>

        <div className="bg-[#FCECCB]/40 rounded-xl p-3 border border-[#FCECCB] mb-5 text-xs text-gray-700 space-y-1">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#A91314]" />
            <span>Switch to: <strong>{newOutlet.name}</strong></span>
          </div>
          <div className="text-gray-500 pl-6">
            Adding: <strong>{newItem.name}</strong> (₹{Number(newItem.price).toFixed(2)})
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={confirmSwitchOutlet}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#A91314] hover:bg-[#850003] text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Clear & Add New</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={cancelSwitchOutlet}
            className="py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-colors"
          >
            Keep Existing Cart
          </button>
        </div>
      </div>
    </div>
  );
}
