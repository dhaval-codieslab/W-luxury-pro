import React, { useRef } from 'react';
import { User, Briefcase, Info, Check, Tag } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getRentalDays(pickupDateStr, returnDateStr) {
  if (!pickupDateStr || !returnDateStr) return 1;
  const months = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };
  try {
    const pParts = pickupDateStr.trim().split(/\s+/);
    const rParts = returnDateStr.trim().split(/\s+/);
    if (pParts.length < 2 || rParts.length < 2) return 1;
    const pMonth = months[pParts[0].toLowerCase().substring(0, 3)] ?? 6;
    const pDay = parseInt(pParts[1], 10);
    const rMonth = months[rParts[0].toLowerCase().substring(0, 3)] ?? 6;
    const rDay = parseInt(rParts[1], 10);
    const year = 2026;
    const date1 = new Date(year, pMonth, pDay);
    const date2 = new Date(year, rMonth, rDay);
    const diffTime = date2 - date1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  } catch (e) {
    return 1;
  }
}

export default function CarCard({ car, onClick, index = 0, viewMode = 'results', isSelected = false, searchParams = null }) {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      }
    });
  }, []);

  const daysCount = searchParams ? getRentalDays(searchParams.pickupDate, searchParams.returnDate) : 1;
  const totalVal = (car.baseRate * daysCount).toFixed(2);

  // Fleet View variant
  if (viewMode === 'fleet') {
    return (
      <div
        ref={cardRef}
        onClick={() => onClick(car)}
        className="relative w-full h-[400px] rounded-2xl overflow-hidden p-7 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between border border-neutral-800/60 shadow-xl select-none bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a]"
      >
        {/* Top Details */}
        <div className="z-10 relative text-left">
          <h3 className="font-condensed font-bold text-[22px] md:text-2xl text-white tracking-wide uppercase leading-tight group-hover:text-[#C5A059] premium-transition">
            {car.name}
          </h3>
          <p className="text-xs font-semibold text-[#C5A059] mt-1">
            or similar
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-bold">
            <span className="bg-white/10 text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-white stroke-[2.5]" /> {car.seats}
            </span>
            <span className="bg-white/10 text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-white stroke-[2.5]" /> {car.suitcases}
            </span>
            <span className="bg-white/10 text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-4 h-4 bg-white text-black rounded flex items-center justify-center text-[9px] font-black leading-none">A</span>
              {car.transmission}
            </span>
          </div>
        </div>

        {/* Center Image */}
        <div className="relative z-10 w-full h-[180px] flex items-center justify-center my-auto overflow-hidden rounded-xl">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-all duration-500"
          />
        </div>

        {/* Bottom Check Availability Button */}
        <div className="z-10 text-left mt-auto">
          <button
            type="button"
            className="border-[1.5px] border-white/80 hover:border-white hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-200"
          >
            Check availability
          </button>
        </div>
      </div>
    );
  }

  // Standard Results View Card
  return (
    <div
      ref={cardRef}
      onClick={() => onClick(car)}
      className={`relative w-full h-[390px] md:h-[410px] rounded-[24px] overflow-hidden p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md select-none bg-[#f7f7f7] group ${
        isSelected ? 'border-[3px] border-[#C5A059] shadow-lg' : 'border border-neutral-200/80 hover:border-neutral-300'
      }`}
    >
      {/* 1. Name of car, top left + "or similar" underneath in beige */}
      <div className="text-left z-10">
        <h3 className="font-sans font-bold text-[18px] md:text-[20px] text-[#191919] tracking-tight leading-tight uppercase group-hover:text-[#C5A059] transition-colors line-clamp-1">
          {car.name}
        </h3>
        <p className="text-[12px] font-semibold text-[#C5A059] mt-0.5">
          or similar
        </p>
      </div>

      {/* 2. The car itself, centered in standard taller container without any clipping */}
      <div className="w-full h-[220px] md:h-[240px] my-2 relative overflow-hidden rounded-2xl bg-neutral-100 flex items-center justify-center shadow-sm">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* 3. Bottom Row: Price per day, Total and rental days next to it, and Book Now button */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60 mt-auto z-10">
        {/* Left Side: Pricing details on one line */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left">
          {/* Daily Price */}
          <div className="flex items-baseline text-[#191919]">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight">${car.baseRate}</span>
            <span className="text-neutral-500 text-[12px] font-semibold ml-0.5">/ day</span>
          </div>

          {/* Separator */}
          <span className="text-neutral-300 font-light hidden sm:inline">|</span>

          {/* Total amount and rental days in the same location */}
          <div className="text-[12px] md:text-[13px] text-neutral-600 font-semibold flex items-center gap-1.5">
            <span className="font-bold text-neutral-900">${totalVal} total</span>
            <span className="text-neutral-400">•</span>
            <span>{daysCount} {daysCount === 1 ? 'day' : 'days'} rental</span>
          </div>
        </div>

        {/* Right Side: Book Now Button */}
        <button
          type="button"
          className="bg-[#C5A059] hover:bg-[#B28F4B] active:scale-95 text-white font-bold text-[12px] md:text-[13px] px-5 py-2.5 rounded-full shadow-sm transition-all duration-200 hover:scale-[1.02] whitespace-nowrap ml-2"
        >
          Book Now
        </button>
      </div>

      {/* Caret for selected state */}
      {isSelected && (
        <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#C5A059] rotate-45 z-[-1]" />
      )}
    </div>
  );
}
