import { type CluesProps } from "./props"

export function ClueList(props: CluesProps) {
  const clues = props.clues
  const highlightedClue = props.puzzleContext.highlightedClue
  const setSelectedCell = props.puzzleContext.setSelectedCell
  const workingDirection = props.puzzleContext.workingDirection
  const setWorkingDirection = props.puzzleContext.setWorkingDirection


  let clueSets = Array.from(new Set(clues.map(clue => clue.set)))


  return (
    <div className="flex flex-row items-start justify-center px-7">
      <div className="flex flex-row">
        {
          clueSets.map(clueSet => {
            return (
              <div key={clueSet}>
                <div className="font-extrabold text-md py-2">
                  {clueSet.toUpperCase()}
                </div>
                {
                  clues.map((clue, i) => {
                    if (clue.set != clueSet) { return }
                    return (
                      <div 
                        className={`
                          w-64 px-1 grid grid-cols-[1.8rem,8fr] cursor-pointer
                          ${(highlightedClue == `${clue.number}-${clue.set}` && clue.set == workingDirection) ? "bg-yellow-400" : ""}
                        `}
                        onClick={() => {
                          setSelectedCell(clue.allCells[0])
                          setWorkingDirection(clueSet.toLowerCase())
                        }}
                        key={i}
                      >
                        <span className="w-5 flex justify-end font-bold">{clue.number}</span>
                        <span>{clue.text}</span>
                      </div>
                    )}
                  )
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}