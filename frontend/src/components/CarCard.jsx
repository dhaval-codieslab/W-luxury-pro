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
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  }, []);

  const getCardTitle = () => {
    let cat = car.category;
    // Remove body types from the main title category text
    cat = cat.replace(/SUV|Convertible|Sedan|Sports|Electric|Automatic|Car/ig, '').trim();
    return `${cat.toUpperCase()} (${car.name.toUpperCase()})`;
  };

  const getCardSubtitle = () => {
    const catLower = car.category.toLowerCase();
    const bodyType = catLower.includes('suv')
      ? 'SUV'
      : catLower.includes('convertible')
        ? 'Convertible'
        : catLower.includes('sports')
          ? 'Sports'
          : catLower.includes('electric')
            ? 'Electric'
            : 'Sedan';
    return `or similar | ${bodyType}`;
  };

  // Fleet View variant (Spotlight background, check availability button, no pricing)
  if (viewMode === 'fleet') {
    return (
      <div
        ref={cardRef}
        onClick={() => onClick(car)}
        className="relative w-full h-[400px] rounded-2xl overflow-hidden p-7 cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between border border-neutral-800/60 shadow-xl select-none bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a]"
      >
        {/* Top Details */}
        <div className="z-10 relative text-left">
          <h3 className="font-condensed font-normal text-[22px] md:text-2xl text-white tracking-wide uppercase leading-tight group-hover:text-[#C5A059] premium-transition">
            {getCardTitle()}
          </h3>
          <p className="text-xs font-bold text-neutral-400 mt-1">
            {getCardSubtitle()}
          </p>

          {/* Feature Badges Row (Single horizontal row) */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-bold">
            <span className="bg-white/10 text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-white stroke-[2.5]" /> {car.seats}
            </span>
            <span className="bg-white/10 text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-white stroke-[2.5]" /> {car.suitcases}
            </span>
            <span className="bg-white/10 text-white px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-4 h-4 bg-white text-black rounded flex items-center justify-center text-[9px] font-black leading-none">
                {car.transmission === 'Automatic' ? 'A' : 'M'}
              </span>
              {car.transmission}
            </span>
          </div>
        </div>

        {/* Studio Background Gradient matching reference image */}
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-transform duration-700 group-hover:scale-105"
          style={{
            background: 'linear-gradient(to bottom, #1b1d1f 0%, #2b2f33 35%, #464f54 55%, #8c9da3 75%, #131416 85%, #0e0e10 100%)'
          }}
        >
          {/* Add a subtle radial glow in the center to make it look like a spotlight on the wall */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(120% 60% at 50% 75%, #a6b8be 0%, transparent 50%)'
            }}
          />
        </div>

        {/* Unique Hover Glow Aura */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="w-[70%] h-[30%] bg-[#C5A059] rounded-full blur-[50px] translate-x-4 translate-y-4 mix-blend-screen opacity-80" />
        </div>

        {/* Center Car Image */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex flex-col items-center justify-center">
          <img
            src={car.image}
            alt={car.name}
            className="relative z-10 w-[85%] h-auto object-contain translate-y-4 transform group-hover:translate-x-10 group-hover:scale-[1.15] transition-all duration-[800ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] drop-shadow-2xl"
            style={car.image.endsWith('.webp') ? { mixBlendMode: 'multiply' } : {}}
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

  // Search Results View variant (Exactly styled like image2 but with light gray background #f4f4f4)
  const daysCount = searchParams ? getRentalDays(searchParams.pickupDate, searchParams.returnDate) : 1;
  const dateStr = searchParams 
    ? `${searchParams.pickupDate} — ${searchParams.returnDate} | ${daysCount} ${daysCount === 1 ? 'day' : 'days'}` 
    : `9 — 9 Jul 2026 | 1 day`;

  return (
    <div ref={cardRef} className={`relative w-full mt-20 md:mt-24 ${isSelected ? 'z-40' : 'z-10'} group`}>
      {/* Overflowing Car Image */}
      <div className="absolute -top-20 md:-top-24 lg:-top-28 left-[44%] -translate-x-1/2 w-[68%] md:w-[72%] z-20 pointer-events-none select-none">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-auto object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out group-hover:translate-x-12"
        />
      </div>

      <div
        onClick={() => onClick(car)}
        className={`relative w-full rounded-[28px] overflow-hidden px-6 md:px-8 pb-6 pt-28 md:pt-32 lg:pt-36 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-md select-none bg-[#f4f4f4] ${isSelected ? 'border-[3px] border-[#C5A059]' : 'border border-neutral-200/50 hover:border-neutral-300'}`}
      >
        {/* Light Bronze Gold Shadow / Glow around car on hover (Strictly contained inside card) */}
        <div className="absolute top-0 left-0 right-0 h-[65%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden z-0">
          <div className="absolute top-3 left-[44%] -translate-x-1/2 w-[85%] h-[130px] bg-[#C5A059]/30 rounded-full blur-[40px]" />
        </div>
        {/* Details and Pricing matching image2 layout */}
        <div className="flex-grow flex flex-col text-left">
          <div>
            {/* Title with Arrow */}
            <h3 className="font-sans font-extrabold text-[22px] text-[#191919] tracking-tight leading-tight flex items-center gap-1.5 hover:text-[#C5A059] transition-colors uppercase">
              {car.name} 
              <span className="text-neutral-400 font-light group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
            </h3>
            
            {/* Date range in format "9 — 9 Jul 2026" */}
            <p className="text-[14px] text-[#191919]/70 font-semibold mt-1.5">
              {dateStr}
            </p>
          </div>

          {/* Pricing Row: Daily price and Dynamic Total */}
          {(() => {
            const totalVal = (car.baseRate * daysCount + 0.88).toFixed(2);
            return (
              <div className="flex items-center justify-between mt-3.5 pt-1">
                <div className="flex flex-col text-left">
                  {/* Daily Price */}
                  <div className="flex items-baseline text-[#191919]">
                    <span className="text-2xl font-extrabold tracking-tight">$</span>
                    <span className="text-3xl font-black tracking-tight leading-none">{car.baseRate}</span>
                    <span className="text-[#191919]/50 text-[13px] font-semibold ml-1">/ day</span>
                  </div>
                  
                  {/* Total Price */}
                  <span className="text-neutral-400 text-[12px] font-semibold mt-0.5 block">
                    ${totalVal} total
                  </span>
                </div>

                {/* Bronze Gold Book Now Button */}
                <button 
                  type="button"
                  className="bg-[#C5A059] hover:bg-[#B28F4B] text-white font-bold text-[13px] px-6 py-2.5 rounded-full shadow-sm transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center whitespace-nowrap"
                >
                  Book Now
                </button>
              </div>
            );
          })()}
        </div>
      </div>
      
      {/* Caret for selected state */}
      {isSelected && (
        <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#C5A059] rotate-45 z-[-1]" />
      )}
    </div>
  );
}
