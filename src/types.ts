export type PropertyPurpose = 'buy' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';
export type ListingStatus = 'pending' | 'approved' | 'rejected';
export type CompletionStatus = 'ready' | 'under_construction' | 'upcoming';
export type UserRole = 'admin' | 'owner' | 'buyer';

export interface NearbyPlace {
  name: string;
  distance: string;
  type: 'school' | 'hospital' | 'transit' | 'shopping' | 'park';
}

export interface VirtualTourRoom {
  room: string;
  url: string;
}

export interface Property {
  id: string;
  title: string;
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  status: ListingStatus;
  rejectionReason?: string;
  isFeatured: boolean;
  price: number; // in BDT (Bangladeshi Taka)
  priceNegotiable: boolean;
  rentPeriod?: 'month' | 'year';
  city: string;
  location: string; // Neighborhood / Area e.g. "Gulshan 1", "Banani"
  address: string;
  areaSqFt: number; // or Katha equivalent
  unitType: 'sqft' | 'katha';
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  floor: number;
  totalFloors: number;
  completionStatus: CompletionStatus;
  handoverDate?: string;
  facing?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'South-East';
  images: string[];
  amenities: string[];
  description: string;
  postedBy: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: 'owner' | 'agent' | 'developer';
    isNidVerified?: boolean;
  };
  createdAt: string;
  viewsCount: number;
  rajukApproved?: boolean;
  virtualTourRooms?: VirtualTourRoom[];
  nearbyPlaces?: NearbyPlace[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  registeredAt: string;
  isNidVerified?: boolean;
  nidNumber?: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  ownerId?: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyPurpose: PropertyPurpose;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface SiteVisit {
  id: string;
  referenceCode: string;
  propertyId: string;
  ownerId?: string;
  propertyTitle: string;
  propertyLocation: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail: string;
  preferredDate: string;
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening';
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SecurityAuditLog {
  id: string;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
  type: 'auth' | 'moderation' | 'security' | 'user';
  severity: 'normal' | 'warning' | 'critical';
}

export interface RegistrationCostBreakdown {
  stampDuty: number; // 1.5%
  registrationFee: number; // 1.0%
  localGovtTax: number; // 2.0%
  gainTaxAIT: number; // 4.0%
  mutationFee: number; // Flat ~5,000 BDT
  totalCost: number;
}

export interface FilterState {
  keyword: string;
  purpose: PropertyPurpose | 'all';
  propertyType: PropertyType | 'all';
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'all';
  bathrooms: number | 'all';
  completionStatus: CompletionStatus | 'all';
  minArea: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'size-desc';
}

export type ActiveView = 
  | 'home' 
  | 'search' 
  | 'dashboard' 
  | 'admin' 
  | 'about' 
  | 'contact' 
  | 'proposal';
