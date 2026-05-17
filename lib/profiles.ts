import { readFileSync } from 'fs';
import path from 'path';

export type Profile = {
  id: string;
  display_name: string;
  bio: string;
  avatar_initials: string;
  avatar_color: string;
  prompts_count: number;
  joined: string; // ISO date string "YYYY-MM-DD"
};

const DATA_FILE = path.join(process.cwd(), 'data/profiles.json');

export function getProfiles(): Profile[] {
  const raw = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Profile[];
}

export function getProfileById(id: string): Profile | undefined {
  return getProfiles().find((p) => p.id === id);
}

/**
 * "2025-09-15" → "syyskuusta 2025"
 * Produces the Finnish elative case for the month name.
 */
export function formatJoinedFi(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number);
  const elative: Record<number, string> = {
    1: 'tammikuusta',
    2: 'helmikuusta',
    3: 'maaliskuusta',
    4: 'huhtikuusta',
    5: 'toukokuusta',
    6: 'kesäkuusta',
    7: 'heinäkuusta',
    8: 'elokuusta',
    9: 'syyskuusta',
    10: 'lokakuusta',
    11: 'marraskuusta',
    12: 'joulukuusta',
  };
  return `${elative[month]} ${year}`;
}
