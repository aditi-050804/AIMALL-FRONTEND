import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Cpu, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { AppRoute } from '../types';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === AppRoute.SIGNUP;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(AppRoute.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">

      {/* Background */}
      <div className="absolute inset-0 bg-[#0f0c29]">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#24243e] to-[#0f0c29] opacity-80" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo + Title */}
        <div className="mb-8 text-center">
          <div className="inline-block p-3 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl shadow-purple-900/40 mb-4">
            <Cpu className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          <p className="text-gray-400">
            {isSignup ? 'Join AI Mall to unlock full access' : 'Sign in to continue to AI Mall'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                <div className="flex items-center w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-500 transition-all">
                  <User className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="flex items-center w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-500 transition-all">
                <Mail className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="flex items-center w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-violet-500 transition-all">
                <Lock className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transform hover:scale-[1.02] transition-all duration-200"
            >
              {isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Switch link */}
          <div className="mt-8 text-center text-sm text-gray-400">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to={AppRoute.LOGIN} className="text-violet-400 hover:text-violet-300 font-medium">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to={AppRoute.SIGNUP} className="text-violet-400 hover:text-violet-300 font-medium">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Back Button */}
        <Link
          to={AppRoute.LANDING}
          className="mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

      </div>
    </div>
  );
};

export default Auth;