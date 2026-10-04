import {
  useLayoutEffect,
  useRef,
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

      // Reset initial styles - ALWAYS START LINE AT 0% FOR DYNAMIC SCROLL
      gsap.set(slider, { x: 0 })
      gsap.set('.journey-line', { width: '0%' })

      const items = allJourneyItems

      if (isMobile) {
        items.forEach((item, index) => {
          gsap.set(`.jl-${item.id}`, { opacity: index === 0 ? 1 : 0.45 })
          gsap.set(`.jd-${item.id}`, { scale: index === 0 ? 1.2 : 0.95 })
          gsap.set(`.title-${item.id}`, { opacity: index === 0 ? 1 : 0.55, y: 0 })
          gsap.set(`.description-${item.id}`, { opacity: index === 0 ? 1 : 0.5, y: 0 })
          gsap.set(`.card-box-${item.id}`, { opacity: index === 0 ? 1 : 0.6, y: 0 })
        })
      } else {
        items.forEach((item, index) => {
          gsap.set(`.jl-${item.id}`, { opacity: index === 0 ? 1 : 0.4 })
          gsap.set(`.jd-${item.id}`, { scale: index === 0 ? 1.2 : 0.95 })
          gsap.set(`.title-${item.id}`, {
            opacity: index === 0 ? 1 : 0.45,
            y: index === 0 ? 0 : 4,
          })
          gsap.set(`.description-${item.id}`, {
            opacity: index === 0 ? 1 : 0.4,
            y: index === 0 ? 0 : 3,
          })
          gsap.set(`.card-box-${item.id}`, {
            opacity: index === 0 ? 1 : 0.5,
            y: 0,
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

      // 2. Active glowing progress line draws forward synchronously with scroll
      masterTl.fromTo(
        '.journey-line',
        { width: '0%' },
        {
          width: '100%',
          ease: 'none',
          duration: 1,
        },
        0,
      )

      // Dynamically calculate the EXACT instant the laser line touches each project's vertical line & dot
      const railEl = section.querySelector('.timeline-rail')
      const railRect = railEl ? railEl.getBoundingClientRect() : null
      const railLeft = railRect ? railRect.left : 0
      const railWidth = railRect && railRect.width > 50 ? railRect.width : slider.scrollWidth

      items.forEach((item, index) => {
        const lineSelector = `.jl-${item.id}`
        const dotSelector = `.jd-${item.id}`
        const titleSelector = `.title-${item.id}`
        const descSelector = `.description-${item.id}`
        const cardSelector = `.card-box-${item.id}`

        // Measure exact horizontal distance from start of track rail to this card's line/dot
        const lineEl = section.querySelector(lineSelector)
        let touchFraction = (index + 0.4) / items.length
        if (lineEl && railWidth > 0) {
          const lineRect = lineEl.getBoundingClientRect()
          const dist = (lineRect.left + lineRect.width / 2) - railLeft
          touchFraction = Math.max(0.01, Math.min(0.98, dist / railWidth))
        }

        const stepDuration = 0.04

        // Milestone dot activates the EXACT INSTANT the laser line reaches it
        masterTl.to(
          dotSelector,
          {
            scale: 1.5,
            backgroundColor: '#ffffff',
            boxShadow: '0 0 22px rgba(96, 165, 250, 1), 0 0 38px rgba(56, 189, 248, 0.95)',
            duration: stepDuration * 0.5,
            ease: 'power2.out',
          },
          touchFraction,
        )
        masterTl.to(
          dotSelector,
          {
            scale: 1.15,
            backgroundColor: '#60a5fa',
            boxShadow: '0 0 14px rgba(96, 165, 250, 0.75)',
            duration: stepDuration * 0.5,
            ease: 'power2.out',
          },
          touchFraction + stepDuration * 0.5,
        )

        // Vertical side stem illuminates with intense glow
        masterTl.to(
          lineSelector,
          {
            opacity: 1,
            boxShadow: '0 0 16px rgba(96, 165, 250, 0.95), 0 0 28px rgba(56, 189, 248, 0.65)',
            duration: stepDuration,
            ease: 'power2.out',
          },
          touchFraction,
        )

        // Whole card reveals & brightens
        masterTl.to(
          cardSelector,
          {
            opacity: 1,
            duration: stepDuration,
            ease: 'power2.out',
          },
          touchFraction,
        )

        // Title slides into place and illuminates into crisp white
        masterTl.to(
          titleSelector,
          {
            y: 0,
            opacity: 1,
            color: '#ffffff',
            duration: stepDuration,
            ease: 'power2.out',
          },
          touchFraction,
        )

        // Description slides and reveals cleanly
        masterTl.to(
          descSelector,
          {
            y: 0,
            opacity: 1,
            duration: stepDuration,
            ease: 'power2.out',
          },
          touchFraction,
        )
      })

      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    },
    { dependencies: [], scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="work"
      className="timeline-section h-screen w-screen relative overflow-hidden"
      style={sectionStyle}
    >
      {/* Container with generous clearance below fixed navbar and balanced bottom spacing */}
      <div className="h-full w-full flex items-center justify-start overflow-hidden relative pt-[96px] pb-[28px] max-[600px]:pt-[68px] max-[600px]:pb-[16px] box-border">
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
            <div className="w-full absolute left-0 top-[50%] -translate-y-1/2 h-[14px] flex items-center pointer-events-none z-10 timeline-rail">
              {/* Full Background Track Rail */}
              <div className="w-full absolute left-0 h-[2px] bg-blue-500/20 rounded-full" />
              
              {/* Start Dot */}
              <div
                className="size-[9px] max-[600px]:size-[7px] rounded-full bg-blue-400 border border-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.8)] shrink-0 z-10"
              />

              {/* Active Glowing Laser Progress Line (Advances synchronously with scroll) */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full journey-line bg-gradient-to-r from-blue-600 via-cyan-400 to-white shadow-[0_0_18px_rgba(96,165,250,1),0_0_35px_rgba(56,189,248,0.7)] z-20 pointer-events-none"
                style={{ width: '0%' }}
              >
                {/* Leading Laser Tracer Orb */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-[12px] max-[600px]:size-[9px] rounded-full bg-white shadow-[0_0_16px_#ffffff,0_0_30px_#38bdf8,0_0_45px_#3b82f6] border-2 border-cyan-300 z-30" />
              </div>

              {/* End Dot */}
              <div
                className="absolute right-0 size-[9px] max-[600px]:size-[7px] rounded-full bg-blue-500/30 border border-blue-500/40 shrink-0 z-10"
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
                    className={`relative shrink-0 w-[27vw] max-[600px]:w-[80vw] max-[600px]:max-w-[330px] card-box-${item.id} transition-opacity duration-300 pb-3 max-[600px]:pb-2`}
                  >
                    <div className="flex items-stretch gap-3">
                      {/* Left Vertical Accent Line & Node (Fixed alongside project texts!) */}
                      <div className="relative flex flex-col items-center shrink-0 w-[12px] pt-1">
                        <div
                          className={`size-[9px] max-[600px]:size-[7px] rounded-full shrink-0 transition-transform duration-300 jd-${item.id}`}
                          style={activeStyle}
                        />
                        <div
                          className={`w-[2px] flex-1 rounded-full mt-1.5 jl-${item.id}`}
                          style={activeStyle}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1 pb-1">
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
                          className={`description-${item.id} text-[0.95vw] leading-[1.35] text-neutral-300 max-[600px]:text-[0.8rem] max-[600px]:leading-tight max-[600px]:line-clamp-3`}
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
                    className={`relative shrink-0 w-[27vw] max-[600px]:w-[80vw] max-[600px]:max-w-[330px] card-box-${item.id} transition-opacity duration-300 pt-3 max-[600px]:pt-2`}
                  >
                    <div className="flex items-stretch gap-3">
                      {/* Left Vertical Accent Line & Node (Dot at bottom for bottom milestones) */}
                      <div className="relative flex flex-col items-center shrink-0 w-[12px] pb-1">
                        <div
                          className={`w-[2px] flex-1 rounded-full mb-1.5 jl-${item.id}`}
                          style={activeStyle}
                        />
                        <div
                          className={`size-[9px] max-[600px]:size-[7px] rounded-full shrink-0 transition-transform duration-300 jd-${item.id}`}
                          style={activeStyle}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1 pt-0.5">
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
                          className={`description-${item.id} text-[0.95vw] leading-[1.35] text-neutral-300 max-[600px]:text-[0.8rem] max-[600px]:leading-tight max-[600px]:line-clamp-3`}
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

