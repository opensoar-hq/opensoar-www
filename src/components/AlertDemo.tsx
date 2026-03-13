import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";

type Severity = "critical" | "high" | "medium" | "low";
type Status = "new" | "in_progress" | "resolved";

interface Alert {
  id: string;
  timestamp: string;
  severity: Severity;
  title: string;
  source: string;
  source_ip: string;
  status: Status;
  rule_name: string;
  description: string;
  iocs: string[];
}

const SAMPLE_ALERTS: Alert[] = [
  {
    id: "1",
    timestamp: "2025-03-13T14:32:45Z",
    severity: "critical",
    title: "Brute Force SSH Login Detected",
    source: "crowdstrike",
    source_ip: "203.0.113.42",
    status: "new",
    rule_name: "ssh_brute_force",
    description: "Multiple failed SSH login attempts detected from external IP. 847 attempts in 5 minutes targeting root account on prod-db-01.",
    iocs: ["203.0.113.42", "prod-db-01", "root"],
  },
  {
    id: "2",
    timestamp: "2025-03-13T14:31:12Z",
    severity: "high",
    title: "Malware Hash Matched — Cobalt Strike Beacon",
    source: "sentinelone",
    source_ip: "10.0.12.88",
    status: "in_progress",
    rule_name: "malware_hash_match",
    description: "Known Cobalt Strike beacon payload detected on endpoint WKSTN-0421. SHA256 matches TI feed entry from 2025-03-10.",
    iocs: ["10.0.12.88", "WKSTN-0421", "a1b2c3d4e5f6..."],
  },
  {
    id: "3",
    timestamp: "2025-03-13T14:28:33Z",
    severity: "high",
    title: "DNS Exfiltration — Unusually Long Queries",
    source: "elastic",
    source_ip: "10.0.8.15",
    status: "new",
    rule_name: "dns_exfil_long_query",
    description: "Host sending DNS queries with encoded data in subdomain labels. Average query length 187 chars, destination: suspicious-ns.example.com.",
    iocs: ["10.0.8.15", "suspicious-ns.example.com"],
  },
  {
    id: "4",
    timestamp: "2025-03-13T14:25:01Z",
    severity: "medium",
    title: "Impossible Travel — Login from Two Countries",
    source: "azure-ad",
    source_ip: "185.220.101.6",
    status: "new",
    rule_name: "impossible_travel",
    description: "User jsmith@corp.com authenticated from New York (10:15 UTC) then São Paulo (10:22 UTC). Travel distance implies impossible physical movement.",
    iocs: ["185.220.101.6", "jsmith@corp.com"],
  },
  {
    id: "5",
    timestamp: "2025-03-13T14:22:18Z",
    severity: "critical",
    title: "Privilege Escalation — New Domain Admin",
    source: "windows-ad",
    source_ip: "10.0.1.50",
    status: "in_progress",
    rule_name: "priv_escalation_domain_admin",
    description: "Account svc-backup was added to Domain Admins group by non-privileged user. Potential compromised service account.",
    iocs: ["10.0.1.50", "svc-backup", "Domain Admins"],
  },
  {
    id: "6",
    timestamp: "2025-03-13T14:18:44Z",
    severity: "low",
    title: "AWS GuardDuty — Recon:EC2/PortProbeUnprotectedPort",
    source: "aws-guardduty",
    source_ip: "198.51.100.23",
    status: "resolved",
    rule_name: "guardduty_port_probe",
    description: "External IP probing unprotected port 22 on EC2 instance i-0abc123. Low confidence, likely automated scanner.",
    iocs: ["198.51.100.23", "i-0abc123"],
  },
];

const severityColors: Record<Severity, string> = {
  critical: "bg-[#da3633]/15 text-[#f85149] border-[#da3633]/30",
  high: "bg-[#f85149]/10 text-[#f85149] border-[#f85149]/20",
  medium: "bg-[#d29922]/10 text-[#d29922] border-[#d29922]/20",
  low: "bg-[#58a6ff]/10 text-[#58a6ff] border-[#58a6ff]/20",
};

const statusColors: Record<Status, string> = {
  new: "bg-[#58a6ff]/10 text-[#58a6ff]",
  in_progress: "bg-[#d29922]/10 text-[#d29922]",
  resolved: "bg-[#3fb950]/10 text-[#3fb950]",
};

const statusLabels: Record<Status, string> = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

function timeAgo(ts: string): string {
  const now = new Date("2025-03-13T14:35:00Z");
  const then = new Date(ts);
  const diffMin = Math.round((now.getTime() - then.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.round(diffMin / 60)}h ago`;
}

function AlertRow({
  alert,
  expanded,
  onToggle,
}: {
  alert: Alert;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <button
        onClick={onToggle}
        type="button"
        className="w-full px-4 py-3 text-left transition-colors hover:bg-[#1c2129] border-none bg-transparent cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-[#6e7681]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>

          <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide border ${severityColors[alert.severity]}`}>
            {alert.severity}
          </span>

          <span className="flex-1 text-[13px] text-[#e6edf3] truncate font-medium">
            {alert.title}
          </span>

          <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[11px] font-medium ${statusColors[alert.status]}`}>
            {statusLabels[alert.status]}
          </span>

          <span className="flex-shrink-0 text-[11px] text-[#6e7681] font-mono w-28 text-right hidden sm:block">
            {alert.source}
          </span>

          <span className="flex-shrink-0 text-[11px] text-[#6e7681] font-mono w-16 text-right hidden md:block">
            {timeAgo(alert.timestamp)}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[#30363d] bg-[#0d1117]/60"
          >
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7681] mb-1.5">Description</p>
                <p className="text-[12px] text-[#8b949e] leading-relaxed font-mono bg-[#161b22] rounded p-2.5 border border-[#30363d]">
                  {alert.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[12px]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7681] mb-1">Source IP</p>
                  <p className="font-mono text-[#e6edf3]">{alert.source_ip}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7681] mb-1">Rule</p>
                  <p className="font-mono text-[#e6edf3]">{alert.rule_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7681] mb-1">Timestamp</p>
                  <p className="font-mono text-[#8b949e] text-[11px]">{alert.timestamp}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7681] mb-1.5">IOCs</p>
                <div className="flex flex-wrap gap-1.5">
                  {alert.iocs.map((ioc) => (
                    <span key={ioc} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                      {ioc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function AlertDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("1");
  const [severityFilter, setSeverityFilter] = useState<Severity | "">("");

  const filteredAlerts = useMemo(() => {
    return SAMPLE_ALERTS.filter((alert) => {
      const matchSearch = !searchQuery ||
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.source_ip.includes(searchQuery);
      const matchSeverity = !severityFilter || alert.severity === severityFilter;
      return matchSearch && matchSeverity;
    });
  }, [searchQuery, severityFilter]);

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#30363d]">
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#d29922]/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950]/50" />
        </div>
        <span className="text-[11px] text-[#6e7681] font-mono mr-auto">opensoar — alerts</span>

        {/* Search */}
        <div className="relative hidden sm:block">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6e7681] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-44 h-7 pl-8 pr-3 text-[12px] rounded border border-[#30363d] bg-[#0d1117] text-[#e6edf3] placeholder:text-[#6e7681] focus:outline-none focus:border-[#58a6ff] transition-colors"
          />
        </div>

        {/* Severity filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as Severity | "")}
          className="h-7 px-2 text-[12px] rounded border border-[#30363d] bg-[#0d1117] text-[#8b949e] focus:outline-none focus:border-[#58a6ff] cursor-pointer"
        >
          <option value="">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Alert rows */}
      <div className="divide-y divide-[#30363d] max-h-[420px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
              >
                <AlertRow
                  alert={alert}
                  expanded={expandedId === alert.id}
                  onToggle={() =>
                    setExpandedId((c) => (c === alert.id ? null : alert.id))
                  }
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-[#6e7681] text-sm"
            >
              No alerts match your search.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#30363d] text-[11px] text-[#6e7681]">
        <span>{filteredAlerts.length} of {SAMPLE_ALERTS.length} alerts</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
          Live
        </span>
      </div>
    </div>
  );
}
