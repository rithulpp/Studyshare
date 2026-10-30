import React from 'react';
import { NoteCard } from './NoteCard';
import { Note } from '../types';
import { FileQuestion, UploadCloud, RotateCcw } from 'lucide-react';

interface NotesGridProps {
  notes: Note[];
  isLoading: boolean;
  onPreview: (note: Note) => void;
  onDownload: (note: Note) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (noteId: string) => void;
  onRate: (noteId: string, rating: number) => void;
  onResetFilters: () => void;
  onOpenUpload: () => void;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  isLoading,
  onPreview,
  onDownload,
  bookmarkedIds,
  onToggleBookmark,
  onRate,
  onResetFilters,
  onOpenUpload
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs animate-pulse space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-200 rounded-lg"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-5 bg-slate-200 rounded w-4/5"></div>
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <div className="h-8 bg-slate-200 rounded flex-1"></div>
              <div className="h-8 bg-slate-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center max-w-xl mx-auto shadow-xs my-8">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <FileQuestion className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Study Materials Found</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          We couldn&apos;t find notes matching your current search query or filter selection.
          Try clearing filters or be the first to upload notes for this subject!
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Clear All Filters
          </button>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            Upload PDF Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onPreview={onPreview}
          onDownload={onDownload}
          isBookmarked={bookmarkedIds.includes(note.id)}
          onToggleBookmark={onToggleBookmark}
          onRate={onRate}
        />
      ))}
    </div>
  );
};
