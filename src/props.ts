import { type SetStateAction } from "react"

interface PuzzleContext {
  grid: string[];
  setGrid: React.Dispatch<SetStateAction<string[]>>;
  selectedCell: string;
  setSelectedCell: React.Dispatch<SetStateAction<string>>;
  highlightedClue: number;
  setHighlightedClue: React.Dispatch<SetStateAction<number>>;
}

interface RoundGridProps {
  puzzleContext: PuzzleContext;
  numberedCells: object;
  numRows?: number;
  levelWidth?: number;
  rowSize?: number;
  arcAngle?: number;
  blankChar?: string;
  thickWallCells?: string[];
}

interface RoundCellProps {
  i: number;
  j: number;
  arcAngle: number;
  levelWidth: number;
  char: string;
  fill: string;
  handleSelect: (i: number, j: number) => void;
  number?: number | undefined;
  thickWall?: boolean;
}

interface Clue {
  number: number;
  text: string;
  numCell: string;
  allCells?: string[];
}

interface ClueSet {
  name: string;
  abbr: string;
  clues: Clue[];
}

interface CluesProps {
  puzzleContext: PuzzleContext;
  clueSets: ClueSet[];
}

export type { PuzzleContext, RoundGridProps, RoundCellProps, CluesProps }