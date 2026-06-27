import { useState } from 'react'
import { Cell } from './cell'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Cell content="a" />
      <Cell content="b" />
      <Cell content="c" />
    </div>
  )
}

export default App
