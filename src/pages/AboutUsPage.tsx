import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Target,
  CheckCircle2,
  MapPin,
  FileText,
  Clock,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { setIsProposalModalOpen, setActiveView } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>About Dream Properties Limited</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Redefining Real Estate Excellence in Bangladesh
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Headquartered in Gulshan 1, Dhaka, Dream Properties Limited is a next-generation real
          estate marketplace and development advisory empowering property owners, investors, and
          home seekers with transparent, verified transactions.
        </p>
      </div>

      {/* Corporate Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Rigorous Legal Scrutiny</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every property listed on our marketplace undergoes multi-tier due diligence: title deed
            authentication, CS/RS/BS mutation verification, and RAJUK sanction plan vetting.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Zero Hidden Brokerage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct owner-to-buyer connectivity eliminates arbitrary broker markups, ensuring true
            market pricing for buyers and optimal returns for property landlords.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Professional Accompaniment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our certified property officers guide you on physical site inspections, provide structural
            blueprints, and assist with bank loan processing through BRAC, City Bank, and DBH.
          </p>
        </div>
      </div>

      {/* Mission & Vision Statement */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 grid md:grid-cols-2 gap-8 items-center shadow-xl">
        <div className="space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Our Purpose
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
            Building Digital Trust in Dhaka's Property Landscape
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Bangladesh's urban centers are developing at unprecedented speed. We provide the digital
            infrastructure, transparent pricing databases, and verification workflows required to make
            property acquisition seamless and stress-free.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect Project Development Proposal</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">
            Operational Benchmarks
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>All properties vetted by legal officers before publication</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Full compliance with Real Estate Development & Management Act</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Free scheduled visits with dedicated company transport assistance</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Digital customer portal for instantaneous owner communication</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Office & Team Highlights */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900">Corporate Headquarters</h2>
          <p className="text-xs text-slate-500 mt-1">
            Centrally situated behind the Renaissance Hotel in Gulshan 1, Dhaka
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Dream Properties Limited</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                House 07, Road 126, Behind Renaissance Hotel, Gulshan 1, Dhaka, Bangladesh
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                <span>Working Hours: Sat - Thu (9:00 AM - 7:00 PM)</span>
                <span>Hotline: +880 1711-234567</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('contact')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            Visit Contact Desk
          </button>
        </div>
      </div>
    </div>
  );
};
