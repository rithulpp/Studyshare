import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Star,
  Bookmark,
  Share2,
  Calendar,
  Building2,
  CheckCircle2,
  FileQuestion,
  BookOpen
} from 'lucide-react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPreview: (note: Note) => void;
  onDownload: (note: Note) => void;
  isBookmarked: boolean;
  onToggleBookmark: (noteId: string) => void;
  onRate: (noteId: string, rating: number) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPreview,
  onDownload,
  isBookmarked,
  onToggleBookmark,
  onRate
}) => {
  const [copied, setCopied] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '2.4 MB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?note=${note.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isPYQ = note.category === 'pyq';

  return (
    <div className="group relative bg-white border border-slate-200/90 hover:border-blue-300 rounded-xl p-5 shadow-xs hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between">
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isPYQ ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {isPYQ ? <FileQuestion className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                {note.subjectCode ? `${note.subjectCode} · ` : ''}Sem {note.semester}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {note.department.split('&')[0].trim()}
              </div>
            </div>
          </div>

          {/* Quick Bookmark & Share */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              title={copied ? 'Link copied!' : 'Share note link'}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleBookmark(note.id)}
              title={isBookmarked ? 'Remove bookmark' : 'Save to my bookmarks'}
              className={`p-1.5 rounded-md transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Note Title */}
        <h3
          onClick={() => onPreview(note)}
          className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug mt-1"
        >
          {note.title}
        </h3>

        {/* Subject & Description */}
        <div className="mt-1 text-xs font-semibold text-slate-700">
          Subject: <span className="text-blue-700 font-medium">{note.subject}</span>
        </div>

        {note.description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {note.description}
          </p>
        )}

        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{note.studentName}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{formatFileSize(note.fileSize)}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>PDF</span>
          {note.examYear && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-amber-800">Exam {note.examYear}</span>
            </>
          )}
        </div>
      </div>

      {/* Card Footer: Metrics & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          {/* Download & View stats */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-slate-700" title={`${note.downloadsCount} total downloads`}>
              <Download className="w-3.5 h-3.5 text-blue-600" />
              {note.downloadsCount}
            </span>
            <span className="flex items-center gap-1" title={`${note.viewsCount} views`}>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {note.viewsCount}
            </span>
          </div>

          {/* Star Rating with quick rate trigger */}
          <div className="relative">
            <button
              onClick={() => setShowRatingMenu(!showRatingMenu)}
              className="flex items-center gap-1 text-amber-600 font-semibold hover:bg-amber-50 px-1.5 py-0.5 rounded transition-colors"
              title="Click to rate this document"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{note.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 font-normal">({note.ratingCount})</span>
            </button>

            {/* Quick rating popup */}
            {showRatingMenu && (
              <div className="absolute right-0 bottom-full mb-1 bg-white border border-slate-200 rounded-lg p-2 shadow-lg z-20 flex items-center gap-1">
                <span className="text-[11px] font-semibold text-slate-600 mr-1">Rate:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => {
                      onRate(note.id, star);
                      setShowRatingMenu(false);
                    }}
                    className="p-1 hover:scale-125 transition-transform text-amber-400 hover:text-amber-500"
                    title={`Give ${star} star`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onPreview(note)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => onDownload(note)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs shadow-blue-600/15 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
