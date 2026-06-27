import { useState } from "react"

interface RowProps {
  length: number
  text: string
  isBottom?: boolean
}

export function Row(props: RowProps) {
  const [text, setText] = useState<string>(props.text)
  if (text.length < props.length) { setText(text.concat(' '.repeat(props.length - text.length))) }

  function renderCell(char: string, i: number) {
    const isBlock = char.trim() === '.'
    const isLast = i === props.length - 1
    const content = isBlock ? '' : char.at(0).toUpperCase()

    let borderStyle = `border-black border-l-2 border-t-2 ${props.isBottom ? 'border-b-2' : ''} ${isLast ? 'border-r-2' : ''}`

    function handleClick() {
      let replaceChar = '.'
      if (text.charAt(i) === '.') {
        replaceChar = ' '
      }
      const array = text.split('').map((value, ix) => { return (ix == i) ? replaceChar : value})
      setText(array.join(''))
    }
    
    return (
      <div
        key={i}
        className={`w-8 h-8 ${isBlock ? 'bg-black' : 'bg-white'} ${borderStyle} flex items-center justify-center hover:cursor-pointer`}
        onClick={handleClick}
      >
        {content}
      </div>
    )
  }

  return (
    <div className="flex flex-row">
      { text.split('').map((char, i) => {if (i < props.length) { return renderCell(char, i) }}) }
    </div>
  )
}