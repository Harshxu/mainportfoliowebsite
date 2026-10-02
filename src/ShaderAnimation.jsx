import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ShaderAnimation({ onComplete, duration = 4500 }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    // Unmount once cycle completes
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete()
    }, duration)

    return () => {
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader - starts 100% black and opens up a circular portal revealing what's underneath
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float progress;

      void main(void) {
        // Normalized coordinates centered at (0,0), aspect ratio aware
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float dist = length(uv);

        // Aspect ratio compensation for diagonal radius so corners are 100% uncovered
        float maxRadius = length(resolution) / min(resolution.x, resolution.y);
        
        // Portal opening radius expanding from center
        float openingRadius = progress * (maxRadius + 0.35);

        // Multi-harmonic glowing energy rings along the expanding perimeter
        float lineWidth = 0.0026;
        vec3 ringColor = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            float offset = openingRadius - 0.018 * float(j) + float(i) * 0.014;
            // Chromatic distortion pattern
            float ripple = mod(uv.x + uv.y, 0.18) * 0.06;
            float ringDist = abs(dist - offset + ripple);
            ringColor[j] += lineWidth * float(i * i) / (ringDist + 0.0008);
          }
        }

        // Add electric cyan / violet atmospheric accent along the crest
        vec3 crestGlow = vec3(0.18, 0.45, 1.0) * (0.015 / (abs(dist - openingRadius) + 0.012));
        ringColor += crestGlow;

        // Inside portal: transparent (0.0), reveals the landing page
        // Outside portal: black (1.0), hides the landing page
        float edgeSoftness = 0.045;
        float blackMask = smoothstep(openingRadius - edgeSoftness, openingRadius + edgeSoftness, dist);

        // Fade ring brightness gently as the wave sweeps past the edges
        float ringFade = 1.0 - smoothstep(0.82, 1.0, progress);
        vec3 rings = ringColor * ringFade;

        // Subtle soft rim lighting on the perimeter of the black curtain
        vec3 finalRgb = rings;
        float finalAlpha = clamp(blackMask + length(rings) * 0.9, 0.0, 1.0);

        gl_FragColor = vec4(finalRgb, finalAlpha);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      progress: { type: 'f', value: 0.0 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    container.appendChild(renderer.domElement)

    // Handle window resize
    const onWindowResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = width * Math.min(window.devicePixelRatio, 2)
      uniforms.resolution.value.y = height * Math.min(window.devicePixelRatio, 2)
    }

    // Initial resize
    onWindowResize()
    window.addEventListener('resize', onWindowResize, false)

    // Animation loop - progress smoothly goes from 0.0 to 1.0 strictly once
    const startTime = performance.now()
    const animate = () => {
      const elapsed = performance.now() - startTime
      const linearProgress = Math.min(elapsed / duration, 1.0)
      
      // Velvety cubic-bezier style ease-out: starts with swift energy then expands smoothly
      const currentProgress = 1.0 - Math.pow(1.0 - linearProgress, 2.8)

      uniforms.progress.value = currentProgress
      renderer.render(scene, camera)

      if (linearProgress < 1.0) {
        const animationId = requestAnimationFrame(animate)
        if (sceneRef.current) {
          sceneRef.current.animationId = animationId
        }
      }
    }

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    // Start single run animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener('resize', onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          if (container.contains(sceneRef.current.renderer.domElement)) {
            container.removeChild(sceneRef.current.renderer.domElement)
          }
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [duration])

  return (
    <div
      ref={containerRef}
      className="shader-portal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1500, // Above main website content, below splash screen
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  )
}

export default ShaderAnimation
