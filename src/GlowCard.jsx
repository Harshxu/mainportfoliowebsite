import React, { useEffect, useRef, useState } from 'react'

const glowColorMap = {
  blue: {
    base: 220,
    spread: 180,
    accentRgb: '76, 120, 255',
    bloomRgb: '76, 120, 255',
  },
  purple: {
    base: 275,
    spread: 220,
    accentRgb: '192, 132, 252',
    bloomRgb: '168, 85, 247',
  },
  green: {
    base: 155,
    spread: 160,
    accentRgb: '52, 211, 153',
    bloomRgb: '16, 185, 129',
  },
  yellow: {
    base: 48,
    spread: 160,
    accentRgb: '250, 204, 21',
    bloomRgb: '234, 179, 8',
  },
  orange: {
    base: 32,
    spread: 160,
    accentRgb: '251, 146, 60',
    bloomRgb: '249, 115, 22',
  },
  red: {
    base: 350,
    spread: 160,
    accentRgb: '251, 113, 133',
    bloomRgb: '244, 63, 94',
  },
}

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
}

// Singleton pointer tracker with RAF throttling for desktop hover reflection
let pointerListeners = new Set()
let globalPointer = { x: '0', xp: '0', y: '0', yp: '0' }
let rafId = null

const handleGlobalPointerMove = (e) => {
  globalPointer.x = e.clientX.toFixed(1)
  globalPointer.xp = (e.clientX / window.innerWidth).toFixed(3)
  globalPointer.y = e.clientY.toFixed(1)
  globalPointer.yp = (e.clientY / window.innerHeight).toFixed(3)

  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      rafId = null
      pointerListeners.forEach((fn) => fn(globalPointer))
    })
  }
}

let isGlobalListening = false
function subscribePointer(cb) {
  if (typeof window === 'undefined') return () => {}
  // Skip global tracking on touch/mobile devices
  if (!window.matchMedia('(hover: hover)').matches) return () => {}

  pointerListeners.add(cb)
  if (!isGlobalListening) {
    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true })
    isGlobalListening = true
  }

  return () => {
    pointerListeners.delete(cb)
    if (pointerListeners.size === 0 && isGlobalListening) {
      window.removeEventListener('pointermove', handleGlobalPointerMove)
      isGlobalListening = false
    }
  }
}

const GlowCard = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  style = {},
  as = 'div',
  enableTilt = true,
  ...rest
}) => {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    return subscribePointer((p) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', p.x)
        cardRef.current.style.setProperty('--xp', p.xp)
        cardRef.current.style.setProperty('--y', p.y)
        cardRef.current.style.setProperty('--yp', p.yp)
      }
    })
  }, [])

  // Local card pointer tracking for razor-sharp cursor spotlight & 3D tilt
  const handlePointerEnter = (e) => {
    setIsHovered(true)
    handlePointerMove(e)
  }

  const handlePointerMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top

    cardRef.current.style.setProperty('--local-x', `${localX.toFixed(1)}px`)
    cardRef.current.style.setProperty('--local-y', `${localY.toFixed(1)}px`)

    if (enableTilt) {
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      // Refined 3D tilt (-3.2deg to +3.2deg)
      const rotateX = ((localY - centerY) / centerY) * -3.2
      const rotateY = ((localX - centerX) / centerX) * 3.2
      cardRef.current.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
      cardRef.current.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
    }
  }

  const handlePointerLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty('--tilt-x', '0deg')
    cardRef.current.style.setProperty('--tilt-y', '0deg')
    setIsHovered(false)
  }

  const colorConfig = glowColorMap[glowColor] || glowColorMap.blue
  const { base, spread, accentRgb, bloomRgb } = colorConfig

  const getSizeClasses = () => {
    if (customSize) return ''
    return sizeMap[size] || ''
  }

  const getInlineStyles = () => {
    const baseStyles = {
      '--base': base,
      '--spread': spread,
      '--accent-rgb': accentRgb,
      '--bloom-rgb': bloomRgb,
      '--radius': '18',
      '--border-w': '1.5',
      '--backdrop': 'rgba(10, 11, 16, 0.78)',
      '--backup-border': 'rgba(255, 255, 255, 0.08)',
      '--border-size': 'calc(var(--border-w, 1.5) * 1px)',
      '--spotlight-size': '380px',
      '--hue': 'calc(var(--base) + (var(--xp, 0.5) * var(--spread, 0)))',
      backgroundColor: 'var(--backdrop)',
      position: 'relative',
      touchAction: 'pan-y',
      ...style,
    }

    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height
    }

    return baseStyles
  }

  const Component = as

  return (
    <Component
      ref={cardRef}
      data-glow=""
      data-hovered={isHovered ? 'true' : 'false'}
      style={getInlineStyles()}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`
        glow-card-root
        ${getSizeClasses()}
        ${!customSize ? 'aspect-[3/4] p-4 gap-4 grid grid-rows-[1fr_auto]' : ''}
        ${className}
      `}
      {...rest}
    >
      {/* 1. Luminous glowing border element using content-box XOR masking */}
      <div className="glow-border-layer" aria-hidden="true" />

      {/* 2. Soft inner ambient spotlight sheen */}
      <div className="glow-surface-layer" aria-hidden="true" />

      {/* 3. Outer ambient atmospheric bloom */}
      <div className="glow-bloom-layer" aria-hidden="true" />

      {/* 4. Top specular edge reflection */}
      <div className="glow-top-rim" aria-hidden="true" />

      {/* 5. Card Content */}
      <div className="glow-content-wrapper">
        {children}
      </div>
    </Component>
  )
}

export default GlowCard
export { GlowCard }
