import { useState, useEffect, useRef } from 'react'

const c = {
  bg: '#0d1117',
  surface: '#161b22',
  border: '#30363d',
  heading: '#e6edf3',
  muted: '#6e7681',
  danger: '#f85149',
  critical: '#da3633',
  warning: '#d29922',
  success: '#3fb950',
  info: '#848d97',
}

interface Enrichment { label: string; value: string; color: string }

interface CardData {
  icon: React.ReactNode
  title: string
  desc: string
  sev: string
  sevColor: string
  source: string
  time: string
  enrichment: Enrichment[]
}

// Icons
const Shield = ({ color = c.danger }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const Warn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.warning} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
)
const XCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
)
const Bolt = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
)
const Eye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.warning} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)
const Key = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
)
const Server = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
)
const Globe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.warning} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
)
const Lock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)
const Wifi = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
)
const File = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.warning} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
)
const Bug = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.critical} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M19 8l-1.5 1M5 8l1.5 1M19 16l-1.5-1M5 16l1.5-1M12 6V2M8 2h8"/></svg>
)
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={c.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

// Spinner for "enriching" state
const Spinner = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ animation: 'alert-card-spin 0.8s linear infinite' }}>
    <circle cx="12" cy="12" r="10" stroke={c.muted} strokeWidth="3" opacity="0.3" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke={c.heading} strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// Every alert has enrichment
const allAlerts: CardData[] = [
  { icon: <XCircle />, title: 'Brute Force SSH Login', desc: '500+ failed attempts from 45.33.32.156', sev: 'high', sevColor: c.danger, source: 'Elastic SIEM', time: 'just now',
    enrichment: [{ label: 'VirusTotal', value: '47/90 malicious', color: c.danger }, { label: 'AbuseIPDB', value: '98% confidence', color: c.danger }, { label: 'GeoIP', value: 'Bucharest, RO', color: c.heading }] },
  { icon: <Shield />, title: 'Cobalt Strike Beacon', desc: 'C2 callback pattern on port 443', sev: 'critical', sevColor: c.critical, source: 'CrowdStrike', time: '5s ago',
    enrichment: [{ label: 'JA3 Hash', value: '72a589…matched', color: c.danger }, { label: 'C2 Server', value: '198.51.x.x', color: c.danger }, { label: 'Beacon Interval', value: '60s jitter', color: c.warning }] },
  { icon: <Warn />, title: 'Impossible Travel', desc: 'Login from 2 countries in 10 minutes', sev: 'medium', sevColor: c.warning, source: 'Azure AD', time: '12s ago',
    enrichment: [{ label: 'User', value: 's.chen@corp', color: c.heading }, { label: 'From', value: 'NYC → Lagos (6,870km)', color: c.warning }, { label: 'Risk', value: 'VPN unlikely', color: c.danger }] },
  { icon: <Bolt />, title: 'Privilege Escalation', desc: 'sudo to root from svc-deploy on prod-web-03', sev: 'high', sevColor: c.danger, source: 'Falco', time: '3s ago',
    enrichment: [{ label: 'User', value: 'svc-deploy', color: c.heading }, { label: 'Host', value: 'prod-web-03', color: c.heading }, { label: 'Risk Score', value: '92/100', color: c.danger }] },
  { icon: <Shield color={c.critical} />, title: 'DNS Exfiltration', desc: 'High-entropy queries to suspicious TLD', sev: 'critical', sevColor: c.critical, source: 'Zeek', time: '8s ago',
    enrichment: [{ label: 'Domain', value: 'x4k9a.evil.tk', color: c.danger }, { label: 'Entropy', value: '4.82 bits/char', color: c.warning }, { label: 'Queries', value: '1,247 in 5 min', color: c.danger }] },
  { icon: <Eye />, title: 'Unusual Outbound Traffic', desc: '4.2 GB upload to unknown IP in 20 min', sev: 'medium', sevColor: c.warning, source: 'Suricata', time: '15s ago',
    enrichment: [{ label: 'Dest IP', value: '103.x.x.42', color: c.heading }, { label: 'Protocol', value: 'HTTPS (pinned)', color: c.warning }, { label: 'Volume', value: '4.2 GB egress', color: c.danger }] },
  { icon: <XCircle />, title: 'Malware Hash Match', desc: 'Known ransomware binary on endpoint', sev: 'critical', sevColor: c.critical, source: 'SentinelOne', time: '1s ago',
    enrichment: [{ label: 'SHA256', value: 'a3f2…9c1d', color: c.heading }, { label: 'Family', value: 'LockBit 3.0', color: c.danger }, { label: 'VirusTotal', value: '62/72 malicious', color: c.danger }] },
  { icon: <Key />, title: 'MFA Bypass Attempt', desc: 'Token replay on OAuth endpoint', sev: 'high', sevColor: c.danger, source: 'Okta', time: '6s ago',
    enrichment: [{ label: 'Method', value: 'Session token replay', color: c.danger }, { label: 'User', value: 'admin@corp', color: c.heading }, { label: 'Origin', value: 'Tor exit node', color: c.danger }] },
  { icon: <Server />, title: 'Cryptominer Detected', desc: 'XMRig process on k8s worker node', sev: 'critical', sevColor: c.critical, source: 'Falco', time: '2s ago',
    enrichment: [{ label: 'Process', value: 'xmrig --threads=8', color: c.danger }, { label: 'Pool', value: 'pool.minexmr.com', color: c.danger }, { label: 'CPU', value: '98% utilization', color: c.warning }] },
  { icon: <Globe />, title: 'Tor Exit Node Connection', desc: 'Outbound to known Tor relay 185.220.x.x', sev: 'medium', sevColor: c.warning, source: 'Firewall', time: '20s ago',
    enrichment: [{ label: 'Relay', value: '185.220.101.x', color: c.heading }, { label: 'Internal IP', value: '10.0.4.217', color: c.heading }, { label: 'Threat Intel', value: 'Known exit node', color: c.warning }] },
  { icon: <Lock />, title: 'Ransomware File Rename', desc: 'Mass .encrypted extension on file share', sev: 'critical', sevColor: c.critical, source: 'CrowdStrike', time: 'just now',
    enrichment: [{ label: 'Files', value: '2,847 renamed', color: c.danger }, { label: 'Extension', value: '.encrypted', color: c.danger }, { label: 'First seen', value: '14:32:01 UTC', color: c.heading }] },
  { icon: <Wifi />, title: 'Rogue AP Detected', desc: 'Unauthorized access point in building 3', sev: 'high', sevColor: c.danger, source: 'Meraki', time: '10s ago',
    enrichment: [{ label: 'SSID', value: 'CorpWiFi-Guest', color: c.warning }, { label: 'MAC', value: 'de:ad:be:ef:…', color: c.heading }, { label: 'Signal', value: '-42 dBm (close)', color: c.danger }] },
  { icon: <Bolt />, title: 'Lateral Movement', desc: 'PsExec from DC01 to 14 workstations', sev: 'critical', sevColor: c.critical, source: 'CrowdStrike', time: '4s ago',
    enrichment: [{ label: 'Source', value: 'DC01', color: c.heading }, { label: 'Targets', value: '14 hosts', color: c.danger }, { label: 'Tool', value: 'PsExec v2.43', color: c.warning }] },
  { icon: <File />, title: 'Sensitive File Access', desc: 'Bulk download from HR SharePoint', sev: 'medium', sevColor: c.warning, source: 'Microsoft 365', time: '30s ago',
    enrichment: [{ label: 'User', value: 'r.thompson@corp', color: c.heading }, { label: 'Files', value: '340 documents', color: c.warning }, { label: 'Labels', value: 'Confidential/PII', color: c.danger }] },
  { icon: <Bug />, title: 'Zero-Day Exploit Attempt', desc: 'CVE-2024-3094 on edge proxy', sev: 'critical', sevColor: c.critical, source: 'Snort', time: 'just now',
    enrichment: [{ label: 'CVE', value: 'CVE-2024-3094', color: c.danger }, { label: 'Target', value: 'edge-proxy-01', color: c.heading }, { label: 'Payload', value: 'RCE attempt', color: c.danger }] },
  { icon: <Key />, title: 'Credential Stuffing', desc: '12k login attempts across 800 accounts', sev: 'high', sevColor: c.danger, source: 'Cloudflare', time: '7s ago',
    enrichment: [{ label: 'Attempts', value: '12,431', color: c.danger }, { label: 'Unique IPs', value: '89 sources', color: c.warning }, { label: 'Success', value: '3 accounts hit', color: c.danger }] },
  { icon: <Eye />, title: 'Suspicious API Calls', desc: 'IAM enumeration from compromised key', sev: 'high', sevColor: c.danger, source: 'GuardDuty', time: '9s ago',
    enrichment: [{ label: 'Key', value: 'AKIA…3F7Q', color: c.heading }, { label: 'Actions', value: 'ListUsers, GetPolicy', color: c.warning }, { label: 'Region', value: 'us-east-1', color: c.heading }] },
  { icon: <Server />, title: 'Container Escape', desc: 'Breakout via CVE-2024-21626', sev: 'critical', sevColor: c.critical, source: 'Sysdig', time: '2s ago',
    enrichment: [{ label: 'Container', value: 'api-worker-7f2d', color: c.heading }, { label: 'CVE', value: 'CVE-2024-21626', color: c.danger }, { label: 'Namespace', value: 'production', color: c.danger }] },
  { icon: <Warn />, title: 'Phishing Link Clicked', desc: 'User opened credential harvesting page', sev: 'medium', sevColor: c.warning, source: 'Proofpoint', time: '25s ago',
    enrichment: [{ label: 'User', value: 'm.jones@corp', color: c.heading }, { label: 'URL', value: 'login-verify.evil.com', color: c.danger }, { label: 'Submitted', value: 'Credentials entered', color: c.danger }] },
  { icon: <Lock />, title: 'Account Takeover', desc: 'Password changed after suspicious login', sev: 'high', sevColor: c.danger, source: 'Azure AD', time: '11s ago',
    enrichment: [{ label: 'User', value: 'j.martinez@corp', color: c.heading }, { label: 'Login IP', value: '91.234.x.x (RU)', color: c.danger }, { label: 'Action', value: 'Password reset', color: c.warning }] },
]

const CYCLE_MS = 2400
const SHIFT_MS = 500
const ENRICH_LOADING_DELAY = 400  // show spinner after card lands
const ENRICH_RESULT_DELAY = 900   // show results after spinner

const posStyles: React.CSSProperties[] = [
  { gridArea: 'stack', opacity: 0.25, filter: 'grayscale(100%)', transform: 'skewY(-8deg) translateY(-8px)', zIndex: 1 },
  { gridArea: 'stack', opacity: 0.5, filter: 'grayscale(100%)', transform: 'skewY(-8deg) translateX(2.5rem) translateY(2rem)', zIndex: 2 },
  { gridArea: 'stack', opacity: 1, filter: 'grayscale(0%)', transform: 'skewY(-8deg) translateX(5rem) translateY(4rem)', zIndex: 3 },
]

const exitStyle: React.CSSProperties = {
  gridArea: 'stack', opacity: 0, filter: 'grayscale(100%)', transform: 'skewY(-8deg) translateY(-40px) scale(0.95)', zIndex: 0,
}
const enterStart: React.CSSProperties = {
  gridArea: 'stack', opacity: 0, transform: 'skewY(-8deg) translateX(6rem) translateY(8rem) scale(0.98)', zIndex: 4,
}
const t = `all ${SHIFT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`

// Enrichment states: hidden → loading → visible
type EnrichState = 'hidden' | 'loading' | 'visible'

// Inject spinner keyframes into DOM once
const styleId = 'alert-card-styles'
function ensureStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(styleId)) return
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `@keyframes alert-card-spin { to { transform: rotate(360deg); } }`
  document.head.appendChild(style)
}

export function AlertDisplayCards() {
  const [stack, setStack] = useState([0, 1, 2])
  const nextRef = useRef(3)
  const [shifting, setShifting] = useState(false)
  const [enterIdx, setEnterIdx] = useState<number | null>(null)
  const [enterLanded, setEnterLanded] = useState(false)
  const [enrichState, setEnrichState] = useState<EnrichState>('visible') // initial front card starts enriched
  const [paused, setPaused] = useState(false)

  useEffect(() => ensureStyles(), [])

  useEffect(() => {
    if (paused) return

    const timer = setInterval(() => {
      const newIdx = nextRef.current % allAlerts.length
      nextRef.current += 1

      // Step 1: Collapse enrichment first
      setEnrichState('hidden')

      // Step 2: After enrichment collapses, THEN shift cards
      setTimeout(() => {
        setShifting(true)
        setEnterIdx(newIdx)
        setEnterLanded(false)

        // Land the entering card
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setEnterLanded(true)
          })
        })

        // Step 3: After slide finishes, finalize + start enrich on new front
        setTimeout(() => {
          setStack(prev => [prev[1], prev[2], newIdx])
          setEnterIdx(null)
          setEnterLanded(false)
          setShifting(false)

          // Show loading spinner
          setTimeout(() => {
            setEnrichState('loading')

            // Then show results
            setTimeout(() => {
              setEnrichState('visible')
            }, ENRICH_RESULT_DELAY)
          }, ENRICH_LOADING_DELAY)
        }, SHIFT_MS)
      }, 350) // wait for enrichment collapse
    }, CYCLE_MS)

    return () => clearInterval(timer)
  }, [paused, stack])

  // On mount: animate the initial enrichment in
  useEffect(() => {
    setEnrichState('hidden')
    setTimeout(() => setEnrichState('loading'), 500)
    setTimeout(() => setEnrichState('visible'), 1200)
  }, [])

  const getStyle = (position: number): React.CSSProperties => {
    if (shifting) {
      if (position === 0) return { ...exitStyle, transition: t }
      if (position === 1) return { ...posStyles[0], transition: t }
      return { ...posStyles[1], transition: t }
    }
    return { ...posStyles[position], transition: t }
  }

  return (
    <div
      style={{ display: 'grid', gridTemplateAreas: "'stack'", placeItems: 'center', minHeight: '300px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {stack.map((alertIdx, position) => {
        const isFront = position === 2 && !shifting
        return (
          <div key={`s-${alertIdx}-${position}`} style={getStyle(position)}>
            <CardView
              card={allAlerts[alertIdx]}
              front={isFront}
              enrichState={isFront ? enrichState : 'hidden'}
            />
          </div>
        )
      })}

      {enterIdx !== null && (
        <div style={enterLanded ? { ...posStyles[2], transition: t } : { ...enterStart, transition: 'none' }}>
          <CardView card={allAlerts[enterIdx]} front={true} enrichState="hidden" />
        </div>
      )}
    </div>
  )
}

function CardView({ card, front, enrichState }: { card: CardData; front: boolean; enrichState: EnrichState }) {
  const showBox = enrichState === 'loading' || enrichState === 'visible'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', width: '22rem', borderRadius: '0.75rem',
      border: `1px solid ${front ? c.heading + '33' : c.border}`,
      backgroundColor: c.surface, padding: '1rem 1.25rem',
      boxShadow: front ? '0 10px 40px rgba(0,0,0,0.3)' : undefined,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {card.icon}
        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: c.heading }}>{card.title}</span>
      </div>
      <p style={{ fontSize: '0.7rem', color: c.muted, marginTop: '0.5rem' }}>{card.desc}</p>

      {/* Enrichment area — animated expand */}
      <div style={{
        overflow: 'hidden',
        maxHeight: showBox ? '120px' : '0px',
        opacity: showBox ? 1 : 0,
        transition: 'max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
        marginTop: showBox ? '0.5rem' : '0',
      }}>
        <div style={{
          border: `1px solid ${c.border}`, borderRadius: '0.375rem',
          backgroundColor: c.bg + '80', padding: '0.5rem 0.75rem',
        }}>
          {/* Header with spinner → checkmark transition */}
          <div style={{ fontSize: '0.6rem', fontWeight: 500, color: enrichState === 'loading' ? c.muted : c.heading, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.3s ease' }}>
            {enrichState === 'loading' ? <Spinner /> : <CheckIcon />}
            {enrichState === 'loading' ? 'Enriching via playbook…' : 'Auto-enriched by playbook'}
          </div>

          {/* Results — fade in row by row */}
          {card.enrichment.map((item, j) => (
            <div key={j} style={{
              display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginTop: '0.2rem',
              opacity: enrichState === 'visible' ? 1 : 0,
              transform: enrichState === 'visible' ? 'translateY(0)' : 'translateY(4px)',
              transition: `opacity 0.3s ease ${j * 0.08}s, transform 0.3s ease ${j * 0.08}s`,
            }}>
              <span style={{ color: c.muted }}>{item.label}</span>
              <span style={{ color: item.color, fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.625rem' }}>
        <span style={{
          fontSize: '0.625rem', fontWeight: 500, color: card.sevColor,
          backgroundColor: card.sevColor + '1a', padding: '0.125rem 0.375rem', borderRadius: '0.25rem',
        }}>
          {card.sev}
        </span>
        <span style={{ fontSize: '0.625rem', color: c.muted }}>{card.source} · {card.time}</span>
        {enrichState === 'visible' && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.6rem', color: c.success, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            opacity: 1, transition: 'opacity 0.3s ease 0.3s',
          }}>
            <CheckIcon /> Triaged
          </span>
        )}
        {enrichState === 'loading' && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.6rem', color: c.muted, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}>
            <Spinner /> Enriching…
          </span>
        )}
      </div>
    </div>
  )
}
