import { RoundCell } from "./roundCell"


const LEVEL_WIDTH = 40
const NUM_ROWS = 9
const ROW_SIZE = 6
const ARC_ANGLE = 360 / NUM_ROWS
const BLANK_CHAR = "."

const selectedFill = "#fedd3a"
const rowSelectedFill = "#8cfb9e"
const colSelectedFill = "#8cd4fb"


interface RoundGridProps {
  rowWords: string[];
  setRowWords: any;
  numberedCells: object;
  selectedCell: string;
  setSelectedCell: any;
  numRows?: number;
  levelWidth?: number;
  rowSize?: number;
  arcAngle?: number;
  blankChar?: string;
}

export function RoundGrid(props: RoundGridProps) {
  const rowSize = props.rowSize ?? ROW_SIZE
  const arcAngle = props.arcAngle ?? ARC_ANGLE
  const blankChar = props.blankChar ?? BLANK_CHAR
  const numRows = props.numRows ?? NUM_ROWS
  const levelWidth = props.levelWidth ?? LEVEL_WIDTH
  const numberedCells = props.numberedCells
  const [selected, setSelected] = [props.selectedCell, props.setSelectedCell]
  // const [rowWords, setRowWords] = useState<string[]>(props.rowWords.map(word => word.toUpperCase()))
  const rowWords = props.rowWords
  const setRowWords = props.setRowWords
  
  if (rowWords.length < rowSize) { setRowWords(rowWords.concat(blankChar.repeat(rowSize - rowWords.length))) }
  
  const keydownHandler = (e: KeyboardEvent) => {
    window.removeEventListener('keydown', keydownHandler)
    if (!selected) { return }
    
    // if e.key is a single alphabetical character or whitespace
    if (/^[a-zA-Z\s]$/.test(e.key)) { typeLetter(e.key) }
    // if the user is backspacing
    if (e.key === "Backspace") { deleteLetter() }

    window.removeEventListener('keydown', keydownHandler)
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

      if (rowWords[(selectedI + 1) % numRows][selectedJ] !== blankChar) {
        setSelected(`${(selectedI + 1) % numRows},${selectedJ}`)
      }
    }
  }

  const deleteLetter = () => {
    let selectedI = parseInt(selected.split(',')[0])
    let selectedJ = parseInt(selected.split(',')[1])

    if ((selectedI !== undefined) && (selectedJ != undefined)) {
      let newRowWords = changeLetter(selectedI, selectedJ, " ")
      setRowWords(newRowWords)

      if (rowWords[(selectedI - 1 + numRows) % numRows][selectedJ] !== blankChar) {
        setSelected(`${(selectedI - 1 + numRows) % numRows},${selectedJ}`)
      }
    }
  }

  window.addEventListener('keydown', keydownHandler)
  
  const handleSelect = (i: number, j: number) => {
    if (rowWords[i].charAt(j) !== blankChar) {
      if (selected === `${i},${j}`) { setSelected(undefined) }
      else { setSelected(`${i},${j}`) }
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
                  else if (selected?.split(',')[0] == i.toString()) { fill = colSelectedFill }
                  else if (selected?.split(',')[1] == j.toString()) { fill = rowSelectedFill }

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
