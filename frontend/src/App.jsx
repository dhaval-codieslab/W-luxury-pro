import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Filters from './components/Filters.jsx';
import CarCard from './components/CarCard.jsx';
import BookingWizard from './components/BookingWizard.jsx';
import CarCardDetails from './components/CarCardDetails.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import { initialCars } from './data/cars.js';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Cars database state directly loaded from asset data file
  const [cars] = useState(initialCars);

  // Smooth scroll initialization
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  // Selected Booking Search parameters (default placeholders)
  const [searchParams, setSearchParams] = useState({
    pickupLocation: 'Munich Airport',
    pickupDate: '2026-06-27',
    pickupTime: '12:00 PM',
    returnDate: '2026-06-29',
    returnTime: '12:00 PM',
    driverAge: '30+'
  });

  // Selected vehicle for booking wizard modal
  const [selectedCar, setSelectedCar] = useState(null);

  // Inline details panel configuration state
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardBookingOption, setWizardBookingOption] = useState('bestPrice');
  const [wizardMileage, setWizardMileage] = useState('included');

  // Track responsive grid columns
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setCols(2);
      } else {
        setCols(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pill filter toggles
  const [activeFilters, setActiveFilters] = useState({
    hotOffers: false,
    premium: false,
    guaranteed: false,
    automatic: false,
    electric: false
  });

  const [isSearchResultsView, setIsSearchResultsView] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [heroInitialPanel, setHeroInitialPanel] = useState(null);
  const [isEditingSearch, setIsEditingSearch] = useState(false);

  const handleSearchSubmit = (params) => {
    setSearchParams(params);
    setIsSearchResultsView(true);
    setIsEditingSearch(false);
    setSelectedCarId(null); // Close details on search submit
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOurFleetClick = () => {
    setSelectedCarId(null);
    setIsSearchResultsView(true);
    setTimeout(() => {
      const el = document.getElementById('listings-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAboutUsClick = () => {
    setSelectedCarId(null);
    setIsSearchResultsView(false);
    setTimeout(() => {
      const el = document.getElementById('why-w-luxury');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleContactUsClick = () => {
    setSelectedCarId(null);
    setIsSearchResultsView(false);
    setTimeout(() => {
      const el = document.getElementById('instagram-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Filter handlers
  const toggleFilter = (key) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
    setSelectedCarId(null); // Close details on filter change
  };

  const clearFilters = () => {
    setActiveFilters({
      hotOffers: false,
      premium: false,
      guaranteed: false,
      automatic: false,
      electric: false
    });
    setSelectedCarId(null); // Close details on clear
  };

  // Process filters
  const getFilteredCars = () => {
    let list = cars.filter(car => car.status === 'Enabled');

    if (activeFilters.hotOffers) {
      list = list.filter(car => car.isHotOffer);
    }
    if (activeFilters.premium) {
      list = list.filter(car => !car.isGuaranteedModel);
    }
    if (activeFilters.guaranteed) {
      list = list.filter(car => car.isGuaranteedModel);
    }
    if (activeFilters.automatic) {
      list = list.filter(car => car.transmission === 'Automatic');
    }
    if (activeFilters.electric) {
      list = list.filter(car =>
        car.category.toLowerCase().includes('electric') ||
        car.name.toLowerCase().includes('taycan') ||
        car.name.toLowerCase().includes('plaid') ||
        car.name.toLowerCase().includes('e-tron')
      );
    }

    if (activeFilters.wagon) {
      list = list.filter(car => car.category.toLowerCase().includes('wagon') || car.category.toLowerCase().includes('touring'));
    }
    if (activeFilters.sedan) {
      list = list.filter(car => car.category.toLowerCase().includes('sedan') || car.category.toLowerCase().includes('liftback') || car.category.toLowerCase().includes('executive') || car.category.toLowerCase().includes('vip'));
    }
    if (activeFilters.suv) {
      list = list.filter(car => car.category.toLowerCase().includes('suv'));
    }
    if (activeFilters.convertible) {
      list = list.filter(car => car.category.toLowerCase().includes('convertible') || car.category.toLowerCase().includes('roadster'));
    }
    if (activeFilters.family) {
      list = list.filter(car => car.category.toLowerCase().includes('van') || car.category.toLowerCase().includes('minivan') || car.category.toLowerCase().includes('3-row') || car.seats >= 7);
    }
    if (activeFilters.coupe) {
      list = list.filter(car => car.category.toLowerCase().includes('coupe') || car.category.toLowerCase().includes('supercar') || car.category.toLowerCase().includes('gt') || car.category.toLowerCase().includes('sports'));
    }

    return list;
  };

  const filteredCars = getFilteredCars();

  if (isSearchResultsView) {

    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900">
        {/* Compact dark Header */}
        <Header
          isResultsPage={true}
          searchParams={searchParams}
          onEditSearch={() => {
            setIsEditingSearch(!isEditingSearch);
            if (!isEditingSearch) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onResetView={() => {
            clearFilters();
            setIsSearchResultsView(false);
          }}
          onOpenFilters={() => setShowFilterDrawer(true)}
          onOurFleetClick={handleOurFleetClick}
          onAboutUsClick={handleAboutUsClick}
          onContactUsClick={handleContactUsClick}
        />

        {/* Search Dropdown Panel */}
        {isEditingSearch && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsEditingSearch(false)}
            />
            <div className="w-full absolute top-[102px] md:top-[64px] left-0 z-50 md:bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] md:border-b md:border-neutral-200">
              <Hero
                onSearch={handleSearchSubmit}
                isDropdownMode={true}
                initialSearchParams={searchParams}
              />
            </div>
          </>
        )}

        {/* Results Page content */}
        <main id="listings-container" className="flex-grow pb-16 pt-10 w-full md:w-[90%] mx-auto px-4 md:px-0">
          {/* Header Row: Title on Left, Filters on Right */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-10">
            <h2 className="hidden md:block font-condensed font-black text-3xl md:text-[34px] text-neutral-900 tracking-wide uppercase text-left">
              WHICH CAR DO YOU WANT TO DRIVE?
            </h2>

            {/* Recommended and Filters */}
            <div className="flex items-center gap-2 select-none">
              {/* Recommended filter */}
              <button className="flex items-center gap-2 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-full px-4 py-2 text-xs font-bold text-neutral-800 transition-colors whitespace-nowrap">
                Recommended
                <svg className="w-3.5 h-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
              </button>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="flex items-center gap-2 bg-black hover:bg-neutral-900 rounded-full px-4 py-2 text-xs font-bold text-white transition-colors border border-black whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                Filters
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
          </div>

          {/* Cars Grid */}
          <div className="w-full">
            {filteredCars.length === 0 ? (
              <div className="text-center py-20 border border-neutral-200 rounded-2xl bg-neutral-50 max-w-[600px] mx-auto px-6">
                <p className="text-neutral-500 font-bold mb-4">No luxury cars fit your currently selected filters.</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#C5A059] text-white px-5 py-2.5 rounded-xl text-xs font-black font-condensed uppercase tracking-wider hover:bg-[#B28F4B] premium-transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {filteredCars.map((car, idx) => {
                  const selectedIndex = filteredCars.findIndex(c => c._id === selectedCarId);
                  const insertAfterIndex = Math.min(
                    Math.floor(selectedIndex / cols) * cols + cols - 1,
                    filteredCars.length - 1
                  );

                  return (
                    <React.Fragment key={car._id}>
                      <div id={`car-card-container-${idx}`} className="w-full">
                        <CarCard
                          car={car}
                          viewMode="results"
                          index={idx}
                          isSelected={selectedCarId === car._id}
                          searchParams={searchParams}
                          onClick={(selected) => {
                            if (selectedCarId === selected._id) {
                              setSelectedCarId(null);
                            } else {
                              setSelectedCarId(selected._id);
                              // Smooth scroll to options section after delay
                              setTimeout(() => {
                                const optionsEl = document.getElementById('car-options-section');
                                if (optionsEl) {
                                  // Add offset so header doesn't cover it
                                  const y = optionsEl.getBoundingClientRect().top + window.scrollY - 80;
                                  window.scrollTo({ top: y, behavior: 'smooth' });
                                }
                              }, 150);
                            }
                          }}
                        />
                      </div>
                      {selectedCarId && idx === insertAfterIndex && !selectedCar && (
                        <div id="car-options-section" className="col-span-1 md:col-span-2 flex justify-center mt-6 mb-4">
                          <div className="w-full md:w-[90%] mx-auto">
                            <CarCardDetails
                              car={filteredCars.find(c => c._id === selectedCarId)}
                              searchParams={searchParams}
                              onClose={() => setSelectedCarId(null)}
                              onBookingSuccess={() => {
                                setSelectedCarId(null);
                                setIsSearchResultsView(false);
                                clearFilters();
                              }}
                              onNext={(sCar, opt, mil) => {
                                setWizardBookingOption(opt);
                                setWizardMileage(mil);
                                setWizardStep(2);
                                setSelectedCar(sCar);
                                setSelectedCarId(null);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* Booking wizard modal overlay */}
          {selectedCar && (
            <CheckoutPage
              car={selectedCar}
              searchParams={searchParams}
              bookingOption={wizardBookingOption}
              mileage={wizardMileage}
              onClose={() => {
                setSelectedCar(null);
                setWizardStep(1);
              }}
            />
          )}
        </main>

        {/* Visual Footer */}
        <footer className="w-full bg-[#1a1a1a] py-14 px-4 md:px-0 relative z-10 text-left mt-auto">
          <div className="w-full md:w-[90%] mx-auto">
            {/* Logo */}
            <div className="mb-10">
              <span className="font-sans font-light text-white tracking-[0.35em] text-sm uppercase select-none">
                W &nbsp; L U X U R Y
              </span>
            </div>

            {/* 4 columns justified across 90% screen width */}
            <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-between items-start gap-8 pb-10 w-full">
              {/* Column 1 - Services & Links */}
              <div className="flex flex-col gap-3.5 text-left">
                {[
                  { label: 'FAQ', highlight: false },
                  { label: 'BONUS PROGRAM', highlight: true },
                  { label: 'CONTACT US', highlight: false },
                  { label: 'RENTAL CAR DELIVERY IN MIAMI', highlight: false },
                  { label: 'ONE-WAY CAR RENTAL', highlight: false },
                  { label: 'LONG-TERM CAR RENTAL', highlight: false },
                ].map(({ label, highlight }) => (
                  <a
                    key={label}
                    href={label === 'CONTACT US' ? '#instagram-section' : '#'}
                    onClick={(e) => {
                      if (label === 'CONTACT US') {
                        e.preventDefault();
                        document.getElementById('instagram-section')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`text-[11px] font-semibold tracking-wider uppercase transition-colors ${highlight ? 'text-[#C5A059] hover:text-[#d4b472]' : 'text-neutral-300 hover:text-white'}`}
                  >
                    {label}
                  </a>
                ))}
              </div>

              {/* Column 2 - Legal & Info */}
              <div className="flex flex-col gap-3.5 text-left">
                {[
                  'TERMS & CONDITIONS',
                  'PRIVACY POLICY',
                  'REVIEWS',
                  'VACANCIES',
                ].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="text-[11px] font-semibold tracking-wider uppercase text-neutral-300 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>

              {/* Column 3 – Contact & Socials */}
              <div className="flex flex-col gap-4 text-left">
                <a href="mailto:HELLO@WLUXURY.NYC" className="text-[11px] font-semibold tracking-wider uppercase text-neutral-300 hover:text-white transition-colors">
                  HELLO@WLUXURY.NYC
                </a>
                <a href="tel:+17182133279" className="text-[13px] font-semibold text-neutral-300 hover:text-white transition-colors">
                  (718) 213-3279
                </a>

                {/* Social icons */}
                <div className="flex gap-3.5 mt-1 justify-start">
                  {/* Facebook */}
                  <a href="#" aria-label="Facebook" className="text-neutral-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" aria-label="Instagram" className="text-neutral-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" aria-label="LinkedIn" className="text-neutral-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  {/* Pinterest */}
                  <a href="#" aria-label="Pinterest" className="text-neutral-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                    </svg>
                  </a>
                  {/* X / Twitter */}
                  <a href="#" aria-label="X" className="text-neutral-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>

                {/* Location subtitle */}
                <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase mt-0.5 block text-left">
                  Car rental agency in New York
                </span>
              </div>

              {/* Column 4 – Clean Logo Image aligned to right edge */}
              <div className="flex flex-col text-left sm:text-right sm:items-end justify-start">
                <img
                  src="/assets/logos/w_luxury_logo_clean.png"
                  alt="W Luxury Logo"
                  className="w-[140px] md:w-[165px] lg:w-[175px] h-auto object-contain max-h-[160px] drop-shadow-lg transition-transform duration-300 hover:scale-105"
                />
                <p className="text-[10px] font-medium tracking-wider text-neutral-400 uppercase mt-2 text-left sm:text-right">
                  58 Throop Ave, Brooklyn, NY 11206
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-neutral-800 pt-6">
              <p className="text-[9px] font-medium tracking-widest uppercase text-neutral-500">
                © 2026 W LUXURY. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </footer>

        {/* Slide-out Filter Drawer overlay and drawer itself */}
        {showFilterDrawer && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 animate-fadeIn"
              onClick={() => setShowFilterDrawer(false)}
            />
            {/* Drawer */}
            <div
              data-lenis-prevent
              className="fixed top-0 left-0 h-full w-[550px] max-w-full bg-white text-neutral-900 shadow-2xl z-[101] flex flex-col justify-between transform transition-transform duration-300 ease-out animate-slideInLeft overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0 h-[64px]">
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="text-neutral-900 hover:text-black font-semibold text-lg p-1.5 transition-colors"
                >
                  <svg className="w-5 h-5 text-neutral-900 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <h3 className="font-condensed font-black text-lg tracking-wide uppercase text-neutral-900 select-none">
                  Filters
                </h3>

                <button
                  onClick={clearFilters}
                  className="text-sm font-bold text-neutral-900 underline hover:text-[#cc3f0c] transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8 select-none text-left">
                {/* 1. Vehicle Type */}
                <div>
                  <h4 className="font-black text-[13px] text-neutral-900 uppercase tracking-wide mb-3.5">
                    Vehicle type
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'wagon', label: 'Station wagon' },
                      { id: 'sedan', label: 'Sedan' },
                      { id: 'suv', label: 'SUV' },
                      { id: 'convertible', label: 'Convertible' },
                      { id: 'family', label: 'Family car' },
                      { id: 'coupe', label: 'Coupe' }
                    ].map((type) => {
                      const isSelected = activeFilters[type.id];
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => toggleFilter(type.id)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${isSelected
                            ? 'bg-black border-black text-white'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                            }`}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Premium selections */}
                <div>
                  <h4 className="font-black text-[13px] text-neutral-900 uppercase tracking-wide mb-3.5">
                    Premium selections
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'premium', label: 'Premium' },
                      { id: 'guaranteed', label: 'Guaranteed model' }
                    ].map((item) => {
                      const isSelected = activeFilters[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleFilter(item.id)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${isSelected
                            ? 'bg-black border-black text-white'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                            }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Features */}
                <div>
                  <h4 className="font-black text-[13px] text-neutral-900 uppercase tracking-wide mb-3.5">
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'performance', label: 'High performance' },
                      { id: 'electric', label: 'Electric' },
                      { id: 'automatic', label: 'Automatic' },
                      { id: 'gps', label: 'GPS' },
                      { id: 'hotOffers', label: 'Hot offers' }
                    ].map((feature) => {
                      const isSelected = activeFilters[feature.id];
                      return (
                        <button
                          key={feature.id}
                          type="button"
                          onClick={() => toggleFilter(feature.id)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${isSelected
                            ? 'bg-black border-black text-white'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                            }`}
                        >
                          {feature.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Minimum number of seats */}
                <div>
                  <h4 className="font-black text-[13px] text-neutral-900 uppercase tracking-wide mb-3.5">
                    Minimum number of seats
                  </h4>
                  <div className="flex gap-2">
                    {[4, 5, 7, 8, 9].map((num) => {
                      const isSelected = activeFilters.minSeats === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setActiveFilters(prev => ({
                            ...prev,
                            minSeats: isSelected ? null : num
                          }))}
                          className={`w-11 h-11 flex items-center justify-center rounded-xl border text-xs font-black transition-all ${isSelected
                            ? 'bg-black border-black text-white'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                            }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Bags */}
                <div>
                  <h4 className="font-black text-[13px] text-neutral-900 uppercase tracking-wide mb-3.5">
                    Bags
                  </h4>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6, 8].map((num) => {
                      const isSelected = activeFilters.minBags === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setActiveFilters(prev => ({
                            ...prev,
                            minBags: isSelected ? null : num
                          }))}
                          className={`w-11 h-11 flex items-center justify-center rounded-xl border text-xs font-black transition-all ${isSelected
                            ? 'bg-black border-black text-white'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                            }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Primary driver age */}
                <div>
                  <h4 className="font-black text-[13px] text-neutral-900 uppercase tracking-wide mb-3.5">
                    Primary driver age
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, '30+'].map((age) => {
                      const isSelected = activeFilters.driverAge === age;
                      return (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setActiveFilters(prev => ({
                            ...prev,
                            driverAge: age
                          }))}
                          className={`px-3.5 h-11 flex items-center justify-center rounded-xl border text-xs font-black transition-all ${isSelected
                            ? 'bg-black border-black text-white shadow-md'
                            : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                            }`}
                        >
                          {age}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="border-t border-neutral-100 p-6 flex-shrink-0 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <button
                  type="button"
                  onClick={() => setShowFilterDrawer(false)}
                  className="w-full bg-[#C5A059] hover:bg-[#B28F4B] text-white font-condensed font-black text-sm uppercase py-4 rounded-xl shadow-lg tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Show {filteredCars.length} {filteredCars.length === 1 ? 'offer' : 'offers'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] flex flex-col font-sans text-[#F3F3F3]">
      {/* Visual Header */}
      <Header 
        onResetView={() => {
          clearFilters();
          setSelectedCarId(null);
        }} 
        onOurFleetClick={handleOurFleetClick}
        onAboutUsClick={handleAboutUsClick}
        onContactUsClick={handleContactUsClick}
      />

      {/* Main Core Booking Experience */}
      <main className="flex-grow">
        <Hero
          onSearch={handleSearchSubmit}
          initialMobilePanel={heroInitialPanel}
          onPanelClosed={() => setHeroInitialPanel(null)}
        />

        {selectedCar && (
          <BookingWizard
            car={selectedCar}
            searchParams={searchParams}
            initialStep={wizardStep}
            initialBookingOption={wizardBookingOption}
            initialMileage={wizardMileage}
            onClose={() => {
              setSelectedCar(null);
              setWizardStep(1);
            }}
            onSubmitSuccess={() => {
              setSelectedCar(null);
              setWizardStep(1);
            }}
          />
        )}
      </main>
    </div>
  );
}
