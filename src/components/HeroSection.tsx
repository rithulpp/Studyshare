import React from 'react';
import {
  Search,
  UploadCloud,
  FileQuestion,
  BookOpen,
  CheckCircle2,
  HardDrive,
  Users,
  Award
} from 'lucide-react';
import { PlatformStats } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e?: React.FormEvent) => void;
  onOpenUpload: () => void;
  onExplorePYQ: () => void;
  onSelectSubjectChip: (subject: string) => void;
  stats: PlatformStats;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onOpenUpload,
  onExplorePYQ,
  onSelectSubjectChip,
  stats
}) => {
  const popularKeywords = [
    'Data Structures',
    'Operating Systems',
    'DBMS',
    'Fluid Mechanics',
    'Engineering Maths',
    'DSP',
    'Computer Networks'
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-blue-100/60 pt-10 pb-12 sm:pt-16 sm:pb-16">
      {/* Subtle academic background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #1d4ed8 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top subtle kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100/80 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>StudyShare Academic Peer Network</span>
            <span className="text-blue-400">·</span>
            <span>Permanent Server Storage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Share Knowledge. Ace Exams. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
              Free College Notes & PYQs
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A centralized student repository for handwritten summaries, professor lecture slides,
            and previous year university question papers. Upload once, saved permanently for everyone.
          </p>

          {/* Search Box */}
          <form
            onSubmit={onSearchSubmit}
            className="mt-8 max-w-2xl mx-auto flex items-center bg-white rounded-xl shadow-md shadow-blue-900/5 border border-blue-200/80 p-1.5 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
          >
            <div className="pl-3 text-blue-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by subject name (e.g. Data Structures, Operating Systems, Math)..."
              className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick subject keywords */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Popular:</span>
            {popularKeywords.map(kw => (
              <button
                key={kw}
                onClick={() => onSelectSubjectChip(kw)}
                className="px-2.5 py-1 text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200/90 rounded-md transition-all text-xs font-medium cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Hero Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Study Notes (PDF)
            </button>
            <button
              onClick={onExplorePYQ}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50/80 border border-blue-200 rounded-xl shadow-xs transition-all hover:-translate-y-0.5"
            >
              <FileQuestion className="w-4 h-4 text-blue-600" />
              Solve Previous Year Papers
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-blue-100/80">
          <div className="bg-white/80 p-4 rounded-xl border border-blue-100/70 text-center">
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalNotes || 8}+</div>
            <div className="text-xs text-slate-500 font-medium">Uploaded Resources</div>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-blue-100/70 text-center">
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalDownloads || '3,700'}+</div>
            <div className="text-xs text-slate-500 font-medium">PDF Downloads</div>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-blue-100/70 text-center">
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalPYQs || 4} Sets</div>
            <div className="text-xs text-slate-500 font-medium">Exam Question Papers</div>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-blue-100/70 text-center">
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">100% Free</div>
            <div className="text-xs text-slate-500 font-medium">Server Stored Permanently</div>
          </div>
        </div>
      </div>
    </div>
  );
};
