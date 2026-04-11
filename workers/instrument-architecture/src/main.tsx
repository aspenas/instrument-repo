import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import './fonts.css'
import './index.css'

import App from './App.tsx'

// Smooth scroll — desktop gets Lenis, touch devices get native
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

if (!isTouchDevice) {
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 0,
    anchors: true,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // Wire up anchor links
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a[href^="#"]')
    if (!target) return
    const id = target.getAttribute('href')
    if (!id || id === '#') return
    const el = document.querySelector(id)
    if (el) {
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: -40 })
    }
  })
}

// Scroll-triggered section reveals via IntersectionObserver
function initScrollReveals() {
  const sections = document.querySelectorAll(
    '.intro, .instrument, .brand, .voice, .tech-ref, .site-footer, .demo-callout'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  )

  sections.forEach((section) => observer.observe(section))
}

// Init reveals after React renders
requestAnimationFrame(() => {
  requestAnimationFrame(initScrollReveals)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
