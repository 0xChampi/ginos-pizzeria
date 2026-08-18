'use client'

import { useEffect, useRef, useState } from 'react'

// House cinematic hero film. Clip is already 0.5x from ffmpeg setpts.
// Decorative loop honors reduced-motion and offers a pause control
// (web-interface-guidelines: autoplay >5s needs pause/stop/hide).
export default function AmbientFilm() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  const [showPause, setShowPause] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!video) return

    const syncPlayback = () => {
      if (reducedMotion.matches) {
        setShowPause(false)
        video.pause()
        return
      }
      setShowPause(true)
      if (paused) {
        video.pause()
        return
      }
      void video.play().catch(() => {
        // Poster stays if a browser blocks ambient autoplay.
      })
    }

    syncPlayback()
    video.addEventListener('loadedmetadata', syncPlayback)
    reducedMotion.addEventListener('change', syncPlayback)
    return () => {
      video.removeEventListener('loadedmetadata', syncPlayback)
      reducedMotion.removeEventListener('change', syncPlayback)
    }
  }, [paused])

  return (
    <>
      <video
        ref={videoRef}
        data-ambient-video
        className="ambient-film pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[68%_center] opacity-40"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/oven-load-poster.jpg"
        aria-hidden="true"
      >
        <source src="/video/oven-load.mp4" type="video/mp4" />
      </video>
      <div className="film-veil pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
      {showPause ? (
        <button
          type="button"
          className="film-pause focus-ring"
          onClick={() => setPaused((current) => !current)}
          aria-pressed={paused}
        >
          {paused ? 'Play film' : 'Pause film'}
        </button>
      ) : null}
    </>
  )
}
