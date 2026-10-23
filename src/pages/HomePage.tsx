import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyPurpose, PropertyType } from '../types';
import { DHAKA_AREAS } from '../data/mockData';
import {
  Search,
  Building,
  Home as HomeIcon,
  Briefcase,
  Layers,
  MapPin,
  CheckCircle2,
  Calendar,
  Shield,
  ArrowRight,
  TrendingUp,
  Users,
  Compass,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  tag: string;
  price: string;
  location: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&auto=format&fit=crop&q=85',
    badge: 'Gulshan 1 Diplomatic Zone • Exclusive Lakefront',
    title: 'Luxury South-Facing Penthouses in',
    highlight: 'Gulshan & Banani',
    subtitle: 'Panoramic lake-view apartments with private elevator access, standby generators, and RAJUK approved title deeds.',
    tag: 'Gulshan Penthouse',
    price: 'Starting ৳ 1.85 Cr',
    location: 'Gulshan 1, Dhaka',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=85',
    badge: 'Architectural Excellence • Verified Landlords',
    title: 'Modern Independent Duplex Homes in',
    highlight: 'Dhanmondi & Uttara',
    subtitle: 'Spacious 4-bedroom duplexes with landscaped private gardens, double parking bays, and 24/7 smart security.',
    tag: 'Modern Duplex Villa',
    price: 'Starting ৳ 2.80 Cr',
    location: 'Sector 4, Uttara, Dhaka',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&auto=format&fit=crop&q=85',
    badge: 'Prime Commercial Hub & Corporate Rentals',
    title: 'Grade-A Commercial Floors & Furnished',
    highlight: 'Executive Flats',
    subtitle: 'Strategic corporate office spaces on Gulshan Avenue and ready-to-move corporate rentals for multinational teams.',
    tag: 'Commercial & Rentals',
    price: 'Rent from ৳ 95,000 / mo',
    location: 'Gulshan Avenue, Dhaka',
  },
];

export const HomePage: React.FC = () => {
  const { properties, setActiveView, setFilterState, openSiteVisitModal } = useApp();

  const [heroPurpose, setHeroPurpose] = useState<PropertyPurpose>('buy');
  const [heroLocation, setHeroLocation] = useState('');
  const [heroType, setHeroType] = useState<PropertyType | 'all'>('all');
  const [heroKeyword, setHeroKeyword] = useState('');

  // 3-Image Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const approvedProperties = properties.filter((p) => p.status === 'approved');
  const featuredProperties = approvedProperties.filter((p) => p.isFeatured);
  const recentProperties = [...approvedProperties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterState((prev) => ({
      ...prev,
      keyword: heroKeyword,
      purpose: heroPurpose,
      propertyType: heroType,
      location: heroLocation,
    }));
    setActiveView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryCardClick = (type: PropertyType) => {
    setFilterState((prev) => ({
      ...prev,
      propertyType: type,
      purpose: 'all',
      location: '',
      keyword: '',
    }));
    setActiveView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLocationClick = (loc: string) => {
    setFilterState((prev) => ({
      ...prev,
      location: loc,
      purpose: 'all',
      propertyType: 'all',
      keyword: '',
    }));
    setActiveView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with 3-Image Slider */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-slate-950 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[580px] sm:min-h-[620px] flex items-center"
      >
        {/* 3-Image Crossfade Background Layer - High Definition & Bright */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform ${
                idx === currentSlide
                  ? 'opacity-95 sm:opacity-100 scale-100'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ backgroundImage: `url("${slide.image}")` }}
            />
          ))}
          {/* Soft, light translucent gradient overlay: keeps the architecture bright, sunlit and clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-slate-950/80 pointer-events-none" />
        </div>

        {/* Navigation Arrow Left */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95 focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95 focus:outline-none"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 w-full pt-4">
          {/* Clean, Minimalist Title with No Clutter */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Find Your Dream Home in <span className="text-emerald-400">Dhaka</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{HERO_SLIDES[currentSlide].tag} • {HERO_SLIDES[currentSlide].location}</span>
            </div>
          </div>

          {/* Interactive Search Box */}
          <div className="pt-2 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-3 sm:p-5 shadow-2xl text-slate-800 border border-slate-100">
              {/* Purpose Tabs: Buy / Rent / Commercial */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    setHeroPurpose('buy');
                    if (heroType === 'commercial') setHeroType('all');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    heroPurpose === 'buy' && heroType !== 'commercial'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Buy Property
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroPurpose('rent');
                    if (heroType === 'commercial') setHeroType('all');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    heroPurpose === 'rent' && heroType !== 'commercial'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Rent Flat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeroType('commercial');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    heroType === 'commercial'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Commercial
                </button>
              </div>

              {/* Input Grid */}
              <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
                {/* Keyword / Project */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Keyword / Road
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Duplex, Lake, Road 71"
                      value={heroKeyword}
                      onChange={(e) => setHeroKeyword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Location / Zone
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={heroLocation}
                      onChange={(e) => setHeroLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                    >
                      <option value="">All Dhaka & Bangladesh</option>
                      {DHAKA_AREAS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property Type */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Property Type
                  </label>
                  <select
                    value={heroType}
                    onChange={(e) => setHeroType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment / Flat</option>
                    <option value="house">House / Duplex</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="land">Land / Plot</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div className="sm:col-span-1 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Properties</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Minimal 3-Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-3">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-500/50'
                    : 'w-2.5 bg-white/60 hover:bg-white hover:w-5'
                }`}
                title={`Slide ${idx + 1}: ${slide.tag}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Metrics Bar directly under Hero Slider */}
      <section className="bg-slate-900 border-y border-slate-800 py-6 px-4 -mt-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="block text-xl sm:text-2xl font-black text-white">500+</span>
            <span className="text-xs text-slate-400">Verified Listings</span>
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-emerald-400">100%</span>
            <span className="text-xs text-slate-400">RAJUK Compliant</span>
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-white">৳ 120 Cr+</span>
            <span className="text-xs text-slate-400">Managed Real Estate</span>
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-emerald-400">Gulshan 1</span>
            <span className="text-xs text-slate-400">Corporate HQ</span>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Handpicked Selections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Properties in Prime Dhaka
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Carefully vetted residential and commercial spaces ready for immediate occupancy or investment.
            </p>
          </div>

          <button
            onClick={() => {
              setFilterState((p) => ({ ...p, sortBy: 'featured' }));
              setActiveView('search');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Browse by Property Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Explore by Property Type
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose the category that matches your lifestyle or business requirement.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              type: 'apartment' as PropertyType,
              title: 'Apartments & Flats',
              desc: 'Modern 2-4 Bed flats',
              count: approvedProperties.filter((p) => p.propertyType === 'apartment').length,
              icon: Building,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              type: 'house' as PropertyType,
              title: 'Luxury Duplex & Houses',
              desc: 'Independent living',
              count: approvedProperties.filter((p) => p.propertyType === 'house').length,
              icon: HomeIcon,
              color: 'text-sky-600 bg-sky-50',
            },
            {
              type: 'commercial' as PropertyType,
              title: 'Commercial Spaces',
              desc: 'Offices & Showrooms',
              count: approvedProperties.filter((p) => p.propertyType === 'commercial').length,
              icon: Briefcase,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              type: 'land' as PropertyType,
              title: 'Land & Plots',
              desc: 'Residential Katha plots',
              count: approvedProperties.filter((p) => p.propertyType === 'land').length,
              icon: Layers,
              color: 'text-teal-600 bg-teal-50',
            },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.type}
                onClick={() => handleCategoryCardClick(cat.type)}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className={`w-11 h-11 rounded-xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">{cat.count} Available</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Prime Dhaka Neighborhoods */}
      <section className="bg-slate-100/70 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                Top Urban Neighborhoods
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Explore Premier Dhaka Locations
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Discover properties close to leading international schools, diplomatic missions, and metro connectivity.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              {
                name: 'Gulshan 1 & 2',
                query: 'Gulshan',
                image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
              },
              {
                name: 'Banani',
                query: 'Banani',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
              },
              {
                name: 'Dhanmondi',
                query: 'Dhanmondi',
                image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&auto=format&fit=crop&q=80',
              },
              {
                name: 'Bashundhara R/A',
                query: 'Bashundhara',
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
              },
              {
                name: 'Uttara Model Town',
                query: 'Uttara',
                image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
              },
            ].map((loc) => {
              const count = approvedProperties.filter((p) =>
                p.location.toLowerCase().includes(loc.query.toLowerCase())
              ).length;
              return (
                <div
                  key={loc.name}
                  onClick={() => handleLocationClick(loc.query)}
                  className="relative group rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent flex flex-col justify-end p-3.5 text-white">
                    <span className="font-bold text-sm leading-snug">{loc.name}</span>
                    <span className="text-[11px] text-emerald-300">{count} Properties listed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recently Added Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Fresh On The Market
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Recently Added Verified Listings
            </h2>
          </div>
          <button
            onClick={() => {
              setFilterState((p) => ({ ...p, sortBy: 'newest' }));
              setActiveView('search');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
          >
            <span>See Newest Submissions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Why Choose Dream Properties Limited */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Peace of Mind Guaranteed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Why Buyers & Landlords Trust Dream Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              We bridge the trust gap in the Bangladeshi real estate market through stringent document
              verification and professional client assistance.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Title Deed & RAJUK Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every listing undergoes title scrutiny, C.S./R.S./B.S. mutation check, and RAJUK approval
                verification before going live.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Free Accompanied Site Visits</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schedule a site visit at your convenience. Our licensed property officers accompany you
                and present full technical documentation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Direct Owner & Developer Connect</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero hidden middleman markups. Connect directly via WhatsApp or phone with verified property owners
                and established real estate developers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Post Property Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black">Are You a Property Owner or Developer?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              List your apartment, duplex, or commercial building to thousands of qualified buyers and tenants across Bangladesh.
            </p>
          </div>
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-emerald-900 font-extrabold text-xs sm:text-sm rounded-xl transition-colors shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Post Free Property Listing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
