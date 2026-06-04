import React from 'react';
import { Calendar, Clock, MapPin, User, HelpCircle } from 'lucide-react';
import { CityAutocomplete } from './CityAutocomplete';
import type { BirthDetails } from '../../types';

interface BirthDetailsFormProps {
  value: BirthDetails;
  onChange: (v: BirthDetails) => void;
  compact?: boolean;
  showName?: boolean;
  className?: string;
}

export function BirthDetailsForm({ value, onChange, compact = false, showName = true, className = '' }: BirthDetailsFormProps) {
  const update = (patch: Partial<BirthDetails>) => onChange({ ...value, ...patch });

  const inputClass = compact
    ? 'w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-3 py-2.5 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium transition-colors'
    : 'w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg px-4 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium transition-colors';

  const labelClass = 'flex items-center gap-2 text-[10px] font-mono text-[#A6A18F] uppercase tracking-widest font-bold mb-1.5';

  return (
    <div className={`space-y-4 ${className}`}>
      {showName && (
        <div>
          <label className={labelClass}><User className="h-3 w-3" /> Name</label>
          <input
            type="text"
            value={value.name || ''}
            onChange={e => update({ name: e.target.value })}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label className={labelClass}><Calendar className="h-3 w-3" /> Birth Date</label>
        <input
          type="date"
          value={value.birthDate || ''}
          onChange={e => update({ birthDate: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
          min="1900-01-01"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          <Clock className="h-3 w-3" /> Birth Time
          <span className="text-[#857F75] normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <input
          type="time"
          value={value.birthTime || ''}
          onChange={e => update({ birthTime: e.target.value || undefined })}
          className={inputClass}
        />
        <p className="mt-1 text-[10px] text-[#857F75] italic">
          If unknown, use 12:00 noon as a default for moon sign and ascendant.
        </p>
      </div>

      <div>
        <label className={labelClass}>
          <MapPin className="h-3 w-3" /> Birth Place
          <span className="text-[#857F75] normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <CityAutocomplete
          value={value.birthPlace || ''}
          coords={value.birthCoords}
          onChange={(place, coords) => update({ birthPlace: place || undefined, birthCoords: coords })}
          placeholder="City of birth"
        />
        {!value.birthCoords && value.birthPlace && value.birthPlace.length > 2 && (
          <p className="mt-1 text-[10px] text-[#857F75] italic flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            City not found. Sun sign shown from birth date.
          </p>
        )}
      </div>
    </div>
  );
}
