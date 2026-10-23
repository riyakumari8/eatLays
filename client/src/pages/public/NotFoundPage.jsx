import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#FCECCB] text-[#590004] flex items-center justify-center mb-6 shadow-sm">
        <UtensilsCrossed className="w-8 h-8" />
      </div>
      <span className="font-mono text-sm font-black text-[#A91314] uppercase tracking-wider mb-1">
        404 Error
      </span>
      <h1 className="font-display text-4xl font-black text-[#250001] mb-2">
        Dish or Page Not Found
      </h1>
      <p className="text-gray-600 text-sm max-w-md mx-auto mb-8">
        We couldn't locate the campus page you requested. It might have been moved or doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-bold text-sm rounded-xl shadow transition-transform hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campus Home</span>
      </Link>
    </div>
  );
}
