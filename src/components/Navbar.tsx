import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  PlusCircle,
  Heart,
  Shield,
  User,
  Menu,
  X,
  FileText,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MapPin,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    favorites,
    compareList,
    setIsCompareModalOpen,
    properties,
    isAdminAuthenticated,
    openAdminLoginModal,
    logoutAdmin,
    setIsAuthModalOpen,
    setIsProposalModalOpen,
    setFilterState,
    quickSwitchRole,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const pendingCount = properties.filter((p) => p.status === 'pending').length;

  const navigateToSearch = (purpose?: 'buy' | 'rent', type?: 'commercial') => {
    setFilterState((prev) => ({
      ...prev,
      purpose: purpose || 'all',
      propertyType: type || 'all',
    }));
    setActiveView('search');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro bar with address & proposal alert */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>House 07, Road 126, Behind Renaissance Hotel, Gulshan 1, Dhaka</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>Hotline: +880 1711-234567</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">RAJUK Approved Real Estate Marketplace</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProposalModalOpen(true)}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <FileText className="w-3 h-3" />
            <span>Project Proposal (BDT 60,000 / 6th Sem Benchmark)</span>
          </button>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Logged in:</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-white hover:text-emerald-300 font-bold underline decoration-dotted transition-colors"
            >
              {currentUser.name} ({currentUser.role.toUpperCase()})
            </button>
            {isAdminAuthenticated ? (
              <button
                onClick={logoutAdmin}
                className="ml-2 text-rose-400 hover:text-rose-300 font-bold text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30"
              >
                Lock Admin
              </button>
            ) : (
              <button
                onClick={openAdminLoginModal}
                className="ml-1 text-slate-400 hover:text-amber-400 text-[10px] underline"
              >
                Staff Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Dream Properties
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hidden sm:inline">
                Limited
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5 hidden sm:block">
              Dhaka Real Estate Marketplace
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeView === 'home'
                ? 'text-emerald-700 font-bold bg-emerald-50'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateToSearch('buy')}
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Buy Property
          </button>
          <button
            onClick={() => navigateToSearch('rent')}
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Rent
          </button>
          <button
            onClick={() => navigateToSearch(undefined, 'commercial')}
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Commercial
          </button>
          <button
            onClick={() => {
              setActiveView('search');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeView === 'search'
                ? 'text-emerald-700 font-bold bg-emerald-50'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Explore All
          </button>
          <button
            onClick={() => setActiveView('about')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeView === 'about'
                ? 'text-emerald-700 font-bold bg-emerald-50'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => setActiveView('contact')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeView === 'contact'
                ? 'text-emerald-700 font-bold bg-emerald-50'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Property CTA */}
          <button
            onClick={() => {
              setActiveView('dashboard');
              setMobileMenuOpen(false);
            }}
            className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Post Property</span>
            <span className="xs:hidden">Post</span>
          </button>

          {/* Admin Dashboard Portal link (ONLY SHOWN IF ADMIN IS AUTHENTICATED WITH PASSWORD) */}
          {isAdminAuthenticated && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-xl p-1">
              <button
                onClick={() => {
                  setActiveView('admin');
                  setMobileMenuOpen(false);
                }}
                className={`relative px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold ${
                  activeView === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white text-slate-900 hover:bg-amber-50'
                }`}
                title="Admin Moderation Portal"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Admin</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-bold rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                onClick={logoutAdmin}
                className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                title="Lock & Exit Admin Mode"
              >
                Exit
              </button>
            </div>
          )}

          {/* Compare Matrix CTA */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl relative transition-colors flex items-center gap-1.5"
            title="Side-by-Side Property Comparison Matrix"
          >
            <ArrowRightLeft className="w-5 h-5" />
            {compareList.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Saved Favorites counter */}
          <button
            onClick={() => {
              setActiveView('dashboard');
            }}
            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-xl relative transition-colors"
            title="Saved Properties"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* User Account / Switcher menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden xl:block">
                <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-slate-500 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <span className="font-bold text-slate-900 block truncate">{currentUser.name}</span>
                  <span className="text-[11px] text-slate-500 block truncate">{currentUser.email}</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    Role: {currentUser.role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                    <span>User Dashboard & Submissions</span>
                  </button>

                  {isAdminAuthenticated ? (
                    <button
                      onClick={() => setActiveView('admin')}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-amber-700 font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Admin Approvals ({pendingCount} pending)</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        openAdminLoginModal();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-500"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>Staff / Admin Portal (Password)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setIsCompareModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                      <span>Compare Matrix</span>
                    </div>
                    {compareList.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {compareList.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setIsProposalModalOpen(true)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Proposal & Semester Scope</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1.5 px-4 pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Quick Role Switch:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => quickSwitchRole('admin')}
                      className={`py-1 text-[10px] rounded font-semibold border ${
                        currentUser.role === 'admin'
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => quickSwitchRole('owner')}
                      className={`py-1 text-[10px] rounded font-semibold border ${
                        currentUser.role === 'owner'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      Owner
                    </button>
                    <button
                      onClick={() => quickSwitchRole('buyer')}
                      className={`py-1 text-[10px] rounded font-semibold border ${
                        currentUser.role === 'buyer'
                          ? 'bg-sky-600 text-white border-sky-700'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      Buyer
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-rose-600"
                  >
                    <User className="w-4 h-4" />
                    <span>Switch or Manage Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 text-sm">
          <button
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => navigateToSearch('buy')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
          >
            Buy Properties
          </button>
          <button
            onClick={() => navigateToSearch('rent')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
          >
            Rent Properties
          </button>
          <button
            onClick={() => navigateToSearch(undefined, 'commercial')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
          >
            Commercial Spaces
          </button>
          <button
            onClick={() => {
              setActiveView('search');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
          >
            Search & Filter Marketplace
          </button>
          <button
            onClick={() => {
              setActiveView('dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800 flex items-center justify-between"
          >
            <span>User Dashboard & My Listings</span>
          </button>
          <button
            onClick={() => {
              setIsCompareModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
              <span>Compare Properties</span>
            </span>
            {compareList.length > 0 && (
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
                {compareList.length}
              </span>
            )}
          </button>
          {isAdminAuthenticated ? (
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-amber-700 flex items-center justify-between"
            >
              <span>Admin Approvals & Management</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdminLoginModal();
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-500 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Staff / Admin Login (Password)</span>
            </button>
          )}
          <button
            onClick={() => {
              setIsProposalModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-emerald-700 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Proposal & 6th Sem Benchmark</span>
          </button>
          <button
            onClick={() => {
              setActiveView('about');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
          >
            About Dream Properties
          </button>
          <button
            onClick={() => {
              setActiveView('contact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-100 font-medium text-slate-800"
          >
            Contact & Office Location
          </button>
        </div>
      )}
    </header>
  );
};
