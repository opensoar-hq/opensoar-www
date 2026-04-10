import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Clock,
  Copy,
  FileJson,
  Globe,
  LayoutGrid,
  Link2,
  Play,
  Search,
  Settings2,
  Shield,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

type Severity = "critical" | "high" | "medium" | "low";
type AlertStatus = "new" | "in_progress" | "resolved";
type Determination = "unknown" | "malicious" | "suspicious" | "benign";

const alert = {
  id: "AL-1042",
  title: "Brute force into production SSH bastion",
  description:
    "847 failed SSH attempts against root in 5 minutes from a single external IP. Analyst is validating source reputation and preserving host access logs.",
  severity: "critical" as Severity,
  status: "in_progress" as AlertStatus,
  determination: "suspicious" as Determination,
  partner: "northwind",
  assignedUsername: "Mia",
  duplicateCount: 3,
  createdAt: "2m ago",
  source: "CrowdStrike",
  rule: "ssh_brute_force",
  sourceIp: "203.0.113.42",
  destIp: "10.0.1.11",
  hostname: "prod-bastion-01",
  sourceId: "cs-evt-88421",
  tags: ["ssh", "auth", "linux"],
  iocs: ["203.0.113.42", "prod-bastion-01", "root", "admin@company.com"],
};

const incidents = [
  {
    id: "IN-204",
    title: "Potential credential access chain",
    status: "investigating",
    alertCount: 2,
    assignedUsername: "Mia",
  },
];

const playbooks = [
  { name: "Contain SSH brute force", description: "Block IP and preserve auth logs" },
  { name: "Enrich source IP", description: "Threat intel and ASN context" },
  { name: "Escalate privileged auth", description: "Open case and notify on-call" },
];

const timeline = [
  {
    label: "Mia",
    time: "now",
    detail: "Need malware triage before handoff. Preserving auth and process history first.",
    comment: true,
  },
  {
    label: "Incident Linked",
    time: "2m ago",
    detail: "Created and linked incident Potential credential access chain.",
    comment: false,
  },
  {
    label: "Claimed",
    time: "4m ago",
    detail: "Assigned to Mia.",
    comment: false,
  },
  {
    label: "Determination Set",
    time: "5m ago",
    detail: "Determination set to suspicious.",
    comment: false,
  },
];

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "incidents", label: "Incidents", icon: Briefcase },
  { id: "runs", label: "Runs", icon: Play },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings2 },
];

const severityClasses: Record<Severity, string> = {
  critical: "bg-[#da3633]/15 text-[#f85149]",
  high: "bg-[#f85149]/10 text-[#f85149]",
  medium: "bg-[#d29922]/10 text-[#d29922]",
  low: "bg-[#848d97]/10 text-[#848d97]",
};

const statusClasses: Record<AlertStatus, string> = {
  new: "bg-[#848d97]/10 text-[#848d97]",
  in_progress: "bg-[#d29922]/10 text-[#d29922]",
  resolved: "bg-[#3fb950]/10 text-[#3fb950]",
};

const determinationClasses: Record<Determination, string> = {
  unknown: "bg-[#6e7681]/10 text-[#6e7681]",
  malicious: "bg-[#f85149]/10 text-[#f85149]",
  suspicious: "bg-[#d29922]/10 text-[#d29922]",
  benign: "bg-[#3fb950]/10 text-[#3fb950]",
};

const shellTransition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const };

function Badge({ children, className }: { children: string; className: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}

function Card({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#30363d] rounded-lg bg-[#161b22]">
      <div className="px-4 sm:px-5 py-4 border-b border-[#30363d] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-medium text-[#e6edf3] m-0">{title}</h3>
        {right}
      </div>
      <div className="px-4 sm:px-5 py-4">{children}</div>
    </div>
  );
}

function ReadonlyField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] text-[#6e7681] uppercase tracking-wide mb-0.5">{label}</div>
      <div className={`text-sm text-[#e6edf3] ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function SidebarField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-[#6e7681] uppercase tracking-wide">{label}</span>
      <span className={`text-xs text-[#e6edf3] ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export function AlertDemo() {
  const [activeNav, setActiveNav] = useState("alerts");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={shellTransition}
      className="max-h-[min(76vh,860px)] overflow-hidden rounded-t-lg rounded-b-none border border-[#30363d] border-b-0 bg-[#0d1117] shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-[#30363d] bg-[#161b22] px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="flex w-full max-w-3xl items-center gap-2 rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[11px] text-[#6e7681]">
              <Shield className="h-3.5 w-3.5 shrink-0 text-[#8b949e]" />
              <span className="truncate font-mono">https://demo.opensoar.app/alerts/AL-1042</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.16, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="h-full px-3 py-4 hidden md:flex md:flex-col bg-[#161b22] border-r border-[#30363d] flex-shrink-0"
        >
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#30363d] bg-[#0d1117] text-[#e6edf3]">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#6e7681]">Workspace</div>
              <div className="text-sm font-semibold text-[#e6edf3]">Northwind SOC</div>
            </div>
          </div>

          <div className="space-y-1">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.04, duration: 0.32 }}
                  className={`relative flex items-center gap-3 py-2 px-2 rounded-md w-full text-left no-underline transition-colors ${
                    active
                      ? "text-[#e6edf3] bg-[#e6edf3]/10 font-medium"
                      : "text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#1c2129]"
                  }`}
                >
                  {active && <div className="absolute left-0 w-[3px] h-5 rounded-r-full bg-[#e6edf3]" />}
                  <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${active ? "text-[#e6edf3]" : ""}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm whitespace-pre flex-1">{item.label}</span>
                  {item.id === "alerts" && <span className="text-[11px] text-[#f85149]">24</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="origin-top scale-[0.86] sm:scale-[0.92] px-3 sm:px-5 py-3 sm:py-5"
        >
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.32 }}
                className="mb-5 flex flex-col gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#6e7681]">
                    <AlertTriangle size={18} />
                  </span>
                  <h1 className="text-base font-semibold text-[#e6edf3] m-0">Alerts</h1>
                  <span className="text-xs text-[#6e7681]">(24)</span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex w-full items-center gap-2 rounded-md border border-[#30363d] bg-[#161b22] px-3 py-2 text-[12px] text-[#8b949e] sm:max-w-[240px]">
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    <span>Search alerts...</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" className="px-2.5 py-1.5 text-xs rounded-md border border-[#30363d] bg-[#161b22] text-[#8b949e]">
                      Critical
                    </button>
                    <button type="button" className="px-2.5 py-1.5 text-xs rounded-md border border-[#30363d] bg-[#161b22] text-[#8b949e]">
                      In Progress
                    </button>
                    <button type="button" className="inline-flex items-center justify-center rounded-md border font-medium px-2.5 py-1 text-xs gap-1 bg-[#e6edf3]/15 border-[#e6edf3]/30 text-[#e6edf3]">
                      Create
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.32 }}
                className="inline-flex items-center gap-1 text-xs text-[#6e7681] no-underline mb-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Alerts
              </motion.div>

              {[
                <Card key="header" title="">
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <h2 className="text-base font-semibold text-[#e6edf3] m-0 flex-1 min-w-0 leading-snug">
                      {alert.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button type="button" className="inline-flex items-center justify-center rounded-md border font-medium px-2.5 py-1 text-xs gap-1 bg-[#e6edf3]/15 border-[#e6edf3]/30 text-[#e6edf3]">
                        <UserCheck className="h-3.5 w-3.5" />
                        Claim
                      </button>
                      <button type="button" className="inline-flex items-center justify-center rounded-md border font-medium px-2.5 py-1 text-xs gap-1 bg-transparent border-transparent text-[#8b949e] hover:bg-[#1c2129] hover:text-[#e6edf3]">
                        Resolve
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-[#8b949e] m-0 mb-3">{alert.description}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={severityClasses[alert.severity]}>{alert.severity}</Badge>
                    <Badge className={statusClasses[alert.status]}>{alert.status.replace("_", " ")}</Badge>
                    <Badge className={determinationClasses[alert.determination]}>{alert.determination}</Badge>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#1c2129] text-[#e6edf3]">
                      {alert.partner}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#e6edf3]">
                      <UserCheck className="h-3 w-3" />
                      {alert.assignedUsername}
                    </span>
                    <span className="text-[10px] text-[#d29922] bg-[#d29922]/15 px-1.5 py-0.5 rounded font-medium">
                      <Copy className="inline mr-0.5 h-2.5 w-2.5" />
                      {alert.duplicateCount}x
                    </span>
                    <span className="text-[#30363d]">|</span>
                    <span className="text-[11px] text-[#6e7681] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.createdAt}
                    </span>
                    <span className="text-[11px] text-[#6e7681] flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {alert.source}
                    </span>
                  </div>
                </Card>,
                <Card key="triage" title="Triage">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
                    <ReadonlyField label="Severity" value="critical" />
                    <ReadonlyField label="Determination" value="suspicious" />
                    <ReadonlyField label="Partner" value="northwind" />
                  </div>
                </Card>,
                <Card key="context" title="Alert Context">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
                    <ReadonlyField label="Source" value={alert.source} />
                    <ReadonlyField label="Rule" value={alert.rule} />
                    <ReadonlyField label="Source IP" value={alert.sourceIp} mono />
                    <ReadonlyField label="Dest IP" value={alert.destIp} mono />
                    <ReadonlyField label="Hostname" value={alert.hostname} mono />
                    <ReadonlyField label="Source ID" value={alert.sourceId} mono />
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#30363d]">
                    <div className="flex gap-1 flex-wrap">
                      {alert.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[11px] bg-[#0d1117] border border-[#30363d] rounded text-[#e6edf3]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>,
                <Card
                  key="ioc"
                  title="Indicators of Compromise"
                  right={<span className="text-[11px] text-[#e6edf3] bg-[#e6edf3]/10 px-2 py-0.5 rounded-full font-medium">{alert.iocs.length}</span>}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {alert.iocs.map((ioc) => (
                      <div key={ioc} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0d1117] border border-[#30363d] text-[11px] font-mono text-[#8b949e]">
                        {ioc}
                      </div>
                    ))}
                  </div>
                </Card>,
                <Card key="timeline" title="Timeline">
                  <div className="flex flex-col gap-2 sm:flex-row mb-4">
                    <div className="flex-1 px-3 py-2 text-sm rounded-md border border-[#30363d] bg-[#0d1117] text-[#6e7681]">
                      Add a comment...
                    </div>
                    <button type="button" className="inline-flex items-center justify-center rounded-md border font-medium px-2.5 py-1 text-xs gap-1 bg-[#e6edf3]/15 border-[#e6edf3]/30 text-[#e6edf3]">
                      Comment
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[7px] top-4 bottom-4 w-px border-l-2 border-dashed border-[#30363d]/40" />
                    <div className="space-y-0">
                      {timeline.map((entry) => (
                        <div key={`${entry.time}-${entry.label}`} className="relative pl-6 pb-4 last:pb-0">
                          <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center ${
                            entry.comment ? "border-[#e6edf3]/40 bg-[#e6edf3]/10" : "border-[#30363d] bg-[#161b22]"
                          }`}>
                            <div className={`w-[7px] h-[7px] rounded-full ${
                              entry.comment ? "bg-[#e6edf3]" : entry.label === "Claimed" ? "bg-[#3fb950]" : entry.label === "Determination Set" ? "bg-[#d29922]" : "bg-[#6e7681]"
                            }`} />
                          </div>
                          <div className="text-xs">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-medium text-[#e6edf3]">{entry.label}</span>
                              <span className="text-[#6e7681]">{entry.time}</span>
                            </div>
                            {entry.comment ? (
                              <div className="group/comment bg-[#1c2129]/50 px-3 py-2 rounded-md mt-1 relative text-[#8b949e]">
                                {entry.detail}
                              </div>
                            ) : (
                              <div className="text-[#8b949e]">{entry.detail}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>,
                <Card
                  key="normalized"
                  title="Normalized Data"
                  right={
                    <button type="button" className="inline-flex items-center justify-center rounded-md border font-medium px-2.5 py-1 text-xs gap-1 bg-transparent border-transparent text-[#8b949e] hover:bg-[#1c2129] hover:text-[#e6edf3]">
                      <FileJson className="h-3.5 w-3.5" />
                      Raw Payload
                    </button>
                  }
                >
                  <div className="rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[11px] font-mono leading-relaxed text-[#8b949e]">
                    {"{"}
                    <br />
                    &nbsp;&nbsp;"source_ip": "203.0.113.42",
                    <br />
                    &nbsp;&nbsp;"hostname": "prod-bastion-01",
                    <br />
                    &nbsp;&nbsp;"rule_name": "ssh_brute_force",
                    <br />
                    &nbsp;&nbsp;"severity": "critical"
                    <br />
                    {"}"}
                  </div>
                </Card>,
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 + index * 0.05, duration: 0.36 }}
                >
                  {card}
                </motion.div>
              ))}
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-4">
              {[
                <Card
                  key="incidents"
                  title="Incidents"
                  right={
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button type="button" className="inline-flex items-center justify-center rounded-md border font-medium px-2.5 py-1 text-xs gap-1 bg-transparent border-transparent text-[#8b949e] hover:bg-[#1c2129] hover:text-[#e6edf3]">
                        <Briefcase className="h-3.5 w-3.5" />
                        Create
                      </button>
                      <button type="button" className="inline-flex items-center justify-center rounded-md border font-medium px-2 py-1 text-xs gap-1 bg-[#e6edf3]/15 border-[#e6edf3]/30 text-[#e6edf3]">
                        <Link2 className="h-3.5 w-3.5" />
                        Link
                      </button>
                    </div>
                  }
                >
                  <div className="space-y-2">
                    {incidents.map((incident) => (
                      <div key={incident.id} className="block no-underline rounded-md border border-[#30363d] px-3 py-2 hover:border-[#e6edf3]/30">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm text-[#e6edf3] font-medium truncate">{incident.title}</div>
                            <div className="text-[11px] text-[#6e7681] mt-0.5">
                              {incident.alertCount} alerts · {incident.assignedUsername}
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide whitespace-nowrap bg-[#f85149]/10 text-[#ff938d]">
                            {incident.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>,
                <Card key="playbooks" title="Run Playbook">
                  <div className="space-y-2">
                    {playbooks.map((playbook) => (
                      <div key={playbook.name} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left bg-transparent border border-[#30363d] hover:border-[#e6edf3]/30 hover:bg-[#1c2129]">
                        <Play className="h-[13px] w-[13px] text-[#8b949e] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#e6edf3] font-medium truncate">{playbook.name}</div>
                          <div className="text-[10px] text-[#6e7681] truncate">{playbook.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>,
                <Card key="info" title="Info">
                  <div className="space-y-2.5">
                    <SidebarField label="Created" value="2025-03-13 14:32" />
                    <SidebarField label="Updated" value="2025-03-13 14:34" />
                    <SidebarField label="Source" value={alert.source} />
                    <SidebarField label="Rule" value={alert.rule} />
                    <SidebarField label="Source IP" value={alert.sourceIp} mono />
                    <SidebarField label="Host" value={alert.hostname} mono />
                    <SidebarField label="ID" value={alert.id} mono />
                  </div>
                </Card>,
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 + index * 0.06, duration: 0.36 }}
                >
                  {card}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
