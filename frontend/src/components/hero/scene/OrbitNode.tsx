import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import {
  nodePosition,
  type NodeShape,
  type NodeSpec,
  type OrbitSpec,
} from './config'
import { orbitState } from './orbit-state'
import { TechLabel } from './TechLabel'

interface NodeGeometryProps {
  shape: NodeShape
  size: number
}

function NodeGeometry({ shape, size }: NodeGeometryProps) {
  switch (shape) {
    case 'octahedron':
      return <octahedronGeometry args={[size * 1.3, 0]} />

    case 'cube':
      return <boxGeometry args={[size * 1.6, size * 1.6, size * 1.6]} />

    case 'cylinder':
      return <cylinderGeometry args={[size, size, size * 1.6, 14]} />

    case 'sphere':
      return <sphereGeometry args={[size, 14, 14]} />
  }
}

interface OrbitNodeProps {
  ring: OrbitSpec
  node: NodeSpec
  color: string
  opacity: number
}

export function OrbitNode({
  ring,
  node,
  color,
  opacity,
}: OrbitNodeProps) {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (!groupRef.current) return

    nodePosition(
      ring,
      node,
      orbitState.time,
      groupRef.current.position,
    )
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <NodeGeometry shape={node.shape} size={node.size} />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <TechLabel
        label={node.label}
        color={color}
        opacity={Math.min(opacity * 0.95, 0.95)}
        position={[0, 0.12, 0]}
      />
    </group>
  )
}