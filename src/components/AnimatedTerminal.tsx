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

const commands = [
  'git clone https://github.com/opensoar-hq/opensoar-deploy',
  'cd opensoar-deploy && cp .env.example .env',
  'docker compose up -d',
]

const outputs = [
  { text: 'PostgreSQL + Redis ready', delay: 0 },
  { text: 'API running on :8000', delay: 150 },
  { text: 'Dashboard ready at :3000', delay: 300 },
  { text: '3 example playbooks loaded', delay: 450 },
]

// Typing speed
const CHAR_MS = 28
const CMD_PAUSE = 400 // pause between commands
const OUTPUT_START_DELAY = 300 // pause before output starts

type Phase = 'typing' | 'pausing' | 'output' | 'done' | 'restarting'

export function AnimatedTerminal() {
  const [typedCommands, setTypedCommands] = useState<string[]>([])
  const [currentCmd, setCurrentCmd] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [visibleOutputs, setVisibleOutputs] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('typing')
  const [showCursor, setShowCursor] = useState(true)

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
        // Reveal outputs one by one
        let idx = 0
        const reveal = () => {
          if (idx < outputs.length) {
            setVisibleOutputs(prev => [...prev, idx])
            idx++
            setTimeout(reveal, outputs[idx - 1]?.delay || 200)
          } else {
            setPhase('done')
          }
        }
        reveal()
      }, OUTPUT_START_DELAY)
      return () => clearTimeout(timer)
    }

    if (phase === 'done') {
      // Wait then restart
      const timer = setTimeout(() => {
        setPhase('restarting')
      }, 4000)
      return () => clearTimeout(timer)
    }

    if (phase === 'restarting') {
      setTypedCommands([])
      setCurrentCmd(0)
      setCurrentChar(0)
      setVisibleOutputs([])
      setPhase('typing')
    }
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
          terminal — 4 commands to production
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
        minHeight: '180px',
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
        {currentCmd >= commands.length && visibleOutputs.length === 0 && phase !== 'done' && phase !== 'restarting' && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ color: c.heading, userSelect: 'none' }}>$</span>
            <span style={{
              display: 'inline-block',
              width: '0.5rem',
              height: '1.1em',
              backgroundColor: showCursor ? c.heading : 'transparent',
              verticalAlign: 'text-bottom',
            }} />
          </div>
        )}

        {/* Output lines */}
        {visibleOutputs.length > 0 && (
          <div style={{
            marginTop: '0.5rem',
            paddingLeft: '1rem',
            borderLeft: `2px solid ${c.success}4d`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.125rem',
          }}>
            {outputs.map((out, i) => {
              const visible = visibleOutputs.includes(i)
              return (
                <div
                  key={i}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
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
      </div>
    </div>
  )
}
