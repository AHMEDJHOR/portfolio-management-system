import { useMemo, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Plane, Vector3 } from 'three'
import type { PointerOffset } from './useHeroPointer'
import type { Detail, Layer } from './scene/config'
import { KnowledgeOrbit } from './scene/KnowledgeOrbit'

interface HeroSceneProps {
  /** "back" renders everything behind the portrait plane, "front" everything in front of it. */
  layer: Layer
  detail: Detail
  pointer: RefObject<PointerOffset>
  /** False while the Hero is off-screen: the render loop stops. */
  active: boolean
  reducedMotion: boolean
}

export function HeroScene({ layer, detail, pointer, active, reducedMotion }: HeroSceneProps) {
  // Reduced motion: render a still frame (redraws only on resize / theme change).
  const frameloop = reducedMotion ? 'demand' : active ? 'always' : 'never'

  // Keeps z >= 0 for the front canvas and z < 0 for the back one (world space, camera-facing).
  const clipPlane = useMemo(
    () => new Plane(new Vector3(0, 0, layer === 'front' ? 1 : -1), 0),
    [layer],
  )

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 30 }}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.clippingPlanes = [clipPlane]
      }}
    >
      <KnowledgeOrbit layer={layer} detail={detail} pointer={pointer} reducedMotion={reducedMotion} />
    </Canvas>
  )
}