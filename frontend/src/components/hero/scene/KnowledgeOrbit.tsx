import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { PointerOffset } from '../useHeroPointer'
import {
  DATA_ORBIT,
  FRONT_DIM,
  isNodeVisible,
  NODE_REFS,
  ORBITS,
  PATHS,
  PRODUCTION_ORBIT,
  SYSTEM_OFFSET_Y,
  type Detail,
  type Layer,
} from './config'
import { DataPath } from './DataPath'
import { DeveloperCore } from './DeveloperCore'
import { advanceOrbit, orbitState } from './orbit-state'
import { OrbitNode } from './OrbitNode'
import { OrbitParticles } from './OrbitParticles'
import { OrbitRing } from './OrbitRing'
import { useSceneColors } from './useSceneColors'

interface KnowledgeOrbitProps {
  layer: Layer
  detail: Detail
  pointer: RefObject<PointerOffset>
  reducedMotion: boolean
}

export function KnowledgeOrbit({ layer, detail, pointer, reducedMotion }: KnowledgeOrbitProps) {
  const colors = useSceneColors()
  const systemRef = useRef<Group>(null)
  const dim = layer === 'front' ? FRONT_DIM : 1

  // Negative priority: runs before every child's useFrame, so all of them see this frame's state.
  useFrame(() => advanceOrbit(performance.now(), pointer.current, !reducedMotion), -1)

  // Inertial lean toward the cursor. Identical in both layers, so the halves never drift apart.
  useFrame(() => {
    const system = systemRef.current
    if (!system) return
    system.rotation.set(orbitState.tiltX, orbitState.tiltY, 0)
    system.position.set(orbitState.tiltY * 0.3, SYSTEM_OFFSET_Y - orbitState.tiltX * 0.2, 0)
  })

  const rings = useMemo(() => ORBITS.filter((ring) => ring.minDetail <= detail), [detail])

  const paths = useMemo(
    () =>
      PATHS.flatMap((spec) => {
        const from = NODE_REFS.get(spec.from)
        const to = NODE_REFS.get(spec.to)
        return from && to && isNodeVisible(from, detail) && isNodeVisible(to, detail)
          ? [{ spec, from, to }]
          : []
      }),
    [detail],
  )

  return (
    <group ref={systemRef}>
      {/* The core lives behind the portrait plane, so only the back layer needs it. */}
      {layer === 'back' && (
        <DeveloperCore primary={colors.primary} secondary={colors.secondary} neutral={colors.neutral} />
      )}

      {rings.map((ring) => (
        <OrbitRing
          key={ring.id}
          spec={ring}
          color={colors[ring.tone]}
          opacity={ring.opacity * dim}
        />
      ))}

      {paths.map(({ spec, from, to }) => (
        <DataPath
          key={`${spec.from}-${spec.to}`}
          from={from}
          to={to}
          color={colors[spec.tone]}
          opacity={spec.opacity * dim}
        />
      ))}

      {rings.map((ring) =>
        ring.nodes.slice(0, detail + 1).map((node) => (
          <OrbitNode
            key={node.id}
            ring={ring}
            node={node}
            color={colors[node.tone]}
            opacity={0.9 * dim}
          />
        )),
      )}

      {/* API traffic between layers (cyan), visible from tablet up. */}
      {detail >= 2 && (
        <OrbitParticles
          ring={DATA_ORBIT}
          color={colors.secondary}
          opacity={0.9 * dim}
          count={5}
          tailStep={0.07}
          headSpeed={0.5}
          period={7}
          duty={0.5}
          size={0.035}
        />
      )}

      {/* Deployment signal (emerald) moving along the outer orbit toward "production". */}
      <OrbitParticles
        ring={PRODUCTION_ORBIT}
        color={colors.tertiary}
        opacity={0.95 * dim}
        count={7}
        tailStep={0.06}
        headSpeed={0.35}
        period={10}
        duty={0.65}
        size={0.04}
      />
    </group>
  )
}