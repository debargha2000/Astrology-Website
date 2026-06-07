/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, Compass, ShieldCheck, Truck, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';

import type { PageId } from '../types';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-[#F8F6F1]/90 pt-16 pb-12 font-sans border-t border-[#D1CEBF]/20">
      {/* Brand Values / Trust Banners */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#D1CEBF]/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-2">
            <div className="h-12 w-12 rounded-full border border-[#A6A18F]/40 flex items-center justify-center mb-4 text-[#A6A18F]">
              <Award className="h-6 w-6 stroke-[1.25]" />
            </div>
            <h4 className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#F8F6F1] font-semibold mb-2">
              75 Years Vedic Lineage
            </h4>
            <p className="text-[10px] text-[#A39E96] leading-relaxed max-w-xs">
              Consecrations supervised by third-generation Himalayan Astro-experts.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="h-12 w-12 rounded-full border border-[#A6A18F]/40 flex items-center justify-center mb-4 text-[#A6A18F]">
              <Compass className="h-6 w-6 stroke-[1.25]" />
            </div>
            <h4 className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#F8F6F1] font-semibold mb-2">
              Grade A+ Pure Minerals
            </h4>
            <p className="text-[10px] text-[#A39E96] leading-relaxed max-w-xs">
              Every single bead is tested for absolute density, chemical formula and origin
              integrity.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="h-12 w-12 rounded-full border border-[#A6A18F]/40 flex items-center justify-center mb-4 text-[#A6A18F]">
              <ShieldCheck className="h-6 w-6 stroke-[1.25]" />
            </div>
            <h4 className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#F8F6F1] font-semibold mb-2">
              3 Night Consecration
            </h4>
            <p className="text-[10px] text-[#A39E96] leading-relaxed max-w-xs">
              Cleansed, solarized, bathing in mantra chants & lunar tides before shipping.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="h-12 w-12 rounded-full border border-[#A6A18F]/40 flex items-center justify-center mb-4 text-[#A6A18F]">
              <Truck className="h-6 w-6 stroke-[1.25]" />
            </div>
            <h4 className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#F8F6F1] font-semibold mb-2">
              Insured Vedic Transit
            </h4>
            <p className="text-[10px] text-[#A39E96] leading-relaxed max-w-xs">
              Arrives sealed in air-tight spiritual pouches in elegant velvet linings.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Intro Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-light tracking-[0.3em] uppercase text-white">
                SIGNTIFIC
              </span>
              <span className="text-[9px] tracking-[0.45em] uppercase text-[#A6A18F] -mt-0.5 ml-[0.3em] font-mono">
                THE INDIAN SCIENCE OF SIGNS
              </span>
            </div>
            <p className="text-xs text-[#A39E96] leading-relaxed max-w-md">
              Crystals are natural thermodynamic micro-oscillators. When synced to your birth
              planets, they harmonize energy leaks, block negative gaze, and manifest high-frequency
              financial and creative breakthroughs. We believe in authenticity, scientific
              precision, and deep spiritual heritage.
            </p>
            <div className="text-[11px] text-[#A6A18F] font-mono">
              ★ Cofounded and Recommended by Mridul Madhok
            </div>
          </div>

          {/* Nav Links Column */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white mb-4">
                Explore
              </h5>
              <ul className="space-y-3 text-[11px] text-[#A39E96]">
                <li>
                  <button
                    id="footer-link-home"
                    onClick={() => setCurrentPage('home')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Ethereal Space
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-shop"
                    onClick={() => setCurrentPage('shop')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Gem Collections
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-zodiac"
                    onClick={() => setCurrentPage('zodiac-calculator')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Zodiac Alignment
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-charge"
                    onClick={() => setCurrentPage('charging-station')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Vedic Chariot
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white mb-4">
                Wisdom
              </h5>
              <ul className="space-y-3 text-[11px] text-[#A39E96]">
                <li>
                  <button
                    id="footer-link-codex"
                    onClick={() => setCurrentPage('encyclopedia')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Crystal Codex
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-about"
                    onClick={() => setCurrentPage('about')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Legacy House
                  </button>
                </li>
                <li>
                  <span className="cursor-not-allowed text-[#4C4944]">3-Night Rituals</span>
                </li>
                <li>
                  <span className="cursor-not-allowed text-[#4C4944]">Scientific Geodes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-6">
            <h5 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-[#A6A18F]" />
              Divine Announcement Sign-up
            </h5>
            <p className="text-xs text-[#A39E96]">
              Subscribe to capture auspicious astrological transitions, lunar rituals, and receive a
              first-time ₹250 energizing credit.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              {subscribed ? (
                <div className="p-3 bg-[#1A1A1A] border border-[#D1CEBF] text-[#A6A18F] rounded-md text-xs tracking-wide">
                  ✔ Consecrated successfully! Check your cosmic coordinates soon.
                </div>
              ) : (
                <div className="flex border border-[#D1CEBF]/30 rounded-md bg-[#1A1A1A] overflow-hidden focus-within:border-[#A6A18F] transition-colors">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    placeholder="Enter your personal coordinates..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-transparent border-0 outline-none text-white placeholder-[#5E5950]"
                  />
                  <button
                    id="newsletter-submit-button"
                    type="submit"
                    className="bg-[#A6A18F] text-[#1A1A1A] px-4 hover:bg-[#F8F6F1]/80 hover:text-[#1A1A1A] transition-colors flex items-center justify-center cursor-pointer font-bold"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#D1CEBF]/10 text-center text-[10px] tracking-widest text-[#857F75] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {currentYear} SIGNTIFIC INDIA CORP. BRAND DESIGN DIALED TO ABSOLUTE MINIMALISM.</div>
        <div className="flex gap-6">
          <span className="hover:text-white transition-colors cursor-pointer">
            TERMS OF ASCENSION
          </span>
          <span className="hover:text-white transition-colors cursor-pointer">COSMIC PRIVACY</span>
          <span className="hover:text-white transition-colors cursor-pointer">Vedic Returns</span>
        </div>
      </div>
    </footer>
  );
}
