import { PLANET_INTERPRETATIONS, ASCENDANT_INTERPRETATIONS, ASPECT_MEANINGS } from '../src/lib/interpretations';
import { NAKSHATRA_DATA } from '../src/lib/nakshatraData';

export function buildAstroDefaults() {
  const entries: Array<{
    type: 'planet' | 'ascendant' | 'aspect' | 'nakshatra';
    key: string;
    title: string;
    interpretation: string;
    updatedAt: string;
    updatedBy: string;
  }> = [];

  const ts = new Date().toISOString();
  const author = 'system-defaults';

  for (const [planet, signs] of Object.entries(PLANET_INTERPRETATIONS)) {
    for (const [sign, text] of Object.entries(signs)) {
      entries.push({
        type: 'planet',
        key: `${planet}-${sign}`,
        title: `${planet} in ${sign}`,
        interpretation: text,
        updatedAt: ts,
        updatedBy: author,
      });
    }
  }

  for (const [sign, text] of Object.entries(ASCENDANT_INTERPRETATIONS)) {
    entries.push({
      type: 'ascendant',
      key: sign,
      title: `${sign} Ascendant`,
      interpretation: text,
      updatedAt: ts,
      updatedBy: author,
    });
  }

  for (const [key, text] of Object.entries(ASPECT_MEANINGS)) {
    entries.push({
      type: 'aspect',
      key,
      title: key.replace(/-/g, ' '),
      interpretation: text,
      updatedAt: ts,
      updatedBy: author,
    });
  }

  for (const n of NAKSHATRA_DATA) {
    entries.push({
      type: 'nakshatra',
      key: n.name,
      title: `${n.name} Nakshatra`,
      interpretation: `${n.name} — Ruled by ${n.lord}, deity ${n.deity}. Nature: ${n.nature}. Symbol: ${n.symbol}.`,
      updatedAt: ts,
      updatedBy: author,
    });
  }

  return entries;
}
