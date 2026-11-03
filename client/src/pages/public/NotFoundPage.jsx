import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#19130F] shadow-[6px_6px_0px_#19130F] max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FFF0B8] text-[#19130F] border-2 border-[#19130F] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#19130F]">
          <UtensilsCrossed className="w-8 h-8 stroke-[2.5]" />
        </div>
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#FF7900] text-[#19130F] font-mono text-xs font-black uppercase tracking-wider border-2 border-[#19130F] shadow-[2px_2px_0px_#19130F]">
          404 Error
        </span>
        <h1 className="font-display text-3xl font-black text-[#19130F]">
          Dish or Page Not Found
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm font-semibold leading-relaxed">
          We couldn't locate the campus page you requested. It might have been moved or doesn't exist.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-xs sm:text-sm rounded-xl border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
