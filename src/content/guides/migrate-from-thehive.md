---
title: "Migrate from TheHive to OpenSOAR | OpenSOAR Guide"
description: "A practical guide for teams moving from TheHive to OpenSOAR. Understand the model shift, what maps cleanly, what gaps to plan for, and where to find the canonical migration docs."
heading: "Migrate from TheHive to OpenSOAR"
subheading: "A practical migration path for teams replacing TheHive with a code-first, Python-native SOAR."
badge: "Guide"
order: 1
---

This page is the editorial overview: why teams move, what changes operationally, and how to think about the transition. For the canonical migration reference and field-level details, use [docs.opensoar.app](https://docs.opensoar.app/migrations/thehive/).

## Why this migration exists

TheHive used to be the default answer for open-source SOC teams that wanted case management and response workflows without buying a commercial SOAR. Teams now looking for a replacement are usually trying to preserve the same core operating model: alerts, cases, observables, analyst workflow, and automation.

OpenSOAR is not a clone of TheHive. The shift is bigger than a product swap: it is also a shift from the old TheHive + Cortex operating model toward Python-native playbooks and a simpler runtime.

## What maps cleanly

- **Alerts** still map to alerts.
- **Cases** map to incidents.
- **Artifacts / observables** still map to observables.
- **Analyzer / responder workflows** become playbooks and actions.

That means most teams can preserve the analyst-facing mental model even though the automation layer changes significantly.

## What changes the most

### Automation stops being Cortex-shaped

In the old model, enrichment and response often meant jumping through analyzers and responders packaged around Cortex. In OpenSOAR, the main unit of automation is just code.

```python
@playbook(trigger="webhook", conditions={"severity": ["high", "critical"]})
async def enrich_and_triage(alert):
    vt_result, abuse_result = await asyncio.gather(
        lookup_virustotal(alert.iocs),
        lookup_abuseipdb(alert.source_ip),
    )

    if abuse_result.confidence_score > 80:
        await isolate_host(alert.hostname)
        await notify_slack(channel="#soc-critical", message=alert.title)
    else:
        await alert.update(determination="benign", status="resolved")
```

That is the main trade: less “marketplace appliance” behavior, more direct Python ownership.

### Deployment becomes code-and-runtime oriented

Playbooks are loaded from configured directories, versioned in Git, and deployed like code. That is cleaner for engineering-driven teams, but it also means you should treat automation changes like software delivery, not like form edits in a UI.

### Some TheHive features do not map one-to-one

Teams should plan explicitly around the gaps before migrating:

- case task workflows
- template-heavy case processes
- some ecosystem-specific integrations
- parts of the old Cortex analyzer/responder model

## How to approach the migration

1. **Start with ingestion and triage.** Do not migrate every workflow at once.
2. **Port one or two high-value responders first.** Focus on the automations your analysts use the most.
3. **Validate incidents and observables early.** Make sure the operational model still works for the team.
4. **Move to broader automation only after trust exists.** Treat the first phase as a controlled migration, not a rewrite sprint.

## What OpenSOAR is better at

- **Python-native automation** instead of containerized analyzer/responder plumbing
- **Versioned playbooks** with normal code review and testing workflows
- **Simpler runtime** for teams that do not want to preserve TheHive-era architecture
- **Built-in AI workflows** for triage, summarization, and automation support

## Where to go next

If you are actively planning the move, read the docs next:

- [TheHive migration guide](https://docs.opensoar.app/migrations/thehive/)
- [Getting Started](https://docs.opensoar.app/getting-started/)
- [Playbooks Overview](https://docs.opensoar.app/playbooks/overview/)
- [Loading and Syncing Playbooks](https://docs.opensoar.app/playbooks/loading-and-sync/)

---

Want the implementation details and field mappings? Go straight to [docs.opensoar.app](https://docs.opensoar.app/migrations/thehive/).
