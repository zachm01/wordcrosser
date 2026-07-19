import { Stage, Layer } from 'react-konva'
import { useEffect, useState } from 'react'

import { RoundGrid } from './roundGrid'
import { ClueList } from './clueList'
import type { PuzzleContext } from './props'
import puzzle from './crossword.json'


const renderTime = (timerSecs: number) => {
  let hours = Math.floor(timerSecs / 3600);
  let minutes = Math.floor((timerSecs - (hours * 3600)) / 60);
  let seconds = timerSecs - (hours * 3600) - (minutes * 60);

  return `${hours > 0 ? `${hours}:` : ''}${(minutes < 10 && hours > 0) ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}


function App() {
  const [grid, setGrid] = useState<string[]>(puzzle.grid.map(row => row.split('').reverse().join('').toUpperCase()))
  const [selectedCell, setSelectedCell] = useState<string>("")
  const [highlightedClue, setHighlightedClue] = useState<string>("")
  const [workingDirection, setWorkingDirection] = useState<string>("clockwise")
  const [puzzleChecked, setPuzzleChecked] = useState<boolean>(false)
  const answerKey = puzzle.answers.map(row => row.split('').reverse().join('').toUpperCase())
  const clues = puzzle.clues

  const [timer, setTimer] = useState<number>(10)
  const [timerRunning, setTimerRunning] = useState<boolean>(true)

  useEffect(() => {
    let t = setTimeout(() => {
      if (timerRunning) { setTimer(c => c + 1) }
    }, 1000);
    return () => { if (t) { clearTimeout(t) } }
  }, [timer, timerRunning])

  const context: PuzzleContext = {
    grid, setGrid, answerKey,
    selectedCell, setSelectedCell,
    clues, highlightedClue, setHighlightedClue,
    workingDirection, setWorkingDirection,
    puzzleChecked, setPuzzleChecked
  }

  let numberedCells = {}

  clues.forEach(clue => {
    Object.defineProperty(numberedCells, clue.allCells[0], {
      value: clue.number, writable: true, enumerable: true, configurable: true,
    })
  })

  useEffect(() => {
    for (let clue of clues) {
      if (clue.set.toLowerCase() != workingDirection)  { continue }
      if (clue.allCells.includes(selectedCell)) {
        setHighlightedClue(`${clue.number}-${clue.set}`)
        return
      }
    }
    setHighlightedClue("")
  }, [selectedCell, workingDirection])

  useEffect(() => {
    let rowsCorrect = 0
    grid.forEach((row, ix) => {
      if (row == answerKey[ix]) { rowsCorrect += 1 }
    })
    if (rowsCorrect === answerKey.length) { window.alert("You finished the puzzle!") }
  }, [grid])

  return (
    <>
      <div className="w-screen h-16 border-b-2 border-black flex flex-row justify-between items-center px-5">
        <span className="font-extrabold text-3xl">{puzzle.title}</span>
        <span
          className="text-md cursor-pointer"
          onClick={() => {setPuzzleChecked(!puzzleChecked)}}
        >
          Check
        </span>
      </div>
      <div className="flex justify-center">
        <div className="flex items-center justify-between w-24 py-2">
          <span className="w-16 flex justify-end">
            {renderTime(timer)}
          </span>
          <button onClick={() => setTimerRunning(!timerRunning)}>
            <svg className="fill-gray-400 hover:fill-gray-700" width="16" height="16" viewBox="0 0 6.35 6.35">
              <rect width="1.852" height="6.35" x=".794" ry="0"/>
              <rect width="1.852" height="6.35" x="3.704" ry="0"/>
            </svg>
        </button>
        </div>
      </div>
      <div className="flex flex-row items-start justify-center pb-6">

        <div>
          <div className="w-[32rem] h-24">
            <div className={highlightedClue != "" ? "w-full p-2 bg-blue-300" : ""}>
              {
                clues.map(clue => {
                  if (clue.allCells.includes(selectedCell) && clue.set === workingDirection) {
                    return (
                      <>
                        <div className="font-bold text-md">
                          {clue.number}-{clue.set.toUpperCase()}
                        </div>
                        {clue.text}
                      </>
                    )
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
          clues={clues}
        />
      </div>
    </>
  )
}

export default App
