import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, type BufferAttribute } from 'three'
import { nodePosition, type NodeRef } from './config'
import { orbitState } from './orbit-state'

const start = new Vector3()
const end = new Vector3()

interface DataPathProps {
  from: NodeRef
  to: NodeRef
  color: string
  opacity: number
}

/** A single connection that follows its two nodes, so links stay attached while they orbit. */
export function DataPath({ from, to, color, opacity }: DataPathProps) {
  const [positions] = useState(() => new Float32Array(6))
  const attributeRef = useRef<BufferAttribute>(null)

  useFrame(() => {
    const attribute = attributeRef.current
    if (!attribute) return
    const t = orbitState.time
    nodePosition(from.ring, from.node, t, start)
    nodePosition(to.ring, to.node, t, end)
    attribute.setXYZ(0, start.x, start.y, start.z)
    attribute.setXYZ(1, end.x, end.y, end.z)
    attribute.needsUpdate = true
  })

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute ref={attributeRef} attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  )
}