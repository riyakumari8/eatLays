import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  UtensilsCrossed, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/outlets', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#E5AD24] text-[#17130F] border-2 border-[#17130F] shadow-[3px_3px_0px_#17130F] flex items-center justify-center mx-auto">
          <UtensilsCrossed className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-[#17130F]">
          Join eatLays
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-semibold">
          Create a student account to pre-order food between lectures
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-[6px_6px_0px_#17130F] rounded-3xl border-2 border-[#17130F] sm:px-10 space-y-6">
          
          <div className="bg-[#FCECCB] p-3.5 rounded-2xl border-2 border-[#17130F] flex items-center gap-2.5 text-xs text-gray-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#A91314] shrink-0 stroke-[2.5]" />
            <span>Public registration creates standard <strong>Campus Student</strong> accounts.</span>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1.5">
                Campus Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1.5">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#17130F] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#17130F] focus:outline-none focus:bg-[#FCECCB]/30 text-sm font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#E5AD24] hover:bg-[#d69f1b] text-[#17130F] font-black text-sm rounded-xl border-2 border-[#17130F] shadow-[3.5px_3.5px_0px_#17130F] hover:shadow-[1px_1px_0px_#17130F] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t-2 border-gray-100 text-center">
            <p className="text-xs text-gray-600 font-semibold">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-[#A91314] hover:underline">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
