import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe,
  LayoutGrid,
  Play,
  Search,
  Shield,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

type Severity = "critical" | "high" | "medium" | "low";
type AlertStatus = "new" | "in_progress" | "resolved";
type IncidentStatus = "open" | "investigating" | "contained";
type PanelTab = "timeline" | "incident" | "observables";

interface AlertRecord {
  id: string;
  title: string;
  source: string;
  sourceIp: string;
  host: string;
  severity: Severity;
  status: AlertStatus;
  time: string;
  analyst: string | null;
  incidentId: string;
  summary: string;
  tags: string[];
  iocs: string[];
}

interface IncidentRecord {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  owner: string;
  alerts: number;
  summary: string;
  observables: Array<{ type: string; value: string; status: string }>;
  timeline: Array<{ time: string; label: string; detail: string; tone: "neutral" | "success" | "warning" }>;
}

const alerts: AlertRecord[] = [
  {
    id: "AL-1042",
    title: "Brute force into production SSH bastion",
    source: "CrowdStrike",
    sourceIp: "203.0.113.42",
    host: "prod-bastion-01",
    severity: "critical",
    status: "new",
    time: "2m ago",
    analyst: null,
    incidentId: "IN-204",
    summary: "847 failed SSH attempts against root in 5 minutes from a single external IP.",
    tags: ["ssh", "auth", "linux"],
    iocs: ["203.0.113.42", "prod-bastion-01", "root"],
  },
  {
    id: "AL-1041",
    title: "Impossible travel for privileged account",
    source: "Azure AD",
    sourceIp: "185.220.101.6",
    host: "identity",
    severity: "high",
    status: "in_progress",
    time: "5m ago",
    analyst: "Mia",
    incidentId: "IN-204",
    summary: "Admin account authenticated from New York and Sao Paulo within 7 minutes.",
    tags: ["identity", "mfa", "travel"],
    iocs: ["admin@company.com", "185.220.101.6"],
  },
  {
    id: "AL-1039",
    title: "Suspicious DNS beaconing pattern",
    source: "Elastic",
    sourceIp: "10.0.8.15",
    host: "wkstn-0421",
    severity: "high",
    status: "in_progress",
    time: "9m ago",
    analyst: "Mia",
    incidentId: "IN-205",
    summary: "Encoded subdomain labels suggest exfiltration over DNS to a newly observed domain.",
    tags: ["dns", "endpoint"],
    iocs: ["suspicious-ns.example.com", "10.0.8.15"],
  },
  {
    id: "AL-1034",
    title: "GuardDuty scanner noise",
    source: "AWS GuardDuty",
    sourceIp: "198.51.100.23",
    host: "i-0abc123",
    severity: "low",
    status: "resolved",
    time: "21m ago",
    analyst: "Noah",
    incidentId: "IN-203",
    summary: "Internet-wide scanner hit an unprotected port; triage resolved as benign.",
    tags: ["cloud", "noise"],
    iocs: ["198.51.100.23", "i-0abc123"],
  },
];

const incidents: Record<string, IncidentRecord> = {
  "IN-204": {
    id: "IN-204",
    title: "Potential credential access chain",
    severity: "critical",
    status: "investigating",
    owner: "Mia",
    alerts: 2,
    summary:
      "Multiple auth signals point to credential abuse against privileged infrastructure. Analyst is validating source reputation and access scope.",
    observables: [
      { type: "ip", value: "203.0.113.42", status: "malicious" },
      { type: "user", value: "admin@company.com", status: "watch" },
      { type: "host", value: "prod-bastion-01", status: "isolated" },
    ],
    timeline: [
      { time: "now", label: "Containment queued", detail: "Blocklist push staged for the source IP and bastion access logs are being preserved.", tone: "warning" },
      { time: "3m", label: "Incident linked", detail: "Impossible-travel alert merged into the same case based on shared account context.", tone: "neutral" },
      { time: "7m", label: "Claimed by Mia", detail: "Ownership moved to the on-call analyst with local admin approval pending.", tone: "success" },
    ],
  },
  "IN-205": {
    id: "IN-205",
    title: "Possible DNS exfiltration",
    severity: "high",
    status: "open",
    owner: "Queue",
    alerts: 1,
    summary:
      "Single workstation beaconing to an unusual domain. Waiting on enrichment before escalation.",
    observables: [
      { type: "domain", value: "suspicious-ns.example.com", status: "unknown" },
      { type: "ip", value: "10.0.8.15", status: "watch" },
    ],
    timeline: [
      { time: "1m", label: "Alert enriched", detail: "Passive DNS lookup queued and endpoint owner resolved from CMDB.", tone: "neutral" },
      { time: "9m", label: "Alert ingested", detail: "Elastic webhook normalized and routed into the active queue.", tone: "success" },
    ],
  },
  "IN-203": {
    id: "IN-203",
    title: "Internet scanner noise",
    severity: "low",
    status: "contained",
    owner: "Noah",
    alerts: 1,
    summary:
      "Benign cloud perimeter scan resolved after source reputation and host exposure review.",
    observables: [
      { type: "ip", value: "198.51.100.23", status: "benign" },
    ],
    timeline: [
      { time: "4m", label: "Resolved", detail: "Marked benign after confirming known scanner behavior.", tone: "success" },
    ],
  },
};

const severityClasses: Record<Severity, string> = {
  critical: "border-[#f85149]/30 bg-[#f85149]/12 text-[#ffb4b4]",
  high: "border-[#ff7b72]/25 bg-[#ff7b72]/10 text-[#ff7b72]",
  medium: "border-[#d29922]/25 bg-[#d29922]/10 text-[#f2cc60]",
  low: "border-[#6e7681]/25 bg-[#6e7681]/10 text-[#9da7b3]",
};

const alertStatusClasses: Record<AlertStatus, string> = {
  new: "bg-[#6e7681]/12 text-[#9da7b3]",
  in_progress: "bg-[#d29922]/10 text-[#f2cc60]",
  resolved: "bg-[#3fb950]/10 text-[#73d48d]",
};

const incidentStatusClasses: Record<IncidentStatus, string> = {
  open: "bg-[#6e7681]/12 text-[#9da7b3]",
  investigating: "bg-[#f85149]/10 text-[#ff938d]",
  contained: "bg-[#3fb950]/10 text-[#73d48d]",
};

const navItems = [
  { id: "queue", label: "Alerts", icon: AlertTriangle },
  { id: "cases", label: "Incidents", icon: Briefcase },
  { id: "runs", label: "Runs", icon: Play },
  { id: "actions", label: "Actions", icon: Activity },
];

function Pill({ children, className }: { children: string; className: string }) {
  return (
    <span className={`inline-flex items-center rounded text-[10px] font-medium uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

export function AlertDemo() {
  const [selectedAlertId, setSelectedAlertId] = useState("AL-1042");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<PanelTab>("timeline");
  const [nav, setNav] = useState("queue");

  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) ?? alerts[0];
  const selectedIncident = incidents[selectedAlert.incidentId];

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const haystack = `${alert.title} ${alert.source} ${alert.sourceIp} ${alert.host}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <div className="overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-[#30363d] bg-[#161b22] px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="flex w-full max-w-3xl items-center gap-2 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[11px] text-[#6e7681]">
              <Shield className="h-3.5 w-3.5 shrink-0 text-[#8b949e]" />
              <span className="truncate font-mono">https://demo.opensoar.app/incidents/IN-204</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-[#30363d] bg-[#161b22] lg:border-b-0 lg:border-r">
          <div className="px-4 py-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d1117] text-[#e6edf3] border border-[#30363d]">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#6e7681]">Workspace</div>
                <div className="text-sm font-semibold text-[#e6edf3]">Northwind SOC</div>
              </div>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = nav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNav(item.id)}
                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                      active
                        ? "bg-[#0d1117] text-[#e6edf3] border border-[#30363d]"
                        : "text-[#8b949e] hover:bg-[#1c2129] hover:text-[#e6edf3] border border-transparent"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.id === "queue" && <span className="text-[11px] text-[#ff7b72]">24</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6e7681]">Shift Snapshot</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-md bg-[#161b22] p-2">
                  <div className="text-[#6e7681]">Open alerts</div>
                  <div className="mt-1 text-lg font-semibold text-[#e6edf3]">24</div>
                </div>
                <div className="rounded-md bg-[#161b22] p-2">
                  <div className="text-[#6e7681]">Active cases</div>
                  <div className="mt-1 text-lg font-semibold text-[#e6edf3]">7</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="bg-[#0d1117]">
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.94fr)]">
            <section className="border-b border-[#30363d] xl:border-b-0 xl:border-r">
              <div className="border-b border-[#30363d] px-5 py-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#6e7681]">Alerts</div>
                    <div className="mt-1 text-lg font-semibold text-[#e6edf3]">Triage queue</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#161b22] px-3 py-2 text-[12px] text-[#8b949e]">
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search alerts, hosts, IPs"
                      className="w-44 bg-transparent text-[#e6edf3] outline-none placeholder:text-[#6e7681]"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#6e7681]">Critical queue</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-2xl font-semibold text-[#ff7b72]">3</div>
                      <div className="text-[11px] text-[#8b949e]">2 unassigned</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#6e7681]">Automation runs</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-2xl font-semibold text-[#e6edf3]">11</div>
                      <div className="text-[11px] text-[#73d48d]">8 completed</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#6e7681]">Mean triage</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-2xl font-semibold text-[#e6edf3]">6m</div>
                      <div className="text-[11px] text-[#8b949e]">today</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#202834]">
                {filteredAlerts.map((alert, index) => {
                  const active = alert.id === selectedAlertId;
                  return (
                    <motion.button
                      key={alert.id}
                      type="button"
                      onClick={() => setSelectedAlertId(alert.id)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className={`w-full px-5 py-4 text-left transition-colors ${
                        active ? "bg-[#111821]" : "hover:bg-[#10161f]"
                      }`}
                    >
                      <div className="mb-2 flex items-start gap-3">
                      <Pill className={severityClasses[alert.severity]}>{alert.severity}</Pill>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-semibold text-[#e6edf3]">{alert.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8b949e]">
                          <span>{alert.source}</span>
                            <span className="font-mono">{alert.sourceIp}</span>
                            <span>{alert.host}</span>
                          </div>
                        </div>
                        <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 transition-transform ${active ? "translate-x-1 text-[#e6edf3]" : "text-[#6e7681]"}`} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${alertStatusClasses[alert.status]}`}>
                          {alert.status.replace("_", " ")}
                        </span>
                        {alert.analyst ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#73d48d]">
                            <UserRound className="h-3 w-3" />
                            {alert.analyst}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#ffb86c]">Unassigned</span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#6e7681]">
                          <Clock3 className="h-3 w-3" />
                          {alert.time}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <section className="bg-[#161b22]">
              <div className="border-b border-[#30363d] px-5 py-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#6e7681]">Alert</div>
                    <div className="mt-1 text-lg font-semibold text-[#e6edf3]">{selectedAlert.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${alertStatusClasses[selectedAlert.status]}`}>
                      {selectedAlert.status.replace("_", " ")}
                    </span>
                    <Pill className={severityClasses[selectedAlert.severity]}>{selectedAlert.severity}</Pill>
                  </div>
                </div>

                <div className="mb-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[#6e7681]">Analyst summary</div>
                  <p className="text-[13px] leading-relaxed text-[#8b949e]">{selectedAlert.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedAlert.tags.map((tag) => (
                      <span key={tag} className="rounded border border-[#30363d] bg-[#161b22] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#9da7b3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {([
                    { id: "timeline", label: "Timeline" },
                    { id: "incident", label: "Incident" },
                    { id: "observables", label: "Observables" },
                  ] as Array<{ id: PanelTab; label: string }>).map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setTab(entry.id)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                        tab === entry.id
                          ? "bg-[#e6edf3] text-[#0d1117]"
                          : "bg-[#0d1117] text-[#8b949e] hover:text-[#e6edf3]"
                      }`}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {tab === "timeline" && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4 px-5 py-5"
                  >
                    {selectedIncident.timeline.map((entry) => (
                      <div key={`${selectedIncident.id}-${entry.time}-${entry.label}`} className="flex gap-3">
                        <div className="mt-1">
                          <span
                            className={`block h-2.5 w-2.5 rounded-full ${
                              entry.tone === "success"
                                ? "bg-[#3fb950]"
                                : entry.tone === "warning"
                                  ? "bg-[#ff7b72]"
                                  : "bg-[#6e7681]"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3">
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <div className="text-[12px] font-semibold text-[#e6edf3]">{entry.label}</div>
                            <div className="text-[10px] uppercase tracking-[0.14em] text-[#6e7681]">{entry.time}</div>
                          </div>
                          <div className="text-[12px] leading-relaxed text-[#8b949e]">{entry.detail}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {tab === "incident" && (
                  <motion.div
                    key="incident"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4 px-5 py-5"
                  >
                    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em] text-[#6e7681]">Incident</div>
                          <div className="mt-1 text-[16px] font-semibold text-[#e6edf3]">{selectedIncident.title}</div>
                        </div>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${incidentStatusClasses[selectedIncident.status]}`}>
                          {selectedIncident.status}
                        </span>
                      </div>
                      <p className="text-[12px] leading-relaxed text-[#8b949e]">{selectedIncident.summary}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-[#6e7681]">Owner</div>
                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#e6edf3]">
                          <UserRound className="h-4 w-4 text-[#73d48d]" />
                          {selectedIncident.owner}
                        </div>
                      </div>
                      <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-[#6e7681]">Linked alerts</div>
                        <div className="mt-2 text-2xl font-semibold text-[#e6edf3]">{selectedIncident.alerts}</div>
                      </div>
                      <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
                        <div className="text-[10px] uppercase tracking-[0.14em] text-[#6e7681]">State</div>
                        <div className="mt-2 inline-flex items-center gap-2 text-[12px] text-[#ffb86c]">
                          <AlertTriangle className="h-4 w-4" />
                          Analyst review
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === "observables" && (
                  <motion.div
                    key="observables"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3 px-5 py-5"
                  >
                    {selectedIncident.observables.map((observable) => (
                      <div key={`${selectedIncident.id}-${observable.type}-${observable.value}`} className="flex items-start justify-between gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3">
                        <div className="min-w-0">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded border border-[#30363d] bg-[#161b22] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#9da7b3]">
                              {observable.type}
                            </span>
                            <span className="text-[12px] font-mono text-[#e6edf3] break-all">{observable.value}</span>
                          </div>
                          <div className="text-[11px] text-[#6e7681]">Attached to case {selectedIncident.id}</div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                            observable.status === "malicious"
                              ? "bg-[#f85149]/10 text-[#ff938d]"
                              : observable.status === "isolated"
                                ? "bg-[#3fb950]/10 text-[#73d48d]"
                                : "bg-[#d29922]/10 text-[#f2cc60]"
                          }`}
                        >
                          {observable.status}
                        </span>
                      </div>
                    ))}
                    <div className="rounded-lg border border-dashed border-[#30363d] px-4 py-3 text-[11px] text-[#6e7681]">
                      Analysts can add new observables, enrich them, and keep the whole case narrative in one place.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </div>

      <div className="border-t border-[#30363d] bg-[#161b22] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#6e7681]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5" />
              Alerts, incidents, and context in one view
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Search, assignment, incidents, observables, timeline
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[#73d48d]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Demo workspace
          </div>
        </div>
      </div>
    </div>
  );
}
