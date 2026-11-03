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
        <div className="w-14 h-14 rounded-2xl bg-[#FF7900] text-[#19130F] border-2 border-[#19130F] shadow-[3px_3px_0px_#19130F] flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-[#19130F]">
          Sign in to eatLays
        </h2>
        <p className="text-xs sm:text-sm text-gray-700 font-bold">
          Campus Food Pre-Ordering & Queue Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Quick Demo Credentials Box */}
        <div className="mb-6 bg-[#FFF0B8] rounded-2xl p-4 border-2 border-[#19130F] shadow-[4px_4px_0px_#19130F]">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#19130F] mb-2.5">
            <Sparkles className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
            <span>Click to Autofill Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student@campus.edu', 'Student123!')}
              className="py-2 px-2 bg-white hover:bg-gray-50 border-2 border-[#19130F] rounded-xl text-[11px] font-black text-[#19130F] shadow-[2px_2px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 flex flex-col items-center gap-1 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('vendor.central@campus.edu', 'Vendor123!')}
              className="py-2 px-2 bg-white hover:bg-gray-50 border-2 border-[#19130F] rounded-xl text-[11px] font-black text-[#19130F] shadow-[2px_2px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 flex flex-col items-center gap-1 transition-all"
            >
              <Store className="w-4 h-4 text-[#FF7900] stroke-[2.5]" />
              <span>Vendor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin@campus.edu', 'Admin123!')}
              className="py-2 px-2 bg-white hover:bg-gray-50 border-2 border-[#19130F] rounded-xl text-[11px] font-black text-[#19130F] shadow-[2px_2px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 flex flex-col items-center gap-1 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF3D0A] stroke-[2.5]" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-[6px_6px_0px_#19130F] rounded-3xl border-2 border-[#19130F] sm:px-10 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#19130F] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#19130F] focus:outline-none focus:bg-[#FFF0B8]/30 text-sm font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#FF7900] hover:bg-[#E66D00] text-[#19130F] font-black text-sm rounded-xl border-2 border-[#19130F] shadow-[3.5px_3.5px_0px_#19130F] hover:shadow-[1px_1px_0px_#19130F] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t-2 border-gray-100 text-center">
            <p className="text-xs text-gray-700 font-bold">
              Don't have an eatLays student account?{' '}
              <Link to="/register" className="font-black text-[#FF3D0A] hover:underline">
                Create one now
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
