import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Lock, Eye, EyeOff, X, KeyRound, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    closeAdminLoginModal,
    loginAdminWithPassword,
    adminFailedAttempts,
    adminLockoutSeconds,
  } = useApp();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLockoutSeconds > 0) return;
    setError(null);

    const success = loginAdminWithPassword(password);
    if (!success) {
      setError(
        adminLockoutSeconds > 0
          ? `Security cooldown active! Please wait ${adminLockoutSeconds} seconds.`
          : 'Invalid admin password. Access to administrative controls was rejected.'
      );
    } else {
      setPassword('');
      setError(null);
    }
  };

  const handleUsePreset = (pass: string) => {
    if (adminLockoutSeconds > 0) return;
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Restricted Admin Access</h3>
              <p className="text-[11px] text-slate-400">
                Dream Properties Limited • Staff Clearance Required
              </p>
            </div>
          </div>
          <button
            onClick={closeAdminLoginModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-300">Admin Panel is Hidden & Protected</span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                The property approval queue, lead database, and homepage moderation controls require
                system administrator authentication.
              </p>
            </div>
          </div>

          {/* Rate Limit Banner */}
          {adminLockoutSeconds > 0 ? (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold block">Rate-Limit Cooldown Active</span>
                <span>Too many attempts. System locked for {adminLockoutSeconds}s.</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Identification / Email
            </label>
            <input
              type="text"
              readOnly
              value="admin@dreamproperties.bd (MD Akhtarujjaman)"
              className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-slate-800/80 text-slate-300 cursor-not-allowed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Specific Admin Password *
              </label>
              <span className="text-[10px] text-amber-400 font-medium">
                {adminFailedAttempts > 0 && adminLockoutSeconds === 0
                  ? `Failed: ${adminFailedAttempts}/3 attempts`
                  : 'Passphrase Protected'}
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={adminLockoutSeconds > 0}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder={adminLockoutSeconds > 0 ? 'Cooldown active...' : 'Enter admin password'}
                autoFocus
                required
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 bg-slate-800 text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Password Presets Helper */}
          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Specific Configured Passwords (Click to auto-fill):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={adminLockoutSeconds > 0}
                onClick={() => handleUsePreset('admin1234')}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md text-xs font-mono font-bold text-amber-300 transition-colors disabled:opacity-40"
              >
                admin1234
              </button>
              <button
                type="button"
                disabled={adminLockoutSeconds > 0}
                onClick={() => handleUsePreset('dream2026')}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md text-xs font-mono font-bold text-emerald-300 transition-colors disabled:opacity-40"
              >
                dream2026
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeAdminLoginModal}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adminLockoutSeconds > 0}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {adminLockoutSeconds > 0
                  ? `Locked (${adminLockoutSeconds}s)`
                  : 'Verify & Open Admin Panel'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
