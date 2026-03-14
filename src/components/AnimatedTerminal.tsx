import { useState, useEffect, useRef } from 'react'

const c = {
  bg: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  heading: '#e6edf3',
  muted: '#6e7681',
  text: '#8b949e',
  success: '#3fb950',
  danger: '#f85149',
  warning: '#d29922',
}

const defaultCommands = [
  'git clone https://github.com/opensoar-hq/opensoar-deploy',
  'cd opensoar-deploy && cp .env.example .env',
  'docker compose up -d',
]

const defaultOutputs = [
  { text: 'PostgreSQL + Redis ready', delay: 0 },
  { text: 'API running on :8000', delay: 150 },
  { text: 'Dashboard ready at :3000', delay: 300 },
  { text: '3 example playbooks loaded', delay: 450 },
]

// Typing speed
const CHAR_MS = 28
const CMD_PAUSE = 400 // pause between commands
const OUTPUT_START_DELAY = 300 // pause before output starts

type Phase = 'typing' | 'pausing' | 'output' | 'done'

interface AnimatedTerminalProps {
  commands?: string[]
  outputs?: { text: string; delay: number }[]
  title?: string
  height?: string
}

export function AnimatedTerminal({
  commands = defaultCommands,
  outputs = defaultOutputs,
  title,
  height = '220px',
}: AnimatedTerminalProps = {}) {
  const [typedCommands, setTypedCommands] = useState<string[]>([])
  const [currentCmd, setCurrentCmd] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [visibleOutputs, setVisibleOutputs] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('typing')
  const [showCursor, setShowCursor] = useState(true)

  // Inject keyframes
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById('terminal-css')) return
    const s = document.createElement('style')
    s.id = 'terminal-css'
    s.textContent = `@keyframes terminal-line-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`
    document.head.appendChild(s)
  }, [])

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 530)
    return () => clearInterval(blink)
  }, [])

  // Main animation loop
  useEffect(() => {
    if (phase === 'typing') {
      if (currentCmd >= commands.length) {
        // All commands typed, start output
        setPhase('output')
        return
      }

      const cmd = commands[currentCmd]
      if (currentChar < cmd.length) {
        const timer = setTimeout(() => {
          setCurrentChar(prev => prev + 1)
        }, CHAR_MS + Math.random() * 15) // slight randomness for realism
        return () => clearTimeout(timer)
      } else {
        // Command fully typed — "press enter"
        setTypedCommands(prev => [...prev, cmd])
        setCurrentChar(0)
        setCurrentCmd(prev => prev + 1)
        setPhase('pausing')
      }
    }

    if (phase === 'pausing') {
      const timer = setTimeout(() => setPhase('typing'), CMD_PAUSE)
      return () => clearTimeout(timer)
    }

    if (phase === 'output') {
      const timer = setTimeout(() => {
        // Reveal outputs one by one using separate timeouts with captured values
        outputs.forEach((out, i) => {
          const totalDelay = outputs.slice(0, i).reduce((sum, o) => sum + (o.delay || 200), 0)
          setTimeout(() => {
            setVisibleOutputs(prev => [...prev, i])
            if (i === outputs.length - 1) {
              setTimeout(() => setPhase('done'), 200)
            }
          }, totalDelay)
        })
      }, OUTPUT_START_DELAY)
      return () => clearTimeout(timer)
    }

    // 'done' — terminal stays as-is, no restart
  }, [phase, currentCmd, currentChar])

  // Build the current typing line
  const typingLine = currentCmd < commands.length
    ? commands[currentCmd].slice(0, currentChar)
    : null

  return (
    <div style={{
      borderRadius: '0.5rem',
      border: `1px solid ${c.border}`,
      backgroundColor: c.surface,
      overflow: 'hidden',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1rem',
        borderBottom: `1px solid ${c.border}`,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.danger, opacity: 0.5 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.warning, opacity: 0.5 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c.success, opacity: 0.5 }} />
        <span style={{ marginLeft: '0.5rem', fontSize: '0.6875rem', color: c.muted, fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}>
          {title ?? `terminal — ${commands.length} command${commands.length === 1 ? '' : 's'} to production`}
        </span>
      </div>

      {/* Terminal body */}
      <div style={{
        padding: '1rem',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
        fontSize: '0.75rem',
        textAlign: 'left',
        color: c.text,
        lineHeight: 1.9,
        height,
      }}>
        {/* Already typed commands */}
        {typedCommands.map((cmd, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ color: c.heading, userSelect: 'none' }}>$</span>
            <span>{cmd}</span>
          </div>
        ))}

        {/* Currently typing line */}
        {typingLine !== null && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ color: c.heading, userSelect: 'none' }}>$</span>
            <span>
              {typingLine}
              <span style={{
                display: 'inline-block',
                width: '0.5rem',
                height: '1.1em',
                backgroundColor: showCursor ? c.heading : 'transparent',
                verticalAlign: 'text-bottom',
                marginLeft: '1px',
                transition: 'background-color 0.1s',
              }} />
            </span>
          </div>
        )}

        {/* Cursor on empty line when all commands typed but no output yet */}
        {currentCmd >= commands.length && visibleOutputs.length === 0 && phase !== 'done' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: c.heading, userSelect: 'none' }}>$</span>
            <span style={{
              display: 'inline-block',
              width: '0.5rem',
              height: '0.85em',
              backgroundColor: showCursor ? c.heading : 'transparent',
              transition: 'background-color 0.1s',
            }} />
          </div>
        )}

        {/* Output lines — only render visible ones */}
        {visibleOutputs.length > 0 && (
          <div style={{
            marginTop: '0.25rem',
            paddingLeft: '1rem',
            borderLeft: `2px solid ${c.success}4d`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.125rem',
            lineHeight: 1.5,
          }}>
            {visibleOutputs.map((idx) => {
              const out = outputs[idx]
              return (
                <div
                  key={idx}
                  style={{
                    animation: 'terminal-line-in 0.3s ease both',
                  }}
                >
                  <span style={{ color: c.success }}>&#10003;</span>{' '}
                  {out.text.includes(':') ? (
                    <>
                      {out.text.split(':')[0]}:{' '}
                      <span style={{ color: c.heading }}>{out.text.split(':').slice(1).join(':')}</span>
                    </>
                  ) : out.text}
                </div>
              )
            })}
          </div>
        )}

        {/* Final ready prompt after everything is done */}
        {phase === 'done' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginTop: '0.25rem',
            animation: 'terminal-line-in 0.3s ease both',
          }}>
            <span style={{ color: c.heading, userSelect: 'none' }}>$</span>
            <span style={{
              display: 'inline-block',
              width: '0.5rem',
              height: '0.85em',
              backgroundColor: showCursor ? c.heading : 'transparent',
              transition: 'background-color 0.1s',
            }} />
          </div>
        )}
      </div>
    </div>
  )
}
