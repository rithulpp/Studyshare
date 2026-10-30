import React, { useState } from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Download,
  Eye,
  Trash2,
  Bookmark,
  User as UserIcon,
  GraduationCap,
  Building2,
  FileText,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  HardDrive
} from 'lucide-react';
import { User, Note } from '../types';

interface DashboardViewProps {
  currentUser: User | null;
  allNotes: Note[];
  bookmarkedIds: string[];
  onOpenAuth: () => void;
  onOpenUpload: () => void;
  onPreview: (note: Note) => void;
  onDownload: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleBookmark: (noteId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  allNotes,
  bookmarkedIds,
  onOpenAuth,
  onOpenUpload,
  onPreview,
  onDownload,
  onDeleteNote,
  onToggleBookmark
}) => {
  const [activeTab, setActiveTab] = useState<'my-uploads' | 'saved-bookmarks'>('my-uploads');

  // Filter notes uploaded by current user or matching user's email/name
  const userUploads = currentUser
    ? allNotes.filter(
        n =>
          (n.uploaderEmail && n.uploaderEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (n.studentName && n.studentName.toLowerCase() === currentUser.name.toLowerCase())
      )
    : [];

  // Bookmarked notes
  const savedNotes = allNotes.filter(n => bookmarkedIds.includes(n.id));

  // Cumulative metrics
  const totalUploadsCount = userUploads.length;
  const totalDownloadsReceived = userUploads.reduce((sum, n) => sum + (n.downloadsCount || 0), 0);
  const totalViewsReceived = userUploads.reduce((sum, n) => sum + (n.viewsCount || 0), 0);
  const avgRating =
    userUploads.length > 0
      ? (
          userUploads.reduce((sum, n) => sum + (n.rating || 5), 0) / userUploads.length
        ).toFixed(1)
      : '5.0';

  if (!currentUser) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs my-8 animate-in fade-in duration-150">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 border border-blue-100">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Student Academic Dashboard
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Sign in or register to access your personalized student dashboard, monitor the downloads
          on your uploaded notes, manage bookmarks, and access university files.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UserIcon className="w-4 h-4" />
            Sign In / Register
          </button>
        </div>

        {/* Feature bullets */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-3 bg-slate-50 rounded-xl text-xs">
            <span className="font-bold text-slate-800 block mb-1">Track Downloads</span>
            <span className="text-slate-500">See how many fellow classmates downloaded your notes.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-xs">
            <span className="font-bold text-slate-800 block mb-1">Saved Library</span>
            <span className="text-slate-500">Bookmark question papers and notes for offline exam revision.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-xs">
            <span className="font-bold text-slate-800 block mb-1">Permanent Storage</span>
            <span className="text-slate-500">Files stay saved on server permanently with secure direct links.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Student Profile Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  Student Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>{currentUser.email}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-semibold text-slate-700">{currentUser.department}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Semester {currentUser.semester}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentUser.collegeName || 'State Technical University'} {currentUser.rollNumber ? `· Roll: ${currentUser.rollNumber}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New Notes
            </button>
          </div>
        </div>

        {/* Dashboard Analytics Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">My Uploaded Notes</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalUploadsCount}</span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Downloads Received</span>
            <span className="text-xl font-bold text-blue-600 mt-0.5 block">{totalDownloadsReceived}</span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Views on Notes</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalViewsReceived}</span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Saved Bookmarks</span>
            <span className="text-xl font-bold text-amber-600 mt-0.5 block">{savedNotes.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs: My Uploads vs Saved Bookmarks */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my-uploads')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'my-uploads'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Uploaded Notes ({userUploads.length})
        </button>
        <button
          onClick={() => setActiveTab('saved-bookmarks')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'saved-bookmarks'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Saved Revision Library ({savedNotes.length})
        </button>
      </div>

      {/* Content depending on active tab */}
      {activeTab === 'my-uploads' ? (
        userUploads.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">You haven&apos;t uploaded any notes yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Share your lecture summaries, handwritten notes, or previous year exam papers to help your peers!
            </p>
            <button
              onClick={onOpenUpload}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Upload PDF Now
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Subject & Sem</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Downloads</th>
                    <th className="py-3 px-4 text-center">Views</th>
                    <th className="py-3 px-4 text-center">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {userUploads.map(note => (
                    <tr key={note.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1" onClick={() => onPreview(note)}>
                          {note.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {note.originalFileName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{note.subject}</div>
                        <div className="text-[11px] text-slate-500">Sem {note.semester}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                          {note.category === 'pyq' ? 'Question Paper' : note.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-600">
                        {note.downloadsCount}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">
                        {note.viewsCount}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-600">
                        {note.rating.toFixed(1)} ★
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreview(note)}
                            title="Preview PDF"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDownload(note)}
                            title="Download PDF"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
                                onDeleteNote(note.id);
                              }
                            }}
                            title="Delete note"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
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
        )
      ) : (
        savedNotes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No bookmarks saved yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              When browsing notes or question papers, click the bookmark icon to save them to your library for instant access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedNotes.map(note => (
              <div
                key={note.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-blue-700">Sem {note.semester}</span>
                    <button
                      onClick={() => onToggleBookmark(note.id)}
                      className="text-amber-500 hover:text-red-500 p-1"
                      title="Remove bookmark"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <h4
                    onClick={() => onPreview(note)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                  >
                    {note.title}
                  </h4>
                  <div className="text-xs text-slate-600 mt-1">
                    {note.subject} · {note.studentName}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    {note.downloadsCount} downloads
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onPreview(note)}
                      className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDownload(note)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
