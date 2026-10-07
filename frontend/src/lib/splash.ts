const MIN_MS = 3000 // the splash is never shorter than this, counted from page start
const MAX_MS = 4000 // never waits longer than this for the page/fonts to finish

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Fades out the splash from index.html once the page, fonts and a minimum time have passed. */
export function dismissSplash(): void {
  const splash = document.getElementById('splash')
  if (!splash) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const minimum = wait(reduced ? 0 : Math.max(0, MIN_MS - performance.now()))
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }))

  void Promise.race([Promise.all([minimum, loaded, document.fonts.ready]), wait(MAX_MS)]).then(() => {
    splash.classList.add('is-leaving')
    window.setTimeout(() => splash.remove(), reduced ? 0 : 700)
    try {
      sessionStorage.setItem('splash-seen', '1')
    } catch {
      // Storage blocked: the splash simply shows again next visit.
    }
  })
}