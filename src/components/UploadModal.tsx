import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Loader2,
  GraduationCap,
  Building2,
  Calendar
} from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, User, Note } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUploadSuccess: (newNote: Note) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState(currentUser ? currentUser.name : '');
  const [uploaderEmail, setUploaderEmail] = useState(currentUser ? currentUser.email : '');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [semester, setSemester] = useState<number>(currentUser ? currentUser.semester : 3);
  const [department, setDepartment] = useState(
    currentUser ? currentUser.department : DEPARTMENTS[0]
  );
  const [category, setCategory] = useState<'notes' | 'pyq' | 'syllabus' | 'lab_manual'>('notes');
  const [examYear, setExamYear] = useState('2024');
  const [university, setUniversity] = useState(
    currentUser ? currentUser.collegeName : 'State Technical University'
  );
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Invalid file type: Please upload a PDF document (.pdf).');
      return;
    }
    if (file.size > 28 * 1024 * 1024) {
      setErrorMsg('File size exceeds 28MB limit. Please upload a smaller or compressed PDF.');
      return;
    }
    setSelectedFile(file);
    // Autofill title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedFile) {
      setErrorMsg('Please select or drag a PDF file to upload.');
      return;
    }

    if (!studentName.trim() || !title.trim() || !subject.trim() || !department) {
      setErrorMsg('Please complete all mandatory fields: Student Name, Title, Subject, and Department.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('pdfFile', selectedFile);
      formData.append('studentName', studentName.trim());
      formData.append('uploaderEmail', uploaderEmail.trim());
      formData.append('title', title.trim());
      formData.append('subject', subject.trim());
      formData.append('subjectCode', subjectCode.trim());
      formData.append('semester', String(semester));
      formData.append('department', department);
      formData.append('category', category);
      if (category === 'pyq') {
        formData.append('examYear', examYear);
      }
      formData.append('university', university.trim());
      formData.append('description', description.trim());
      formData.append('tags', tagsInput.trim());

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Server upload failed');
      }

      setSuccessMsg('Note uploaded successfully! Stored permanently on server.');
      onUploadSuccess(data.note);

      // Auto close after 1.2s
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setSubject('');
    setSubjectCode('');
    setDescription('');
    setTagsInput('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Study Material</h2>
              <p className="text-xs text-slate-500">
                PDF notes are stored permanently on server for all students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* PDF File Dropzone */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Select PDF Document <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/70'
                  : selectedFile
                  ? 'border-blue-300 bg-blue-50/30'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      {selectedFile.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to change file
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-800">
                    Click to browse or drag and drop your PDF here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PDF files only, up to 28MB · Permanent server storage
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Data Structures Complete Unit 1-5"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Subject Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Department & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Department / Branch <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Semester (1-8) <span className="text-red-500">*</span>
              </label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Subject Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Material Type <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="notes">Lecture Notes / Handwritten</option>
                <option value="pyq">Previous Year Question (PYQ)</option>
                <option value="syllabus">Syllabus & Curriculum</option>
                <option value="lab_manual">Lab Manual / Practical</option>
              </select>
            </div>

            {category === 'pyq' ? (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Exam Year
                </label>
                <select
                  value={examYear}
                  onChange={e => setExamYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {['2025', '2024', '2023', '2022', '2021', '2020'].map(y => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={subjectCode}
                  onChange={e => setSubjectCode(e.target.value)}
                  placeholder="e.g. CS301"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                University / College
              </label>
              <input
                type="text"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder="State Tech University"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Student Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Student / Contributor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Student Email (Optional)
              </label>
              <input
                type="email"
                value={uploaderEmail}
                onChange={e => setUploaderEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Description / Covered Topics
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mention unit numbers, key algorithms, theorems, or question paper highlights..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Storing on Server...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Publish & Store PDF
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
