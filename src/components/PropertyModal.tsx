import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatBDTPrice,
  calculateMortgageEMI,
  calculatePricePerSqFt,
  calculateBDRegistrationCosts,
} from '../utils/formatters';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Share2,
  Heart,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building,
  Compass,
  Layers,
  Calculator,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Printer,
  ArrowRightLeft,
  GraduationCap,
  Hospital,
  Train,
  ShoppingBag,
  Trees,
  Scan,
} from 'lucide-react';

export const PropertyModal: React.FC = () => {
  const {
    selectedProperty,
    setSelectedProperty,
    favorites,
    toggleFavorite,
    openSiteVisitModal,
    openInquiryModal,
    compareList,
    addToCompare,
    removeFromCompare,
    setIsBrochureModalOpen,
    addToast,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'virtual' | 'costs'>('overview');

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(15);
  const [interestRate, setInterestRate] = useState(9.5); // Common DBH / Standard Chartered BD mortgage rate

  if (!selectedProperty) return null;

  const isFavorited = favorites.includes(selectedProperty.id);
  const isCompared = compareList.some((p) => p.id === selectedProperty.id);

  const emiResult = calculateMortgageEMI(
    selectedProperty.price,
    downPaymentPercent,
    interestRate,
    tenureYears
  );

  const regCosts = calculateBDRegistrationCosts(selectedProperty.price);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Property link copied to clipboard!', 'info');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Dream Properties Limited! I would like to inquire about "${selectedProperty.title}" in ${selectedProperty.location} (${formatBDTPrice(selectedProperty.price, selectedProperty.purpose === 'rent')}).`
  );

  const getNearbyIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <GraduationCap className="w-3.5 h-3.5 text-sky-600" />;
      case 'hospital':
        return <Hospital className="w-3.5 h-3.5 text-rose-600" />;
      case 'transit':
        return <Train className="w-3.5 h-3.5 text-emerald-600" />;
      case 'shopping':
        return <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Trees className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Top Header */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900 uppercase tracking-wide">
              {selectedProperty.propertyType}
            </span>
            <span>/</span>
            <span>{selectedProperty.city}</span>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">{selectedProperty.location}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Button */}
            <button
              onClick={() => {
                if (isCompared) {
                  removeFromCompare(selectedProperty.id);
                } else {
                  addToCompare(selectedProperty);
                }
              }}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                isCompared
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
              }`}
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'In Compare' : 'Compare'}</span>
            </button>

            {/* Print Brochure */}
            <button
              onClick={() => setIsBrochureModalOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Official Factsheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Factsheet</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(selectedProperty.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title={isFavorited ? 'Remove favorite' : 'Save favorite'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={() => setSelectedProperty(null)}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Property Overview & Specs
          </button>
          {selectedProperty.virtualTourRooms && selectedProperty.virtualTourRooms.length > 0 && (
            <button
              onClick={() => setActiveTab('virtual')}
              className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'virtual'
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-emerald-600" />
              <span>Virtual Tour ({selectedProperty.virtualTourRooms.length} Rooms)</span>
            </button>
          )}
          {selectedProperty.purpose === 'buy' && (
            <button
              onClick={() => setActiveTab('costs')}
              className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'costs'
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Government Registration & Stamp Fees</span>
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: Main Overview */}
          {activeTab === 'overview' && (
            <>
              {/* Title & Price Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-md text-white ${
                        selectedProperty.purpose === 'buy' ? 'bg-slate-900' : 'bg-emerald-700'
                      }`}
                    >
                      For {selectedProperty.purpose === 'buy' ? 'Sale' : 'Rent'}
                    </span>
                    {selectedProperty.isFeatured && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-400 text-slate-950">
                        Featured
                      </span>
                    )}
                    {selectedProperty.rajukApproved && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> RAJUK Sanctioned
                      </span>
                    )}
                    {selectedProperty.postedBy.isNidVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" /> NID Verified Landlord
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                    {selectedProperty.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{selectedProperty.address}</span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                  <span className="block text-2xl font-black text-emerald-700">
                    {formatBDTPrice(selectedProperty.price, selectedProperty.purpose === 'rent', selectedProperty.rentPeriod)}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold block mt-0.5">
                    {calculatePricePerSqFt(selectedProperty.price, selectedProperty.areaSqFt)}
                  </span>
                </div>
              </div>

              {/* Photo Gallery with Hero + Thumbnail selector */}
              <div className="space-y-2">
                <div className="relative aspect-[16/9] max-h-[420px] rounded-xl overflow-hidden bg-slate-100 group">
                  <img
                    src={selectedProperty.images[activeImageIndex] || selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Prev / Next controls */}
                  {selectedProperty.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0 ? selectedProperty.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-xs transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === selectedProperty.images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-xs transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-xs font-medium">
                    Photo {activeImageIndex + 1} of {selectedProperty.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                {selectedProperty.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedProperty.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIndex === idx
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Action CTAs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <button
                  onClick={() => openSiteVisitModal(selectedProperty)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Visit</span>
                </button>
                <button
                  onClick={() => openInquiryModal(selectedProperty)}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
                <a
                  href={`https://wa.me/8801711234567?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>💬 WhatsApp</span>
                </a>
                <button
                  onClick={() => setIsBrochureModalOpen(true)}
                  className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-emerald-600" />
                  <span>Print Brochure</span>
                </button>
              </div>

              {/* Specifications Grid */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Total Area</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Maximize2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedProperty.areaSqFt} {selectedProperty.unitType}
                      </span>
                    </div>
                  </div>

                  {selectedProperty.bedrooms > 0 && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-[11px] text-slate-500 block">Bedrooms</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Bed className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900 text-sm">
                          {selectedProperty.bedrooms} Beds
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedProperty.bathrooms > 0 && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-[11px] text-slate-500 block">Bathrooms</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Bath className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900 text-sm">
                          {selectedProperty.bathrooms} Baths
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Floor Position</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedProperty.floor > 0
                          ? `${selectedProperty.floor}th of ${selectedProperty.totalFloors}`
                          : 'Ground Floor'}
                      </span>
                    </div>
                  </div>

                  {selectedProperty.facing && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <span className="text-[11px] text-slate-500 block">Facing Direction</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900 text-sm">
                          {selectedProperty.facing} Facing
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Construction Status</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900 text-sm capitalize">
                        {selectedProperty.completionStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Handover Date</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedProperty.handoverDate || 'Immediate'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[11px] text-slate-500 block">Balconies</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedProperty.balconies} Balconies
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-2 uppercase tracking-wider">
                  About This Property
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedProperty.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Commute Points of Interest */}
              {selectedProperty.nearbyPlaces && selectedProperty.nearbyPlaces.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
                    Neighborhood Landmarks & Commute
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProperty.nearbyPlaces.map((place, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-white rounded-md border border-slate-200">
                            {getNearbyIcon(place.type)}
                          </div>
                          <span className="font-medium text-slate-800">{place.name}</span>
                        </div>
                        <span className="font-bold text-emerald-700">{place.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mortgage Calculator Preview */}
              {selectedProperty.purpose === 'buy' && (
                <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Home Loan EMI Estimator (Bangladesh)</h4>
                        <p className="text-[11px] text-slate-300">
                          Supported by DBH, City Bank, Standard Chartered, and BRAC Bank
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Down Payment ({downPaymentPercent}%)</span>
                        <span className="font-bold text-emerald-400">
                          {formatBDTPrice((selectedProperty.price * downPaymentPercent) / 100)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={50}
                        step={5}
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Loan Tenure ({tenureYears} Years)</span>
                        <span className="font-bold text-slate-100">{tenureYears * 12} Months</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={25}
                        step={1}
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Interest Rate ({interestRate}%)</span>
                        <span className="font-bold text-slate-100">Annual</span>
                      </div>
                      <input
                        type="range"
                        min={7}
                        max={14}
                        step={0.5}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <span className="block text-[11px] text-slate-400">Estimated Monthly EMI</span>
                      <span className="text-lg font-black text-emerald-400">
                        ৳ {emiResult.monthlyPayment.toLocaleString('en-IN')}
                        <span className="text-xs text-slate-300 font-normal"> /mo</span>
                      </span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <span className="block text-[11px] text-slate-400">Loan Principal</span>
                      <span className="text-sm font-bold text-slate-200">
                        {formatBDTPrice(emiResult.loanAmount)}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                      <span className="block text-[11px] text-slate-400">Total Interest Payable</span>
                      <span className="text-sm font-bold text-slate-200">
                        {formatBDTPrice(emiResult.totalInterest)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: Virtual 360 Tour Viewer */}
          {activeTab === 'virtual' && selectedProperty.virtualTourRooms && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Interactive Virtual Room Walkthrough</h4>
                  <p className="text-xs text-slate-400">
                    Switch between panoramic architectural views of this property
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                  HD Panorama
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedProperty.virtualTourRooms.map((room, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-2 bg-slate-50"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={room.url} alt={room.room} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <span className="font-bold text-xs text-slate-900 block">{room.room}</span>
                      <span className="text-[11px] text-emerald-700 font-medium">Full Virtual View Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Bangladesh Registration Cost Calculator */}
          {activeTab === 'costs' && selectedProperty.purpose === 'buy' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h4 className="font-bold text-sm text-emerald-950">
                  Government Property Registration Cost Estimation
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Based on Bangladesh Sub-Registry Directorate and Internal Resources Division regulations for Dhaka City Corporation.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3 text-left">Fee Category</th>
                      <th className="p-3 text-left">Statutory Rate</th>
                      <th className="p-3 text-right">Payable Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Stamp Duty</td>
                      <td className="p-3 text-slate-600">1.50% of deed value</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatBDTPrice(regCosts.stampDuty)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Sub-Registry Office Fee</td>
                      <td className="p-3 text-slate-600">1.00% of deed value</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatBDTPrice(regCosts.registrationFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Local Government Tax (DNCC / City Corp)</td>
                      <td className="p-3 text-slate-600">2.00% of deed value</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatBDTPrice(regCosts.localGovtTax)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Advance Income Tax (AIT Gain Tax under Sec 53C)</td>
                      <td className="p-3 text-slate-600">4.00% (Adjustable with Tax Return)</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatBDTPrice(regCosts.gainTaxAIT)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Mutation, E-Porcha & Certification Charges</td>
                      <td className="p-3 text-slate-600">Standard Government Fee</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{formatBDTPrice(regCosts.mutationFee)}</td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-950 font-bold text-sm">
                      <td className="p-3.5" colSpan={2}>
                        Total Estimated Government Registration Cost
                      </td>
                      <td className="p-3.5 text-right font-mono font-extrabold text-emerald-800">
                        {formatBDTPrice(regCosts.totalCost)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Notes on Land/Flat Deed Registration:</span>
                <p>• Registration charges must be deposited via e-Challan / Treasury Challan to Bangladesh Bank or Sonali Bank.</p>
                <p>• Dream Properties Limited legal desk provides full deed drafting and registry documentation assistance.</p>
              </div>
            </div>
          )}

          {/* Advertiser Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                <UserCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedProperty.postedBy.name}
                  </span>
                  {selectedProperty.postedBy.isNidVerified && (
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      NID Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 capitalize">
                  {selectedProperty.postedBy.role} • Dream Properties Verified Partner
                </span>
                <span className="block text-xs font-semibold text-emerald-700 mt-0.5">
                  {selectedProperty.postedBy.phone}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${selectedProperty.postedBy.phone}`}
                className="py-2 px-3 bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Direct Call
              </a>
              <button
                onClick={() => openInquiryModal(selectedProperty)}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
