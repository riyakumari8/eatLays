import React from 'react';
import { useCart } from '../../context/CartContext';
import { AlertCircle, Store, ArrowRight, X } from 'lucide-react';

export default function OutletConflictModal() {
  const { conflictModal, confirmSwitchOutlet, cancelSwitchOutlet } = useCart();

  if (!conflictModal) return null;

  const { existingOutlet, newOutlet, newItem } = conflictModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[8px_8px_0px_#19130F] border-2 border-[#19130F] relative">
        <button
          onClick={cancelSwitchOutlet}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 border border-gray-200"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#FFF0B8] text-[#FF3D0A] border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F] flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 stroke-[2.5]" />
        </div>

        <h3 className="font-display text-2xl font-black text-[#19130F] mb-2">
          Replace Cart Items?
        </h3>

        <p className="text-sm text-gray-700 mb-4 leading-relaxed font-bold">
          Your cart currently contains items from <strong className="text-[#FF3D0A]">{existingOutlet.name}</strong>. Because food is prepared fresh for counter pickup, each order must belong to a single campus canteen.
        </p>

        <div className="bg-[#FFF0B8] rounded-2xl p-4 border-2 border-[#19130F] mb-6 text-xs text-gray-800 space-y-1 font-black">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
            <span>Switch to: <strong className="text-[#19130F]">{newOutlet.name}</strong></span>
          </div>
          <div className="text-gray-600 pl-6">
            Adding: <strong>{newItem.name}</strong> (₹{Number(newItem.price).toFixed(2)})
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={confirmSwitchOutlet}
            className="flex-1 py-3 px-4 rounded-xl bg-[#FF3D0A] hover:bg-[#E03508] text-white font-black text-xs sm:text-sm border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Clear & Add New</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            onClick={cancelSwitchOutlet}
            className="py-3 px-4 rounded-xl border-2 border-[#19130F] text-[#19130F] hover:bg-gray-50 font-black text-xs sm:text-sm transition-all shadow-[2px_2px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5"
          >
            Keep Existing Cart
          </button>
        </div>
      </div>
    </div>
  );
}
