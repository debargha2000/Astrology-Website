/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, Sparkles, Menu, X, Compass, BookOpen, Clock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';

import { PageId } from '../types';

interface HeaderProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  cartCount: number;
  onOpenCart: () => void;
  brandName?: string;
  brandSubtitle?: string;
}

export default function Header({
  currentPage,
  setCurrentPage,
  cartCount,
  onOpenCart,
  brandName,
  brandSubtitle,
}: HeaderProps) {
  const resolvedBrandName = brandName && brandName.trim().length > 0 ? brandName : 'Aura & Stone';
  const resolvedBrandSubtitle =
    brandSubtitle && brandSubtitle.trim().length > 0 ? brandSubtitle : 'Crystalline Astrology';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [muhurtaTime, setMuhurtaTime] = useState('Shubh Hora (Auspicious Wealth Focus)');
  const [astronomicalCycle, setAstronomicalCycle] = useState('Sun in Gemini • Moon Waxing');

  useEffect(() => {
    // Dynamically change astrological hours to simulate genuine real-time alignment
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 11) {
      setMuhurtaTime('Amrit Hora (Peak Vitality & Wisdom)');
      setAstronomicalCycle('Solar Purified • Crown Opening');
    } else if (hours >= 11 && hours < 16) {
      setMuhurtaTime('Shubh Hora (Auspicious Commerce & Success)');
      setAstronomicalCycle('Sun in Zenit • Prosperity Charging');
    } else if (hours >= 16 && hours < 21) {
      setMuhurtaTime('Labh Hora (Gainful Business & Networks)');
      setAstronomicalCycle('Venus Aspecting • Aura Strengthening');
    } else {
      setMuhurtaTime('Luna Hora (Night Cleansing & Psychic Shields)');
      setAstronomicalCycle('Moon Bathing Active • Protection Aura');
    }
  }, []);

  const navItems = [
    { id: 'home', label: 'Ethereal Space' },
    { id: 'shop', label: 'Gemstone Curations' },
    { id: 'zodiac-calculator', label: 'Zodiac Alignment' },
    { id: 'charging-station', label: 'Vedic Charge Chamber' },
    { id: 'encyclopedia', label: 'Crystal Codex' },
    { id: 'about', label: 'Astrological Legacy' },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[#D1CEBF] bg-[#F8F6F1]/95 backdrop-blur-md">
      {/* Astrological Announcement Ribbon */}
      <div className="bg-[#1A1A1A] py-2 text-center text-[9px] tracking-[0.25em] font-mono text-[#F8F6F1]/90 uppercase flex items-center justify-center gap-1.5 md:gap-3 px-4 border-b border-[#D1CEBF]/20">
        <Sparkles className="h-3 w-3 animate-pulse text-[#A6A18F]" />
        <span>
          Vedic Cleansing Active:{' '}
          <span className="text-[#A6A18F] font-semibold">{muhurtaTime}</span>
        </span>
        <span className="hidden md:inline text-[#F8F6F1]/30">|</span>
        <span className="hidden md:inline text-[#F8F6F1]/70">{astronomicalCycle}</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Universal Collapsible Burger Menu Toggle Button */}
          <div className="flex items-center w-1/4 justify-start">
            <button
              id="menu-toggle-btn"
              type="button"
              className="text-[#1A1A1A] hover:text-[#A6A18F] transition-all duration-200 p-2 rounded-full hover:bg-[#E8E6E1]/50 cursor-pointer flex items-center gap-2.5 group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5.5 w-5.5 stroke-[1.5] transition-transform group-hover:scale-105" />
              <span className="hidden sm:inline font-mono text-[9px] tracking-[0.2em] uppercase font-bold text-[#1A1A1A]/80">
                Menu
              </span>
            </button>
          </div>

          {/* Branded Centered Logo */}
          <div
            className="flex flex-col items-center justify-center cursor-pointer select-none flex-1 text-center"
            onClick={() => setCurrentPage('home')}
          >
            <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-[#1A1A1A] leading-none">
              {resolvedBrandName}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-[#A6A18F] mt-1 sm:mt-0.5 ml-[0.2em] font-mono font-medium leading-none">
              {resolvedBrandSubtitle}
            </span>
          </div>

          {/* Cart Icon & Direct Interaction */}
          <div className="flex items-center justify-end w-1/4">
            <button
              id="view-cart-button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full hover:bg-[#E8E6E1] text-[#1A1A1A] transition-all duration-300 flex items-center justify-center cursor-pointer group"
            >
              <ShoppingBag className="h-[21px] w-[21px] stroke-[1.25] group-hover:scale-105 transition-transform" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1A1A1A] text-[9px] font-mono font-bold text-[#F8F6F1] border border-[#F8F6F1]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Left Tab Handle sticking out from the left window edge (closed state indicator) */}
      <AnimatePresence>
        {!isMobileMenuOpen && (
          <motion.button
            id="left-side-tab-handle"
            key="side-tab-handle"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="fixed left-0 top-1/3 -translate-y-1/2 z-30 flex flex-col items-center gap-3 bg-[#1A1A1A] hover:bg-[#322D2C] text-[#F8F6F1] border-y border-r border-[#D1CEBF]/35 py-5 px-2 rounded-r-2xl shadow-2xl transition-all duration-200 cursor-pointer group active:scale-95"
          >
            <div
              className="font-mono text-[8px] tracking-[0.25em] uppercase font-bold text-[#A6A18F] group-hover:text-white transition-colors"
              style={{ writingMode: 'vertical-lr' }}
            >
              COSMIC DIRECTORY
            </div>
            <Sparkles className="h-3 w-3 animate-pulse text-[#A6A18F] shrink-0 mt-1" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide-out Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              id="menu-backdrop"
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#1A1A1A]/35 backdrop-blur-sm"
              transition={{ duration: 0.25 }}
            />

            {/* Sliding Drawer left-docked card tab */}
            <motion.div
              id="menu-drawer-panel"
              key="menu-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 35 }}
              className="fixed top-4 bottom-4 left-0 z-50 flex h-[calc(100vh-2rem)] w-full max-w-xs sm:max-w-sm flex-col bg-[#F8F6F1] border-y border-r border-[#D1CEBF] shadow-2xl p-6 sm:p-8 font-sans justify-between overflow-y-auto scrollbar-none rounded-r-3xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#D1CEBF]/40 pb-5">
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-light tracking-[0.2em] uppercase text-[#1A1A1A]">
                    SIGNTIFIC
                  </span>
                  <span className="text-[8px] tracking-[0.3em] uppercase text-[#A6A18F] font-mono leading-none mt-0.5 font-bold">
                    Cosmic Directory
                  </span>
                </div>
                <button
                  id="close-menu-drawer-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="cursor-pointer p-2 rounded-full hover:bg-[#E8E6E1]/50 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links List */}
              <nav className="flex-1 py-10 flex flex-col justify-center space-y-5">
                {navItems.map((item, index) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      id={`drawer-nav-item-${item.id}`}
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="group flex items-baseline gap-4.5 w-full text-left cursor-pointer py-1.5 transition-transform duration-200 hover:translate-x-1"
                    >
                      <span className="font-mono text-[9px] tracking-wider text-[#A6A18F] font-semibold select-none w-5">
                        0{index + 1}
                      </span>
                      <span
                        className={`font-serif text-lg sm:text-xl font-light tracking-wide transition-colors ${
                          isActive
                            ? 'text-[#C5A880] font-semibold'
                            : 'text-[#1A1A1A] group-hover:text-[#C5A880]'
                        }`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="drawer-active-dot"
                          className="h-1.5 w-1.5 rounded-full bg-[#C5A880] self-center ml-2 shrink-0 animate-pulse"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Drawer Footer Information */}
              <div className="border-t border-[#D1CEBF]/45 pt-6 space-y-4">
                <div className="p-3.5 bg-[#FAF7F2]/60 border border-[#D1CEBF]/50 rounded-xl space-y-2">
                  <span className="block text-[8px] font-mono text-[#A6A18F] uppercase tracking-wider font-bold">
                    Active Alignment Lock
                  </span>
                  <p className="text-[10px] text-[#1A1A1A]/75 leading-relaxed font-sans font-light">
                    {muhurtaTime}
                  </p>
                  <p className="text-[8.5px] text-[#1A1A1A]/55 font-mono leading-none">
                    {astronomicalCycle}
                  </p>
                </div>
                <div className="text-center font-mono text-[8px] text-[#1A1A1A]/40 uppercase tracking-widest">
                  © {new Date().getFullYear()} Aura & Stone • Pure Crystal Conductors
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
