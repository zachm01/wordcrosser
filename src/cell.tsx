interface CellProps {
  content: string
  solid?: boolean
  isRebus?: boolean
}

export function Cell(props: CellProps) {
  let content = props.content.toUpperCase()

  if (content && !props.isRebus) {
    content = content.charAt(0)
  }

  return (
    <div className="w-8 h-8 border-2 border-black bg-white text-black">
      {content}
    </div>
  )
}