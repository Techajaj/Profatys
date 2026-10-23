import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDTPrice } from '../utils/formatters';
import { X, Send, Phone, MessageSquare, MapPin, CheckCircle } from 'lucide-react';

export const InquiryModal: React.FC = () => {
  const {
    isInquiryModalOpen,
    closeInquiryModal,
    inquiryProperty,
    currentUser,
    submitInquiry,
  } = useApp();

  const [senderName, setSenderName] = useState(currentUser.name || '');
  const [senderPhone, setSenderPhone] = useState(currentUser.phone || '');
  const [senderEmail, setSenderEmail] = useState(currentUser.email || '');
  const [message, setMessage] = useState(
    'I am interested in this property. Please contact me with more information and availability.'
  );

  if (!isInquiryModalOpen || !inquiryProperty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderPhone.trim() || !message.trim()) return;

    submitInquiry({
      propertyId: inquiryProperty.id,
      propertyTitle: inquiryProperty.title,
      propertyPrice: inquiryProperty.price,
      propertyPurpose: inquiryProperty.purpose,
      senderName,
      senderPhone,
      senderEmail,
      message,
    });
  };

  const quickQuestions = [
    'Is the price negotiable?',
    'Is RAJUK approval available?',
    'What is the monthly service charge?',
    'Can I schedule a weekend visit?',
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello Dream Properties! I am interested in "${inquiryProperty.title}" located in ${inquiryProperty.location} (${formatBDTPrice(inquiryProperty.price, inquiryProperty.purpose === 'rent')}). Please share further details.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Inquire About Property</h3>
              <p className="text-xs text-slate-300">
                Direct inquiry to Dream Properties Limited sales desk
              </p>
            </div>
          </div>
          <button
            onClick={closeInquiryModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Property Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <img
              src={inquiryProperty.images[0]}
              alt={inquiryProperty.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-slate-900 line-clamp-1">
                {inquiryProperty.title}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{inquiryProperty.location}, {inquiryProperty.city}</span>
              </div>
              <div className="font-bold text-emerald-700 text-xs mt-1">
                {formatBDTPrice(inquiryProperty.price, inquiryProperty.purpose === 'rent')}
              </div>
            </div>
          </div>

          {/* Quick Instant WhatsApp & Phone Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/8801711234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-lg border border-emerald-200 transition-colors text-xs"
            >
              <span>💬 Direct WhatsApp</span>
            </a>
            <a
              href={`tel:+8801711234567`}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-lg border border-slate-200 transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Hotline</span>
            </a>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="+880 17xx-xxxxxx"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="name@email.com"
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Quick Questions helper */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Common Questions (Click to insert):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setMessage((prev) => (prev ? `${prev} ${q}` : q))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] rounded-md transition-colors"
                >
                  + {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeInquiryModal}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
