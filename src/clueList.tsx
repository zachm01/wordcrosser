import { type CluesProps } from "./props"

export function ClueList(props: CluesProps) {
  const clueSets = props.clueSets
  const highlightedClue = props.puzzleContext.highlightedClue
  const setHighlightedClue = props.puzzleContext.setHighlightedClue
  const setSelectedCell = props.puzzleContext.setSelectedCell

  return (
    <div className="flex flex-row items-start justify-center px-7">
      <div className="flex flex-row">
        {
          clueSets.map((clueSet, _) => {
            return (
              <div>
                <div className="font-extrabold text-md py-2">
                  {clueSet.name.toUpperCase()} ({clueSet.abbr.toUpperCase()})
                </div>
                {
                  clueSet.clues.map(clue => {
                    return (
                      <div 
                        className={`
                          w-64 px-1 grid grid-cols-[1.8rem,8fr] cursor-pointer
                          ${clue.number == highlightedClue ? "bg-yellow-400" : ""}
                        `}
                        onClick={() => {
                          setHighlightedClue(clue.number)
                          setSelectedCell(clue.numCell)
                        }}
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