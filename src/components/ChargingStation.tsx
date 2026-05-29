/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PRODUCTS, RITUAL_IMAGE } from '../data';
import { Product } from '../types';
import { Sparkles, Play, CheckCircle, Moon, Sun, Flame, Wind, HelpCircle, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChargingStationProps {
  cartProducts: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ChargingStation({ cartProducts, onAddToCart }: ChargingStationProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedMantra, setSelectedMantra] = useState<'wealth' | 'protection' | 'serenity' | 'focus'>('wealth');
  const [ritualState, setRitualState] = useState<'idle' | 'washing' | 'moonlight' | 'solar' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [ritualLogs, setRitualLogs] = useState<string[]>([]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const mantras = {
    wealth: {
      name: 'Om Shreem Hreem Kleem Shourayaye Namah (Kubera Abundance)',
      description: 'Invokes cosmic wealth, breaks financial bottlenecks, and grounds entrepreneurial cash flows.'
    },
    protection: {
      name: 'Om Ham Hanumate Rudratmakaya Hung Phat (Aegis Shield)',
      description: 'Builds an indestructible energetic firewall to deflect third-party envy, nazar, and workplace malice.'
    },
    serenity: {
      name: 'Om Tryambakam Yajamahe Sugandhim (Mahamrityunjaya Sanative)',
      description: 'Soothes nervous stress, quietens mental static, and anchors alpha sleeping wavelengths.'
    },
    focus: {
      name: 'Om Sri Saraswatyai Namah (Intellectual Mercury Aperture)',
      description: 'Open communication channels, bolsters long-term memory recall, and sharpens analytical clarity.'
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (ritualState !== 'idle' && ritualState !== 'complete') {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1.5;
          if (next >= 100) {
            transitionRitualState();
            return 0;
          }
          return next;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [ritualState]);

  const addLog = (message: string) => {
    setRitualLogs((prev) => [message, ...prev.slice(0, 5)]);
  };

  const transitionRitualState = () => {
    if (ritualState === 'washing') {
      setRitualState('moonlight');
      addLog('✓ Liquid Sanctification ended. Transitioning to Lunar charging nodes.');
      addLog('Night 2 Active: Absorbing moon rays into molecular lattices.');
    } else if (ritualState === 'moonlight') {
      setRitualState('solar');
      addLog('✓ Moon bathing complete. Engaging final Solar anchoring rise.');
      addLog('Night 3 Active: Sealing cosmic vectors with pure golden solar spectrum paths.');
    } else if (ritualState === 'solar') {
      setRitualState('complete');
      addLog('✓ Astro-Ritual complete. Holy certificate of Consecration sealed.');
    }
  };

  const startRitual = () => {
    setRitualLogs([]);
    setProgress(0);
    setRitualState('washing');
    addLog('Night 1 Initiated: Dipping stones into Panchamrut (Raw milk, honey, sacred Ganges water).');
    addLog(`Vedic Chanting Active: Focusing "${mantras[selectedMantra].name}" at 432Hz vibration...`);
  };

  const resetRitual = () => {
    setRitualState('idle');
    setProgress(0);
    setRitualLogs([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans">
      
      {/* Editorial Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A6A18F] font-medium block">
          Astral Charge Simulator
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-[#1A1A1A] leading-tight">
          Vedic Consecration Chamber
        </h2>
        <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
          Before taking delivery, our jewelry experiences a mandatory 3-Nights ritual. Interactively witness how we cleanse molecular stress paths in natural geode gems and program them with ancient acoustic mantra frequencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column: Setup & choices */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* select box for product to charge */}
          <div className="p-6 bg-[#F8F6F1] border border-[#D1CEBF] rounded-2xl space-y-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-2 font-semibold">
                1. Select Crystal to Align
              </label>
              <select
                id="ritual-product-select"
                value={selectedProduct.id}
                onChange={(e) => {
                  const prod = PRODUCTS.find((p) => p.id === e.target.value);
                  if (prod) {
                    setSelectedProduct(prod);
                    resetRitual();
                  }
                }}
                className="w-full bg-[#E5E3D8]/40 border border-[#D1CEBF] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium"
              >
                {PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>

            {/* details of crystal block */}
            <div className="p-3.5 bg-[#E5E3D8]/30 rounded-xl border border-[#D1CEBF]/40 flex items-center gap-3">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 object-cover rounded-md border border-[#D1CEBF]/30"
              />
              <div>
                <span className="block text-xs font-serif font-light text-[#1A1A1A] max-w-[200px] truncate">
                  {selectedProduct.name}
                </span>
                <span className="block text-[9px] font-mono text-[#A6A18F] capitalize">
                  {selectedProduct.category} Collection
                </span>
              </div>
            </div>
          </div>

          {/* Mantra Select Box */}
          <div className="p-6 bg-[#F8F6F1] border border-[#D1CEBF] rounded-2xl space-y-4">
            <span className="block text-[10px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 font-semibold">
              2. Inject Acoustic Vibration
            </span>

            <div className="space-y-2">
              {(Object.keys(mantras) as Array<keyof typeof mantras>).map((key) => {
                const isActive = selectedMantra === key;
                return (
                  <button
                    id={`mantra-select-${key}`}
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedMantra(key);
                      resetRitual();
                    }}
                    className={`cursor-pointer w-full text-left p-3 rounded-xl border text-xs transition-all flex justify-between items-center ${
                      isActive
                        ? 'border-[#A6A18F] bg-[#1A1A1A] text-white'
                        : 'border-[#D1CEBF] bg-[#E5E3D8]/40 hover:bg-[#E5E3D8]/65 text-[#1A1A1A]'
                    }`}
                  >
                    <div>
                      <span className="block font-serif tracking-wider font-light mb-0.5 capitalize text-[13px] text-inherit">
                        {key} Focus Resonance
                      </span>
                      <span className={`block text-[9px] line-clamp-1 ${isActive ? 'text-[#A6A18F]' : 'text-[#857F75]'}`}>
                        {mantras[key].name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Middle/Right: Interactive Visual Charge bowl or stage */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-6">
          
          {/* Main Simulated Area container */}
          <div className="relative aspect-video w-full rounded-3xl border border-[#C5A880]/20 bg-[#151313] shadow-2xl overflow-hidden flex items-center justify-center p-6 min-h-[400px]">
            {/* Background image under-glow */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img
                src={RITUAL_IMAGE}
                alt="Vedic Ritual Backdrop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter blur-[2px]"
              />
            </div>

            {/* Glowing auric circles depending on state */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none">
              <AnimatePresence>
                {ritualState === 'washing' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-64 w-64 rounded-full bg-[#5EB6E6]/10 border-2 border-[#5EB6E6]/30 filter blur-xl"
                  />
                )}
                {ritualState === 'moonlight' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="h-80 w-80 rounded-full bg-blue-300/10 border border-blue-400/25 filter blur-2xl"
                  />
                )}
                {ritualState === 'solar' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="h-72 w-72 rounded-full bg-[#D4AF37]/15 border-2 border-[#D4AF37]/35 filter blur-xl animate-pulse"
                  />
                )}
                {ritualState === 'complete' && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: 0.8 }}
                    className="h-96 w-96 rounded-full bg-[#2E5A27]/5 border border-[#2E5A27]/10 filter blur-xl"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Celestial elements display */}
            <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-mono tracking-widest leading-none">
              {ritualState === 'washing' && (
                <span className="text-[#5EB6E6] flex items-center gap-1.5 uppercase animate-pulse">
                  <Wind className="h-3.5 w-3.5 animate-spin" /> Day 1: Hydromineral Cleanse
                </span>
              )}
              {ritualState === 'moonlight' && (
                <span className="text-blue-300 flex items-center gap-1.5 uppercase">
                  <Moon className="h-4 w-4 text-slate-300" /> Day 2: Lunar Bathing active
                </span>
              )}
              {ritualState === 'solar' && (
                <span className="text-[#D4AF37] flex items-center gap-1.5 uppercase">
                  <Sun className="h-4 w-4 animate-spin text-[#D4AF37]" /> Day 3: Solar Locking active
                </span>
              )}
              {ritualState === 'complete' && (
                <span className="text-[#86EFAC] flex items-center gap-1.5 uppercase">
                  <CheckCircle className="h-4 w-4" /> Consecration fulfilled
                </span>
              )}
              {ritualState === 'idle' && (
                <span className="text-white/40 uppercase">Chamber Offline</span>
              )}
            </div>

            {/* Core Interactive Centerpiece (Bracelet visual and floating glyphs) */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {ritualState === 'idle' && (
                  <motion.div
                    key="idle-bracelet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="h-32 w-32 rounded-full border-2 border-dashed border-[#FAF7F2]/20 flex items-center justify-center p-3 hover:border-[#D4AF37]/40 transition-colors duration-500">
                      <img
                        src={selectedProduct.imageUrl}
                        alt="Resting Crystal"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover rounded-full border-2 border-white/10 shadow-lg select-none pointer-events-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs text-[#FAF7F2]/60 font-mono tracking-widest uppercase">
                        Crystal Resting in Bronze Singing Basin
                      </h4>
                      <p className="text-[10px] text-[#A39E96] font-mono max-w-xs mx-auto">
                        Acoustic waves: 0Hz • Mineral state: Unaligned
                      </p>
                    </div>
                  </motion.div>
                )}

                {(ritualState === 'washing' || ritualState === 'moonlight' || ritualState === 'solar') && (
                  <motion.div
                    key="running-bracelet"
                    className="space-y-6"
                  >
                    <div className="relative h-32 w-32 mx-auto">
                      {/* Rotating aura rings */}
                      <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-spin" style={{ animationDuration: '8s' }} />
                      <div className="absolute -inset-4 rounded-full border border-dashed border-white/10 animate-spin" style={{ animationDuration: '14s' }} />
                      
                      {/* Central pulsating bracelet */}
                      <div className={`h-full w-full rounded-full overflow-hidden p-2 bg-black/40 border-2 ${
                        ritualState === 'washing' ? 'border-[#5EB6E6]' :
                        ritualState === 'moonlight' ? 'border-blue-300 animate-pulse' : 'border-[#D4AF37]'
                      }`}>
                        <img
                          src={selectedProduct.imageUrl}
                          alt="Energizing bracelet"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover rounded-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-serif font-light text-white tracking-widest uppercase animate-pulse">
                        Sanskrit Mantras Infusing Molecular Lattice
                      </h4>
                      <div className="max-w-md bg-white/5 border border-white/5 rounded-lg px-4 py-2 font-mono text-[9px] text-[#C5A880] select-all animate-pulse">
                        “ {mantras[selectedMantra].name} ”
                      </div>
                    </div>
                  </motion.div>
                )}

                {ritualState === 'complete' && (
                  <motion.div
                    key="complete-certificate"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5 py-4 max-w-sm"
                  >
                    <div className="h-14 w-14 rounded-full bg-[#E3EFE0]/15 border border-[#86EFAC]/35 flex items-center justify-center text-[#86EFAC] mx-auto">
                      <CheckCircle className="h-7 w-7" />
                    </div>
                    
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2.5 font-sans relative">
                      <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono leading-none">
                        Certificate of Divine Consecration
                      </div>
                      <h4 className="text-base font-serif font-light text-white text-center leading-tight">
                        {selectedProduct.name}
                      </h4>
                      <div className="border-t border-white/10 pt-2 text-[9px] font-mono text-[#A39E96] space-y-1">
                        <div className="flex justify-between">
                          <span>Acoustic Programmed:</span>
                          <span className="text-[#C5A880] font-semibold uppercase">{selectedMantra}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mineral Integrity:</span>
                          <span className="text-white">Grade A+ (Tested)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vedic Signature Ref:</span>
                          <span className="text-white select-all">STF-{Math.floor(Math.random() * 900000 + 100000)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Progress Bar indicators if active */}
            {(ritualState === 'washing' || ritualState === 'moonlight' || ritualState === 'solar') && (
              <div className="absolute bottom-6 left-6 right-6 space-y-1.5 z-10 font-mono">
                <div className="flex justify-between text-[10px] text-[#A39E96]">
                  <span className="uppercase">Vedic Program Progress</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <div className="h-1 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] transition-all duration-75" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Trigger block */}
          <div className="flex flex-col md:flex-row gap-4 w-full justify-between items-center bg-[#F8F6F1] border border-[#D1CEBF] p-6 rounded-2xl shadow-sm">
            <div className="text-left space-y-1">
              <h5 className="font-serif text-sm tracking-wide text-[#1A1A1A]">
                Acoustic focus: <span className="capitalize font-semibold">{selectedMantra}</span>
              </h5>
              <p className="text-xs text-[#1A1A1A]/70 max-w-md font-light">
                {mantras[selectedMantra].description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {ritualState !== 'idle' && (
                <button
                  id="reset-chamber-btn"
                  onClick={resetRitual}
                  className="cursor-pointer bg-[#E5E3D8]/40 hover:bg-[#E5E3D8]/70 border border-[#D1CEBF] text-[#1A1A1A] px-4 py-3 rounded-lg text-xs font-mono font-medium uppercase tracking-widest transition-colors"
                >
                  Reset Chamber
                </button>
              )}

              {ritualState === 'idle' || ritualState === 'complete' ? (
                <button
                  id="start-consecration-btn"
                  onClick={startRitual}
                  className="cursor-pointer bg-[#1A1A1A] hover:bg-[#322D2C] text-white px-6 py-3.5 rounded-lg text-xs font-mono font-medium uppercase tracking-widest flex items-center gap-1.5 transition-colors border border-[#D1CEBF]/20"
                >
                  <Play className="h-4 w-4 fill-current text-[#A6A18F]" />
                  Initiate 3-Nights Consecration
                </button>
              ) : null}
            </div>
          </div>

          {/* Realtime Terminal ritual log trace */}
          <div className="w-full bg-[#E5E3D8]/30 border border-[#D1CEBF] rounded-2xl p-5 font-mono space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-widest text-[#A6A18F] uppercase font-bold">
                Consecration Log Trace (Real-time)
              </span>
              <span className="text-[9px] text-[#A6A18F]/70 font-semibold">STATUS: ONLINE</span>
            </div>
            
            <div className="text-[11px] text-[#1A1A1A]/85 space-y-1.5 h-[100px] overflow-y-auto pr-2 select-text leading-relaxed">
              {ritualLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#1A1A1A]/50">
                  Basin awaiting crystallization triggers. Press start to observe.
                </div>
              ) : (
                ritualLogs.map((log, idx) => (
                  <div key={idx} className={`${idx === 0 ? 'text-[#1A1A1A] font-semibold' : 'text-[#1A1A1A]/60'}`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
