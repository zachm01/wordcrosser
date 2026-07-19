import { RoundCell } from "./roundCell"
import { type RoundGridProps } from "./props"

const LEVEL_WIDTH = 40
const NUM_ROWS = 9
const ROW_SIZE = 6
const ARC_ANGLE = 360 / NUM_ROWS
const BLOCK_CHAR = "."

const emptyFill = "#ffffff"
const selectedFill = "#fedd3a"
const adjSelectedFill = "#8cd4fb"
const incorrectFill = "#f9aaaa"
const incorrectSelectedFill = "#ffa600"
const incorrectAdjSelectedFill = "#fb8cba"
const blockFill = "#000000"

export function RoundGrid(props: RoundGridProps) {
  const rowSize = props.rowSize ?? ROW_SIZE
  const arcAngle = props.arcAngle ?? ARC_ANGLE
  const blockChar = props.blockChar ?? BLOCK_CHAR
  const numRows = props.numRows ?? NUM_ROWS
  const levelWidth = props.levelWidth ?? LEVEL_WIDTH
  const numberedCells = props.numberedCells ?? {}
  const thickWallCells = props.thickWallCells ?? []
  const [selected, setSelected] = [props.puzzleContext.selectedCell, props.puzzleContext.setSelectedCell]
  const [workingDirection, setWorkingDirection] = [props.puzzleContext.workingDirection, props.puzzleContext.setWorkingDirection]
  // const [rowWords, setRowWords] = useState<string[]>(props.rowWords.map(word => word.toUpperCase()))
  const grid = props.puzzleContext.grid
  const setGrid = props.puzzleContext.setGrid
  const answerKey = props.puzzleContext.answerKey
  const puzzleChecked = props.puzzleContext.puzzleChecked
  
  if (grid.length < rowSize) { setGrid(grid.concat(blockChar.repeat(rowSize - grid.length))) }
  
  const keydownHandler = (e: KeyboardEvent) => {
    window.removeEventListener('keydown', keydownHandler)
    if (!selected) { return }
    
    // if e.key is a single alphabetical character or whitespace
    if (/^[a-zA-Z\s]$/.test(e.key)) { typeLetter(e.key) }
    // if the user is backspacing

    switch (e.key) {
      case "Backspace":
        deleteLetter(); break;
      case "ArrowLeft":
        moveSelected(workingDirection === "clockwise" ? "clockwise" : "outward"); break;
      case "ArrowRight":
        moveSelected(workingDirection === "clockwise" ? "anticlockwise" : "inward"); break;
      case "ArrowUp":
        setWorkingDirection(workingDirection === "clockwise" ? "inward" : "clockwise"); break;
      case "ArrowDown":
        setWorkingDirection(workingDirection === "clockwise" ? "inward" : "clockwise"); break;
      case "Enter":
        let [_clueNum, _clueSet] = props.puzzleContext.highlightedClue.split("-")
        const clueNum = parseInt(_clueNum)
        const clueSet = _clueSet.toLowerCase()

        let nextClue = props.puzzleContext.clues.find(
          clue => clue.number === clueNum + 1 && clue.set === clueSet
        )

        if (!nextClue) {
          const clueSets = Array.from(new Set(props.puzzleContext.clues.map(clue => clue.set)))
          const nextClueSet = clueSets.find(set => set != props.puzzleContext.workingDirection)
          nextClue = props.puzzleContext.clues.find(
            clue => clue.set === nextClueSet
          )
        }

        if (!nextClue) { break }

        props.puzzleContext.setWorkingDirection(nextClue.set)
        props.puzzleContext.setSelectedCell(nextClue.allCells[0])
  
        break
    }

    window.removeEventListener('keydown', keydownHandler)
  }

  const moveSelected = (direction: string) => {
    let selectedI = parseInt(selected.split(',')[0])
    let selectedJ = parseInt(selected.split(',')[1])

    switch (direction) {
      case "clockwise":
        if (grid[(selectedI + 1) % numRows][selectedJ] !== blockChar) {
          setSelected(`${(selectedI + 1) % numRows},${selectedJ}`)
        } break;
      case "anticlockwise":
        if (grid[(selectedI - 1 + numRows) % numRows][selectedJ] !== blockChar) {
          setSelected(`${(selectedI - 1 + numRows) % numRows},${selectedJ}`)
        } break;
      case "inward":
        if (grid[selectedI][(selectedJ - 1 + rowSize) % rowSize] !== blockChar) {
          setSelected(`${selectedI},${(selectedJ - 1 + rowSize) % rowSize}`)
        } break;
      case "outward":
        if (grid[selectedI][(selectedJ + 1 + rowSize) % rowSize] !== blockChar) {
          setSelected(`${selectedI},${(selectedJ + 1 + rowSize) % rowSize}`)
        } break;
    }
  }

  const changeLetter = (i: number, j: number, letter: string): string[] => {
    let newRowWords = [...grid]
    newRowWords[i] = grid[i]
      .split("")
      .map((char, jx) => {
        if (jx === j) { return letter.toUpperCase() }
        else { return char }
      }).join("")
    
    return newRowWords
  }

  const typeLetter = (letter: string) => {
    let selectedI = parseInt(selected.split(',')[0])
    let selectedJ = parseInt(selected.split(',')[1])

    if ((selectedI !== undefined) && (selectedJ != undefined)) {
      let newRowWords = changeLetter(selectedI, selectedJ, letter)
      setGrid(newRowWords)
      moveSelected(workingDirection)
    }
  }

  const deleteLetter = () => {
    let selectedI = parseInt(selected.split(',')[0])
    let selectedJ = parseInt(selected.split(',')[1])

    if ((selectedI !== undefined) && (selectedJ != undefined)) {
      let newRowWords = changeLetter(selectedI, selectedJ, " ")
      setGrid(newRowWords)
      moveSelected(workingDirection === "clockwise" ? "anticlockwise" : "outward")
    }
  }

  window.addEventListener('keydown', keydownHandler)
  
  const handleSelect = (i: number, j: number) => {
    if (grid[i].charAt(j) !== blockChar) {
      if (selected === `${i},${j}` && workingDirection === "clockwise") {
        setWorkingDirection("inward")
      }
      else if (selected === `${i},${j}` && workingDirection === "inward") {
        setWorkingDirection("clockwise")
      }
      else {
        setSelected(`${i},${j}`)
      }
    } else {
      setSelected("")
    }
  }

  return (
    <>
      {
        [...Array(numRows)].map((_, i) => {
          return (
            <>
              {
                [...Array(rowSize)].map((_, j) => {
                  const address = `${i},${j}`

                  // if allowed, set to the specified character in rowWords
                  // if not allowed, set to the block character by default
                  let char = j < grid[i].length ? grid[i].charAt(j) : blockChar
                  
                  const isBlock = char === blockChar
                  const isBlank = char === " "
                  const isSelected = selected == address
                  const isSelectAdj = (
                    selected?.split(',')[0] == i.toString() && workingDirection == "inward"
                      ||
                    selected?.split(',')[1] == j.toString() && workingDirection == "clockwise"
                  )
                  const isCorrect = char.toUpperCase() === answerKey[i].charAt(j).toUpperCase()

                  // handle cell color fill for checking the puzzle
                  let fill = emptyFill

                  if (isBlock) { fill = blockFill }
                  else if (isBlank) {
                    if (isSelected) { fill = selectedFill}
                    else if (isSelectAdj) { fill = adjSelectedFill }
                  }
                  else {
                    if (isSelected) { fill = isCorrect ? selectedFill : (puzzleChecked ? incorrectSelectedFill : selectedFill) }
                    else if (isSelectAdj) { fill = isCorrect ? adjSelectedFill : (puzzleChecked ? incorrectAdjSelectedFill : adjSelectedFill) }
                    else { fill = isCorrect ? emptyFill : (puzzleChecked ? incorrectFill : emptyFill) }
                  }

                  return (
                    <RoundCell
                      i={i}
                      j={j}
                      key={address}
                      arcAngle={arcAngle}
                      levelWidth={levelWidth}
                      char={char}
                      fill={fill}
                      textColor={isCorrect && puzzleChecked ? "#2350d6" : "#000000"}
                      handleSelect={handleSelect}
                      number={Object.keys(numberedCells).includes(address) ? numberedCells[address] : undefined}
                      thickWall={thickWallCells.includes(address)}
                    />
                  )
                })
              }
            </>
          )
        })
      }
    </>
  )
}
