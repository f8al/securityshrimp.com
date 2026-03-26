We're stoked to announce that **Phrenology** has officially hit version 1.0.0! What started as an itch to scratch — a need for a reliable, extensible HTTP security header scanner — has evolved into a fully mature tool ready for the big leagues.

## What is Phrenology?

Phrenology is a pure Python tool for reading and analyzing HTTP security headers. Point it at a URL (or a whole list of them) and it'll tell you what's present, what's missing, what's deprecated, and what's leaking information about your stack. It's the security header equivalent of a reef check — finding the cracks before the predators do.

## What's in 1.0.0?

This release represents phrenology reaching full maturity as a stable, well-documented tool:

- **Four-category header analysis** — security headers, deprecated headers, informational headers, and cache headers, each toggleable with its own flag
- **OWASP guidance mode** (`-o`) — displays recommended values and guidance from the OWASP Secure Headers Project alongside your scan results
- **Bulk scanning** (`-f`) — pass a file of URLs and scan your entire external surface in one shot
- **JSON output** (`-j`) — structured output for piping into other tools, dashboards, or your own automation
- **Custom cookies** (`-C`) — scan authenticated pages by passing session cookies
- **Silent mode** (`-s`) — suppress the banner when calling phrenology from other tools in a pipeline
- **GET mode** (`-g`) — use GET requests instead of HEAD for servers that don't play nice with HEAD

## Why It Matters

Security headers are one of those things that everyone knows they should configure and almost nobody checks consistently. They're the locks on your doors — and phrenology tells you which doors are wide open, which locks are broken, and which ones you should've replaced years ago.

Whether you're running a one-off audit or integrating header checks into your CI/CD pipeline, phrenology is built to fit into your workflow without getting in the way.

## Get It

Phrenology is free and open-source. Grab it from [GitHub](https://github.com/f8al/phrenology) and start reading some headers.

```bash
git clone https://github.com/f8al/phrenology && cd phrenology && pip3 install -r requirements.txt
python3 phrenology.py -u https://yourdomain.com -o
```

---

*Reading heads since 2024. Now officially 1.0 — no more excuses for missing headers.*
