# People-card link resolution

*Companion to `data/people.json` — records, per person, why a card links where it does (or
why it has no link), so a `null` link is distinguishable from a failed lookup. Resolved
2026-09-03. The rules (Kyle, 2026-09-03): a card links the person's personal TUHH page when
one exists; otherwise a personal page only at ≥90% identity confidence where the page itself
shows TUHH/HippoCampus affiliation; otherwise no link. LinkedIn/ResearchGate/Scholar
profiles are deliberately never linked (login walls, instability); found ones are listed as
candidates. `tools/check_urls.py` probes every non-null link for liveness.*

## Active

| Person | Resolution | Link |
|---|---|---|
| Kyle Nelson | RESOLVED 2026-09-03 (was flagged: the auto-generated project URL `portfolio-kyle-nelson-berkeleys-projects.vercel.app` 302s to Vercel SSO). Kyle supplied the public production alias, which serves the latest production deployment without disabling deployment protection — verified 200 anonymously. | https://kyle-nelson-berkeley.vercel.app |
| Nathalie Bauschmann | Personal TUHH page, verified 200 | https://www.tuhh.de/mum/team/wimi/nathalie-bauschmann |
| Vincent Lenz | Personal TUHH page, verified 200 | https://www.tuhh.de/mum/team/wimi/vincent-lenz |
| Finn Busch | No TUHH page (404). Identity of the KTH RPL PhD student is ≥90% certain (LinkedIn: KTH + Hamburg University of Technology), but no stable page of his shows the TUHH affiliation: finnbusch.com is a bare project redirector, and kth.se/profile/flbusch has no bio. No link by rule; candidates for Kyle: https://www.finnbusch.com/ · https://www.kth.se/profile/flbusch/ · https://github.com/finnBsch | none |

## Alumni

| Person | Resolution | Link |
|---|---|---|
| Thies Lennart Alff | Personal TUHH page, verified 200 | https://www.tuhh.de/mum/team/wimi/thies-lennart-alff |
| Daniel-André Dücker | Personal TUHH page still exists, verified 200 (per the decision: TUHH page, not a TUM page) | https://www.tuhh.de/mum/team/wimi/daniel-duecker |
| Niklas Trekel | No TUHH page. Non-TUHH personal page, ≥90%: his Uni Bonn (StachnissLab) page states both his degrees are from Hamburg University of Technology | https://www.ipb.uni-bonn.de/people/niklas-trekel/index.html |
| Richard Wittmüß | No TUHH page; only a LinkedIn profile found (shows TU Hamburg) — not linked by policy. Candidate: https://de.linkedin.com/in/richard-wittmuess | none |
| Eugen Solowjow | Personal TUHH page still exists, verified 200 | https://www.tuhh.de/mum/team/wimi/eugen-solowjow |
| Axel Hackbarth | Personal TUHH page still exists, verified 200 | https://www.tuhh.de/mum/team/wimi/axel-hackbarth |
| Tim Hansen | No TUHH page; now at Constructor University per Scholar/LinkedIn, but no stable personal page showing TUHH affiliation. Candidate: https://de.linkedin.com/in/tim-hansen-8b5aa1170 | none |
| René Hochdahl | Personal TUHH page (back at MUM as research staff), verified 200 | https://www.tuhh.de/mum/team/wimi/rene-hochdahl |
| Roman Sartorti | Personal TUHH page (now at the SKF institute), verified 200 | https://www.tuhh.de/skf/institute/staff/roman-sartorti |
| Malte Flehmke | Personal TUHH page (now at the IPMT institute), verified 200 | https://www.tuhh.de/ipmt/das-ipmt/team/mf |
| Benedikt Mersch | No TUHH page. Non-TUHH personal page, ≥90%: his Uni Bonn (StachnissLab) page states his master's degree is from Hamburg University of Technology | https://www.ipb.uni-bonn.de/people/benedikt-mersch/index.html |
| Matti Vahs | No TUHH page. Non-TUHH personal page, ≥90%: his KTH profile states both his degrees are from Hamburg University of Technology | https://www.kth.se/profile/vahs |
| Lukas Büsch | Personal TUHH page (now at the IFPT institute), verified 200 | https://www.tuhh.de/ifpt/institut/mitarbeiter/wissenschaftliche-mitarbeiter/lukas-buesch-msc |
| Philip Carstensen | Personal TUHH page (external doctoral candidate at MUM), verified 200 | https://www.tuhh.de/mum/team/wimi/philip-carstensen |
| Kevin Eusemann | No TUHH page; no personal page found (only unclaimed ResearchGate/SemanticScholar entries). No link by rule | none |
| Sean Maroofi | No TUHH page; only a LinkedIn profile found (shows TU Hamburg) — not linked by policy. Candidate: https://se.linkedin.com/in/sean-maroofi | none |
| Viktor Rausch | No TUHH page; only ResearchGate/Scholar profiles found — not linked by policy | none |
| René Geist | No TUHH page. Non-TUHH personal page, ≥90%: his homepage states Theoretical Mechanical Engineering at TU Hamburg, and his HippoCampus-era paper carries the MUM institute affiliation | https://andregeist.github.io/ |
| Tobias Johannink | No TUHH page; only LinkedIn/ResearchGate found (both show TUHH history) — not linked by policy. Candidate: https://de.linkedin.com/in/tobias-johannink-a2b060163 | none |

## Non-TUHH links for Kyle's review

- Niklas Trekel → https://www.ipb.uni-bonn.de/people/niklas-trekel/index.html
- Benedikt Mersch → https://www.ipb.uni-bonn.de/people/benedikt-mersch/index.html
- Matti Vahs → https://www.kth.se/profile/vahs
- René Geist → https://andregeist.github.io/
