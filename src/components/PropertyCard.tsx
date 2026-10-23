import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { formatBDTPrice, calculatePricePerSqFt } from '../utils/formatters';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRightLeft,
  ShieldCheck,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  showAdminStatus?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showAdminStatus = false,
}) => {
  const {
    favorites,
    toggleFavorite,
    setSelectedProperty,
    openSiteVisitModal,
    compareList,
    addToCompare,
    removeFromCompare,
  } = useApp();

  const isFavorited = favorites.includes(property.id);
  const isCompared = compareList.some((p) => p.id === property.id);

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => setSelectedProperty(property)}
        />

        {/* Top Badges / Indicators */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md text-white shadow-sm ${
                property.purpose === 'buy' ? 'bg-slate-900' : 'bg-emerald-700'
              }`}
            >
              For {property.purpose === 'buy' ? 'Sale' : 'Rent'}
            </span>

            {property.isFeatured && (
              <span className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-500 text-slate-950 shadow-sm">
                Featured
              </span>
            )}

            {showAdminStatus && (
              <span
                className={`px-2 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 shadow-sm ${
                  property.status === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : property.status === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {property.status === 'approved' ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : property.status === 'pending' ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {property.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* Right Action Chips (Favorite & Compare) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isCompared) {
                  removeFromCompare(property.id);
                } else {
                  addToCompare(property);
                }
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isCompared
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900/40 text-white hover:bg-slate-900/70'
              }`}
              title={isCompared ? 'Remove from comparison matrix' : 'Add to compare matrix'}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            {/* Favorite button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isFavorited
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-900/40 text-white hover:bg-slate-900/70'
              }`}
              title={isFavorited ? 'Remove from saved' : 'Save property'}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom tags */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-medium pointer-events-none">
          {property.postedBy.isNidVerified ? (
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-xs text-emerald-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Landlord
            </span>
          ) : (
            <span />
          )}

          <span className="px-2 py-0.5 rounded bg-slate-900/70 backdrop-blur-xs">
            {property.images.length} Photos
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Unit Rate */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-lg font-extrabold text-slate-900">
              {formatBDTPrice(property.price, property.purpose === 'rent', property.rentPeriod)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {property.purpose === 'buy'
                ? calculatePricePerSqFt(property.price, property.areaSqFt)
                : property.priceNegotiable
                ? 'Negotiable'
                : 'Fixed Rent'}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProperty(property)}
            className="font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Location with map pin */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>

          {/* Clean Unboxed Metadata Specs with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-slate-600 py-2 border-y border-slate-100">
            {property.propertyType !== 'land' && property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{property.bedrooms}</span>
                <span className="text-slate-500 text-[11px]">Beds</span>
              </div>
            )}
            {property.propertyType !== 'land' && property.bedrooms > 0 && (
              <span className="text-slate-300" aria-hidden="true">·</span>
            )}

            {property.propertyType !== 'land' && property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{property.bathrooms}</span>
                <span className="text-slate-500 text-[11px]">Baths</span>
              </div>
            )}
            {property.propertyType !== 'land' && property.bathrooms > 0 && (
              <span className="text-slate-300" aria-hidden="true">·</span>
            )}

            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.areaSqFt}</span>
              <span className="text-slate-500 text-[11px]">{property.unitType}</span>
            </div>

            <span className="text-slate-300" aria-hidden="true">·</span>

            <span className="text-[11px] text-slate-500 capitalize truncate">
              {property.propertyType}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-3.5 pt-1 flex items-center justify-between gap-2">
          <button
            onClick={() => setSelectedProperty(property)}
            className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            onClick={() => openSiteVisitModal(property)}
            className="flex-1 py-1.5 px-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
