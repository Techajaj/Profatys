import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { PropertyModal } from './components/PropertyModal';
import { SiteVisitModal } from './components/SiteVisitModal';
import { InquiryModal } from './components/InquiryModal';
import { AuthModal } from './components/AuthModal';
import { ProposalViewerModal } from './components/ProposalViewerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { PrintBrochureModal } from './components/PrintBrochureModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ListingSearchPage } from './pages/ListingSearchPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';

import { FileText, Shield, Lock, UserCheck, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    setIsProposalModalOpen,
    setIsAuthModalOpen,
    currentUser,
    quickSwitchRole,
    isAdminAuthenticated,
    openAdminLoginModal,
    logoutAdmin,
    selectedProperty,
    isBrochureModalOpen,
    setIsBrochureModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Main Top Header */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'search' && <ListingSearchPage />}
        {activeView === 'dashboard' && <UserDashboardPage />}
        {activeView === 'admin' && <AdminDashboardPage />}
        {activeView === 'about' && <AboutUsPage />}
        {activeView === 'contact' && <ContactUsPage />}
      </main>

      {/* Floating 6th Semester Evaluation Toolbar (Subtle Bottom-Left) */}
      <aside aria-label="Demo role and proposal quick controls" className="fixed bottom-4 left-4 z-30 hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white p-1.5 rounded-2xl shadow-2xl border border-slate-700/60 text-xs">
        <button
          onClick={() => setIsProposalModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-xs"
          title="Inspect Project Development Proposal & PDF"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Proposal & Scope</span>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex items-center gap-1 px-1">
          <span className="text-[10px] text-slate-400 font-medium">Role:</span>
          <button
            onClick={() => quickSwitchRole('owner')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              currentUser.role === 'owner'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Owner
          </button>
          <button
            onClick={() => quickSwitchRole('buyer')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              currentUser.role === 'buyer'
                ? 'bg-sky-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buyer
          </button>

          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1 bg-amber-500/20 px-1 py-0.5 rounded-lg border border-amber-500/30">
              <button
                onClick={() => quickSwitchRole('admin')}
                className="text-[10px] font-bold text-amber-300 flex items-center gap-1 px-1"
                title="Go to Admin Panel"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Admin</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="text-[9px] text-rose-400 hover:text-white px-1"
                title="Lock Admin Session"
              >
                Lock
              </button>
            </div>
          ) : (
            <button
              onClick={openAdminLoginModal}
              className="px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 border border-slate-700/80"
              title="Admin Panel is password protected"
            >
              <Lock className="w-2.5 h-2.5 text-slate-400" />
              <span>Admin (Protected)</span>
            </button>
          )}
        </div>
      </aside>

      {/* Global Modals & Notifications */}
      <PropertyModal />
      <SiteVisitModal />
      <InquiryModal />
      <AuthModal />
      <AdminLoginModal />
      <ProposalViewerModal />
      <PropertyComparisonModal />
      <PrintBrochureModal
        property={selectedProperty}
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
      />
      <ToastContainer />

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
