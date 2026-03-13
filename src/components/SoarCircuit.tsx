import { useState, useEffect } from 'react'

// Monochrome palette matching our design system
const c = {
  bg: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  heading: '#e6edf3',
  muted: '#6e7681',
  text: '#8b949e',
  success: '#3fb950',
  warning: '#d29922',
  danger: '#f85149',
  critical: '#da3633',
}

// Source labels positioned at the line start markers
const sources = [
  { label: 'Elastic', x: 10, y: 16 },
  { label: 'CrowdStrike', x: 155, y: 6 },
  { label: 'Zeek', x: 126, y: 16 },
  { label: 'GuardDuty', x: 153, y: 84 },
  { label: 'Suricata', x: 127, y: 69 },
  { label: 'Syslog', x: 89, y: 99 },
  { label: 'Okta', x: 80, y: 92 },
  { label: 'Webhook', x: 22, y: 26 },
]

export function SoarCircuit() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Inject CSS for offset-path animations
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById('soar-circuit-css')) return
    const style = document.createElement('style')
    style.id = 'soar-circuit-css'
    style.textContent = `
      .soar-trace {
        offset-anchor: 10px 0px;
        animation-name: soar-trace-move;
        animation-iteration-count: infinite;
        animation-timing-function: cubic-bezier(0.75, -0.01, 0, 0.99);
      }
      .soar-l1 { offset-path: path("M 10 20 h 79.5 q 5 0 5 5 v 24"); animation-duration: 5s; animation-delay: 1s; }
      .soar-l2 { offset-path: path("M 180 10 h -69.7 q -5 0 -5 5 v 24"); animation-delay: 6s; animation-duration: 2s; }
      .soar-l3 { offset-path: path("M 130 20 v 21.8 q 0 5 -5 5 h -25"); animation-delay: 4s; animation-duration: 6s; }
      .soar-l4 { offset-path: path("M 170 80 v -21.8 q 0 -5 -5 -5 h -65"); animation-delay: 3s; animation-duration: 3s; }
      .soar-l5 { offset-path: path("M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -35"); animation-delay: 9s; animation-duration: 4s; }
      .soar-l6 { offset-path: path("M 94.8 95 v -46"); animation-delay: 3s; animation-duration: 7s; }
      .soar-l7 { offset-path: path("M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 28"); animation-delay: 4s; animation-duration: 4s; }
      .soar-l8 { offset-path: path("M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 35"); animation-delay: 3s; animation-duration: 3s; }
      @keyframes soar-trace-move {
        0% { offset-distance: 0%; }
        100% { offset-distance: 100%; }
      }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 200 100"
        width="100%"
        height="100%"
        style={{ color: c.muted }}
      >
        {/* Circuit paths */}
        <g
          stroke="currentColor"
          fill="none"
          strokeWidth="0.3"
          strokeDasharray="100 100"
          pathLength="100"
          markerStart="url(#soar-marker)"
        >
          <path d="M 10 20 h 79.5 q 5 0 5 5 v 30" />
          <path d="M 180 10 h -69.7 q -5 0 -5 5 v 30" />
          <path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" />
          <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" />
          <path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" />
          <path d="M 94.8 95 v -36" />
          <path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" />
          <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" />
          {mounted && (
            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="0"
              dur="1s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.25,0.1,0.5,1"
              keyTimes="0; 1"
            />
          )}
        </g>

        {/* Glowing trace lights */}
        <g mask="url(#soar-m1)"><circle className="soar-trace soar-l1" cx="0" cy="0" r="8" fill="url(#soar-g-white)" /></g>
        <g mask="url(#soar-m2)"><circle className="soar-trace soar-l2" cx="0" cy="0" r="8" fill="url(#soar-g-green)" /></g>
        <g mask="url(#soar-m3)"><circle className="soar-trace soar-l3" cx="0" cy="0" r="8" fill="url(#soar-g-danger)" /></g>
        <g mask="url(#soar-m4)"><circle className="soar-trace soar-l4" cx="0" cy="0" r="8" fill="url(#soar-g-warn)" /></g>
        <g mask="url(#soar-m5)"><circle className="soar-trace soar-l5" cx="0" cy="0" r="8" fill="url(#soar-g-green)" /></g>
        <g mask="url(#soar-m6)"><circle className="soar-trace soar-l6" cx="0" cy="0" r="8" fill="url(#soar-g-danger)" /></g>
        <g mask="url(#soar-m7)"><circle className="soar-trace soar-l7" cx="0" cy="0" r="8" fill="url(#soar-g-white)" /></g>
        <g mask="url(#soar-m8)"><circle className="soar-trace soar-l8" cx="0" cy="0" r="8" fill="url(#soar-g-warn)" /></g>

        {/* Central SOAR chip */}
        <g>
          {/* Connection pins */}
          <g fill="url(#soar-pin-grad)">
            <rect x="93" y="37" width="2.5" height="5" rx="0.7" />
            <rect x="104" y="37" width="2.5" height="5" rx="0.7" />
            <rect x="116.3" y="44" width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)" />
            <rect x="122.8" y="44" width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)" />
            <rect x="104" y="16" width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)" />
            <rect x="114.5" y="16" width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)" />
            <rect x="80" y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)" />
            <rect x="87" y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)" />
          </g>

          {/* Main chip */}
          <rect x="85" y="40" width="30" height="20" rx="2" fill={c.surface} filter="url(#soar-shadow)" stroke={c.border} strokeWidth="0.3" />

          {/* SOAR text with shimmer */}
          <text x="88.5" y="52.5" fontSize="6.5" fill="url(#soar-text-grad)" fontWeight="700" letterSpacing="0.08em"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}>
            SOAR
          </text>
        </g>

        {/* Source labels */}
        {sources.map((s, i) => (
          <text key={i} x={s.x} y={s.y} fontSize="3" fill={c.muted} fontWeight="500"
            style={{ fontFamily: "-apple-system, sans-serif" }}>
            {s.label}
          </text>
        ))}

        {/* Defs */}
        <defs>
          {/* Masks for each trace path */}
          <mask id="soar-m1"><path d="M 10 20 h 79.5 q 5 0 5 5 v 24" strokeWidth="0.5" stroke="white" fill="none" /></mask>
          <mask id="soar-m2"><path d="M 180 10 h -69.7 q -5 0 -5 5 v 24" strokeWidth="0.5" stroke="white" fill="none" /></mask>
          <mask id="soar-m3"><path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" strokeWidth="0.5" stroke="white" fill="none" /></mask>
          <mask id="soar-m4"><path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" strokeWidth="0.5" stroke="white" fill="none" /></mask>
          <mask id="soar-m5"><path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" strokeWidth="0.5" stroke="white" fill="none" /></mask>
          <mask id="soar-m6"><path d="M 94.8 95 v -36" strokeWidth="0.5" stroke="white" fill="none" /></mask>
          <mask id="soar-m7"><path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" strokeWidth="0.5" stroke="white" fill="none" /></mask>
          <mask id="soar-m8"><path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" strokeWidth="0.5" stroke="white" fill="none" /></mask>

          {/* Trace glow gradients — monochrome with semantic colors */}
          <radialGradient id="soar-g-white" fx="1">
            <stop offset="0%" stopColor={c.heading} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="soar-g-green" fx="1">
            <stop offset="0%" stopColor={c.success} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="soar-g-danger" fx="1">
            <stop offset="0%" stopColor={c.danger} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="soar-g-warn" fx="1">
            <stop offset="0%" stopColor={c.warning} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Pin gradient */}
          <linearGradient id="soar-pin-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.border} />
            <stop offset="100%" stopColor={c.bg} />
          </linearGradient>

          {/* Shadow */}
          <filter id="soar-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor={c.heading} floodOpacity="0.08" />
          </filter>

          {/* Start marker dots */}
          <marker id="soar-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="14" markerHeight="14">
            <circle cx="5" cy="5" r="2" fill={c.bg} stroke={c.border} strokeWidth="0.5">
              <animate attributeName="r" values="0; 3; 2" dur="0.5s" />
            </circle>
          </marker>

          {/* SOAR text shimmer */}
          <linearGradient id="soar-text-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.muted}>
              <animate attributeName="offset" values="-2; -1; 0" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
            </stop>
            <stop offset="25%" stopColor={c.heading}>
              <animate attributeName="offset" values="-1; 0; 1" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
            </stop>
            <stop offset="50%" stopColor={c.muted}>
              <animate attributeName="offset" values="0; 1; 2" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
            </stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
