import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { LineSegments } from 'three'
import { buildRingSegments, orbitQuaternion, type OrbitSpec } from './config'
import { orbitState } from './orbit-state'

interface OrbitRingProps {
  spec: OrbitSpec
  color: string
  opacity: number
}

export function OrbitRing({ spec, color, opacity }: OrbitRingProps) {
  const ref = useRef<LineSegments>(null)
  const positions = useMemo(
    () => buildRingSegments(spec.radius, spec.dashed),
    [spec.radius, spec.dashed],
  )

  useFrame(() => {
    if (ref.current) orbitQuaternion(spec, orbitState.time, ref.current.quaternion)
  })

  return (
    <lineSegments ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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