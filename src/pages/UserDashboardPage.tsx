import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { Property, PropertyPurpose, PropertyType, CompletionStatus } from '../types';
import { DHAKA_AREAS, AMENITIES_LIST, PHOTO_PRESETS } from '../data/mockData';
import { formatBDTPrice } from '../utils/formatters';
import {
  PlusCircle,
  Building,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit3,
  Calendar,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  UserCheck,
  Check,
  Eye,
  AlertCircle,
  ShieldCheck,
  PhoneCall,
  Send,
  ExternalLink,
  Phone,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const {
    currentUser,
    properties,
    favorites,
    siteVisits,
    inquiries,
    addProperty,
    updateProperty,
    deleteProperty,
    setSelectedProperty,
    addToast,
    quickSwitchRole,
    verifyUserNid,
    updateInquiryStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'post' | 'favorites' | 'visits' | 'inquiries'>('listings');
  const [nidInput, setNidInput] = useState('');
  const [showNidInput, setShowNidInput] = useState(false);

  // New Property Form State
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [city, setCity] = useState('Dhaka');
  const [location, setLocation] = useState('Gulshan 1');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState<number>(18500000);
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [rentPeriod, setRentPeriod] = useState<'month' | 'year'>('month');
  const [areaSqFt, setAreaSqFt] = useState<number>(1850);
  const [unitType, setUnitType] = useState<'sqft' | 'katha'>('sqft');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [balconies, setBalconies] = useState<number>(2);
  const [floor, setFloor] = useState<number>(5);
  const [totalFloors, setTotalFloors] = useState<number>(9);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>('ready');
  const [handoverDate, setHandoverDate] = useState('Ready for Handover');
  const [facing, setFacing] = useState<'South' | 'North' | 'East' | 'West'>('South');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift / Passenger Elevator',
    'Full Standby Generator',
    '24/7 Security Guards & CCTV',
    'Dedicated Car Parking',
  ]);
  const [images, setImages] = useState<string[]>([PHOTO_PRESETS[0].url]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState(
    'Prime residential property with top quality finishing, modern amenities, RAJUK approval, and excellent communication access.'
  );

  // Edit Listing Modal state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Listings posted by this user (or if admin, show all user submitted properties)
  const myListings = properties.filter(
    (p) => p.postedBy.id === currentUser.id || currentUser.role === 'admin'
  );

  const myInquiries = inquiries.filter(
    (inq) =>
      inq.ownerId === currentUser.id ||
      myListings.some((p) => p.id === inq.propertyId) ||
      currentUser.role === 'admin'
  );

  const favoritedProperties = properties.filter((p) => favorites.includes(p.id));
  const myVisits = siteVisits.filter(
    (v) =>
      v.visitorEmail === currentUser.email ||
      v.visitorPhone === currentUser.phone ||
      currentUser.role === 'admin'
  );

  const handleVerifyNid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidInput.trim()) {
      addToast('Please enter your 10 or 17 digit Bangladesh National ID (NID)', 'error');
      return;
    }
    verifyUserNid(nidInput.trim());
    setNidInput('');
    setShowNidInput(false);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      addToast('Photo added to submission', 'info');
    }
  };

  const handleAddCustomPhoto = () => {
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
      addToast('Image URL added', 'info');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
          addToast('Local image attached successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim() || price <= 0) {
      addToast('Please enter title, address, and valid price', 'error');
      return;
    }

    addProperty({
      title,
      purpose,
      propertyType,
      city,
      location,
      address,
      price: Number(price),
      priceNegotiable,
      rentPeriod,
      areaSqFt: Number(areaSqFt),
      unitType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      balconies: Number(balconies),
      floor: Number(floor),
      totalFloors: Number(totalFloors),
      completionStatus,
      handoverDate,
      facing,
      amenities: selectedAmenities,
      images: images.length > 0 ? images : [PHOTO_PRESETS[0].url],
      description,
    });

    // Reset form and return to listings
    setTitle('');
    setAddress('');
    setActiveTab('listings');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentUser.role}
                </span>

                {/* NID Verification Badge */}
                {currentUser.isNidVerified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Landlord</span>
                    {currentUser.nidNumber && (
                      <span className="font-mono text-[10px] text-emerald-400/80">
                        ({currentUser.nidNumber.slice(0, 4)}***{currentUser.nidNumber.slice(-3)})
                      </span>
                    )}
                  </span>
                ) : (
                  <button
                    onClick={() => setShowNidInput(!showNidInput)}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unverified • Click to Verify NID</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {currentUser.email} • {currentUser.phone}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Member of Dream Properties Limited Portal since {currentUser.registeredAt}
              </p>
            </div>
          </div>

          {/* Quick Role Toggle Bar for Semester Evaluation */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1.5 shrink-0">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Evaluation Role Switch:
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => quickSwitchRole('owner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentUser.role === 'owner'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Property Landlord
              </button>
              <button
                onClick={() => quickSwitchRole('buyer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentUser.role === 'buyer'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Buyer / Client
              </button>
              <button
                onClick={() => quickSwitchRole('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Admin Moderator
              </button>
            </div>
          </div>
        </div>

        {/* NID Verification Input Box if unverified and opened */}
        {!currentUser.isNidVerified && showNidInput && (
          <form
            onSubmit={handleVerifyNid}
            className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-amber-500/30"
          >
            <div className="text-xs text-amber-200 flex-1">
              <span className="font-bold text-amber-300 block">Bangladesh National ID (NID) Verification:</span>
              <span className="text-[11px] text-slate-300">
                Enter your 10 or 17 digit Election Commission Smart NID number to activate the verified badge.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="e.g. 19852691234567890"
                value={nidInput}
                onChange={(e) => setNidInput(e.target.value)}
                maxLength={17}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-56"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-sm"
              >
                Verify NID
              </button>
              <button
                type="button"
                onClick={() => setShowNidInput(false)}
                className="px-2 py-1.5 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>My Submitted Properties ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span>Received Leads ({myInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('post')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'post'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Property Listing</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Saved Favorites ({favoritedProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'visits'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Site Visits ({myVisits.length})</span>
        </button>
      </div>

      {/* TAB 1: My Submitted Properties */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Listing Status & Management (Section 2.B)
            </h2>
            <button
              onClick={() => setActiveTab('post')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Property</span>
            </button>
          </div>

          {myListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No properties submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to find buyers or tenants? Submit your property with photos and details to start receiving inquiries.
              </p>
              <button
                onClick={() => setActiveTab('post')}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg"
              >
                Post Your First Property
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                            prop.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prop.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prop.status === 'approved' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : prop.status === 'pending' ? (
                            <Clock className="w-3 h-3 text-amber-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          <span>Status: {prop.status}</span>
                        </span>

                        <span className="text-[11px] font-semibold text-slate-500 uppercase">
                          For {prop.purpose}
                        </span>

                        {prop.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setSelectedProperty(prop)}
                        className="font-bold text-sm text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                      >
                        {prop.title}
                      </h3>

                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {prop.location}, {prop.city} • {prop.areaSqFt} {prop.unitType}
                      </p>

                      <div className="text-xs font-bold text-emerald-700 mt-1">
                        {formatBDTPrice(prop.price, prop.purpose === 'rent', prop.rentPeriod)}
                      </div>

                      {/* Rejection notice if any */}
                      {prop.status === 'rejected' && prop.rejectionReason && (
                        <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>Admin Feedback: {prop.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setSelectedProperty(prop)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Preview Property"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    <button
                      onClick={() => deleteProperty(prop.id)}
                      className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Post New Property Listing Form */}
      {activeTab === 'post' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Submit New Property Listing (Section 2.B)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide thorough specifications, facilities, and high-definition photographs. Your
              submission will be queued for Admin review and published directly upon approval.
            </p>
          </div>

          <form onSubmit={handlePostSubmit} className="space-y-6 text-xs">
            {/* Section 1: Core Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
                1. Core Specifications
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Property Title / Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. South-Facing Luxury Flat Near Gulshan Lake"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purpose *</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="buy">For Sale (Buy)</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type *</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="apartment">Apartment / Flat</option>
                    <option value="house">House / Duplex</option>
                    <option value="commercial">Commercial Space / Office</option>
                    <option value="land">Residential Land / Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Price in BDT (৳) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={1000}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                  <span className="block text-[11px] text-emerald-700 font-bold mt-1">
                    {formatBDTPrice(price, purpose === 'rent', rentPeriod)}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Location */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
                2. Location & Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prime Area / Zone *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {DHAKA_AREAS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Region *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Street Address & Road Number *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 14, Road 126, Gulshan 1, Dhaka"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Section 3: Dimensions & Rooms */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
                3. Space & Layout
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Area (sqft)</label>
                  <input
                    type="number"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Balconies</label>
                  <input
                    type="number"
                    value={balconies}
                    onChange={(e) => setBalconies(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Floors</label>
                  <input
                    type="number"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facing</label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="South">South Facing</option>
                    <option value="North">North Facing</option>
                    <option value="East">East Facing</option>
                    <option value="West">West Facing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Handover</label>
                  <input
                    type="text"
                    value={handoverDate}
                    onChange={(e) => setHandoverDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Facilities & Amenities Checkboxes */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
                4. Facilities & Building Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Photo Uploads (Presets, URL, or Local File) */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
                5. High-Resolution Photographs
              </h3>

              {/* Uploaded photos thumbnail strip */}
              <div className="flex flex-wrap gap-2.5">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-20 rounded-lg overflow-hidden border border-slate-300 group"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Preset picker */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-semibold text-slate-700 block">
                  Quick Architecture Presets (Click to include):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleAddPresetPhoto(preset.url)}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-md text-[11px] font-medium transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL or File Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPhoto}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs"
                  >
                    Add
                  </button>
                </div>

                <label className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-emerald-500 rounded-lg flex items-center justify-center gap-2 cursor-pointer bg-white text-slate-600 font-semibold hover:text-emerald-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image File from Device</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Section 6: Full Description */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Property Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-colors shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Property for Review</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Saved Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Bookmarked & Saved Properties ({favoritedProperties.length})
          </h2>

          {favoritedProperties.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No saved properties yet</h3>
              <p className="text-xs text-slate-500">
                Click the heart icon on any property card to save it here for fast reference.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Scheduled Site Visits */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            My Site Visit Bookings ({myVisits.length})
          </h2>

          {myVisits.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No site visits scheduled yet</h3>
              <p className="text-xs text-slate-500">
                Request a physical walk-through on any property page to have our officer accompany you.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {visit.referenceCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          visit.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{visit.propertyTitle}</h3>
                    <p className="text-slate-500">{visit.propertyLocation}</p>
                    <div className="text-slate-600 font-medium pt-1">
                      Date: <span className="font-bold text-slate-900">{visit.preferredDate}</span> ({visit.preferredTimeSlot.toUpperCase()})
                    </div>
                    {visit.notes && (
                      <p className="text-slate-500 italic">Notes: {visit.notes}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-slate-400 text-[10px]">Booked on {visit.createdAt}</span>
                    <span className="text-emerald-700 font-semibold block mt-1">
                      Field Officer Assigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Received Client Leads & Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Direct Buyer & Tenant Inquiries ({myInquiries.length})
              </h2>
              <p className="text-xs text-slate-500">
                Prospective buyer inquiries and contact leads received for your submitted properties.
              </p>
            </div>
          </div>

          {myInquiries.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No client inquiries received yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once buyers browse your active listings and submit questions or price offers, their direct contact details will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myInquiries.map((inq) => {
                const cleanPhone = inq.senderPhone.replace(/[^0-9]/g, '');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hello ${inq.senderName}, regarding your inquiry on Dream Properties Limited for "${inq.propertyTitle}"...`
                )}`;

                return (
                  <div
                    key={inq.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                              inq.status === 'new'
                                ? 'bg-amber-100 text-amber-800'
                                : inq.status === 'contacted'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {inq.status === 'new'
                              ? 'New Lead'
                              : inq.status === 'contacted'
                              ? 'Contacted'
                              : 'Deal In Progress / Resolved'}
                          </span>
                          <span className="text-[11px] text-slate-400">Received {inq.createdAt}</span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 mt-1">
                          Property: {inq.propertyTitle}
                        </h3>
                      </div>

                      {/* Lead Status Switcher */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <span className="text-[11px] text-slate-400">Status:</span>
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px] font-semibold text-slate-700"
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Mark Contacted</option>
                          <option value="resolved">Mark Resolved</option>
                        </select>
                      </div>
                    </div>

                    {/* Inquiry Message */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 text-xs italic">
                      "{inq.message}"
                    </div>

                    {/* Sender Contacts & Direct Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="space-y-0.5 text-slate-600">
                        <span className="font-bold text-slate-900 block text-xs">
                          {inq.senderName}
                        </span>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-slate-500">Phone: {inq.senderPhone}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">Email: {inq.senderEmail}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${inq.senderPhone}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Call</span>
                        </a>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
