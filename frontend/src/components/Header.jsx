import React, { useState, useRef } from 'react';
import { HelpCircle, Car, Globe, User, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LanguageCurrencyModal from './LanguageCurrencyModal';
import { useUserSettings } from '../hooks/useUserSettings';

const CustomMenuIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M3 6h12 M19 6h2 M3 12h18 M3 18h18" />
  </svg>
);

const CustomCloseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M6 6 L18 18" />
    <path d="M6 18 L13.5 10.5 M16.5 7.5 L18 6" />
  </svg>
);

export default function Header({ onResetView, isResultsPage, searchParams, onEditSearch, onOpenFilters, onOurFleetClick, onAboutUsClick, onContactUsClick }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const { langCode, setLangCode, currencySymbol, setCurrencySymbol, langName, setLangName, currencyName, setCurrencyName } = useUserSettings();
  const headerRef = useRef(null);
  const mobileHeaderRef = useRef(null);
  const sidebarOverlayRef = useRef(null);
  const sidebarPanelRef = useRef(null);
  const sidebarTl = useRef(null);

  useGSAP(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { y: -100, opacity: 0, duration: 1, ease: 'power3.out' });
    }
    if (mobileHeaderRef.current) {
      gsap.from(mobileHeaderRef.current, { y: -100, opacity: 0, duration: 1, ease: 'power3.out' });
    }
  }, []);

  useGSAP(() => {
    if (isResultsPage || !sidebarOverlayRef.current || !sidebarPanelRef.current) return;

    const tl = gsap.timeline({ paused: true });
    sidebarTl.current = tl;

    tl.to(sidebarOverlayRef.current, {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.5,
      ease: 'power2.out'
    }, 0);

    tl.to(sidebarPanelRef.current, {
      x: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, 0);

    const items = gsap.utils.toArray('.sidebar-nav-item', sidebarPanelRef.current);
    tl.fromTo(items,
      { opacity: 0, x: 25 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: {
          each: 0.08,
          from: "end" // Starts from the last item
        }
      },
      0.3 // start slightly after panel starts sliding
    );

    return () => {
      tl.kill();
      sidebarTl.current = null;
    };
  }, [isResultsPage]);

  useGSAP(() => {
    if (sidebarTl.current) {
      if (isSidebarOpen) {
        sidebarTl.current.play();
      } else {
        sidebarTl.current.reverse();
      }
    }
  }, [isSidebarOpen]);

  if (isResultsPage) {
    return (
      <>
        {isLangModalOpen && (
          <LanguageCurrencyModal
            isOpen={isLangModalOpen}
            onClose={() => setIsLangModalOpen(false)}
            onSelectLang={(code, name) => { setLangCode(code); setLangName(name); }}
            onSelectCurrency={(sym, name) => { setCurrencySymbol(sym); setCurrencyName(name); }}
            initialLangName={langName}
            initialCurrencyName={currencyName}
          />
        )}
        {/* --- DESKTOP RESULTS HEADER --- */}
        <header ref={headerRef} className="hidden md:block w-full bg-black text-white select-none z-50 sticky top-0 border-b border-neutral-800/80 shadow-md">
          <div className="w-full md:w-[90%] mx-auto px-4 md:px-0 py-3 h-[64px]">
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div
                  onClick={onResetView}
                  className="flex flex-col items-center cursor-pointer select-none leading-none active:scale-95 transition-transform duration-100"
                >
                  <span className="font-sans font-bold text-[40px] bg-gradient-to-b from-[#EAE0C8] via-[#C5A059] to-[#997A3D] bg-clip-text text-transparent leading-none mb-1">
                    W
                  </span>
                  <span className="text-[6.5px] tracking-[0.45em] font-bold text-white uppercase block text-center ml-[0.45em] opacity-90">
                    LUXURY RENTAL
                  </span>
                </div>
              </div>

              {/* Search Capsule (Shifted to right) */}
              <div
                onClick={onEditSearch}
                className="flex items-center gap-4 bg-[#191919] hover:bg-[#252525] rounded-full px-6 py-2 cursor-pointer premium-transition group max-w-[500px] w-full ml-auto mr-0 shadow-sm"
              >
                <div className="flex-grow text-left">
                  <p className="text-[13px] font-bold text-white tracking-wide leading-tight">
                    Rental Date/time
                  </p>
                  <p className="text-[11px] font-semibold text-neutral-300 leading-tight mt-0.5">
                    {searchParams?.pickupDate || 'Jun 30'} | {searchParams?.pickupTime || '12:00 PM'} - {searchParams?.returnDate || 'Jul 15'} | {searchParams?.returnTime || '12:00 PM'}
                  </p>
                </div>
                <button className="text-white hover:text-[#C5A059] premium-transition ml-2">
                  <svg className="w-4 h-4 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* --- MOBILE RESULTS HEADER (Non-sticky Top Bar) --- */}
        <div ref={mobileHeaderRef} className="md:hidden w-full bg-white text-neutral-900 select-none z-50 relative">
          {/* Top row: Back button, Globe, User */}
          <div className="flex items-center justify-between px-4 py-2">
            <button onClick={onResetView} className="p-1 -ml-2">
              <svg className="w-5 h-5 text-neutral-900 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsLangModalOpen(true)}><Globe className="w-5 h-5 text-neutral-900" /></button>
              <button onClick={() => alert("Registration and member accounts are currently visual-only in this demonstration.")}>
                <User className="w-5 h-5 text-neutral-900" />
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE RESULTS HEADER (Sticky Search Bar) --- */}
        <div className="md:hidden w-full bg-white text-neutral-900 select-none z-50 sticky top-0 border-b border-neutral-200 shadow-sm">
          <div className="px-4 pb-3 pt-2 flex items-center gap-3">
            <div onClick={onEditSearch} className="flex-grow flex items-center justify-between bg-neutral-100/80 rounded-xl px-4 py-2.5 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-neutral-900 leading-tight">
                  Rental Date/time
                </p>
                <p className="text-[10px] font-bold text-neutral-500 leading-tight mt-0.5">
                  {searchParams?.pickupDate || 'Jun 29'} | {searchParams?.pickupTime || '12:00 PM'} - {searchParams?.returnDate || 'Jul 03'} | {searchParams?.returnTime || '12:00 PM'}
                </p>
              </div>
              <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            </div>
            {/* Filter icon button */}
            <button onClick={onOpenFilters} className="flex-shrink-0 w-[46px] h-[46px] bg-neutral-100/80 rounded-xl flex items-center justify-center cursor-pointer">
              <svg className="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <header ref={headerRef} className="w-full flex flex-col z-50 absolute top-0 left-0 select-none">


        {/* Main Navbar */}
        <div className="w-full bg-black/60 md:bg-black/30 backdrop-blur-md text-white py-3 h-[64px]">
          <div className="w-full md:w-[90%] mx-auto px-4 md:px-0 h-full flex flex-col justify-center">

            {/* --- MOBILE LAYOUT --- */}
            <div className="flex items-center justify-between h-full md:hidden">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-[#C5A059] transition-colors p-1 -ml-1">
                  <CustomMenuIcon className="w-6 h-6" />
                </button>
                <div
                  onClick={onResetView}
                  className="flex flex-col items-center cursor-pointer select-none leading-none active:scale-95 transition-transform duration-100"
                >
                  <span className="font-sans font-bold text-[28px] bg-gradient-to-b from-[#EAE0C8] via-[#C5A059] to-[#997A3D] bg-clip-text text-transparent leading-none mb-1">
                    W
                  </span>
                  <span className="text-[4.5px] tracking-[0.45em] font-bold text-white uppercase block text-center ml-[0.45em] opacity-90">
                    LUXURY RENTAL
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-5 text-[14px] font-normal text-white tracking-tight">
                <button onClick={onOurFleetClick} className="hover:text-[#C5A059] transition-colors">
                  Our Fleet
                </button>
                <button onClick={onAboutUsClick} className="hover:text-[#C5A059] transition-colors">
                  About Us
                </button>
              </div>
            </div>

            {/* --- DESKTOP LAYOUT --- */}
            <div className="hidden md:flex items-center justify-between h-full">
              {/* Left Side: Logo */}
              <div className="flex items-center gap-6">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:text-[#C5A059] transition-colors p-2 -ml-2">
                  <CustomMenuIcon className="w-7 h-7" />
                </button>
                <div
                  onClick={onResetView}
                  className="flex flex-col items-center cursor-pointer select-none leading-none active:scale-95 transition-transform duration-100"
                >
                  <span className="font-sans font-bold text-[46px] bg-gradient-to-b from-[#EAE0C8] via-[#C5A059] to-[#997A3D] bg-clip-text text-transparent leading-none mb-1">
                    W
                  </span>
                  <span className="text-[7.5px] tracking-[0.45em] font-bold text-white uppercase block text-center ml-[0.45em] opacity-90">
                    LUXURY RENTAL
                  </span>
                </div>
              </div>

              {/* Right Side: Navigation Links */}
              <div className="flex items-center gap-7 text-[16px] font-normal text-white tracking-tight">

                {/* Our Fleet Link */}
                <button 
                  onClick={onOurFleetClick}
                  className="text-white hover:text-[#C5A059] premium-transition"
                >
                  Our Fleet
                </button>

                {/* About Us Link */}
                <button 
                  onClick={onAboutUsClick}
                  className="text-white hover:text-[#C5A059] premium-transition"
                >
                  About Us
                </button>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- SIDEBAR DRAWER --- */}
      {/* Black overlay */}
      <div
        ref={sidebarOverlayRef}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] opacity-0 pointer-events-none`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        ref={sidebarPanelRef}
        className={`fixed top-0 left-0 h-full w-[85vw] sm:w-[400px] lg:w-[35vw] max-w-[500px] bg-black/40 backdrop-blur-md z-[110] flex flex-col border-r border-white/5 -translate-x-full`}
      >

        {/* Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute left-8 top-8 w-[40px] h-[40px] flex items-center justify-center transition-colors group"
        >
          <CustomCloseIcon className="w-6 h-6 md:w-7 md:h-7 text-white/60 group-hover:text-white transition-colors" />
        </button>

        {/* Navigation Items */}
        <div className="flex flex-col items-end justify-start h-full pt-32 pr-12 md:pr-16 lg:pr-24 space-y-7">
          {[
            'OUR FLEET',
            'ABOUT W',
            'CONTACT US'
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="sidebar-nav-item group cursor-pointer flex items-center" 
              onClick={() => {
                setIsSidebarOpen(false);
                if (item === 'OUR FLEET') {
                  onOurFleetClick();
                } else if (item === 'ABOUT W') {
                  onAboutUsClick();
                } else if (item === 'CONTACT US' && onContactUsClick) {
                  onContactUsClick();
                }
              }}
            >
              <span className="font-sans font-normal uppercase tracking-[0.22em] text-[14px] md:text-[16px] text-[#999999] group-hover:text-white transition-colors duration-300">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <LanguageCurrencyModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        onSelectLang={(code, name) => { setLangCode(code); setLangName(name); }}
        onSelectCurrency={(sym, name) => { setCurrencySymbol(sym); setCurrencyName(name); }}
        initialLangName={langName}
        initialCurrencyName={currencyName}
      />
    </>
  );
}
