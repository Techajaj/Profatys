import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActiveView,
    setIsProposalModalOpen,
    setFilterState,
    isAdminAuthenticated,
    openAdminLoginModal,
  } = useApp();

  const handleCategoryClick = (purpose?: 'buy' | 'rent', type?: any) => {
    setFilterState((prev) => ({
      ...prev,
      purpose: purpose || 'all',
      propertyType: type || 'all',
    }));
    setActiveView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800 text-xs">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  Dream Properties Limited
                </span>
                <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Real Estate Marketplace
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              The premier digital real estate platform in Bangladesh connecting genuine property
              owners, developers, and prospective buyers across Dhaka and metropolitan cities.
            </p>

            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  House 07, Road 126, Behind Renaissance Hotel, Gulshan 1, Dhaka, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+880 1711-234567 / +880 2-9887766</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>info@dreamproperties.bd</span>
              </div>
            </div>
          </div>

          {/* Quick Properties */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Property Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('buy', 'apartment')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Apartments for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('rent', 'apartment')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Flats for Rent
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('buy', 'house')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Luxury Duplex & Houses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick(undefined, 'commercial')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Commercial Office Spaces
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('buy', 'land')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Residential Land & Plots
                </button>
              </li>
            </ul>
          </div>

          {/* Top Locations */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Prime Dhaka Zones
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setFilterState((p) => ({ ...p, location: 'Gulshan' }));
                    setActiveView('search');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Gulshan 1 & 2
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilterState((p) => ({ ...p, location: 'Banani' }));
                    setActiveView('search');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Banani Residential
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilterState((p) => ({ ...p, location: 'Dhanmondi' }));
                    setActiveView('search');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Dhanmondi Lake Area
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilterState((p) => ({ ...p, location: 'Uttara' }));
                    setActiveView('search');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Uttara Model Town
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilterState((p) => ({ ...p, location: 'Bashundhara' }));
                    setActiveView('search');
                  }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Bashundhara R/A
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Proposal Reference */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Project Specification
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Developed according to the 6th semester Computer Technology project proposal submitted by
              MD Akhtarujjaman (Jadukit).
            </p>
            <div className="pt-1 space-y-2">
              <button
                onClick={() => setIsProposalModalOpen(true)}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Proposal Specs</span>
              </button>
              <div className="text-[10px] text-slate-500 space-y-1">
                <span>References: property.bd • bdhousing.com • skhpropertiesbd.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Dream Properties Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button onClick={() => setActiveView('about')} className="hover:text-white">
              About Us
            </button>
            <span>•</span>
            <button onClick={() => setActiveView('contact')} className="hover:text-white">
              Contact & Map
            </button>
            <span>•</span>
            <button onClick={() => setIsProposalModalOpen(true)} className="hover:text-white">
              Proposal PDF
            </button>
            <span>•</span>
            <button
              onClick={isAdminAuthenticated ? () => setActiveView('admin') : openAdminLoginModal}
              className="hover:text-amber-400 text-slate-500"
              title="Restricted Staff Administration Access"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
