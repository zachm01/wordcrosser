import { type SetStateAction } from "react"

interface PuzzleContext {
  grid: string[];
  setGrid: React.Dispatch<SetStateAction<string[]>>;
  selectedCell: string;
  setSelectedCell: React.Dispatch<SetStateAction<string>>;
  highlightedClue: string;
  setHighlightedClue: React.Dispatch<SetStateAction<string>>;
  workingDirection: string;
  setWorkingDirection: React.Dispatch<SetStateAction<string>>;
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

export interface Clue {
  number: number;
  text: string;
  allCells: string[];
  set: string;
}

interface CluesProps {
  puzzleContext: PuzzleContext;
  clues: Clue[];
}

export type { PuzzleContext, RoundGridProps, RoundCellProps, CluesProps }