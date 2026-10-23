import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDTPrice } from '../utils/formatters';
import { X, Calendar, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export const SiteVisitModal: React.FC = () => {
  const {
    isSiteVisitModalOpen,
    closeSiteVisitModal,
    siteVisitProperty,
    currentUser,
    scheduleSiteVisit,
  } = useApp();

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [visitorName, setVisitorName] = useState(currentUser.name || '');
  const [visitorPhone, setVisitorPhone] = useState(currentUser.phone || '');
  const [visitorEmail, setVisitorEmail] = useState(currentUser.email || '');
  const [notes, setNotes] = useState('');
  const [bookedReference, setBookedReference] = useState<string | null>(null);

  if (!isSiteVisitModalOpen || !siteVisitProperty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim() || !date) {
      return;
    }

    const created = scheduleSiteVisit({
      propertyId: siteVisitProperty.id,
      propertyTitle: siteVisitProperty.title,
      propertyLocation: `${siteVisitProperty.location}, ${siteVisitProperty.city}`,
      visitorName,
      visitorPhone,
      visitorEmail,
      preferredDate: date,
      preferredTimeSlot: timeSlot,
      notes,
    });

    setBookedReference(created.referenceCode);
  };

  const handleClose = () => {
    setBookedReference(null);
    closeSiteVisitModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Schedule In-Person Site Visit</h3>
              <p className="text-xs text-slate-300">
                Direct property inspection by Dream Properties Limited
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookedReference ? (
          /* Confirmation State */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Site Visit Confirmed!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Our property officer will meet you on site. A confirmation SMS will be dispatched to {visitorPhone}.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-emerald-700">{bookedReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold text-slate-900">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold capitalize text-slate-900">
                  {timeSlot === 'morning' ? 'Morning (10:00 AM - 1:00 PM)' : timeSlot === 'afternoon' ? 'Afternoon (2:00 PM - 5:00 PM)' : 'Evening (5:00 PM - 7:30 PM)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Property:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{siteVisitProperty.title}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Done & Return to Property
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Property Card Snapshot */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <img
                src={siteVisitProperty.images[0]}
                alt={siteVisitProperty.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-slate-900 line-clamp-1">
                  {siteVisitProperty.title}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{siteVisitProperty.location}, {siteVisitProperty.city}</span>
                </div>
                <div className="font-bold text-emerald-700 text-xs mt-1">
                  {formatBDTPrice(siteVisitProperty.price, siteVisitProperty.purpose === 'rent')}
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Select Preferred Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Preferred Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: 'Morning', hours: '10 AM - 1 PM' },
                  { id: 'afternoon', label: 'Afternoon', hours: '2 PM - 5 PM' },
                  { id: 'evening', label: 'Evening', hours: '5 PM - 7:30 PM' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setTimeSlot(slot.id as any)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      timeSlot === slot.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-semibold text-xs">{slot.label}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{slot.hours}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Tariq Hasan"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Mobile Number (BD)</label>
                <input
                  type="tel"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder="+880 1711-xxxxxx"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Special Instructions or Questions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Please bring architectural floor plans or title deed copy."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg text-[11px] text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complimentary site visit by verified Dream Properties field executive.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" /> Confirm Site Visit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
