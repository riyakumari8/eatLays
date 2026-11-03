import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#17130F] shadow-[6px_6px_0px_#17130F] max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 border-2 border-[#17130F] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#17130F]">
          <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="font-display text-3xl font-black text-[#17130F]">
          Access Restricted
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
          You do not have the required permissions to view this campus dashboard. Please sign in with an authorized account.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-xs sm:text-sm rounded-xl border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Return to Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
