import React from 'react';
import { Property } from '../types';
import { formatBDTPrice, calculatePricePerSqFt, calculateBDRegistrationCosts } from '../utils/formatters';
import { X, Printer, Building2, MapPin, Phone, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrintBrochureModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintBrochureModal: React.FC<PrintBrochureModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !property) return null;

  const regCosts = calculateBDRegistrationCosts(property.price);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Actions Bar (Hidden during actual print) */}
        <div className="print:hidden px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Property Factsheet & Brochure</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 printable-document">
          {/* Company Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-900 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Dream Properties Limited
                </h2>
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">
                  Real Estate Marketplace & Development Suite
                </span>
                <span className="text-[11px] text-slate-500">
                  House 07, Road 126, Behind Renaissance Hotel, Gulshan 1, Dhaka
                </span>
              </div>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <span className="font-bold text-slate-900 block">DPL Factsheet Ref: #{property.id.toUpperCase()}</span>
              <span className="text-slate-500 block">Date of Issue: {new Date().toLocaleDateString('en-GB')}</span>
              <span className="text-emerald-700 font-bold block">Hotline: +880 1711-234567</span>
            </div>
          </div>

          {/* Headline & Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded">
                  For {property.purpose}
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded">
                  {property.propertyType}
                </span>
                {property.rajukApproved && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> RAJUK Sanctioned
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-slate-900 leading-snug">{property.title}</h1>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{property.address}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-emerald-700 block">
                {formatBDTPrice(property.price, property.purpose === 'rent', property.rentPeriod)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {calculatePricePerSqFt(property.price, property.areaSqFt)}
              </span>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-3 gap-2">
            {property.images.slice(0, 3).map((img, i) => (
              <div key={i} className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Specifications Table */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Technical Specifications
            </h3>
            <table className="w-full text-xs border border-slate-200">
              <tbody className="divide-y divide-slate-200">
                <tr className="divide-x divide-slate-200">
                  <td className="p-2 font-semibold bg-slate-50 w-1/4">Total Space</td>
                  <td className="p-2 w-1/4">{property.areaSqFt} {property.unitType}</td>
                  <td className="p-2 font-semibold bg-slate-50 w-1/4">Floor Level</td>
                  <td className="p-2 w-1/4">{property.floor > 0 ? `${property.floor}th of ${property.totalFloors}` : 'Ground'}</td>
                </tr>
                <tr className="divide-x divide-slate-200">
                  <td className="p-2 font-semibold bg-slate-50">Bedrooms / Baths</td>
                  <td className="p-2">{property.bedrooms} Bed, {property.bathrooms} Bath</td>
                  <td className="p-2 font-semibold bg-slate-50">Balconies</td>
                  <td className="p-2">{property.balconies} Balconies</td>
                </tr>
                <tr className="divide-x divide-slate-200">
                  <td className="p-2 font-semibold bg-slate-50">Facing Orientation</td>
                  <td className="p-2">{property.facing || 'South'}</td>
                  <td className="p-2 font-semibold bg-slate-50">Handover Status</td>
                  <td className="p-2">{property.handoverDate || 'Immediate Occupancy'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1 border-b border-slate-200 pb-1">
              Property Overview & Legal Remarks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
              Building Amenities & Security Infrastructure
            </h3>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Bangladesh Registration Costs (For Buy Purpose) */}
          {property.purpose === 'buy' && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-1.5 border-b border-slate-200 pb-1">
                Estimated Government Registration & Stamp Duties (Bangladesh)
              </h3>
              <table className="w-full text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-left">Fee Component</th>
                    <th className="p-2 text-left">Rate</th>
                    <th className="p-2 text-right">Estimated Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2">Stamp Duty</td>
                    <td className="p-2">1.5%</td>
                    <td className="p-2 text-right font-mono">{formatBDTPrice(regCosts.stampDuty)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">Sub-Registry Office Fee</td>
                    <td className="p-2">1.0%</td>
                    <td className="p-2 text-right font-mono">{formatBDTPrice(regCosts.registrationFee)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">Local Government Tax (DNCC / DSCC)</td>
                    <td className="p-2">2.0%</td>
                    <td className="p-2 text-right font-mono">{formatBDTPrice(regCosts.localGovtTax)}</td>
                  </tr>
                  <tr>
                    <td className="p-2">AIT / Gain Tax (Section 53C)</td>
                    <td className="p-2">4.0%</td>
                    <td className="p-2 text-right font-mono">{formatBDTPrice(regCosts.gainTaxAIT)}</td>
                  </tr>
                  <tr className="bg-emerald-50 font-bold text-slate-900">
                    <td className="p-2" colSpan={2}>Total Estimated Registration Cost</td>
                    <td className="p-2 text-right text-emerald-800 font-mono text-sm">{formatBDTPrice(regCosts.totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Agent & Office Contact Footer */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Dream Properties Limited Representation Desk</span>
              <span className="text-slate-500">Authorized Agent: {property.postedBy.name} ({property.postedBy.phone})</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700 block">Direct Booking Hotline: +880 1711-234567</span>
              <span className="text-slate-500">Website: https://dreamproperties.bd</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
