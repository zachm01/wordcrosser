import { RoundGrid } from './roundGrid'
import { ClueList } from './clueList'

import { Stage, Layer } from 'react-konva'
import { useEffect, useState } from 'react'

import puzzle from './crossword.json'
import type { PuzzleContext } from './props'

function App() {
  const [grid, setGrid] = useState<string[]>(puzzle.grid.map(row => row.split('').reverse().join('').toUpperCase()))
  const [selectedCell, setSelectedCell] = useState<string>("")
  const [highlightedClues, setHighlightedClues] = useState<string[]>([])
  const [workingDirection, setWorkingDirection] = useState<string>("clockwise")

  const context: PuzzleContext = {
    grid, setGrid,
    selectedCell, setSelectedCell,
    highlightedClues, setHighlightedClues,
    workingDirection, setWorkingDirection
  }

  const answers = puzzle.answers.map(row => row.split('').reverse().join('').toUpperCase())
  const clues = puzzle.clueSets

  let numberedCells = {}

  clues.forEach(clueSet => {
    clueSet.clues.forEach(clue => {
      Object.defineProperty(numberedCells, clue.allCells[0], {
        value: clue.number, writable: true, enumerable: true, configurable: true,
      })
    })
  })

  useEffect(() => {
    let newHighlightedClues = []
    for (let clueSet of clues) {
      for (let clue of clueSet.clues) {
        if (clue.allCells.includes(selectedCell)) {
          newHighlightedClues.push(`${clue.number}-${clue.set}`)
        }
      }
    }
    
    setHighlightedClues(newHighlightedClues)

    // if (Object.keys(numberedCells).includes(selectedCell)) {
    //   setHighlightedClue(numberedCells[selectedCell])
    // } else {
    //   setHighlightedClue(-1)
    // }
  }, [selectedCell])

  useEffect(() => {
    let rowsCorrect = 0
    grid.forEach((row, ix) => {
      if (row == answers[ix]) { rowsCorrect += 1 }
    })
    if (rowsCorrect === answers.length) { window.alert("You finished the puzzle!") }
  }, [grid])

  return (
    <>
      <div className="w-screen h-16 border-b-2 border-black flex flex-row items-center px-5">
        <span className="font-extrabold text-3xl">{puzzle.title}</span>
      </div>
      <div className="flex flex-row items-start justify-center py-6">

        <div>
          <div className="w-[32rem] h-24">
            <div className={highlightedClues.length != 0 ? "w-full p-2 bg-blue-300" : ""}>
              {
                clues.map(clueSet => {
                  for (let clue of clueSet.clues) {
                    if (clue.allCells.includes(selectedCell) && clue.set === workingDirection) {
                      return (
                        <>
                          <div className="font-bold text-md">
                            {clue.number}-{clueSet.name.toUpperCase()}
                          </div>
                          {clue.text}
                        </>
                      )
                    }
                  }
                })
              }
            </div>
          </div>
          <Stage
            height={500}
            width={500}
            offsetX={window.innerWidth / -2}
            offsetY={window.innerHeight / -2}
          >
            <Layer>
              <RoundGrid
                puzzleContext={context}
                numRows={puzzle.dimensions.numRows}
                rowSize={puzzle.dimensions.numCellsPerRow}
                arcAngle={360 / puzzle.dimensions.numRows}
                numberedCells={numberedCells}
                thickWallCells={puzzle.thickWallCells}
              />
            </Layer>
          </Stage>
        </div>

        <ClueList
          puzzleContext={context}
          clueSets={clues}
        />
      </div>
    </>
  )
}

export default App
