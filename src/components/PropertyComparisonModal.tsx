import React from 'react';
import { useApp } from '../context/AppContext';
import { formatBDTPrice, calculatePricePerSqFt, calculateMortgageEMI } from '../utils/formatters';
import {
  X,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Building,
  Trash2,
} from 'lucide-react';

export const PropertyComparisonModal: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    openSiteVisitModal,
    openInquiryModal,
    setSelectedProperty,
  } = useApp();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Property Comparison Matrix</h3>
              <p className="text-xs text-slate-300">
                Side-by-side technical, financial & amenity evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto overflow-x-auto text-xs">
          {compareList.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ArrowRightLeft className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No properties selected for comparison</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the "Compare" button on any 2 or 3 property cards to review their price,
                specifications, and facilities side-by-side.
              </p>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="min-w-[650px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 text-left w-48 text-slate-400 uppercase font-bold text-[11px]">
                      Parameter
                    </th>
                    {compareList.map((p) => (
                      <th key={p.id} className="p-3 text-left min-w-[200px] align-top">
                        <div className="space-y-2">
                          <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 group">
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeFromCompare(p.id)}
                              className="absolute top-1.5 right-1.5 p-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span
                            onClick={() => {
                              setIsCompareModalOpen(false);
                              setSelectedProperty(p);
                            }}
                            className="font-bold text-slate-900 line-clamp-1 block hover:text-emerald-700 cursor-pointer text-xs"
                          >
                            {p.title}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Price */}
                  <tr className="bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">Total Price</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-extrabold text-emerald-700 text-sm">
                        {formatBDTPrice(p.price, p.purpose === 'rent', p.rentPeriod)}
                      </td>
                    ))}
                  </tr>

                  {/* Price Per Sq Ft */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Price / Sq.Ft</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-bold text-slate-800">
                        {p.purpose === 'buy' ? calculatePricePerSqFt(p.price, p.areaSqFt) : 'Rental Lease'}
                      </td>
                    ))}
                  </tr>

                  {/* Monthly Loan EMI */}
                  <tr className="bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-600">Est. Loan EMI (15 Yrs)</td>
                    {compareList.map((p) => {
                      if (p.purpose === 'rent') return <td key={p.id} className="p-3 text-slate-400">N/A (Rental)</td>;
                      const emi = calculateMortgageEMI(p.price, 20, 9.5, 15);
                      return (
                        <td key={p.id} className="p-3 font-bold text-slate-800">
                          ৳ {emi.monthlyPayment.toLocaleString('en-IN')}/mo
                        </td>
                      );
                    })}
                  </tr>

                  {/* Location & City */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Location</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <span className="font-bold text-slate-900">{p.location}</span>, {p.city}
                      </td>
                    ))}
                  </tr>

                  {/* Property Type */}
                  <tr className="bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-600">Type & Purpose</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 capitalize">
                        {p.propertyType} (For {p.purpose})
                      </td>
                    ))}
                  </tr>

                  {/* Area */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Total Space</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-bold text-slate-900">
                        {p.areaSqFt} {p.unitType}
                      </td>
                    ))}
                  </tr>

                  {/* Bed / Bath / Balcony */}
                  <tr className="bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-600">Rooms & Layout</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.bedrooms > 0 ? `${p.bedrooms} Beds • ${p.bathrooms} Baths • ${p.balconies} Balconies` : 'Open Commercial Floor'}
                      </td>
                    ))}
                  </tr>

                  {/* Floor */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Floor Level</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.floor > 0 ? `${p.floor}th of ${p.totalFloors}` : 'Ground'}
                      </td>
                    ))}
                  </tr>

                  {/* Facing */}
                  <tr className="bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-600">Facing Direction</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.facing || 'Not specified'}
                      </td>
                    ))}
                  </tr>

                  {/* RAJUK Approved */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">RAJUK Compliance</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.rajukApproved ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Approved
                          </span>
                        ) : (
                          <span className="text-slate-400">Under Review</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 font-bold text-slate-900">Quick Actions</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 space-y-1.5">
                        <button
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            openSiteVisitModal(p);
                          }}
                          className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Schedule Visit</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            openInquiryModal(p);
                          }}
                          className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Send Inquiry</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
