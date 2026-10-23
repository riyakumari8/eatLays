import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UtensilsCrossed, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Store,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      
      // Determine redirect path
      const targetPath = location.state?.from?.pathname;
      if (targetPath) {
        navigate(targetPath, { replace: true });
      } else if (user.role === 'VENDOR') {
        navigate('/vendor/dashboard', { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/outlets', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#590004] text-[#FFB607] flex items-center justify-center mx-auto shadow-md">
          <UtensilsCrossed className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h2 className="font-display text-3xl font-black text-[#250001]">
          Sign in to eatLays
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Campus Food Pre-Ordering & Queue Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Quick Demo Credentials Box */}
        <div className="mb-6 bg-[#FCECCB]/50 rounded-2xl p-4 border border-[#e5d4b0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#590004] mb-2">
            <Sparkles className="w-4 h-4 text-[#A91314]" />
            <span>Click to Autofill Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student@campus.edu', 'Student123!')}
              className="py-1.5 px-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-800 shadow-xs flex flex-col items-center gap-0.5 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#A91314]" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('vendor.central@campus.edu', 'Vendor123!')}
              className="py-1.5 px-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-800 shadow-xs flex flex-col items-center gap-0.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#590004]" />
              <span>Vendor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin@campus.edu', 'Admin123!')}
              className="py-1.5 px-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-800 shadow-xs flex flex-col items-center gap-0.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#236092]" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-gray-200 sm:px-10 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center gap-2 text-xs text-rose-800 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB607] focus:ring-2 focus:ring-[#FFB607]/20 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB607] focus:ring-2 focus:ring-[#FFB607]/20 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#FFB607] hover:bg-[#ffc634] text-[#250001] font-display text-sm tracking-wide rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Don't have an eatLays student account?{' '}
              <Link to="/register" className="font-bold text-[#A91314] hover:underline">
                Create one now
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
