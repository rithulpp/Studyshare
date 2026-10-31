import React from 'react';
import {
  GraduationCap,
  HardDrive,
  FileCode,
  ShieldCheck,
  Heart,
  BookOpen,
  MessageSquare,
  Linkedin
} from 'lucide-react';
import { ViewTab } from '../types';

interface FooterProps {
  onNavigate: (tab: ViewTab) => void;
  onFilterSemester: (sem: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onFilterSemester }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Study<span className="text-blue-400">Share</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier student-to-student notes sharing network. Empowering college students to
              easily upload, discover, preview, and download semester study materials and university
              question papers (PYQ) with permanent server-side file persistence.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Permanent Server-Side PDF Storage</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse All Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pyq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Previous Year Papers (PYQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('php-source')}
                  className="hover:text-blue-400 font-semibold transition-colors cursor-pointer"
                >
                  PHP & MySQL Project Source
                </button>
              </li>
            </ul>
          </div>

          {/* Semesters Quick Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Semester Hubs
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    onFilterSemester(String(s));
                    onNavigate('notes');
                  }}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  Semester {s}
                </button>
              ))}
            </div>
          </div>

          {/* Project Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Technology Stack
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <span className="font-semibold text-slate-200">Frontend:</span> HTML5, Tailwind CSS, React, TypeScript
              </div>
              <div>
                <span className="font-semibold text-slate-200">Live Server:</span> Node.js, Express, Multer Storage
              </div>
              <div>
                <span className="font-semibold text-slate-200">Project Backend:</span> PHP 8.x, PDO, MySQL Schema
              </div>
              <div>
                <span className="font-semibold text-slate-200">Storage:</span> Server-Side Permanent PDF Directory
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} StudyShare Portal. Designed for college students & peer academic exchange.
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fais-pre-ypgn356fpwxr56edo4n2rg-990742092575.asia-southeast1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/15 text-[#70b5f9] hover:bg-[#0A66C2]/30 transition-colors border border-[#0A66C2]/30 font-medium"
              title="Share StudyShare on LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Share on LinkedIn
            </a>
            <span className="text-slate-600">·</span>
            <a
              href="https://github.com/rithulpp/Studyshare"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
