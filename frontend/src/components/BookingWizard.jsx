import React, { useState, useEffect } from 'react';
import { Shield, Car, Check, Calendar, MapPin, X, ArrowRight, User, Phone, Mail, FileText, Gift, Info, ShieldCheck, Zap, Fuel, CreditCard, ChevronDown, ChevronUp, Lock, ArrowLeft, Wrench, Baby, Cpu, Sliders, Globe } from 'lucide-react';
import PriceDetailsModal from './PriceDetailsModal';

// Helper function to extract list of dates between range inclusive
function getDatesInRange(startDateStr, endDateStr) {
  const dates = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const curr = new Date(start);
  while (curr <= end) {
    const year = curr.getFullYear();
    const month = String(curr.getMonth() + 1).padStart(2, '0');
    const day = String(curr.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

export default function BookingWizard({ car, searchParams, onClose, onSubmitSuccess, initialStep = 1, initialBookingOption = 'bestPrice', initialMileage = 'included' }) {
  const [step, setStep] = useState(initialStep);
  const [bookingOption, setBookingOption] = useState(initialBookingOption); // bestPrice, stayFlexible
  const [mileage, setMileage] = useState(initialMileage); // included, unlimited
  const [protection, setProtection] = useState('none'); // none, basic, smart, allInclusive
  const [addons, setAddons] = useState({
    additionalDriver: false,
    refuelling: false,
    crossBorder: false,
    mobilityService: false,
    tireWindshield: false,
    interiorProtection: false,
    boosterSeat: false,
    priorityService: false,
    dieselEngine: false,
    comfortFeatures: false
  });

  // Intake Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    driverAge: searchParams.driverAge === '30+' ? '30' : (searchParams.driverAge || '25'),
    specialRequests: ''
  });

  // Access key configuration
  const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY_HERE";

  // Statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPriceDetailsModalOpen, setIsPriceDetailsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  // Price calculations
  const [days, setDays] = useState(2);
  
  useEffect(() => {
    if (searchParams.pickupDate && searchParams.returnDate) {
      const start = new Date(searchParams.pickupDate);
      const end = new Date(searchParams.returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setDays(diffDays);
    }
  }, [searchParams]);

  // Check if dates are locked/reserved
  const isDateUnavailable = () => {
    if (!car.unavailableDates || car.unavailableDates.length === 0) return false;
    const dates = getDatesInRange(searchParams.pickupDate, searchParams.returnDate);
    return dates.some(date => car.unavailableDates.includes(date));
  };

  const datesConflict = isDateUnavailable();

  // Rates
  const stayFlexibleRate = 28.34;
  const unlimitedMileageRate = 8.80;
  const basicProtectionRate = 18.93;
  const smartProtectionRate = 24.00;
  const allInclusiveRate = 41.87;
  
  // Add-ons Rates
  const additionalDriverRate = 13.04; // per day
  const refuellingRate = 31.74; // one-time
  const crossBorderRate = 16.98; // one-time
  const mobilityServiceRate = 10.19; // per day
  const tireWindshieldRate = 9.96; // per day
  const interiorProtectionRate = 5.66; // per day
  const boosterSeatRate = 15.31; // per day
  const priorityServiceRate = 39.68; // one-time
  const dieselEngineRate = 9.06; // per day
  const comfortFeaturesRate = 6.79; // per day

  // Calculate current totals
  const getTotals = () => {
    let dailyRate = car.baseRate + 0.84;
    let extraCosts = 0;

    if (bookingOption === 'stayFlexible') dailyRate += stayFlexibleRate;
    if (mileage === 'unlimited') dailyRate += unlimitedMileageRate;

    if (protection === 'basic') dailyRate += basicProtectionRate;
    else if (protection === 'smart') dailyRate += smartProtectionRate;
    else if (protection === 'allInclusive') dailyRate += allInclusiveRate;

    // Daily add-ons
    if (addons.additionalDriver) dailyRate += additionalDriverRate;
    if (addons.mobilityService) dailyRate += mobilityServiceRate;
    if (addons.tireWindshield) dailyRate += tireWindshieldRate;
    if (addons.interiorProtection) dailyRate += interiorProtectionRate;
    if (addons.boosterSeat) dailyRate += boosterSeatRate;
    if (addons.dieselEngine) dailyRate += dieselEngineRate;
    if (addons.comfortFeatures) dailyRate += comfortFeaturesRate;

    // One-time add-ons
    if (addons.refuelling) extraCosts += refuellingRate;
    if (addons.crossBorder) extraCosts += crossBorderRate;
    if (addons.priorityService) extraCosts += priorityServiceRate;

    const total = (dailyRate * days) + extraCosts;
    return {
      daily: dailyRate,
      total: total
    };
  };

  const totals = getTotals();

  const addOnList = [
    {
      key: 'additionalDriver',
      title: 'Additional driver',
      priceText: `$${additionalDriverRate.toFixed(2)} / day & driver`,
      icon: UserPlus,
    },
    {
      key: 'refuelling',
      title: 'Refuelling/recharging service',
      priceText: `$${refuellingRate.toFixed(2)} / one-time`,
      icon: Fuel,
    },
    {
      key: 'crossBorder',
      title: 'Cross-border driving',
      priceText: `$${crossBorderRate.toFixed(2)} / one-time`,
      icon: Globe,
    },
    {
      key: 'mobilityService',
      title: 'Mobility service',
      priceText: `$${mobilityServiceRate.toFixed(2)} / day`,
      icon: Car,
    },
    {
      key: 'tireWindshield',
      title: 'Tire and Windshield Protection',
      priceText: `$${tireWindshieldRate.toFixed(2)} / day`,
      icon: Wrench,
    },
    {
      key: 'interiorProtection',
      title: 'Interior Protection',
      priceText: `$${interiorProtectionRate.toFixed(2)} / day`,
      icon: Shield,
    },
    {
      key: 'boosterSeat',
      title: 'Booster seat',
      priceText: `$${boosterSeatRate.toFixed(2)} / day`,
      icon: Baby,
    },
    {
      key: 'priorityService',
      title: 'Priority Service',
      priceText: `$${priorityServiceRate.toFixed(2)} / one-time`,
      icon: Zap,
    },
    {
      key: 'dieselEngine',
      title: 'Diesel engine',
      priceText: `$${dieselEngineRate.toFixed(2)} / day`,
      icon: Cpu,
    },
    {
      key: 'comfortFeatures',
      title: 'Comfort features',
      priceText: `$${comfortFeaturesRate.toFixed(2)} / day`,
      icon: Sliders,
    }
  ];

  const handleNextStep = () => {
    if (datesConflict) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationError('');

    if (datesConflict) {
      setValidationError('⚠️ Scheduling Conflict: This vehicle is already reserved for the selected dates. Please adjust dates or choose another vehicle.');
      setIsSubmitting(false);
      return;
    }

    // Serverless Email Notification integration (using Web3Forms free API endpoint)
    try {
      if (web3formsAccessKey && web3formsAccessKey !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: web3formsAccessKey,
            name: formData.fullName,
            email: formData.email,
            subject: `[W Luxury Car Rental] New Booking Request: ${car.name}`,
            message: `
              --- VEHICLE DETAIL ---
              Car Selected: ${car.name}
              Category: ${car.category}
              Daily Rate: $${car.baseRate.toFixed(2)}/day
              Estimated Total: $${totals.total.toFixed(2)}
              
              --- BOOKING INFORMATION ---
              Pickup Location: ${searchParams.pickupLocation}
              Rental Window: ${searchParams.pickupDate} (${searchParams.pickupTime}) to ${searchParams.returnDate} (${searchParams.returnTime})
              Duration: ${days} days
              
              --- OPTIONAL CONFIGURATION ---
              Flexibility Plan: ${bookingOption === 'stayFlexible' ? 'Stay Flexible (+ $28.34/day)' : 'Best Price (Included)'}
              Mileage: ${mileage === 'unlimited' ? 'Unlimited (+ $8.80/day)' : '600 km (Included)'}
              Protection Pack: ${protection === 'none' ? 'No protection (Included)' : protection}
              Addons Selected: ${[
                addons.additionalDriver ? 'Additional Driver' : '',
                addons.refuelling ? 'Refuelling/Recharging service' : '',
                addons.crossBorder ? 'Cross Border driving' : '',
                addons.mobilityService ? 'Mobility service' : '',
                addons.tireWindshield ? 'Tire and Windshield Protection' : '',
                addons.interiorProtection ? 'Interior Protection' : '',
                addons.boosterSeat ? 'Booster seat' : '',
                addons.priorityService ? 'Priority Service' : '',
                addons.dieselEngine ? 'Diesel engine' : '',
                addons.comfortFeatures ? 'Comfort features' : ''
              ].filter(Boolean).join(', ') || 'None'}

              --- CUSTOMER CONTACT INFO ---
              Customer Name: ${formData.fullName}
              Email: ${formData.email}
              Phone: ${formData.phone}
              Driver's Age: ${formData.driverAge}
              Special Requests: ${formData.specialRequests || 'None'}
            `
          })
        });
      } else {
        // Log locally if key is placeholder
        console.log("Mock Submit: Email service is visual-only because Web3Forms key is not configured.");
      }

      setSuccessMessage(`Reservation Request Submitted! A representative will contact you within 15 minutes to verify your details and complete your reservation.`);
    } catch (error) {
      console.error('Error sending email notification:', error);
      setValidationError('An error occurred while submitting your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step >= 2) {
    return (
      <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-neutral-50 text-neutral-900 flex flex-col select-none font-sans">
        
        {/* W Luxury Car Rental Header */}
        <div className="w-full bg-[#000000] border-b border-neutral-900 flex-shrink-0">
          <div className="w-full md:w-[90%] mx-auto px-4 md:px-0 py-3 flex items-center justify-between text-white font-semibold text-xs">
            {/* W Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/assets/logos/w_luxury_logo_clean_new.png"
                alt="W Luxury Logo"
                onClick={onClose}
                className="h-10 md:h-12 w-auto object-contain cursor-pointer active:scale-95 transition-transform duration-100 drop-shadow-md"
              />
            </div>

            {/* Right Header Navigation */}
            <div className="flex items-center gap-6 text-[11px] font-bold text-neutral-300">
              <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
                EN | $
              </button>
              <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Log in | Register
              </button>
            </div>
          </div>
        </div>

        {/* White Title & Action Subheader */}
        <div className="w-full bg-white px-6 py-4 flex items-center justify-between border-b border-neutral-200 shadow-sm sticky top-0 z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Back Chevron */}
            <button 
              onClick={() => {
                if (step === 2 && initialStep === 2) {
                  onClose();
                } else {
                  handlePrevStep();
                }
              }}
              className="text-neutral-800 hover:text-black p-1 transition-colors flex items-center justify-center rounded-full hover:bg-neutral-100"
              aria-label="Go back"
            >
              <svg className="w-6 h-6 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            
            <h2 className="font-condensed font-normal text-xl md:text-2xl text-neutral-900 tracking-wide uppercase">
              {step === 2 && "WHICH PROTECTION PACKAGE DO YOU NEED?"}
              {step === 3 && "WHICH ADD-ONS DO YOU NEED?"}
              {step === 4 && "COMPLETE RESERVATION INTAKE"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-baseline gap-1 text-sm font-bold text-neutral-500">
                <span>Total:</span>
                <span className="text-xl font-black text-neutral-900 leading-none">
                  ${totals.total.toFixed(2)}
                </span>
              </div>
              <button 
                onClick={() => setIsPriceDetailsModalOpen(true)}
                className="text-[11px] font-bold text-neutral-700 hover:text-black underline block tracking-wide uppercase text-right leading-none mt-1"
              >
                Price details
              </button>
            </div>

            {step === 4 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || datesConflict}
                className="bg-[#C5A059] hover:bg-[#B28F4B] disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-condensed font-black uppercase text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                disabled={datesConflict}
                className="bg-[#C5A059]/90 hover:bg-[#C5A059] disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-condensed font-black uppercase text-xs tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md flex items-center justify-center min-w-[120px]"
              >
                Continue
              </button>
            )}
          </div>
        </div>

        {/* Success Screen Center Overlay */}
        {successMessage ? (
          <div className="flex-grow flex items-center justify-center p-6 bg-neutral-50 animate-fadeIn">
            <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl p-8 text-center space-y-6 shadow-xl max-w-[500px] w-full border-t-4 border-t-[#C5A059]">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-full w-fit mx-auto">
                <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h5 className="font-condensed font-normal text-2xl uppercase tracking-wider text-neutral-900">Request Received</h5>
              <p className="text-sm font-semibold text-neutral-600 leading-relaxed">{successMessage}</p>
              
              <div className="border-t border-neutral-100 pt-6 text-left space-y-2.5 text-xs text-neutral-700">
                <div className="flex justify-between"><span className="text-neutral-400 font-bold">Vehicle:</span> <span className="font-bold text-neutral-900">{car.name}</span></div>
                <div className="flex justify-between"><span className="text-neutral-400 font-bold">Duration:</span> <span className="font-bold text-neutral-900">{days} Days</span></div>
                <div className="flex justify-between"><span className="text-neutral-400 font-bold">Estimated Quote:</span> <span className="font-black text-[#C5A059] font-condensed text-sm">${totals.total.toFixed(2)}</span></div>
              </div>

              <button 
                onClick={onSubmitSuccess}
                className="w-full bg-[#C5A059] hover:bg-[#B28F4B] text-white py-3.5 rounded-xl font-condensed font-black uppercase text-sm shadow-lg transition-all active:scale-95"
              >
                Return to Fleet
              </button>
            </div>
          </div>
        ) : (
          /* Main Form/Grid Content Area */
          <div className="flex-grow bg-neutral-50/50 py-8 px-6 overflow-y-auto">
            <div className="max-w-[1160px] w-full mx-auto space-y-6">
              
              {/* Validation Warning Alert */}
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-xs font-semibold flex gap-2.5 items-start">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span className="leading-relaxed">{validationError}</span>
                </div>
              )}

              {/* Step 2 & 3 Specific Banner */}
              {(step === 2 || step === 3) && (
                <div className="bg-neutral-100 border border-neutral-200/50 text-neutral-700 rounded-xl p-4 flex items-center gap-3 text-xs font-bold shadow-sm">
                  <div className="w-4 h-4 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] text-white font-bold leading-none">i</div>
                  <span>Drivers must have held their driver's license for at least 2 year(s) for this vehicle</span>
                </div>
              )}

              {/* STEP 2: Protection Packages Card Grid */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                  {/* Card 1: No extra protection */}
                  <div 
                    onClick={() => setProtection('none')}
                    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 hover:shadow-md relative ${
                      protection === 'none' ? 'border-neutral-900 border-2 shadow-sm' : 'border-neutral-200'
                    }`}
                  >
                    {/* Selected state radio circle */}
                    <div className="absolute top-5 right-5 w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0 bg-white">
                      {protection === 'none' && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900"></div>}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-condensed font-normal text-xl text-neutral-900 leading-snug uppercase">
                          No extra protection
                        </h3>
                        {/* Stars */}
                        <div className="flex gap-0.5 mt-1 text-neutral-300 text-xs">
                          <span>☆</span><span>☆</span><span>☆</span>
                        </div>
                      </div>

                      <p className="text-xs font-black text-red-600 leading-normal">
                        Deductible: up to full vehicle value
                      </p>

                      {/* Checklist items */}
                      <ul className="space-y-3 pt-2 text-[11px] font-semibold text-neutral-600">
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Collision damages, scratches, bumps & theft</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Tire, windshield & windows</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Interior damage (e.g. spills)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Roadside help for common mobility issues (e.g. loss of keys)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100">
                      <span className="font-condensed font-black text-lg text-neutral-900">Included</span>
                    </div>
                  </div>

                  {/* Card 2: Basic Protection */}
                  <div 
                    onClick={() => setProtection('basic')}
                    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 hover:shadow-md relative ${
                      protection === 'basic' ? 'border-neutral-900 border-2 shadow-sm' : 'border-neutral-200'
                    }`}
                  >
                    <div className="absolute top-5 right-5 w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0 bg-white">
                      {protection === 'basic' && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900"></div>}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-condensed font-normal text-xl text-neutral-900 leading-snug uppercase">
                          Basic Protection
                        </h3>
                        {/* Stars */}
                        <div className="flex gap-0.5 mt-1 text-neutral-900 text-xs">
                          <span>★</span><span className="text-neutral-300">☆</span><span className="text-neutral-300">☆</span>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-neutral-800 leading-normal">
                        Deductible: up to $1,814.40
                      </p>

                      {/* Checklist items */}
                      <ul className="space-y-3 pt-2 text-[11px] font-semibold text-neutral-600">
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Collision damages, scratches, bumps & theft</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Tire, windshield & windows</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Interior damage (e.g. spills)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Roadside help for common mobility issues (e.g. loss of keys)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100 flex items-baseline">
                      <span className="font-condensed font-black text-lg text-neutral-900">${basicProtectionRate.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-neutral-500 ml-1">/ day</span>
                    </div>
                  </div>

                  {/* Card 3: Smart Protection */}
                  <div 
                    onClick={() => setProtection('smart')}
                    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 hover:shadow-md relative ${
                      protection === 'smart' ? 'border-neutral-900 border-2 shadow-sm' : 'border-neutral-200'
                    }`}
                  >
                    <div className="absolute top-5 right-5 w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0 bg-white">
                      {protection === 'smart' && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900"></div>}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-condensed font-normal text-xl text-neutral-900 leading-snug uppercase">
                            Smart Protection
                          </h3>
                        </div>
                        {/* Stars */}
                        <div className="flex gap-0.5 mt-1 text-neutral-900 text-xs">
                          <span>★</span><span>★</span><span className="text-neutral-300">☆</span>
                        </div>
                        {/* Discount Badge */}
                        <span className="inline-block mt-2.5 text-[9px] font-black border border-[#C5A059] text-[#C5A059] px-2 py-0.5 rounded-full uppercase tracking-wide">
                          - 62% online discount
                        </span>
                      </div>

                      <p className="text-xs font-black text-emerald-600 leading-normal">
                        No deductible
                      </p>

                      {/* Checklist items */}
                      <ul className="space-y-3 pt-2 text-[11px] font-semibold text-neutral-600">
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Collision damages, scratches, bumps & theft</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Tire, windshield & windows</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Interior damage (e.g. spills)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            <span>Roadside help for common mobility issues (e.g. loss of keys)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100 flex items-baseline">
                      <span className="font-condensed font-black text-lg text-neutral-900">${smartProtectionRate.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-neutral-500 ml-1">/ day</span>
                      <span className="text-[10px] font-bold text-neutral-400 line-through ml-2">$63.14 / day</span>
                    </div>
                  </div>

                  {/* Card 4: All Inclusive Protection */}
                  <div 
                    onClick={() => setProtection('allInclusive')}
                    className={`bg-white rounded-2xl border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 hover:shadow-md relative ${
                      protection === 'allInclusive' ? 'border-neutral-900 border-2 shadow-sm' : 'border-neutral-200'
                    }`}
                  >
                    <div className="absolute top-5 right-5 w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0 bg-white">
                      {protection === 'allInclusive' && <div className="w-2.5 h-2.5 rounded-full bg-neutral-900"></div>}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-condensed font-normal text-xl text-neutral-900 leading-snug uppercase">
                            All Inclusive Protection
                          </h3>
                        </div>
                        {/* Stars */}
                        <div className="flex gap-0.5 mt-1 text-neutral-900 text-xs">
                          <span>★</span><span>★</span><span>★</span>
                        </div>
                        {/* Discount Badge */}
                        <span className="inline-block mt-2.5 text-[9px] font-black border border-[#C5A059] text-[#C5A059] px-2 py-0.5 rounded-full uppercase tracking-wide">
                          - 47% online discount
                        </span>
                      </div>

                      <p className="text-xs font-black text-emerald-600 leading-normal">
                        No deductible
                      </p>

                      {/* Checklist items */}
                      <ul className="space-y-3 pt-2 text-[11px] font-semibold text-neutral-600">
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Collision damages, scratches, bumps & theft</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Tire, windshield & windows</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Interior damage (e.g. spills)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                            <span>Roadside help for common mobility issues (e.g. loss of keys)</span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100 flex items-baseline">
                      <span className="font-condensed font-black text-lg text-neutral-900">${allInclusiveRate.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-neutral-500 ml-1">/ day</span>
                      <span className="text-[10px] font-bold text-neutral-400 line-through ml-2">$78.98 / day</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left animate-fadeIn">
                  {/* Left column: 10 add-on cards */}
                  <div className="lg:col-span-8 space-y-4">
                    {addOnList.map((addon) => {
                      const IconComponent = addon.icon;
                      const isActive = addons[addon.key];
                      return (
                        <div 
                          key={addon.key}
                          className="flex items-center justify-between p-5 border border-neutral-200 bg-white rounded-2xl hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-neutral-900 mt-0.5">
                              <IconComponent className="w-5 h-5 text-neutral-800 stroke-[2]" />
                            </div>
                            <div>
                              <span className="font-bold text-sm block text-neutral-900 leading-snug">
                                {addon.title}
                              </span>
                              <span className="text-xs text-neutral-500 font-medium block mt-0.5">
                                {addon.priceText}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button 
                              type="button" 
                              className="text-xs font-bold text-neutral-900 underline hover:text-[#C5A059] transition-colors"
                            >
                              Details
                            </button>

                            <button
                              type="button"
                              onClick={() => setAddons(prev => ({ ...prev, [addon.key]: !prev[addon.key] }))}
                              className={`w-12 h-6 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
                                isActive ? 'bg-[#C5A059]' : 'bg-neutral-200'
                              }`}
                            >
                              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                                isActive ? 'translate-x-6' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right column: Sidebar booking overview */}
                  <div className="lg:col-span-4">
                    <div className="bg-[#f8f8f8] border border-neutral-200 rounded-2xl p-6 space-y-5 text-left sticky top-24">
                      <h4 className="font-condensed font-normal text-lg uppercase tracking-wider text-neutral-900">
                        Your booking overview:
                      </h4>
                      
                      <div className="space-y-4 text-xs font-bold text-neutral-700">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">Third party insurance</span>
                          </div>
                          <Info className="w-4 h-4 text-neutral-400 flex-shrink-0 cursor-pointer hover:text-neutral-600" />
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">24/7 Breakdown assistance</span>
                          </div>
                          <Info className="w-4 h-4 text-neutral-400 flex-shrink-0 cursor-pointer hover:text-neutral-600" />
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">GPS and Android Auto / Apple CarPlay</span>
                          </div>
                          <Info className="w-4 h-4 text-neutral-400 flex-shrink-0 cursor-pointer hover:text-neutral-600" />
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            {mileage === 'unlimited' 
                              ? 'Unlimited kilometers included' 
                              : `600 km are included, each additional kilometer costs $1.55`}
                          </span>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            Booking option: {bookingOption === 'stayFlexible' ? 'Stay Flexible - Free cancellation/rebooking any time' : 'Best price - Free cancellation/rebooking within 24h'}
                          </span>
                        </div>

                        {/* Dynamic Protection Selection */}
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            Protection: {protection === 'none' ? 'No extra protection' : protection === 'basic' ? 'Basic Protection' : protection === 'smart' ? 'Smart Protection' : 'All Inclusive Protection'}
                          </span>
                        </div>

                        {/* Dynamic Add-ons List */}
                        {Object.keys(addons).some(k => addons[k]) && (
                          <div className="border-t border-neutral-200 pt-4 mt-4 space-y-3">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Added Extras:</span>
                            {addons.additionalDriver && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Additional Driver</span>
                              </div>
                            )}
                            {addons.refuelling && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Refuelling/Recharging service</span>
                              </div>
                            )}
                            {addons.crossBorder && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Cross-border driving</span>
                              </div>
                            )}
                            {addons.mobilityService && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Mobility service</span>
                              </div>
                            )}
                            {addons.tireWindshield && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Tire and Windshield Protection</span>
                              </div>
                            )}
                            {addons.interiorProtection && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Interior Protection</span>
                              </div>
                            )}
                            {addons.boosterSeat && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Booster seat</span>
                              </div>
                            )}
                            {addons.priorityService && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Priority Service</span>
                              </div>
                            )}
                            {addons.dieselEngine && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Diesel engine</span>
                              </div>
                            )}
                            {addons.comfortFeatures && (
                              <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3.5] flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">Comfort features</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Personal Details Intake Form */}
              {step === 4 && (
                <div className="max-w-[700px] mx-auto bg-white border border-neutral-200 rounded-2xl p-8 space-y-6 text-left animate-fadeIn">
                  <div>
                    <h4 className="font-condensed font-normal text-2xl uppercase text-neutral-900">Complete Reservation Intake</h4>
                    <p className="text-xs text-neutral-500 mt-1">Provide your details to submit your request.</p>
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="e.g. John Doe"
                          className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="e.g. john@example.com"
                          className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input 
                          type="text" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. +1 555-019-2834"
                          className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Driver's Age</label>
                        <input 
                          type="number" 
                          required
                          min={car.minAge}
                          value={formData.driverAge}
                          onChange={(e) => setFormData(prev => ({ ...prev, driverAge: e.target.value }))}
                          placeholder="Enter your age"
                          className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Optional Special Requests</label>
                      <textarea
                        rows={3}
                        value={formData.specialRequests}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder="e.g. child seats, winter tires, specific delivery location info, etc."
                        className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 outline-none transition-colors resize-none"
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* Your Booking Overview Section (Steps 2, 4) */}
              {(step === 2 || step === 4) && (
                <div className="bg-[#EAEAEA]/30 border border-neutral-200/50 p-6 rounded-2xl text-left space-y-4">
                  <h4 className="font-condensed font-normal text-[15px] uppercase tracking-wider text-neutral-900">
                    Your booking overview:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 text-xs font-bold text-neutral-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>Third party insurance</span>
                      </div>
                      <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>24/7 Breakdown assistance</span>
                      </div>
                      <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>All-wheel drive</span>
                      </div>
                      <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>GPS and Android Auto / Apple CarPlay</span>
                      </div>
                      <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>
                          {mileage === 'unlimited' 
                            ? 'Unlimited kilometers included' 
                            : `600 km are included, each additional kilometer costs $1.55`}
                        </span>
                      </div>
                      <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>
                          Booking option: {bookingOption === 'stayFlexible' ? 'Stay Flexible - Free cancellation/rebooking any time' : 'Best price - Free cancellation/rebooking within 24h'}
                        </span>
                      </div>
                      <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </div>

                    {protection !== 'none' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>
                            Protection: {protection === 'basic' ? 'Basic Protection' : protection === 'smart' ? 'Smart Protection' : 'All Inclusive Protection'}
                          </span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.additionalDriver && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Additional Driver</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.refuelling && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Refuelling/Recharging service</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.crossBorder && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Cross-border driving</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.mobilityService && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Mobility service</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.tireWindshield && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Tire and Windshield Protection</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.interiorProtection && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Interior Protection</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.boosterSeat && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Booster seat</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.priorityService && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Priority Service</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.dieselEngine && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Diesel engine</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}

                    {addons.comfortFeatures && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Comfort features</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl w-full max-w-[1050px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[92vh]">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white z-30 bg-[#1c1c1c] border border-neutral-800 hover:bg-neutral-800 p-2 rounded-full premium-transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Vehicle Details Summary */}
        <div className="md:w-5/12 bg-gradient-to-b from-[#181818] to-[#0c0c0c] text-white p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
          <div>
            <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-wider block font-condensed">Selected Luxury Vehicle</span>
            <h3 className="font-condensed font-normal text-3xl uppercase tracking-wide mt-1.5 leading-tight text-white">
              {car.name}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 font-semibold uppercase">{car.category}</p>

            <div className="my-8 flex justify-center">
              <img 
                src={car.image} 
                alt={car.name}
                className="max-h-[140px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] transform hover:scale-105 premium-transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mt-6 text-neutral-300">
              <div className="bg-[#161616]/60 p-2.5 rounded-lg border border-neutral-800">
                <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Seats</span>
                <span className="font-bold text-white">{car.seats} Seats</span>
              </div>
              <div className="bg-[#161616]/60 p-2.5 rounded-lg border border-neutral-800">
                <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Luggage Capacity</span>
                <span className="font-bold text-white">{car.suitcases} Suitcases</span>
              </div>
              <div className="bg-[#161616]/60 p-2.5 rounded-lg border border-neutral-800">
                <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Transmission</span>
                <span className="font-bold text-white">{car.transmission}</span>
              </div>
              <div className="bg-[#161616]/60 p-2.5 rounded-lg border border-neutral-800">
                <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Min Age Req</span>
                <span className="font-bold text-white">{car.minAge} Years Old</span>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-6 mt-6 text-xs text-neutral-400">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neutral-500">Rental Duration:</span>
              <span className="font-black text-white bg-[#C5A059]/15 text-[#C5A059] px-2.5 py-0.5 rounded font-condensed uppercase tracking-wider">{days} Days</span>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span>Pickup:</span>
              <span className="font-bold text-neutral-200">{searchParams.pickupDate} ({searchParams.pickupTime})</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Return:</span>
              <span className="font-bold text-neutral-200">{searchParams.returnDate} ({searchParams.returnTime})</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Wizard Steps */}
        <div className="md:w-7/12 bg-[#121212] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          
          {/* Header step counter & live validation banner */}
          {!successMessage && (
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest block font-condensed">Step {step} of 4</span>
                <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> <span className="text-[#C5A059]">W</span> Luxury Booking Flow</span>
              </div>

              {/* Schedule Validation Banner */}
              {datesConflict ? (
                <div className="bg-amber-950/40 border border-amber-900/60 text-amber-300 rounded-xl p-3.5 text-xs font-semibold flex gap-2.5 items-start shadow-md animate-pulse">
                  <AlertCircle className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold block uppercase text-[10px] tracking-wider text-[#C5A059] mb-0.5">Scheduling Conflict</span>
                    This vehicle is locked or reserved for the selected dates. Please adjust your dates or choose another vehicle.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 rounded-xl p-3.5 text-xs font-semibold flex gap-2.5 items-center shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px]">Live Verification: Selected dates are available for this vehicle.</span>
                </div>
              )}
            </div>
          )}

          {successMessage ? (
            <div className="flex flex-col h-full justify-center py-8">
              <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-8 text-center space-y-6 shadow-xl max-w-[500px] mx-auto border-t-4 border-t-[#C5A059]">
                <div className="bg-emerald-950/30 border border-emerald-900/40 p-4 rounded-full w-fit mx-auto">
                  <ShieldCheck className="w-12 h-12 text-emerald-400" />
                </div>
                <h5 className="font-condensed font-normal text-2xl uppercase tracking-wider text-white">Request Received</h5>
                <p className="text-sm font-semibold text-neutral-300 leading-relaxed">{successMessage}</p>
                
                <div className="border-t border-neutral-800 pt-6 text-left space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-neutral-500 font-bold">Vehicle:</span> <span className="font-bold text-white">{car.name}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500 font-bold">Duration:</span> <span className="font-bold text-white">{days} Days</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500 font-bold">Estimated Quote:</span> <span className="font-black text-[#C5A059] font-condensed text-sm">${totals.total.toFixed(2)}</span></div>
                </div>

                <button 
                  onClick={onSubmitSuccess}
                  className="w-full bg-[#C5A059] hover:bg-[#B28F4B] text-white py-3.5 rounded-xl font-condensed font-black uppercase text-sm shadow-lg premium-transition active:scale-95"
                >
                  Return to Fleet
                </button>
              </div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-condensed font-normal text-2xl uppercase text-white">Configure Booking Options</h4>
                      <p className="text-xs text-neutral-400 mt-1">Customize flexibility options and kilometer allowances.</p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-normal text-neutral-400 uppercase tracking-wider">Booking option</h5>
                      <div className="space-y-2">
                        <label 
                          onClick={() => setBookingOption('bestPrice')}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer premium-transition ${
                            bookingOption === 'bestPrice' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              bookingOption === 'bestPrice' ? 'border-[#C5A059]' : 'border-neutral-700'
                            }`}>
                              {bookingOption === 'bestPrice' && <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></div>}
                            </div>
                            <div>
                              <span className="font-bold text-sm block text-white">Best price</span>
                              <span className="text-xs text-neutral-400">Free cancellation and rebooking within 24h.</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase text-neutral-400 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded">Included</span>
                        </label>

                        <label 
                          onClick={() => setBookingOption('stayFlexible')}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer premium-transition ${
                            bookingOption === 'stayFlexible' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              bookingOption === 'stayFlexible' ? 'border-[#C5A059]' : 'border-neutral-700'
                            }`}>
                              {bookingOption === 'stayFlexible' && <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></div>}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">Stay flexible</span>
                                <span className="text-[8px] bg-[#C5A059] text-black px-1.5 py-0.5 rounded font-black uppercase font-condensed">Popular</span>
                              </div>
                              <span className="text-xs text-neutral-400">Free cancellation and rebooking any time before pickup.</span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-[#C5A059] font-condensed">+${stayFlexibleRate}/day</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h5 className="text-xs font-normal text-neutral-400 uppercase tracking-wider">Mileage Allowance</h5>
                      <div className="space-y-2">
                        <label 
                          onClick={() => setMileage('included')}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer premium-transition ${
                            mileage === 'included' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              mileage === 'included' ? 'border-[#C5A059]' : 'border-neutral-700'
                            }`}>
                              {mileage === 'included' && <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></div>}
                            </div>
                            <div>
                              <span className="font-bold text-sm block text-white">600 km</span>
                              <span className="text-xs text-neutral-400">+$0.79 for every additional km.</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase text-neutral-400 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded">Included</span>
                        </label>

                        <label 
                          onClick={() => setMileage('unlimited')}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer premium-transition ${
                            mileage === 'unlimited' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              mileage === 'unlimited' ? 'border-[#C5A059]' : 'border-neutral-700'
                            }`}>
                              {mileage === 'unlimited' && <div className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></div>}
                            </div>
                            <div>
                              <span className="font-bold text-sm block text-white">Unlimited kilometers</span>
                              <span className="text-xs text-neutral-400">All kilometers are included in the price.</span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-[#C5A059] font-condensed">+${unlimitedMileageRate}/day</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-6 mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-neutral-500 block uppercase tracking-wider">Estimated Total</span>
                      <span className="font-condensed font-black text-2xl text-white">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleNextStep}
                      disabled={datesConflict}
                      className="bg-[#C5A059] hover:bg-[#B28F4B] text-white px-8 py-3.5 rounded-xl font-condensed font-black uppercase text-sm flex items-center gap-2 shadow-lg premium-transition disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02]"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-condensed font-normal text-2xl uppercase text-white">Choose protection package</h4>
                      <p className="text-xs text-neutral-400 mt-1">Select coverage terms that fit your comfort level.</p>
                    </div>

                    <div className="bg-[#1c1c1c]/50 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-300 flex gap-2.5 items-start">
                      <AlertCircle className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                      <span>Drivers must have held their driver's license for at least 2 year(s) for this vehicle.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div 
                        onClick={() => setProtection('none')}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between h-[155px] premium-transition ${
                          protection === 'none' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-sm block text-white">No protection</span>
                          <span className="text-[9px] font-bold text-red-500 uppercase block mt-1">Deductible: Full value</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-850 pt-2.5 mt-auto">
                          <span className="text-xs font-bold text-neutral-400">Included</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${protection === 'none' ? 'bg-[#C5A059] border-[#C5A059] text-black' : 'border-neutral-700'}`}>
                            {protection === 'none' && <Check className="w-3 h-3 text-black stroke-[3px]" />}
                          </div>
                        </div>
                      </div>

                      <div 
                        onClick={() => setProtection('basic')}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between h-[155px] premium-transition ${
                          protection === 'basic' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-sm block text-white">Basic Protection</span>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase block mt-1">Deductible: $2,154.60</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-850 pt-2.5 mt-auto">
                          <span className="text-xs font-black text-white font-condensed">+${basicProtectionRate}/day</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${protection === 'basic' ? 'bg-[#C5A059] border-[#C5A059] text-black' : 'border-neutral-700'}`}>
                            {protection === 'basic' && <Check className="w-3 h-3 text-black stroke-[3px]" />}
                          </div>
                        </div>
                      </div>

                      <div 
                        onClick={() => setProtection('smart')}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between h-[155px] premium-transition relative ${
                          protection === 'smart' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                        }`}
                      >
                        <span className="absolute -top-2.5 left-3 text-[8px] font-black bg-[#C5A059] text-black px-2 py-0.5 rounded-full uppercase font-condensed">71% Discount</span>
                        <div>
                          <span className="font-bold text-sm block text-white">Smart Protection</span>
                          <span className="text-[9px] font-bold text-emerald-400 uppercase block mt-1">No Deductible</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-850 pt-2.5 mt-auto">
                          <span className="text-xs font-black text-[#C5A059] font-condensed">+${smartProtectionRate}/day</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${protection === 'smart' ? 'bg-[#C5A059] border-[#C5A059] text-black' : 'border-neutral-700'}`}>
                            {protection === 'smart' && <Check className="w-3 h-3 text-black stroke-[3px]" />}
                          </div>
                        </div>
                      </div>

                      <div 
                        onClick={() => setProtection('allInclusive')}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between h-[155px] premium-transition relative ${
                          protection === 'allInclusive' ? 'border-[#C5A059] bg-neutral-900/60' : 'border-neutral-800 bg-[#161616]/40 hover:border-neutral-700'
                        }`}
                      >
                        <span className="absolute -top-2.5 left-3 text-[8px] font-black bg-[#C5A059] text-black px-2 py-0.5 rounded-full uppercase font-condensed">58% Discount</span>
                        <div>
                          <span className="font-bold text-sm block text-white">All Inclusive</span>
                          <span className="text-[9px] font-bold text-emerald-400 uppercase block mt-1">No Deductible + Tires</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-850 pt-2.5 mt-auto">
                          <span className="text-xs font-black text-[#C5A059] font-condensed">+${allInclusiveRate}/day</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${protection === 'allInclusive' ? 'bg-[#C5A059] border-[#C5A059] text-black' : 'border-neutral-700'}`}>
                            {protection === 'allInclusive' && <Check className="w-3 h-3 text-black stroke-[3px]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-6 mt-6 flex items-center justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="border border-neutral-800 text-neutral-400 bg-neutral-900/60 px-6 py-3.5 rounded-xl font-condensed font-black uppercase text-sm flex items-center gap-2 hover:bg-neutral-800 hover:text-white premium-transition"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-neutral-500 block uppercase tracking-wider">Estimated Total</span>
                      <span className="font-condensed font-black text-2xl text-white">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleNextStep}
                      disabled={datesConflict}
                      className="bg-[#C5A059] hover:bg-[#B28F4B] text-white px-8 py-3.5 rounded-xl font-condensed font-black uppercase text-sm flex items-center gap-2 shadow-lg premium-transition disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed hover:scale-[1.02]"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-condensed font-normal text-2xl uppercase text-white">Select premium add-ons</h4>
                      <p className="text-xs text-neutral-400 mt-1">Enhance your luxury driving comfort.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-7 space-y-3">
                        <div className="flex items-center justify-between p-4 border border-neutral-800 bg-[#161616]/40 rounded-xl hover:border-neutral-700 premium-transition">
                          <div>
                            <span className="font-bold text-xs block text-white">Additional Driver</span>
                            <span className="text-[10px] text-neutral-400 font-medium font-condensed">+${additionalDriverRate}/day</span>
                          </div>
                          <button
                            onClick={() => setAddons(prev => ({ ...prev, additionalDriver: !prev.additionalDriver }))}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                              addons.additionalDriver ? 'bg-[#C5A059]' : 'bg-neutral-800'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                              addons.additionalDriver ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-neutral-800 bg-[#161616]/40 rounded-xl hover:border-neutral-700 premium-transition">
                          <div>
                            <span className="font-bold text-xs block text-white">Refuelling/Recharging Service</span>
                            <span className="text-[10px] text-neutral-400 font-medium font-condensed">+${refuellingRate} one-time</span>
                          </div>
                          <button
                            onClick={() => setAddons(prev => ({ ...prev, refuelling: !prev.refuelling }))}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                              addons.refuelling ? 'bg-[#C5A059]' : 'bg-neutral-800'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                              addons.refuelling ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-neutral-800 bg-[#161616]/40 rounded-xl hover:border-neutral-700 premium-transition">
                          <div>
                            <span className="font-bold text-xs block text-white">Cross-Border Driving Permission</span>
                            <span className="text-[10px] text-neutral-400 font-medium font-condensed">+${crossBorderRate} one-time</span>
                          </div>
                          <button
                            onClick={() => setAddons(prev => ({ ...prev, crossBorder: !prev.crossBorder }))}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
                              addons.crossBorder ? 'bg-[#C5A059]' : 'bg-neutral-800'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                              addons.crossBorder ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 space-y-3">
                        <h5 className="text-[9px] font-normal text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-2">Inclusive Features</h5>
                        
                        <ul className="space-y-2.5 text-[11px] text-neutral-400 font-semibold">
                          <li className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>Third Party Liability Protection</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>24/7 Premium Roadside Assistance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>Satellite GPS Navigation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{mileage === 'included' ? '600 km allowance' : 'Unlimited mileage active'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 pt-6 mt-6 flex items-center justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="border border-neutral-800 text-neutral-400 bg-neutral-900/60 px-6 py-3.5 rounded-xl font-condensed font-black uppercase text-sm flex items-center gap-2 hover:bg-neutral-800 hover:text-white premium-transition"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-neutral-500 block uppercase tracking-wider">Estimated Total</span>
                      <span className="font-condensed font-black text-2xl text-white">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleNextStep}
                      disabled={datesConflict}
                      className="bg-[#C5A059] hover:bg-[#B28F4B] text-white px-8 py-3.5 rounded-xl font-condensed font-black uppercase text-sm flex items-center gap-2 shadow-lg premium-transition disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed hover:scale-[1.02]"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-condensed font-normal text-2xl uppercase text-white">Complete Reservation Intake</h4>
                      <p className="text-xs text-neutral-400 mt-1">Provide your details to submit your request.</p>
                    </div>

                    {validationError && (
                      <div className="bg-red-950/40 border border-red-900/60 text-red-300 rounded-xl p-3.5 text-xs font-semibold flex gap-2.5 items-start">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{validationError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="e.g. John Doe"
                            className="bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:border-[#C5A059] outline-none premium-transition"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="e.g. john@example.com"
                            className="bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:border-[#C5A059] outline-none premium-transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                            <input 
                              type="text" 
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="e.g. +1 555-019-2834"
                              className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-white focus:border-[#C5A059] outline-none premium-transition"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Driver's Age</label>
                          <input 
                            type="number" 
                            required
                            min={car.minAge}
                            value={formData.driverAge}
                            onChange={(e) => setFormData(prev => ({ ...prev, driverAge: e.target.value }))}
                            placeholder="Enter your age"
                            className="bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:border-[#C5A059] outline-none premium-transition"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Optional Special Requests</label>
                        <textarea
                          rows={2.5}
                          value={formData.specialRequests}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                          placeholder="e.g. child seats, winter tires, specific delivery location info, etc."
                          className="bg-[#1c1c1c] border border-neutral-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:border-[#C5A059] outline-none premium-transition resize-none"
                        />
                      </div>

                      <div className="border-t border-neutral-800 pt-6 mt-6 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="border border-neutral-800 text-neutral-400 bg-neutral-900/60 px-6 py-3.5 rounded-xl font-condensed font-black uppercase text-sm flex items-center gap-2 hover:bg-neutral-800 hover:text-white premium-transition"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-neutral-500 block uppercase tracking-wider">Final Total</span>
                          <span className="font-condensed font-black text-2xl text-white">
                            ${totals.total.toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || datesConflict}
                          className="bg-[#C5A059] hover:bg-[#B28F4B] text-white px-8 py-3.5 rounded-xl font-condensed font-black uppercase text-sm flex items-center gap-2 shadow-lg premium-transition disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed hover:scale-[1.02]"
                        >
                          {isSubmitting ? 'Sending Request...' : 'Book Now'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
      <PriceDetailsModal 
        isOpen={isPriceDetailsModalOpen} 
        onClose={() => setIsPriceDetailsModalOpen(false)} 
        totalPrice={totals.total} 
      />
    </div>
  );
}
