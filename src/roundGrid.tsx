import { RoundCell } from "./roundCell"
import { useState } from "react"
import { type RoundGridProps } from "./props"

const LEVEL_WIDTH = 40
const NUM_ROWS = 9
const ROW_SIZE = 6
const ARC_ANGLE = 360 / NUM_ROWS
const BLANK_CHAR = "."

const selectedFill = "#fedd3a"
const adjSelectedFill = "#8cd4fb"

export function RoundGrid(props: RoundGridProps) {
  const [workingDirection, setWorkingDirection] = useState<string>("clockwise")
  const rowSize = props.rowSize ?? ROW_SIZE
  const arcAngle = props.arcAngle ?? ARC_ANGLE
  const blankChar = props.blankChar ?? BLANK_CHAR
  const numRows = props.numRows ?? NUM_ROWS
  const levelWidth = props.levelWidth ?? LEVEL_WIDTH
  const numberedCells = props.numberedCells
  const thickWallCells = props.thickWallCells
  const [selected, setSelected] = [props.puzzleContext.selectedCell, props.puzzleContext.setSelectedCell]
  // const [rowWords, setRowWords] = useState<string[]>(props.rowWords.map(word => word.toUpperCase()))
  const rowWords = props.puzzleContext.grid
  const setRowWords = props.puzzleContext.setGrid
  
  if (rowWords.length < rowSize) { setRowWords(rowWords.concat(blankChar.repeat(rowSize - rowWords.length))) }
  
  const keydownHandler = (e: KeyboardEvent) => {
    window.removeEventListener('keydown', keydownHandler)
    if (!selected) { return }
    
    // if e.key is a single alphabetical character or whitespace
    if (/^[a-zA-Z\s]$/.test(e.key)) { typeLetter(e.key) }
    // if the user is backspacing
    if (e.key === "Backspace") { deleteLetter() }
    if (e.key == "ArrowLeft") { moveSelected(workingDirection === "clockwise" ? "clockwise" : "outward") }
    if (e.key == "ArrowRight") { moveSelected(workingDirection === "clockwise" ? "anticlockwise" : "inward") }

    window.removeEventListener('keydown', keydownHandler)
  }

  const moveSelected = (direction: string) => {
    let selectedI = parseInt(selected.split(',')[0])
    let selectedJ = parseInt(selected.split(',')[1])

    switch (direction) {
      case "clockwise":
        if (rowWords[(selectedI + 1) % numRows][selectedJ] !== blankChar) {
          setSelected(`${(selectedI + 1) % numRows},${selectedJ}`)
        } break;
      case "anticlockwise":
        if (rowWords[(selectedI - 1 + numRows) % numRows][selectedJ] !== blankChar) {
          setSelected(`${(selectedI - 1 + numRows) % numRows},${selectedJ}`)
        } break;
      case "inward":
        if (rowWords[selectedI][(selectedJ - 1 + rowSize) % rowSize] !== blankChar) {
          setSelected(`${selectedI},${(selectedJ - 1 + rowSize) % rowSize}`)
        } break;
      case "outward":
        if (rowWords[selectedI][(selectedJ + 1 + rowSize) % rowSize] !== blankChar) {
          setSelected(`${selectedI},${(selectedJ + 1 + rowSize) % rowSize}`)
        } break;
    }
  }

  const changeLetter = (i: number, j: number, letter: string): string[] => {
    let newRowWords = [...rowWords]
    newRowWords[i] = rowWords[i]
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
      setRowWords(newRowWords)
      moveSelected(workingDirection)
    }
  }

  const deleteLetter = () => {
    let selectedI = parseInt(selected.split(',')[0])
    let selectedJ = parseInt(selected.split(',')[1])

    if ((selectedI !== undefined) && (selectedJ != undefined)) {
      let newRowWords = changeLetter(selectedI, selectedJ, " ")
      setRowWords(newRowWords)
      moveSelected(workingDirection === "clockwise" ? "anticlockwise" : "outward")
    }
  }

  window.addEventListener('keydown', keydownHandler)
  
  const handleSelect = (i: number, j: number) => {
    if (rowWords[i].charAt(j) !== blankChar) {
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
      setSelected(undefined)
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
                  let char = blankChar
                  if (j < rowWords[i].length) { char = rowWords[i].charAt(j) }
                  const isBlank = char === BLANK_CHAR
                  const isSelected = selected == address

                  let fill = "#ffffff"
                  if (isBlank) { fill = "#000000" }
                  else if (isSelected) { fill = selectedFill }
                  else if (selected?.split(',')[0] == i.toString() && workingDirection == "inward") { fill = adjSelectedFill }
                  else if (selected?.split(',')[1] == j.toString() && workingDirection == "clockwise") { fill = adjSelectedFill }

                  return (
                    <RoundCell
                      i={i}
                      j={j}
                      key={address}
                      arcAngle={arcAngle}
                      levelWidth={levelWidth}
                      char={char}
                      fill={fill}
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
