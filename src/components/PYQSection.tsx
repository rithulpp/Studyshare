import React, { useState } from 'react';
import {
  FileQuestion,
  Search,
  Download,
  Eye,
  Calendar,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { Note, DEPARTMENTS, SEMESTERS } from '../types';

interface PYQSectionProps {
  pyqNotes: Note[];
  onPreview: (note: Note) => void;
  onDownload: (note: Note) => void;
  onOpenUpload: () => void;
}

export const PYQSection: React.FC<PYQSectionProps> = ({
  pyqNotes,
  onPreview,
  onDownload,
  onOpenUpload
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSem, setSelectedSem] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const filteredPYQs = pyqNotes.filter(item => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        (item.subjectCode && item.subjectCode.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedDept !== 'all' && item.department !== selectedDept) return false;
    if (selectedSem !== 'all' && item.semester !== Number(selectedSem)) return false;
    if (selectedYear !== 'all' && item.examYear !== selectedYear) return false;
    return true;
  });

  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-100 mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Exam Preparation Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Previous Year Question Papers (PYQ)
          </h2>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Practice with authentic university examination papers, end-semester question banks,
            and verified step-by-step solutions contributed by senior students and top scorers.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 text-xs font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Upload Question Paper (PDF)
            </button>
            <span className="text-xs text-blue-200">
              {filteredPYQs.length} exam papers available
            </span>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-white/10 to-transparent pointer-events-none transform translate-x-20 rounded-full blur-2xl"></div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            Subject Search
          </label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exam paper by subject..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Department
          </label>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Semester
          </label>
          <select
            value={selectedSem}
            onChange={e => setSelectedSem(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Semesters</option>
            {SEMESTERS.map(s => (
              <option key={s} value={String(s)}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Year */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Examination Year
          </label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PYQ List */}
      {filteredPYQs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Question Papers Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No previous year question papers found for the selected filters. Be the first to upload one!
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
          >
            Upload Question Paper PDF
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPYQs.map(pyq => (
            <div
              key={pyq.id}
              className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    Exam Year {pyq.examYear || 'Recent'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Sem {pyq.semester} · {pyq.subjectCode || 'Exam'}
                  </div>
                </div>

                <h3
                  onClick={() => onPreview(pyq)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                >
                  {pyq.title}
                </h3>

                <div className="text-xs font-semibold text-slate-700 mt-1">
                  Subject: <span className="text-blue-700">{pyq.subject}</span>
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {pyq.department}
                </div>

                {pyq.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {pyq.description}
                  </p>
                )}

                <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
                  <span>{pyq.university}</span>
                  <span aria-hidden="true">·</span>
                  <span>{pyq.studentName}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  {pyq.downloadsCount} downloads
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onPreview(pyq)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => onDownload(pyq)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
