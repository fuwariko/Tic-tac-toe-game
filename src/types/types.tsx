export type CellValue = null | 'x' | 'o';
export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Bot {
  mistakeChance: number;
}