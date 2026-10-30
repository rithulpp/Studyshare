import React from 'react';
import { Filter, RotateCcw, GraduationCap, Building2, Calendar, BookCheck } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, CATEGORIES } from '../types';

interface FilterBarProps {
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedSemester: string;
  setSelectedSemester: (sem: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedDepartment,
  setSelectedDepartment,
  selectedSemester,
  setSelectedSemester,
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
  onResetFilters,
  totalResults
}) => {
  const isFiltered =
    selectedDepartment !== 'all' ||
    selectedSemester !== 'all' ||
    selectedCategory !== 'all' ||
    selectedSort !== 'newest';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-8">
      {/* Category Tabs (Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-slate-100 scrollbar-none">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter Selects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Department Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Department / Stream
          </label>
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Departments (Any)</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Semesters (1st to 8th)</option>
            {SEMESTERS.map(sem => (
              <option key={sem} value={String(sem)}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <BookCheck className="w-3.5 h-3.5 text-blue-600" />
            Sort By
          </label>
          <select
            value={selectedSort}
            onChange={e => setSelectedSort(e.target.value)}
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="newest">Recently Uploaded</option>
            <option value="downloads">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
            <option value="views">Most Viewed</option>
            <option value="title">Alphabetical (A - Z)</option>
          </select>
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-end justify-between sm:justify-end gap-2">
          <div className="text-xs text-slate-500 py-2 sm:hidden">
            Showing <strong className="text-slate-800 font-semibold">{totalResults}</strong> items
          </div>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Summary Footer */}
      <div className="hidden sm:flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
        <div>
          Showing <span className="font-semibold text-slate-800">{totalResults}</span> study resource{totalResults === 1 ? '' : 's'}
          {selectedDepartment !== 'all' && (
            <span> in <span className="text-blue-700 font-medium">{selectedDepartment}</span></span>
          )}
          {selectedSemester !== 'all' && (
            <span> for <span className="text-blue-700 font-medium">Semester {selectedSemester}</span></span>
          )}
        </div>
        <div className="text-[11px] text-slate-400">
          Permanent verified storage on server
        </div>
      </div>
    </div>
  );
};
