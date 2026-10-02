import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D, Vector3, type InstancedMesh } from 'three'
import { orbitPoint, pulse, type OrbitSpec } from './config'
import { orbitState } from './orbit-state'

const dummy = new Object3D()
const point = new Vector3()

interface OrbitParticlesProps {
  ring: OrbitSpec
  color: string
  opacity: number
  /** Number of points in the trailing signal. */
  count: number
  /** Angular spacing between trail points (rad). */
  tailStep: number
  /** Angular speed of the signal head (rad/s). */
  headSpeed: number
  /** Seconds between appearances, and the fraction of that period the signal is visible. */
  period: number
  duty: number
  size: number
}

/** A short tapering signal that occasionally travels along a ring (one InstancedMesh). */
export function OrbitParticles({
  ring,
  color,
  opacity,
  count,
  tailStep,
  headSpeed,
  period,
  duty,
  size,
}: OrbitParticlesProps) {
  const ref = useRef<InstancedMesh>(null)

  useFrame(() => {
    const mesh = ref.current
    if (!mesh) return
    const t = orbitState.time
    const envelope = pulse(t, period, duty)
    const head = headSpeed * t

    for (let i = 0; i < count; i++) {
      orbitPoint(ring, head - i * tailStep, t, point)
      dummy.position.copy(point)
      dummy.scale.setScalar(Math.max(envelope * (1 - i / count), 0.0001))
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  )
}