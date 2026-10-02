let cached: boolean | undefined

function detect(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext() // don't hold a context slot
    return true
  } catch {
    return false
  }
}

export function hasWebGL(): boolean {
  cached ??= detect()
  return cached
}