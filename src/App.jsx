import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import './App.css'

const typePhrases = [
  'scalable APIs',
  'data pipelines',
  'cloud automations',
  'high-speed SQL',
]

function App() {
  const [splashHiding, setSplashHiding] = useState(false)
  const [splashHidden, setSplashHidden] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const hideTimer = setTimeout(() => setSplashHiding(true), 2100)
    const removeTimer = setTimeout(() => setSplashHidden(true), 2700)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  useEffect(() => {
    if (splashHidden) {
      document.body.classList.remove('splash-lock')
    } else {
      document.body.classList.add('splash-lock')
    }
  }, [splashHidden])

  useEffect(() => {
    const current = typePhrases[phraseIndex]
    if (!current) return

    let timeout = isDeleting ? 40 : 85
    if (!isDeleting && charIndex === current.length) {
      timeout = 1200
    }
    if (isDeleting && charIndex === 0) {
      timeout = 300
    }

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex === current.length) {
        setIsDeleting(true)
        return
      }
      if (isDeleting && charIndex === 0) {
        setIsDeleting(false)
        setPhraseIndex((prev) => (prev + 1) % typePhrases.length)
        return
      }
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, timeout)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, phraseIndex])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('reveal-in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
      gsap.utils.toArray('.parallax').forEach((el) => {
        gsap.to(el, {
          y: -200,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }

    let lenis
    let rafId
    if (window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.2,
        smooth: true,
      })
      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    return () => {
      if (lenis && typeof lenis.destroy === 'function') {
        lenis.destroy()
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      if (window.ScrollTrigger && ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [])

  const skills = [
    {
      title: 'Backend',
      items: ['C#', 'ASP.NET Core Web API', 'Dapper', 'API Design', 'SQL Tuning'],
    },
    {
      title: 'Databases',
      items: [
        'Microsoft SQL Server',
        'PostgreSQL',
        'MySQL',
        'MongoDB (Certified Associate)',
      ],
    },
    {
      title: 'Cloud & Ops',
      items: [
        'AWS EC2',
        'Lambda',
        'CloudWatch',
        'Glue',
        'SQS',
        'API Gateway',
        'Aurora & RDS',
        'S3',
      ],
    },
    {
      title: 'Workflow',
      items: ['GitHub', 'CI/CD', 'Jira', 'Excel', 'Zendesk'],
    },
  ]

  const projects = [
    {
      name: 'Niraniya Heritage Stones Jaipur',
      description:
        'Business website showcasing stone products with a clean catalog and inquiry-focused layout.',
      link: 'https://niraniyaheritagestonesjaipur.vercel.app/',
      stack: ['React', 'Vite'],
    },
    {
      name: 'Maruti CRM Insurance Portal',
      description:
        'CRM platform to manage insurance workflows, improve customer relationships, and boost ops efficiency.',
      link: 'https://msibplcrm.co.in',
      stack: ['ASP.NET Core', 'SQL Server'],
    },
    {
      name: 'Service Marketing Reminder',
      description:
        'Automated reminder system to drive customer engagement and timely service follow-ups.',
      link: 'https://dealercrm.co.in',
      stack: ['ASP.NET Core', 'SQL Server'],
    },
    {
      name: 'AutoVYN Connect',
      description:
        'Attendance and leave management system with secure login/logout, leave tracking, and HR reporting.',
      link: null,
      stack: ['.NET', 'MongoDB'],
    },
  ]

  const experienceBullets = [
    'Developed and maintained backend systems ensuring database efficiency and reliability across production environments.',
    'Optimized complex SQL queries and improved API response times by 40%.',
    'Worked across SQL and NoSQL databases including MS SQL Server, PostgreSQL, MySQL, and MongoDB.',
    'Administered SQL Server and PostgreSQL using Dapper for data access while supporting schema changes and data migrations.',
    'Led full project lifecycle from data sourcing to deployment, including branching, merging, and CI/CD pipelines.',
  ]

  const achievements = [
    'Reduced API response time by up to 40% through query and integration optimization.',
    'Improved SQL performance and overall system stability via targeted tuning.',
    'Delivered production-ready APIs with thorough testing and documentation.',
    'Led end-to-end backend deployments including branching, pipelines, and production release.',
    'Streamlined and secured data flow between environments with reliable monitoring.',
    'Applied AI-assisted workflows to speed up UI prototyping and backend validation.',
  ]

  const typedText = typePhrases[phraseIndex]
    ? typePhrases[phraseIndex].slice(0, charIndex)
    : ''

  return (
    <div className="page">
      {!splashHidden && (
        <div className={`splash ${splashHiding ? 'splash-hide' : ''}`}>
          <div className="splash-glow splash-glow-one" />
          <div className="splash-glow splash-glow-two" />
          <div className="splash-noise" />
          <div className="splash-content">
            <p className="splash-title">
              <span className="splash-glitch" data-text="HARSH.EXE | CORE">
                HARSH.EXE | CORE
              </span>
            </p>
            <p className="splash-sub">
              Harsh Kumawat - Backend Developer
              <span className="loading-dots" aria-hidden="true">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="bg-layer">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="orb orb-three" />
        <div className="grid-lines" />
        <div className="noise" />
      </div>

      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-copy reveal" style={{ '--delay': '80ms' }}>
            <div className="welcome">
              <span className="welcome-line" />
              <span>Welcome to my lab</span>
            </div>
            <h1 className="blur-text reveal" style={{ '--delay': '140ms' }}>
              Building <span>high-performance APIs</span> and data systems that
              feel instant.
            </h1>
            <p className="lead reveal" style={{ '--delay': '220ms' }}>
              Jaipur-based backend developer with 2+ years shipping ASP.NET Core
              services, SQL optimization, and cloud-ready pipelines. Certified
              MongoDB Associate with AWS hands-on delivery. Now delivering
              AI-assisted builds that accelerate UI iteration and harden backend
              performance.
            </p>
            <p className="typing-line reveal" style={{ '--delay': '260ms' }}>
              Shipping <span className="typing">{typedText}</span>
              <span className="cursor" aria-hidden="true">
                |
              </span>
            </p>
            <div className="hero-actions reveal" style={{ '--delay': '300ms' }}>
              <a className="primary" href="#work">
                View projects
              </a>
              <a className="ghost" href="#contact">
                Contact
              </a>
              <a
                className="ghost resume-inline"
                href="/harsh-kumawat-resume.pdf"
                download
              >
                Download resume
              </a>
            </div>
            <div className="hero-meta reveal" style={{ '--delay': '340ms' }}>
              <div>
                <p className="meta-title">Now</p>
                <p>Autovyn Consultancy Pvt. Ltd. (Sep 2023 - Present)</p>
              </div>
              <div>
                <p className="meta-title">Focus</p>
                <p>API performance, data integrity, and CI/CD reliability.</p>
              </div>
            </div>
            <div className="hero-stats reveal" style={{ '--delay': '380ms' }}>
              <div className="stat-item">
                <p className="stat-number">2+ years</p>
                <p className="stat-label">Production backend</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">40%</p>
                <p className="stat-label">Faster API response</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">AWS + MongoDB</p>
                <p className="stat-label">Certified depth</p>
              </div>
            </div>
          </div>

          <div className="hero-stack parallax reveal" style={{ '--delay': '180ms' }}>
            <div className="hero-card glow float-a">
              <p className="card-label">Signature</p>
              <p className="card-title">Backend Developer</p>
              <p className="card-body">
                Building efficient services, optimizing SQL, and scaling APIs for
                production workloads.
              </p>
              <div className="tag-list">
                <span className="tag">ASP.NET Core</span>
                <span className="tag">SQL Server</span>
                <span className="tag">MongoDB</span>
                <span className="tag">AWS</span>
              </div>
            </div>
            <div className="hero-card float-b">
              <p className="card-label">Certified</p>
              <p className="card-title">MongoDB Associate</p>
              <p className="card-body">Schema design, query optimization.</p>
            </div>
            <div className="hero-card float-c">
              <p className="card-label">Impact</p>
              <p className="card-title">40% Faster APIs</p>
              <p className="card-body">Delivered measurable performance wins.</p>
            </div>
          </div>
        </section>

        <section className="marquee" aria-hidden="true">
          <div className="marquee-inner">
            <div className="marquee-track">
              <span>Backend systems</span>
              <span>API performance</span>
              <span>Data reliability</span>
              <span>Cloud readiness</span>
              <span>SQL optimization</span>
              <span>CI/CD delivery</span>
            </div>
            <div className="marquee-track" aria-hidden="true">
              <span>Backend systems</span>
              <span>API performance</span>
              <span>Data reliability</span>
              <span>Cloud readiness</span>
              <span>SQL optimization</span>
              <span>CI/CD delivery</span>
            </div>
          </div>
        </section>

        <section id="work" className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Selected work</p>
            <h2 className="blur-text">Systems that stay fast under pressure.</h2>
            <p>Projects built to feel stable, secure, and dependable.</p>
          </div>
          <div className="grid">
            {projects.map((project, index) => {
              const offsetMap = ['140%', '70%', '-70%', '-140%']
              const stackOffset = offsetMap[index % offsetMap.length]

              return (
                <article
                  className="card stack-card"
                  style={{
                    '--stack-offset': stackOffset,
                    '--stack-delay': `${index * 140}ms`,
                  }}
                  key={project.name}
                >
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="card-meta">
                    <div className="tag-list">
                      {project.stack.map((item) => (
                        <span className="tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                    {project.link ? (
                      <a
                        className="card-link"
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit project
                      </a>
                    ) : (
                      <span className="card-muted">Internal product</span>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Core skills</p>
            <h2 className="blur-text">Backend depth with cloud range.</h2>
            <p>Technical breadth across APIs, data, and operations.</p>
          </div>
          <div className="grid skills-grid">
            {skills.map((group, index) => (
              <div
                className="card soft reveal"
                style={{ '--delay': `${index * 80}ms` }}
                key={group.title}
              >
                <h3>{group.title}</h3>
                <div className="tag-list">
                  {group.items.map((item) => (
                    <span className="tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section tech-section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Technologies</p>
            <h2 className="blur-text">Stacks I ship with.</h2>
            <p>Modern tools I use for frontend polish and backend reliability.</p>
          </div>
          <div className="tech-grid reveal" style={{ '--delay': '120ms' }}>
            {[
              {
                name: 'React',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
              },
              {
                name: 'Node.js',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
              },
              {
                name: 'MongoDB',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
              },
              {
                name: 'Redis',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
              },
              {
                name: 'JavaScript',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
              },
              {
                name: 'PostgreSQL',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
              },
              {
                name: '.NET (C#)',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
              },
              {
                name: 'AWS',
                src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
              },
            ].map((item, index) => (
              <motion.div
                className="tech-item"
                key={item.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -10, scale: 1.04 }}
              >
                <div className="tech-icon">
                  <img src={item.src} alt={item.name} loading="lazy" />
                </div>
                <span>{item.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">AI workflow</p>
            <h2 className="blur-text">AI-augmented builds, faster delivery.</h2>
            <p>
              I use AI tools to accelerate research, prototype UI, and validate
              backend logic while keeping code quality and reliability first.
            </p>
          </div>
          <div className="grid">
            {[
              {
                title: 'AI-Assisted Frontend',
                text: 'Rapid UI iteration, animation concepts, and responsive layout exploration.',
              },
              {
                title: 'AI-Assisted Backend',
                text: 'API design checks, query optimization ideas, and edge-case coverage.',
              },
              {
                title: 'Tools I Use',
                text: 'ChatGPT, GitHub Copilot, and AI research for quicker validation.',
              },
            ].map((item, index) => (
              <div
                className="card soft reveal"
                style={{ '--delay': `${index * 90}ms` }}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Experience</p>
            <h2 className="blur-text">Backend reliability in production.</h2>
            <p>Driving API performance, stability, and data integrity.</p>
          </div>
          <div className="card wide reveal" style={{ '--delay': '120ms' }}>
            <div className="experience-head">
              <div>
                <h3>Backend Developer</h3>
                <p>Autovyn Consultancy Pvt. Ltd., Jaipur, India</p>
              </div>
              <span className="pill">Sep 2023 - Present</span>
            </div>
            <ul className="clean-list">
              {experienceBullets.map((item, index) => (
                <li
                  className="reveal"
                  style={{ '--delay': `${140 + index * 70}ms` }}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Credentials</p>
            <h2 className="blur-text">Certified and continuously learning.</h2>
            <p>Proof points of platform depth and formal training.</p>
          </div>
          <div className="grid">
            {[
              {
                title: 'MongoDB Certified Associate Developer',
                text: 'Hands-on expertise in schema design and query performance.',
              },
              {
                title: 'AWS Community Day',
                text: 'Participation Certificate',
              },
              {
                title: 'Master of Computer Applications',
                text: 'Vivekananda Global University, Jaipur',
              },
            ].map((item, index) => (
              <div
                className="card soft reveal"
                style={{ '--delay': `${index * 90}ms` }}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Achievements</p>
            <h2 className="blur-text">Results that made systems faster.</h2>
            <p>Impact-focused outcomes from recent work.</p>
          </div>
          <div className="card wide reveal" style={{ '--delay': '120ms' }}>
            <ul className="clean-list">
              {achievements.map((item, index) => (
                <li
                  className="reveal"
                  style={{ '--delay': `${140 + index * 70}ms` }}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Contact</p>
            <h2 className="blur-text">Let's build something sharp.</h2>
            <p>Open to backend roles and product collaborations.</p>
          </div>
          <div className="card wide contact-card reveal" style={{ '--delay': '140ms' }}>
            <div>
              <p className="contact-label">Email</p>
              <a href="mailto:harshkumawat9950@gmail.com">
                harshkumawat9950@gmail.com
              </a>
            </div>
            <div>
              <p className="contact-label">Phone</p>
              <a href="tel:+919351303138">+91 93513 03138</a>
            </div>
            <div>
              <p className="contact-label">Links</p>
              <div className="contact-links">
                <a
                  href="https://linkedin.com/in/harshkumawat01"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Harshxu"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer reveal" style={{ '--delay': '0ms' }}>
        <p>Harsh Kumawat - Backend Developer - Jaipur, India</p>
      </footer>

    </div>
  )
}

export default App
