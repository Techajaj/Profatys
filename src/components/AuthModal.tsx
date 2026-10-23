import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/mockData';
import { UserRole } from '../types';
import { X, Shield, Building, User, LogIn, UserPlus, Check, RotateCcw } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    setCurrentUser,
    addToast,
    resetAllDemoData,
    isAdminAuthenticated,
    openAdminLoginModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('owner');

  if (!isAuthModalOpen) return null;

  const handleCustomRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast('Please fill in required fields', 'error');
      return;
    }
    const newUser = {
      id: `user_${Date.now().toString().slice(-6)}`,
      name,
      email,
      phone: phone || '+880 1700-000000',
      role,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
    addToast(`Account created & signed in as ${name}!`, 'success');
    setIsAuthModalOpen(false);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please enter your email', 'error');
      return;
    }
    if (email.toLowerCase().includes('admin')) {
      if (!isAdminAuthenticated) {
        setIsAuthModalOpen(false);
        openAdminLoginModal();
        addToast('Admin accounts require administrator password authentication', 'info');
        return;
      }
    }
    const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      addToast(`Welcome back, ${matched.name}!`, 'success');
    } else {
      // Create guest session
      const guest = {
        id: `user_${Date.now().toString().slice(-5)}`,
        name: email.split('@')[0],
        email,
        phone: '+880 1711-000000',
        role: 'buyer' as UserRole,
        registeredAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(guest);
      addToast(`Signed in as ${guest.name}`, 'success');
    }
    setIsAuthModalOpen(false);
  };

  const handleSelectDemoUser = (demo: typeof DEMO_USERS[0]) => {
    if (demo.role === 'admin' && !isAdminAuthenticated) {
      setIsAuthModalOpen(false);
      openAdminLoginModal();
      addToast('Admin panel is protected. Please enter admin password.', 'info');
      return;
    }
    setCurrentUser(demo);
    addToast(`Switched active profile to ${demo.name} (${demo.role.toUpperCase()})`, 'info');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">User Access & Profiles</h3>
            <p className="text-xs text-slate-500">
              Dream Properties Real Estate Marketplace Suite
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick 1-Click Role Switcher for Semester Evaluation */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Instant 1-Click Demo Profiles (Semester Viva Ready)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((demo) => {
                const isCurrent = currentUser.email === demo.email;
                return (
                  <button
                    key={demo.id}
                    onClick={() => handleSelectDemoUser(demo)}
                    className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-semibold'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center mb-1 text-slate-600">
                      {demo.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-amber-600" />
                      ) : demo.role === 'owner' ? (
                        <Building className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <User className="w-4 h-4 text-sky-600" />
                      )}
                    </div>
                    <span className="text-xs font-bold capitalize">{demo.role}</span>
                    <span className="text-[10px] text-slate-500 truncate w-full">
                      {demo.name.split(' ')[0]}
                    </span>
                    {isCurrent && (
                      <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700">
                        <Check className="w-2.5 h-2.5" /> Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">
              Or Custom Sign In / Sign Up
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center transition-colors border-b-2 ${
                activeTab === 'signin'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center transition-colors border-b-2 ${
                activeTab === 'register'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Create New Account
            </button>
          </div>

          {activeTab === 'signin' ? (
            <form onSubmit={handleCustomLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. shafiul.alam@gmail.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="demo1234"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" /> Sign In to Portal
              </button>
            </form>
          ) : (
            <form onSubmit={handleCustomRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tariqul@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone (Bangladesh)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711-xxxxxx"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      role === 'owner'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Property Owner / Landlord
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      role === 'buyer'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Buyer / Tenant
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" /> Complete Registration
              </button>
            </form>
          )}

          {/* Reset Demo Data Helper */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Need fresh sample listings?</span>
            <button
              onClick={resetAllDemoData}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Sample Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
