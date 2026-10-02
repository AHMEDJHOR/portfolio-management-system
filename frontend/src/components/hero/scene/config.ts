import { Euler, Quaternion, Vector3 } from 'three'

export type Layer = 'back' | 'front'
/** 1 = mobile, 2 = tablet, 3 = desktop */
export type Detail = 1 | 2 | 3
export type Tone = 'primary' | 'secondary' | 'tertiary' | 'neutral'
export type NodeShape = 'sphere' | 'octahedron' | 'cube' | 'cylinder'

export interface NodeSpec {
  id: string
  label: string
  shape: NodeShape
  tone: Tone
  /** Starting angle on the ring (rad). Deliberately uneven. */
  phase: number
  /** Amplitude of the slow angular wobble (rad). */
  drift: number
  size: number
}

export interface OrbitSpec {
  id: 'core' | 'data' | 'production'
  radius: number
  /** Static tilt: rotation about X and Z (rad). Negative X puts the near arc below the face. */
  tilt: readonly [x: number, z: number]
  /** The whole ring sways about the Y axis instead of spinning endlessly. */
  sway: { amplitude: number; speed: number; phase: number }
  /** Angular speed of the nodes along the ring (rad/s). */
  speed: number
  tone: Tone
  opacity: number
  dashed: boolean
  minDetail: Detail
  nodes: readonly NodeSpec[]
}

export interface PathSpec {
  from: string
  to: string
  tone: Tone
  opacity: number
}

/** Inner orbit: core development (TypeScript, JavaScript, React, Node.js). */
export const CORE_ORBIT: OrbitSpec = {
  id: 'core',
  radius: 1.15,
  tilt: [-1.15, 0.12],
  sway: { amplitude: 0.3, speed: 0.11, phase: 0 },
  speed: 0.16,
  tone: 'primary',
  opacity: 0.55,
  dashed: false,
  minDetail: 1,
 nodes: [
  { id: 'ts', label: 'TypeScript', shape: 'octahedron', tone: 'primary', phase: 0.4, drift: 0.12, size: 0.055 },
  { id: 'js', label: 'JavaScript', shape: 'sphere', tone: 'primary', phase: 1.9, drift: 0.1, size: 0.045 },
  { id: 'react', label: 'React', shape: 'sphere', tone: 'primary', phase: 3.6, drift: 0.14, size: 0.05 },
  { id: 'node', label: 'Node.js', shape: 'cube', tone: 'primary', phase: 5.0, drift: 0.1, size: 0.04 },
],
}

/** Middle orbit: backend and data (Express, REST, PostgreSQL, Prisma). */
export const DATA_ORBIT: OrbitSpec = {
  id: 'data',
  radius: 1.6,
  tilt: [-1.0, -0.22],
  sway: { amplitude: 0.35, speed: 0.09, phase: 1.7 },
  speed: -0.11,
  tone: 'secondary',
  opacity: 0.45,
  dashed: false,
  minDetail: 2,
  nodes: [
  { id: 'express', label: 'Express', shape: 'cube', tone: 'secondary', phase: 1.0, drift: 0.1, size: 0.04 },
  { id: 'rest', label: 'REST API', shape: 'sphere', tone: 'secondary', phase: 2.6, drift: 0.12, size: 0.045 },
  { id: 'pg', label: 'PostgreSQL', shape: 'cylinder', tone: 'secondary', phase: 4.1, drift: 0.1, size: 0.045 },
  { id: 'prisma', label: 'Prisma', shape: 'octahedron', tone: 'secondary', phase: 5.6, drift: 0.12, size: 0.05 },
],
}

/** Outer orbit: engineering and production (Git, Testing, Architecture, Deployment). */
export const PRODUCTION_ORBIT: OrbitSpec = {
  id: 'production',
  radius: 2.0,
  tilt: [-1.3, 0.18],
  sway: { amplitude: 0.25, speed: 0.07, phase: 3.1 },
  speed: 0.07,
  tone: 'neutral',
  opacity: 0.4,
  dashed: true,
  minDetail: 1,
 nodes: [
  { id: 'git', label: 'Git', shape: 'sphere', tone: 'neutral', phase: 0.2, drift: 0.08, size: 0.04 },
  { id: 'test', label: 'Testing', shape: 'octahedron', tone: 'neutral', phase: 1.7, drift: 0.1, size: 0.045 },
  { id: 'arch', label: 'Architecture', shape: 'cube', tone: 'neutral', phase: 3.3, drift: 0.08, size: 0.04 },
  { id: 'deploy', label: 'Deployment', shape: 'sphere', tone: 'tertiary', phase: 4.8, drift: 0.06, size: 0.06 },
],
}

export const ORBITS: readonly OrbitSpec[] = [CORE_ORBIT, DATA_ORBIT, PRODUCTION_ORBIT]

/** Connections: frontend network, API links across layers, linear backend, architecture, deployment. */
export const PATHS: readonly PathSpec[] = [
  { from: 'ts', to: 'js', tone: 'primary', opacity: 0.3 },
  { from: 'js', to: 'react', tone: 'primary', opacity: 0.3 },
  { from: 'react', to: 'node', tone: 'primary', opacity: 0.3 },
  { from: 'node', to: 'express', tone: 'secondary', opacity: 0.45 },
  { from: 'react', to: 'rest', tone: 'secondary', opacity: 0.45 },
  { from: 'express', to: 'rest', tone: 'secondary', opacity: 0.3 },
  { from: 'rest', to: 'pg', tone: 'secondary', opacity: 0.3 },
  { from: 'pg', to: 'prisma', tone: 'secondary', opacity: 0.3 },
  { from: 'prisma', to: 'arch', tone: 'neutral', opacity: 0.3 },
  { from: 'git', to: 'test', tone: 'neutral', opacity: 0.25 },
  { from: 'test', to: 'arch', tone: 'neutral', opacity: 0.25 },
  { from: 'arch', to: 'deploy', tone: 'tertiary', opacity: 0.45 },
]

/** Where the "Developer" core sits, in system space. Tune once the final portrait is in. */
export const CORE_POSITION: readonly [number, number, number] = [0, 0.6, -0.5]
/** Vertical offset of the whole system relative to the portrait centre. */
export const SYSTEM_OFFSET_Y = 0.2
/** Elements that pass in front of the portrait are dimmed so they never fight the face. */
export const FRONT_DIM = 0.6

export interface NodeRef {
  ring: OrbitSpec
  node: NodeSpec
  index: number
}

export const NODE_REFS: ReadonlyMap<string, NodeRef> = new Map(
  ORBITS.flatMap((ring) =>
    ring.nodes.map((node, index): [string, NodeRef] => [node.id, { ring, node, index }]),
  ),
)

export function isNodeVisible(ref: NodeRef, detail: Detail): boolean {
  return ref.ring.minDetail <= detail && ref.index <= detail
}

// ---------------------------------------------------------------------------
// Pure motion helpers: everything is a function of time, so both canvases
// (back and front) compute identical positions without sharing objects.
// ---------------------------------------------------------------------------

const euler = new Euler()
const tiltQuat = new Quaternion()
const swayQuat = new Quaternion()
const AXIS_Y = new Vector3(0, 1, 0)

export function orbitQuaternion(ring: OrbitSpec, t: number, out: Quaternion): Quaternion {
  euler.set(ring.tilt[0], 0, ring.tilt[1])
  tiltQuat.setFromEuler(euler)
  const sway = ring.sway.amplitude * Math.sin(ring.sway.speed * t + ring.sway.phase)
  swayQuat.setFromAxisAngle(AXIS_Y, sway)
  return out.copy(tiltQuat).premultiply(swayQuat)
}

const orientation = new Quaternion()

export function orbitPoint(ring: OrbitSpec, angle: number, t: number, out: Vector3): Vector3 {
  orbitQuaternion(ring, t, orientation)
  return out
    .set(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0)
    .applyQuaternion(orientation)
}

export function nodePosition(ring: OrbitSpec, node: NodeSpec, t: number, out: Vector3): Vector3 {
  const angle = node.phase + ring.speed * t + node.drift * Math.sin(t * 0.35 + node.phase * 2)
  return orbitPoint(ring, angle, t, out)
}

/** 0 → 1 → 0 during the first `duty` fraction of each period, then 0 until the next cycle. */
export function pulse(t: number, period: number, duty: number): number {
  const cycle = (t / period) % 1
  return cycle > duty ? 0 : Math.sin((Math.PI * cycle) / duty)
}

/** Vertex pairs for a LineSegments ring: solid, or dashed for a more "engineered" outer orbit. */
export function buildRingSegments(radius: number, dashed: boolean): Float32Array {
  const segments = dashed ? 72 : 160
  const fill = dashed ? 0.45 : 1
  const step = (Math.PI * 2) / segments
  const out = new Float32Array(segments * 6)
  for (let i = 0; i < segments; i++) {
    const a0 = i * step
    const a1 = a0 + step * fill
    out.set(
      [Math.cos(a0) * radius, Math.sin(a0) * radius, 0, Math.cos(a1) * radius, Math.sin(a1) * radius, 0],
      i * 6,
    )
  }
  return out
}