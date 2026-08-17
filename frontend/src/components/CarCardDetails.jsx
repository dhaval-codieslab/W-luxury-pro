import React, { useState } from 'react';
import { X, User, Briefcase, Shield, Sparkles, Volume2, Gauge, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import PriceDetailsModal from './PriceDetailsModal';

export default function CarCardDetails({ car, onClose, onNext, searchParams }) {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [bookingOption, setBookingOption] = useState('bestPrice');
  const [mileage, setMileage] = useState('included');
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false);

  // Available photos list (combines photos array or falls back to main image)
  const photosList = car.photos && car.photos.length > 0 ? car.photos : [car.image];
  const activeImage = photosList[selectedPhotoIdx] || car.image;

  // Calculate rental days
  const getDays = () => {
    if (searchParams?.pickupDate && searchParams?.returnDate) {
      const start = new Date(searchParams.pickupDate);
      const end = new Date(searchParams.returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      return diffDays;
    }
    return 10;
  };
  const days = getDays();

  const stayFlexibleRate = 4.79;
  const unlimitedMileageRate = 4.55;

  let dailyRate = car.baseRate || 220;
  if (bookingOption === 'stayFlexible') dailyRate += stayFlexibleRate;
  if (mileage === 'unlimited') dailyRate += unlimitedMileageRate;

  const totalRate = (dailyRate * days).toFixed(2);

  const handleNext = () => {
    onNext(car, bookingOption, mileage);
  };

  const specs = car.specs || {
    capacity: `${car.seats || 7} Passengers | ${car.suitcases || 4} Large Suitcases + 2 Carry-ons`,
    cabin: "Premium Leather Seating | Panoramic Sunroof | Multi-Zone Climate Control",
    audioTech: "High-Definition Premium Audio | Touchscreen Navigation & Apple CarPlay",
    performance: "High-Output V8/Turbocharged Engine | Adaptive Smooth Ride Suspension",
    inclusions: "100 Miles Included/Day | White-Glove Delivery Available"
  };

  return (
    <div data-lenis-prevent className="relative bg-[#141414] w-full rounded-[28px] shadow-2xl border border-neutral-800 overflow-hidden text-white">
      
      {/* Top Header Row with Close Button */}
      <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md">
        <div className="text-left">
          <div className="flex items-center gap-3">
            <h3 className="font-sans font-bold text-xl md:text-2xl text-white uppercase tracking-tight">
              {car.name}
            </h3>
            <span className="text-xs font-bold text-[#C5A059] bg-[#C5A059]/15 border border-[#C5A059]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {car.tagline || "or similar"}
            </span>
          </div>
          <p className="text-[12px] text-neutral-400 mt-0.5">
            {car.category} • Guaranteed Luxury Class
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 p-2.5 rounded-full border border-neutral-700/80 transition-all active:scale-95 shadow-md"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left Column: Photo Showcase & Gallery (7 cols) */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800/80 bg-[#121212]">
          
          {/* Main Large Image Container */}
          <div className="relative w-full h-[260px] md:h-[340px] rounded-2xl overflow-hidden bg-neutral-900/60 border border-neutral-800 flex items-center justify-center group">
            <img
              src={activeImage}
              alt={car.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Prev / Next Photo Chevrons */}
            {photosList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIdx((prev) => (prev - 1 + photosList.length) % photosList.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all active:scale-90"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIdx((prev) => (prev + 1) % photosList.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all active:scale-90"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Photo Counter Badge */}
            {photosList.length > 1 && (
              <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                {selectedPhotoIdx + 1} / {photosList.length} Photos
              </span>
            )}
          </div>

          {/* Quick Features Row */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-neutral-800/80">
            <div className="bg-neutral-900/80 rounded-xl p-3 border border-neutral-800 text-left flex items-center gap-3">
              <User className="w-5 h-5 text-[#C5A059]" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Seats</p>
                <p className="text-sm font-bold text-white">{car.seats} Passengers</p>
              </div>
            </div>
            <div className="bg-neutral-900/80 rounded-xl p-3 border border-neutral-800 text-left flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-[#C5A059]" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Luggage</p>
                <p className="text-sm font-bold text-white">{car.suitcases || 4} Bags</p>
              </div>
            </div>
            <div className="bg-neutral-900/80 rounded-xl p-3 border border-neutral-800 text-left flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#C5A059]" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Transmission</p>
                <p className="text-sm font-bold text-white">{car.transmission || "Automatic"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Car Specs & Booking Action (5 cols) */}
        <div data-lenis-prevent className="lg:col-span-5 p-6 md:p-7 flex flex-col justify-between bg-[#171717] text-left max-h-[520px] md:max-h-[540px] overflow-hidden">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2 shrink-0">
            <h4 className="font-condensed font-bold text-xs uppercase tracking-widest text-[#C5A059]">
              VEHICLE SPECIFICATIONS
            </h4>
            <span className="text-[11px] text-neutral-400 font-semibold">
              Official Catalog Specs
            </span>
          </div>

          {/* Scrollable Specs List with Gold Custom Scrollbar */}
          <div 
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="space-y-3.5 overflow-y-auto specs-scrollbar pr-2.5 my-2 max-h-[280px] md:max-h-[300px] overscroll-contain"
          >
            {/* Spec 1: Capacity */}
            {specs.capacity && (
              <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700/80 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Capacity</span>
                </div>
                <p className="text-[13px] text-white/90 font-medium leading-relaxed">
                  {specs.capacity}
                </p>
              </div>
            )}

            {/* Spec 2: Cabin Experience */}
            {specs.cabin && (
              <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700/80 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Cabin Experience</span>
                </div>
                <p className="text-[13px] text-white/90 font-medium leading-relaxed">
                  {specs.cabin}
                </p>
              </div>
            )}

            {/* Spec 3: Audio & Tech */}
            {specs.audioTech && (
              <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700/80 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Audio & Tech</span>
                </div>
                <p className="text-[13px] text-white/90 font-medium leading-relaxed">
                  {specs.audioTech}
                </p>
              </div>
            )}

            {/* Spec 4: Performance */}
            {specs.performance && (
              <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700/80 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Performance</span>
                </div>
                <p className="text-[13px] text-white/90 font-medium leading-relaxed">
                  {specs.performance}
                </p>
              </div>
            )}

            {/* Spec 5: Inclusions (if applicable) */}
            {specs.inclusions && (
              <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700/80 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Inclusions</span>
                </div>
                <p className="text-[13px] text-white/90 font-medium leading-relaxed">
                  {specs.inclusions}
                </p>
              </div>
            )}
          </div>

          {/* Pricing & CTA Card (Fixed at bottom) */}
          <div className="mt-3 pt-4 border-t border-neutral-800 shrink-0">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Estimated Rate</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-black text-white">${dailyRate}</span>
                  <span className="text-neutral-400 text-xs font-semibold">/ day</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total ({days} Days)</p>
                <p className="text-xl font-bold text-[#C5A059]">${totalRate}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-[#C5A059] hover:bg-[#B28F4B] active:scale-[0.98] text-white py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Continue to Book
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
