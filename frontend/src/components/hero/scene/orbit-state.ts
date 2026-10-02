import { MathUtils } from 'three'
import type { PointerOffset } from '../useHeroPointer'

/**
 * One simulation state shared by the back and front canvases. Each canvas calls
 * advanceOrbit() every frame; the second call in a frame advances by well under a
 * millisecond, so both layers always read the same time and tilt.
 */
export interface OrbitState {
  time: number
  tiltX: number
  tiltY: number
  lastNow: number
}

export const orbitState: OrbitState = {
  // Reduced motion freezes the scene here, so pick a pleasant resting composition.
  time: 2.5,
  tiltX: 0,
  tiltY: 0,
  lastNow: 0,
}

export function advanceOrbit(now: number, pointer: PointerOffset, animate: boolean): void {
  const delta = orbitState.lastNow === 0 ? 0 : Math.min((now - orbitState.lastNow) / 1000, 0.1)
  orbitState.lastNow = now

  if (animate) orbitState.time += delta

  // Damped, so the system has inertia instead of snapping to the cursor.
  orbitState.tiltY = MathUtils.damp(orbitState.tiltY, pointer.x * 0.16, 2.5, delta)
  orbitState.tiltX = MathUtils.damp(orbitState.tiltX, pointer.y * 0.1, 2.5, delta)
}