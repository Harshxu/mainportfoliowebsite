import {
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function useGSAP(callback, options) {
  const deps = options?.dependencies ?? []
  const scope = options?.scope
  const ctxRef = useRef(null)
  const cleanupRef = useRef(undefined)

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === 'object' && 'current' in scope
        ? scope.current
        : scope
    ctxRef.current = gsap.context(() => {}, el ?? undefined)
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = undefined
      ctxRef.current?.revert()
      ctxRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (!ctxRef.current) return
    cleanupRef.current?.()
    const ret = ctxRef.current.add(callback)
    cleanupRef.current = typeof ret === 'function' ? ret : undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(callback) {
  if (typeof window === 'undefined') return () => {}
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQueryList.addEventListener('change', callback)
  return () => mediaQueryList.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false
}

function getServerReducedMotionSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  )
}

const topJourneyData = [
  {
    id: 'msibpl-crm',
    tag: 'ENTERPRISE CRM',
    title: 'MSIBPL Insurance CRM',
    content: 'Enterprise insurance platform centralizing workflows across 150+ dealerships with .NET & AWS.',
    link: 'http://msibplcrm.co.in/',
    stack: ['.NET', 'SQL Server', 'AWS'],
  },
  {
    id: 'autovyn-connect',
    tag: 'HR & WORKFORCE',
    title: 'AutoVYN Connect',
    content: 'Scalable HR platform managing attendance, leave, and real-time analytics for 5,000+ employees.',
    stack: ['.NET', 'MongoDB', 'SQL Server'],
  },
  {
    id: 'service-marketing',
    tag: 'AUTOMATION ENGINE',
    title: 'Service Marketing Reminder',
    content: 'Automated customer reminder engine delivering targeted follow-ups to over 20,000 customers.',
    link: 'http://dealercrm.co.in/',
    stack: ['.NET', 'SQL Server'],
  },
  {
    id: 'niraniya-heritage',
    tag: 'ARCHITECTURE SHOWCASE',
    title: 'Niraniya Heritage Stones',
    content: 'Handcrafted stone architecture showcase & client inquiry digital portal built with React & Vite.',
    link: 'https://niraniyaheritagestonesjaipur.vercel.app/',
    stack: ['React', 'Vite', 'Tailwind'],
  },
]

const bottomJourneyData = [
  {
    id: 'vhc-blaster',
    tag: 'SCALABLE MICROSERVICE',
    title: 'Vehicle Health Card Blaster',
    content: 'Autonomous microservice delivering 10,000+ weekly vehicle health reports at scale with AWS SQS.',
    stack: ['.NET', 'Kaleyra', 'AWS SQS'],
  },
  {
    id: 'psf-blaster',
    tag: 'BULK DATA PIPELINE',
    title: 'Post Service Feedback Blaster',
    content: 'Bulk messaging pipeline with AWS Glue & Lambda processing 100k+ daily messages across 1,500 dealers.',
    link: 'http://psfcrm.dealercrm.co.in/',
    stack: ['.NET', 'AWS Glue', 'AWS Lambda'],
  },
  {
    id: 'royal-tailor',
    tag: 'AUDIO EXPERIENCE',
    title: 'Royal Tailor Ambient Radio',
    content: 'Immersive retro Indian ambient radio streaming vintage Bollywood vinyl audio with realistic ambience.',
    link: 'https://royaltailor.vercel.app/',
    stack: ['JavaScript', 'HTML5 Audio', 'CSS3'],
  },
  {
    id: 'ganesh-bhojnalya',
    tag: 'RESTAURANT WEB APP',
    title: 'Ganesh Bhojnalya',
    content: 'Engineered a web application for a family restaurant business, showcasing digital menu offerings, location details, and customer services.',
    link: 'https://ganeshbhojnalya.vercel.app/',
    stack: ['React', 'Vite', 'Tailwind CSS'],
  },
]

const allJourneyItems = [
  topJourneyData[0],
  bottomJourneyData[0],
  topJourneyData[1],
  bottomJourneyData[1],
  topJourneyData[2],
  bottomJourneyData[2],
  topJourneyData[3],
  bottomJourneyData[3],
]

export default function Timeline({
  title = 'Selected Projects',
  periodLabel = 'Production Systems',
  textColor = '#ffffff',
  mutedTextColor = 'rgba(247, 247, 251, 0.78)',
  activeColor = '#4c78ff',
  backgroundColor = 'transparent',
}) {
  const sectionRef = useRef(null)
  const wholeSliderRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const sectionStyle = {
    color: textColor,
    backgroundColor,
  }
  const activeStyle = {
    backgroundColor: activeColor,
    boxShadow: `0 0 16px ${activeColor}80`,
  }
  const mutedTextStyle = {
    color: mutedTextColor,
  }

  useGSAP(
    () => {
      const section = sectionRef.current
      const slider = wholeSliderRef.current
      if (!section || !slider) return

      const isMobile = window.innerWidth < 600

      // Calculate how far horizontally the slider must travel so all projects pass through
      const getScrollDist = () => {
        const sliderWidth = slider.scrollWidth
        const viewWidth = window.innerWidth
        return Math.max(sliderWidth - viewWidth + (isMobile ? 60 : 160), viewWidth * 1.6)
      }

      const getTargetX = () => {
        const sliderWidth = slider.scrollWidth
        const viewWidth = window.innerWidth
        return -(sliderWidth - viewWidth + (isMobile ? 40 : 120))
      }

      const totalScrollDist = getScrollDist()

      // Reset initial styles
      gsap.set(slider, { x: 0 })
      gsap.set('.journey-line', { width: reducedMotion ? '98%' : '0%' })

      const items = allJourneyItems

      if (reducedMotion) {
        items.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 })
          gsap.set(`.jd-${item.id}`, { scale: 1 })
          gsap.set(`.title-${item.id}`, { opacity: 1, y: 0 })
          gsap.set(`.description-${item.id}`, { opacity: 1, y: 0 })
        })
      } else {
        items.forEach((item) => {
          const isTop = topJourneyData.some((topItem) => topItem.id === item.id)
          gsap.set(`.jl-${item.id}`, {
            scaleY: 0,
            transformOrigin: isTop ? 'bottom bottom' : 'top top',
          })
          gsap.set(`.jd-${item.id}`, { scale: 0 })
          gsap.set(`.title-${item.id}`, { opacity: 0, y: 25 })
          gsap.set(`.description-${item.id}`, { opacity: 0, y: 15 })
        })
      }

      // Master Pinned Timeline: holds section pinned to screen while scrolling horizontally
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: () => `+=${totalScrollDist}`,
          scrub: 0.8, // Smooth scrub
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1. Horizontal glide: slider moves horizontally across the screen
      masterTl.to(
        slider,
        {
          x: getTargetX,
          ease: 'none',
          duration: 1,
        },
        0,
      )

      if (!reducedMotion) {
        // 2. Journey track line draws out across the milestones
        masterTl.to(
          '.journey-line',
          {
            width: isMobile ? '75%' : '98%',
            ease: 'none',
            duration: 1,
          },
          0,
        )

        // 3. Sequential milestones activations as they arrive on screen
        const count = items.length
        items.forEach((item, index) => {
          const lineSelector = `.jl-${item.id}`
          const dotSelector = `.jd-${item.id}`
          const titleSelector = `.title-${item.id}`
          const descSelector = `.description-${item.id}`

          const startFraction = 0.05 + (index / (count + 0.6)) * 0.85
          const stepDuration = 0.12

          masterTl.to(
            lineSelector,
            { scaleY: 1, duration: stepDuration * 0.5, ease: 'power2.out' },
            startFraction,
          )
          masterTl.to(
            dotSelector,
            { scale: 1, duration: stepDuration * 0.5, ease: 'back.out(2)' },
            startFraction,
          )
          masterTl.to(
            titleSelector,
            { y: 0, opacity: 1, duration: stepDuration * 0.8, ease: 'power2.out' },
            startFraction + stepDuration * 0.1,
          )
          masterTl.to(
            descSelector,
            { y: 0, opacity: 1, duration: stepDuration * 0.8, ease: 'power2.out' },
            startFraction + stepDuration * 0.2,
          )
        })
      }

      // Map trackpad horizontal gesture to page scroll so horizontal swipe scrolls timeline
      const handleWheel = (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
          window.scrollBy({ top: e.deltaX * 1.2, behavior: 'auto' })
        }
      }

      section.addEventListener('wheel', handleWheel, { passive: true })
      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', handleResize)

      return () => {
        section.removeEventListener('wheel', handleWheel)
        window.removeEventListener('resize', handleResize)
      }
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="work"
      className="timeline-section timeline-breakout h-screen w-screen relative overflow-hidden"
      style={sectionStyle}
    >
      {/* Container with generous clearance below fixed navbar and balanced bottom spacing */}
      <div className="h-full w-full flex items-center justify-start overflow-hidden relative pt-[145px] pb-[50px] max-[600px]:pt-[90px] max-[600px]:pb-[30px] box-border">
        <div
          ref={wholeSliderRef}
          className="flex h-full items-center gap-[4vw] px-[5vw] max-[600px]:gap-[8vw] max-[600px]:px-[6vw] will-change-transform shrink-0"
          style={{ width: 'max-content' }}
        >
          <div
            className="relative h-full flex flex-col justify-between shrink-0"
            style={{ width: 'max-content' }}
          >
            {/* Center Timeline Track Line */}
            <div className="w-full absolute left-0 top-[50%] -translate-y-1/2 flex items-center h-fit pointer-events-none">
              <div
                className="h-[.8vw] w-[.8vw] max-[600px]:h-[2.2vw] max-[600px]:w-[2.2vw] rounded-full shadow-[0_0_14px_rgba(76,120,255,0.8)]"
                style={activeStyle}
              />
              <div
                className="h-px w-[0%] rounded-full journey-line shadow-[0_0_10px_rgba(76,120,255,0.6)]"
                style={activeStyle}
              />
              <div
                className="h-[.8vw] w-[.8vw] max-[600px]:h-[2.2vw] max-[600px]:w-[2.2vw] rounded-full shadow-[0_0_14px_rgba(76,120,255,0.8)]"
                style={activeStyle}
              />
            </div>

            {/* Top Half Milestones */}
            <div className="flex h-1/2 items-end justify-start gap-[1vw] pb-[1.5vw] max-[600px]:pb-[3vw]">
              <div className="h-full w-[16vw] shrink-0 flex flex-col justify-end pb-[1.5vw] max-[600px]:w-[38vw]">
                <span className="text-xs uppercase font-mono tracking-[0.3em] text-blue-400 block mb-2">
                  Roadmap
                </span>
                <h2 className="w-[90%] text-[2.4vw] font-bold leading-[0.98] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] max-[600px]:text-[8vw]">
                  {title}
                </h2>
              </div>

              <div className="flex h-full items-end gap-x-[12vw] max-[600px]:gap-x-[26vw]">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[26vw] shrink-0 px-[2vw] flex flex-col justify-end pb-[1.2vw] max-[600px]:w-[70vw] max-[600px]:px-[5vw]"
                  >
                    {/* Stem & Node */}
                    <div className="w-full absolute left-0 bottom-0 top-0 h-full pointer-events-none">
                      <div
                        className={`size-[0.85vw] max-[600px]:size-[2.2vw] -translate-x-1/2 relative aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      />
                      <div
                        className={`h-[90%] w-px origin-bottom rounded-full jl-${item.id}`}
                        style={activeStyle}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-[0.5vw]">
                      <div className="flex items-center gap-3">
                        <span className="text-[0.85vw] font-mono uppercase tracking-widest text-blue-400 font-semibold max-[600px]:text-[3.2vw]">
                          {item.tag}
                        </span>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.8vw] text-blue-300 hover:text-white transition-colors underline max-[600px]:text-[3vw]"
                          >
                            Live ↗
                          </a>
                        )}
                      </div>
                      <h4
                        className={`title-${item.id} text-[1.7vw] font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] max-[600px]:text-[5.5vw]`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`description-${item.id} w-[95%] text-[0.95vw] leading-[1.35] text-neutral-300 max-[600px]:text-[3.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                      {item.stack && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[0.72vw] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 max-[600px]:text-[2.6vw]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Half Milestones */}
            <div className="h-1/2 flex items-start justify-start pt-[1.5vw] max-[600px]:pt-[3vw]">
              <div className="w-[16vw] shrink-0 pt-[1.2vw] max-[600px]:w-[38vw] h-full">
                <p
                  className="text-[1.3vw] font-mono leading-none text-blue-300/80 max-[600px]:text-[4vw]"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
                <p className="text-[0.85vw] text-neutral-400 mt-2 max-[600px]:hidden">
                  Scroll down to navigate milestones →
                </p>
              </div>

              <div className="flex h-full items-start gap-x-[16vw] ml-[8vw] max-[600px]:gap-x-[26vw] max-[600px]:ml-[8vw]">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[26vw] shrink-0 px-[2vw] flex flex-col justify-start pt-[1.2vw] max-[600px]:w-[70vw] max-[600px]:px-[5vw]"
                  >
                    {/* Stem & Node */}
                    <div className="w-full absolute left-0 bottom-[-1%] h-full pointer-events-none">
                      <div
                        className={`h-[90%] origin-top w-px rounded-full max-[600px]:h-full jl-${item.id}`}
                        style={activeStyle}
                      />
                      <div
                        className={`size-[0.85vw] max-[600px]:size-[2.2vw] -translate-x-1/2 relative w-auto aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    {/* Content */}
                    <div className="space-y-[0.5vw] pt-[0.2vw]">
                      <div className="flex items-center gap-3">
                        <span className="text-[0.85vw] font-mono uppercase tracking-widest text-blue-400 font-semibold max-[600px]:text-[3.2vw]">
                          {item.tag}
                        </span>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.8vw] text-blue-300 hover:text-white transition-colors underline max-[600px]:text-[3vw]"
                          >
                            Live ↗
                          </a>
                        )}
                      </div>
                      <h4
                        className={`title-${item.id} text-[1.7vw] font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] max-[600px]:text-[5.5vw]` }
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`description-${item.id} w-[95%] text-[0.95vw] leading-[1.35] text-neutral-300 max-[600px]:text-[3.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                      {item.stack && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[0.72vw] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 max-[600px]:text-[2.6vw]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
