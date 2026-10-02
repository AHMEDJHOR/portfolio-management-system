import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { buildRingSegments, CORE_POSITION } from './config'
import { orbitState } from './orbit-state'

interface DeveloperCoreProps {
  primary: string
  secondary: string
  neutral: string
}

/**
 * Deliberately small (smaller than the face) and placed behind the portrait plane:
 * a faint wireframe, one point of signal, and a thin halo that only shows around the head.
 */
export function DeveloperCore({ primary, secondary, neutral }: DeveloperCoreProps) {
  const wireRef = useRef<Mesh>(null)
  const halo = useMemo(() => buildRingSegments(0.62, false), [])

  useFrame(() => {
    const wire = wireRef.current
    if (!wire) return
    wire.rotation.y = orbitState.time * 0.15
    wire.rotation.x = orbitState.time * 0.08
  })

  return (
    <group position={[...CORE_POSITION]}>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.26, 1]} />
        <meshBasicMaterial
          color={secondary}
          wireframe
          transparent
          opacity={0.5}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={primary} toneMapped={false} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[halo, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={neutral} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
      </lineSegments>
    </group>
  )
}