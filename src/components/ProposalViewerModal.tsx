import React from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, CheckCircle2, Download, ExternalLink, Calendar, DollarSign, Building2, UserCheck, ShieldCheck } from 'lucide-react';

export const ProposalViewerModal: React.FC = () => {
  const { isProposalModalOpen, setIsProposalModalOpen } = useApp();

  if (!isProposalModalOpen) return null;

  const pdfUrl = '/assets/aistudio/Dream_Properties_Limited_Real_Estate_Proposal_dde43482.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Dream Properties Limited - Project Proposal</h3>
              <p className="text-xs text-slate-300">
                Official Proposal by MD Akhtarujjaman (Jadukit) | 6th Semester Project Benchmark
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProposalModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Key Facts Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="block text-xs text-slate-500 font-medium uppercase">Client</span>
              <span className="font-semibold text-slate-900">Dream Properties Ltd.</span>
              <span className="block text-xs text-slate-500">Gulshan 1, Dhaka</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium uppercase">Project Budget</span>
              <span className="font-semibold text-emerald-600">BDT 60,000</span>
              <span className="block text-xs text-slate-500">Fixed Cost Contract</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium uppercase">Delivery Timeline</span>
              <span className="font-semibold text-slate-900">4–6 Weeks</span>
              <span className="block text-xs text-slate-500">Milestone-based</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium uppercase">Prepared By</span>
              <span className="font-semibold text-slate-900">MD Akhtarujjaman</span>
              <span className="block text-xs text-slate-500">Jadukit Solutions</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-800 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>100% of Proposal Scope Implemented & Verified in this Live Suite</span>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Original Proposal PDF</span>
            </a>
          </div>

          {/* Scope Checklist Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Delivered Modules & Functionality Matrix
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
                <h5 className="font-semibold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  Section 2.A: Property Listing & Search
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Apartments, houses, commercial, and land plots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dedicated Buy and Rent search categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Multi-factor filters by location, price, type, and size</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Detailed property pages with photos, amenities & loan EMI calculator</span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
                <h5 className="font-semibold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <UserCheck className="w-4 h-4 text-slate-500" />
                  Section 2.B: User & Property Posting Portal
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>User registration, authentication & quick role switching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Interactive User Dashboard for landlords and buyers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Post new property with image uploads & preset gallery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Live status tracking: Pending, Approved, and Rejected</span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
                <h5 className="font-semibold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  Section 2.C: Admin Moderation Suite
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Review pending property submissions with one-click approve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Reject listings with custom reason sent to user dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Toggle homepage featured properties & listing visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Manage customer inquiries and scheduled site visits</span>
                  </li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
                <h5 className="font-semibold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Section 2.D & 2.E: Communication & Corporate
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Interactive Site-Visit Request system with reference codes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct phone call and WhatsApp instant chat action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Professional Corporate Homepage, About Us & Contact Us</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Gulshan 1 address representation & responsive mobile UI</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Schedule Breakdown */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Contract Payment Schedule (BDT 60,000)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-2">Milestone</th>
                  <th className="px-4 py-2">Percentage</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2.5 font-medium">Advance before development</td>
                  <td className="px-4 py-2.5">40%</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">BDT 24,000</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-medium">Completed</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">Main development milestone</td>
                  <td className="px-4 py-2.5">30%</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">BDT 18,000</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-medium">Completed</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">Final delivery & handover</td>
                  <td className="px-4 py-2.5">30%</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900">BDT 18,000</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-medium">Ready for Evaluation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Dream Properties Limited • House 07, Road 126, Gulshan 1, Dhaka
          </p>
          <button
            onClick={() => setIsProposalModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
