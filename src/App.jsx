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
      { threshold: 0.15 }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Disabled JS smooth scroll/parallax to keep consistent 60fps.

  const skills = [
    {
      title: 'Full-Stack & Backend',
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
        'SSMS',
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
        'Constructed production-ready backend modules to streamline attendance tracking, leave management, and real-time HR reporting for a workforce of over 5,000 employees.',
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
      role: 'Software Development Engineer | Backend Developer',
      company: 'Autovyn Consultancy Pvt. Ltd.',
      period: '09/2023 - Present',
      bullets: [
        'Planned and optimized scalable enterprise backend architectures utilizing .NET and SQL/NoSQL databases (Microsoft SQL Server, PostgreSQL, MySQL, MongoDB), supporting over 50,000 daily transactions.',
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
        'Built core backend services, ensuring seamless third-party API integrations and highly efficient database management, accelerating data retrieval times by 30%.',
        'Deployed reliable, production-ready APIs supported by comprehensive unit testing (achieving over 90% test coverage) and detailed technical documentation.',
      ],
    },
  ]

  const achievements = [
    'Reduced API response time by 40% through strategic architectural shifts and rigorous SQL query optimizations.',
    'Improved database performance and system stability via targeted indexing and tuning, reducing query latency by over 50%.',
    'Successfully directed full backend deployment cycles, maintaining a 0% failure rate across seamless production releases.',
    'Pioneered scalable queue-based messaging pipelines for high-volume data processing with reliable message delivery.',
    'Enhanced system security and proactive monitoring by implementing maintainable logging mechanisms, maintaining 99.9% uptime for core backend services.',
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
              Jaipur-based software developer with 3+ years shipping ASP.NET Core
              services, SQL optimization, and cloud-ready pipelines. Certified
              MongoDB Associate with AWS hands-on delivery. Now delivering
              AI-assisted builds that accelerate UI iteration and harden software
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

          <div className="hero-stack">
            <div className="hero-card glow reveal" style={{ '--delay': '180ms' }}>
              <p className="card-label">Signature</p>
              <p className="card-title">Software Developer Engineer</p>
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
            <div className="hero-card glow reveal" style={{ '--delay': '260ms' }}>
              <p className="card-label">Certified</p>
              <p className="card-title">MongoDB Associate</p>
              <p className="card-body">Schema design, query optimization.</p>
            </div>
            <div className="hero-card glow reveal" style={{ '--delay': '340ms' }}>
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
              <span>Whatsapp API integrations</span>
              <span>Data reliability</span>
              <span>Cloud readiness</span>
              <span>SQL optimization</span>
              <span>CI/CD</span>
            </div>
            <div className="marquee-track" aria-hidden="true">
              <span>Backend systems</span>
              <span>Whatsapp API integration</span>
              <span>Data reliability</span>
              <span>Cloud readiness</span>
              <span>SQL optimization</span>
              <span>CI/CD</span>
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
            {projects.map((project, index) => (
              <article
                className="card reveal"
                style={{ '--delay': `${(index % 4) * 100}ms` }}
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
                      Visit project →
                    </a>
                  ) : (
                    <span className="card-muted">Enterprise Microservice</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-head reveal" style={{ '--delay': '0ms' }}>
            <p className="eyebrow">Core skills</p>
            <h2 className="blur-text">Projects depth with cloud range.</h2>
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
            <h2 className="blur-text">Building reliable production-grade software.</h2>
            <p>Driving API performance, stability, and data integrity.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
            {experiences.map((exp, expIdx) => (
              <div className="card wide reveal" style={{ '--delay': `${120 + expIdx * 80}ms` }} key={exp.company}>
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
              </div>
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
            <p>Open to software developer roles and product collaborations.</p>
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
        <p>Harsh Kumawat - Software Developer Engineer - Jaipur, India</p>
      </footer>

    </div>
  )
}

export default App
