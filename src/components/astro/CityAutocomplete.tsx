import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { geocodeCity, GeoResult } from '../../lib/geocode';

interface CityAutocompleteProps {
  value: string;
  coords?: { lat: number; lon: number; timezone: string };
  onChange: (place: string, coords?: { lat: number; lon: number; timezone: string }) => void;
  placeholder?: string;
  className?: string;
}

export function CityAutocomplete({ value, coords, onChange, placeholder = 'Birth city', className = '' }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const res = await geocodeCity(q);
    setResults(res);
    setOpen(res.length > 0);
    setHighlighted(-1);
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val, undefined);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handleSelect = (r: GeoResult) => {
    const label = r.admin1 ? `${r.name}, ${r.admin1}, ${r.country}` : `${r.name}, ${r.country}`;
    setQuery(label);
    onChange(label, { lat: r.latitude, lon: r.longitude, timezone: r.timezone });
    setOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange('', undefined);
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); handleSelect(results[highlighted]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A6A18F]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded-lg pl-10 pr-9 py-3 text-xs outline-none focus:border-[#A6A18F] text-[#1A1A1A] font-medium transition-colors"
        />
        {(query || loading) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A18F] hover:text-[#1A1A1A] transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-[#F8F6F1] border border-[#D1CEBF] rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={`${r.latitude}-${r.longitude}`}
              onClick={() => handleSelect(r)}
              onMouseEnter={() => setHighlighted(i)}
              className={`px-4 py-2.5 cursor-pointer flex items-start gap-2.5 text-xs transition-colors ${
                i === highlighted ? 'bg-[#E8E6E1]' : 'hover:bg-[#E8E6E1]'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-[#A6A18F] flex-shrink-0" />
              <div>
                <span className="font-medium text-[#1A1A1A]">{r.name}</span>
                {r.admin1 && <span className="text-[#857F75]">, {r.admin1}</span>}
                <span className="text-[#857F75]">, {r.country}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {coords && (
        <p className="mt-1.5 text-[10px] text-[#857F75] font-mono">
          {coords.lat.toFixed(2)}°{coords.lat >= 0 ? 'N' : 'S'}, {Math.abs(coords.lon).toFixed(2)}°{coords.lon >= 0 ? 'E' : 'W'} · {coords.timezone}
        </p>
      )}
    </div>
  );
}
