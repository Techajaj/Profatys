import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Building2,
  Compass,
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Property Purchase Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      addToast('Please fill out all required fields', 'error');
      return;
    }

    setSubmitted(true);
    addToast('Your message has been received by our Gulshan 1 desk!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Contact Dream Properties Limited
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Our real estate consultants in Gulshan 1 are ready to assist with sales, valuations, and scheduled site visits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info & Office Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-6 shadow-xl">
            <div>
              <h3 className="font-bold text-base text-white">Gulshan Office</h3>
              <p className="text-xs text-slate-400 mt-1">
                Corporate Headquarters & Client Reception
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-200">Office Location</span>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    House 07, Road 126, Behind Renaissance Hotel, Gulshan 1, Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-200">Direct Telephone</span>
                  <p className="text-slate-400 mt-0.5">+880 1711-234567</p>
                  <p className="text-slate-400">+880 2-9887766 (Hunting)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-200">Email Address</span>
                  <p className="text-slate-400 mt-0.5">info@dreamproperties.bd</p>
                  <p className="text-slate-400">sales@dreamproperties.bd</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-200">Visiting Hours</span>
                  <p className="text-slate-400 mt-0.5">Saturday – Thursday: 9:30 AM – 7:30 PM</p>
                  <p className="text-slate-400">Friday: By Prior Appointment</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-2">
              <a
                href="https://wa.me/8801711234567?text=Hello%20Dream%20Properties%20Limited,%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>💬 Chat on WhatsApp (+880 1711-234567)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Working Message Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Delivered!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contacting Dream Properties Limited. Our senior relationship manager
                will reach out to {phone} within 2 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-base text-slate-900">Send an Inquiry or Feedback</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Have questions about property valuation, deed verification, or project sales?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mahbubul Alam"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number (BD) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1711-xxxxxx"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Property Purchase Inquiry">Property Purchase Inquiry</option>
                    <option value="Rental Listing Assistance">Rental Listing Assistance</option>
                    <option value="Landlord Property Submission">Landlord Property Submission</option>
                    <option value="Commercial Space Lease">Commercial Space Lease</option>
                    <option value="Site Visit Booking">Site Visit Booking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Describe your property requirements, preferred location in Dhaka, or question..."
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Gulshan Office</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Map Visual for Gulshan 1 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Interactive Location Pin • Gulshan 1, Dhaka
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Latitude: 23.7772° N, Longitude: 90.4165° E
          </span>
        </div>

        {/* Styled Simulated City Map Grid */}
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
          {/* Stylized dark map roads */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-700 -translate-y-1/2 transform -rotate-6" />
            <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-slate-700 transform rotate-12" />
            <div className="absolute top-0 bottom-0 right-1/3 w-3 bg-slate-800" />
            <div className="absolute top-1/4 left-0 right-0 h-2 bg-slate-800" />
            <div className="absolute top-3/4 left-0 right-0 h-2 bg-slate-800" />
          </div>

          {/* Landmarks */}
          <div className="absolute top-8 left-12 p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-[10px] hidden sm:block">
            🏨 Renaissance Dhaka Gulshan Hotel
          </div>
          <div className="absolute bottom-8 right-12 p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-[10px] hidden sm:block">
            🏢 Police Plaza Concord & Gulshan 1 Circle
          </div>

          {/* Center Office Pin */}
          <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
            <div className="p-3 bg-emerald-600 text-white rounded-full shadow-2xl ring-4 ring-emerald-400/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="mt-2 px-3 py-1 bg-white text-slate-900 rounded-lg shadow-xl text-xs font-bold border border-slate-200">
              Dream Properties Limited HQ
              <span className="block text-[10px] font-normal text-slate-500">House 07, Road 126</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
