Your attack surface is bigger than you think. Shadow IT, forgotten subdomains, misconfigured services, exposed APIs — the average organization has no idea what's lurking in their waters. That's the problem **Mantis** was built to solve.

## What is Mantis?

Mantis is SecurityShrimp's attack surface discovery and monitoring platform. Think of it as a mantis shrimp patrolling your reef — fast, precise, and capable of seeing things others miss. It continuously enumerates, scans, and monitors your organization's external-facing assets, giving you full visibility into what you're actually exposing to the internet.

## What It Does

Mantis takes your seed inputs — domains, IPs, ASNs, CIDRs — and goes deep:

- **Asset Discovery** — subdomain enumeration, DNS resolution, and infrastructure mapping to surface every asset connected to your organization
- **Port Scanning & Fingerprinting** — identify open ports, running services, and technology stacks across your entire perimeter
- **HTTP Probing & Tech Detection** — probe web assets for status, technologies, and misconfigurations
- **TLS Inspection** — certificate analysis, expiration monitoring, and cipher suite evaluation
- **Vulnerability Scanning** — automated vulnerability detection and correlation across discovered assets
- **CDN/WAF & Cloud Attribution** — know what's behind your CDN and which cloud providers host your infrastructure
- **Risk Scoring** — A-F grading with severity-weighted scoring so you know what to fix first

## Integrations That Fit Your Workflow

Mantis doesn't just find problems — it feeds them directly into your existing security stack:

- **Splunk & Microsoft Sentinel** — native integration pipes findings straight into your SIEM. No middleware, no duct tape.
- **SOAR Platforms** — webhook support for XSOAR, Phantom, and any platform that speaks HTTP. Automate your response before the tide rolls in.
- **Email & Slack** — real-time alerts to your inbox or Slack channels so your team knows the moment something surfaces.

## Cloud Asset Discovery — AWS & Azure

Your attack surface doesn't stop at DNS. Mantis now discovers and monitors your cloud infrastructure alongside your external-facing assets. Connect your AWS or Azure accounts and Mantis will automatically enumerate resources, identify misconfigurations, and surface security findings — giving you complete visibility across your entire environment. All credentials are encrypted at rest.

### What it discovers

**AWS:** EC2 instances, RDS databases, Lambda functions, ECS clusters, load balancers (ALB/NLB/Classic), and security group configurations

**Azure:** Virtual Machines, SQL Servers, App Services & Functions, Storage Accounts, AKS clusters, Load Balancers, Network Security Groups, and Public IPs

### Security findings it surfaces

- Open security groups and NSG rules exposing sensitive ports (SSH, RDP, databases) to the internet
- Unencrypted RDS instances and publicly accessible databases
- Azure SQL servers with wide-open firewall rules
- Storage accounts with public blob access enabled
- App Services and storage accounts not enforcing HTTPS
- AKS clusters with publicly exposed API servers
- EC2 instances and Azure VMs with public IP addresses

### How it works

1. Add your AWS IAM credentials or Azure service principal under **Settings > Cloud Integrations**
2. Validate the connection with one click
3. Mantis enumerates resources across all configured regions and subscriptions during scans
4. Cloud resources appear in your asset inventory alongside DNS-discovered assets
5. Public IPs found in the cloud feed directly into port scanning, HTTP probing, and vulnerability detection

## Why We Built It

We've used the big-name ASM platforms professionally — they're either eye-wateringly expensive, painfully slow, or missing the tools an offensive security practitioner actually wants. Mantis is the attack surface management platform we wished existed: fast, thorough, and built by someone who's been on the other side of the engagement.

Highlander finds the imposters swimming in your waters. Mantis finds what *you're* actually exposing. Two sides of the same coin — or two claws on the same shrimp.

## Getting Started

Want to see what's lurking in your reef? [Get in touch](/services.html#contact) to request a demo and we'll show you.

---

*The reef doesn't guard itself. Let the shrimp do the work.*
