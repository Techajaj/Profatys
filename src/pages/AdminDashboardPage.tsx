import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property, Inquiry, SiteVisit, SecurityAuditLog } from '../types';
import { formatBDTPrice, calculatePricePerSqFt } from '../utils/formatters';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  Users,
  MessageSquare,
  Calendar,
  Sparkles,
  Trash2,
  Eye,
  Check,
  AlertTriangle,
  Send,
  Phone,
  Mail,
  Filter,
  DollarSign,
  Download,
  KeyRound,
  Shield,
  Activity,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    properties,
    inquiries,
    siteVisits,
    auditLogs,
    approveProperty,
    rejectProperty,
    toggleFeatured,
    deleteProperty,
    updateInquiryStatus,
    updateSiteVisitStatus,
    setSelectedProperty,
    addToast,
    currentUser,
    isAdminAuthenticated,
    loginAdminWithPassword,
    logoutAdmin,
    changeAdminPassword,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'approvals' | 'all-listings' | 'inquiries' | 'visits' | 'audit' | 'security'
  >('approvals');
  const [rejectingPropId, setRejectingPropId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState(
    'Please attach a clearer floor plan and verify RAJUK mutation documents.'
  );
  const [lockPass, setLockPass] = useState('');
  const [lockError, setLockError] = useState<string | null>(null);

  // Password rotation state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const pendingListings = properties.filter((p) => p.status === 'pending');
  const approvedListings = properties.filter((p) => p.status === 'approved');

  const totalBuyValue = properties
    .filter((p) => p.purpose === 'buy')
    .reduce((acc, curr) => acc + curr.price, 0);

  const handleConfirmReject = (id: string) => {
    if (!rejectReason.trim()) {
      addToast('Please enter a rejection feedback reason', 'error');
      return;
    }
    rejectProperty(id, rejectReason.trim());
    setRejectingPropId(null);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      addToast('New password and confirm password do not match', 'error');
      return;
    }
    const success = changeAdminPassword(oldPass, newPass);
    if (success) {
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  const exportInquiriesCSV = () => {
    if (inquiries.length === 0) {
      addToast('No inquiries available to export', 'info');
      return;
    }
    const headers = ['ID,Property Title,Sender Name,Phone,Email,Status,Message,Date'];
    const rows = inquiries.map(
      (i) =>
        `"${i.id}","${i.propertyTitle.replace(/"/g, '""')}","${i.senderName}","${i.senderPhone}","${i.senderEmail}","${i.status}","${i.message.replace(/"/g, '""')}","${i.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `dream_properties_leads_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Customer leads exported to CSV successfully!', 'success');
  };

  // If user navigated to admin page without password authentication, show secure lock screen
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black">Admin Panel is Hidden & Protected</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Please enter the specific system administrator password to access the approval queue and leads inbox.
            </p>
          </div>

          {lockError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {lockError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginAdminWithPassword(lockPass);
              if (!ok) {
                setLockError('Incorrect password. Access denied.');
              }
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={lockPass}
                onChange={(e) => {
                  setLockPass(e.target.value);
                  setLockError(null);
                }}
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-700 rounded-xl bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
              <span>Configured Passwords:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setLockPass('admin1234')}
                  className="font-mono text-amber-400 font-bold bg-slate-700 px-2 py-0.5 rounded hover:bg-slate-600"
                >
                  admin1234
                </button>
                <button
                  type="button"
                  onClick={() => setLockPass('dream2026')}
                  className="font-mono text-emerald-400 font-bold bg-slate-700 px-2 py-0.5 rounded hover:bg-slate-600"
                >
                  dream2026
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveView('home')}
                className="flex-1 py-2.5 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors text-center"
              >
                Return to Home
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors text-center shadow-lg"
              >
                Unlock Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                Administration & Approval Suite
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-slate-950">
                Admin Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Dream Properties Limited • Compliance, Approval Queue & Security Dashboard (Section 2.C)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportInquiriesCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700"
            title="Download CSV of all inquiries"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Leads CSV</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            title="Lock & Exit Administration Mode"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock & Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600">{pendingListings.length}</span>
          <span className="block text-[11px] text-slate-400 mt-0.5">Awaiting publication</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Live Portfolio</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700">{approvedListings.length}</span>
          <span className="block text-[11px] text-slate-400 mt-0.5">Active on marketplace</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Inquiries</span>
            <MessageSquare className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{inquiries.length}</span>
          <span className="block text-[11px] text-slate-400 mt-0.5">Customer leads</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Asset Value</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            ৳ {(totalBuyValue / 10000000).toFixed(1)} Cr
          </span>
          <span className="block text-[11px] text-slate-400 mt-0.5">Managed properties</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Approvals Queue ({pendingListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all-listings')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all-listings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4 text-emerald-600" />
          <span>All Properties ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-sky-600" />
          <span>Leads & Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('visits')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'visits'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Site Visits ({siteVisits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4 text-teal-600" />
          <span>Security Audit Logs ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>Admin Security & Passwords</span>
        </button>
      </div>

      {/* TAB 1: Approvals Queue */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Pending Submissions Review Queue
            </h2>
            <p className="text-xs text-slate-500">
              Review property specifications, floor plans, and photos before approving to the public marketplace.
            </p>
          </div>

          {pendingListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">All caught up!</h3>
              <p className="text-xs text-slate-500">
                There are no pending submissions awaiting moderation at this moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingListings.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-24 h-24 rounded-lg object-cover shrink-0 cursor-pointer"
                        onClick={() => setSelectedProperty(prop)}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            Pending Review
                          </span>
                          <span className="text-xs text-slate-500 font-semibold uppercase">
                            For {prop.purpose} • {prop.propertyType}
                          </span>
                          <span className="text-xs text-slate-400">
                            Submitted on {prop.createdAt}
                          </span>
                        </div>

                        <h3
                          onClick={() => setSelectedProperty(prop)}
                          className="font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer"
                        >
                          {prop.title}
                        </h3>

                        <p className="text-xs text-slate-600">
                          {prop.location}, {prop.city} • {prop.areaSqFt} {prop.unitType} • {prop.bedrooms} Bed, {prop.bathrooms} Bath
                        </p>

                        <div className="text-sm font-black text-emerald-700">
                          {formatBDTPrice(prop.price, prop.purpose === 'rent', prop.rentPeriod)}
                        </div>

                        <div className="text-xs text-slate-500 pt-1">
                          Posted by: <span className="font-semibold text-slate-800">{prop.postedBy.name}</span> ({prop.postedBy.phone})
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedProperty(prop)}
                        className="py-2 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => approveProperty(prop.id)}
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>

                      <button
                        onClick={() => setRejectingPropId(prop.id)}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {rejectingPropId === prop.id && (
                    <div className="pt-3 border-t border-slate-100 bg-rose-50/50 p-4 rounded-xl space-y-2">
                      <label className="block text-xs font-bold text-rose-900">
                        Specify Reason for Rejection (sent to user dashboard):
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRejectingPropId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmReject(prop.id)}
                          className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manage All Listings */}
      {activeTab === 'all-listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              All Properties Inventory ({properties.length})
            </h2>
            <span className="text-xs text-slate-500">
              Toggle Featured homepage showcase & listing visibility
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Type & City</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt=""
                          className="w-12 h-10 object-cover rounded-md shrink-0"
                        />
                        <div className="min-w-0 max-w-[220px]">
                          <span
                            onClick={() => setSelectedProperty(prop)}
                            className="font-bold text-slate-900 truncate block hover:text-emerald-700 cursor-pointer"
                          >
                            {prop.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            By {prop.postedBy.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 capitalize">
                        {prop.propertyType}
                      </span>
                      <span className="block text-[11px] text-slate-500">{prop.location}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700">
                      {formatBDTPrice(prop.price, prop.purpose === 'rent', prop.rentPeriod)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          prop.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prop.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(prop.id)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                          prop.isFeatured
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {prop.isFeatured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProperty(prop)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProperty(prop.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Customer Leads & Messages ({inquiries.length})
            </h2>
            <button
              onClick={exportInquiriesCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{inq.senderName}</span>
                    <div className="flex items-center gap-3 text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <a href={`tel:${inq.senderPhone}`} className="hover:underline">
                          {inq.senderPhone}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{inq.senderEmail}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inq.status === 'new'
                          ? 'bg-rose-100 text-rose-800'
                          : inq.status === 'contacted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-slate-400 text-[10px]">{inq.createdAt}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                  <div className="text-[11px] font-bold text-slate-700">
                    Property: {inq.propertyTitle} ({formatBDTPrice(inq.propertyPrice, inq.propertyPurpose === 'rent')})
                  </div>
                  <p className="text-slate-700 leading-relaxed italic">"{inq.message}"</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Update Lead Status:</span>
                    <select
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                      className="px-2 py-1 border border-slate-200 rounded text-xs bg-white font-medium"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${inq.senderPhone.replace(/[^0-9]/g, '')}?text=Hello ${inq.senderName}, Dream Properties Limited responding to your inquiry.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded font-semibold transition-colors"
                    >
                      WhatsApp Reply
                    </a>
                    <a
                      href={`tel:${inq.senderPhone}`}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded font-semibold transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Visits */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Scheduled Physical Inspections ({siteVisits.length})
            </h2>
            <span className="text-xs text-slate-500">Site-visit request bookings from clients</span>
          </div>

          <div className="space-y-3">
            {siteVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {visit.referenceCode}
                    </span>
                    <span className="font-bold text-slate-900">{visit.visitorName}</span>
                    <span className="text-slate-400">({visit.visitorPhone})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <select
                      value={visit.status}
                      onChange={(e) => updateSiteVisitStatus(visit.id, e.target.value as any)}
                      className="px-2 py-1 border border-slate-200 rounded text-xs bg-white font-semibold"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">Target Property:</span>{' '}
                    {visit.propertyTitle}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Inspection Slot:</span>{' '}
                    <span className="font-bold text-slate-900">{visit.preferredDate}</span> ({visit.preferredTimeSlot.toUpperCase()})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Security Audit Logs Stream */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security Audit Trail & Logs</h2>
              <p className="text-xs text-slate-500">
                Tamper-evident record of administrative operations, login verifications, and compliance checks
              </p>
            </div>
            <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Active Sentinel Monitoring</span>
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action Type</th>
                  <th className="px-4 py-3">Operator / Actor</th>
                  <th className="px-4 py-3">Audit Details</th>
                  <th className="px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 font-bold font-mono text-slate-800">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{log.actor}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs">{log.details}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : log.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: Admin Security & Password Rotation */}
      {activeTab === 'security' && (
        <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <span>Update Master Admin Password</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Change the administrative access passphrase required to unlock this dashboard
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Enter current password (e.g. admin1234)"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                New Master Password *
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-type new password"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1 text-[11px]">
              <span className="font-bold block">Security Note:</span>
              <p>
                Updating this passphrase will update your browser session's master key. Make sure to note
                down your new password for subsequent logins.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Update Admin Passphrase
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
