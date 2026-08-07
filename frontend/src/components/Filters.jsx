import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function Filters({ activeFilters, toggleFilter, clearFilters, totalCount }) {
  const filterOptions = [
    { key: 'hotOffers', label: '🔥 Hot Offers' },
    { key: 'premium', label: '💎 Premium Fleet' },
    { key: 'guaranteed', label: '⭐ Guaranteed Model' },
    { key: 'automatic', label: '⚙️ Automatic' },
    { key: 'electric', label: '⚡ Electric' },
  ];

  return (
    <div className="w-full md:w-[90%] mx-auto px-4 md:px-0 py-10 flex flex-col gap-6">

      {/* Filters Pill Row */}
      <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
        {/* Recommended Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-800 bg-[#121212] font-bold text-neutral-300 hover:border-neutral-700 premium-transition">
            <span>Recommended</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>

        {/* Clear Filters Button */}
        <button 
          onClick={clearFilters}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold hover:bg-neutral-800 hover:text-white premium-transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
          <span>Reset Filters</span>
        </button>

        {/* Filter Pills */}
        {filterOptions.map(option => (
          <button
            key={option.key}
            onClick={() => toggleFilter(option.key)}
            className={`px-4 py-2.5 rounded-full border font-bold premium-transition ${
              activeFilters[option.key]
                ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-[0_4px_12px_rgba(255,80,0,0.25)]'
                : 'bg-[#121212] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}

        {/* Results Counter */}
        <span className="ml-auto text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-full">
          {totalCount} Vehicles Matching
        </span>
      </div>
    </div>
  );
}
