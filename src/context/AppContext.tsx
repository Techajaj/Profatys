import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  User,
  Inquiry,
  SiteVisit,
  FilterState,
  ActiveView,
  UserRole,
  SecurityAuditLog,
} from '../types';
import {
  INITIAL_PROPERTIES,
  DEMO_USERS,
  INITIAL_INQUIRIES,
  INITIAL_SITE_VISITS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  properties: Property[];
  currentUser: User;
  inquiries: Inquiry[];
  siteVisits: SiteVisit[];
  favorites: string[];
  compareList: Property[];
  auditLogs: SecurityAuditLog[];
  activeView: ActiveView;
  selectedProperty: Property | null;
  siteVisitProperty: Property | null;
  inquiryProperty: Property | null;
  isSiteVisitModalOpen: boolean;
  isInquiryModalOpen: boolean;
  isAuthModalOpen: boolean;
  isProposalModalOpen: boolean;
  isAdminLoginModalOpen: boolean;
  isAdminAuthenticated: boolean;
  isCompareModalOpen: boolean;
  isBrochureModalOpen: boolean;
  adminFailedAttempts: number;
  adminLockoutSeconds: number;
  filterState: FilterState;
  toasts: ToastMessage[];

  // Actions
  setActiveView: (view: ActiveView) => void;
  setSelectedProperty: (prop: Property | null) => void;
  openSiteVisitModal: (prop: Property) => void;
  closeSiteVisitModal: () => void;
  openInquiryModal: (prop: Property) => void;
  closeInquiryModal: () => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsProposalModalOpen: (open: boolean) => void;
  setIsCompareModalOpen: (open: boolean) => void;
  setIsBrochureModalOpen: (open: boolean) => void;
  openAdminLoginModal: () => void;
  closeAdminLoginModal: () => void;
  loginAdminWithPassword: (pass: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;
  addToCompare: (property: Property) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toggleFavorite: (propId: string) => void;
  setCurrentUser: (user: User) => void;
  quickSwitchRole: (role: UserRole) => void;
  verifyUserNid: (nidNumber: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  addAuditLog: (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => void;

  // Property CRUD & Moderation
  addProperty: (newPropData: Partial<Property>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string, reason: string) => void;
  toggleFeatured: (id: string) => void;

  // Inquiries & Visits
  submitInquiry: (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  scheduleSiteVisit: (visitData: Omit<SiteVisit, 'id' | 'referenceCode' | 'createdAt' | 'status'>) => SiteVisit;
  updateSiteVisitStatus: (id: string, status: SiteVisit['status']) => void;
  resetAllDemoData: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  keyword: '',
  purpose: 'all',
  propertyType: 'all',
  location: '',
  minPrice: 0,
  maxPrice: 0,
  bedrooms: 'all',
  bathrooms: 'all',
  completionStatus: 'all',
  minArea: 0,
  sortBy: 'featured',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage hydrated states
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('dpl_properties_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved properties', e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('dpl_current_user_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'admin' && sessionStorage.getItem('dpl_admin_auth') !== 'true') {
          return DEMO_USERS[1];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    return DEMO_USERS[1]; // Default to Property Landlord/Owner (Non-admin)
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dpl_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminFailedAttempts, setAdminFailedAttempts] = useState(0);
  const [adminLockoutSeconds, setAdminLockoutSeconds] = useState(0);

  const [adminPasswords, setAdminPasswords] = useState<string[]>(() => {
    const saved = localStorage.getItem('dpl_admin_passwords_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return ['admin1234', 'dream2026', 'admin@123'];
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem('dpl_audit_logs_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('dpl_inquiries_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse inquiries', e);
      }
    }
    return INITIAL_INQUIRIES;
  });

  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() => {
    const saved = localStorage.getItem('dpl_site_visits_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse site visits', e);
      }
    }
    return INITIAL_SITE_VISITS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('dpl_favorites_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    return ['prop-001', 'prop-003'];
  });

  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [siteVisitProperty, setSiteVisitProperty] = useState<Property | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [isSiteVisitModalOpen, setIsSiteVisitModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dpl_properties_v3', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('dpl_current_user_v3', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dpl_inquiries_v3', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('dpl_site_visits_v3', JSON.stringify(siteVisits));
  }, [siteVisits]);

  useEffect(() => {
    localStorage.setItem('dpl_favorites_v3', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('dpl_audit_logs_v3', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('dpl_admin_passwords_v3', JSON.stringify(adminPasswords));
  }, [adminPasswords]);

  // Rate-limiting countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adminLockoutSeconds > 0) {
      timer = setInterval(() => {
        setAdminLockoutSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [adminLockoutSeconds]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (logData: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityAuditLog = {
      ...logData,
      id: `sec-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep latest 50
  };

  const resetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
  };

  const toggleFavorite = (propId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(propId);
      if (exists) {
        addToast('Removed from saved properties', 'info');
        return prev.filter((id) => id !== propId);
      } else {
        addToast('Added to saved properties', 'success');
        return [...prev, propId];
      }
    });
  };

  // Compare List actions
  const addToCompare = (property: Property) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === property.id)) {
        addToast('Property is already in the comparison matrix', 'info');
        return prev;
      }
      if (prev.length >= 3) {
        addToast('Maximum 3 properties can be compared simultaneously', 'error');
        return prev;
      }
      addToast(`Added "${property.title.slice(0, 20)}..." to compare matrix`, 'success');
      return [...prev, property];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
    addToast('Removed from comparison list', 'info');
  };

  const clearCompare = () => {
    setCompareList([]);
    addToast('Comparison matrix cleared', 'info');
  };

  const openAdminLoginModal = () => {
    setIsAdminLoginModalOpen(true);
  };

  const closeAdminLoginModal = () => {
    setIsAdminLoginModalOpen(false);
  };

  const loginAdminWithPassword = (password: string): boolean => {
    if (adminLockoutSeconds > 0) {
      addToast(`Security lockout active. Please wait ${adminLockoutSeconds} seconds.`, 'error');
      return false;
    }

    const trimmed = password.trim().toLowerCase();
    const isMatched = adminPasswords.some((p) => p.toLowerCase() === trimmed);

    if (isMatched) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('dpl_admin_auth', 'true');
      setAdminFailedAttempts(0);
      setCurrentUser(DEMO_USERS[0]); // MD Akhtarujjaman (admin)
      setIsAdminLoginModalOpen(false);
      setActiveView('admin');
      addAuditLog({
        action: 'ADMIN_LOGIN_SUCCESS',
        actor: 'MD Akhtarujjaman',
        details: 'Verified administrator authenticated with primary password',
        type: 'auth',
        severity: 'normal',
      });
      addToast('Admin verification successful! Access granted.', 'success');
      return true;
    } else {
      const newAttempts = adminFailedAttempts + 1;
      setAdminFailedAttempts(newAttempts);

      addAuditLog({
        action: 'ADMIN_LOGIN_FAILED',
        actor: 'Unknown Prober',
        details: `Invalid password entry attempt #${newAttempts}`,
        type: 'security',
        severity: newAttempts >= 3 ? 'critical' : 'warning',
      });

      if (newAttempts >= 3) {
        setAdminLockoutSeconds(30);
        addToast('Too many failed attempts! Security cooldown triggered for 30s.', 'error');
      } else {
        addToast(`Incorrect password! Attempt ${newAttempts} of 3.`, 'error');
      }
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('dpl_admin_auth');
    setCurrentUser(DEMO_USERS[1]); // Engr. Shafiul Alam (owner)
    setActiveView('home');
    addAuditLog({
      action: 'ADMIN_LOGOUT',
      actor: 'MD Akhtarujjaman',
      details: 'Administrator logged out and locked session',
      type: 'auth',
      severity: 'normal',
    });
    addToast('Admin session locked and logged out.', 'info');
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    const isOldValid = adminPasswords.some((p) => p.toLowerCase() === oldPass.trim().toLowerCase());
    if (!isOldValid) {
      addToast('Current password does not match', 'error');
      return false;
    }
    if (!newPass.trim() || newPass.trim().length < 6) {
      addToast('New password must be at least 6 characters long', 'error');
      return false;
    }

    setAdminPasswords([newPass.trim()]);
    addAuditLog({
      action: 'ADMIN_PASSWORD_ROTATED',
      actor: currentUser.name,
      details: 'Administrator master security passphrase updated',
      type: 'security',
      severity: 'warning',
    });
    addToast('Admin password updated successfully!', 'success');
    return true;
  };

  const quickSwitchRole = (role: UserRole) => {
    if (role === 'admin') {
      if (!isAdminAuthenticated) {
        openAdminLoginModal();
        addToast('Admin panel is protected. Please enter admin password.', 'info');
        return;
      }
      setCurrentUser(DEMO_USERS[0]);
      setActiveView('admin');
      addToast('Switched to Administrator profile', 'info');
      return;
    }

    const matched = DEMO_USERS.find((u) => u.role === role) || {
      id: `user_${role}_${Date.now()}`,
      name: role === 'owner' ? 'Property Landlord' : 'Client Visitor',
      email: `${role}@dreamproperties.bd`,
      phone: '+880 1711-000000',
      role,
      registeredAt: new Date().toISOString().split('T')[0],
      isNidVerified: role === 'owner',
    };
    setCurrentUser(matched);
    addToast(`Switched active profile to ${matched.name} (${role.toUpperCase()})`, 'info');
  };

  const verifyUserNid = (nidNumber: string) => {
    if (!nidNumber || nidNumber.length < 10) {
      addToast('Please enter a valid 10 or 17 digit Bangladesh National ID (NID)', 'error');
      return;
    }
    setCurrentUser((prev) => ({
      ...prev,
      isNidVerified: true,
      nidNumber,
    }));
    addAuditLog({
      action: 'NID_VERIFICATION_COMPLETE',
      actor: currentUser.name,
      details: `Bangladesh National ID verified: ${nidNumber.slice(0, 4)}***${nidNumber.slice(-3)}`,
      type: 'user',
      severity: 'normal',
    });
    addToast('National ID (NID) verified! "Verified Landlord" badge activated.', 'success');
  };

  const openSiteVisitModal = (prop: Property) => {
    setSiteVisitProperty(prop);
    setIsSiteVisitModalOpen(true);
  };

  const closeSiteVisitModal = () => {
    setSiteVisitProperty(null);
    setIsSiteVisitModalOpen(false);
  };

  const openInquiryModal = (prop: Property) => {
    setInquiryProperty(prop);
    setIsInquiryModalOpen(true);
  };

  const closeInquiryModal = () => {
    setInquiryProperty(null);
    setIsInquiryModalOpen(false);
  };

  // Property Handlers
  const addProperty = (newPropData: Partial<Property>) => {
    const newProperty: Property = {
      id: `prop-${Date.now().toString().slice(-6)}`,
      title: newPropData.title || 'Untitled Property',
      purpose: newPropData.purpose || 'buy',
      propertyType: newPropData.propertyType || 'apartment',
      status: currentUser.role === 'admin' ? 'approved' : 'pending',
      isFeatured: false,
      price: Number(newPropData.price) || 1000000,
      priceNegotiable: Boolean(newPropData.priceNegotiable),
      rentPeriod: newPropData.rentPeriod || 'month',
      city: newPropData.city || 'Dhaka',
      location: newPropData.location || 'Gulshan 1',
      address: newPropData.address || 'Dhaka, Bangladesh',
      areaSqFt: Number(newPropData.areaSqFt) || 1500,
      unitType: newPropData.unitType || 'sqft',
      bedrooms: Number(newPropData.bedrooms) || 3,
      bathrooms: Number(newPropData.bathrooms) || 3,
      balconies: Number(newPropData.balconies) || 2,
      floor: Number(newPropData.floor) || 4,
      totalFloors: Number(newPropData.totalFloors) || 8,
      completionStatus: newPropData.completionStatus || 'ready',
      handoverDate: newPropData.handoverDate || 'Immediate',
      facing: newPropData.facing || 'South',
      images: newPropData.images && newPropData.images.length > 0 ? newPropData.images : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
      ],
      amenities: newPropData.amenities || ['Lift', 'Generator', '24/7 Security CCTV'],
      description: newPropData.description || 'Modern property managed by Dream Properties Limited.',
      postedBy: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        email: currentUser.email,
        role: currentUser.role === 'admin' ? 'developer' : 'owner',
        isNidVerified: Boolean(currentUser.isNidVerified),
      },
      createdAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      rajukApproved: true,
      virtualTourRooms: newPropData.virtualTourRooms || [
        {
          room: 'Main Living Hall',
          url: newPropData.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        },
      ],
      nearbyPlaces: [
        { name: 'Nearest Metro Station', distance: '500m', type: 'transit' },
        { name: 'International School', distance: '800m', type: 'school' },
        { name: 'Specialized Hospital', distance: '1.2 km', type: 'hospital' },
      ],
    };

    setProperties((prev) => [newProperty, ...prev]);

    addAuditLog({
      action: 'PROPERTY_SUBMISSION',
      actor: currentUser.name,
      details: `New listing submitted: ${newProperty.title} (${newProperty.status.toUpperCase()})`,
      type: 'moderation',
      severity: 'normal',
    });

    if (currentUser.role === 'admin') {
      addToast('Property listing published directly as Admin!', 'success');
    } else {
      addToast('Property submitted successfully! Waiting for Admin approval.', 'success');
    }
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, ...updates } : prop))
    );
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty((prev) => (prev ? { ...prev, ...updates } : null));
    }
    addAuditLog({
      action: 'PROPERTY_UPDATE',
      actor: currentUser.name,
      details: `Updated parameters for property ${id}`,
      type: 'moderation',
      severity: 'normal',
    });
    addToast('Property listing updated successfully!', 'success');
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setCompareList((prev) => prev.filter((p) => p.id !== id));
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(null);
    }
    addAuditLog({
      action: 'PROPERTY_DELETED',
      actor: currentUser.name,
      details: `Removed property listing ${id}`,
      type: 'moderation',
      severity: 'warning',
    });
    addToast('Property listing removed', 'info');
  };

  const approveProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved', rejectionReason: undefined } : p))
    );
    addAuditLog({
      action: 'LISTING_APPROVED',
      actor: currentUser.name,
      details: `Approved and published listing ${id} to marketplace`,
      type: 'moderation',
      severity: 'normal',
    });
    addToast('Listing approved & published to marketplace!', 'success');
  };

  const rejectProperty = (id: string, reason: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected', rejectionReason: reason } : p))
    );
    addAuditLog({
      action: 'LISTING_REJECTED',
      actor: currentUser.name,
      details: `Listing ${id} rejected with reason: ${reason}`,
      type: 'moderation',
      severity: 'warning',
    });
    addToast('Listing rejected and marked with feedback note', 'info');
  };

  const toggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
    addToast('Featured status updated', 'info');
  };

  // Inquiry Submission
  const submitInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    // Find target property to assign ownerId
    const target = properties.find((p) => p.id === inquiryData.propertyId);
    const newInquiry: Inquiry = {
      ...inquiryData,
      ownerId: target?.postedBy.id,
      id: `inq-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString(),
      status: 'new',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    closeInquiryModal();
    addAuditLog({
      action: 'CUSTOMER_INQUIRY_CREATED',
      actor: inquiryData.senderName,
      details: `Inquiry sent for ${inquiryData.propertyTitle}`,
      type: 'user',
      severity: 'normal',
    });
    addToast('Your inquiry has been sent to the property manager!', 'success');
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    addToast(`Inquiry marked as ${status}`, 'info');
  };

  // Site Visit Booking
  const scheduleSiteVisit = (
    visitData: Omit<SiteVisit, 'id' | 'referenceCode' | 'createdAt' | 'status'>
  ) => {
    const target = properties.find((p) => p.id === visitData.propertyId);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newVisit: SiteVisit = {
      ...visitData,
      ownerId: target?.postedBy.id,
      id: `visit-${Date.now().toString().slice(-6)}`,
      referenceCode: `DPL-VISIT-${randomSuffix}`,
      createdAt: new Date().toLocaleString(),
      status: 'pending',
    };
    setSiteVisits((prev) => [newVisit, ...prev]);
    closeSiteVisitModal();
    addAuditLog({
      action: 'SITE_VISIT_BOOKED',
      actor: visitData.visitorName,
      details: `Visit code ${newVisit.referenceCode} booked for ${visitData.preferredDate}`,
      type: 'user',
      severity: 'normal',
    });
    addToast(`Site visit request booked! Reference: ${newVisit.referenceCode}`, 'success');
    return newVisit;
  };

  const updateSiteVisitStatus = (id: string, status: SiteVisit['status']) => {
    setSiteVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
    addToast(`Visit status updated to ${status}`, 'info');
  };

  const resetAllDemoData = () => {
    setProperties(INITIAL_PROPERTIES);
    setInquiries(INITIAL_INQUIRIES);
    setSiteVisits(INITIAL_SITE_VISITS);
    setFavorites(['prop-001', 'prop-003']);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAdminPasswords(['admin1234', 'dream2026', 'admin@123']);
    setCurrentUser(DEMO_USERS[1]);
    localStorage.clear();
    addToast('Reset to original sample data successfully!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        properties,
        currentUser,
        inquiries,
        siteVisits,
        favorites,
        compareList,
        auditLogs,
        activeView,
        selectedProperty,
        siteVisitProperty,
        inquiryProperty,
        isSiteVisitModalOpen,
        isInquiryModalOpen,
        isAuthModalOpen,
        isProposalModalOpen,
        isAdminLoginModalOpen,
        isAdminAuthenticated,
        isCompareModalOpen,
        isBrochureModalOpen,
        adminFailedAttempts,
        adminLockoutSeconds,
        filterState,
        toasts,
        setActiveView,
        setSelectedProperty,
        openSiteVisitModal,
        closeSiteVisitModal,
        openInquiryModal,
        closeInquiryModal,
        setIsAuthModalOpen,
        setIsProposalModalOpen,
        setIsCompareModalOpen,
        setIsBrochureModalOpen,
        openAdminLoginModal,
        closeAdminLoginModal,
        loginAdminWithPassword,
        logoutAdmin,
        changeAdminPassword,
        addToCompare,
        removeFromCompare,
        clearCompare,
        setFilterState,
        resetFilters,
        toggleFavorite,
        setCurrentUser,
        quickSwitchRole,
        verifyUserNid,
        addToast,
        removeToast,
        addAuditLog,
        addProperty,
        updateProperty,
        deleteProperty,
        approveProperty,
        rejectProperty,
        toggleFeatured,
        submitInquiry,
        updateInquiryStatus,
        scheduleSiteVisit,
        updateSiteVisitStatus,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
