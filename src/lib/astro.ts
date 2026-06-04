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

const NAKSHATRA_FULL: { name: string; symbol: string; deity: string; nature: string; interpretation: string; lord: string }[] = [
  { name: 'Ashwini', symbol: 'Horse Head', deity: 'Ashwini Kumaras', nature: 'Swift/Healing', interpretation: 'You embody the spirit of swift healing and new beginnings. Your inner nature moves with the speed and grace of a horse, initiating action with courage and restoring balance through natural vitality.', lord: 'Ketu' },
  { name: 'Bharani', symbol: 'Yoni', deity: 'Yama', nature: 'Creative/Transformative', interpretation: 'You carry the creative force of life and the wisdom of transition. Ruled by Yama, you understand cycles of birth, death, and rebirth, and you transform restraint into artistic and spiritual power.', lord: 'Venus' },
  { name: 'Krittika', symbol: 'Razor', deity: 'Agni', nature: 'Purifying/Fierce', interpretation: 'Your inner fire cuts through illusion with precision. You are a purifying force, sharpening truth from confusion, and you lead with courage, clarity, and the warmth of focused intention.', lord: 'Sun' },
  { name: 'Rohini', symbol: 'Chariot', deity: 'Brahma', nature: 'Fertile/Indulgent', interpretation: 'You are magnetic, fertile, and deeply creative. Ruled by Brahma, you attract beauty, abundance, and devotion, and you flourish when cultivating the arts, nature, and sensual pleasures of life.', lord: 'Moon' },
  { name: 'Mrigashira', symbol: 'Deer Head', deity: 'Soma', nature: 'Searching/Curious', interpretation: 'Your soul is a gentle seeker, ever-curious and always searching for meaning. You wander with the grace of a deer, drawn to beauty, knowledge, and the soft light of intellectual and spiritual truth.', lord: 'Mars' },
  { name: 'Ardra', symbol: 'Teardrop', deity: 'Rudra', nature: 'Intense/Transformative', interpretation: 'You carry the storm and the tear that brings renewal. Ruled by Rudra, you transform pain into wisdom, destruction into creation, and you emerge from every storm with greater depth and strength.', lord: 'Rahu' },
  { name: 'Punarvasu', symbol: 'Bow and Arrow', deity: 'Aditi', nature: 'Renewing/Optimistic', interpretation: 'You are a source of renewal and boundless optimism. Like the mother of gods, you nurture growth, restore hope, and you return again and again to beginnings with the wisdom of experience.', lord: 'Jupiter' },
  { name: 'Pushya', symbol: 'Lotus', deity: 'Brihaspati', nature: 'Nourishing/Spiritual', interpretation: 'You embody nourishment, devotion, and spiritual abundance. The lotus rises from muddy waters, and so do you — flourishing through discipline, generosity, and connection to divine wisdom.', lord: 'Saturn' },
  { name: 'Ashlesha', symbol: 'Serpent', deity: 'Naga', nature: 'Mystical/Intuitive', interpretation: 'Your wisdom coils like a serpent, holding ancient mysteries and intuitive power. You see what others miss, you feel what others fear, and you transform through deep, kundalini-like inner fire.', lord: 'Mercury' },
  { name: 'Magha', symbol: 'Throne', deity: 'Pitrs', nature: 'Royal/Ancestral', interpretation: 'You carry the dignity of ancestral kings and queens. Your throne is built on lineage, tradition, and the wisdom of those who came before. You lead with inherited grace and quiet authority.', lord: 'Ketu' },
  { name: 'Purva Phalguni', symbol: 'Hammock', deity: 'Bhaga', nature: 'Pleasurable/Creative', interpretation: 'You are a creator of beauty, pleasure, and restful joy. Ruled by the god of delight, you find sacredness in leisure, love, and artistic expression, and you attract abundance through charm.', lord: 'Venus' },
  { name: 'Uttara Phalguni', symbol: 'Bed', deity: 'Aryaman', nature: 'Patronage/Friendly', interpretation: 'You build lasting partnerships and patronize the success of others. Your contracts are sacred, your friendships enduring, and you find joy in committing to love, art, and worthy causes.', lord: 'Sun' },
  { name: 'Hasta', symbol: 'Hand', deity: 'Savitar', nature: 'Skillful/Healing', interpretation: 'Your hands are channels of skilled creation and healing. You manifest ideas into form, you craft with dexterity, and you bring light into matter through practical, dexterous intelligence.', lord: 'Moon' },
  { name: 'Chitra', symbol: 'Jewel', deity: 'Vishvakarma', nature: 'Artistic/Bright', interpretation: 'You are a builder of brilliant beauty and architectural vision. Ruled by the celestial architect, you craft lasting works of art, design, and structure that shine with cosmic intelligence.', lord: 'Mars' },
  { name: 'Swati', symbol: 'Coral', deity: 'Vayu', nature: 'Independent/Liberal', interpretation: 'You are the wind — self-driven, flexible, and unattached. You thrive in freedom, you bend without breaking, and you carry the seeds of change wherever you go, scattering possibility with grace.', lord: 'Rahu' },
  { name: 'Vishakha', symbol: 'Archway', deity: 'Indra-Agni', nature: 'Determined/Goal-oriented', interpretation: 'You are a determined achiever who walks through the archway of victory. Your ambition is fueled by both divine authority and sacred fire, and you reach your goals through focused, transformative effort.', lord: 'Jupiter' },
  { name: 'Anuradha', symbol: 'Lotus', deity: 'Mitra', nature: 'Devoted/Friendship', interpretation: 'You are the lotus of devoted friendship. Your heart blossoms in loyal companionship, you honor commitments with grace, and you channel divine friendship into all your relationships.', lord: 'Saturn' },
  { name: 'Jyeshtha', symbol: 'Circular Talisman', deity: 'Indra', nature: 'Senior/Protective', interpretation: 'You carry the wisdom of the elder and the protection of sacred amulets. Your authority comes from experience, your power from responsibility, and you protect what you love with fierce devotion.', lord: 'Mercury' },
  { name: 'Mula', symbol: 'Tied Bunch', deity: 'Nirrti', nature: 'Investigative/Spiritual', interpretation: 'You are the root — the investigator who digs to the foundation. You pull up what is hidden, you destroy to renew, and you find spiritual liberation in letting go of all that is not essential.', lord: 'Ketu' },
  { name: 'Purva Ashadha', symbol: 'Tusk', deity: 'Apas', nature: 'Invincible/Flowing', interpretation: 'You are the invincible flow of water and the strength of the elephant\'s tusk. You persuade through grace, you cannot be subdued, and you channel divine inspiration into lasting, purifying form.', lord: 'Venus' },
  { name: 'Uttara Ashadha', symbol: 'Elephant Tusk', deity: 'Vishvadevas', nature: 'Victorious/Universal', interpretation: 'You are a universal victor whose word is law. Your commitments are unbreakable, your victories earned through patience, and you champion truth that serves the greater cosmic order.', lord: 'Sun' },
  { name: 'Shravana', symbol: 'Ear', deity: 'Vishnu', nature: 'Listening/Knowledgeable', interpretation: 'You are the eternal listener, the one who hears the universe. Your wisdom comes through deep attention, your learning is vast, and you connect with cosmic truth through humility and sacred listening.', lord: 'Moon' },
  { name: 'Dhanishta', symbol: 'Drum', deity: 'Vasus', nature: 'Wealthy/Musical', interpretation: 'You beat the drum of material and spiritual abundance. Your rhythm is prosperity, your song is fame, and you march to the beat of cosmic order, achieving wealth and recognition through discipline.', lord: 'Mars' },
  { name: 'Shatabhisha', symbol: 'Circle', deity: 'Varuna', nature: 'Healing/Mysterious', interpretation: 'You are the healer of the hidden hundred stars. Your medicine is mysterious, your boundaries cosmic, and you cure through the veil of secrecy, herbs, and divine intervention.', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', symbol: 'Sword', deity: 'Aja Ekapada', nature: 'Intense/Spiritual', interpretation: 'You carry the two-faced sword of spiritual intensity. You burn with ascetic fire, you sever illusions with precision, and you stand at the threshold between the material and the divine.', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', symbol: 'Twin', deity: 'Ahir Budhnya', nature: 'Deep/Profound', interpretation: 'You are the depth of the cosmic serpent, the profound wisdom of the deep sea. Your patience is infinite, your compassion vast, and you draw strength from the hidden depths of existence.', lord: 'Saturn' },
  { name: 'Revati', symbol: 'Fish', deity: 'Pushan', nature: 'Journeying/Nourishing', interpretation: 'You are the journeyer, the nourisher, the safe passage. Ruled by the protector of travelers, you guide souls home, you nurture with cosmic love, and you move between worlds with grace.', lord: 'Mercury' },
];

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

function nakshatraFromLongitude(lon: number): { name: string; lord: string; pada: number; sign: string; symbol: string; deity: string; nature: string; interpretation: string } {
  const normalized = normalizeAngle(lon);
  const segment = 360 / 27;
  const index = Math.floor(normalized / segment);
  const pada = Math.floor((normalized % segment) / (segment / 4)) + 1;
  const signLon = (normalized / 360) * 12;
  const signIdx = Math.floor(signLon) % 12;
  const idx = index % 27;
  const data = NAKSHATRA_FULL[idx];
  return {
    name: data.name,
    lord: data.lord,
    pada: Math.min(pada, 4),
    sign: SIGNS[signIdx],
    symbol: data.symbol,
    deity: data.deity,
    nature: data.nature,
    interpretation: data.interpretation,
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
            transitPlanet: planetName,
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
