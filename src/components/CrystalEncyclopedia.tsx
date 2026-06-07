/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, BookOpen, Layers, Gem, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { CRYSTAL_ENCYCLOPEDIA } from '../data';

export default function CrystalEncyclopedia() {
  const [selectedCrystal, setSelectedCrystal] = useState<string | null>('Citrine');
  const [filterChakra, setFilterChakra] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const crystals = Object.values(CRYSTAL_ENCYCLOPEDIA);

  const chakras = [
    { id: 'all', name: 'All Energy Centers' },
    { id: 'Solar Plexus', name: 'Solar Plexus (Abundance)' },
    { id: 'Root', name: 'Root (Shielding/Ground)' },
    { id: 'Crown', name: 'Crown & Third Eye (Serenity)' },
    { id: 'Throat', name: 'Throat (Intellect/Eloquence)' },
  ];

  const filteredCrystals = crystals.filter((c) => {
    const matchesChakra =
      filterChakra === 'all' || c.chakra.toLowerCase().includes(filterChakra.toLowerCase());
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.metaphysicalProperties.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChakra && matchesSearch;
  });

  const activeCrystalDetails = selectedCrystal ? CRYSTAL_ENCYCLOPEDIA[selectedCrystal] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-sans">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#A6A18F] font-medium block">
          Mineralogical & Metaphysical Database
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-[#1A1A1A] leading-tight">
          The Crystal Codex
        </h2>
        <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
          Stones are not mere accessories; they are highly ordered geometric lattices formed under
          thousands of atmospheric pressures. Explore their raw physics and dynamic metaphysical
          alignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Codex sidebar menu and filter mechanisms */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sizing box with search bar */}
          <div className="bg-[#F8F6F1] border border-[#D1CEBF] rounded-2xl p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#A6A18F]" />
              <input
                id="codex-query-input"
                type="text"
                placeholder="Search mineral database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#E5E3D8]/40 border border-[#D1CEBF] rounded-lg pl-10 pr-4 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium"
              />
            </div>

            {/* Chakra Filters */}
            <div className="space-y-1">
              <span className="block text-[10px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 mb-2 font-semibold">
                Filter by Chakra Node
              </span>
              <div className="space-y-1.5">
                {chakras.map((chak) => (
                  <button
                    id={`chakra-filter-${chak.id}`}
                    key={chak.id}
                    onClick={() => setFilterChakra(chak.id)}
                    className={`cursor-pointer w-full text-left px-3.5 py-2.5 rounded-lg text-xs tracking-wide transition-all font-medium ${
                      filterChakra === chak.id
                        ? 'bg-[#1A1A1A] text-[#A6A18F] font-semibold'
                        : 'text-[#1A1A1A]/70 bg-[#E5E3D8]/20 hover:bg-[#E5E3D8]/45'
                    }`}
                  >
                    {chak.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Crystalline Elements */}
          <div className="space-y-2">
            <span className="block text-[10px] font-mono tracking-wider uppercase text-[#1A1A1A]/60 font-semibold">
              Select Mineral Compound
            </span>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
              {filteredCrystals.map((cry) => {
                const isSelected = selectedCrystal === cry.name;
                return (
                  <button
                    id={`crystal-codex-btn-${cry.name}`}
                    key={cry.name}
                    onClick={() => setSelectedCrystal(cry.name)}
                    className={`cursor-pointer w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-[#A6A18F] bg-[#F8F6F1] text-[#1A1A1A] shadow-md'
                        : 'border-[#D1CEBF] bg-[#FAF7F2]/30 hover:bg-[#FAF7F2] text-[#1A1A1A]/75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: cry.hexColor }}
                      />
                      <span className="text-xs font-serif tracking-wide text-inherit font-light text-[14px]">
                        {cry.name}
                      </span>
                    </div>
                    <Layers
                      className={`h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity ${isSelected ? 'text-[#A6A18F]' : ''}`}
                    />
                  </button>
                );
              })}
              {filteredCrystals.length === 0 && (
                <div className="text-center py-8 text-xs text-[#A39E96]">
                  No crystal molecules matched search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Rich Encyclopedia sheet display */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeCrystalDetails ? (
              <motion.div
                key={activeCrystalDetails.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#F8F6F1] border border-[#D1CEBF] rounded-3xl p-6 md:p-8 space-y-8"
              >
                {/* Visual Accent Colored Header */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-6 border-b border-[#D1CEBF]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border border-black/10 animate-pulse"
                        style={{ backgroundColor: activeCrystalDetails.hexColor }}
                      />
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#A6A18F]">
                        Pure Grade-A Natural Element
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl font-light text-[#1A1A1A] tracking-wide">
                      {activeCrystalDetails.name}
                    </h3>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-[#FAF7F2]/45 border border-[#D1CEBF] font-mono text-[10px] text-[#A6A18F] font-semibold">
                    Resonates: {activeCrystalDetails.astrologicalSign}
                  </div>
                </div>

                {/* Physics Technical Specifications */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60 uppercase tracking-wider block font-semibold">
                      Chemical Formula
                    </span>
                    <span className="text-xs text-[#1A1A1A] font-mono font-medium leading-relaxed block bg-[#E5E3D8]/30 p-3 rounded-lg border border-[#D1CEBF]/40">
                      {activeCrystalDetails.formula}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60 uppercase tracking-wider block font-semibold">
                      Mohs Geological Hardness
                    </span>
                    <span className="text-xs text-[#1A1A1A] font-mono font-medium leading-relaxed block bg-[#E5E3D8]/30 p-3 rounded-lg border border-[#D1CEBF]/40">
                      {activeCrystalDetails.hardness}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60 uppercase tracking-wider block font-semibold">
                      Origin Deposit Coordinates
                    </span>
                    <span className="text-xs text-[#1A1A1A] font-mono font-medium leading-relaxed block bg-[#E5E3D8]/30 p-3 rounded-lg border border-[#D1CEBF]/40">
                      {activeCrystalDetails.origin}
                    </span>
                  </div>
                </div>

                {/* Energy Meridian Info / Chakra */}
                <div className="p-4 bg-[#FAF7F2]/40 border border-[#D1CEBF] rounded-xl flex gap-3.5 items-start">
                  <Activity className="h-5 w-5 text-[#A6A18F] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#1A1A1A]/60 uppercase tracking-wider block">
                      Primary Biological Chakra Resonance
                    </span>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed font-semibold">
                      {activeCrystalDetails.chakra}
                    </p>
                  </div>
                </div>

                {/* Metaphysical Properties Lists */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest block font-bold">
                    Thermodynamic & Astrological Attributes
                  </span>

                  <div className="space-y-3">
                    {activeCrystalDetails.metaphysicalProperties.map((prop, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <Gem className="h-4 w-4 text-[#A6A18F] shrink-0 mt-0.5" />
                        <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-light">
                          {prop}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sourcing / Geological Fact block */}
                <div className="p-5 bg-[#1A1A1A] text-[#F8F6F1] rounded-2xl font-sans text-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#A6A18F]/20 to-transparent rounded-full pointer-events-none" />
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#A6A18F] uppercase tracking-wider block font-semibold flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Core Sourcing & Geological Fact
                    </span>
                    <p className="leading-relaxed opacity-90 select-text font-light">
                      {activeCrystalDetails.scientificFacts}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="border border-dashed border-[#D1CEBF] rounded-3xl p-12 text-center h-[400px] flex flex-col items-center justify-center space-y-4">
                <p className="text-xs text-[#1A1A1A]/50">
                  Awaiting crystal selection. Please choose an element to project details.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
