import { useState, useEffect, useRef } from 'react'
import { Shield, Webhook, Search, Eye, AlertTriangle, Radio, Key, Cloud } from 'lucide-react'

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
}

interface SourceNode {
  label: string
  icon: React.ElementType
  color: string
}

const sources: SourceNode[] = [
  { label: 'Elastic', icon: Search, color: c.success },
  { label: 'CrowdStrike', icon: Shield, color: c.heading },
  { label: 'Wazuh', icon: Eye, color: c.warning },
  { label: 'GuardDuty', icon: Cloud, color: c.warning },
  { label: 'Suricata', icon: AlertTriangle, color: c.danger },
  { label: 'Syslog', icon: Radio, color: c.text },
  { label: 'Okta', icon: Key, color: c.heading },
  { label: 'Webhooks', icon: Webhook, color: c.success },
]

export function SoarOrbital() {
  const [angle, setAngle] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    let last = 0
    const tick = (time: number) => {
      if (last) {
        const dt = (time - last) / 1000
        setAngle(prev => (prev + dt * 18) % 360)
      }
      last = time
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const cx = 150
  const cy = 115
  const radius = 95

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '550px', margin: '0 auto', overflow: 'hidden' }}>
      <svg viewBox="0 0 300 230" width="100%" style={{ overflow: 'visible' }}>
        {/* Orbit ring */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={c.border}
          strokeWidth="0.5"
          strokeDasharray="3 3"
          opacity={0.5}
        />

        {/* Faint inner ring */}
        <circle
          cx={cx} cy={cy} r={radius * 0.55}
          fill="none"
          stroke={c.border}
          strokeWidth="0.3"
          strokeDasharray="2 4"
          opacity={0.3}
        />

        {/* Connection lines from nodes to center */}
        {sources.map((src, i) => {
          const a = ((i / sources.length) * 360 + angle) * (Math.PI / 180)
          const x = cx + radius * Math.cos(a)
          const y = cy + radius * Math.sin(a)
          return (
            <line
              key={`line-${i}`}
              x1={x} y1={y} x2={cx} y2={cy}
              stroke={src.color}
              strokeWidth="0.3"
              opacity={0.15}
            />
          )
        })}

        {/* Pulse rings on center */}
        <circle cx={cx} cy={cy} r={18} fill="none" stroke={c.heading} strokeWidth="0.3" opacity={0.2}>
          <animate attributeName="r" values="18;28;18" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r={22} fill="none" stroke={c.heading} strokeWidth="0.2" opacity={0.15}>
          <animate attributeName="r" values="22;34;22" dur="3s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" begin="0.8s" repeatCount="indefinite" />
        </circle>

        {/* Center SOAR node */}
        <circle cx={cx} cy={cy} r={18} fill={c.surface} stroke={c.border} strokeWidth="0.6" />
        <text
          x={cx} y={cy + 1.5}
          fontSize="7"
          fill={c.heading}
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="0.08em"
          style={{ fontFamily: "'Inter Tight', sans-serif" }}
        >
          SOAR
        </text>

        {/* Orbiting source nodes */}
        {sources.map((src, i) => {
          const a = ((i / sources.length) * 360 + angle) * (Math.PI / 180)
          const x = cx + radius * Math.cos(a)
          const y = cy + radius * Math.sin(a)
          // Fade based on vertical position (top = further, bottom = closer)
          const opacity = 0.45 + 0.55 * ((1 + Math.sin(a)) / 2)
          const scale = 0.8 + 0.2 * ((1 + Math.sin(a)) / 2)
          const Icon = src.icon

          return (
            <g key={i} opacity={opacity}>
              {/* Glow */}
              <circle cx={x} cy={y} r={14} fill={src.color} opacity={0.06} />
              {/* Node bg */}
              <circle cx={x} cy={y} r={10} fill={c.bg} stroke={c.border} strokeWidth="0.5" />
              {/* Icon */}
              <foreignObject
                x={x - 6} y={y - 6}
                width={12} height={12}
                style={{ overflow: 'visible' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 12,
                  height: 12,
                  transform: `scale(${scale})`,
                }}>
                  <Icon size={9} color={src.color} strokeWidth={2} />
                </div>
              </foreignObject>
              {/* Label */}
              <text
                x={x}
                y={y + 16}
                fontSize="4.5"
                fill={c.muted}
                textAnchor="middle"
                fontWeight="500"
                style={{ fontFamily: "-apple-system, sans-serif" }}
              >
                {src.label}
              </text>
            </g>
          )
        })}

        {/* Traveling dots (alerts flowing to center) */}
        {sources.map((src, i) => {
          const a = ((i / sources.length) * 360 + angle) * (Math.PI / 180)
          const progress = ((angle * 2 + i * 47) % 360) / 360
          const dotX = cx + radius * (1 - progress) * Math.cos(a)
          const dotY = cy + radius * (1 - progress) * Math.sin(a)
          return (
            <circle
              key={`dot-${i}`}
              cx={dotX}
              cy={dotY}
              r={1.5}
              fill={src.color}
              opacity={progress < 0.85 ? 0.6 * (1 - progress) : 0}
            />
          )
        })}
      </svg>
    </div>
  )
}
