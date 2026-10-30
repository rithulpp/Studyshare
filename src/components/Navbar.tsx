import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  UploadCloud,
  FileQuestion,
  LayoutDashboard,
  MessageSquare,
  FileCode,
  User as UserIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { User, ViewTab } from '../types';

interface NavbarProps {
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenUpload: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onOpenUpload,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ViewTab, label: 'Home', icon: BookOpen },
    { id: 'notes' as ViewTab, label: 'All Notes', icon: BookOpen },
    { id: 'pyq' as ViewTab, label: 'Question Papers (PYQ)', icon: FileQuestion },
    { id: 'dashboard' as ViewTab, label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'contact' as ViewTab, label: 'Contact & Feedback', icon: MessageSquare },
    { id: 'php-source' as ViewTab, label: 'PHP & MySQL Code', icon: FileCode }
  ];

  const handleNavClick = (tab: ViewTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Study<span className="text-blue-600">Share</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                  PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Permanent Academic Notes & PYQ Hub
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-lg flex items-center gap-1.5 ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-600/20 transition-all hover:shadow-md"
            >
              <UploadCloud className="w-4 h-4" />
              Upload PDF
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
                  title="View your student dashboard"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Sem {currentUser.semester} · {currentUser.department.split(' ')[0]}
                    </div>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Student Login
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="p-2 text-white bg-blue-600 rounded-lg text-sm"
              title="Upload Notes"
            >
              <UploadCloud className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 ${
                  currentTab === item.id
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4 text-blue-600" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-2.5 bg-blue-50/60 rounded-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Sem {currentUser.semester} · {currentUser.department}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1 text-xs text-red-600 font-medium hover:bg-red-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg"
              >
                Student Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
