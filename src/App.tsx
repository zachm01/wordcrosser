import { useState } from 'react'
import { Puzzle } from './puzzle'

function App() {
  const [rowTexts, setRowTexts] = useState([
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
    '            ',
  ])

  return (
    <div className='flex items-center justify-center'>
      <Puzzle
        boxDims={[11, 11]}
        rowTexts={rowTexts}
      />
    </div>
  )
}

export default App
