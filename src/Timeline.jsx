import {
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({ ignoreMobileResize: true })
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

      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

      // Calculate how far horizontally the slider must travel so all projects pass through
      const getScrollDist = () => {
        const sliderWidth = slider.scrollWidth
        const viewWidth = window.innerWidth
        return Math.max(sliderWidth - viewWidth + (isMobile ? 80 : 140), viewWidth * 1.3)
      }

      const getTargetX = () => {
        const sliderWidth = slider.scrollWidth
        const viewWidth = window.innerWidth
        return -(sliderWidth - viewWidth + (isMobile ? 30 : 100))
      }

      // Reset initial styles
      gsap.set(slider, { x: 0 })
      gsap.set('.journey-line', { width: reducedMotion ? '100%' : '0%' })

      const items = allJourneyItems

      if (reducedMotion || isMobile) {
        // On mobile or reduced motion: keep all project names, tags, stems, and dots 100% visible at all times!
        items.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1, opacity: 1 })
          gsap.set(`.jd-${item.id}`, { scale: 1 })
          gsap.set(`.title-${item.id}`, { opacity: 1, y: 0 })
          gsap.set(`.description-${item.id}`, { opacity: 1, y: 0 })
          gsap.set(`.card-box-${item.id}`, { opacity: 1, y: 0 })
        })
      } else {
        items.forEach((item, index) => {
          const isTop = topJourneyData.some((topItem) => topItem.id === item.id)
          gsap.set(`.jl-${item.id}`, {
            scaleY: index === 0 ? 1 : 0,
            transformOrigin: isTop ? 'bottom bottom' : 'top top',
          })
          gsap.set(`.jd-${item.id}`, { scale: index === 0 ? 1.2 : 0.85 })
          gsap.set(`.title-${item.id}`, {
            opacity: index === 0 ? 1 : 0.35,
            y: index === 0 ? 0 : 14,
          })
          gsap.set(`.description-${item.id}`, {
            opacity: index === 0 ? 1 : 0.3,
            y: index === 0 ? 0 : 10,
          })
          gsap.set(`.card-box-${item.id}`, {
            opacity: index === 0 ? 1 : 0.4,
            y: index === 0 ? 0 : (isTop ? -6 : 6),
          })
        })
      }

      // Master Pinned Timeline: holds section pinned to screen while scrolling horizontally
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          scrub: 0.3, // Silky smooth realtime scrub
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

      // 2. Active glowing progress line draws forward along with scroll
      masterTl.to(
        '.journey-line',
        {
          width: '100%',
          ease: 'none',
          duration: 1,
        },
        0,
      )

      if (!reducedMotion) {
        // Spaced fractions along the scroll timeline for 8 alternating items
        const itemFractions = [0.08, 0.18, 0.30, 0.42, 0.54, 0.66, 0.78, 0.90]

        items.forEach((item, index) => {
          const lineSelector = `.jl-${item.id}`
          const dotSelector = `.jd-${item.id}`
          const titleSelector = `.title-${item.id}`
          const descSelector = `.description-${item.id}`
          const cardSelector = `.card-box-${item.id}`

          const fraction = itemFractions[index] || 0.1 * index
          const stepDuration = 0.08

          // Milestone dot activates as the laser line reaches it
          masterTl.to(
            dotSelector,
            {
              scale: 1.5,
              backgroundColor: '#ffffff',
              boxShadow: '0 0 25px rgba(96, 165, 250, 1), 0 0 45px rgba(56, 189, 248, 0.85)',
              duration: stepDuration * 0.4,
              ease: 'power2.out',
            },
            fraction,
          )
          masterTl.to(
            dotSelector,
            {
              scale: 1.15,
              backgroundColor: '#60a5fa',
              boxShadow: '0 0 16px rgba(96, 165, 250, 0.75)',
              duration: stepDuration * 0.4,
              ease: 'power2.out',
            },
            fraction + stepDuration * 0.4,
          )

          if (!isMobile) {
            // Vertical stem shoots down/up with energy
            masterTl.to(
              lineSelector,
              {
                scaleY: 1,
                opacity: 1,
                boxShadow: '0 0 14px rgba(96, 165, 250, 0.85)',
                duration: stepDuration * 0.5,
                ease: 'power2.out',
              },
              fraction,
            )

            // Whole card reveals & brightens
            masterTl.to(
              cardSelector,
              {
                opacity: 1,
                y: 0,
                duration: stepDuration * 0.7,
                ease: 'power2.out',
              },
              fraction + stepDuration * 0.1,
            )

            // Title slides and illuminates into crisp white
            masterTl.to(
              titleSelector,
              {
                y: 0,
                opacity: 1,
                color: '#ffffff',
                duration: stepDuration * 0.8,
                ease: 'power2.out',
              },
              fraction + stepDuration * 0.1,
            )

            // Description slides and reveals cleanly
            masterTl.to(
              descSelector,
              {
                y: 0,
                opacity: 1,
                duration: stepDuration * 0.8,
                ease: 'power2.out',
              },
              fraction + stepDuration * 0.15,
            )
          }
        })
      }

      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="work"
      className="timeline-section h-screen w-screen relative overflow-hidden"
      style={sectionStyle}
    >
      {/* Container with generous clearance below fixed navbar and balanced bottom spacing */}
      <div className="h-full w-full flex items-center justify-start overflow-hidden relative pt-[140px] pb-[40px] max-[600px]:pt-[75px] max-[600px]:pb-[20px] box-border">
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
            <div className="w-full absolute left-0 top-[50%] -translate-y-1/2 h-[14px] flex items-center pointer-events-none z-10">
              {/* Full Background Track Rail */}
              <div className="w-full absolute left-0 h-[2.5px] bg-blue-500/30 rounded-full" />
              
              {/* Start Dot */}
              <div
                className="size-[10px] max-[600px]:size-[8px] rounded-full bg-blue-400 border border-blue-300 shadow-[0_0_14px_rgba(96,165,250,0.9)] shrink-0 z-10"
              />

              {/* Active Glowing Laser Progress Line (Advances synchronously with scroll) */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[3.5px] rounded-full journey-line bg-gradient-to-r from-blue-600 via-cyan-400 to-white shadow-[0_0_20px_rgba(96,165,250,1),0_0_40px_rgba(56,189,248,0.7)] z-20 pointer-events-none"
                style={{ width: '0%' }}
              >
                {/* Leading Laser Tracer Orb */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-[14px] max-[600px]:size-[10px] rounded-full bg-white shadow-[0_0_20px_#ffffff,0_0_35px_#38bdf8,0_0_50px_#3b82f6] border-2 border-cyan-300 z-30" />
              </div>

              {/* End Dot */}
              <div
                className="absolute right-0 size-[10px] max-[600px]:size-[8px] rounded-full bg-blue-500/30 border border-blue-500/40 shrink-0 z-10"
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

              <div className="flex h-full items-end gap-x-[12vw] max-[600px]:gap-x-[20vw]">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className={`relative h-full w-[26vw] shrink-0 px-[2vw] flex flex-col justify-end pb-[70px] max-[600px]:w-[80vw] max-[600px]:max-w-[320px] max-[600px]:px-3 max-[600px]:pb-[36px] card-box-${item.id} transition-opacity duration-300`}
                  >
                    {/* Stem & Node (Compact connector to central track) */}
                    <div className="absolute left-[2vw] max-[600px]:left-3 bottom-0 pointer-events-none flex flex-col items-center">
                      <div
                        className={`h-[54px] max-[600px]:h-[26px] w-[2px] origin-bottom rounded-full shadow-[0_0_10px_rgba(76,120,255,0.7)] jl-${item.id}`}
                        style={activeStyle}
                      />
                      <div
                        className={`size-[10px] max-[600px]:size-[8px] translate-y-1/2 relative aspect-square rounded-full transition-transform duration-300 jd-${item.id}`}
                        style={activeStyle}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-[0.5vw] max-[600px]:space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[0.85vw] font-mono uppercase tracking-widest text-blue-400 font-semibold max-[600px]:text-[0.7rem]">
                          {item.tag}
                        </span>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.8vw] text-blue-300 hover:text-white transition-colors underline max-[600px]:text-[0.75rem]"
                          >
                            Live ↗
                          </a>
                        )}
                      </div>
                      <h4
                        className={`title-${item.id} text-[1.7vw] font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] max-[600px]:text-[1.05rem] max-[600px]:font-bold max-[600px]:leading-snug`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`description-${item.id} w-[95%] text-[0.95vw] leading-[1.35] text-neutral-300 max-[600px]:text-[0.8rem] max-[600px]:leading-tight max-[600px]:line-clamp-3`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                      {item.stack && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[0.72vw] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 max-[600px]:text-[0.68rem] max-[600px]:px-2 max-[600px]:py-0.5"
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

              <div className="flex h-full items-start gap-x-[16vw] ml-[8vw] max-[600px]:gap-x-[20vw] max-[600px]:ml-[6vw]">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className={`relative h-full w-[26vw] shrink-0 px-[2vw] flex flex-col justify-start pt-[70px] max-[600px]:w-[80vw] max-[600px]:max-w-[320px] max-[600px]:px-3 max-[600px]:pt-[36px] card-box-${item.id} transition-opacity duration-300`}
                  >
                    {/* Stem & Node (Compact connector to central track) */}
                    <div className="absolute left-[2vw] max-[600px]:left-3 top-0 pointer-events-none flex flex-col items-center">
                      <div
                        className={`size-[10px] max-[600px]:size-[8px] -translate-y-1/2 relative aspect-square rounded-full transition-transform duration-300 jd-${item.id}`}
                        style={activeStyle}
                      />
                      <div
                        className={`h-[54px] max-[600px]:h-[26px] w-[2px] origin-top rounded-full shadow-[0_0_10px_rgba(76,120,255,0.7)] jl-${item.id}`}
                        style={activeStyle}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-[0.5vw] max-[600px]:space-y-1 pt-[0.2vw]">
                      <div className="flex items-center gap-3">
                        <span className="text-[0.85vw] font-mono uppercase tracking-widest text-blue-400 font-semibold max-[600px]:text-[0.7rem]">
                          {item.tag}
                        </span>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.8vw] text-blue-300 hover:text-white transition-colors underline max-[600px]:text-[0.75rem]"
                          >
                            Live ↗
                          </a>
                        )}
                      </div>
                      <h4
                        className={`title-${item.id} text-[1.7vw] font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] max-[600px]:text-[1.05rem] max-[600px]:font-bold max-[600px]:leading-snug`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`description-${item.id} w-[95%] text-[0.95vw] leading-[1.35] text-neutral-300 max-[600px]:text-[0.8rem] max-[600px]:leading-tight max-[600px]:line-clamp-3`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                      {item.stack && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[0.72vw] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 max-[600px]:text-[0.68rem] max-[600px]:px-2 max-[600px]:py-0.5"
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

