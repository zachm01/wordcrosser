import { useState } from "react"
import { Row } from "./row"

interface PuzzleProps {
  boxDims: [number, number] // [width, height] of puzzle's enclosing box
  rowTexts: string[]
  shape?: string[] // if left blank, the shape of the puzzle will be a rectangle defined by `boxDims`
}

export function Puzzle(props: PuzzleProps) {
  const [rowTexts, setRowTexts] = useState<string[]>(props.rowTexts)
  const w = props.boxDims[0]
  const h = props.boxDims[1]

  console.log(`here: ${rowTexts}`)

  return (
    <div>
      { rowTexts.map((text, j) => {
        if (j < h) return (
        <div key={j}>
          <Row text={text} length={w} isBottom={j === h - 1} />
        </div>
        )}
      )}
    </div>
  )
}