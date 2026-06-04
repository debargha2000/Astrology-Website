import React from 'react';
import type { NatalChart } from '../../types';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SIGNS_SHORT = [' Ari', ' Tau', ' Gem', ' Can', ' Leo', ' Vir', ' Lib', ' Sco', ' Sag', ' Cap', ' Aqu', ' Pis'];
const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

interface NatalChartWheelProps {
  chart: NatalChart;
  className?: string;
}

export function NatalChartWheel({ chart, className = '' }: NatalChartWheelProps) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 145;
  const innerR = 105;
  const signR = 125;
  const planetR = 85;

  function lonToXY(lon: number, r: number): [number, number] {
    const rad = ((lon - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function signCenter(signIdx: number): number {
    return signIdx * 30 + 15;
  }

  const planetPositions = [
    { name: 'Sun', lon: chart.sun.longitude },
    { name: 'Moon', lon: chart.moon.longitude },
    { name: 'Mercury', lon: chart.mercury.longitude },
    { name: 'Venus', lon: chart.venus.longitude },
    { name: 'Mars', lon: chart.mars.longitude },
    { name: 'Jupiter', lon: chart.jupiter.longitude },
    { name: 'Saturn', lon: chart.saturn.longitude },
    { name: 'Rahu', lon: chart.rahu.longitude },
    { name: 'Ketu', lon: chart.ketu.longitude },
  ];

  const ascLon = chart.ascendant.longitude;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-[320px] mx-auto">
        {/* Background circle */}
        <circle cx={cx} cy={cy} r={outerR + 10} fill="#1C1A18" stroke="#C5A880" strokeWidth="0.5" opacity="0.5" />

        {/* Outer ring - zodiac signs */}
        {SIGNS.map((sign, i) => {
          const startLon = i * 30;
          const endLon = (i + 1) * 30;
          const [x1, y1] = lonToXY(startLon, outerR);
          const [x2, y2] = lonToXY(endLon, outerR);
          const [x3, y3] = lonToXY(endLon, innerR);
          const [x4, y4] = lonToXY(startLon, innerR);
          const midLon = signCenter(i);
          const [tx, ty] = lonToXY(midLon, signR);

          return (
            <g key={sign}>
              <path
                d={`M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`}
                fill={i % 2 === 0 ? '#1C1A18' : '#22201C'}
                stroke="#C5A880"
                strokeWidth="0.3"
                opacity="0.6"
              />
              <text
                x={tx} y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#C5A880"
                fontSize="7"
                fontFamily="serif"
                opacity="0.7"
              >
                {SIGNS_SHORT[i]}
              </text>
            </g>
          );
        })}

        {/* House cusp lines */}
        {chart.houseCusps.length > 0 && chart.houseCusps.map((cusp, i) => {
          const [x, y] = lonToXY(cusp, innerR);
          return (
            <line
              key={`house-${i}`}
              x1={cx} y1={cy}
              x2={x} y2={y}
              stroke="#C5A880"
              strokeWidth="0.3"
              opacity="0.3"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Ascendant line */}
        {(() => {
          const [ax, ay] = lonToXY(ascLon, outerR + 8);
          return (
            <polygon
              points={`${ax},${ay} ${ax - 3},${ay + 5} ${ax + 3},${ay + 5}`}
              fill="#C5A880"
              opacity="0.8"
            />
          );
        })()}

        {/* Aspect lines (simplified: conjunctions and oppositions only) */}
        {planetPositions.map((p1, i) =>
          planetPositions.slice(i + 1).map((p2, j) => {
            const diff = Math.abs(((p1.lon - p2.lon + 180) % 360) - 180);
            let color = 'transparent';
            let width = 0;
            if (diff < 8) { color = '#C5A880'; width = 0.5; }
            else if (Math.abs(diff - 180) < 8) { color = '#EF4444'; width = 0.5; }
            else if (Math.abs(diff - 120) < 6) { color = '#3B82F6'; width = 0.4; }
            else if (Math.abs(diff - 90) < 6) { color = '#F97316'; width = 0.4; }
            else if (Math.abs(diff - 60) < 4) { color = '#10B981'; width = 0.3; }

            if (width === 0) return null;
            const [x1, y1] = lonToXY(p1.lon, planetR - 10);
            const [x2, y2] = lonToXY(p2.lon, planetR - 10);
            return (
              <line
                key={`aspect-${i}-${j}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={width}
                opacity="0.4"
              />
            );
          })
        )}

        {/* Planet glyphs */}
        {planetPositions.map((p) => {
          const [px, py] = lonToXY(p.lon, planetR);
          return (
            <g key={p.name}>
              <circle cx={px} cy={py} r="10" fill="#1C1A18" stroke="#C5A880" strokeWidth="0.5" opacity="0.8" />
              <text
                x={px} y={py}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FAF8F5"
                fontSize="10"
              >
                {PLANET_GLYPHS[p.name]}
              </text>
            </g>
          );
        })}

        {/* Center decoration */}
        <circle cx={cx} cy={cy} r="6" fill="#1C1A18" stroke="#C5A880" strokeWidth="0.5" />
        <circle cx={cx} cy={cy} r="2" fill="#C5A880" opacity="0.6" />
      </svg>
    </div>
  );
}
