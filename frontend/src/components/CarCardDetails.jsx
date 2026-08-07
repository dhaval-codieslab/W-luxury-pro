import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Info, Navigation, Car } from 'lucide-react';
import PriceDetailsModal from './PriceDetailsModal';

export default function CarCardDetails({ car, onClose, onNext, searchParams }) {
  const [bookingOption, setBookingOption] = useState('bestPrice');
  const [mileage, setMileage] = useState('included');
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('side'); // 'side', 'front', 'back'
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Swipe gesture detection state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Rates directly matching details
  const stayFlexibleRate = 4.79;
  const unlimitedMileageRate = 4.55;

  const VIEWS = ['side', 'front', 'back'];
  const activeIndex = VIEWS.indexOf(viewMode);

  // Calculate rental days
  const getDays = () => {
    if (searchParams?.pickupDate && searchParams?.returnDate) {
      const start = new Date(searchParams.pickupDate);
      const end = new Date(searchParams.returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      return diffDays;
    }
    return 15; // default for UI math based on screenshot
  };
  const days = getDays();
  
  // Calculate daily rate
  let dailyRate = car.baseRate || 92.11; 
  if (bookingOption === 'stayFlexible') dailyRate += stayFlexibleRate;
  if (mileage === 'unlimited') dailyRate += unlimitedMileageRate;
  
  const totalRate = dailyRate * days;

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setViewMode((prev) => {
          const idx = VIEWS.indexOf(prev);
          return VIEWS[(idx - 1 + VIEWS.length) % VIEWS.length];
        });
      } else if (e.key === 'ArrowRight') {
        setViewMode((prev) => {
          const idx = VIEWS.indexOf(prev);
          return VIEWS[(idx + 1) % VIEWS.length];
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Swipe detection handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setViewMode(VIEWS[(activeIndex + 1) % VIEWS.length]);
    } else if (isRightSwipe) {
      setViewMode(VIEWS[(activeIndex - 1 + VIEWS.length) % VIEWS.length]);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleNext = () => {
    onNext(car, bookingOption, mileage);
  };

  const getImageStyle = () => {
    if (viewMode === 'front') {
      return {
        transform: 'perspective(600px) rotateY(-15deg) translateX(-25px) scale(1.02)',
        transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
      };
    }
    if (viewMode === 'back') {
      return {
        transform: 'perspective(600px) rotateY(15deg) translateX(25px) scale(1.02)',
        transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
      };
    }
    return {
      transform: 'perspective(600px) rotateY(0deg) translateX(0px) scale(1.05)',
      transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
    };
  };

  return (
    <div className="relative bg-[#121212] w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between select-none h-[560px] md:h-[500px]">
      
      {/* Outer Close Button Overlay */}
      <button 
        type="button"
        onClick={onClose} 
        className={`absolute top-5 transition-all duration-500 z-[25] text-neutral-400 hover:text-white bg-neutral-900/60 backdrop-blur-md p-2 rounded-full border border-neutral-800 hover:scale-105 active:scale-95 shadow-lg ${
          isPanelOpen ? 'right-5 lg:right-[480px]' : 'right-5'
        }`}
        title="Close details"
      >
        <X className="w-5 h-5 stroke-[2]" />
      </button>

      {/* Featured Vehicle Header Watermark */}
      <div className={`absolute top-6 left-0 right-0 text-center pointer-events-none z-10 pl-24 transition-all duration-500 ${
        isPanelOpen ? 'pr-24 md:pr-24 lg:pr-[484px]' : 'pr-24 md:pr-24'
      }`}>
        <h3 className="font-condensed font-normal text-2xl md:text-4xl text-white uppercase tracking-wider leading-none drop-shadow-md">
          {car.name}
        </h3>
        <p className="text-[#C5A059] font-bold text-[11px] uppercase tracking-widest mt-2">
          {car.category}
        </p>
      </div>

      {/* Primary Large Image Showcase Area */}
      <div 
        className={`flex-grow flex items-center justify-center relative w-full h-full pl-4 md:pl-12 transition-all duration-500 ${
          isPanelOpen ? 'pr-4 md:pr-12 lg:pr-[472px]' : 'pr-4 md:pr-12'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Navigation Overlay */}
        <button
          type="button"
          onClick={() => setViewMode(VIEWS[(activeIndex - 1 + VIEWS.length) % VIEWS.length])}
          className="absolute left-4 md:left-8 z-[20] w-11 h-11 rounded-full bg-neutral-900/75 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-700 hover:scale-105 active:scale-95 transition-all shadow-lg"
          title="Previous view"
        >
          <span className="text-xl font-bold select-none">&lt;</span>
        </button>

        {/* Center Large Vehicle Image Frame */}
        <div className="w-[90%] max-w-[650px] flex items-center justify-center overflow-visible h-[240px] md:h-[300px]">
          <img 
            src={car.image} 
            alt={car.name}
            className="w-full h-auto object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.85)] transition-all duration-700 ease-out" 
            style={getImageStyle()}
          />
        </div>

        {/* Right Arrow Navigation Overlay */}
        <button
          type="button"
          onClick={() => setViewMode(VIEWS[(activeIndex + 1) % VIEWS.length])}
          className={`absolute z-[20] w-11 h-11 rounded-full bg-neutral-900/75 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-700 hover:scale-105 active:scale-95 transition-all shadow-lg ${
            isPanelOpen ? 'right-4 md:right-8 lg:right-[484px]' : 'right-4 md:right-8'
          }`}
          title="Next view"
        >
          <span className="text-xl font-bold select-none">&gt;</span>
        </button>

        {/* Dynamic view caption watermark */}
        <span className="absolute bottom-16 text-[9.5px] uppercase tracking-widest font-black text-white/30 pointer-events-none select-none">
          {viewMode === 'side' && 'Side View'}
          {viewMode === 'front' && 'Front Angle'}
          {viewMode === 'back' && 'Rear Angle'}
        </span>
      </div>

      {/* Bottom Specs Strip & Primary Trigger */}
      <div className={`w-full bg-neutral-950/85 backdrop-blur-md border-t border-neutral-900 py-4 pl-6 md:pl-10 flex flex-col md:flex-row items-center justify-between gap-4 z-[20] shrink-0 transition-all duration-500 ${
        isPanelOpen ? 'pr-6 md:pr-10 lg:pr-[490px]' : 'pr-6 md:pr-10'
      }`}>
        {/* Left Specs */}
        <div className="flex items-center justify-center md:justify-start gap-6 w-full md:flex-1 md:w-auto order-2 md:order-1">
          {/* Seats Stacked Layout */}
          <div className="flex items-center gap-2 text-left">
            <User className="w-5 h-5 text-neutral-500" />
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-black text-white">{car.seats}</span>
              <span className="text-[9.5px] font-bold text-neutral-500 uppercase tracking-wider">Seats</span>
            </div>
          </div>
          
          {/* Bags Stacked Layout */}
          <div className="flex items-center gap-2 text-left">
            <Briefcase className="w-5 h-5 text-neutral-500" />
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-black text-white">{car.suitcases || car.bags || 2}</span>
              <span className="text-[9.5px] font-bold text-neutral-500 uppercase tracking-wider">Bags</span>
            </div>
          </div>
        </div>
        
        {/* Center CTA Button */}
        <div className="flex items-center justify-center w-full md:shrink-0 md:w-auto order-1 md:order-2">
          <button
            type="button"
            onClick={() => setIsPanelOpen(true)}
            className={`w-full bg-[#C5A059] hover:bg-[#B28F4B] active:scale-95 text-white py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all shadow-md flex items-center justify-center ${
              isPanelOpen ? 'md:w-[180px] lg:w-[120px]' : 'md:w-[180px]'
            }`}
          >
            Book Now
          </button>
        </div>

        {/* Right Specs */}
        <div className="flex items-center justify-center md:justify-end gap-5 w-full md:flex-1 md:w-auto order-3 md:order-3">
          <div className="flex items-center gap-1.5 text-left shrink-0">
            <span className="w-5 h-5 bg-neutral-800 text-neutral-300 rounded flex items-center justify-center text-[10px] font-black leading-none shadow-sm">A</span>
            <span className="text-[12px] font-bold text-neutral-400 font-sans">Automatic</span>
          </div>
          <span className="text-[#C5A059] font-black text-[13px] shrink-0">
            ${(car.baseRate || 92.11).toFixed(2)}/day
          </span>
        </div>
      </div>

      {/* Expandable Details Panel Overlay Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/55 z-[30] transition-opacity duration-300 lg:hidden ${
          isPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsPanelOpen(false)}
      />

      {/* Expandable Sliding Details Panel Sheet */}
      <div 
        className={`absolute z-[40] bg-white transition-all duration-500 ease-out flex flex-col shadow-2xl ${
          // Desktop: slides from right
          'lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto lg:w-[460px] lg:h-full lg:border-l lg:border-neutral-200'
        } ${
          // Mobile/Tablet: slides up from bottom
          'top-auto bottom-0 left-0 right-0 h-[85%] lg:h-full rounded-t-3xl lg:rounded-none'
        } ${
          isPanelOpen 
            ? 'translate-x-0 translate-y-0' 
            : 'lg:translate-x-full translate-y-full lg:translate-y-0'
        }`}
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#C5A059] block">
              Booking Details
            </span>
            <h4 className="font-condensed font-normal text-2xl text-neutral-900 uppercase tracking-wide leading-none mt-1">
              {car.name}
            </h4>
          </div>
          <button 
            type="button"
            onClick={() => setIsPanelOpen(false)} 
            className="text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Panel Scrollable Body */}
        <div data-lenis-prevent className="p-4 flex-grow min-h-0 overflow-y-auto premium-scrollbar space-y-4 text-left">
          
          {/* Booking options */}
          <div>
            <h5 className="font-bold text-[12px] text-neutral-400 uppercase tracking-wider mb-1.5">
              Booking Option
            </h5>
            <div className="space-y-2">
              <div 
                onClick={() => setBookingOption('bestPrice')}
                className={`border rounded-xl py-2 px-3 flex cursor-pointer transition-all ${
                  bookingOption === 'bestPrice' 
                    ? 'border-[2px] border-neutral-900 bg-neutral-50/50 shadow-sm' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className={`flex-shrink-0 w-4 h-4 rounded-full border-[2px] flex items-center justify-center mr-3 mt-0.5 ${
                  bookingOption === 'bestPrice' ? 'border-neutral-900' : 'border-neutral-200'
                }`}>
                  {bookingOption === 'bestPrice' && <div className="w-2 h-2 bg-neutral-900 rounded-full" />}
                </div>
                <div className="flex-grow text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-[13px]">Best price</span>
                    <span className="font-bold text-neutral-900 text-[12px] flex items-center gap-1">
                      Included <Info className="w-3.5 h-3.5 text-neutral-800" />
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] mt-0.5 pr-6 leading-snug">
                    Pay now, cancel and rebook for a fee
                  </p>
                </div>
              </div>
              
              <div 
                onClick={() => setBookingOption('stayFlexible')}
                className={`border rounded-xl py-2 px-3 flex cursor-pointer transition-all ${
                  bookingOption === 'stayFlexible' 
                    ? 'border-[2px] border-neutral-900 bg-neutral-50/50 shadow-sm' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className={`flex-shrink-0 w-4 h-4 rounded-full border-[2px] flex items-center justify-center mr-3 mt-0.5 ${
                  bookingOption === 'stayFlexible' ? 'border-neutral-900' : 'border-neutral-200'
                }`}>
                  {bookingOption === 'stayFlexible' && <div className="w-2 h-2 bg-neutral-900 rounded-full" />}
                </div>
                <div className="flex-grow text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-[13px]">Stay flexible</span>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#C5A059] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                      <span className="font-bold text-neutral-900 text-[12px] flex items-center gap-1">
                        + $ {stayFlexibleRate.toFixed(2)} / day <Info className="w-3.5 h-3.5 text-neutral-800" />
                      </span>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-[11px] mt-0.5 pr-4 leading-snug">
                    Pay at pickup, free cancellation and rebooking any time
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mileage options */}
          <div>
            <h5 className="font-bold text-[12px] text-neutral-400 uppercase tracking-wider mb-1.5">
              Mileage Limit
            </h5>
            <div className="space-y-2">
              <div 
                onClick={() => setMileage('included')}
                className={`border rounded-xl py-2 px-3 flex cursor-pointer transition-all ${
                  mileage === 'included' 
                    ? 'border-[2px] border-neutral-900 bg-neutral-50/50 shadow-sm' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className={`flex-shrink-0 w-4 h-4 rounded-full border-[2px] flex items-center justify-center mr-3 mt-0.5 ${
                  mileage === 'included' ? 'border-neutral-900' : 'border-neutral-200'
                }`}>
                  {mileage === 'included' && <div className="w-2 h-2 bg-neutral-900 rounded-full" />}
                </div>
                <div className="flex-grow text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-[13px]">2,820 km</span>
                    <span className="font-bold text-neutral-900 text-[12px]">Included</span>
                  </div>
                  <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                    +$0.91 for every additional km
                  </p>
                </div>
              </div>
              
              <div 
                onClick={() => setMileage('unlimited')}
                className={`border rounded-xl py-2 px-3 flex cursor-pointer transition-all ${
                  mileage === 'unlimited' 
                    ? 'border-[2px] border-neutral-900 bg-neutral-50/50 shadow-sm' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className={`flex-shrink-0 w-4 h-4 rounded-full border-[2px] flex items-center justify-center mr-3 mt-0.5 ${
                  mileage === 'unlimited' ? 'border-neutral-900' : 'border-neutral-200'
                }`}>
                  {mileage === 'unlimited' && <div className="w-2 h-2 bg-neutral-900 rounded-full" />}
                </div>
                <div className="flex-grow text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-[13px]">Unlimited kilometers</span>
                    <span className="font-bold text-neutral-900 text-[12px]">
                      + $ {unlimitedMileageRate.toFixed(2)} / day
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] mt-0.5 leading-snug">
                    All kilometers are included in the price
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications & Features list */}
          <div>
            <h5 className="font-bold text-[12px] text-neutral-400 uppercase tracking-wider mb-2.5">
              Specifications & Features
            </h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-neutral-600 font-sans font-medium">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-400">Category</span>
                <span className="text-neutral-950 font-bold">{car.category}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-400">Transmission</span>
                <span className="text-neutral-950 font-bold">{car.transmission}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-400">Seats</span>
                <span className="text-neutral-950 font-bold">{car.seats}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-400">Bags / Suitcases</span>
                <span className="text-neutral-950 font-bold">{car.suitcases || car.bags || 2}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-400">Doors</span>
                <span className="text-neutral-950 font-bold">{car.doors || 4}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-400">GPS Navigation</span>
                <span className="text-neutral-950 font-bold">{car.gps ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Sticky Footer */}
        <div className="bg-white border-t border-neutral-100 px-6 py-4 flex items-center justify-between mt-auto relative z-10 shrink-0">
          <div className="flex flex-col text-left">
            <span className="font-bold text-[13px] text-neutral-400">Total Price</span>
            <span className="font-black text-[22px] text-neutral-900 mt-0.5">
              ${totalRate.toFixed(2)}
            </span>
            <button 
              type="button"
              onClick={() => setIsPriceDetailsModalOpen(true)}
              className="text-neutral-950 font-bold text-[12px] underline hover:text-[#C5A059] transition-colors w-fit mt-1 text-left"
            >
              Price details
            </button>
          </div>
          
          <button 
            type="button"
            onClick={handleNext}
            className="bg-[#C5A059] hover:bg-[#B28F4B] active:scale-95 text-white px-10 py-3.5 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center shadow-md uppercase tracking-wider"
          >
            Next
          </button>
        </div>
      </div>

      <PriceDetailsModal 
        isOpen={isPriceDetailsModalOpen} 
        onClose={() => setIsPriceDetailsModalOpen(false)} 
        totalPrice={totalRate} 
      />
    </div>
  );
}
