import { readJSON, writeJSON, STORAGE_KEYS } from '../../lib/storage';

export const SNAILS = [
  'Puchito',
  'Danisin',
  'Lentin',
  'Gruñon',
  'Rapidin',
  'Flashin',
] as const;

export const RACES_PER_DAY = 6;
const MAX_BETS_PER_RACE = 3;

export type SnailName = (typeof SNAILS)[number];

export interface RaceResult {
  raceNumber: number;
  winner: SnailName;
}

export interface Bet {
  raceNumber: number;
  snail: SnailName;
  won: boolean;
}

export interface DailyStats {
  date: string;
  races: RaceResult[];
  bets: Bet[];
}

type RandomFn = () => number;

function pickRandom<T>(items: readonly T[], random: RandomFn): T {
  return items[Math.floor(random() * items.length)];
}

function shuffle<T>(items: readonly T[], random: RandomFn): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateDailyStats(date: string, random: RandomFn = Math.random): DailyStats {
  const races: RaceResult[] = Array.from({ length: RACES_PER_DAY }, (_, index) => ({
    raceNumber: index + 1,
    winner: pickRandom(SNAILS, random),
  }));

  const bets: Bet[] = races.flatMap((race) => {
    const betCount = 1 + Math.floor(random() * MAX_BETS_PER_RACE);
    const chosenSnails = shuffle(SNAILS, random).slice(0, betCount);

    return chosenSnails.map((snail) => ({
      raceNumber: race.raceNumber,
      snail,
      won: snail === race.winner,
    }));
  });

  return { date, races, bets };
}

export function countWinsBySnail(races: RaceResult[]) {
  return SNAILS.map((snail) => ({
    snail,
    wins: races.filter((race) => race.winner === snail).length,
  }));
}

export function summarizeBets(bets: Bet[]) {
  const won = bets.filter((bet) => bet.won).length;
  return { won, lost: bets.length - won };
}

export function getTodayStats(): DailyStats {
  const today = new Date().toLocaleDateString('en-CA');
  const cached = readJSON<DailyStats | null>(STORAGE_KEYS.dailyStats, null);

  if (cached?.date === today) return cached;

  const stats = generateDailyStats(today);
  writeJSON(STORAGE_KEYS.dailyStats, stats);
  return stats;
}