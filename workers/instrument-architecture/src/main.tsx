import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'
import './fonts.css'
import './index.css'

import App from './App.tsx'

gsap.registerPlugin(ScrollTrigger)

// Smooth scroll — desktop gets Lenis + GSAP, touch devices get native
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!isTouchDevice && !prefersReduced) {
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    orientation: 'vertical',
  })

  // Wire Lenis into GSAP ticker for frame-perfect sync
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000)
  })
  lenis.on('scroll', ScrollTrigger.update)

  // Anchor links through Lenis
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

// Mobile: tell ScrollTrigger to use native scroller
ScrollTrigger.config({ ignoreMobileResize: true })

// ScrollTrigger-powered section reveals
function initReveals() {
  const sections = document.querySelectorAll(
    '.intro, .instrument, .brand, .voice, .tech-ref, .site-footer, .demo-callout'
  )

  sections.forEach((section) => {
    gsap.fromTo(section,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
  })

  // Stagger children
  document.querySelectorAll('.principles, .rules, .voice-specimens').forEach((container) => {
    const children = container.children
    gsap.fromTo(children,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  })
}

// Init after React renders
requestAnimationFrame(() => {
  requestAnimationFrame(initReveals)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
