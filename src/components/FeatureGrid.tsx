import { Code2, Monitor, Plug, Zap } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: "Python-Native Playbooks",
    description: "Write automation in real Python — not YAML, not a sandbox. Full IDE support, any pip package, deploy like any Python app.",
  },
  {
    icon: Monitor,
    title: "Dashboard & Case Management",
    description: "Real-time overview of alerts, runs, and analyst activity. Assign cases, track investigations, and manage your SOC from one interface.",
  },
  {
    icon: Plug,
    title: "Integration Ecosystem",
    description: "Elastic, CrowdStrike, Jira, PagerDuty, Slack, and more. Community-driven integrations with a simple, consistent API.",
  },
  {
    icon: Zap,
    title: "Real-Time Alert Ingestion",
    description: "Webhooks, polling, Elasticsearch, syslog — alerts flow in from anywhere. Playbooks fire automatically based on conditions you define.",
  },
]

export function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {features.map((feature, i) => {
        const Icon = feature.icon
        return (
          <div
            key={i}
            className="group border border-border rounded-lg bg-surface p-6 hover:bg-surface-hover hover:border-heading/20 transition-all duration-200"
          >
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-heading/10 text-heading mb-4 group-hover:bg-heading/15 transition-colors">
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-heading mb-2">{feature.title}</h3>
            <p className="text-sm text-text leading-relaxed">{feature.description}</p>
          </div>
        )
      })}
    </div>
  )
}
