/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ZODIAC_DATA, PRODUCTS,
  ZODIAC_ARIES_IMAGE, ZODIAC_TAURUS_IMAGE, ZODIAC_GEMINI_IMAGE, ZODIAC_CANCER_IMAGE,
  ZODIAC_LEO_IMAGE, ZODIAC_VIRGO_IMAGE, ZODIAC_LIBRA_IMAGE, ZODIAC_SCORPIO_IMAGE,
  ZODIAC_SAGITTARIUS_IMAGE, ZODIAC_CAPRICORN_IMAGE, ZODIAC_AQUARIUS_IMAGE, ZODIAC_PISCES_IMAGE
} from '../data';
import { Product, BirthDetails } from '../types';
import { BirthDetailsForm } from './astro/BirthDetailsForm';
import { 
  Sparkles, Calendar, User, Compass, TrendingUp, ShieldAlert, 
  ArrowRight, Zap, RefreshCw, Star, Info, Sun, Moon, 
  Flame, Wind, Droplet, Gem, ShieldCheck, Heart, Compass as OrbitIcon, LucideIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ZodiacCalculatorProps {
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartProducts: string[];
}

export default function ZodiacCalculator({ onViewProduct, onAddToCart, cartProducts }: ZodiacCalculatorProps) {
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({ name: '', birthDate: '' });
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [isAligning, setIsAligning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Exact coordinates matching zodiac signs for rotational math
  const signsList = [
    { name: 'Aries', dateRange: 'Mar 21 - Apr 19', symbol: '♈', element: 'Fire', color: '#EF4444', angle: 0, image: ZODIAC_ARIES_IMAGE },
    { name: 'Taurus', dateRange: 'Apr 20 - May 20', symbol: '♉', element: 'Earth', color: '#10B981', angle: 30, image: ZODIAC_TAURUS_IMAGE },
    { name: 'Gemini', dateRange: 'May 21 - Jun 20', symbol: '♊', element: 'Air', color: '#3B82F6', angle: 60, image: ZODIAC_GEMINI_IMAGE },
    { name: 'Cancer', dateRange: 'Jun 21 - Jul 22', symbol: '♋', element: 'Water', color: '#06B6D4', angle: 90, image: ZODIAC_CANCER_IMAGE },
    { name: 'Leo', dateRange: 'Jul 23 - Aug 22', symbol: '♌', element: 'Fire', color: '#F59E0B', angle: 120, image: ZODIAC_LEO_IMAGE },
    { name: 'Virgo', dateRange: 'Aug 23 - Sep 22', symbol: '♍', element: 'Earth', color: '#059669', angle: 150, image: ZODIAC_VIRGO_IMAGE },
    { name: 'Libra', dateRange: 'Sep 23 - Oct 22', symbol: '♎', element: 'Air', color: '#60A5FA', angle: 180, image: ZODIAC_LIBRA_IMAGE },
    { name: 'Scorpio', dateRange: 'Oct 23 - Nov 21', symbol: '♏', element: 'Water', color: '#6366F1', angle: 210, image: ZODIAC_SCORPIO_IMAGE },
    { name: 'Sagittarius', dateRange: 'Nov 22 - Dec 21', symbol: '♐', element: 'Fire', color: '#D97706', angle: 240, image: ZODIAC_SAGITTARIUS_IMAGE },
    { name: 'Capricorn', dateRange: 'Dec 22 - Jan 19', symbol: '♑', element: 'Earth', color: '#4B5563', angle: 270, image: ZODIAC_CAPRICORN_IMAGE },
    { name: 'Aquarius', dateRange: 'Jan 20 - Feb 18', symbol: '♒', element: 'Air', color: '#2563EB', angle: 300, image: ZODIAC_AQUARIUS_IMAGE },
    { name: 'Pisces', dateRange: 'Feb 19 - Mar 20', symbol: '♓', element: 'Water', color: '#0891B2', angle: 330, image: ZODIAC_PISCES_IMAGE }
  ];

  const getElementIcon = (element: string): LucideIcon => {
    switch (element.toLowerCase()) {
      case 'fire': return Flame;
      case 'air': return Wind;
      case 'water': return Droplet;
      case 'earth': return Gem;
      default: return Compass;
    }
  };

  const determineSignFromDate = (month: string, day: number): string => {
    const m = parseInt(month);
    const d = day;
    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'Aries';
    if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'Taurus';
    if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'Gemini';
    if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'Cancer';
    if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'Leo';
    if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'Virgo';
    if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'Libra';
    if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'Scorpio';
    if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'Sagittarius';
    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'Capricorn';
    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'Aquarius';
    return 'Pisces';
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAligning(true);
    setShowResult(false);
    
    setTimeout(() => {
      const dateParts = birthDetails.birthDate.split('-');
      const month = dateParts[1] || '01';
      const day = parseInt(dateParts[2] || '1');
      const zodiacSign = determineSignFromDate(month, day);
      setSelectedSign(zodiacSign);
      setIsAligning(false);
      setShowResult(true);
    }, 2000);
  };

  const handleSelectDirect = (signName: string) => {
    setIsAligning(true);
    setShowResult(false);
    setSelectedSign(signName);
    setTimeout(() => {
      setIsAligning(false);
      setShowResult(true);
    }, 1400);
  };

  const activeSignData = selectedSign ? ZODIAC_DATA[selectedSign] : null;
  const activeSignMeta = signsList.find((s) => s.name === selectedSign);

  // Retrieve products corresponding to the recommendations
  const recommendedProducts = activeSignData
    ? PRODUCTS.filter((p) => activeSignData.recommendedProductIds.includes(p.id))
    : [];

  const currentRotationAngle = activeSignMeta ? -activeSignMeta.angle : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans" id="zodiac-portal-section">
      
      {/* Immersive Luxury Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-20 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-[#C5A880] animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
            Vedic Planetary Alignment Diagnostic
          </span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-[#1A1A1A] leading-tight">
          Find Your Astro-Resonant Shield
        </h2>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto my-3" />
        <p className="text-sm text-[#1A1A1A]/70 leading-relaxed font-light max-w-2xl mx-auto">
          Every individual’s birth moment establishes distinct micro-electromagnetic vectors. Discover which minerals physically harmonize with your ruling planets and bridge energetic deficiencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Celestial Coordinates & Sign Selectors */}
        <div className="lg:col-span-5 space-y-8" id="celestial-inputs-column">
          
          {/* Beautiful Vedic Coordinate Intake Card */}
          <div className="bg-[#FAF8F5] border border-[#E5E0D5] hover:border-[#C5A880]/50 rounded-2xl p-6 md:p-8 shadow-sm transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
            
            <h3 className="font-serif text-xl text-[#1A1A1A] mb-6 flex items-center gap-3">
              <span className="p-2 bg-[#C5A880]/10 rounded-xl text-[#C5A880]">
                <Compass className="h-5 w-5 animate-spin-slow" />
              </span>
              Enter Natal Coordinates
            </h3>
            
            <form onSubmit={handleCalculate} className="space-y-5">
              <BirthDetailsForm
                value={birthDetails}
                onChange={setBirthDetails}
                showName={true}
              />

              <p className="text-[10px] text-[#857F75] italic text-center">
                Add birth time and place for a complete natal chart (ascendant, moon sign, nakshatra, transits).
              </p>

              <button
                id="calculate-alignment-btn"
                type="submit"
                disabled={isAligning}
                className="w-full cursor-pointer bg-[#1A1A1A] hover:bg-[#C5A880] text-white hover:text-black py-4 rounded-xl text-xs tracking-[0.15em] font-mono font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                {isAligning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-inherit" />
                    Calculating Astro-Resonance...
                  </>
                ) : (
                  <>
                    <OrbitIcon className="h-4 w-4 text-[#C5A880] group-hover/btn:text-black transition-colors" />
                    Cast Vedic Astral Map
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Majestic Constellation Medallions Selector */}
          <div className="space-y-4" id="zodiac-selector-grid-wrapper">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#5E5950] font-semibold">
                Or Direct Sign Select:
              </span>
              <span className="text-[9px] font-mono text-[#C5A880]">12 Vedic Constellations</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2.5">
              {signsList.map((sign) => {
                const isSelected = selectedSign === sign.name;
                return (
                  <button
                    id={`zodiac-btn-${sign.name}`}
                    key={sign.name}
                    type="button"
                    onClick={() => handleSelectDirect(sign.name)}
                    className={`cursor-pointer border py-3 rounded-xl text-center transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden group ${
                      isSelected
                        ? 'border-[#C5A880] bg-[#1A1A1A] text-white shadow-md shadow-[#C5A880]/10 scale-[1.03]'
                        : 'border-[#E5E0D5] bg-[#FAF8F5]/80 hover:bg-white text-[#1A1A1A] hover:border-[#C5A880]/40'
                    }`}
                  >
                    {/* Tiny glowing dot if selected */}
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C5A880]"></span>
                      </span>
                    )}
                    
                    <div className={`relative h-11 w-11 rounded-full mb-1.5 overflow-hidden border ${
                      isSelected 
                        ? 'border-[#C5A880] bg-[#1E1A16] shadow-[0_0_8px_rgba(197,168,128,0.4)] scale-110' 
                        : 'border-[#E5E0D5] bg-[#1A1A1A] group-hover:border-[#C5A880]/60 group-hover:scale-105'
                    } transition-all duration-300`}>
                      <img
                        src={sign.image}
                        alt={`${sign.name} symbol`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-[9px] font-mono tracking-wider uppercase font-semibold">{sign.name}</span>
                    <span className="text-[7px] text-[#A6A18F]/80 font-medium scale-[0.9] mt-0.5">{sign.dateRange.split(' - ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Astro Diagnostics Space & Radial Wheel */}
        <div className="lg:col-span-7" id="diagnostic-dashboard-column">
          <AnimatePresence mode="wait">
            
            {/* 1. CALCULATING INTENSE VEDIC TRANSITS SCREEN */}
            {isAligning && (
              <motion.div
                key="loading-frame"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-[#151313] border border-[#C5A880]/30 rounded-3xl p-8 md:p-12 text-center h-[620px] flex flex-col items-center justify-center space-y-8 relative overflow-hidden"
              >
                {/* Backdrop starlight nodes */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
                
                {/* Rotating Astronomical Ring Setup */}
                <div className="relative h-44 w-44 flex items-center justify-center">
                  {/* Outer spinning astrolabe */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#C5A880]/30 animate-spin-slow" />
                  {/* Inner planetary alignment ring */}
                  <div className="absolute h-32 w-32 rounded-full border-2 border-dashed border-[#C5A880]/15 animate-spin-reverse" />
                  {/* Innermost rotating glyph core */}
                  <div className="absolute h-20 w-20 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/40 flex items-center justify-center">
                    <Compass className="h-8 w-8 text-[#C5A880] animate-pulse" />
                  </div>
                  {/* Orbiting celestial sphere marker */}
                  <div className="absolute top-0 h-4 w-4 rounded-full bg-[#C5A880] shadow-[0_0_12px_#C5A880] animate-ping" />
                </div>

                <div className="space-y-3 z-10 max-w-sm">
                  <span className="text-[#C5A880] font-mono text-[10px] tracking-[0.3em] uppercase block animate-pulse">
                    Translating Astro-Glyphs
                  </span>
                  <h4 className="font-serif text-2xl tracking-wide text-[#FAF8F5] font-light">
                    Measuring Celestial Wavelengths
                  </h4>
                  <div className="h-0.5 w-12 bg-[#C5A880] mx-auto my-2" />
                  <p className="text-xs text-[#A6A18F] font-mono leading-relaxed">
                    Analyzing Mercury-Shukra dual transit vectors... <br />
                    Matching natal elements with crystalline resonant frequencies...
                  </p>
                </div>
              </motion.div>
            )}

            {/* 2. CELESTIAL ASTROLABE UN-ALIGNED STATE */}
            {!isAligning && !showResult && (
              <motion.div
                key="empty-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-[#E5E0D5] rounded-3xl p-8 md:p-12 text-center h-[620px] flex flex-col items-center justify-center space-y-6 bg-white relative overflow-hidden group/astrolabe"
              >
                {/* Embedded Aesthetic Interactive Astrolabe Backplane */}
                <div className="absolute -bottom-16 -right-16 md:bottom-auto md:right-auto md:relative h-64 w-64 md:h-80 md:w-80 rounded-full border border-[#E5E0D5]/60 flex items-center justify-center pointer-events-none group-hover/astrolabe:scale-[1.02] transition-transform duration-700 select-none">
                  <div className="absolute inset-4 rounded-full border border-[#E5E0D5]/50 border-dashed" />
                  <div className="absolute inset-12 rounded-full border border-[#C5A880]/20 animate-spin-slow" />
                  <div className="absolute inset-24 rounded-full border border-[#E5E0D5]/60" />
                  
                  {/* Subtle radiating grid layout representing stellar houses */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#E5E0D5]/35 to-transparent"
                      style={{ transform: `rotate(${deg}deg)` }}
                    />
                  ))}

                  {/* Central Core Emblem of Vedic Astronomy */}
                  <div className="absolute h-10 w-10 rounded-full bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] shadow-sm">
                    <OrbitIcon className="h-4 w-4 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2 z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D5] text-xs text-[#878070] font-mono mx-auto">
                    <Star className="h-3.5 w-3.5 text-[#C5A880] animate-spin-slow" />
                    Status: System Standing By
                  </div>
                  <h4 className="font-serif text-2xl tracking-wide text-[#1A1A1A] font-light">
                    Personalized Alignment Matrix
                  </h4>
                  <p className="text-xs text-[#5E5950] max-w-sm mx-auto leading-relaxed">
                    Please submit your coordinates above or click a zodiac medallion. Our system will generate a beautiful custom astral aspect map, planetary energy scores, and your consecrated crystal jewelry prescriptions.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3. MAJESTIC ULTIMATE REPORTED STATE */}
            {!isAligning && showResult && activeSignData && (
              <motion.div
                key="result-frame"
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className="bg-[#151313] text-[#FAF8F5] rounded-3xl p-6 md:p-8 space-y-8 border border-[#C5A880]/30 shadow-xl relative overflow-hidden"
                id="zodiac-report-dashboard"
              >
                {/* Luxurious Radial Cosmic Aura Backing */}
                <div className="absolute -top-12 -right-12 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.08)_0%,transparent_70%)] pointer-events-none rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

                {/* Main Client Coordinates Block */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-6 border-b border-[#FAF8F5]/10">
                  <div className="flex items-center gap-4">
                    {/* Glowing Zodiac Shield Symbol */}
                    <div className="relative h-14 w-14 rounded-full border border-[#C5A880]/40 flex items-center justify-center bg-[#1E1A16] shadow-[0_0_15px_rgba(197,168,128,0.25)] overflow-hidden">
                      <div className="absolute inset-0.5 rounded-full border border-dashed border-[#C5A880]/20 animate-spin-slow z-10 pointer-events-none" />
                      <img
                        src={(activeSignMeta as any)?.image}
                        alt={`${selectedSign} astronomical symbol`}
                        referrerPolicy="no-referrer"
                        className="relative z-0 h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block">
                        Natal Frequency for {birthDetails.name || 'Universal Seeker'}
                      </span>
                      <h4 className="font-serif text-2xl tracking-wide text-white font-normal mt-0.5">
                        {activeSignData.sign} Alignments
                      </h4>
                    </div>
                  </div>

                  {/* Planet & Element Pills with bespoke icons */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C1A18] border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-mono tracking-widest uppercase">
                      {React.createElement(getElementIcon(activeSignData.element), { className: 'h-3 w-3 text-[#C5A880]' })}
                      Element: {activeSignData.element}
                    </div>
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C1A18] border border-[#FAF8F5]/10 text-white text-[10px] font-mono tracking-widest uppercase">
                      <OrbitIcon className="h-3 w-3 text-[#A6A18F]" />
                      Ruler: {activeSignData.rulingPlanet}
                    </div>
                  </div>
                </div>

                {/* Dynamic Planetary Energy Balance Chart */}
                <div className="space-y-4" id="planetary-harmonic-meters bg-[#1C1A18]/50 p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] flex items-center gap-1.5 font-bold">
                      <Star className="h-3.5 w-3.5 text-[#C5A880] animate-pulse" />
                      Planetary Harmonic balance Index
                    </h5>
                    <span className="text-[9px] font-mono text-[#FAF8F5]/50">Microspectral Energy Resonance</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Index Item: Wealth */}
                    <div className="bg-[#1C1A18] p-4 rounded-xl border border-white/5 space-y-1.5 hover:border-[#C5A880]/20 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-[#FAF8F5]/80">Wealth Manifestation (L1)</span>
                        <span className="text-xs font-mono text-[#C5A880] font-bold">{activeSignData.energyScore.wealth}%</span>
                      </div>
                      <div className="h-1.5 bg-[#FAF8F5]/10 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activeSignData.energyScore.wealth}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full bg-[#C5A880] rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-[#A6A18F]/50">
                        <span>Defined Static Node</span>
                        <span>{activeSignData.energyScore.wealth > 90 ? 'Highly Receptive' : 'Optimal Path'}</span>
                      </div>
                    </div>

                    {/* Index Item: Protection */}
                    <div className="bg-[#1C1A18] p-4 rounded-xl border border-white/5 space-y-1.5 hover:border-[#C5A880]/20 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-[#FAF8F5]/80">Aura Protection Index</span>
                        <span className="text-xs font-mono text-[#C5A880] font-bold">{activeSignData.energyScore.protection}%</span>
                      </div>
                      <div className="h-1.5 bg-[#FAF8F5]/10 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activeSignData.energyScore.protection}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5E0D5] rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-[#A6A18F]/50">
                        <span>Environmental Deflection</span>
                        <span>{activeSignData.energyScore.protection > 90 ? 'Heavy Armor' : 'Secured Core'}</span>
                      </div>
                    </div>

                    {/* Index Item: Career */}
                    <div className="bg-[#1C1A18] p-4 rounded-xl border border-white/5 space-y-1.5 hover:border-[#C5A880]/20 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-[#FAF8F5]/80">Career Status and Fame Node</span>
                        <span className="text-xs font-mono text-[#C5A880] font-bold">{activeSignData.energyScore.career}%</span>
                      </div>
                      <div className="h-1.5 bg-[#FAF8F5]/10 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activeSignData.energyScore.career}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#878070] to-[#C5A880] rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-[#A6A18F]/50">
                        <span>Solar-House Transit</span>
                        <span>{activeSignData.energyScore.career > 90 ? 'Extreme Authority' : 'Ascending Phase'}</span>
                      </div>
                    </div>

                    {/* Index Item: Clarity */}
                    <div className="bg-[#1C1A18] p-4 rounded-xl border border-white/5 space-y-1.5 hover:border-[#C5A880]/20 transition-all">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-[#FAF8F5]/80">Prana / Emotional Balance</span>
                        <span className="text-xs font-mono text-[#C5A880] font-bold">{activeSignData.energyScore.clarity}%</span>
                      </div>
                      <div className="h-1.5 bg-[#FAF8F5]/10 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activeSignData.energyScore.clarity}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full bg-[#878070] rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-[#A6A18F]/50">
                        <span>Neurological Meridian</span>
                        <span>{activeSignData.energyScore.clarity > 90 ? 'Deep Peace' : 'Balanced Center'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lucky Pillars block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2" id="lucky-pillars-section">
                  {/* Lucky Colors Pill container */}
                  <div className="bg-[#1C1A18] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-[#A6A18F] uppercase tracking-wider block mb-2">
                      Beneficial Astral Colors
                    </span>
                    <div className="flex gap-3">
                      {activeSignData.luckyColors.map((colorName, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span 
                            className="h-3 w-3 rounded-full border border-white/20 shadow-inner"
                            style={{ 
                              backgroundColor: colorName.toLowerCase().includes('gold') ? '#D97706' :
                                               colorName.toLowerCase().includes('red') ? '#DC2626' :
                                               colorName.toLowerCase().includes('emerald') ? '#059669' :
                                               colorName.toLowerCase().includes('champagne') ? '#F3E5AB' :
                                               colorName.toLowerCase().includes('citron') ? '#EAB308' :
                                               colorName.toLowerCase().includes('mint') ? '#10B981' :
                                               colorName.toLowerCase().includes('pearl') ? '#E2E8F0' :
                                               colorName.toLowerCase().includes('silver') ? '#94A3B8' :
                                               colorName.toLowerCase().includes('blue') ? '#2563EB' :
                                               colorName.toLowerCase().includes('orange') ? '#F97316' :
                                               colorName.toLowerCase().includes('bronze') ? '#CD7F32' :
                                               colorName.toLowerCase().includes('slate') ? '#475569' :
                                               colorName.toLowerCase().includes('pink') ? '#EC4899' :
                                               colorName.toLowerCase().includes('crimson') ? '#991B1B' :
                                               colorName.toLowerCase().includes('black') ? '#09090B' :
                                               colorName.toLowerCase().includes('plum') ? '#581C87' :
                                               colorName.toLowerCase().includes('saffron') ? '#F97316' :
                                               colorName.toLowerCase().includes('indigo') ? '#4338CA' :
                                               colorName.toLowerCase().includes('yellow') ? '#EAB308' :
                                               colorName.toLowerCase().includes('charcoal') ? '#334155' : '#C5A880' 
                            }}
                          />
                          <span className="text-xs font-light text-[#FAF8F5]/90">{colorName}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lucky Numbers rune display */}
                  <div className="bg-[#1C1A18] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-[#A6A18F] uppercase tracking-wider block mb-2">
                      Favorable Numerological Nodes
                    </span>
                    <div className="flex gap-2">
                      {activeSignData.luckyNumbers.map((num) => (
                        <span 
                          key={num} 
                          className="h-6 px-2.5 rounded border border-[#C5A880]/30 text-xs font-mono text-[#C5A880] flex items-center justify-center font-bold bg-[#FAF8F5]/5 shadow-sm"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strengths & Weaknesses Detailed Vedic Chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="psychic-vibrations-analysis">
                  {/* High Vibrants */}
                  <div className="bg-[#1C1A18] p-5 rounded-xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#10B981] flex items-center gap-1.5 font-bold">
                      <TrendingUp className="h-4 w-4" /> Power Vectors & Strengths
                    </span>
                    <div className="h-px bg-gradient-to-r from-[#10B981]/20 to-transparent mb-1" />
                    <ul className="space-y-2 text-xs text-[#FAF8F5]/85">
                      {activeSignData.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-center gap-2 font-light hover:text-[#10B981] transition-all">
                          <span className="text-[#10B981] text-md leading-none">•</span> 
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Energy Siphons */}
                  <div className="bg-[#1C1A18] p-5 rounded-xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#EF4444] flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="h-4 w-4 animate-pulse" /> Vulnerable Meridian Leaks
                    </span>
                    <div className="h-px bg-gradient-to-r from-[#EF4444]/20 to-transparent mb-1" />
                    <ul className="space-y-2 text-xs text-[#FAF8F5]/85">
                      {activeSignData.challenges.map((cha, idx) => (
                        <li key={idx} className="flex items-center gap-2 font-light hover:text-[#EF4444] transition-all">
                          <span className="text-[#EF4444] text-md leading-none">•</span> 
                          <span>{cha}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sacred Stone Astrological Prescription */}
                <div className="p-5 bg-white/5 border border-[#C5A880]/20 rounded-xl space-y-2 relative overflow-hidden group/stone">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.1),transparent_70%)] pointer-events-none" />
                  <h6 className="text-[10px] font-mono text-[#C5A880] uppercase tracking-[0.15em] flex items-center gap-1.5 font-bold">
                    <Zap className="h-4 w-4 text-[#C5A880] animate-pulse" />
                    Astrological Gemstone Prescription
                  </h6>
                  <p className="text-xs text-[#FAF8F5]/90 leading-relaxed font-light">
                    {activeSignData.stoneBenefits}
                  </p>
                </div>

                {/* Recommended Products Vedic Showcase */}
                <div className="space-y-4 pt-6 border-t border-[#FAF8F5]/10" id="prescribed-artifacts-shop">
                  <div className="flex items-center justify-between">
                    <h6 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A6A18F] font-bold">
                      Resonant Vedic Jewelry Consecrations:
                    </h6>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#C5A880]">
                      100% Aura Coherent
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {recommendedProducts.map((prod) => (
                      <div
                        id={`calculated-prod-${prod.id}`}
                        key={prod.id}
                        className="bg-[#1C1A18] hover:bg-white/5 border border-white/5 hover:border-[#C5A880]/30 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 group shadow-sm hover:shadow-md"
                      >
                        <div 
                          className="flex items-center gap-4 cursor-pointer" 
                          onClick={() => onViewProduct(prod)}
                        >
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-[#C5A880]/20 flex-shrink-0 group-hover:border-[#C5A880] transition-colors">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <span className="block text-xs font-serif font-light text-white group-hover:text-[#C5A880] transition-colors leading-snug">
                              {prod.name}
                            </span>
                            <span className="block text-[10px] font-mono text-[#A6A18F] mt-0.5">
                              Recommended for {selectedSign} • Double lunar-charged core
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono font-semibold text-[#FAF8F5]/90 text-right">
                            ₹{prod.salePrice}
                          </span>
                          <button
                            id={`add-zodiac-rec-${prod.id}`}
                            onClick={() => onAddToCart(prod)}
                            className="cursor-pointer bg-[#C5A880] hover:bg-white hover:text-black text-black px-4 py-2 text-[9px] font-mono uppercase tracking-widest font-bold rounded-lg transition-all duration-300 shadow-sm"
                          >
                            {cartProducts.includes(prod.id) ? 'In Cart' : 'Acquire'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
