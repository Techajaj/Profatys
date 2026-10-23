import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { DHAKA_AREAS } from '../data/mockData';
import { PropertyPurpose, PropertyType, CompletionStatus } from '../types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Grid,
  List,
  MapPin,
  Building,
  Check,
  ChevronDown,
} from 'lucide-react';

export const ListingSearchPage: React.FC = () => {
  const { properties, filterState, setFilterState, resetFilters } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter approved properties only
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => p.status === 'approved')
      .filter((p) => {
        // Purpose filter
        if (filterState.purpose !== 'all' && p.purpose !== filterState.purpose) {
          return false;
        }

        // Property Type filter
        if (filterState.propertyType !== 'all' && p.propertyType !== filterState.propertyType) {
          return false;
        }

        // Location filter
        if (
          filterState.location &&
          !p.location.toLowerCase().includes(filterState.location.toLowerCase()) &&
          !p.city.toLowerCase().includes(filterState.location.toLowerCase())
        ) {
          return false;
        }

        // Keyword filter
        if (filterState.keyword.trim()) {
          const kw = filterState.keyword.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(kw);
          const matchAddress = p.address.toLowerCase().includes(kw);
          const matchDesc = p.description.toLowerCase().includes(kw);
          if (!matchTitle && !matchAddress && !matchDesc) return false;
        }

        // Price filter
        if (filterState.minPrice > 0 && p.price < filterState.minPrice) {
          return false;
        }
        if (filterState.maxPrice > 0 && p.price > filterState.maxPrice) {
          return false;
        }

        // Bedrooms filter
        if (filterState.bedrooms !== 'all' && p.bedrooms < Number(filterState.bedrooms)) {
          return false;
        }

        // Bathrooms filter
        if (filterState.bathrooms !== 'all' && p.bathrooms < Number(filterState.bathrooms)) {
          return false;
        }

        // Completion Status
        if (
          filterState.completionStatus !== 'all' &&
          p.completionStatus !== filterState.completionStatus
        ) {
          return false;
        }

        // Area filter
        if (filterState.minArea > 0 && p.areaSqFt < filterState.minArea) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filterState.sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filterState.sortBy === 'price-asc') return a.price - b.price;
        if (filterState.sortBy === 'price-desc') return b.price - a.price;
        if (filterState.sortBy === 'newest')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (filterState.sortBy === 'size-desc') return b.areaSqFt - a.areaSqFt;
        return 0;
      });
  }, [properties, filterState]);

  const activeFiltersCount = [
    filterState.purpose !== 'all',
    filterState.propertyType !== 'all',
    Boolean(filterState.location),
    Boolean(filterState.keyword),
    filterState.minPrice > 0 || filterState.maxPrice > 0,
    filterState.bedrooms !== 'all',
    filterState.completionStatus !== 'all',
    filterState.minArea > 0,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Real Estate Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredProperties.length} verified properties across Dhaka and major divisions
          </p>
        </div>

        {/* Mobile Filter Toggle & Layout switches */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))
              }
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="size-desc">Largest Size</option>
            </select>
          </div>

          {/* Grid / List switch */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Result Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside
          className={`lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-xs ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Filter Properties</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Search Keyword */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Title, road, building..."
                value={filterState.keyword}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, keyword: e.target.value }))
                }
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Purpose Segmented Control */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Purpose
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              {(['all', 'buy', 'rent'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterState((prev) => ({ ...prev, purpose: p }))}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                    filterState.purpose === p
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p === 'all' ? 'All' : p === 'buy' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Property Type
            </label>
            <select
              value={filterState.propertyType}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, propertyType: e.target.value as any }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment / Flat</option>
              <option value="house">House / Duplex</option>
              <option value="commercial">Commercial Floor / Office</option>
              <option value="land">Land / Residential Plot</option>
            </select>
          </div>

          {/* Location Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dhaka Location
            </label>
            <select
              value={filterState.location}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="">Any Location in Dhaka</option>
              {DHAKA_AREAS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Minimum Bedrooms
            </label>
            <div className="flex gap-1">
              {(['all', 1, 2, 3, 4] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFilterState((prev) => ({ ...prev, bedrooms: b }))}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md border text-center transition-colors ${
                    filterState.bedrooms === b
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {b === 'all' ? 'Any' : `${b}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Completion Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Completion Status
            </label>
            <select
              value={filterState.completionStatus}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  completionStatus: e.target.value as CompletionStatus | 'all',
                }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="all">Any Status</option>
              <option value="ready">Ready for Immediate Move-in</option>
              <option value="under_construction">Under Construction (Installment)</option>
            </select>
          </div>

          {/* Quick Price Range Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Quick Budget Presets
            </label>
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() =>
                  setFilterState((prev) => ({
                    ...prev,
                    minPrice: 0,
                    maxPrice: 15000000,
                  }))
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-slate-700"
              >
                Under ৳ 1.50 Crore
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilterState((prev) => ({
                    ...prev,
                    minPrice: 15000000,
                    maxPrice: 30000000,
                  }))
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-slate-700"
              >
                ৳ 1.50 Cr – ৳ 3.00 Crore
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilterState((prev) => ({
                    ...prev,
                    minPrice: 30000000,
                    maxPrice: 0,
                  }))
                }
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-slate-700"
              >
                Above ৳ 3.00 Crore
              </button>
            </div>
          </div>
        </aside>

        {/* Results Listings Grid */}
        <main className="lg:col-span-3">
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No matching properties found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or resetting your search criteria to explore all
                available homes.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
