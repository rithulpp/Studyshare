import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Mail,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import { User } from '../types';

interface ContactFeedbackViewProps {
  currentUser: User | null;
}

export const ContactFeedbackView: React.FC<ContactFeedbackViewProps> = ({ currentUser }) => {
  const [name, setName] = useState(currentUser ? currentUser.name : '');
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Feedback');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all fields (Name, Email, and Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || 'General Feedback',
          category,
          rating,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Submission failed');
      }

      setSubmitted(true);
      setMessage('');
      setSubject('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-150">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Student Support & Continuous Improvement</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact & Feedback Center
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Need a specific subject question paper? Found an issue with a PDF? Or want to suggest a new feature?
          We are built by students, for students.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Send Feedback or Request Notes</h2>
          <p className="text-xs text-slate-500 mb-6">
            Your message will be reviewed by student moderators within 24 hours.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Thank You!</h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Your feedback has been logged into the StudyShare database. We appreciate your contribution to making college learning accessible!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-2 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 rounded-lg shadow-xs hover:bg-emerald-50 transition-colors"
              >
                Send Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    College Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Feedback Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Feedback">General Feedback & Suggestion</option>
                    <option value="Notes Request">Request Missing Subject Notes</option>
                    <option value="PYQ Request">Request Previous Year Paper (PYQ)</option>
                    <option value="Bug Report">Report a Broken PDF / Issue</option>
                    <option value="Contributor">Become a Campus Moderator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Subject / Topic Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Need 4th Sem OS Question Paper"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Rating selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  How would you rate StudyShare platform?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-2">
                    {rating === 5 ? 'Excellent (5/5)' : rating >= 4 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Share details of the subject, semester, or feedback you would like to submit..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting to Server...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Information & FAQs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Direct Support Channels</h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Student Support Desk</span>
                  <span className="text-blue-600">support@studyshare.edu</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Academic Campus Coordinator</span>
                  <span>Central Library Block, Academic Resources Division</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Response Time</span>
                  <span>Within 12-24 hours on college working days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-2 text-xs">
              <details className="bg-white p-3 rounded-lg border border-blue-100 cursor-pointer">
                <summary className="font-bold text-slate-800">
                  Are notes really saved permanently?
                </summary>
                <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed">
                  Yes! All PDF files uploaded to StudyShare are written directly to permanent server-side disk storage and cataloged in the database.
                </p>
              </details>

              <details className="bg-white p-3 rounded-lg border border-blue-100 cursor-pointer">
                <summary className="font-bold text-slate-800">
                  Is there any download limit or paywall?
                </summary>
                <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed">
                  No. StudyShare is completely free for all college students. There are no credit systems, paywalls, or forced subscriptions.
                </p>
              </details>

              <details className="bg-white p-3 rounded-lg border border-blue-100 cursor-pointer">
                <summary className="font-bold text-slate-800">
                  Can I upload handwritten notes?
                </summary>
                <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed">
                  Absolutely! Simply scan your pages into a clean PDF using Adobe Scan, CamScanner, or Google Drive scan, and upload under your semester.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
