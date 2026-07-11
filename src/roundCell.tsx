import { Group, Arc, Text } from "react-konva";

const START_X = -500
const START_Y = -130
const CENTER_OFFSET_X = 5
const CENTER_OFFSET_Y = 5

interface RoundCellProps {
  i: number;
  j: number;
  arcAngle: number;
  levelWidth: number;
  char: string;
  fill: string;
  handleSelect: (i: number, j: number) => void;
  number?: number | undefined;
  thickWall?: boolean
}

export function RoundCell(props: RoundCellProps) {
  const i = props.i;
  const j = props.j;
  const char = props.char;
  const arcAngle = props.arcAngle;
  const levelWidth = props.levelWidth;
  const textRadius = (j + 1/2) * levelWidth;
  const numRadius = (j + 3/4) * levelWidth;
  const fill = props.fill;
  const number = props.number;

  const angleRadians = (offset?: number) => {
    return Math.PI * (i * arcAngle + (offset ? offset : 0)) / 180;
  }

  return (
    <Group
      key={`${i},${j}`}
      onClick={() => props.handleSelect(i, j)}
    >
      <Arc
        x={START_X}
        y={START_Y}
        angle={arcAngle}
        rotation={i * arcAngle}
        innerRadius={j * levelWidth}
        outerRadius={(j + 1) * levelWidth}
        fill={fill}
        strokeWidth={2}
        stroke="black"
      />
      {
        props.thickWall && (
          <Arc
            x={START_X}
            y={START_Y}
            angle={0}
            rotation={i * arcAngle}
            innerRadius={j * levelWidth}
            outerRadius={(j + 1) * levelWidth}
            fill={fill}
            strokeWidth={12}
            stroke="black"
          />
        )
      }
      <Text
        x={START_X + textRadius * Math.cos(angleRadians(arcAngle / 2)) - CENTER_OFFSET_X}
        y={START_Y + textRadius * Math.sin(angleRadians(arcAngle / 2)) - CENTER_OFFSET_Y}
        text={char}
        fontStyle="bold"
      />
      {
        (number != undefined) && (
          <Text
            x={START_X + numRadius * Math.cos(angleRadians(j <= 3 ? 5 : 3)) - CENTER_OFFSET_X}
            y={START_Y + numRadius * Math.sin(angleRadians(j <= 3 ? 5 : 3)) - CENTER_OFFSET_Y}
            text={number.toString()}
          />
        )
      }
    </Group>
  );
}
