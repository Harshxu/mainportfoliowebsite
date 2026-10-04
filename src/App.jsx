import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import GlowCard from './GlowCard'
import Velaris from './Velaris'
import Auralis from './Auralis'
import ShinyButton from './ShinyButton'
import Timeline from './Timeline'
import './App.css'

const typePhrases = [
  'data pipelines',
  'scalable APIs',
  'cloud automations',
  'high-speed SQL',
]

// Stable color palette constant to prevent Velaris WebGL rebuilds on re-render
const VELARIS_COLORS = ['#1d4ed8', '#1e3a8a', '#081438', '#010206']

const AURALIS_RED_COLORS = ['#ef4444', '#dc2626', '#b91c1c']

function App() {
  const [splashHiding, setSplashHiding] = useState(false)
  const [splashHidden, setSplashHidden] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // The sweep line crosses HARSH.EXE calmly over 2200ms.
    // Right as it finishes (2190ms), begin the dreamy blur and dissolve transition:
    const transitionStart = 2190

    const hideTimer = setTimeout(() => {
      setSplashHiding(true)
    }, transitionStart)

    // Complete removal of splash overlay after the smooth 1.1s blur/fade dissolve:
    const removeTimer = setTimeout(() => {
      setSplashHidden(true)
    }, 3300)

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
      elements.forEach((el) =>
        requestAnimationFrame(() => el.classList.add('reveal-in'))
      )
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() =>
              entry.target.classList.add('reveal-in')
            )
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '50px 0px 50px 0px' }
    )

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        el.classList.add('reveal-in')
      } else {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  // Disabled JS smooth scroll/parallax to keep consistent 60fps.

  const skills = [
    {
      title: 'Full-Stack (.NET)',
      items: [
        'C#',
        '.NET Core / ASP.NET',
        'React.js',
        'JavaScript (ES6+)',
        'TypeScript',
        'HTML5 & CSS3',
        'RESTful APIs',
        'Microservices',
        'Webhooks',
        'Dapper',
      ],
    },
    {
      title: 'Databases',
      items: [
        'Microsoft SQL Server',
        'PostgreSQL',
        'MongoDB (Certified Associate)',
        'Redis',
        'MySQL',
      ],
    },
    {
      title: 'AWS & Cloud Services',
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
      title: 'Tools & Practices',
      items: [
        'Visual Studio',
        'Postman',
        'Jira',
        'Git & GitHub',
        'MongoDB Compass',
        'CI/CD Pipelines',
        'Deployment Automation',
      ],
    },
  ]

  const projects = [
    {
      name: 'Maruti CRM Insurance Portal',
      description:
        'Architected an enterprise CRM platform to centralize insurance workflows, enhancing customer relationship management and operational efficiency across over 150 dealerships.',
      link: 'http://msibplcrm.co.in/',
      stack: ['.NET', 'SQL Server', 'AWS'],
    },
    {
      name: 'Service Marketing Reminder',
      description:
        'Created an automated customer reminder system delivering timely service follow-ups to over 20,000 customers.',
      link: 'http://dealercrm.co.in/',
      stack: ['.NET', 'SQL Server'],
    },
    {
      name: 'Vehicle Health Card Blaster',
      description:
        'Programmed an autonomous messaging microservice utilizing .NET, Kaleyra APIs, Webhooks, and AWS SQS to reliably deliver over 10,000 health reports weekly at scale.',
      link: null,
      stack: ['.NET', 'Kaleyra', 'AWS SQS', 'Webhooks'],
    },
    {
      name: 'Post Service Feedback (PSF) Blaster & Dealer PSF',
      description:
        'Spearheaded a high-volume bulk messaging pipeline utilizing SQL Server Agent scheduling, AWS Glue, and AWS Lambda to process and trigger over 100,000 daily customer feedback messages while synchronizing data across over 1,500 dealerships.',
      link: 'http://psfcrm.dealercrm.co.in/',
      stack: ['.NET', 'SQL Server', 'AWS Glue', 'AWS Lambda'],
    },
    {
      name: 'AutoVYN Connect',
      description:
        'Constructed production-ready full-stack and API modules to streamline attendance tracking, leave management, and real-time HR reporting for a workforce of over 5,000 employees.',
      link: null,
      stack: ['.NET', 'MongoDB', 'SQL Server'],
    },
    {
      name: 'Ganesh Bhojnalya',
      description:
        'Engineered a web application for a family restaurant business, showcasing digital menu offerings, location details, and customer services.',
      link: 'https://ganeshbhojnalya.vercel.app/',
      stack: ['React', 'Vite', 'Tailwind CSS'],
    },
    {
      name: 'Niraniya Heritage Stones Jaipur',
      description:
        'Crafted and deployed a showcase website for a family stone handicrafts business, highlighting handcrafted stone products and client inquiry workflows.',
      link: 'https://niraniyaheritagestonesjaipur.vercel.app/',
      stack: ['React', 'Vite', 'Tailwind CSS'],
    },
    {
      name: 'Royal Tailor Ambient Radio',
      description:
        'Developed an immersive retro Indian tailor shop ambient radio streaming nostalgic vintage Bollywood classics layered with realistic sewing clatter and rain ambience.',
      link: 'https://royaltailor.vercel.app/',
      stack: ['JavaScript', 'HTML5 Audio', 'YouTube API', 'CSS3'],
    },
  ]

  const experiences = [
    {
      role: 'Software Development Engineer',
      company: 'Autovyn Consultancy Pvt. Ltd.',
      period: '09/2023 - Present',
      bullets: [
        'Planned and optimized scalable enterprise software architectures utilizing .NET and SQL/NoSQL databases (Microsoft SQL Server, PostgreSQL, MySQL, MongoDB), supporting over 50,000 daily transactions.',
        'Orchestrated the migration to a microservices architecture, optimizing complex SQL queries to reduce API response times by up to 40%.',
        'Systematized core workflows by configuring SQL Server Agent jobs and scheduled messaging systems, managing zero-downtime production deployments across 3 active environments.',
        'Architected the Vehicle Health Card Blaster module utilizing .NET, Kaleyra APIs, Wrapper APIs, Webhooks, and AWS SQS for scalable messaging, processing over 500 requests per minute.',
        'Conceptualized and deployed the Post Service Feedback (PSF) Blaster, creating a queue-based bulk messaging system that seamlessly processes over 100,000 daily requests.',
        'Integrated Dealer Post Service Feedback (PSF) pipelines leveraging .NET, SQL Server, AWS Glue, and AWS Lambda for reliable data synchronization across over 1,500 dealerships.',
        'Streamlined mission-critical database workflows, improving data integrity and system monitoring, reducing data discrepancies by 99%.',
      ],
    },
    {
      role: 'Software Development Engineer',
      company: 'Dunnfox Technologies',
      period: '01/2023 - 09/2023',
      bullets: [
        'Built core software services and APIs, ensuring seamless third-party integrations and highly efficient database management, accelerating data retrieval times by 30%.',
        'Deployed reliable, production-ready APIs supported by comprehensive unit testing (achieving over 90% test coverage) and detailed technical documentation.',
      ],
    },
  ]

  const achievements = [
    'Reduced API response time by 40% through strategic architectural shifts and rigorous SQL query optimizations.',
    'Improved database performance and system stability via targeted indexing and tuning, reducing query latency by over 50%.',
    'Successfully directed full production deployment cycles, maintaining a 0% failure rate across seamless releases.',
    'Pioneered scalable queue-based messaging pipelines for high-volume data processing with reliable message delivery.',
    'Enhanced system security and proactive monitoring by implementing maintainable logging mechanisms, maintaining 99.9% uptime for core production services.',
  ]

  const typedText = typePhrases[phraseIndex]
    ? typePhrases[phraseIndex].slice(0, charIndex)
    : ''

  return (
    <div className="page-shell">
      {!splashHidden && (
        <div className={`splash ${splashHiding ? 'splash-hide' : ''}`}>
          <Velaris
            className="absolute inset-0 w-full h-full pointer-events-none"
            height="100vh"
            bg="#000000"
            colors={VELARIS_COLORS}
            speed={1.6}
            grain={0.25}
          />
          <div className="splash-noise" />
          <div className="splash-content">
            <p className="splash-title">
              <span className="splash-glitch" data-text="HARSH.EXE | CORE">
                HARSH.EXE | CORE
              </span>
            </p>
            <p className="splash-sub">
              Harsh Kumawat - Software Developer Engineer
              <span className="loading-dots" aria-hidden="true">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="bg-layer" aria-hidden="true">
        <Auralis
          className="w-full h-full pointer-events-none"
          height="100%"
          colors={AURALIS_RED_COLORS}
          speed={0.42}
          grain={0.48}
        />
        <div className="grid-lines" />
      </div>


      <Navbar />

      <main>
        <div className="page page-hero">
          <section className="hero">
          <div className="hero-copy">
            <div className="hero-copy-main">
              <div className="welcome">
                <span className="welcome-line" />
                <span>Welcome to my lab</span>
              </div>
              <h1>
                Building <span>high-performance APIs</span> and data systems that
                feel instant.
              </h1>
              <p className="lead">
                Jaipur-based software developer with 3+ years shipping ASP.NET Core
                services, SQL optimization, and cloud-ready pipelines. Certified
                MongoDB Associate with AWS hands-on delivery. Now delivering
                AI-assisted builds that accelerate UI iteration and harden software
                performance.
              </p>
            </div>

            <div className="hero-actions">
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
          </div>

          <div className="hero-stack">
            <div className="hero-cards-main">
              {/* 1. Signature Card */}
              <GlowCard
                customSize
                glowColor="blue"
                className="hero-card glow"
              >
                <div className="card-header-row">
                  <p className="card-label">Signature</p>
                  <span className="card-pill-badge card-pill-blue">Full-Stack (.NET)</span>
                </div>
                <p className="card-title">Software Developer Engineer</p>
                <p className="card-body">
                  Building efficient services, optimizing SQL, and scaling APIs for
                  production workloads.
                </p>
                <div className="tag-list">
                  <ShinyButton size="sm">ASP.NET Core</ShinyButton>
                  <ShinyButton size="sm">SQL Server</ShinyButton>
                  <ShinyButton size="sm">MongoDB</ShinyButton>
                  <ShinyButton size="sm">AWS</ShinyButton>
                </div>
              </GlowCard>

              {/* 2. Middle Row: Certified + Impact Twin Cards */}
              <div className="hero-subgrid">
                <GlowCard
                  customSize
                  glowColor="blue"
                  className="hero-card glow"
                >
                  <p className="card-label">Certified</p>
                  <p className="card-title">MongoDB Associate</p>
                  <p className="card-body">Schema design & query optimization.</p>
                </GlowCard>
                <GlowCard
                  customSize
                  glowColor="blue"
                  className="hero-card glow"
                >
                  <p className="card-label">Impact</p>
                  <p className="card-title">40% Faster APIs</p>
                  <p className="card-body">Delivered measurable latency wins.</p>
                </GlowCard>
              </div>

              {/* 3. Highlights Card */}
              <GlowCard
                customSize
                glowColor="blue"
                className="hero-card glow"
              >
                <div className="card-header-row">
                  <p className="card-label">Highlights</p>
                  <span className="card-pill-badge">Core Architecture</span>
                </div>
                <p className="card-title">C# .NET 8 • Microservices • Cloud</p>
                <p className="card-body">
                  High-throughput REST APIs, asynchronous queue pipelines, Docker containers & automated CI/CD.
                </p>
                <div className="highlight-chips-row">
                  <span className="highlight-chip">Microservices</span>
                  <span className="highlight-chip">Docker</span>
                  <span className="highlight-chip">Redis</span>
                  <span className="highlight-chip">AWS SQS</span>
                  <span className="highlight-chip">CI/CD</span>
                </div>
              </GlowCard>
            </div>

            {/* Live Typing / Shipping Animation Under Right Cards */}
            <div className="hero-typing-box">
              <span className="typing-prefix">Shipping</span>{' '}
              <span className="typing">{typedText}</span>
              <span className="cursor" aria-hidden="true">
                |
              </span>
            </div>
          </div>
        </section>

        {/* Details Row (Meta & Stats) */}
        <div className="hero-details-row">
          <div className="hero-meta">
            <div>
              <p className="meta-title">Now</p>
              <p>Autovyn Consultancy Pvt. Ltd. (Sep 2023 - Present)</p>
            </div>
            <div>
              <p className="meta-title">Focus</p>
              <p>API performance, data integrity, and CI/CD reliability.</p>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <p className="stat-number">3+ years</p>
              <p className="stat-label">Production Systems</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">40%</p>
              <p className="stat-label">Faster API response</p>
            </div>
            <div className="stat-item">
              <p className="stat-number">AWS + SSMS + MongoDB</p>
              <p className="stat-label">Certified depth</p>
            </div>
          </div>
        </div>

        <section className="marquee" aria-label="Core competencies ticker">
          <div className="marquee-inner">
            <div className="marquee-track">
              <span>Full-stack systems</span>
              <span>WhatsApp API integrations</span>
              <span>Data reliability</span>
              <span>Cloud readiness</span>
              <span>SQL optimization</span>
              <span>CI/CD pipelines</span>
              <span>High-speed APIs</span>
              <span>MongoDB indexing</span>
              <span>AWS deployments</span>
            </div>
            <div className="marquee-track" aria-hidden="true">
              <span>Full-stack systems</span>
              <span>WhatsApp API integrations</span>
              <span>Data reliability</span>
              <span>Cloud readiness</span>
              <span>SQL optimization</span>
              <span>CI/CD pipelines</span>
              <span>High-speed APIs</span>
              <span>MongoDB indexing</span>
            </div>
          </div>
        </section>
      </div>

        <Timeline
          title="Selected Projects"
          periodLabel="Production Systems"
          activeColor="#4c78ff"
          textColor="#ffffff"
          mutedTextColor="rgba(247, 247, 251, 0.78)"
          backgroundColor="transparent"
        />

        <div className="page page-content">
          <section id="skills" className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Core skills</p>
            <h2 className="blur-text">Projects depth with cloud range.</h2>
            <p>Technical breadth across APIs, data, and operations.</p>
          </div>
          <div className="grid skills-grid">
            {skills.map((group, index) => (
              <GlowCard
                customSize
                glowColor={['blue', 'purple', 'green', 'yellow'][index % 4]}
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
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="section tech-section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Technologies</p>
            <h2 className="blur-text">Stacks I ship with.</h2>
            <p>Modern tools I use for frontend polish and system reliability.</p>
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
              core application logic while keeping code quality and reliability first.
            </p>
          </div>
          <div className="grid">
            {[
              {
                title: 'AI-Assisted Frontend',
                text: 'Rapid UI iteration, animation concepts, and responsive layout exploration.',
                color: 'blue',
              },
              {
                title: 'AI-Assisted Systems & APIs',
                text: 'API design checks, query optimization ideas, and edge-case coverage.',
                color: 'purple',
              },
              {
                title: 'Tools I Use',
                text: 'ChatGPT, GitHub Copilot, and AI research for quicker validation.',
                color: 'green',
              },
            ].map((item, index) => (
              <GlowCard
                customSize
                glowColor={item.color}
                className="card soft reveal"
                style={{ '--delay': `${index * 90}ms` }}
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Experience</p>
            <h2 className="blur-text">Building reliable production-grade software.</h2>
            <p>Driving API performance, stability, and data integrity.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
            {experiences.map((exp, expIdx) => (
              <GlowCard
                customSize
                glowColor="blue"
                className="card wide reveal"
                style={{ '--delay': `${120 + expIdx * 80}ms` }}
                key={exp.company}
              >
                <div className="experience-head">
                  <div>
                    <h3>{exp.role}</h3>
                    <p>{exp.company}</p>
                  </div>
                  <span className="pill">{exp.period}</span>
                </div>
                <ul className="clean-list">
                  {exp.bullets.map((item, index) => (
                    <li
                      className="reveal"
                      style={{ '--delay': `${140 + index * 70}ms` }}
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            ))}
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
                badge: 'Certification',
                color: 'green',
                tag: 'MongoDB',
              },
              {
                title: 'AWS Community Day',
                text: 'Participation Certificate & Cloud Architecture',
                badge: 'Workshop',
                color: 'yellow',
                tag: 'AWS Cloud',
              },
              {
                title: 'Master of Computer Applications',
                text: 'Vivekananda Global University, Jaipur',
                badge: 'Degree',
                color: 'blue',
                tag: 'MCA',
              },
            ].map((item, index) => (
              <GlowCard
                customSize
                glowColor={item.color}
                className="card soft reveal"
                style={{ '--delay': `${index * 90}ms` }}
                key={item.title}
              >
                <div className="card-top-badge">
                  <span className={`tag credential-tag credential-tag-${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="card-meta">
                  <span className="card-muted">{item.tag}</span>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Achievements</p>
            <h2 className="blur-text">Results that made systems faster.</h2>
            <p>Impact-focused outcomes from recent work.</p>
          </div>
          <GlowCard
            customSize
            glowColor="purple"
            className="card wide reveal"
            style={{ '--delay': '120ms' }}
          >
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
          </GlowCard>
        </section>

        <section id="contact" className="section contact">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Contact</p>
            <h2 className="blur-text">Let's build something sharp.</h2>
            <p>Open to software developer roles and product collaborations.</p>
          </div>
          <GlowCard
            customSize
            glowColor="blue"
            className="card wide contact-card reveal"
            style={{ '--delay': '140ms' }}
          >
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
          </GlowCard>
        </section>
        </div>
      </main>

      <footer className="footer reveal" style={{ '--delay': '0ms' }}>
        <p>Harsh Kumawat - Software Developer Engineer - Jaipur, India</p>
      </footer>

    </div>
  )
}

export default App
