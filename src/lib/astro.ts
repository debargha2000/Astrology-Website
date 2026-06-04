import {
  Body, MakeTime, GeoVector, Ecliptic, SiderealTime, Observer,
  e_tilt, Rotation_ECL_EQD, Rotation_EQD_HOR, RotateVector,
  VectorFromSphere, Spherical, EquatorFromVector, Equator,
  SearchMoonNode, NextMoonNode, SearchRelativeLongitude,
  MoonPhase, SearchMoonPhase
} from 'astronomy-engine';
import type { BirthDetails, PlanetPosition, NatalChart, TransitAspect } from '../types';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
] as const;

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
  'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury'
] as const;

const PLANETS_FOR_POSITIONS: { body: Body; name: string }[] = [
  { body: Body.Sun, name: 'Sun' },
  { body: Body.Moon, name: 'Moon' },
  { body: Body.Mercury, name: 'Mercury' },
  { body: Body.Venus, name: 'Venus' },
  { body: Body.Mars, name: 'Mars' },
  { body: Body.Jupiter, name: 'Jupiter' },
  { body: Body.Saturn, name: 'Saturn' },
];

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function signFromLongitude(lon: number): string {
  const idx = Math.floor(normalizeAngle(lon) / 30);
  return SIGNS[idx % 12];
}

function degreeInSign(lon: number): number {
  return normalizeAngle(lon) % 30;
}

function nakshatraFromLongitude(lon: number): { name: string; lord: string; pada: number; sign: string } {
  const normalized = normalizeAngle(lon);
  const segment = 360 / 27;
  const index = Math.floor(normalized / segment);
  const pada = Math.floor((normalized % segment) / (segment / 4)) + 1;
  const signLon = (normalized / 360) * 12;
  const signIdx = Math.floor(signLon) % 12;
  return {
    name: NAKSHATRAS[index % 27],
    lord: NAKSHATRA_LORDS[index % 27],
    pada: Math.min(pada, 4),
    sign: SIGNS[signIdx]
  };
}

function getPlanetEclipticLongitude(body: Body, date: Date): number {
  const time = MakeTime(date);
  if (body === Body.Sun || body === Body.Moon) {
    const vec = GeoVector(body, time, false);
    const ecl = Ecliptic(vec);
    return ecl.elon;
  }
  const vec = GeoVector(body, time, false);
  const ecl = Ecliptic(vec);
  return ecl.elon;
}

function getPlanetHouse(lon: number, houseCusps: number[]): number {
  const normalized = normalizeAngle(lon);
  for (let i = 0; i < houseCusps.length; i++) {
    const start = normalizeAngle(houseCusps[i]);
    const end = normalizeAngle(houseCusps[(i + 1) % 12]);
    if (start < end) {
      if (normalized >= start && normalized < end) return i + 1;
    } else {
      if (normalized >= start || normalized < end) return i + 1;
    }
  }
  return 1;
}

function computeAscendant(lstHours: number, oblDeg: number, latDeg: number): number {
  const lstRad = lstHours * 15 * Math.PI / 180;
  const oblRad = oblDeg * Math.PI / 180;
  const latRad = latDeg * Math.PI / 180;
  const y = Math.cos(lstRad);
  const x = -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad));
  return normalizeAngle(Math.atan2(y, x) * 180 / Math.PI);
}

function computeMC(lstHours: number, oblDeg: number): number {
  const lstRad = lstHours * 15 * Math.PI / 180;
  const oblRad = oblDeg * Math.PI / 180;
  return normalizeAngle(Math.atan2(Math.sin(lstRad) * Math.cos(oblRad), Math.cos(lstRad)) * 180 / Math.PI);
}

function computeHouseCusps(lstHours: number, oblDeg: number, latDeg: number): number[] {
  const asc = computeAscendant(lstHours, oblDeg, latDeg);
  const mc = computeMC(lstHours, oblDeg);
  const desc = normalizeAngle(asc + 180);
  const ic = normalizeAngle(mc + 180);

  const cusps = [asc];
  const mcAscDiff = normalizeAngle(mc - asc);
  const ascDescDiff = normalizeAngle(desc - asc);

  for (let i = 1; i < 12; i++) {
    let cusp: number;
    if (i === 3) {
      cusp = mc;
    } else if (i === 6) {
      cusp = desc;
    } else if (i === 9) {
      cusp = ic;
    } else if (i < 3) {
      cusp = normalizeAngle(asc + (mcAscDiff * i / 3));
    } else if (i < 6) {
      cusp = normalizeAngle(mc + (ascDescDiff * (i - 3) / 3));
    } else if (i < 9) {
      cusp = normalizeAngle(desc + (normalizeAngle(ic - desc) * (i - 6) / 3));
    } else {
      cusp = normalizeAngle(ic + (normalizeAngle(asc - ic) * (i - 9) / 3));
    }
    cusps.push(cusp);
  }
  return cusps;
}

function isRetrograde(body: Body, date: Date): boolean {
  const t = MakeTime(date);
  const t1 = MakeTime(new Date(date.getTime() - 86400000));
  const lon1 = body === Body.Sun || body === Body.Moon
    ? Ecliptic(GeoVector(body, t, false)).elon
    : Ecliptic(GeoVector(body, t, false)).elon;
  const lon0 = body === Body.Sun || body === Body.Moon
    ? Ecliptic(GeoVector(body, t1, false)).elon
    : Ecliptic(GeoVector(body, t1, false)).elon;
  const diff = normalizeAngle(lon1 - lon0);
  return diff > 180;
}

function computeRahuKetu(date: Date): { rahu: number; ketu: number } {
  const time = MakeTime(date);
  const moonNode = SearchMoonNode(time);
  const rahuLon = Ecliptic(GeoVector(Body.Moon, moonNode.time, false)).elon;
  const ketuLon = normalizeAngle(rahuLon + 180);
  return { rahu: rahuLon, ketu: ketuLon };
}

function getAspectAngle(lon1: number, lon2: number): { angle: number; orb: number } {
  const diff = Math.abs(normalizeAngle(lon1 - lon2));
  const actualDiff = diff > 180 ? 360 - diff : diff;
  return { angle: actualDiff, orb: actualDiff };
}

function findTransits(natalPlanets: Record<string, number>, date: Date): TransitAspect[] {
  const aspects = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
    { name: 'Trine', angle: 120, orb: 6 },
    { name: 'Square', angle: 90, orb: 6 },
    { name: 'Sextile', angle: 60, orb: 4 },
  ];

  const transits: TransitAspect[] = [];
  const time = MakeTime(date);

  for (const { body, name: planetName } of PLANETS_FOR_POSITIONS) {
    const transitLon = getPlanetEclipticLongitude(body, date);

    for (const [natalName, natalLon] of Object.entries(natalPlanets)) {
      for (const aspect of aspects) {
        const { angle, orb } = getAspectAngle(transitLon, natalLon);
        const diffFromAspect = Math.abs(angle - aspect.angle);
        if (diffFromAspect <= aspect.orb) {
          transits.push({
            planet: planetName,
            natalPlanet: natalName,
            aspect: aspect.name,
            angle: angle,
            orb: diffFromAspect,
            isExact: diffFromAspect < 1
          });
        }
      }
    }
  }

  return transits.sort((a, b) => a.orb - b.orb).slice(0, 20);
}

function getUTCOffsetMinutes(date: Date, timezone: string): number {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = date.toLocaleString('en-US', { timeZone: timezone });
  return (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 60000;
}

export function computeNatalChart(details: BirthDetails): NatalChart | null {
  if (!details.birthDate) return null;

  const timeString = details.birthTime || '12:00:00';
  const localDate = new Date(details.birthDate + 'T' + timeString + ':00Z');
  if (isNaN(localDate.getTime())) return null;

  let date: Date;
  if (details.birthCoords?.timezone) {
    try {
      const offsetMinutes = getUTCOffsetMinutes(localDate, details.birthCoords.timezone);
      date = new Date(localDate.getTime() - offsetMinutes * 60000);
    } catch {
      date = localDate;
    }
  } else {
    date = localDate;
  }

  const hasTime = !!details.birthTime;
  const hasPlace = !!details.birthCoords;

  const time = MakeTime(date);
  const obs = hasPlace
    ? new Observer(details.birthCoords!.lat, details.birthCoords!.lon, 0)
    : new Observer(0, 0, 0);

  const gast = SiderealTime(time);
  const longitude = hasPlace ? details.birthCoords!.lon : 0;
  const lstHours = ((gast + longitude / 15) % 24 + 24) % 24;
  const tilt = e_tilt(time);
  const obl = tilt.tobl;
  const lat = hasPlace ? details.birthCoords!.lat : 0;

  const asc = computeAscendant(lstHours, obl, lat);
  const mc = computeMC(lstHours, obl);
  const houseCusps = hasPlace ? computeHouseCusps(lstHours, obl, lat) : [];

  const sunLon = getPlanetEclipticLongitude(Body.Sun, date);
  const moonLon = getPlanetEclipticLongitude(Body.Moon, date);

  const mercuryLon = getPlanetEclipticLongitude(Body.Mercury, date);
  const venusLon = getPlanetEclipticLongitude(Body.Venus, date);
  const marsLon = getPlanetEclipticLongitude(Body.Mars, date);
  const jupiterLon = getPlanetEclipticLongitude(Body.Jupiter, date);
  const saturnLon = getPlanetEclipticLongitude(Body.Saturn, date);

  const { rahu, ketu } = computeRahuKetu(date);

  const nakshatra = nakshatraFromLongitude(moonLon);

  const makePosition = (lon: number): PlanetPosition => ({
    sign: signFromLongitude(lon),
    longitude: normalizeAngle(lon),
    house: houseCusps.length > 0 ? getPlanetHouse(lon, houseCusps) : 0,
    degree: degreeInSign(lon),
    retrograde: false
  });

  const sunPos = makePosition(sunLon);
  const moonPos = { ...makePosition(moonLon), retrograde: false };
  const mercuryPos = { ...makePosition(mercuryLon), retrograde: isRetrograde(Body.Mercury, date) };
  const venusPos = { ...makePosition(venusLon), retrograde: isRetrograde(Body.Venus, date) };
  const marsPos = { ...makePosition(marsLon), retrograde: isRetrograde(Body.Mars, date) };
  const jupiterPos = { ...makePosition(jupiterLon), retrograde: isRetrograde(Body.Jupiter, date) };
  const saturnPos = { ...makePosition(saturnLon), retrograde: isRetrograde(Body.Saturn, date) };
  const rahuPos = makePosition(rahu);
  const ketuPos = makePosition(ketu);
  const ascPos = makePosition(asc);
  const mcPos = makePosition(mc);

  const natalPlanetLons: Record<string, number> = {
    Sun: sunLon, Moon: moonLon, Mercury: mercuryLon,
    Venus: venusLon, Mars: marsLon, Jupiter: jupiterLon, Saturn: saturnLon
  };

  const currentTransits = findTransits(natalPlanetLons, new Date());

  return {
    sun: sunPos,
    moon: moonPos,
    mercury: mercuryPos,
    venus: venusPos,
    mars: marsPos,
    jupiter: jupiterPos,
    saturn: saturnPos,
    rahu: rahuPos,
    ketu: ketuPos,
    ascendant: ascPos,
    mc: mcPos,
    nakshatra,
    houseCusps,
    currentTransits
  };
}

function determineSignFromDate(month: number, day: number): string {
  const dates = [
    [1, 20], [2, 19], [3, 21], [4, 20], [5, 21], [6, 21],
    [7, 23], [8, 23], [9, 23], [10, 23], [11, 22], [12, 22]
  ];
  for (let i = 0; i < 12; i++) {
    const [m, d] = dates[i];
    if (month === m && day <= d) return SIGNS[i];
    if (month === m && day > d) return SIGNS[(i + 1) % 12];
  }
  return 'Capricorn';
}

export {
  SIGNS, NAKSHATRAS, NAKSHATRA_LORDS,
  normalizeAngle, signFromLongitude, degreeInSign, nakshatraFromLongitude,
  getPlanetEclipticLongitude, computeAscendant, computeMC,
  computeHouseCusps, computeRahuKetu, findTransits,
  determineSignFromDate
};
