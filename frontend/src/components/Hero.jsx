import React, { useState, useEffect, useRef } from 'react';
import { Plane, Calendar, Clock, User, Info, RotateCcw, ChevronLeft, ChevronRight, Briefcase, Globe, Car, ShieldCheck, Check, Sparkles, Building, HandHeart, CarFront, Fuel, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import CarCard from './CarCard.jsx';
import { ServiceAreaMap } from './ServiceAreaMap.jsx';

const RevealOnScroll = ({ children, className = "w-full flex flex-col items-center justify-center" }) => {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(ref.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
};

const AnimatedBannerText = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const lines = gsap.utils.toArray('.banner-line', containerRef.current);
    gsap.fromTo(lines,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.8,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 25%", // Triggers the reverse animation while the text is still clearly visible on screen
          toggleActions: "play reverse play reverse"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="text-white text-[32px] md:text-[44px] lg:text-[52px] font-sans font-normal leading-[1.15] tracking-tight mb-8 max-w-[600px] drop-shadow-md overflow-hidden">
      <div className="banner-line">PREMIUM CARS,</div>
      <div className="banner-line">FLAWLESS SERVICE,</div>
      <div className="banner-line">UNFORGETTABLE</div>
      <div className="banner-line">JOURNEYS</div>
    </div>
  );
};

// Hardcoded location data matching the reference details
const stationsData = {
  'Munich Airport': {
    name: 'Munich Airport',
    address: 'Terminalstr. Mitte/MWZ, München, 85356, DE',
    hours: '05:00 AM - 11:59 PM',
    holidays: '05:00 AM - 11:59 PM'
  },
  'Frankfurt Airport': {
    name: 'Frankfurt Airport',
    address: 'Hugo-Eckener-Ring, Frankfurt am Main, 60549, DE',
    hours: '06:00 AM - 11:30 PM',
    holidays: '06:00 AM - 11:30 PM'
  },
  'San Francisco Int Airport': {
    name: 'San Francisco Int Airport',
    address: 'SFO Rental Car Center, San Francisco, CA 94128, US',
    hours: '05:00 AM - 11:59 PM',
    holidays: '05:00 AM - 11:59 PM'
  },
  'Los Angeles Int Airport': {
    name: 'Los Angeles Int Airport',
    address: '9000 Airport Blvd, Los Angeles, CA 90045, US',
    hours: '05:00 AM - 11:59 PM',
    holidays: '05:00 AM - 11:59 PM'
  },
  'New York City Long Island City': {
    name: 'New York City Long Island City',
    address: '21-16 44th Dr, Long Island City, NY 11101, US',
    hours: '07:00 AM - 07:00 PM',
    holidays: '08:00 AM - 04:00 PM'
  }
};

const SolidPlaneIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21,16v-2l-8-5V3.5C13,2.67 12.33,2 11.5,2S10,2.67 10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5L21,16z" />
  </svg>
);

const SolidCalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
  </svg>
);

// Calendar days for June, July, August 2026
const juneDays = [
  { day: null },
  { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
  { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 },
  { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 },
  { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 },
  { day: 28 }, { day: 29 }, { day: 30 }
];

const julyDays = [
  { day: null }, { day: null }, { day: null },
  { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 }, { day: 7 },
  { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 },
  { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 },
  { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
  { day: 29 }, { day: 30 }, { day: 31 }
];

const augustDays = [
  { day: null }, { day: null }, { day: null }, { day: null }, { day: null }, { day: null },
  { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 }, { day: 7 },
  { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 },
  { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 },
  { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
  { day: 29 }, { day: 30 }, { day: 31 }
];


// ── Time Picker Popup sub-component ──────────────────────────────────────────
const TIME_GROUPS = [
  {
    label: 'Early Morning',
    slots: ['5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM'],
  },
  {
    label: 'Morning - afternoon',
    slots: [
      '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
      '4:00 PM', '4:30 PM',
    ],
  },
  {
    label: 'Evening',
    slots: [
      '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
      '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    ],
  },
  {
    label: 'Night',
    slots: [
      '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
      '11:00 PM', '11:30 PM', '12:00 AM',
    ],
  },
];

function TimePickerPopup({ activeTimeField, currentTime, selectTime }) {
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);

  // Auto-scroll to selected time slot when popup opens
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = selectedRef.current;
      const elTop = el.offsetTop;
      const elHeight = el.offsetHeight;
      const containerHeight = container.clientHeight;
      container.scrollTop = elTop - containerHeight / 2 + elHeight / 2;
    }
  }, []);

  return (
    <>
      {/* Header */}
      <div className="pt-5 pb-4 px-5">
        <p className="text-[16px] font-bold text-center text-neutral-900 mb-4">
          Select {activeTimeField} time
        </p>
        <div className="flex items-center gap-2">
          <Clock className="w-[14px] h-[14px] text-black stroke-[2.5]" />
          <span className="text-[13px] text-neutral-800 font-normal">
            {activeTimeField === 'return' ? '24-hour return' : 'Opening Times: -'}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="max-h-[220px] overflow-y-auto px-5 pb-3">
        {TIME_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            {/* Section heading */}
            <p className="text-[13px] font-bold text-neutral-900 mb-3">
              {group.label}
            </p>
            {/* Slot buttons */}
            <div className="grid grid-cols-2 gap-2">
              {group.slots.map((slot) => {
                const isSelected = slot === currentTime;
                return (
                  <button
                    key={slot}
                    ref={isSelected ? selectedRef : null}
                    type="button"
                    onClick={() => selectTime(slot, activeTimeField)}
                    className={`text-[13px] font-semibold py-3 px-3 rounded-xl text-center transition-colors premium-transition ${isSelected
                        ? 'bg-[#191919] text-white'
                        : 'bg-[#fafafa] text-neutral-800 hover:bg-[#f3f3f3]'
                      }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
const moreSixtCards = [
  {
    title: "FASTER BOOKINGS. INSTANT REWARDS.",
    subtext: "Earn, skip the counter, redeem - all in one app.",
    buttonText: "Get the W App",
    image: "/assets/cars/more_sixt_app_bg.png",
    isApp: true
  },
  {
    title: "W ONE. LOYALTY REWARDED.",
    subtext: "You're ONE membership away from discounts and priority service.",
    buttonText: "Join for free",
    image: "/assets/cars/more_sixt_loyalty_bg.png"
  },
  {
    title: "W BUSINESS",
    subtext: "Custom mobility solutions for all businesses.",
    buttonText: "Register now",
    image: "/assets/cars/more_sixt_business_bg.png"
  },
  {
    title: "W+ CAR SUBSCRIPTION",
    subtext: "The better way of owning a car.",
    buttonText: "Learn more",
    image: "/assets/cars/more_sixt_subscription_bg.png"
  },
  {
    title: "W SHARE",
    subtext: "On-the-go flexibility with premium car sharing.",
    buttonText: "Learn more",
    image: "/assets/cars/more_sixt_share_bg.png"
  },
  {
    title: "W RIDE",
    subtext: "Sit back with your personal chauffeur.",
    buttonText: "Learn more",
    image: "/assets/cars/more_sixt_ride_bg.png"
  }
];

const BoutiqueCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const slides = [
    {
      title: "W Luxury Car Rental",
      desc: "Drive your dream car in style with a luxury rental from W. From sleek sports cars to elegant sedans, explore our meticulously curated fleet and elevate every journey into an unforgettable premium experience.",
      image: "/macro_texture.png",
    },
    {
      title: "Experience the Joy of Driving",
      desc: "Make a statement on the road with W’s exclusive exotic fleet. Whether you require the commanding presence of a premium SUV or the exhilaration of a high-performance sports car, experience the ultimate joy of driving.",
      image: "/cinematic_motion.png",
    },
    {
      title: "How to Rent with W",
      desc: "Booking your luxury vehicle is seamless and entirely tailored to your itinerary. Simply select your preferred class, customize your flexible rental options, and let our premium fleet deliver the exceptional standard you expect.",
      image: "/moody_silhouette.png",
    }
  ];

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const getScrollAmount = () => track.scrollWidth - (window.innerWidth * 0.9);

    ScrollTrigger.create({
      id: "boutique-carousel",
      trigger: section,
      pin: true,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      animation: gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none"
      }),
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const currentSlide = Math.round(self.progress * (slides.length - 1));
        setActiveSlide(prev => prev !== currentSlide ? currentSlide : prev);
      }
    });

    return () => {
      const st = ScrollTrigger.getById("boutique-carousel");
      if (st) st.kill();
    };
  }, { scope: sectionRef });

  const scrollToSlide = (index) => {
    const st = ScrollTrigger.getById("boutique-carousel");
    if (st) {
      const scrollPos = st.start + (st.end - st.start) * (index / (slides.length - 1));
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  return (
    <div ref={sectionRef} className="w-full relative py-10 md:py-16 bg-white border-t border-neutral-100 overflow-x-hidden min-h-screen flex flex-col justify-center">
      {/* Section Main Header */}
      <div className="w-full md:w-[90%] mx-auto relative z-10 shrink-0">
        <h2 className="font-sans font-normal text-3xl md:text-6xl lg:text-[64px] text-[#191919] tracking-wide uppercase text-center leading-[1.1] mb-6 md:mb-12 whitespace-nowrap">
          <span className="text-[#C5A059]">W</span> LUXURY CAR RENTAL WORLDWIDE
        </h2>
      </div>

      {/* GSAP Scrolling Track — constrained to 90% screen width */}
      <div className="w-full md:w-[90%] mx-auto overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max"
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="w-screen md:w-[90vw] shrink-0 flex flex-col lg:flex-row gap-4 md:gap-10 lg:gap-16 px-4 md:px-0"
            >
              {/* Left Image */}
              <div className="w-full lg:w-[55%] h-[200px] sm:h-[35vh] md:h-[45vh] lg:h-[60vh] relative overflow-hidden group shrink-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
              </div>

              {/* Right Text Content */}
              <div className={`w-full lg:w-[45%] flex flex-col justify-center pr-4 md:pr-8 lg:pr-12 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeSlide === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: activeSlide === idx ? '150ms' : '0ms' }}>
                <h3 className="font-sans font-normal text-[22px] md:text-[28px] lg:text-[34px] text-[#191919] mb-3 md:mb-6 tracking-wider uppercase leading-[1.2]">
                  {slide.title}
                </h3>
                <div className="text-[14px] md:text-[15px] text-[#555555] font-normal leading-[1.6] md:leading-[1.8] space-y-4 mb-6 md:mb-10 max-w-[480px]">
                  <p>{slide.desc}</p>
                </div>

                {/* Discover More Button */}
                <button className="flex items-center gap-4 text-[#191919] hover:text-[#C5A059] transition-colors group cursor-pointer w-fit">
                  <div className="w-[42px] h-[42px] rounded-full border border-[#191919]/20 group-hover:border-[#C5A059] flex items-center justify-center transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transform group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase mt-0.5">Discover More</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Container */}
      <div className="w-full md:w-[90%] mx-auto mt-6 md:mt-12 flex justify-start shrink-0">
        <div className="relative flex items-center gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={`w-[7px] h-[7px] rounded-full transition-colors duration-300 ${activeSlide === idx ? 'bg-[#191919]' : 'bg-[#191919]/20'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          {/* Gliding Arc SVG */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex justify-center items-center"
            style={{ left: `${activeSlide * 23}px`, width: '7px', height: '7px' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[#191919] absolute -top-[6.5px] -left-[7.5px]">
              <path d="M 4 11 A 7 7 0 0 1 18 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const popularTypesList = [
  {
    title: "2025 Lincoln Navigator L Reserve",
    subtitle: "or similar",
    seats: 7,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_36.png",
    desc: "Effortless American luxury"
  },
  {
    title: "2025 Cadillac Escalade ESV Premium Luxury",
    subtitle: "or similar",
    seats: 7,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_18.png",
    desc: "High-tech, prestige and style"
  },
  {
    title: "2025 Cadillac Escalade ESV Luxury",
    subtitle: "or similar",
    seats: 7,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_24.png",
    desc: "The cultural Icon"
  },
  {
    title: "2026 Cadillac Escalade",
    subtitle: "or similar",
    seats: 7,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_24.png",
    desc: "Gold standard of American luxury"
  },
  {
    title: "2025 Mercedes-Benz GLS 450",
    subtitle: "or similar",
    seats: 7,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_12.png",
    desc: "Beautiful and Refined"
  },
  {
    title: "2026 Mercedes-Maybach GLS 600",
    subtitle: "or similar",
    seats: 5,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_3.png",
    desc: "Pinnacle of motoring"
  },
  {
    title: "2026 GMC Yukon XL Elevation",
    subtitle: "or similar",
    seats: 8,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_27.png",
    desc: "Bold style meets adventure"
  },
  {
    title: "2026 GMC Yukon XL Denali",
    subtitle: "or similar",
    seats: 7,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_30.png",
    desc: "Professional-grade luxury"
  },
  {
    title: "2026 Chevrolet Suburban RST",
    subtitle: "or similar",
    seats: 8,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_33.png",
    desc: "Street-smart style"
  },
  {
    title: "2026 BMW X7 xDrive40i",
    subtitle: "or similar",
    seats: 6,
    suitcases: 4,
    transmission: "Automatic",
    image: "/assets/catalog/catalog_page_15.png",
    desc: "The Ultimate Driving Machine"
  }
];

const PopularTypesCarousel = ({ onScrollToListings }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [thumbStartIdx, setThumbStartIdx] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const featuredRef = useRef(null);
  const activeCar = popularTypesList[selectedIdx];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    if (featuredRef.current) {
      // Stagger fade-in-up transition for the featured area
      gsap.fromTo(
        featuredRef.current.children,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.08, 
          ease: "power2.out" 
        }
      );
    }
  }, [selectedIdx]);



  return (
    <div className="w-full bg-white text-neutral-900 py-10 md:py-14 lg:py-16 px-4 md:px-0 text-center select-none relative z-10 border-t border-neutral-100 overflow-hidden">
      <div className="w-full md:w-[90%] mx-auto">
        {/* Section Heading */}
        <h2 className="font-sans font-normal text-3xl md:text-5xl lg:text-[56px] text-neutral-900 tracking-wide uppercase text-center leading-tight mt-2 md:mt-4 mb-8 md:mb-12">
          BROWSE POPULAR TYPES
        </h2>

        {/* Large Featured Area (Side-by-Side inside a Compact Luxury Card Container) */}
        <div ref={featuredRef} className="bg-[#f8f8f8] rounded-[24px] p-4 sm:p-5 md:p-6 lg:p-7 border border-neutral-200/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-4 w-full relative overflow-hidden">
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#C5A059]/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Left Side: Car Image Container */}
          <div className="w-full md:w-[50%] h-[210px] md:h-[260px] lg:h-[290px] flex items-center justify-center relative shrink-0 z-10">
            <img
              src={activeCar.image}
              alt={activeCar.title}
              className="relative z-10 max-h-[200px] md:max-h-[250px] lg:max-h-[280px] w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)] scale-105"
            />
          </div>

          {/* Right Side: Text & Actions */}
          <div className="w-full md:w-[50%] flex flex-col items-center md:items-start text-center md:text-left z-10">
            {/* Title */}
            <h2 className="font-sans font-bold text-[22px] md:text-[26px] text-[#191919] tracking-tight uppercase leading-tight">
              {activeCar.title}
            </h2>

            {/* Subtitle Badge (smaller beige text) */}
            <span className="text-[12px] md:text-[13px] font-semibold text-[#C5A059] mb-3 block">
              {activeCar.subtitle}
            </span>

            {/* Specs Badges Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-[11px] font-bold text-neutral-800 mb-3 w-full">
              <div className="flex items-center gap-1.5 bg-white text-[#191919] px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
                <User className="w-3.5 h-3.5 text-neutral-800 stroke-[2.5]" />
                <span>{activeCar.seats} seaters</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white text-[#191919] px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
                <Briefcase className="w-3.5 h-3.5 text-neutral-800 stroke-[2.5]" />
                <span>{activeCar.suitcases} bags</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white text-[#191919] px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
                {activeCar.transmission.toLowerCase().includes('range') ? (
                  <svg className="w-3.5 h-3.5 text-neutral-800 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                    <line x1="22" y1="11" x2="22" y2="13" />
                  </svg>
                ) : (
                  <span className="w-3.5 h-3.5 bg-neutral-900 text-white rounded-[2px] flex items-center justify-center text-[8px] font-black leading-none">A</span>
                )}
                <span>{activeCar.transmission}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[12px] md:text-[13px] text-neutral-600 font-sans leading-snug max-w-[440px] mb-3">
              {activeCar.desc}
            </p>

            {/* CTA Button */}
            <button
              type="button"
              onClick={onScrollToListings}
              className="bg-[#191919] hover:bg-[#C5A059] text-white font-bold text-[11px] md:text-[12px] tracking-wider uppercase py-2.5 px-6 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-2 group/btn"
            >
              Check availability
              <ArrowRight className="w-3.5 h-3.5 text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Thumbnail Gallery Slider */}
        <div className="w-full mt-2 border-t border-neutral-200/50 pt-3 relative">
          {/* Left chevron arrow positioned outside in left margin */}
          <button
            type="button"
            onClick={() => setThumbStartIdx(prev => Math.max(0, prev - 1))}
            className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-neutral-200 bg-white shadow-md items-center justify-center text-neutral-800 hover:border-neutral-400 active:scale-95 transition-all z-20 ${
              thumbStartIdx === 0 ? 'opacity-30 pointer-events-none' : 'opacity-100 hover:scale-110'
            }`}
            aria-label="Previous thumbnails"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right chevron arrow positioned outside in right margin */}
          <button
            type="button"
            onClick={() => setThumbStartIdx(prev => Math.min(6, prev + 1))}
            className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-neutral-200 bg-white shadow-md items-center justify-center text-neutral-800 hover:border-neutral-400 active:scale-95 transition-all z-20 ${
              thumbStartIdx === 6 ? 'opacity-30 pointer-events-none' : 'opacity-100 hover:scale-110'
            }`}
            aria-label="Next thumbnails"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Track viewport container */}
          <div className="w-full overflow-hidden py-2.5 -my-2.5">
            <div 
              className="flex md:transition-transform md:duration-500 md:ease-out overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar pt-2.5 pb-2.5 px-2 md:px-0 -mx-2 md:mx-0"
              style={isDesktop ? { transform: `translateX(-${thumbStartIdx * 25}%)` } : {}}
            >
              {popularTypesList.map((item, idx) => {
                const isSelected = selectedIdx === idx;
                return (
                  <div
                    key={`thumb-${idx}`}
                    onClick={() => setSelectedIdx(idx)}
                    className={`snap-center shrink-0 w-[190px] md:w-[calc(25%-12px)] mx-1.5 bg-[#fcfcfc] hover:bg-[#f6f6f6] border rounded-xl p-3 flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-[#C5A059] bg-white shadow-md scale-[1.02] ring-1 ring-[#C5A059]/30'
                        : 'border-neutral-200/50 shadow-sm'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-[75px] md:h-[80px] flex items-center justify-center mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-h-[68px] md:max-h-[74px] max-w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Thumbnail Title */}
                    <h3 className="font-condensed font-bold text-[12px] text-neutral-800 uppercase tracking-wide leading-tight text-center line-clamp-1">
                      {item.title}
                    </h3>
                    {/* Thumbnail Subtitle */}
                    <span className="text-[10px] text-[#C5A059] font-semibold block mb-1.5 text-center line-clamp-1">
                      {item.subtitle}
                    </span>

                    {/* Specs row tiny */}
                    <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-neutral-500 w-full">
                      <span>{item.seats}S</span>
                      <span className="text-neutral-200">•</span>
                      <span>{item.suitcases}B</span>
                      <span className="text-neutral-200">•</span>
                      <span>{item.transmission.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Small warning print at bottom */}
        <p className="text-[10px] text-neutral-400 font-bold mt-10 text-center leading-normal max-w-lg mx-auto">
          Vehicles shown are examples only. Availability may vary based on pickup location and dates.
        </p>
      </div>
    </div>
  );
};


const MARQUEE_BRANDS = [
  { name: "ROLLS ROYCE", file: "rollsroyce.svg" },
  { name: "BUGATTI", file: "bugatti.png" },
  { name: "McLAREN", file: "mclaren_orange.svg" },
  { name: "BMW", file: "bmw.svg" },
  { name: "CADILLAC", file: "cadillac.png" },
  { name: "FERRARI", file: "ferrari.svg" },
  { name: "LAMBORGHINI", file: "lamborghini.svg" },
  { name: "PORSCHE", file: "porsche.png" },
  { name: "ASTON MARTIN", file: "astonmartin_white.svg" },
  { name: "MASERATI", file: "maserati.svg" }
];

const TIME_SLOTS = [];
for (let h = 8; h <= 20; h++) {
  for (let m = 0; m < 60; m += 30) {
    if (h === 20 && m === 30) continue;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    const minute = m === 0 ? '00' : '30';
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    TIME_SLOTS.push(`${hourStr}:${minute} ${ampm}`);
  }
}

// Helper to get calendar data for a month
function getMonthData(year, monthIndex) {
  const d = new Date(year, monthIndex, 1);
  const firstDay = d.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthName = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return { firstDay, daysInMonth, monthName };
}

export default function Hero({ onSearch, initialMobilePanel, onPanelClosed, isDropdownMode = false, initialSearchParams = null }) {
  const [pickupLocation, setPickupLocation] = useState(initialSearchParams?.pickupLocation || 'Munich Airport');
  const [pickupDate, setPickupDate] = useState(initialSearchParams?.pickupDate || 'Jun 30');
  const [pickupTime, setPickupTime] = useState(initialSearchParams?.pickupTime || '12:00 PM');
  const [returnDate, setReturnDate] = useState(initialSearchParams?.returnDate || 'Jul 15');
  const [returnTime, setReturnTime] = useState(initialSearchParams?.returnTime || '12:00 PM');
  const [driverAge, setDriverAge] = useState(initialSearchParams?.driverAge || '30+');
  const [activeTab, setActiveTab] = useState('Cars');
  const [activeServiceLocation, setActiveServiceLocation] = useState(null);
  const [isWidgetExpanded, setIsWidgetExpanded] = useState(false);
  const widgetRef = useRef(null);
  const stickyWidgetRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedMain = widgetRef.current && widgetRef.current.contains(event.target);
      const clickedSticky = stickyWidgetRef.current && stickyWidgetRef.current.contains(event.target);
      if (!clickedMain && !clickedSticky) {
        setIsWidgetExpanded(false);
        setShowCalendarPopup(false);
        setShowTimePopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollAnimationRef = useRef(null);

  useGSAP(() => {
    if (isDropdownMode) return;
    const trigger = scrollAnimationRef.current;
    if (!trigger) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      }
    });

    // Continuous linear motion from right edge (60vw) to fully exiting left edge (-90vw)
    tl.fromTo(".car-container-animate", {
      x: "60vw"
    }, {
      x: "-75vw",
      ease: "none"
    }, 0);

    // Rotate front wheel
    tl.to(".car-wheel-front", {
      rotation: -360 * 6,
      ease: "none"
    }, 0);

    // Rotate rear wheel
    tl.to(".car-wheel-rear", {
      rotation: -360 * 6,
      ease: "none"
    }, 0);

    // Fade in/out the text
    tl.to(".car-text-animate", {
      opacity: 1,
      duration: 0.25,
      ease: "power1.inOut"
    }, 0)
      .to(".car-text-animate", {
        opacity: 0,
        duration: 0.25,
        ease: "power1.inOut"
      }, 0.3);

  }, { scope: scrollAnimationRef, dependencies: [isDropdownMode] });


  const [isDifferentReturn, setIsDifferentReturn] = useState(false);
  const [returnLocation, setReturnLocation] = useState('');
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [hoveredReturnStationKey, setHoveredReturnStationKey] = useState('Munich Airport');

  // Popup triggers
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [hoveredStationKey, setHoveredStationKey] = useState('Munich Airport');
  const [isSticky, setIsSticky] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const lastScrollY = useRef(0);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [activeDateField, setActiveDateField] = useState(null); // 'pickup' or 'return'
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState(null); // 'pickup' or 'return'
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const mobileFleetScrollRef = useRef(null);

  const [moreSixtSlide, setMoreSixtSlide] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [activeRegionTab, setActiveRegionTab] = useState('NYC Boroughs');
  // Mobile step-by-step panel: null | 'location' | 'details' | 'calendar' | 'time-pickup' | 'time-return'
  const [mobilePanel, setMobilePanel] = useState(initialMobilePanel || null);
  const [instagramReels, setInstagramReels] = useState([]);
  const [instagramLoading, setInstagramLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (initialMobilePanel) {
      setMobilePanel(initialMobilePanel);
    }
  }, [initialMobilePanel]);

  useEffect(() => {
    if (mobilePanel === null && onPanelClosed) {
      onPanelClosed();
    }
  }, [mobilePanel, onPanelClosed]);

  // Fetch live Instagram media via Meta Graph API
  useEffect(() => {
    const token = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
    const userId = import.meta.env.VITE_INSTAGRAM_USER_ID;
    if (!token || !userId) {
      setInstagramLoading(false);
      return;
    }
    fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,thumbnail_url,permalink&limit=8&access_token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          setInstagramReels(data.data);
        }
        setInstagramLoading(false);
      })
      .catch(() => {
        setInstagramLoading(false);
      });
  }, []);

  const handleScrollToListings = () => {
    const el = document.getElementById('listings-container');
    if (el && !isDropdownMode) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onSearch({
        pickupLocation,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        driverAge
      });
    }
  };

  const handleDestinationClick = (city) => {
    setPickupLocation(city);
    setHoveredStationKey(city);

    // Map clicked destination name to a matching activeServiceLocation ID
    const name = city.toLowerCase();
    let locationId = null;
    if (name.includes('manhattan')) locationId = 'manhattan';
    else if (name.includes('brooklyn')) locationId = 'brooklyn';
    else if (name.includes('queens')) locationId = 'queens';
    else if (name.includes('bronx')) locationId = 'bronx';
    else if (name.includes('staten island')) locationId = 'statenisland';
    else if (name.includes('jfk') || name.includes('kennedy')) locationId = 'jfk';
    else if (name.includes('lga') || name.includes('laguardia')) locationId = 'lga';
    else if (name.includes('ewr') || name.includes('newark')) locationId = 'ewr';
    else if (name.includes('teb') || name.includes('teterboro')) locationId = 'teb';
    else if (name.includes('hpn') || name.includes('westchester')) locationId = 'hpn';

    if (locationId) {
      setActiveServiceLocation(locationId);
    }

    // Scroll smoothly to the map section instead of top
    setTimeout(() => {
      const mapSection = document.getElementById('service-area-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);
  };


  const openTimePopup = (e, field) => {
    e.stopPropagation();
    setShowCalendarPopup(false);
    setActiveTimeField(field);
    setShowTimePopup(true);
  };

  const selectTime = (slot, field) => {
    if (field === 'pickup') setPickupTime(slot);
    else setReturnTime(slot);
    setShowTimePopup(false);
    setActiveTimeField(null);
  };

  const parseDateStr = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      const monthStr = parts[0];
      const day = parseInt(parts[1], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = months.findIndex(m => monthStr.toLowerCase().startsWith(m.toLowerCase()));
      if (monthIndex !== -1) {
        return new Date(2026, monthIndex, day);
      }
    }
    return null;
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update general sticky flag
      if (currentScrollY > 120) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Update scroll-up search bar visibility when main search bar has scrolled out of view
      const threshold = window.innerWidth >= 768 ? window.innerHeight * 0.78 + 160 : window.innerHeight * 0.68 + 220;
      const isWidgetOutOfView = currentScrollY > threshold;

      if (isWidgetOutOfView) {
        if (currentScrollY < lastScrollY.current) {
          setShowStickySearch(true);
        } else {
          setShowStickySearch(false);
        }
      } else {
        setShowStickySearch(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const historyStations = ['Munich Airport', 'Frankfurt Airport'];
  const popularStations = ['Frankfurt Airport', 'San Francisco Int Airport', 'Munich Airport', 'Los Angeles Int Airport'];

  const getFilteredStations = (list) => {
    if (!pickupLocation || list.includes(pickupLocation)) {
      return list;
    }
    const filtered = list.filter(name =>
      name.toLowerCase().includes(pickupLocation.toLowerCase())
    );
    return filtered.length > 0 ? filtered : list;
  };

  const renderMonth = (monthName, daysList, baseValueOffset) => {
    return (
      <div className="w-full">
        <h3 className="text-center font-normal text-neutral-900 mb-5 text-xl tracking-tight">
          {monthName}
        </h3>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center mb-3">
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
            <span key={day} className="text-[11px] font-bold text-neutral-400">
              {day}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 text-center gap-y-1 text-sm font-semibold">
          {daysList.map((item, idx) => {
            if (item.day === null) {
              return <div key={`empty-${idx}`} />;
            }

            const parts = monthName.split(' ');
            const monthStr = parts[0].substring(0, 3);
            const yearVal = parseInt(parts[1], 10);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = months.findIndex(m => monthStr.toLowerCase().startsWith(m.toLowerCase()));
            const cellDate = new Date(yearVal, monthIndex, item.day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isPast = cellDate < today;
            const isToday = isSameDay(cellDate, today);

            const startDate = parseDateStr(pickupDate);
            const endDate = parseDateStr(returnDate);

            const isStart = isSameDay(cellDate, startDate);
            const isEnd = isSameDay(cellDate, endDate);
            const inRange = startDate && endDate && cellDate > startDate && cellDate < endDate;

            let dayClass = "w-9 h-9 flex items-center justify-center mx-auto rounded-full transition-colors cursor-pointer ";
            if (isPast) {
              dayClass += "text-neutral-300 cursor-not-allowed pointer-events-none";
            } else if (isStart || isEnd) {
              dayClass += "bg-black text-white font-bold rounded-full";
            } else if (inRange) {
              dayClass += "bg-neutral-100 text-neutral-900 font-bold rounded-lg";
            } else if (isToday) {
              dayClass += "text-[#C5A059] font-bold hover:bg-neutral-50";
            } else {
              dayClass += "text-neutral-800 hover:bg-neutral-50";
            }

            // Click handler
            const handleDateClick = () => {
              if (isPast) return;

              const monthPrefix = monthName.split(' ')[0].substring(0, 3); // "Jun", "Jul", "Aug"
              const dateStr = `${monthPrefix} ${item.day}`;

              if (activeDateField === 'pickup') {
                setPickupDate(dateStr);
                // Clear return date if it's before the new pickup date
                if (endVal && dayVal >= endVal) {
                  setReturnDate('');
                }
                setActiveDateField('return');
              } else if (activeDateField === 'return') {
                if (startVal && dayVal > startVal) {
                  setReturnDate(dateStr);
                  setShowCalendarPopup(false);
                  setActiveDateField(null);
                } else {
                  // If return date is before pickup date, treat it as new pickup date
                  setPickupDate(dateStr);
                  setReturnDate('');
                  setActiveDateField('return');
                }
              }
            };

            return (
              <div
                key={`day-${item.day}`}
                onClick={handleDateClick}
                className={dayClass}
              >
                {item.day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      pickupLocation,
      returnLocation: isDifferentReturn ? returnLocation : pickupLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      driverAge
    });
  };

  const currentStation = stationsData[hoveredStationKey] || stationsData['Munich Airport'];

  const carouselSlides = [
    [
      {
        name: "BMW 7 Series",
        category: "Luxury Sedan",
        seats: 5,
        suitcases: 4,
        transmission: "Automatic",
        image: "/assets/cars/7_series.png"
      },
      {
        name: "Mercedes E-Class",
        category: "Premium Sedan",
        seats: 5,
        suitcases: 4,
        transmission: "Automatic",
        image: "/assets/cars/mercedes_e_class.png"
      }
    ],
    [
      {
        name: "Mercedes G-Class",
        category: "Luxury 5 Seater SUV",
        seats: 5,
        suitcases: 4,
        transmission: "Automatic",
        image: "/assets/cars/g_class.png"
      },
      {
        name: "BMW X7",
        category: "Luxury 7 Seater SUV",
        seats: 7,
        suitcases: 4,
        transmission: "Automatic",
        image: "/assets/cars/x7.png"
      }
    ],
    [
      {
        name: "BMW Z4",
        category: "Luxury Convertible",
        seats: 2,
        suitcases: 1,
        transmission: "Automatic",
        image: "/assets/cars/z4.png"
      },
      {
        name: "BMW 8 Series",
        category: "Luxury Sports Car",
        seats: 4,
        suitcases: 2,
        transmission: "Automatic",
        image: "/assets/cars/sports_car.png"
      }
    ]
  ];



  const regionCountries = {
    'NYC Boroughs': ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island'],
    'Airport Hubs': [
      'John F. Kennedy International Airport (JFK)',
      'LaGuardia Airport (LGA)',
      'Newark Liberty International Airport (EWR)',
      'Teterboro Airport (TEB)',
      'Westchester County Airport (HPN)',
      'Morristown Municipal Airport (MMU)',
      'Long Island MacArthur Airport (ISP)'
    ]
  };

  const renderSearchWidget = () => {
    return (
      <div ref={widgetRef} className="w-full z-40 relative mb-4 pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full items-center">
          {/* Rental Dates */}
          <div 
            onClick={() => {
              setShowCalendarPopup(!showCalendarPopup);
              setShowTimePopup(false);
            }}
            className="flex items-center justify-between bg-[#F4F5F6] rounded-[16px] px-6 h-[64px] cursor-pointer hover:bg-[#EBECEC] transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-[13px] font-normal text-neutral-400 mb-0.5">Rental dates</span>
              <span className="text-[16px] font-bold text-neutral-800">
                {pickupDate && returnDate ? `${pickupDate} - ${returnDate}` : 'Select dates'}
              </span>
            </div>
            <svg className="w-6 h-6 text-[#C5A059] stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>

          {/* Time Selectors */}
          <div 
            onClick={() => {
              setShowTimePopup(!showTimePopup);
              setShowCalendarPopup(false);
            }}
            className="flex items-center bg-[#F4F5F6] rounded-[16px] h-[64px] relative"
          >
            {/* Pick up time */}
            <div className="flex flex-col justify-center px-6 flex-1 cursor-pointer hover:bg-[#EBECEC] rounded-l-[16px] transition-colors h-full">
              <span className="text-[13px] font-normal text-neutral-400 mb-0.5">Pick up time</span>
              <span className="text-[16px] font-bold text-neutral-800">{pickupTime}</span>
            </div>
            
            {/* Divider */}
            <div className="w-[1px] h-[34px] bg-neutral-200"></div>
            
            {/* Drop-off time */}
            <div className="flex flex-col justify-center px-6 flex-1 cursor-pointer hover:bg-[#EBECEC] rounded-r-[16px] transition-colors h-full">
              <span className="text-[13px] font-normal text-neutral-400 mb-0.5">Drop-off time</span>
              <span className="text-[16px] font-bold text-neutral-800">{returnTime}</span>
            </div>
            
            {/* Time Popup Dropdown */}
            {showTimePopup && (
              <div 
                data-lenis-prevent
                className="absolute top-[calc(100%+12px)] left-0 w-full bg-[#F4F5F6] rounded-[24px] shadow-2xl z-50 border border-neutral-200/50 flex overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Pickup Time List */}
                <div className="flex-1 overflow-y-auto h-[320px] px-2 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {TIME_SLOTS.map(time => (
                    <div 
                      key={`pickup-${time}`}
                      onClick={() => { setPickupTime(time); }}
                      className={`text-center py-2.5 mx-4 my-1.5 rounded-full cursor-pointer transition-colors text-[15px] font-normal ${
                        pickupTime === time 
                          ? 'bg-[#C5A059] text-white shadow-sm' 
                          : 'text-neutral-800 hover:bg-neutral-200/70'
                      }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
                
                {/* Divider */}
                <div className="w-[1px] bg-neutral-200/60 my-4"></div>

                {/* Drop-off Time List */}
                <div className="flex-1 overflow-y-auto h-[320px] px-2 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {TIME_SLOTS.map(time => (
                    <div 
                      key={`return-${time}`}
                      onClick={() => { setReturnTime(time); }}
                      className={`text-center py-2.5 mx-4 my-1.5 rounded-full cursor-pointer transition-colors text-[15px] font-normal ${
                        returnTime === time 
                          ? 'bg-[#C5A059] text-white shadow-sm' 
                          : 'text-neutral-800 hover:bg-neutral-200/70'
                      }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Show Cars Button */}
          <button 
            onClick={handleScrollToListings}
            className="w-full bg-[#C5A059] hover:bg-[#B28F4B] text-white rounded-[16px] h-[64px] flex items-center justify-center font-bold text-[16px] transition-colors shadow-md"
          >
            Show Cars
          </button>
          
        </div>

        {/* Calendar Popup Overlay */}
        {showCalendarPopup && (
          <div 
            data-lenis-prevent
            className="absolute top-[74px] md:top-[calc(100%+12px)] left-0 w-full bg-[#F4F5F6] rounded-[24px] px-8 py-5 shadow-2xl z-50 border border-neutral-200/50 max-h-[380px] overflow-y-auto premium-scrollbar md:max-h-none md:overflow-visible"
          >
            {/* Header with arrows */}
            <div className="hidden md:flex items-center justify-between mb-5">
              <button 
                type="button" 
                onClick={() => setCalendarOffset(Math.max(0, calendarOffset - 1))}
                className={`p-1 transition-colors ${calendarOffset > 0 ? 'text-[#C5A059] hover:text-[#B28F4B]' : 'text-neutral-300 cursor-default'}`}
              >
                <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="flex-1 flex justify-between px-16 lg:px-32">
                {[0, 1, 2].map(offset => (
                  <span key={offset} className="text-[16px] font-normal text-neutral-800 tracking-wide">
                    {getMonthData(2026, 6 + calendarOffset + offset).monthName}
                  </span>
                ))}
              </div>
              
              <button 
                type="button"
                onClick={() => setCalendarOffset(calendarOffset + 1)}
                className="text-[#C5A059] hover:text-[#B28F4B] p-1"
              >
                <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            
            {/* Calendars Row */}
            <div 
              data-lenis-prevent
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[380px] md:max-h-none overflow-y-auto md:overflow-visible premium-scrollbar"
            >
              {(isMobile ? Array.from({length: 12}, (_, i) => i) : [0, 1, 2]).map(offset => {
                const { firstDay, daysInMonth, monthName } = getMonthData(2026, 6 + calendarOffset + offset);
                
                return (
                  <div key={offset} className="flex-1">
                    <p className="text-center font-bold text-[14px] text-neutral-500 uppercase tracking-widest mb-4 md:hidden">
                      {monthName}
                    </p>
                    
                    {/* Days of week */}
                    <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-neutral-400 mb-2">
                      <span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span><span>SU</span>
                    </div>
                    
                    {/* Month Days */}
                    <div className="grid grid-cols-7 gap-y-2 text-center">
                      {Array.from({length: firstDay}).map((_, i) => (
                        <div key={`empty-${offset}-${i}`}></div>
                      ))}
                      {Array.from({length: daysInMonth}, (_, i) => i + 1).map(date => {
                        const monthPrefix = getMonthData(2026, 6 + calendarOffset + offset).monthName.split(' ')[0].substring(0, 3);
                        const dateStr = `${monthPrefix} ${date}`;
                        
                        const startDate = parseDateStr(pickupDate);
                        const endDate = parseDateStr(returnDate);
                        const cellDate = new Date(2026, 6 + calendarOffset + offset, date);
                        const isStart = isSameDay(cellDate, startDate);
                        const isEnd = isSameDay(cellDate, endDate);
                        const inRange = startDate && endDate && cellDate > startDate && cellDate < endDate;

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isPast = cellDate < today;

                        let dayClass = "text-[14px] font-semibold w-[32px] h-[32px] mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors ";
                        if (isPast) {
                          dayClass += "text-neutral-300 cursor-not-allowed pointer-events-none";
                        } else if (isStart || isEnd) {
                          dayClass += "bg-black text-white font-bold";
                        } else if (inRange) {
                          dayClass += "bg-neutral-200 text-neutral-900 rounded-lg";
                        } else {
                          dayClass += "text-neutral-800 hover:bg-white";
                        }

                        return (
                          <div 
                            key={date} 
                            onClick={() => {
                              if (isPast) return;
                              if (!pickupDate || (pickupDate && returnDate)) {
                                setPickupDate(dateStr);
                                setReturnDate('');
                              } else {
                                setReturnDate(dateStr);
                                setShowCalendarPopup(false);
                              }
                            }}
                            className={dayClass}
                          >
                            {date}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sticky Scroll-Up Search Bar */}
      <div 
        ref={stickyWidgetRef}
        className={`fixed top-0 left-0 right-0 w-full z-[100] bg-black/90 backdrop-blur-md shadow-2xl border-b border-neutral-800 py-3.5 transition-all duration-300 ease-out hidden md:block ${
          showStickySearch ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full md:w-[90%] mx-auto px-4 md:px-0 flex items-center justify-between gap-6">
          {/* Logo Brand */}
          <div 
            onClick={handleScrollToListings}
            className="flex flex-col items-center cursor-pointer select-none leading-none active:scale-95 transition-transform duration-100 flex-shrink-0"
          >
            <span className="font-sans font-bold text-[24px] bg-gradient-to-b from-[#EAE0C8] via-[#C5A059] to-[#997A3D] bg-clip-text text-transparent leading-none mb-0.5">
              W
            </span>
            <span className="text-[4px] tracking-[0.3em] font-extrabold text-neutral-400 uppercase">
              LUXURY RENTAL
            </span>
          </div>

          {/* Search Inputs Container */}
          <div className="flex flex-row gap-3 md:gap-4 flex-grow max-w-[800px] relative">
            {/* Rental Dates Selector */}
            <div 
              onClick={() => {
                setShowCalendarPopup(!showCalendarPopup);
                setShowTimePopup(false);
              }}
              className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-[14px] px-5 py-2 flex-1 cursor-pointer hover:bg-neutral-900 transition-colors"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-normal text-neutral-500 mb-0.5 uppercase tracking-wider">Rental dates</span>
                <span className="text-[14px] font-bold text-neutral-200">
                  {pickupDate && returnDate ? `${pickupDate} - ${returnDate}` : 'Select dates'}
                </span>
              </div>
              <svg className="w-5 h-5 text-[#C5A059] stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>

            {/* Time Selectors */}
            <div 
              onClick={() => {
                setShowTimePopup(!showTimePopup);
                setShowCalendarPopup(false);
              }}
              className="flex items-center bg-neutral-900/60 border border-neutral-800 rounded-[14px] flex-1 relative"
            >
              {/* Pick up time */}
              <div className="flex flex-col justify-center px-5 py-2 flex-1 cursor-pointer hover:bg-neutral-900 rounded-l-[14px] transition-colors h-full text-left">
                <span className="text-[10px] font-normal text-neutral-500 mb-0.5 uppercase tracking-wider">Pick up time</span>
                <span className="text-[14px] font-bold text-neutral-200">{pickupTime}</span>
              </div>
              
              {/* Divider */}
              <div className="w-[1px] h-[26px] bg-neutral-800"></div>
              
              {/* Drop-off time */}
              <div className="flex flex-col justify-center px-5 py-2 flex-1 cursor-pointer hover:bg-neutral-900 rounded-r-[14px] transition-colors h-full text-left">
                <span className="text-[10px] font-normal text-neutral-500 mb-0.5 uppercase tracking-wider">Drop-off time</span>
                <span className="text-[14px] font-bold text-neutral-200">{returnTime}</span>
              </div>
              
              {/* Time Popup Dropdown inside sticky bar */}
              {showTimePopup && (
                <div 
                  data-lenis-prevent
                  className="absolute top-[calc(100%+10px)] left-0 w-full bg-[#121212] rounded-[20px] shadow-2xl z-50 border border-neutral-800 flex overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex-1 overflow-y-auto h-[280px] px-1 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {TIME_SLOTS.map(time => (
                      <div 
                        key={`pickup-sticky-${time}`}
                        onClick={() => { setPickupTime(time); }}
                        className={`text-center py-2 mx-3 my-1 rounded-full cursor-pointer transition-colors text-[14px] font-normal ${
                          pickupTime === time 
                            ? 'bg-[#C5A059] text-white shadow-sm font-bold' 
                            : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                  <div className="w-[1px] bg-neutral-800 my-4"></div>
                  <div className="flex-1 overflow-y-auto h-[280px] px-1 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {TIME_SLOTS.map(time => (
                      <div 
                        key={`return-sticky-${time}`}
                        onClick={() => { setReturnTime(time); }}
                        className={`text-center py-2 mx-3 my-1 rounded-full cursor-pointer transition-colors text-[14px] font-normal ${
                          returnTime === time 
                            ? 'bg-[#C5A059] text-white shadow-sm font-bold' 
                            : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Popup Overlay inside sticky bar */}
            {showCalendarPopup && (
              <div 
                className="absolute top-[calc(100%+10px)] left-0 w-full bg-[#F4F5F6] rounded-[24px] px-8 py-5 shadow-2xl z-50 border border-neutral-200/50"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with arrows */}
                <div className="flex items-center justify-between mb-5">
                  <button 
                    type="button" 
                    onClick={() => setCalendarOffset(Math.max(0, calendarOffset - 1))}
                    className={`p-1 transition-colors ${calendarOffset > 0 ? 'text-[#C5A059] hover:text-[#B28F4B]' : 'text-neutral-300 cursor-default'}`}
                  >
                    <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  
                  <div className="flex-1 flex justify-between px-16 lg:px-32">
                    {[0, 1, 2].map(offset => (
                      <span key={offset} className="text-[16px] font-normal text-neutral-800 tracking-wide">
                        {getMonthData(2026, 6 + calendarOffset + offset).monthName}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setCalendarOffset(calendarOffset + 1)}
                    className="text-[#C5A059] hover:text-[#B28F4B] transition-colors p-1"
                  >
                    <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                {/* Calendars Container */}
                <div 
                  data-lenis-prevent
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[380px] md:max-h-none overflow-y-auto md:overflow-visible premium-scrollbar"
                >
                  {(isMobile ? Array.from({length: 12}, (_, i) => i) : [0, 1, 2]).map(offset => {
                    const { firstDay, daysInMonth } = getMonthData(2026, 6 + calendarOffset + offset);
                    return (
                      <div key={offset}>
                        <div className="grid grid-cols-7 text-center mb-3">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <span key={day} className="text-[12px] font-normal text-neutral-500">{day}</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                          {Array.from({length: firstDay}).map((_, i) => (
                            <div key={`empty-sticky-${i}`}></div>
                          ))}
                          {Array.from({length: daysInMonth}, (_, i) => i + 1).map(date => {
                            const monthPrefix = getMonthData(2026, 6 + calendarOffset + offset).monthName.split(' ')[0].substring(0, 3);
                            const dateStr = `${monthPrefix} ${date}`;
                            
                            const startDate = parseDateStr(pickupDate);
                            const endDate = parseDateStr(returnDate);
                            const cellDate = new Date(2026, 6 + calendarOffset + offset, date);
                            const isStart = isSameDay(cellDate, startDate);
                            const isEnd = isSameDay(cellDate, endDate);
                            const inRange = startDate && endDate && cellDate > startDate && cellDate < endDate;

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isPast = cellDate < today;

                            let dayClass = "text-[14px] font-semibold w-[32px] h-[32px] mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors ";
                            if (isPast) {
                              dayClass += "text-neutral-300 cursor-not-allowed pointer-events-none";
                            } else if (isStart || isEnd) {
                              dayClass += "bg-black text-white font-bold";
                            } else if (inRange) {
                              dayClass += "bg-neutral-200 text-neutral-900 rounded-lg";
                            } else {
                              dayClass += "text-neutral-800 hover:bg-neutral-200";
                            }
                            
                            return (
                              <div 
                                key={date} 
                                onClick={() => {
                                  if (isPast) return;
                                  if (!pickupDate || (pickupDate && returnDate)) {
                                    setPickupDate(dateStr);
                                    setReturnDate('');
                                    setActiveDateField('return');
                                  } else {
                                    setReturnDate(dateStr);
                                    setShowCalendarPopup(false);
                                  }
                                }}
                                className={dayClass}
                              >
                                {date}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Show Cars Action Button */}
          <button 
            onClick={handleScrollToListings}
            className="bg-[#C5A059] hover:bg-[#B28F4B] text-white rounded-[14px] px-8 py-2.5 flex items-center justify-center font-bold text-[15px] transition-colors md:w-auto shadow-lg flex-shrink-0"
          >
            Show Cars
          </button>
        </div>
      </div>

      <section className={`relative z-20 w-full flex flex-col justify-start items-center select-none ${isDropdownMode ? 'bg-white py-4 md:py-6' : 'bg-transparent w-full pb-4'}`}>

        {/* Full-width Background Video exactly like the reference */}
        {!isDropdownMode && (
          <>
            {/* Full-width Background Video banner */}
            <div className="relative w-full h-[68vh] md:h-[73vh] lg:h-[78vh] min-h-[480px] overflow-hidden flex flex-col justify-center items-center px-6 md:px-12 lg:px-[10%] select-none z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none z-0"
              >
                <source src="/assets/SuburbanDay_web.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Elegant Text Overlay centered to screen */}
              <RevealOnScroll className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-[10%] z-10 pointer-events-none">
                <h1
                  className="text-white text-[45px] md:text-[70px] lg:text-[85px] font-condensed font-normal tracking-tight leading-[1.1] mb-4 drop-shadow-md text-center"
                >
                  W Luxury Car Rental
                </h1>
                <p className="text-white text-base md:text-[20px] font-medium max-w-lg md:max-w-2xl leading-relaxed opacity-100 font-sans tracking-wide drop-shadow-md text-center mx-auto">
                  Choose from our range of top Luxury cars worldwide.
                </p>
              </RevealOnScroll>
            </div>

            {/* Relocated Search Bar Widget below Video Banner */}
            <div className="w-full md:w-[90%] px-4 md:px-0 mx-auto mt-6 md:mt-8 mb-6 z-30 relative pointer-events-auto">
              {renderSearchWidget()}
            </div>

            {/* Address & Contact Information Box directly beneath the Search Bar */}
            <div className="w-full md:w-[90%] px-4 md:px-0 mx-auto mb-16 z-10 relative">
              <div className="flex flex-col md:flex-row gap-4 w-full text-left">
                {/* Left Side: Stacked Phone and Hours Cards */}
                <div className="w-full md:w-[40%] flex flex-col gap-4">
                  {/* Phone card */}
                  <div className="bg-[#121212] rounded-[24px] py-4 px-6 border border-neutral-800/40 shadow-lg flex flex-col justify-center h-[82px]">
                    <span className="text-[10px] font-normal text-neutral-400/80 uppercase tracking-widest mb-1 font-sans">
                      Phone
                    </span>
                    <a href="tel:+17182133279" className="text-lg md:text-xl font-bold text-white hover:text-[#C5A059] transition-colors leading-tight">
                      (718) 213-3279
                    </a>
                  </div>
                  {/* Hours card */}
                  <div className="bg-[#121212] rounded-[24px] py-4 px-6 border border-neutral-800/40 shadow-lg flex flex-col justify-center h-[82px]">
                    <span className="text-[10px] font-normal text-neutral-400/80 uppercase tracking-widest mb-1 font-sans">
                      Operating hours
                    </span>
                    <span className="text-[16px] md:text-[18px] font-bold text-white leading-tight">
                      Mon — Sun: 8 AM — 8 PM
                    </span>
                  </div>
                </div>

                {/* Right Side: Tall Address Card */}
                <div className="w-full md:w-[60%] bg-[#121212] garage-map-card rounded-[24px] p-5 md:p-6 border border-neutral-800/40 shadow-lg flex flex-col justify-between min-h-[180px]">
                  <div>
                    <span className="text-[10px] font-normal text-neutral-400/80 uppercase tracking-widest mb-1 block font-sans">
                      Address
                    </span>
                    <span className="text-lg md:text-[20px] font-bold text-white leading-snug">
                      58 Throop Ave, Brooklyn, NY 11206
                    </span>
                  </div>
                  <p className="text-[11px] font-normal text-neutral-400/80 leading-relaxed mt-2 pt-2.5 border-t border-neutral-800/60">
                    Please note that W Luxury does not conduct in-person transactions for rental vehicles or other services at this address. Our garage is for pick-up and drop-off only. To rent with W Luxury, please book online.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {isDropdownMode && (
          <div className="w-full md:w-[90%] px-4 md:px-0 mx-auto">
            {renderSearchWidget()}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
          MOBILE PANELS — full-screen overlays (hidden on md+)
          ═══════════════════════════════════════════════════════════ */}

        {/* ── PANEL 1B: Return Location Picker ── */}
        {mobilePanel === 'location-return' && (
          <div data-lenis-prevent className="md:hidden fixed inset-0 z-[200] bg-white flex flex-col animate-slideInLeft">
            <div className="flex items-center px-5 py-4 border-b border-neutral-100">
              <button onClick={() => setMobilePanel('details')} className="text-neutral-800 font-bold text-lg p-1 mr-3">✕</button>
              <span className="font-bold text-base text-neutral-900">Return location</span>
            </div>
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 border-2 border-neutral-200 rounded-xl px-3 h-[46px]">
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input type="text" value={returnLocation} onChange={e => setReturnLocation(e.target.value)}
                  className="flex-grow text-sm font-bold text-neutral-900 outline-none" placeholder="City, airport, station..." autoFocus />
                {returnLocation && <button onClick={() => setReturnLocation('')} className="text-neutral-400 text-xs">✕</button>}
              </div>
            </div>
            <div className="flex-grow overflow-y-auto px-5 pb-8">
              <p className="text-xs font-black text-neutral-400 uppercase tracking-wider mt-4 mb-3">Popular stations</p>
              {popularStations.map(name => (
                <button key={name} type="button" onClick={() => { setReturnLocation(name); setHoveredReturnStationKey(name); setMobilePanel('details'); }}
                  className="w-full flex items-center gap-4 py-3.5 border-b border-neutral-100 text-left">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" stroke="none" /><circle cx="12" cy="9" r="2.5" fill="white" stroke="none" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{name}</p>
                    <p className="text-xs text-neutral-400 truncate max-w-[240px]">{stationsData[name]?.address || ''}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PANEL 1: Location Picker ── */}
        {mobilePanel === 'location' && (
          <div data-lenis-prevent className="md:hidden fixed inset-0 z-[200] bg-white flex flex-col animate-slideInLeft">
            <div className="flex items-center px-5 py-4 border-b border-neutral-100">
              <button onClick={() => setMobilePanel(null)} className="text-neutral-800 font-bold text-lg p-1 mr-3">✕</button>
              <span className="font-bold text-base text-neutral-900">Pickup location</span>
            </div>
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 border-2 border-neutral-200 rounded-xl px-3 h-[46px]">
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input type="text" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)}
                  className="flex-grow text-sm font-bold text-neutral-900 outline-none" placeholder="City, airport, station..." autoFocus />
                {pickupLocation && <button onClick={() => setPickupLocation('')} className="text-neutral-400 text-xs">✕</button>}
              </div>
            </div>
            <div className="flex-grow overflow-y-auto px-5 pb-8">
              <p className="text-xs font-black text-neutral-400 uppercase tracking-wider mt-4 mb-3">History</p>
              {historyStations.map(name => (
                <button key={name} type="button" onClick={() => { setPickupLocation(name); setHoveredStationKey(name); setMobilePanel('details'); }}
                  className="w-full flex items-center gap-4 py-3.5 border-b border-neutral-100 text-left">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{name}</p>
                    <p className="text-xs text-neutral-400">{stationsData[name]?.address || ''}</p>
                  </div>
                </button>
              ))}
              <p className="text-xs font-black text-neutral-400 uppercase tracking-wider mt-5 mb-3">Popular stations</p>
              {popularStations.map(name => (
                <button key={name} type="button" onClick={() => { setPickupLocation(name); setHoveredStationKey(name); setMobilePanel('details'); }}
                  className="w-full flex items-center gap-4 py-3.5 border-b border-neutral-100 text-left">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" stroke="none" /><circle cx="12" cy="9" r="2.5" fill="white" stroke="none" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{name}</p>
                    <p className="text-xs text-neutral-400 truncate max-w-[240px]">{stationsData[name]?.address || ''}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PANEL 2: Rental Details ── */}
        {mobilePanel === 'details' && (
          <div data-lenis-prevent className="md:hidden fixed inset-0 z-[200] bg-black text-white flex flex-col animate-slideInLeft select-none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
              <span className="font-bold text-base text-white">Your rental details</span>
              <button onClick={() => setMobilePanel(null)} className="text-neutral-400 hover:text-white font-bold text-lg p-1">✕</button>
            </div>
            <div className="flex-grow overflow-y-auto px-5 py-6 space-y-4">
              
              {/* Rental Dates Capsule */}
              <div 
                onClick={() => {
                  setShowCalendarPopup(!showCalendarPopup);
                  setShowTimePopup(false);
                }}
                className="flex items-center justify-between bg-[#F4F5F6] rounded-[16px] px-6 py-3.5 cursor-pointer hover:bg-[#EBECEC] transition-colors animate-fadeIn"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-normal text-neutral-400 mb-0.5">Rental dates</span>
                  <span className="text-[16px] font-bold text-neutral-800">
                    {pickupDate && returnDate ? `${pickupDate} - ${returnDate}` : 'Select dates'}
                  </span>
                </div>
                <svg className="w-6 h-6 text-[#C5A059] stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>

              {/* Inline 12-Month Scrollable Calendar Dropdown */}
              {showCalendarPopup && (
                <div className="w-full bg-[#F4F5F6] rounded-[24px] px-6 py-5 border border-neutral-200/50 shadow-md animate-fadeIn">
                  <div 
                    data-lenis-prevent
                    className="grid grid-cols-1 gap-8 max-h-[300px] overflow-y-auto premium-scrollbar"
                  >
                    {Array.from({length: 12}, (_, i) => i).map(offset => {
                      const { firstDay, daysInMonth, monthName } = getMonthData(2026, 6 + calendarOffset + offset);
                      
                      return (
                        <div key={offset} className="flex-1 text-neutral-900">
                          <p className="text-center font-bold text-[14px] text-neutral-500 uppercase tracking-widest mb-4">
                            {monthName}
                          </p>
                          
                          {/* Days of week */}
                          <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold text-neutral-400 mb-2">
                            <span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span><span>SU</span>
                          </div>
                          
                          {/* Month Days */}
                          <div className="grid grid-cols-7 gap-y-2 text-center">
                            {Array.from({length: firstDay}).map((_, i) => (
                              <div key={`empty-${offset}-${i}`}></div>
                            ))}
                            {Array.from({length: daysInMonth}, (_, i) => i + 1).map(date => {
                              const monthPrefix = getMonthData(2026, 6 + calendarOffset + offset).monthName.split(' ')[0].substring(0, 3);
                              const dateStr = `${monthPrefix} ${date}`;
                              
                              const startDate = parseDateStr(pickupDate);
                              const endDate = parseDateStr(returnDate);
                              const cellDate = new Date(2026, 6 + calendarOffset + offset, date);
                              const isStart = isSameDay(cellDate, startDate);
                              const isEnd = isSameDay(cellDate, endDate);
                              const inRange = startDate && endDate && cellDate > startDate && cellDate < endDate;

                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const isPast = cellDate < today;

                              let dayClass = "text-[14px] font-semibold w-[32px] h-[32px] mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors ";
                              if (isPast) {
                                dayClass += "text-neutral-300 cursor-not-allowed pointer-events-none";
                              } else if (isStart || isEnd) {
                                dayClass += "bg-black text-white font-bold";
                              } else if (inRange) {
                                dayClass += "bg-neutral-200 text-neutral-900 rounded-lg";
                              } else {
                                dayClass += "text-neutral-800 hover:bg-neutral-200/50";
                              }

                              return (
                                <div 
                                  key={date} 
                                  onClick={() => {
                                    if (isPast) return;
                                    if (!pickupDate || (pickupDate && returnDate)) {
                                      setPickupDate(dateStr);
                                      setReturnDate('');
                                    } else {
                                      setReturnDate(dateStr);
                                      setShowCalendarPopup(false);
                                    }
                                  }}
                                  className={dayClass}
                                >
                                  {date}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Time Selectors Capsule */}
              <div 
                className="flex items-center bg-[#F4F5F6] rounded-[16px] relative h-[62px]"
              >
                {/* Pick up time */}
                <div 
                  onClick={() => setMobilePanel('time-pickup')}
                  className="flex flex-col justify-center px-6 py-2.5 flex-1 cursor-pointer hover:bg-[#EBECEC] rounded-l-[16px] transition-colors h-full text-left"
                >
                  <span className="text-[13px] font-normal text-neutral-400 mb-0.5">Pick up time</span>
                  <span className="text-[16px] font-bold text-neutral-800">{pickupTime}</span>
                </div>
                
                {/* Divider */}
                <div className="w-[1px] h-[36px] bg-neutral-200"></div>
                
                {/* Drop-off time */}
                <div 
                  onClick={() => setMobilePanel('time-return')}
                  className="flex flex-col justify-center px-6 py-2.5 flex-1 cursor-pointer hover:bg-[#EBECEC] rounded-r-[16px] transition-colors h-full text-left"
                >
                  <span className="text-[13px] font-normal text-neutral-400 mb-0.5">Drop-off time</span>
                  <span className="text-[16px] font-bold text-neutral-800">{returnTime}</span>
                </div>
              </div>

              {/* Show Cars Button */}
              <div className="pt-4 flex flex-col items-center">
                <button 
                  type="button" 
                  onClick={() => { 
                    onSearch({ 
                      pickupLocation, 
                      returnLocation: isDifferentReturn ? returnLocation : pickupLocation, 
                      pickupDate, 
                      pickupTime, 
                      returnDate, 
                      returnTime, 
                      driverAge 
                    }); 
                    setMobilePanel(null); 
                  }}
                  className="w-full bg-[#C5A059] hover:bg-[#B28F4B] text-white font-bold text-[16px] uppercase h-[52px] rounded-[16px] shadow-lg tracking-wider"
                >
                  Show cars
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── PANEL 3: Calendar (full-screen stacked months) ── */}
        {mobilePanel === 'calendar' && (
          <div data-lenis-prevent className="md:hidden fixed inset-0 z-[300] bg-white flex flex-col animate-slideInLeft">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <button onClick={() => setMobilePanel('details')} className="text-neutral-700 p-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </button>
              <span className="font-black text-base text-neutral-900">Trip dates</span>
              <button onClick={() => { setPickupDate(''); setReturnDate(''); }} className="text-xs font-black text-neutral-500 uppercase tracking-wide">✕ Clear</button>
            </div>
            <div className="flex-grow overflow-y-auto px-5 py-6 space-y-10">
              {renderMonth('June 2026', juneDays, 0)}
              {renderMonth('July 2026', julyDays, 30)}
              {renderMonth('August 2026', augustDays, 61)}
            </div>
            <div className="px-5 py-4 border-t border-neutral-100 bg-white">
              <button type="button" onClick={() => { if (pickupDate && returnDate) setMobilePanel('details'); }}
                disabled={!pickupDate || !returnDate}
                className="w-full bg-[#C5A059] disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-condensed font-black text-sm uppercase h-[52px] rounded-xl shadow tracking-wider transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── PANEL 4a: Time Picker – Pickup ── */}
        {mobilePanel === 'time-pickup' && (
          <div data-lenis-prevent className="md:hidden fixed inset-0 z-[300] bg-white flex flex-col animate-slideInLeft">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <button onClick={() => setMobilePanel('details')} className="text-neutral-700 p-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </button>
              <span className="font-black text-base text-neutral-900">Select pickup time</span>
              <div className="w-8" />
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 border-2 border-[#C5A059] bg-[#FDF8EF] rounded-xl h-[44px] px-3">
                <svg className="w-4 h-4 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <span className="text-xs font-bold text-neutral-900">{pickupDate || '—'}</span>
              </div>
              <div className="flex items-center gap-2 border-2 border-neutral-200 bg-neutral-50 rounded-xl h-[44px] px-3">
                <svg className="w-4 h-4 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <span className="text-xs font-bold text-neutral-900">{returnDate || '—'}</span>
              </div>
            </div>
            <p className="px-5 text-[11px] text-neutral-400 font-semibold mb-1">⏱ Opening Times: {stationsData[pickupLocation]?.hours || '05:00 AM - 11:59 PM'}</p>
            <div className="flex-grow overflow-y-auto px-5 pb-8">
              <TimePickerPopup activeTimeField="pickup" currentTime={pickupTime} selectTime={(slot) => { setPickupTime(slot); setMobilePanel('details'); }} />
            </div>
            <div className="px-5 py-4 border-t border-neutral-100 bg-white">
              <button type="button" onClick={() => setMobilePanel('details')}
                className="w-full bg-[#C5A059] text-white font-condensed font-black text-sm uppercase h-[52px] rounded-xl shadow tracking-wider">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── PANEL 4b: Time Picker – Return ── */}
        {mobilePanel === 'time-return' && (
          <div data-lenis-prevent className="md:hidden fixed inset-0 z-[300] bg-white flex flex-col animate-slideInLeft">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <button onClick={() => setMobilePanel('details')} className="text-neutral-700 p-1">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </button>
              <span className="font-black text-base text-neutral-900">Select return time</span>
              <div className="w-8" />
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 border-2 border-neutral-200 bg-neutral-50 rounded-xl h-[44px] px-3">
                <svg className="w-4 h-4 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <span className="text-xs font-bold text-neutral-900">{pickupDate || '—'}</span>
              </div>
              <div className="flex items-center gap-2 border-2 border-[#C5A059] bg-[#FDF8EF] rounded-xl h-[44px] px-3">
                <svg className="w-4 h-4 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <span className="text-xs font-bold text-neutral-900">{returnDate || '—'}</span>
              </div>
            </div>
            <p className="px-5 text-[11px] text-neutral-400 font-semibold mb-1">⏱ Opening Times: {stationsData[pickupLocation]?.hours || '05:00 AM - 11:59 PM'}</p>
            <div className="flex-grow overflow-y-auto px-5 pb-8">
              <TimePickerPopup activeTimeField="return" currentTime={returnTime} selectTime={(slot) => { setReturnTime(slot); setMobilePanel('details'); }} />
            </div>
            <div className="px-5 py-4 border-t border-neutral-100 bg-white">
              <button type="button" onClick={() => setMobilePanel('details')}
                className="w-full bg-[#C5A059] text-white font-condensed font-black text-sm uppercase h-[52px] rounded-xl shadow tracking-wider">
                Continue
              </button>
            </div>
          </div>
        )}




      </section>

      {!isDropdownMode && (
        <>
          {/* Section 1.5: Scroll-linked Driving Animation */}
          <div
            ref={scrollAnimationRef}
            id="car-animation-section"
            className="w-full h-[200vh] bg-transparent relative z-10 block"
          >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black">
              {/* Subtle background text */}
              <h2 className="absolute top-[20%] text-[#141414] font-condensed font-normal text-[13vw] md:text-[9vw] leading-[0.9] md:whitespace-nowrap select-none pointer-events-none w-full text-center">
                DRIVE EXCELLENCE
              </h2>

              {/* Car Container that drives across */}
              <div
                className="car-container-animate absolute z-20 flex items-center justify-center drop-shadow-2xl pointer-events-none"
              >
                <div className="relative w-[800px] h-[436px] origin-center scale-[0.34] sm:scale-[0.55] md:scale-[0.85] transition-transform duration-300">
                  {/* Main Car Body */}
                  <img
                    src="/assets/cars/rr_body.png"
                    alt="Rolls Royce"
                    className="absolute inset-0 w-full h-full object-contain z-30 origin-center"
                    style={{ 
                      // Custom mask if needed, but no mixBlendMode screen to ensure visibility
                      WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 82%), linear-gradient(to right, transparent 2%, black 7%, black 93%, transparent 98%)',
                      maskImage: 'linear-gradient(to bottom, black 70%, transparent 82%), linear-gradient(to right, transparent 2%, black 7%, black 93%, transparent 98%)',
                      WebkitMaskComposite: 'intersect',
                      maskComposite: 'intersect'
                    }}
                  />

                  {/* Front Wheel Overlay */}
                  <img
                    src="/assets/cars/rr_wheel.png"
                    alt="Front Wheel"
                    className="car-wheel-front absolute z-40"
                    style={{
                      width: '125px',
                      height: '125px',
                      left: '109px',
                      top: '240px',
                      borderRadius: '50%'
                    }}
                  />

                  {/* Rear Wheel Overlay */}
                  <img
                    src="/assets/cars/rr_wheel.png"
                    alt="Rear Wheel"
                    className="car-wheel-rear absolute z-40"
                    style={{
                      width: '125px',
                      height: '125px',
                      left: '570px',
                      top: '240px',
                      borderRadius: '50%'
                    }}
                  />
                </div>
              </div>

              <div className="car-text-animate absolute bottom-[20%] text-center z-10 pointer-events-none" style={{ opacity: 0 }}>
                <p className="text-[#C5A059] font-bold tracking-widest text-[11px] uppercase mb-2">Uncompromising Performance</p>
                <h3 className="text-white text-3xl font-normal font-condensed">The journey begins here.</h3>
              </div>
              {/* Sparkle icon removed */}
            </div>
          </div>

          {/* Section 1: Image Banner */}
          <div className="w-full bg-transparent py-12 md:py-24 relative z-10">
            <RevealOnScroll className="w-full md:w-[90%] mx-auto relative rounded-[24px] md:rounded-[32px] overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center bg-neutral-900 shadow-2xl">
              <img src="/assets/premium_interior.png" className="absolute inset-0 w-full h-full object-cover" alt="Luxury car interior" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10 px-8 md:px-16 lg:px-20 w-full text-left">
                <AnimatedBannerText />
                <button
                  type="button"
                  onClick={handleScrollToListings}
                  className="bg-white text-black hover:bg-neutral-200 px-7 py-3 md:px-8 md:py-3.5 font-sans font-semibold text-[14px] md:text-[15px] rounded-full transition-all duration-300 shadow-lg"
                >
                  Rent Now
                </button>
              </div>
            </RevealOnScroll>
          </div>

          {/* Section 1.5: Infinite Logo Marquee */}
          <div className="w-full bg-[#070707] py-12 relative overflow-hidden flex items-center">
            {/* Gradient Fades for smooth entry/exit */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070707] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070707] to-transparent z-10 pointer-events-none"></div>
            
            <div className="w-max flex animate-marquee cursor-default">
              {/* First Set of Logos */}
              <div className="flex space-x-20 px-10 items-center justify-center">
                {MARQUEE_BRANDS.map((brand, i) => (
                  <div key={`brand-1-${i}`} className="w-16 h-12 md:w-24 md:h-16 flex items-center justify-center transition-transform duration-500 hover:scale-110 cursor-pointer">
                    <img 
                      src={`/assets/logos/${brand.file}`} 
                      alt={brand.name} 
                      className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-all duration-500 drop-shadow-[0_8px_16px_rgba(0,0,0,1)]" 
                    />
                  </div>
                ))}
              </div>
              {/* Second Set of Logos (for seamless looping) */}
              <div className="flex space-x-20 px-10 items-center justify-center">
                {MARQUEE_BRANDS.map((brand, i) => (
                  <div key={`brand-2-${i}`} className="w-16 h-12 md:w-24 md:h-16 flex items-center justify-center transition-transform duration-500 hover:scale-110 cursor-pointer">
                    <img 
                      src={`/assets/logos/${brand.file}`} 
                      alt={brand.name} 
                      className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-all duration-500 drop-shadow-[0_8px_16px_rgba(0,0,0,1)]" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* Section 4: Browse Popular Types Carousel */}
          <PopularTypesCarousel onScrollToListings={handleScrollToListings} />

          {/* Section 4.5: Why W Luxury? */}
          <div id="why-w-luxury" className="w-full bg-[#f4f4f4] text-neutral-900 py-14 px-4 md:px-0 relative z-10 border-t border-neutral-100 overflow-hidden">
            <RevealOnScroll className="w-full md:w-[90%] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 text-left">
              {/* Left Column */}
              <div className="w-full lg:w-[26%] xl:w-[24%] flex-shrink-0 flex flex-col justify-center">
                <h2 className="font-sans font-normal text-4xl md:text-[48px] lg:text-[56px] text-[#191919] uppercase leading-[0.9] tracking-tight mb-5">
                  Why <br /> <span className="whitespace-nowrap"><span className="text-[#C5A059]">W</span> Luxury</span>
                </h2>
                <p className="text-[#191919]/80 text-[13px] leading-[1.6] font-normal pr-2">
                  &quot;Where motion becomes an art form.&quot;
                  <br /><br />
                  Experience our hand-selected fleet of premium marques, curated and maintained to absolute perfection. Reserve through an intuitive online concierge and have your vehicle white-glove delivered to your residence with absolute discretion and ultimate convenience.
                </p>
              </div>

              {/* Right Column (Cards) */}
              <div className="flex-grow flex flex-col md:flex-row gap-6">
                {/* Tall Card (Door-to-Door) */}
                <div className="flex-grow rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 min-h-[240px]">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/assets/door_to_door_delivery.png" 
                      alt="Door-to-Door Delivery" 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90"></div>
                  </div>

                  {/* Top Text Content */}
                  <div className="relative z-10 mt-2">
                    <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-3 leading-[1.2] tracking-wide uppercase">White-Glove Delivery & Collection</h3>
                    <p className="text-white/70 text-[14px] leading-[1.4] max-w-[90%] font-light">
                      Our concierge discreetly delivers your vehicle directly to your residence and retrieves it at your convenience, ensuring a perfectly seamless experience from start to finish.
                    </p>
                  </div>

                  {/* Bottom Link */}
                  <div className="relative z-10 mt-auto pb-2">
                    <a href="#" className="inline-flex items-center text-[#C5A059] hover:text-[#d4b472] font-semibold text-[18px] transition-colors">
                      Learn More <ArrowRight className="w-5 h-5 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Two Small Cards Stacked */}
                <div className="w-full md:w-[48%] lg:w-[340px] xl:w-[360px] flex-shrink-0 flex flex-col gap-4">
                  {/* Top Small Card */}
                  <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow border border-neutral-200/60 min-h-[110px]">
                    <div className="relative z-10 w-[80%]">
                      <h3 className="text-[18px] md:text-[20px] font-bold text-[#191919] mb-2 leading-[1.2] uppercase tracking-wide">Transparent Fuel & Toll Management </h3>
                      <p className="text-[#191919]/70 text-[13px] leading-[1.5]">
                        Focus on your drive. We handle all tolls during your journey and gracefully refuel the marque upon its return, managed transparently at standard market rates.
                      </p>
                    </div>
                    <div className="relative z-10 mt-4">
                      <a href="#" className="inline-flex items-center text-[#C5A059] hover:text-[#a88647] font-bold text-[15px] transition-colors">
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="absolute right-[-10px] bottom-[-10px] w-[140px] h-[140px] pointer-events-none z-0">
                      <img 
                        src="/assets/fuel_nozzle.png" 
                        alt="Fuel Nozzle" 
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
                    </div>
                  </div>

                  {/* Bottom Small Card */}
                  <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow border border-neutral-200/60 min-h-[110px]">
                    <div className="relative z-10">
                      <h3 className="text-[18px] md:text-[20px] font-bold text-[#191919] mb-2 leading-[1.2] uppercase tracking-wide">THE ULTIMATE GARAGE</h3>
                      <p className="text-[#191919]/70 text-[13px] leading-[1.5] max-w-[90%]">
                        An elite assembly of the world's most coveted marques—from Range Rover and Maybach to Rolls-Royce—tailored entirely to your distinction.
                      </p>
                    </div>
                    <div className="relative z-10 mt-4">
                      <a href="#" className="inline-flex items-center text-[#C5A059] hover:text-[#a88647] font-bold text-[15px] transition-colors">
                        Choose a Car <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Section 5: W LUXURY CAR RENTAL WORLDWIDE Carousel */}
          {/* <BoutiqueCarousel /> */}

          {/* Section 6: WHERE WOULD YOU LIKE TO START FROM? */}
          <div className="w-full bg-[#f4f4f4] text-neutral-900 py-16 md:py-24 px-4 md:px-0 relative z-10 border-t border-neutral-200">
            <div className="w-full md:w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 text-left items-start">
              {/* Left column */}
              <div className="lg:col-span-5">
                <h2 className="font-sans font-normal text-4xl md:text-[52px] lg:text-[60px] text-[#191919] uppercase leading-[0.95] tracking-tight">
                  WHERE WOULD YOU LIKE TO START FROM?
                </h2>
              </div>

              {/* Right column */}
              <div className="lg:col-span-7 bg-white rounded-[32px] p-6 md:p-10 shadow-sm">
                {/* Tab Pills list */}
                <div className="flex flex-wrap gap-2 pb-6">
                  {['NYC Boroughs', 'Airport Hubs'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveRegionTab(tab)}
                      className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${activeRegionTab === tab
                          ? 'bg-[#191919] text-white'
                          : 'bg-[#f4f4f4] text-[#191919] hover:bg-[#e5e5e5]'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Listed Locations */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-4 text-[13px] font-bold text-[#191919]">
                  {regionCountries[activeRegionTab]?.map((country) => (
                    <div
                      key={country}
                      onClick={() => handleDestinationClick(country)}
                      className="hover:text-[#C5A059] cursor-pointer transition-colors truncate pr-2"
                      title={country}
                    >
                      {country}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: SERVICE COVERAGE AREA (NYC & NORTHERN NJ) */}
          <div id="service-area-section" className="w-full bg-white text-neutral-900 py-16 md:py-24 px-4 md:px-0 relative z-10 border-t border-neutral-100">
            <div className="w-full md:w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Side Content Column */}
              <div className="lg:col-span-5 text-left flex flex-col justify-center">
                <h3 className="text-xl md:text-3xl lg:text-[35px] font-bold text-[#C5A059] uppercase tracking-widest mb-3 leading-tight">
                  Our Service Coverage
                </h3>
                
                <h2 className="font-sans font-normal text-xl md:text-2xl lg:text-[26px] text-[#191919] tracking-tight uppercase leading-[1.2] mb-6">
                  Serving New York City &amp; Northern New Jersey
                </h2>
                
                <p className="text-[14px] md:text-[15px] text-neutral-500 font-sans leading-relaxed mb-0">
                  Skip the rental counter. Elevate your journey with our bespoke door-to-door delivery service, covering the five boroughs of NYC and all major surrounding airports. Our dedicated concierge team seamlessly delivers your vehicle directly to your private FBO, hotel, office, or residence for ultimate convenience.
                </p>
              </div>

              {/* Right Side Interactive Map Column — height matches left content */}
              <div className="lg:col-span-7 w-full h-full min-h-[320px] md:min-h-[360px]">
                <ServiceAreaMap 
                  activeLocation={activeServiceLocation}
                  onSelectLocation={setActiveServiceLocation}
                />
              </div>
            </div>
          </div>

          {/* Section 8: GOOD TO KNOW WHEN RENTING WITH W Accordion */}
          {(() => {
            const wFaqs = [
              { q: "How can I pick up a rental car?", a: "We offer door-to-door delivery and pickup. Simply select your location and our concierge will bring the vehicle directly to you." },
              { q: "Where can I rent a car with W Luxury?", a: "W Luxury is available in major cities worldwide, including New York, Miami, Los Angeles, and across Europe." },
              { q: "What types of cars can I rent with W Luxury?", a: "Our exclusive fleet features the latest models from top brands including Range Rover, Porsche, BMW, Mercedes, Jaguar, and Maserati." },
              { q: "What makes your fleet special?", a: "Every vehicle in our fleet is brand new, meticulously maintained, and fully loaded with premium options and features." },
              { q: "On what terms can I rent a luxury car?", a: "You need to be 25 or older, hold a valid driver's license, and provide a major credit card for the security deposit." },
              { q: "What happens if I need to cancel my car reservation?", a: "We offer flexible cancellation policies. Reservations can typically be canceled up to 48 hours in advance for a full refund." },
              { q: "Why should I rent in New York with W Luxury?", a: "Navigating New York is better in comfort. We skip the rental counter lines and bring the luxury directly to your hotel or residence." },
              { q: "What do I need to rent a car with W Luxury?", a: "A valid driver's license, proof of insurance, and a major credit card in the renter's name." },
              { q: "Can I rent a car for a month or longer with W Luxury?", a: "Yes, we offer flexible long-term rentals and subscriptions for month-to-month flexibility without long-term commitments." },
              { q: "Is insurance included with W Luxury rentals?", a: "All W Luxury vehicles come with comprehensive insurance coverage. Additional coverage options are available at checkout for full peace of mind." }
            ];

            return (
              <div id="faq-section" className="w-full bg-white text-neutral-900 py-20 px-4 md:px-0 relative z-10 border-t border-neutral-100 overflow-hidden">
                <RevealOnScroll className="w-full md:w-[90%] mx-auto text-center">
                  <h2
                    style={{ lineHeight: "1.2" }}
                    className="font-sans font-normal text-3xl md:text-4xl lg:text-[48px] xl:text-[56px] text-[#191919] tracking-tight uppercase text-center mb-16"
                  >
                    GOOD TO KNOW WHEN RENTING <span className="inline-block whitespace-nowrap">WITH <span className="text-[#C5A059]">W</span></span>
                  </h2>

                  <div className="text-left w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4 md:gap-5">
                      {wFaqs.slice(0, 5).map((faq, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                          className="bg-[#f4f4f4] rounded-2xl py-5 px-6 flex flex-col cursor-pointer transition-all duration-200 group hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className={`font-normal text-[15px] md:text-[16px] transition-colors ${activeFaqIndex === idx ? 'text-[#C5A059]' : 'text-[#191919] group-hover:text-[#C5A059]'} select-none`}>
                              {faq.q}
                            </span>
                            <span className="text-[#C5A059] font-light text-2xl flex-shrink-0 leading-none">
                              {activeFaqIndex === idx ? '−' : '+'}
                            </span>
                          </div>
                          {activeFaqIndex === idx && (
                            <p className="text-[14px] text-[#191919]/80 font-light leading-[1.6] mt-4 animate-fadeIn">
                              {faq.a}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4 md:gap-5">
                      {wFaqs.slice(5).map((faq, index) => {
                        const idx = index + 5;
                        return (
                          <div
                            key={idx}
                            onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                            className="bg-[#f4f4f4] rounded-2xl py-5 px-6 flex flex-col cursor-pointer transition-all duration-200 group hover:shadow-lg"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <span className={`font-normal text-[15px] md:text-[16px] transition-colors ${activeFaqIndex === idx ? 'text-[#C5A059]' : 'text-[#191919] group-hover:text-[#C5A059]'} select-none`}>
                                {faq.q}
                              </span>
                              <span className="text-[#C5A059] font-light text-2xl flex-shrink-0 leading-none">
                                {activeFaqIndex === idx ? '−' : '+'}
                              </span>
                            </div>
                            {activeFaqIndex === idx && (
                              <p className="text-[14px] text-[#191919]/80 font-light leading-[1.6] mt-4 animate-fadeIn">
                                {faq.a}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            );
          })()}

          {/* Section 9: Instagram */}
          <div id="instagram-section" className="w-full bg-white text-neutral-900 pt-10 pb-8 px-4 md:px-0 relative z-10 border-t border-[#e5e5e5]">
            <div className="w-full md:w-[90%] mx-auto overflow-hidden">
              <RevealOnScroll className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12">
                {/* Text Side */}
                <div className="w-full md:w-[28%] flex-shrink-0 text-left pr-6 md:pr-0 flex items-center">
                  <h2 className="font-sans font-bold text-3xl md:text-[36px] lg:text-[44px] text-neutral-500 leading-[1.2] tracking-tight">
                    Follow us <br className="hidden md:block" /> on Instagram <br />
                    <span className="mt-4 block font-bold text-[#191919]">@W.Luxury</span>
                  </h2>
                </div>
                
                {/* Live Instagram Feed / Fallback Static Images */}
                <div className="w-full md:w-[72%] flex gap-3 overflow-x-auto no-scrollbar pb-4 pr-6 pl-0 md:pl-4">
                  {Array.from({ length: 36 }, (_, i) => `/assets/catalog/catalog_page_${i + 2}.png`).map((img, idx) => (
                    <div key={idx} className="flex-shrink-0 w-[320px] h-[215px] rounded-[16px] overflow-hidden shadow-md relative group cursor-pointer bg-neutral-100">
                      <img
                        src={img}
                        alt="Catalog Photo"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-neutral-100"
                      />
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="w-full bg-[#1a1a1a] py-14 px-4 md:px-0 relative z-10 text-left">
            <div className="w-full md:w-[90%] mx-auto">
              {/* Logo */}
              <div className="mb-10">
                <span className="font-sans font-light text-white tracking-[0.35em] text-sm uppercase select-none">
                  W &nbsp; L U X U R Y &nbsp; C A R  &nbsp;  R E N T A L  
                </span>
              </div>

              {/* 4 columns justified across 90% screen width */}
              <div className="flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-between items-start gap-8 pb-10 w-full">
                {/* Column 1 - Services & Links */}
                <div className="flex flex-col gap-3.5 text-left">
                  {[
                    { label: 'FAQ', highlight: false },
                    { label: 'CONTACT US', highlight: false },
                    { label: 'TERMS & CONDITIONS', highlight: false },
                    { label: 'PRIVACY POLICY', highlight: false },
                  ].map(({ label, highlight }) => (
                    <a
                      key={label}
                      href={
                        label === 'CONTACT US' ? '#instagram-section' :
                        label === 'FAQ' ? '#faq-section' : '#'
                      }
                      onClick={(e) => {
                        if (label === 'CONTACT US') {
                          e.preventDefault();
                          document.getElementById('instagram-section')?.scrollIntoView({ behavior: 'smooth' });
                        } else if (label === 'FAQ') {
                          e.preventDefault();
                          document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`text-[11px] font-semibold tracking-wider uppercase transition-colors ${highlight ? 'text-[#C5A059] hover:text-[#d4b472]' : 'text-neutral-300 hover:text-white'}`}
                    >
                      {label}
                    </a>
                  ))}
                </div>

                {/* Column 3 – Contact & Socials */}
                <div className="flex flex-col gap-4 text-left">
                  <a href="mailto:HELLO@WLUXURYRENTAL.COM" className="text-[11px] font-semibold tracking-wider uppercase text-neutral-300 hover:text-white transition-colors">
                    HELLO@WLUXURYRENTAL.COM
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
              <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[9px] font-medium tracking-widest uppercase text-neutral-500">
                  © 2026 W LUXURY CAR RENTAL. ALL RIGHTS RESERVED.
                </p>
                <a
                  href="http://zumbyte.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[9px] font-medium tracking-widest uppercase text-neutral-500 hover:text-white transition-colors group"
                >
                  <span>Site by</span>
                  <span className="font-bold group-hover:text-[#C5A059] transition-colors">Zumbyte</span>
                  <img
                    src="/assets/logos/zumbyte.png"
                    alt="Zumbyte Logo"
                    className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </a>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
