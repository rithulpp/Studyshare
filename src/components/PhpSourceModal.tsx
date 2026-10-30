import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Database,
  ExternalLink,
  ShieldCheck,
  Server,
  Terminal,
  BookOpen
} from 'lucide-react';
import { PhpSourceFile } from '../types';

interface PhpSourceModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInlineView?: boolean;
}

export const PhpSourceModal: React.FC<PhpSourceModalProps> = ({
  isOpen = true,
  onClose,
  isInlineView = false
}) => {
  const [files, setFiles] = useState<PhpSourceFile[]>([]);
  const [activeFileName, setActiveFileName] = useState<string>('db.sql');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/php-source')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.files) {
          setFiles(data.files);
          if (data.files.length > 0) {
            setActiveFileName(data.files[0].filename);
          }
        }
      })
      .catch(err => console.error('Failed to load PHP source:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const activeFile = files.find(f => f.filename === activeFileName) || files[0];

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5 text-blue-300" />
              <span>Full PHP & MySQL Backend Source Code</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              StudyShare College Project Source Code & DB Schema
            </h2>
            <p className="mt-1 text-xs text-blue-200/90 max-w-2xl leading-relaxed">
              Included below is the complete production PHP & MySQL implementation requested for college
              submissions, lab evaluation, and XAMPP/WAMP hosting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-blue-50 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Code!' : 'Copy Active File'}
            </button>
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        </div>
      </div>

      {/* Code Inspector Tabs & Editor */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 scrollbar-none">
          {files.map(file => {
            const isActive = file.filename === activeFileName;
            return (
              <button
                key={file.filename}
                onClick={() => setActiveFileName(file.filename)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>

        {/* File Sub-header */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">{activeFile?.label}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-blue-400">/php_backend/{activeFile?.filename}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              {activeFile?.content.split('\n').length} lines
            </span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-5 overflow-x-auto max-h-[520px] scrollbar-thin scrollbar-thumb-slate-700">
          <pre className="text-xs font-mono text-emerald-400/95 leading-relaxed selection:bg-blue-800 selection:text-white">
            <code>{activeFile?.content || 'Loading file content...'}</code>
          </pre>
        </div>
      </div>

      {/* Quick Setup Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-2">
            1
          </div>
          <h4 className="text-xs font-bold text-slate-900">Import db.sql in MySQL</h4>
          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
            Create database <code>studyshare_db</code> in phpMyAdmin and run the SQL schema file with sample starter data.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-2">
            2
          </div>
          <h4 className="text-xs font-bold text-slate-900">Uploads Directory</h4>
          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
            Ensure an <code>uploads/</code> folder exists on the server with <code>chmod 775</code> write permissions for permanent PDF storage.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-2">
            3
          </div>
          <h4 className="text-xs font-bold text-slate-900">PDO Prepared Statements</h4>
          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
            All SQL queries use parameterized PDO bindings, fileinfo MIME checking, and BCrypt password encryption.
          </p>
        </div>
      </div>
    </div>
  );

  return content;
};
