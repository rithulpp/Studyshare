/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { NotesGrid } from './components/NotesGrid';
import { UploadModal } from './components/UploadModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { PYQSection } from './components/PYQSection';
import { ContactFeedbackView } from './components/ContactFeedbackView';
import { PhpSourceModal } from './components/PhpSourceModal';
import { Footer } from './components/Footer';
import { Note, User, PlatformStats, ViewTab } from './types';
import {
  BookOpen,
  UploadCloud,
  FileQuestion,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');

  // Notes data & Loading
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(true);

  // Platform stats
  const [stats, setStats] = useState<PlatformStats>({
    totalNotes: 8,
    totalDownloads: 3750,
    totalViews: 9800,
    totalPYQs: 4,
    totalStudents: 120,
    departmentsCount: 7
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('studyshare_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('studyshare_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch notes from server with current filters
  const fetchNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedDepartment !== 'all') params.append('department', selectedDepartment);
      if (selectedSemester !== 'all') params.append('semester', selectedSemester);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedSort !== 'newest') params.append('sort', selectedSort);

      const res = await fetch(`/api/notes?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.notes) {
        setNotes(data.notes);
      }
    } catch (err) {
      console.error('Failed to load notes from server:', err);
    } finally {
      setIsLoadingNotes(false);
    }
  }, [searchQuery, selectedDepartment, selectedSemester, selectedCategory, selectedSort]);

  // Fetch stats from server
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch platform stats:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Save user to localStorage
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('studyshare_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('studyshare_user');
    } catch (e) {
      console.warn(e);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = (noteId: string) => {
    setBookmarkedIds(prev => {
      const updated = prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId];
      try {
        localStorage.setItem('studyshare_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  // Handle Download: Triggers download endpoint and updates count
  const handleDownload = (note: Note) => {
    const downloadUrl = `/api/download/${note.id}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', note.originalFileName || `${note.subject}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optimistically update local download count
    setNotes(prev =>
      prev.map(n => (n.id === note.id ? { ...n, downloadsCount: n.downloadsCount + 1 } : n))
    );
    setStats(prev => ({ ...prev, totalDownloads: prev.totalDownloads + 1 }));
  };

  // Handle Rate Note
  const handleRateNote = async (noteId: string, rating: number) => {
    try {
      const res = await fetch(`/api/notes/${noteId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });
      const data = await res.json();
      if (data.success) {
        setNotes(prev =>
          prev.map(n =>
            n.id === noteId
              ? { ...n, rating: data.newRating, ratingCount: data.ratingCount }
              : n
          )
        );
        if (previewNote && previewNote.id === noteId) {
          setPreviewNote({
            ...previewNote,
            rating: data.newRating,
            ratingCount: data.ratingCount
          });
        }
      }
    } catch (err) {
      console.error('Failed to rate note:', err);
    }
  };

  // Handle Delete Note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
        setStats(prev => ({ ...prev, totalNotes: Math.max(0, prev.totalNotes - 1) }));
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  // Upload callback
  const handleUploadSuccess = (newNote: Note) => {
    setNotes(prev => [newNote, ...prev]);
    setStats(prev => ({ ...prev, totalNotes: prev.totalNotes + 1 }));
    fetchNotes();
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedSemester('all');
    setSelectedCategory('all');
    setSelectedSort('newest');
  };

  // Filter for PYQ section specifically
  const pyqNotes = notes.filter(n => n.category === 'pyq');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={e => {
                if (e) e.preventDefault();
                setCurrentTab('notes');
              }}
              onOpenUpload={() => setIsUploadOpen(true)}
              onExplorePYQ={() => setCurrentTab('pyq')}
              onSelectSubjectChip={subj => {
                setSearchQuery(subj);
                setCurrentTab('notes');
              }}
              stats={stats}
            />

            {/* Semester Quick Explorer Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Browse Notes by Semester
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your current semester to jump straight into relevant course materials
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setCurrentTab('notes');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  View All Semesters <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                  const countForSem = notes.filter(n => n.semester === sem).length;
                  return (
                    <button
                      key={sem}
                      onClick={() => {
                        setSelectedSemester(String(sem));
                        setCurrentTab('notes');
                      }}
                      className="bg-white hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-300 rounded-xl p-3.5 text-center transition-all group shadow-xs hover:shadow-md cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-sm flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        S{sem}
                      </div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                        Semester {sem}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {countForSem} {countForSem === 1 ? 'file' : 'files'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Study Notes & Materials */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Featured & High-Rated Notes
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Peer-reviewed notes with top student ratings and verified permanent server links
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('notes')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  See Full Catalog <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <NotesGrid
                notes={notes.slice(0, 6)}
                isLoading={isLoadingNotes}
                onPreview={note => setPreviewNote(note)}
                onDownload={handleDownload}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                onRate={handleRateNote}
                onResetFilters={handleResetFilters}
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            </div>

            {/* Previous Year Questions Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded">
                    University Exams Revision
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Preparing for End-Semester Exams?
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    Download authentic previous year question papers (2020-2025) with solved answers,
                    marking schemes, and high-frequency topics.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setCurrentTab('pyq')}
                    className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-blue-50 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Solve PYQs Now
                  </button>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Upload Exam Paper
                  </button>
                </div>
              </div>
            </div>

            {/* Why StudyShare Callout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Permanent Server Storage</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Uploaded PDF files are stored on server disk. No expired links or temporary browser session loss.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Strict File Validation</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Only authentic PDF documents are permitted. Safe, clean, and free of malware or executable spam.
                  </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">100% Free Peer Learning</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Built to make academic resources freely accessible for every college student across semesters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'notes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                All Shared Study Notes
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Search, filter by semester and department, preview in-browser, and download verified PDF files.
              </p>
            </div>

            {/* Filter Toolbar */}
            <FilterBar
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              onResetFilters={handleResetFilters}
              totalResults={notes.length}
            />

            {/* Notes Grid */}
            <NotesGrid
              notes={notes}
              isLoading={isLoadingNotes}
              onPreview={note => setPreviewNote(note)}
              onDownload={handleDownload}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              onRate={handleRateNote}
              onResetFilters={handleResetFilters}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          </div>
        )}

        {currentTab === 'pyq' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PYQSection
              pyqNotes={pyqNotes}
              onPreview={note => setPreviewNote(note)}
              onDownload={handleDownload}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          </div>
        )}

        {currentTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DashboardView
              currentUser={currentUser}
              allNotes={notes}
              bookmarkedIds={bookmarkedIds}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onPreview={note => setPreviewNote(note)}
              onDownload={handleDownload}
              onDeleteNote={handleDeleteNote}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {currentTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ContactFeedbackView currentUser={currentUser} />
          </div>
        )}

        {currentTab === 'php-source' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PhpSourceModal isInlineView={true} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={tab => setCurrentTab(tab)}
        onFilterSemester={sem => setSelectedSemester(sem)}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentUser={currentUser}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* PDF In-browser Viewer Modal */}
      <PdfViewerModal
        note={previewNote}
        onClose={() => setPreviewNote(null)}
        onDownload={handleDownload}
        onRate={handleRateNote}
      />

      {/* Student Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
