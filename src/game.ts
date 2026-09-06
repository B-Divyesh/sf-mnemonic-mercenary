export type SymbolId = 'sun' | 'wave' | 'peak' | 'gate' | 'star';

export type GameSymbol = {
  id: SymbolId;
  label: string;
  glyph: string;
  cue: string;
};

export const symbols: GameSymbol[] = [
  { id: 'sun', label: 'Sun', glyph: '☼', cue: 'four-point sun' },
  { id: 'wave', label: 'Wave', glyph: '≈', cue: 'two waves' },
  { id: 'peak', label: 'Peak', glyph: '▲', cue: 'filled triangle' },
  { id: 'gate', label: 'Gate', glyph: '■', cue: 'solid square' },
  { id: 'star', label: 'Star', glyph: '✦', cue: 'four-point star' }
];

export type Fight = {
  enemy: string;
  tell: string;
  routeLength: number;
};

const enemyDeck: Omit<Fight, 'routeLength'>[] = [
  { enemy: 'Gutter scout', tell: 'It lowers its shoulder before a rush.' },
  { enemy: 'Tallow knight', tell: 'Its shield rises before the heavy swing.' },
  { enemy: 'Salt archivist', tell: 'It counts twice before it casts.' },
  { enemy: 'Rift hound', tell: 'It circles right before it leaps.' },
  { enemy: 'Ash courier', tell: 'It taps the ground before a feint.' },
  { enemy: 'Vault warden', tell: 'It rings its chain before the final strike.' }
];

const routeLengths = [3, 3, 4, 5, 6, 7];

export function hashSeed(seed: string): number {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function nextRandom(value: number): number {
  let next = value + 0x6d2b79f5;
  next = Math.imul(next ^ (next >>> 15), next | 1);
  next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
  return (next ^ (next >>> 14)) >>> 0;
}

export function getFight(seed: string, fightIndex: number): Fight {
  const rotation = hashSeed(seed) % enemyDeck.length;
  const enemy = enemyDeck[(fightIndex + rotation) % enemyDeck.length];
  return { ...enemy, routeLength: routeLengths[fightIndex] };
}

export function getRoute(seed: string, fightIndex: number): SymbolId[] {
  let value = hashSeed(`${seed}:${fightIndex}`);
  const length = routeLengths[fightIndex];
  const route: SymbolId[] = [];
  for (let index = 0; index < length; index += 1) {
    value = nextRandom(value);
    route.push(symbols[value % symbols.length].id);
  }
  return route;
}

export function symbolById(id: SymbolId): GameSymbol {
  const symbol = symbols.find((item) => item.id === id);
  if (!symbol) throw new Error(`Unknown symbol: ${id}`);
  return symbol;
}

export function isCorrectPrefix(route: SymbolId[], guess: SymbolId[]): boolean {
  return guess.every((symbol, index) => route[index] === symbol);
}

export function makeSeed(): string {
  const code = Math.floor(Math.random() * 9000 + 1000);
  return `route-${code}`;
}
