import { Text } from '@react-three/drei'

interface TechLabelProps {
  label: string
  color: string
  opacity: number
  position: readonly [number, number, number]
  fontSize?: number
}

export function TechLabel({
  label,
  color,
  opacity,
  position,
  fontSize = 0.075,
}: TechLabelProps) {
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={color}
      fillOpacity={opacity}
      anchorX="center"
      anchorY="middle"
      depthOffset={-1}
      renderOrder={10}
    >
      {label}
    </Text>
  )
}