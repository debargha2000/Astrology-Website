import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, EyeOff, Music, Volume2, Wind } from 'lucide-react';

export default function PranayamaCalmGuide() {
  const [breathePhase, setBreathePhase] = useState<'In' | 'Hold In' | 'Out' | 'Hold Out'>('In');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundIntensity, setSoundIntensity] = useState<number>(0.15);
  
  // Audio API Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainOscRef = useRef<OscillatorNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Breathing loop cycle timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const runCycle = () => {
      setBreathePhase('In');
      timer = setTimeout(() => {
        setBreathePhase('Hold In');
        timer = setTimeout(() => {
          setBreathePhase('Out');
          timer = setTimeout(() => {
            setBreathePhase('Hold Out');
            timer = setTimeout(runCycle, 4000);
          }, 4000);
        }, 4000);
      }, 4000);
    };

    runCycle();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Web Audio Singing Bowl Synthesizer
  const toggleSoundBowl = () => {
    if (isPlayingSound) {
      // Fade out and stop securely
      if (gainNodeRef.current && audioCtxRef.current) {
        const ct = audioCtxRef.current.currentTime;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ct);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ct + 1.2);
        
        setTimeout(() => {
          try {
            mainOscRef.current?.stop();
            lfoRef.current?.stop();
          } catch (e) {}
          setIsPlayingSound(false);
        }, 1300);
      }
    } else {
      // Lazy init AudioContext
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Create Nodes
        const mainOsc = ctx.createOscillator();
        const overtoneOsc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const filterNode = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        // Tune to 432 Hz (Ancient frequency of cosmic alignment & calming)
        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(432, ctx.currentTime);

        // Add an organic subtle harmonic overtone (648Hz = perfect 5th for a rich resonance)
        overtoneOsc.type = 'sine';
        overtoneOsc.frequency.setValueAtTime(648, ctx.currentTime);
        const overtoneGain = ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.03, ctx.currentTime);

        // Synthesize slow acoustic beating frequency (tremolo/shimmer at 1.5Hz)
        lfo.frequency.setValueAtTime(1.5, ctx.currentTime);
        lfoGain.gain.setValueAtTime(6, ctx.currentTime); // Fine frequency modulation

        // Filter out high-frequency static for a velvety warm drone
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(500, ctx.currentTime);
        filterNode.Q.setValueAtTime(2.0, ctx.currentTime);

        // Connect everything smoothly
        lfo.connect(lfoGain);
        lfoGain.connect(mainOsc.frequency); // Modulate pitch of main bowl slightly for vibrato
        
        mainOsc.connect(filterNode);
        
        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(filterNode);

        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Gentle fade-in to prevent sharp click
        gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(soundIntensity, ctx.currentTime + 1.8);

        // Save refs
        mainOscRef.current = mainOsc;
        lfoRef.current = lfo;
        gainNodeRef.current = gainNode;
        filterNodeRef.current = filterNode;

        // Start oscillators
        mainOsc.start();
        overtoneOsc.start();
        lfo.start();
        setIsPlayingSound(true);
      } catch (err) {
        console.warn('AudioContext not supported or gesture blocked.');
      }
    }
  };

  // Harmonally modulate sound level in real-time as breathing phase scales up/down
  useEffect(() => {
    if (!isPlayingSound || !gainNodeRef.current || !audioCtxRef.current) return;
    const ct = audioCtxRef.current.currentTime;
    
    // Higher volume/filter cut-off during expansion phase, lower during release for a respiration effect
    if (breathePhase === 'In') {
      gainNodeRef.current.gain.linearRampToValueAtTime(soundIntensity * 1.3, ct + 3.8);
      filterNodeRef.current?.frequency.linearRampToValueAtTime(600, ct + 3.8);
    } else if (breathePhase === 'Out') {
      gainNodeRef.current.gain.linearRampToValueAtTime(soundIntensity * 0.7, ct + 3.8);
      filterNodeRef.current?.frequency.linearRampToValueAtTime(400, ct + 3.8);
    }
  }, [breathePhase, isPlayingSound, soundIntensity]);

  // Handle cleanup
  useEffect(() => {
    return () => {
      try {
        mainOscRef.current?.stop();
        lfoRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (e) {}
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20">
      <div className="bg-gradient-to-tr from-[#FAF7F2] to-[#F1EDE4] border border-[#D1CEBF]/40 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_15px_40px_-20px_rgba(166,161,143,0.15)] select-none">
        
        {/* Subtle decorative absolute rings */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 rounded-full border border-[#D1CEBF]/10 pointer-events-none auric-glow-layer" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-[#D1CEBF]/5 pointer-events-none" />

        {/* Column 1: Descriptive copy */}
        <div className="w-full md:w-1/2 space-y-6 relative z-10 text-center md:text-left select-text">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 rounded-full text-[9px] tracking-[0.25em] text-[#A6A18F] uppercase font-mono font-semibold">
            <Wind className="h-3 w-3 text-[#A6A18F]" />
            <span>MIND-CALMING PRANAYAMA SANCTUARY</span>
          </div>

          <h3 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] tracking-tight leading-tight">
            Align Your Breath with <br />
            <span className="italic text-[#A6A18F] font-normal">Himalayan Resonance</span>
          </h3>

          <p className="text-xs text-[#5E5950] font-light leading-relaxed max-w-md mx-auto md:mx-0">
            A premium sensory space engineered to steady your autonomic nervous system. Synchronize your breathing with the celestial expanding matrix while activating our authentic analog 432Hz Sound Bowl drone.
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start pt-2">
            
            {/* Play Sound Bowl Trigger */}
            <button
              onClick={toggleSoundBowl}
              className={`cursor-pointer px-5 py-3 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-sm active:scale-98 border ${
                isPlayingSound
                  ? 'bg-[#1A1A1A] text-white border-transparent hover:bg-[#322D2C]'
                  : 'bg-white text-[#1A1A1A] border-[#D1CEBF] hover:bg-[#FAF7F2]'
              }`}
            >
              <Music className={`h-4 w-4 ${isPlayingSound ? 'animate-pulse text-[#D4AF37]' : ''}`} />
              <span>{isPlayingSound ? 'Silence Sound Bowl' : 'Activate 432Hz Sound Bowl'}</span>
            </button>

            {/* Intensity Volume slider */}
            {isPlayingSound && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#D1CEBF]/40">
                <Volume2 className="h-3.5 w-3.5 text-[#A6A18F]" />
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.05"
                  value={soundIntensity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSoundIntensity(val);
                    if (gainNodeRef.current && audioCtxRef.current) {
                      gainNodeRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
                    }
                  }}
                  className="w-16 h-1 bg-[#E8E6E1] rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Interactive Breathing Core */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-10 py-6 md:py-0">
          <div className="relative h-64 w-64 flex items-center justify-center bg-white/40 border border-[#D1CEBF]/30 rounded-full shadow-inner">
            
            {/* Golden breathing visual rings */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={breathePhase}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 
                    breathePhase === 'In' ? 1.45 :
                    breathePhase === 'Hold In' ? 1.45 :
                    breathePhase === 'Out' ? 0.95 : 0.95,
                  opacity: [0.15, 0.25, 0.2],
                  rotate: breathePhase.includes('Hold') ? 180 : 0
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 4, 
                  ease: 'easeInOut'
                }}
                className={`absolute inset-4 rounded-full border border-dashed transition-colors duration-1000 ${
                  breathePhase.includes('Hold') 
                    ? 'border-[#D4AF37]/50 bg-radial from-[#F1EDE4]/20 to-[#D4AF37]/5' 
                    : 'border-[#A6A18F]/40 bg-radial from-[#FAF7F2]/30 to-[#A6A18F]/5'
                }`}
              />
            </AnimatePresence>

            {/* Inner dynamic core */}
            <motion.div
              animate={{
                scale: 
                  breathePhase === 'In' ? 1.3 :
                  breathePhase === 'Hold In' ? 1.3 :
                  breathePhase === 'Out' ? 1.0 : 1.0,
                backgroundColor: 
                  breathePhase === 'In' ? '#F4EDE1' :
                  breathePhase === 'Hold In' ? '#EAE3D4' :
                  breathePhase === 'Out' ? '#FAF7F2' : '#FDFBF7'
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="h-32 w-32 rounded-full border border-[#D1CEBF]/60 flex flex-col items-center justify-center text-center shadow-lg bg-[#FAF7F2] z-20"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A6A18F] font-bold">
                {breathePhase.includes('Hold') ? 'RETAIN' : 'PHASE'}
              </span>
              <motion.div 
                key={breathePhase}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.5 }}
                className="text-serif text-lg font-light text-[#1A1A1A] mt-1 italic leading-none"
              >
                {breathePhase}
              </motion.div>
            </motion.div>

            {/* Micro instructions under respiratory wave */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-[9px] font-mono tracking-widest text-[#A6A18F] uppercase font-bold bg-[#FAF7F2]/80 px-2.5 py-1 rounded-full border border-[#D1CEBF]/30">
                {breathePhase === 'In' && 'Inhale Purified Energy'}
                {breathePhase === 'Hold In' && 'Sustaining Aura Strength'}
                {breathePhase === 'Out' && 'Exhale Physical Tension'}
                {breathePhase === 'Hold Out' && 'Complete Restful Fold'}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
