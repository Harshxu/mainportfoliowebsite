import { useEffect, useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-logo">HK / DEV</div>
      <div className="navbar-links">
        <a href="#work">Work</a>
        <a href="#skills">Approach</a>
        <a href="#contact">Contact</a>
      </div>
      <button
        className="navbar-cta"
        type="button"
        onClick={() => {
          window.location.href = 'mailto:harshkumawat9950@gmail.com'
        }}
      >
        <svg
          className="cta-arrow"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M5 12h12m0 0-5-5m5 5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Let's Work Together
      </button>
    </nav>
  )
}
