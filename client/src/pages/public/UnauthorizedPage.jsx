import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="font-display text-3xl font-black text-[#250001] mb-2">
        Access Restricted
      </h1>
      <p className="text-gray-600 text-sm max-w-md mx-auto mb-8">
        You do not have the required permissions to view this campus dashboard. Please sign in with an authorized account.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#A91314] text-white font-bold text-sm rounded-xl shadow transition-transform hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Campus Home</span>
      </Link>
    </div>
  );
}
