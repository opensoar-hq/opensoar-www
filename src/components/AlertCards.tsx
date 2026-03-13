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

interface AiStep { text: string; highlight?: string; highlightColor?: string }

interface CardData {
  icon: React.ReactNode
  title: string
  desc: string
  sev: string
  sevColor: string
  source: string
  time: string
  aiSteps: AiStep[]
  aiResult: string
  aiResultDetail: string
  aiTime: string
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
    aiSteps: [
      { text: 'Classified as', highlight: 'Brute Force Attack', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Credential Access · T1110.001', highlightColor: c.danger },
      { text: 'Severity raised from medium →', highlight: 'high', highlightColor: c.danger },
      { text: 'AbuseIPDB lookup:', highlight: '98% malicious confidence', highlightColor: c.danger },
      { text: 'Correlated with', highlight: '12 related events from same IP', highlightColor: c.heading },
      { text: 'Recommended:', highlight: 'Block IP + escalate to on-call', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.8s', aiResultDetail: 'Playbook triggered — IP blocked, SOC notified via Slack', aiTime: '0.8s' },
  { icon: <Shield />, title: 'Cobalt Strike Beacon', desc: 'C2 callback pattern on port 443', sev: 'critical', sevColor: c.critical, source: 'CrowdStrike', time: '5s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'C2 Communication', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Command & Control · T1071.001', highlightColor: c.danger },
      { text: 'JA3 fingerprint matches', highlight: 'known Cobalt Strike signature', highlightColor: c.danger },
      { text: 'Beacon interval:', highlight: '60s with 25% jitter — classic CS profile', highlightColor: c.warning },
      { text: 'Correlated with', highlight: '2 lateral movement alerts on same host', highlightColor: c.heading },
      { text: 'Recommended:', highlight: 'Isolate endpoint + initiate IR', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.1s', aiResultDetail: 'Host isolated, IR playbook triggered, Slack alert sent', aiTime: '1.1s' },
  { icon: <Warn />, title: 'Impossible Travel', desc: 'Login from 2 countries in 10 minutes', sev: 'medium', sevColor: c.warning, source: 'Azure AD', time: '12s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Account Compromise', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Valid Accounts · T1078', highlightColor: c.warning },
      { text: 'Distance:', highlight: 'NYC → Lagos — 6,870 km in 10 min', highlightColor: c.warning },
      { text: 'VPN analysis:', highlight: 'No corporate VPN detected', highlightColor: c.danger },
      { text: 'User risk score:', highlight: '78/100 — first impossible travel event', highlightColor: c.warning },
      { text: 'Recommended:', highlight: 'Force re-auth + require MFA', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.4s', aiResultDetail: 'Session revoked, MFA re-enrollment triggered', aiTime: '1.4s' },
  { icon: <Bolt />, title: 'Privilege Escalation', desc: 'sudo to root from svc-deploy on prod-web-03', sev: 'high', sevColor: c.danger, source: 'Falco', time: '3s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Privilege Escalation', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Abuse Elevation Control · T1548', highlightColor: c.danger },
      { text: 'User svc-deploy:', highlight: 'not authorized for sudo on production', highlightColor: c.danger },
      { text: 'Risk score:', highlight: '92/100 — production host targeted', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Revoke access + investigate user', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.9s', aiResultDetail: 'Access revoked, forensic snapshot captured', aiTime: '0.9s' },
  { icon: <Shield color={c.critical} />, title: 'DNS Exfiltration', desc: 'High-entropy queries to suspicious TLD', sev: 'critical', sevColor: c.critical, source: 'Zeek', time: '8s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Data Exfiltration via DNS', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Exfiltration Over Alternative Protocol · T1048', highlightColor: c.danger },
      { text: 'Entropy analysis:', highlight: '4.82 bits/char — encoded data likely', highlightColor: c.warning },
      { text: 'Domain:', highlight: 'x4k9a.evil.tk — registered 2 days ago', highlightColor: c.danger },
      { text: 'Volume:', highlight: '1,247 queries in 5 minutes', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Block domain + initiate IR', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.2s', aiResultDetail: 'Domain blocked at DNS, host quarantined', aiTime: '1.2s' },
  { icon: <Eye />, title: 'Unusual Outbound Traffic', desc: '4.2 GB upload to unknown IP in 20 min', sev: 'medium', sevColor: c.warning, source: 'Suricata', time: '15s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Potential Data Exfiltration', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Exfiltration Over C2 Channel · T1041', highlightColor: c.warning },
      { text: 'Destination:', highlight: '103.x.x.42 — no prior communication', highlightColor: c.warning },
      { text: 'Protocol:', highlight: 'HTTPS with certificate pinning', highlightColor: c.warning },
      { text: 'Volume anomaly:', highlight: '4.2 GB — 340x above baseline', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Throttle connection + alert SOC', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.6s', aiResultDetail: 'Connection throttled, SOC ticket created', aiTime: '1.6s' },
  { icon: <XCircle />, title: 'Malware Hash Match', desc: 'Known ransomware binary on endpoint', sev: 'critical', sevColor: c.critical, source: 'SentinelOne', time: '1s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Ransomware — LockBit 3.0', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'User Execution · T1204', highlightColor: c.danger },
      { text: 'VirusTotal:', highlight: '62/72 engines flagged malicious', highlightColor: c.danger },
      { text: 'File hash:', highlight: 'SHA256 a3f2…9c1d — known IOC', highlightColor: c.danger },
      { text: 'Correlated with', highlight: 'file rename activity on same host', highlightColor: c.heading },
      { text: 'Recommended:', highlight: 'Isolate endpoint + network contain', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.6s', aiResultDetail: 'Host isolated, backups verified, IR engaged', aiTime: '0.6s' },
  { icon: <Key />, title: 'MFA Bypass Attempt', desc: 'Token replay on OAuth endpoint', sev: 'high', sevColor: c.danger, source: 'Okta', time: '6s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Authentication Bypass', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Steal Web Session Cookie · T1539', highlightColor: c.danger },
      { text: 'Method:', highlight: 'Session token replay attack', highlightColor: c.danger },
      { text: 'Origin:', highlight: 'Tor exit node — anonymized', highlightColor: c.danger },
      { text: 'Target account:', highlight: 'admin@corp — high-privilege', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Revoke all tokens + block origin', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.7s', aiResultDetail: 'Tokens revoked, Tor egress blocked', aiTime: '0.7s' },
  { icon: <Server />, title: 'Cryptominer Detected', desc: 'XMRig process on k8s worker node', sev: 'critical', sevColor: c.critical, source: 'Falco', time: '2s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Resource Hijacking', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Resource Hijacking · T1496', highlightColor: c.danger },
      { text: 'Process:', highlight: 'xmrig --threads=8 — known miner', highlightColor: c.danger },
      { text: 'Mining pool:', highlight: 'pool.minexmr.com — Monero', highlightColor: c.danger },
      { text: 'CPU impact:', highlight: '98% utilization on worker node', highlightColor: c.warning },
      { text: 'Recommended:', highlight: 'Kill process + scan container image', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.5s', aiResultDetail: 'Process killed, image quarantined, node rescanned', aiTime: '0.5s' },
  { icon: <Globe />, title: 'Tor Exit Node Connection', desc: 'Outbound to known Tor relay 185.220.x.x', sev: 'medium', sevColor: c.warning, source: 'Firewall', time: '20s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Anonymization Activity', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Proxy · T1090', highlightColor: c.warning },
      { text: 'Destination:', highlight: 'Known Tor relay — 185.220.101.x', highlightColor: c.warning },
      { text: 'Internal source:', highlight: '10.0.4.217 — developer workstation', highlightColor: c.heading },
      { text: 'Threat intel:', highlight: 'Exit node — no malicious history', highlightColor: c.warning },
      { text: 'Recommended:', highlight: 'Log + monitor for follow-up activity', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 2.1s', aiResultDetail: 'Logged for review, monitoring rule added', aiTime: '2.1s' },
  { icon: <Lock />, title: 'Ransomware File Rename', desc: 'Mass .encrypted extension on file share', sev: 'critical', sevColor: c.critical, source: 'CrowdStrike', time: 'just now',
    aiSteps: [
      { text: 'Classified as', highlight: 'Active Ransomware', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Data Encrypted for Impact · T1486', highlightColor: c.danger },
      { text: 'Files affected:', highlight: '2,847 renamed to .encrypted', highlightColor: c.danger },
      { text: 'First seen:', highlight: '14:32:01 UTC — spreading rapidly', highlightColor: c.danger },
      { text: 'Correlated with', highlight: 'malware hash match on same segment', highlightColor: c.heading },
      { text: 'Recommended:', highlight: 'Network isolate + restore from backup', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.4s', aiResultDetail: 'Segment isolated, backup restoration initiated', aiTime: '0.4s' },
  { icon: <Wifi />, title: 'Rogue AP Detected', desc: 'Unauthorized access point in building 3', sev: 'high', sevColor: c.danger, source: 'Meraki', time: '10s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Rogue Infrastructure', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Adversary-in-the-Middle · T1557', highlightColor: c.danger },
      { text: 'SSID spoofing:', highlight: '"CorpWiFi-Guest" — mimics corporate', highlightColor: c.danger },
      { text: 'Signal:', highlight: '-42 dBm — physically close proximity', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Locate device + disable', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.3s', aiResultDetail: 'Physical security dispatched, AP triangulated', aiTime: '1.3s' },
  { icon: <Bolt />, title: 'Lateral Movement', desc: 'PsExec from DC01 to 14 workstations', sev: 'critical', sevColor: c.critical, source: 'CrowdStrike', time: '4s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Lateral Movement', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Lateral Tool Transfer · T1570', highlightColor: c.danger },
      { text: 'Source:', highlight: 'DC01 — domain controller compromised', highlightColor: c.danger },
      { text: 'Targets:', highlight: '14 workstations in 90 seconds', highlightColor: c.danger },
      { text: 'Tool:', highlight: 'PsExec v2.43 — living off the land', highlightColor: c.warning },
      { text: 'Recommended:', highlight: 'Contain all 14 hosts + IR', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.9s', aiResultDetail: 'Hosts contained, DC01 isolated, KRBTGT reset queued', aiTime: '0.9s' },
  { icon: <File />, title: 'Sensitive File Access', desc: 'Bulk download from HR SharePoint', sev: 'medium', sevColor: c.warning, source: 'Microsoft 365', time: '30s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Potential Insider Threat', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Data from Cloud Storage · T1530', highlightColor: c.warning },
      { text: 'User:', highlight: 'r.thompson@corp — 2-week notice filed', highlightColor: c.danger },
      { text: 'Files:', highlight: '340 documents — Confidential/PII labels', highlightColor: c.danger },
      { text: 'Baseline:', highlight: 'Normal is 5-10 files/day', highlightColor: c.warning },
      { text: 'Recommended:', highlight: 'Alert manager + restrict access', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.8s', aiResultDetail: 'Manager notified, SharePoint access restricted', aiTime: '1.8s' },
  { icon: <Bug />, title: 'Zero-Day Exploit Attempt', desc: 'CVE-2024-3094 on edge proxy', sev: 'critical', sevColor: c.critical, source: 'Snort', time: 'just now',
    aiSteps: [
      { text: 'Classified as', highlight: 'Active Exploitation', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Exploit Public-Facing App · T1190', highlightColor: c.danger },
      { text: 'CVE:', highlight: 'CVE-2024-3094 — 0-day, CVSS 10.0', highlightColor: c.danger },
      { text: 'Target:', highlight: 'edge-proxy-01 — internet-facing', highlightColor: c.danger },
      { text: 'Payload analysis:', highlight: 'RCE attempt — reverse shell', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Emergency patch + WAF rule', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.3s', aiResultDetail: 'WAF rule deployed, patch pipeline triggered', aiTime: '0.3s' },
  { icon: <Key />, title: 'Credential Stuffing', desc: '12k login attempts across 800 accounts', sev: 'high', sevColor: c.danger, source: 'Cloudflare', time: '7s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Credential Stuffing Attack', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Credential Access · T1110.004', highlightColor: c.danger },
      { text: 'Scale:', highlight: '12,431 attempts across 800 accounts', highlightColor: c.danger },
      { text: 'Sources:', highlight: '89 unique IPs — botnet likely', highlightColor: c.warning },
      { text: 'Successful:', highlight: '3 accounts compromised', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Rate limit + reset 3 accounts', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.0s', aiResultDetail: 'Rate limiting applied, compromised accounts locked', aiTime: '1.0s' },
  { icon: <Eye />, title: 'Suspicious API Calls', desc: 'IAM enumeration from compromised key', sev: 'high', sevColor: c.danger, source: 'GuardDuty', time: '9s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Cloud Reconnaissance', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Account Discovery · T1087.004', highlightColor: c.danger },
      { text: 'API key:', highlight: 'AKIA…3F7Q — last rotated 180d ago', highlightColor: c.danger },
      { text: 'Actions:', highlight: 'ListUsers, GetPolicy, ListRoles', highlightColor: c.warning },
      { text: 'Region:', highlight: 'us-east-1 — unusual for this key', highlightColor: c.warning },
      { text: 'Recommended:', highlight: 'Rotate key immediately + audit', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.7s', aiResultDetail: 'Key deactivated, CloudTrail audit initiated', aiTime: '0.7s' },
  { icon: <Server />, title: 'Container Escape', desc: 'Breakout via CVE-2024-21626', sev: 'critical', sevColor: c.critical, source: 'Sysdig', time: '2s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Container Escape', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Escape to Host · T1611', highlightColor: c.danger },
      { text: 'CVE:', highlight: 'CVE-2024-21626 — runc vulnerability', highlightColor: c.danger },
      { text: 'Container:', highlight: 'api-worker-7f2d in production ns', highlightColor: c.danger },
      { text: 'Host access:', highlight: 'Root filesystem mounted', highlightColor: c.danger },
      { text: 'Recommended:', highlight: 'Kill pod + patch runc + scan node', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.5s', aiResultDetail: 'Pod terminated, node cordoned, runc patch applied', aiTime: '0.5s' },
  { icon: <Warn />, title: 'Phishing Link Clicked', desc: 'User opened credential harvesting page', sev: 'medium', sevColor: c.warning, source: 'Proofpoint', time: '25s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Credential Phishing', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Phishing · T1566.002', highlightColor: c.danger },
      { text: 'URL:', highlight: 'login-verify.evil.com — 3h old domain', highlightColor: c.danger },
      { text: 'User action:', highlight: 'Credentials were entered', highlightColor: c.danger },
      { text: 'Affected user:', highlight: 'm.jones@corp — standard access', highlightColor: c.heading },
      { text: 'Recommended:', highlight: 'Reset password + scan inbox', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 1.1s', aiResultDetail: 'Password reset forced, inbox scan triggered', aiTime: '1.1s' },
  { icon: <Lock />, title: 'Account Takeover', desc: 'Password changed after suspicious login', sev: 'high', sevColor: c.danger, source: 'Azure AD', time: '11s ago',
    aiSteps: [
      { text: 'Classified as', highlight: 'Account Takeover', highlightColor: c.heading },
      { text: 'MITRE ATT&CK:', highlight: 'Account Manipulation · T1098', highlightColor: c.danger },
      { text: 'Login source:', highlight: '91.234.x.x — Russia, first seen', highlightColor: c.danger },
      { text: 'Action taken:', highlight: 'Password changed within 2 min of login', highlightColor: c.danger },
      { text: 'User:', highlight: 'j.martinez@corp — finance team', highlightColor: c.heading },
      { text: 'Recommended:', highlight: 'Lock account + initiate IR', highlightColor: c.success },
    ], aiResult: 'Auto-triaged in 0.8s', aiResultDetail: 'Account locked, password reverted, IR ticket opened', aiTime: '0.8s' },
]

const CYCLE_MS = 5000  // longer cycle to let AI steps play out
const SHIFT_MS = 500
const ENRICH_LOADING_DELAY = 300  // show spinner after card lands
const STEP_INTERVAL = 280         // time between each AI step appearing
const RESULT_DELAY = 400          // delay after last step before showing result

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

// Enrichment states: hidden → loading (steps reveal one by one) → result
type EnrichState = 'hidden' | 'loading' | 'result'

// Inject spinner keyframes into DOM once
const styleId = 'alert-card-styles'
function ensureStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById(styleId)) return
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    @keyframes alert-card-spin { to { transform: rotate(360deg); } }
    @keyframes alert-card-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  `
  document.head.appendChild(style)
}

export function AlertDisplayCards() {
  const [stack, setStack] = useState([0, 1, 2])
  const stackRef = useRef([0, 1, 2])
  const nextRef = useRef(3)
  const [shifting, setShifting] = useState(false)
  const [enterIdx, setEnterIdx] = useState<number | null>(null)
  const [enterLanded, setEnterLanded] = useState(false)
  const [enrichState, setEnrichState] = useState<EnrichState>('result')
  const [visibleSteps, setVisibleSteps] = useState(6)
  const [showResult, setShowResult] = useState(true)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => ensureStyles(), [])
  useEffect(() => { pausedRef.current = paused }, [paused])

  const clearTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
  }

  const addTimer = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }

  const runTriageAnimation = (alertIdx: number) => {
    setEnrichState('loading')
    setVisibleSteps(0)
    setShowResult(false)

    const stepCount = allAlerts[alertIdx].aiSteps.length
    for (let i = 0; i < stepCount; i++) {
      addTimer(() => setVisibleSteps(i + 1), STEP_INTERVAL * (i + 1))
    }
    addTimer(() => {
      setEnrichState('result')
      setShowResult(true)
    }, STEP_INTERVAL * stepCount + RESULT_DELAY)
  }

  const doCycle = () => {
    if (pausedRef.current) return

    clearTimers()
    const newIdx = nextRef.current % allAlerts.length
    nextRef.current += 1

    // Step 1: Collapse current triage
    setEnrichState('hidden')
    setVisibleSteps(0)
    setShowResult(false)

    // Step 2: After collapse, shift cards
    addTimer(() => {
      setShifting(true)
      setEnterIdx(newIdx)
      setEnterLanded(false)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnterLanded(true))
      })

      // Step 3: After slide, finalize stack + start triage on new front card
      addTimer(() => {
        const newStack = [stackRef.current[1], stackRef.current[2], newIdx]
        stackRef.current = newStack
        setStack(newStack)
        setEnterIdx(null)
        setEnterLanded(false)
        setShifting(false)

        // Start AI triage animation
        addTimer(() => runTriageAnimation(newIdx), ENRICH_LOADING_DELAY)
      }, SHIFT_MS)
    }, 350)
  }

  // Main cycle interval — no dependency on stack
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      return
    }
    intervalRef.current = setInterval(doCycle, CYCLE_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      clearTimers()
    }
  }, [paused])

  // On mount: animate the initial triage
  useEffect(() => {
    setEnrichState('hidden')
    setVisibleSteps(0)
    setShowResult(false)
    addTimer(() => runTriageAnimation(0), 600)
    return () => clearTimers()
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
              visibleSteps={isFront ? visibleSteps : 0}
              showResult={isFront ? showResult : false}
            />
          </div>
        )
      })}

      {enterIdx !== null && (
        <div style={enterLanded ? { ...posStyles[2], transition: t } : { ...enterStart, transition: 'none' }}>
          <CardView card={allAlerts[enterIdx]} front={true} enrichState="hidden" visibleSteps={0} showResult={false} />
        </div>
      )}
    </div>
  )
}

function CardView({ card, front, enrichState, visibleSteps, showResult }: {
  card: CardData; front: boolean; enrichState: EnrichState; visibleSteps: number; showResult: boolean
}) {
  const showBox = enrichState === 'loading' || enrichState === 'result'

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

      {/* AI Triage area — uses grid for smooth height animation */}
      <div style={{
        display: 'grid',
        gridTemplateRows: showBox ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            border: `1px solid ${c.border}`, borderRadius: '0.375rem',
            backgroundColor: c.bg + '80', padding: '0.625rem 0.75rem',
            marginTop: '0.625rem',
            opacity: showBox ? 1 : 0,
            transition: 'opacity 0.4s ease 0.1s',
          }}>
            {/* Triage header */}
            <div style={{
              fontSize: '0.6rem', fontWeight: 500, marginBottom: '0.375rem',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              color: enrichState === 'result' ? c.heading : c.muted,
              transition: 'color 0.3s ease',
            }}>
              {enrichState === 'result' ? <CheckIcon /> : <Spinner />}
              {enrichState === 'result' ? 'AI Triage Complete' : 'AI analyzing alert…'}
            </div>

            {/* AI analysis steps — appear one by one with smooth height */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {card.aiSteps.map((step, j) => {
                const visible = j < visibleSteps
                return (
                  <div key={j} style={{
                    display: 'grid',
                    gridTemplateRows: visible ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.35rem',
                        fontSize: '0.6rem',
                        paddingTop: '0.15rem',
                        paddingBottom: '0.15rem',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(4px)',
                        transition: 'opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s',
                      }}>
                        <div style={{
                          width: 5, height: 5, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                          backgroundColor: c.success,
                        }} />
                        <span style={{ color: c.text }}>
                          {step.text}{' '}
                          <strong style={{ color: step.highlightColor || c.heading }}>{step.highlight}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Result banner — smooth height reveal */}
            <div style={{
              display: 'grid',
              gridTemplateRows: showResult ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  backgroundColor: c.success + '12',
                  border: `1px solid ${c.success}33`,
                  borderRadius: '0.25rem',
                  padding: '0.375rem 0.5rem',
                  marginTop: '0.5rem',
                  opacity: showResult ? 1 : 0,
                  transform: showResult ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 600, color: c.heading }}>{card.aiResult}</div>
                    <div style={{ fontSize: '0.55rem', color: c.muted }}>{card.aiResultDetail}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        {showResult && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.6rem', color: c.success, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            animation: 'alert-card-fade-in 0.3s ease',
          }}>
            <CheckIcon /> {card.aiTime}
          </span>
        )}
        {enrichState === 'loading' && !showResult && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.6rem', color: c.muted, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}>
            <Spinner /> Triaging…
          </span>
        )}
      </div>
    </div>
  )
}
