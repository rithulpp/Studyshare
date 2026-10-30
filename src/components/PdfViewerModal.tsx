import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Calendar,
  Building2,
  GraduationCap,
  Eye,
  Star,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Note } from '../types';

interface PdfViewerModalProps {
  note: Note | null;
  onClose: () => void;
  onDownload: (note: Note) => void;
  onRate: (noteId: string, rating: number) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  note,
  onClose,
  onDownload,
  onRate
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!note) return null;

  const viewUrl = `/api/view/${note.id}`;

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '2.4 MB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {note.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-blue-700">{note.subject}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Sem {note.semester}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{note.department}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{formatFileSize(note.fileSize)}</span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onDownload(note)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>

            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              New Tab
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors ml-1"
              aria-label="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Note Metadata Banner */}
        <div className="px-5 py-2.5 bg-blue-50/60 border-b border-blue-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span>Contributed by: <strong className="text-slate-900 font-semibold">{note.studentName}</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>University: <strong className="text-slate-800">{note.university}</strong></span>
            {note.examYear && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-semibold text-amber-800">Exam Year: {note.examYear}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Rate this note:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => onRate(note.id, star)}
                className="text-amber-400 hover:text-amber-500 hover:scale-110 transition-transform"
                title={`Rate ${star} star`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
            ))}
            <span className="font-bold text-amber-700 text-xs ml-1">
              {note.rating.toFixed(1)}/5
            </span>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="relative flex-1 bg-slate-100 w-full overflow-hidden">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-500 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs font-semibold text-slate-700">Loading PDF document from server...</p>
              <p className="text-[11px] text-slate-400">Rendering permanent server-side document</p>
            </div>
          )}

          <iframe
            src={viewUrl}
            title={note.title}
            onLoad={() => setIframeLoaded(true)}
            className="w-full h-full border-none"
          />
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2 bg-white border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Permanent file on server ({note.fileName})</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Original filename: {note.originalFileName}
          </div>
        </div>
      </div>
    </div>
  );
};
