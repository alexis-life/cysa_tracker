// Own-words study notes and printed-page reading citations for the
// Sybex CompTIA CySA+ Study Guide (CS0-003), organized by exam objective.
// Page numbers are the printed book pages. The notes paraphrase the topics;
// they are not excerpts from the book.

export const BOOK_NOTES = [
  {
    "objectiveId": "1.1",
    "domain": "Security Operations",
    "label": "1.1 – System & Network Architecture in Security Operations",
    "objective": "Explain the importance of system and network architecture concepts in security operations",
    "readings": [
      {
        "chapter": 2,
        "section": "Infrastructure Concepts and Design",
        "pages": "38–40"
      },
      {
        "chapter": 2,
        "section": "Operating System Concepts",
        "pages": "41–44"
      },
      {
        "chapter": 2,
        "section": "Logging, Logs, and Log Ingestion",
        "pages": "45–46"
      },
      {
        "chapter": 2,
        "section": "Network Architecture",
        "pages": "47–52"
      },
      {
        "chapter": 2,
        "section": "Identity and Access Management",
        "pages": "53–65"
      },
      {
        "chapter": 2,
        "section": "Encryption and Sensitive Data Protection",
        "pages": "65–68"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 1,
        "section": "Cybersecurity Objectives / Privacy vs. Security",
        "pages": "4–5"
      },
      {
        "chapter": 1,
        "section": "Building a Secure Network",
        "pages": "12–18"
      },
      {
        "chapter": 1,
        "section": "Secure Endpoint Management",
        "pages": "19–20"
      }
    ],
    "sections": [
      {
        "title": "🏗️ infrastructure concepts",
        "ref": "Ch 2 p. 38–40",
        "points": [
          "**serverless (FaaS):** you ship functions, the provider runs everything under them. Nothing to patch at the OS level, scales on demand. Downsides: you depend on the provider, have less visibility, and need to secure the code, permissions, and API triggers yourself",
          "**virtualization:** a hypervisor runs full guest OSes on shared hardware. Good isolation and snapshots, but every VM has a full OS to patch and harden. Also used for **VDI** (desktops run centrally and stream to thin clients)",
          "**containerization:** apps ship with their libraries and config and share the host kernel (Docker, Kubernetes). Lighter and more portable than VMs, but weaker isolation, and a vulnerable base image spreads everywhere",
          "🆚 **VM vs container:** a VM carries a full OS, while a container is the app plus its dependencies on a shared kernel. \"Portable without the overhead of a full OS\" = container"
        ]
      },
      {
        "title": "🖥️ operating system concepts",
        "ref": "Ch 2 p. 41–45",
        "points": [
          "**system hardening:** remove unneeded services, apps, and accounts, close ports, apply patches, use secure configs, and follow baselines like CIS benchmarks or vendor guides",
          "**Windows Registry:** a hierarchical config database, edited with `regedit`. Five root keys: **HKCR** (file associations/COM), **HKLM** (system-wide: services, scheduled tasks), **HKU** (all user profiles), **HKCU** (the logged-in user), **HKCC** (current hardware profile). Each root key holds hives of keys and values, and keys can carry ACLs and auditing",
          "**config file locations:** Windows uses the Registry plus `C:\\ProgramData\\`, `C:\\Program Files\\`, and the user's `AppData`. Linux uses **`/etc/`**. macOS uses `~/Library/Preferences` and `/Library/Preferences` (the exam rarely asks about macOS)",
          "**system processes:** the core OS processes (Windows: NT kernel = PID 4, smss.exe, csrss.exe, services.exe, winlogon.exe, wininit.exe). Attackers name malware to look like these, or attack them for privileged access",
          "**hardware architecture:** x86 vs ARM and firmware/TPM features change which tools, malware, and protections apply"
        ]
      },
      {
        "title": "📜 logging & log ingestion",
        "ref": "Ch 2 p. 45–47",
        "points": [
          "**time sync:** logs only correlate if clocks agree, so use **NTP** and check it before you need it",
          "**log levels (Cisco):** 0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging. Level 7 is for troubleshooting only, because it's too noisy for normal use",
          "**log ingestion:** centralize logs (syslog/SIEM), plan retention and storage, and make sure you capture the fields you'll actually need"
        ]
      },
      {
        "title": "🌐 network architecture",
        "ref": "Ch 2 p. 47–52",
        "points": [
          "**on-prem / cloud / hybrid:** on-prem means you own every layer. Cloud uses shared responsibility (VPCs are semi-isolated tenant networks). Hybrid mixes both, so watch the trust boundary and identity in between",
          "**segmentation:** separates systems by risk or trust level using VLANs, firewalls, or physical separation. It shrinks the **attack surface** and can limit compliance scope (PCI). Access in through a **jump box**",
          "**SDN:** a software control plane separate from the data plane. You get programmable, centrally managed networks, but the controller becomes a high-value target",
          "**zero trust:** never trust by network location. Verify every request (identity, device, context) and use least privilege and microsegmentation. Main drawback: **complex to implement**",
          "**SASE:** SD-WAN plus cloud-delivered security (CASB, ZTNA, SWG, FWaaS) enforced at the edge, close to users"
        ]
      },
      {
        "title": "🔑 identity & access management",
        "ref": "Ch 2 p. 53–65",
        "points": [
          "**MFA factors:** knowledge (something you know), **possession** (token/phone), **biometric/inherence** (something you are), location (somewhere you are)",
          "**passwordless:** FIDO2/WebAuthn keys, biometrics, or magic links. No password to phish, but recovery and enrollment need care",
          "**SSO:** log in once to reach many services (LDAP, CAS, Kerberos). Convenient, but one stolen credential opens everything, so pair it with MFA",
          "**federation:** trusting identities across organizations. Roles: **IdP** (asserts identity) → **RP/SP** (relies on the assertion) → **consumer/user**",
          "**SAML:** XML-based authN/authZ assertions between an IdP and an SP (enterprise web SSO). **AD FS:** Microsoft federation that passes *claims* matched against *trust policies*",
          "**OAuth:** *authorization*. It hands an app a token to act for you without your password. **OpenID Connect:** an *authentication* layer built on OAuth",
          "**PAM:** vaulting, session recording, and just-in-time elevation for privileged accounts, based on least privilege",
          "**CASB:** sits between users and cloud apps for visibility, policy, DLP, and shadow-IT discovery"
        ]
      },
      {
        "title": "🔒 encryption & sensitive data",
        "ref": "Ch 2 p. 65–68",
        "points": [
          "**PKI:** CAs issue certificates used for TLS, user and service authentication, and code signing",
          "**SSL/TLS inspection:** decrypt, inspect, and re-encrypt traffic at a proxy so encrypted malware and exfiltration can be seen. Comes with privacy and trust tradeoffs",
          "**DLP:** finds and blocks sensitive data leaving the organization (endpoint, network, cloud)",
          "**PII:** anything that can identify a person directly or indirectly. **CHD:** cardholder data (PAN, name, expiration), governed by **PCI DSS**"
        ]
      }
    ]
  },
  {
    "objectiveId": "1.2",
    "domain": "Security Operations",
    "label": "1.2 – Analyze Indicators of Potentially Malicious Activity",
    "objective": "Given a scenario, analyze indicators of potentially malicious activity",
    "readings": [
      {
        "chapter": 3,
        "section": "Analyzing Network Events",
        "pages": "78–90"
      },
      {
        "chapter": 3,
        "section": "Investigating Host-Related Issues",
        "pages": "91–99"
      },
      {
        "chapter": 3,
        "section": "Investigating Service- and Application-Related Issues",
        "pages": "100–103"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 3,
        "section": "Determining Malicious Activity Using Tools and Techniques",
        "pages": "104–125"
      },
      {
        "chapter": 10,
        "section": "Indicators of Compromise",
        "pages": "378–380"
      },
      {
        "chapter": 10,
        "section": "Investigating IoCs",
        "pages": "381–387"
      }
    ],
    "sections": [
      {
        "title": "🌐 network-related indicators",
        "ref": "Ch 3 p. 78–90",
        "points": [
          "**capture methods:** router-based (flows like NetFlow/sFlow, SNMP, RMON), **active** monitoring (pings, iPerf, synthetic traffic), and **passive** monitoring (copying real traffic from a tap or SPAN)",
          "**bandwidth consumption:** sudden or sustained use beyond baseline can mean exfiltration, DoS, or a worm. Flow data answers \"who talked to whom, and how much\"",
          "**beaconing:** regular heartbeat traffic to C2, usually over HTTP/S, often with jitter. Spot it by periodicity, odd destinations, and identical packet sizes",
          "**irregular P2P:** hosts talking directly to each other when they normally talk to servers can point to lateral movement, botnets, or file sharing",
          "**unexpected traffic spikes:** three ways to detect them: **baselines** (anomaly-based), **heuristics** (behavior/rule-based), and **protocol analysis**",
          "**scans & sweeps:** many ports on one host (port scan) or one port across many hosts (sweep). Show up in firewall, IDS, and flow logs",
          "**activity on unexpected ports:** either scanning or a new service an attacker set up. Check context before deciding",
          "**DoS / DDoS:** resource exhaustion. A DDoS comes from many sources (a botnet). Signs: traffic surges, saturated links, and service errors",
          "**rogue devices:** wired rogues are stopped by **NAC / 802.1X / port security**. A MAC address reveals the **manufacturer (OUI)**. Find wireless rogues with **signal strength and triangulation** and wireless IDS"
        ]
      },
      {
        "title": "🖥️ host-related indicators",
        "ref": "Ch 3 p. 91–99",
        "points": [
          "**processor / memory / drive capacity consumption:** spikes against baseline. Alert with **monitoring thresholds** (for example 80% disk). Tools: resmon, perfmon, Task Manager, `top`/`htop`, `ps`, `df`, `du`, `free`, SCOM, Nagios",
          "**resmon vs perfmon:** resmon gives a quick live view of CPU, memory, disk, and network (plus process ports). **perfmon** gives deep counters and long-term data collection",
          "**unauthorized software / malicious processes:** unknown processes, odd parent-child chains, look-alike names, or software running from the wrong path. EDR and application allow-listing help",
          "**abnormal OS process behavior & data exfiltration:** unexpected outbound transfers, archive or encryption tools appearing, odd DNS. Exfiltration is a key indicator",
          "**unauthorized changes & privileges:** new admin accounts, privilege grants, **Registry** run keys, **scheduled tasks** (cron on Linux), and file-system changes. FIM and baselines catch these",
          "**social engineering & obfuscated links:** look-alike domains, URL shorteners, and display text that differs from the real link target"
        ]
      },
      {
        "title": "⚙️ application-related indicators",
        "ref": "Ch 3 p. 100–103",
        "points": [
          "**anomalous activity:** the app doing something it doesn't normally do is often the first sign of trouble",
          "**introduction of new accounts:** especially app-level admin accounts that aren't logged centrally",
          "**unexpected output:** garbled data, errors, or responses that shouldn't happen",
          "**unexpected outbound communication:** beaconing or file transfers coming from an app server",
          "**service interruption:** could be a plain fault or a DoS or compromise. Check service status with Windows `services.msc`, `sc query`, or `Get-Service`, and Linux `systemctl status` or `service --status-all`",
          "**application logs:** Windows Application log, Linux `/var/log/`. Know where your app logs live and what they contain"
        ]
      }
    ]
  },
  {
    "objectiveId": "1.3",
    "domain": "Security Operations",
    "label": "1.3 – Tools & Techniques to Determine Malicious Activity",
    "objective": "Given a scenario, use appropriate tools or techniques to determine malicious activity",
    "readings": [
      {
        "chapter": 3,
        "section": "Determining Malicious Activity Using Tools and Techniques",
        "pages": "104–125"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 2,
        "section": "Logging, Logs, and Log Ingestion",
        "pages": "45–46"
      },
      {
        "chapter": 3,
        "section": "Analyzing Network Events",
        "pages": "78–90"
      },
      {
        "chapter": 5,
        "section": "Passive Discovery",
        "pages": "175–191"
      },
      {
        "chapter": 13,
        "section": "Understanding Forensic Software",
        "pages": "450–454"
      },
      {
        "chapter": 13,
        "section": "Network Forensics",
        "pages": "458–459"
      }
    ],
    "sections": [
      {
        "title": "📜 logs & correlation",
        "ref": "Ch 3 p. 105–109",
        "points": [
          "**event logs (Windows):** Application, Security, System, Setup, and Forwarded Events. Read them in Event Viewer. **syslog** on Linux lives in `/var/log/` (`/var/log/syslog` or `messages`)",
          "**security device logs:** firewall (allow/deny, src/dst/port), **WAF** (blocked web attacks like SQLi/XSS), **proxy** (URLs, users, categories), and **IDS/IPS** (signature hits)",
          "**vendor-neutral reading:** the exam won't test a specific vendor format. Practice spotting timestamp, source, destination, action, and message in any log",
          "**trend analysis & correlation:** compare against a baseline and correlate across sources in a SIEM"
        ]
      },
      {
        "title": "🧰 security appliances & tools",
        "ref": "Ch 3 p. 110–114",
        "points": [
          "**SIEM:** central collection, correlation, alerting, and dashboards",
          "**SOAR:** SIEM plus **automated response** (playbooks, orchestration across tools). That's the key difference from a SIEM",
          "**EDR:** endpoint agents that detect and respond (isolate a host, kill a process)",
          "**packet capture:** **Wireshark** (GUI, protocol dissection, follow stream) and **tcpdump** (command line on headless servers, writes pcap with `-w`)",
          "**DNS & WHOIS reputation:** check domains and IPs against reputation services (AbuseIPDB, Cisco Talos, VirusTotal). WHOIS shows registrant and registration age"
        ]
      },
      {
        "title": "🔎 common techniques",
        "ref": "Ch 3 p. 114–121",
        "points": [
          "**pattern recognition:** spot C2/beaconing, interesting strings, and known attack patterns",
          "**email analysis:** look at full **headers** (Received chain, Return-Path, Message-ID). Have users **attach the original rather than forward it**, because forwarding strips the headers. Check embedded links, attachments, and impersonation",
          "**email security:** **SPF** = list of authorized sending servers (DNS TXT), **DKIM** = signature proving the domain sent the message, **DMARC** = policy that uses SPF and DKIM to decide authenticity and reporting",
          "**file analysis:** hashing (MD5/SHA-256, compared against known-good or VirusTotal), `strings`, file type and metadata checks",
          "**sandboxing:** detonate samples in an instrumented environment. **Joe Sandbox** is commercial and hosted, **Cuckoo** is open source and self-hosted",
          "**user behavior analysis (UBA/UEBA):** abnormal account activity, off-hours logins, and **impossible travel**"
        ]
      },
      {
        "title": "💻 programming languages & data formats",
        "ref": "Ch 3 p. 121–125",
        "points": [
          "**Python:** interpreted and indentation-sensitive, used everywhere in security tooling. **PowerShell:** Windows-native scripting (`Get-`, `Set-` cmdlets), heavily abused by attackers. **shell scripting:** bash and sh",
          "**regex:** used with `grep` to match flexible patterns (IPs, emails). Know the basics: `.` `*` `+` `?` `[]` `^` `$` `\\d`",
          "**JSON vs XML:** JSON uses `{\"key\": \"value\"}` objects and arrays (logs and APIs). XML uses tagged `<element>` markup"
        ]
      }
    ]
  },
  {
    "objectiveId": "1.4",
    "domain": "Security Operations",
    "label": "1.4 – Threat Intelligence & Threat Hunting Concepts",
    "objective": "Compare and contrast threat-intelligence and threat-hunting concepts",
    "readings": [
      {
        "chapter": 4,
        "section": "Threat Data and Intelligence",
        "pages": "136–145"
      },
      {
        "chapter": 4,
        "section": "Threat Classification",
        "pages": "146–147"
      },
      {
        "chapter": 4,
        "section": "Applying Threat Intelligence Organizationwide",
        "pages": "148–151"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 8,
        "section": "Threat Classification / Threat Research and Modeling",
        "pages": "305–306"
      }
    ],
    "sections": [
      {
        "title": "🧠 intelligence types & sources",
        "ref": "Ch 4 p. 135–140",
        "points": [
          "**strategic** (broad trends for leadership), **tactical** (technical and behavioral details for defenders), **operational** (very specific details for responding to one threat)",
          "**open source (OSINT):** government sites (CISA), vendor blogs, public feeds, social media, forums, **dark web**, CERT/CSIRT bulletins",
          "**proprietary / closed source:** commercial paid feeds, ISAC-member intel, internal data"
        ]
      },
      {
        "title": "⚖️ assessing intel (confidence levels)",
        "ref": "Ch 4 p. 140–141",
        "points": [
          "Judge sources by **timeliness** (is it current?), **relevancy** (does it apply to us?), and **accuracy** (is it right?). Together these set your **confidence level**",
          "Many feeds rate confidence and reliability. Combine sources instead of trusting just one"
        ]
      },
      {
        "title": "🤝 sharing & the intelligence cycle",
        "ref": "Ch 4 p. 142–145",
        "points": [
          "**sharing uses:** incident response, vulnerability management, risk management, security engineering, detection and monitoring",
          "**standards:** **STIX** (structured description of threat info), **TAXII** (protocol for exchanging it), **OpenIOC** (Mandiant format). Not directly on the exam, but used in real work",
          "**intelligence cycle:** requirements/planning → collection → processing & analysis → dissemination → feedback",
          "**community:** ISACs share sector-specific intel (FS-ISAC, H-ISAC, and others)"
        ]
      },
      {
        "title": "🎭 threat actors & TTPs",
        "ref": "Ch 4 p. 146–147",
        "points": [
          "**nation-state / APT:** well-funded, patient, stealthy. **organized crime:** after money (ransomware, fraud). **hacktivists:** ideology. **script kiddies:** use existing tools with little skill",
          "**insider threats:** **intentional** (malicious) vs **unintentional** (mistakes). The exam keeps these two separate",
          "**supply chain:** attacks through vendors, software updates, or hardware",
          "**TTPs:** tactics (the goal), techniques (how), procedures (the specific steps). Used to profile and attribute actors (see ATT&CK)"
        ]
      },
      {
        "title": "🏹 threat hunting",
        "ref": "Ch 4 p. 148–151",
        "points": [
          "**proactive hunting:** assume compromise. Form a **hypothesis**, then search for evidence. Don't wait for alerts",
          "**focus areas:** misconfigurations, isolated networks, business-critical assets, high-value data",
          "**IoCs:** artifacts (IPs, hashes, domains, registry keys) that point to compromise. Hunting also uses behaviors, not just IoCs",
          "**tools & techniques:** SIEM queries, EDR telemetry, packet captures, **honeypots/honeynets**. Active defense (\"hack back\") is legally risky and unlikely to be tested"
        ]
      }
    ]
  },
  {
    "objectiveId": "1.5",
    "domain": "Security Operations",
    "label": "1.5 – Efficiency & Process Improvement in Security Operations",
    "objective": "Explain the importance of efficiency and process improvement in security operations",
    "readings": [
      {
        "chapter": 1,
        "section": "Efficiency and Process Improvement",
        "pages": "27–31"
      },
      {
        "chapter": 1,
        "section": "Summary / Exam Essentials / Labs",
        "pages": "31–36"
      }
    ],
    "supportingReadings": [],
    "sections": [
      {
        "title": "⚙️ standardize & streamline",
        "ref": "Ch 1 p. 27–28",
        "points": [
          "**standardize processes:** document repeatable workflows and use consistent playbooks so any analyst gets the same result",
          "**streamline operations:** cut manual steps. CompTIA calls this \"**minimizing human engagement**\" through automation (SOAR)",
          "**automation payoffs:** faster response, fewer errors, and analysts free for higher-value work"
        ]
      },
      {
        "title": "🔗 technology & tool integration",
        "ref": "Ch 1 p. 29",
        "points": [
          "**scripting:** custom code that automates tasks. **integration:** vendor interfaces that tie products together",
          "**APIs:** the main way to connect security tools. **webhooks:** one app sends another an HTTP request when an event happens. **plug-ins:** extend a tool's capabilities",
          "**single pane of glass:** one console that shows data from many tools (the end goal of integration)"
        ]
      },
      {
        "title": "🚨 efficiency in incident response",
        "ref": "Ch 1 p. 29–31",
        "points": [
          "**enrich incident data automatically:** add geolocation, WHOIS, reputation, and asset owner to alerts",
          "**automate playbook steps:** containment actions, ticket creation, notifications, with a human approving the risky ones",
          "**future of analytics:** **machine learning** pulls patterns from large data volumes (anomaly detection, alert triage)"
        ]
      }
    ]
  },
  {
    "objectiveId": "2.1",
    "domain": "Vulnerability Management",
    "label": "2.1 – Implement Vulnerability Scanning Methods & Concepts",
    "objective": "Given a scenario, implement vulnerability scanning methods and concepts",
    "readings": [
      {
        "chapter": 1,
        "section": "Reverse Engineering",
        "pages": "25–26"
      },
      {
        "chapter": 1,
        "section": "Summary / Exam Essentials / Labs",
        "pages": "31–36"
      },
      {
        "chapter": 5,
        "section": "Mapping, Enumeration, and Asset Discovery",
        "pages": "160–174"
      },
      {
        "chapter": 5,
        "section": "Passive Discovery",
        "pages": "175–191"
      },
      {
        "chapter": 6,
        "section": "Identifying Vulnerability Management Requirements",
        "pages": "204–212"
      },
      {
        "chapter": 6,
        "section": "Configuring and Executing Vulnerability Scans",
        "pages": "213–220"
      },
      {
        "chapter": 6,
        "section": "Overcoming Risks of Vulnerability Scanning",
        "pages": "227–227"
      },
      {
        "chapter": 7,
        "section": "Critical Infrastructure and Operational Technology",
        "pages": "275–275"
      },
      {
        "chapter": 8,
        "section": "Software Security Testing",
        "pages": "321–324"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 1,
        "section": "Penetration Testing",
        "pages": "21–24"
      }
    ],
    "sections": [
      {
        "title": "🗺️ asset discovery & mapping",
        "ref": "Ch 5 p. 160–174",
        "points": [
          "**asset discovery:** find what's actually on the network (known and unknown) before you scan. Results feed the **asset inventory**",
          "**active recon:** pings and sweeps, **traceroute** (path/topology), port scans. Topology clues come from **TTL** values and hop counts",
          "**port ranges:** 0–1023 well-known/system ports, 1024–49151 registered, 49152–65535 dynamic",
          "**OS & device fingerprinting:** identify an OS or device from how its TCP/IP stack responds (TTL, window size, TCP options). Banner grabbing and response signatures identify **services and versions**",
          "**limitation:** firewalls and host filters can hide systems from port scanners, so combine scanning with passive data (logs, DHCP, CMDB)"
        ]
      },
      {
        "title": "👂 passive discovery",
        "ref": "Ch 5 p. 175–191",
        "points": [
          "**passive** = observe without probing: network device logs (syslog), configs, **NetFlow**, `netstat`, DHCP logs and leases, firewall logs and rules, system logs",
          "**DNS & WHOIS:** registrars, DNS records (A, AAAA, MX, NS, TXT, CNAME), `nslookup`/`dig`, **zone transfers** (AXFR, should be restricted), DNS brute forcing, WHOIS registration data",
          "**packet capture:** shows what's really on the wire (pentesters use it to validate scans and find traffic). It doesn't *prevent* attacks",
          "🆚 **active vs passive:** active touches the host (more data, noisier, can break fragile systems). Passive only observes (stealthy and safe, but incomplete)"
        ]
      },
      {
        "title": "📋 program requirements & frameworks",
        "ref": "Ch 6 p. 204–212",
        "points": [
          "**regulatory:** **PCI DSS** requires **quarterly internal and external scans** plus scans after significant changes, and rescans until clean. External scans must be done by an **ASV** (approved scanning vendor). Internal scans can be done by any **qualified individual**. **FISMA** requires federal agencies (and those acting for them) to scan per NIST SP 800-53",
          "**industry frameworks:** **CIS** benchmarks (consensus hardening baselines), **ISO 27001** (how to set up an ISMS) / **27002** (control details), **OWASP** (web app security: Top 10, testing guide), PCI DSS",
          "**scan targets:** decide from data classification, exposure, and **asset criticality**",
          "**scan frequency drivers:** **risk appetite**, regulatory requirements, technical/performance constraints, business/operations constraints, licensing limits. Staff availability is *not* a main driver"
        ]
      },
      {
        "title": "⚙️ configuring scans",
        "ref": "Ch 6 p. 213–220, 227",
        "points": [
          "**scope:** which networks/systems, which tests, and when. Isolating cardholder systems shrinks PCI scope",
          "**sensitivity levels / templates:** choose plug-ins. Test **dangerous plug-ins** in a test environment first",
          "**credentialed vs non-credentialed:** credentialed (use a **read-only** account) sees missing patches and configs, which means more accurate results and fewer false positives. Non-credentialed shows the attacker's outside view",
          "**agent-based vs agentless:** agents run on the host (continuous, good for laptops off-network). Agentless scans over the network",
          "**internal vs external perspective:** external = what an Internet attacker sees, internal = what an insider sees",
          "**security baseline scanning:** take an initial snapshot first, then flag drift from it",
          "**scanner maintenance:** keep the scanner software and **plug-in / vulnerability feeds** current. **SCAP** components: CVE (flaws), CPE (product names/versions), CCE (config issues), CVSS (severity), XCCDF (checklists), OVAL (low-level test language)",
          "**special considerations:** scans can hurt performance or crash **legacy/proprietary** systems, and SLAs/MOUs may limit scan windows"
        ]
      },
      {
        "title": "🏭 critical infrastructure & OT",
        "ref": "Ch 7 p. 275",
        "points": [
          "**ICS / SCADA / PLCs / Modbus:** built for availability and safety, often legacy and unpatchable, and fragile under active scans. Prefer **passive** monitoring and isolate these networks"
        ]
      },
      {
        "title": "🔬 static vs dynamic, reverse engineering & fuzzing",
        "ref": "Ch 1 p. 25–26 · Ch 8 p. 321–324",
        "points": [
          "**static analysis:** review code or binaries *without running* them (source review, SAST, decompilers, disassemblers)",
          "**dynamic analysis:** *run* the code and observe it (DAST, sandbox detonation, debuggers)",
          "**reverse engineering:** decompile or disassemble software, or tear down hardware, to see what it really does. Isolate samples in a **sandbox** (\"code detonation\")",
          "**fuzzing:** throw random or invalid input at an app, usually automated. Finds input validation, logic, and memory bugs",
          "**other testing:** fault injection, mutation testing, stress/load testing, security regression testing, UAT"
        ]
      }
    ]
  },
  {
    "objectiveId": "2.2",
    "domain": "Vulnerability Management",
    "label": "2.2 – Analyze Output from Vulnerability Assessment Tools",
    "objective": "Given a scenario, analyze output from vulnerability assessment tools",
    "readings": [
      {
        "chapter": 5,
        "section": "Mapping, Enumeration, and Asset Discovery",
        "pages": "160–174"
      },
      {
        "chapter": 5,
        "section": "Passive Discovery",
        "pages": "175–191"
      },
      {
        "chapter": 6,
        "section": "Vulnerability Assessment Tools",
        "pages": "228–237"
      },
      {
        "chapter": 7,
        "section": "Reviewing and Interpreting Scan Reports",
        "pages": "247–249"
      },
      {
        "chapter": 8,
        "section": "Software Security Testing",
        "pages": "321–324"
      }
    ],
    "supportingReadings": [],
    "sections": [
      {
        "title": "🧭 network scanning & mapping tools",
        "ref": "Ch 5 p. 165–174",
        "points": [
          "**nmap:** the standard port scanner. Flags: `-sS` SYN (default, quick), `-sT` connect, `-sU` UDP, `-sA` ACK (maps firewall rules), **`-sV`** service/version, **`-O`** OS detection, **`-Pn`** skip host discovery (for hosts that block ping), `-p` ports. **Zenmap** is its GUI and has a topology map",
          "**reading nmap output:** 80/443 suggests a web server, 22 SSH, 135/139/445 a Windows host, 1521 Oracle, 1433 MS-SQL, 3389 RDP",
          "**Angry IP Scanner:** fast GUI scanner for Windows, macOS, and Linux. Needs an IP or range. Adds data through **fetchers**. Multiple ping types help get past firewalls",
          "**Maltego:** OSINT link analysis and footprinting. A **transform** pulls related data about an entity",
          "**Recon-ng:** modular OSINT framework (for example `recon/domains-hosts/shodan_hostname`). Not a vulnerability scanner",
          "**Metasploit (MSF):** exploitation framework that can also scan (it can run nmap, and **wmap** scans web apps)"
        ]
      },
      {
        "title": "🛡️ vulnerability & web app scanners",
        "ref": "Ch 6 p. 228–237",
        "points": [
          "**infrastructure scanners:** **Nessus** (Tenable), **Qualys** (SaaS), **Nexpose** (Rapid7), **OpenVAS** (free/open source). *Not* scanners: Snort (IDS)",
          "**cloud assessment tools (know these 3):** **Scout Suite** (multicloud config audit through provider APIs), **Prowler** (AWS/Azure/GCP security config checks), **Pacu** (AWS *exploitation* framework, not a scanner)",
          "**web app scanners:** **Nikto** (open source, command line) and **Arachni** (open source, packaged). **ZAP** (OWASP) is an open-source scanner and proxy",
          "**interception proxies:** **Burp Suite** and **ZAP** sit between the browser and the server so you can view and modify requests (web app testing)"
        ]
      },
      {
        "title": "🐞 debuggers",
        "ref": "Ch 8 p. 325",
        "points": [
          "**Immunity Debugger:** built for pentesting and malware reverse engineering (Windows). **GDB:** open source Linux debugger for many languages"
        ]
      }
    ]
  },
  {
    "objectiveId": "2.3",
    "domain": "Vulnerability Management",
    "label": "2.3 – Analyze Data to Prioritize Vulnerabilities",
    "objective": "Given a scenario, analyze data to prioritize vulnerabilities",
    "readings": [
      {
        "chapter": 7,
        "section": "Reviewing and Interpreting Scan Reports",
        "pages": "247–249"
      },
      {
        "chapter": 7,
        "section": "Understanding CVSS",
        "pages": "250–255"
      },
      {
        "chapter": 7,
        "section": "Validating Scan Results",
        "pages": "256–259"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 6,
        "section": "Developing a Remediation Workflow",
        "pages": "221–226"
      }
    ],
    "sections": [
      {
        "title": "📄 reading scan reports",
        "ref": "Ch 7 p. 247–249",
        "points": [
          "**report fields:** vulnerability name and severity, description, **solution**, references (\"See Also\"), output (evidence), port/hosts, vulnerability information, risk information (CVSS, exploitability, whether it's in the news)"
        ]
      },
      {
        "title": "📊 CVSS (v3.1) interpretation",
        "ref": "Ch 7 p. 250–255",
        "points": [
          "**Attack Vector (AV):** Network (N) > Adjacent (A) > Local (L) > Physical (P)",
          "**Attack Complexity (AC):** Low (no special conditions, worse) vs High",
          "**Privileges Required (PR):** None > Low > High. **User Interaction (UI):** None vs Required",
          "**Scope (S):** Unchanged vs **Changed** (the impact reaches beyond the vulnerable component)",
          "**C / I / A impact:** None, Low, High",
          "**vector string:** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` (read each metric:value pair)",
          "**base score** comes from the **exploitability** sub-score (AV, AC, PR, UI) and the **impact** sub-score (C, I, A, adjusted by scope). Vulnerability age is *not* part of it",
          "**rating bands:** 0 none · 0.1–3.9 low · 4.0–6.9 medium · 7.0–8.9 high · 9.0–10 critical",
          "⚠️ The book (2023) calls 3.1 the latest version. CVSS 4.0 came out in Nov 2023, but CS0-003 questions use 3.x"
        ]
      },
      {
        "title": "✅ validation",
        "ref": "Ch 7 p. 256–259",
        "points": [
          "**true positive** (real vulnerability reported) · **false positive** (reported, but not real) · **true negative** (correctly absent) · **false negative** (missed: the most dangerous)",
          "**false positive handling:** verify it (authenticated scan, check with admins, review config), then **document the exception**",
          "**documented exceptions & informational results:** accepted risks get recorded so they don't keep reappearing. Informational findings may still help attackers with recon",
          "**reconcile with other sources:** logs, SIEM, configuration management, threat intel"
        ]
      },
      {
        "title": "🎯 prioritization: context, exploitability, asset value",
        "ref": "Ch 7 p. 255, 259 · Ch 6 p. 224–226",
        "points": [
          "**context awareness:** internal vs external exposure, isolated vs reachable, compensating controls already in place",
          "**exploitability / weaponization:** is there a working exploit? Is it being used in the wild? Weaponized vulnerabilities jump the queue",
          "**asset value / criticality:** sensitive data and business-critical systems come first",
          "**zero-day:** no patch exists yet, so rely on compensating controls, monitoring, and vendor workarounds",
          "**trend analysis:** watch counts over time (new vs fixed, recurring issues)",
          "**prioritization factors:** criticality of the systems and data, difficulty of remediation, severity, exposure"
        ]
      }
    ]
  },
  {
    "objectiveId": "2.4",
    "domain": "Vulnerability Management",
    "label": "2.4 – Recommend Controls to Mitigate Attacks & Vulnerabilities",
    "objective": "Given a scenario, recommend controls to mitigate attacks and software vulnerabilities",
    "readings": [
      {
        "chapter": 7,
        "section": "Common Vulnerabilities: Server, Endpoint & Network",
        "pages": "260–274"
      },
      {
        "chapter": 7,
        "section": "Web Application Vulnerabilities",
        "pages": "276–283"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 1,
        "section": "Building a Secure Network",
        "pages": "12–18"
      },
      {
        "chapter": 7,
        "section": "Critical Infrastructure and Operational Technology",
        "pages": "275–275"
      },
      {
        "chapter": 8,
        "section": "Designing and Coding for Security",
        "pages": "319–320"
      }
    ],
    "sections": [
      {
        "title": "🖥️ server & endpoint vulnerabilities",
        "ref": "Ch 7 p. 261–268",
        "points": [
          "**missing patches** and **EOL/outdated components** (no more vendor support, for example Windows Server 2008 R2). Fix by patching, upgrading, or isolating",
          "**overflows:** **buffer overflow** = writing more data than the buffer holds. **integer overflow** = a math result too big for its type. **Stack** (OS-managed) vs **heap** (app-managed) overflows. Controls: bounds checking, safe functions, ASLR/DEP",
          "**privilege escalation:** going from user to admin/root (for example Dirty COW on Linux). **Rootkits** automate it. Controls: patching, least privilege",
          "**(remote) code execution:** the attacker runs their own code. RCE works over the network, which makes it the most dangerous kind",
          "**insecure design** (flaws in the architecture, so use threat modeling and secure design patterns) and **security misconfiguration** (defaults, **debug modes** left on, verbose errors)"
        ]
      },
      {
        "title": "🌐 network vulnerabilities",
        "ref": "Ch 7 p. 269–274",
        "points": [
          "**missing firmware updates** on network gear and IoT",
          "**cryptographic failures:** outdated SSL/early TLS (use **TLS 1.2/1.3**), insecure ciphers, and **certificate problems** (expired, mismatched name, untrusted CA, self-signed). A *public key* in a certificate is normal and causes no warning",
          "**insecure protocols:** Telnet, FTP, and plaintext HTTP should never be used on public networks. Replace them with SSH, SFTP, HTTPS",
          "**internal IP disclosure:** a server leaks private addresses in headers. Fix the server config (NAT already hides them at the network layer)",
          "**VPN & virtualization issues:** VM escape, management interfaces, and old VPN protocols"
        ]
      },
      {
        "title": "🕸️ web application vulnerabilities",
        "ref": "Ch 7 p. 276–283",
        "points": [
          "**injection (SQLi, also XML/LDAP/command):** signs in logs are `'`, `;`, `OR 1=1`, `UNION`. Controls: **parameterized queries**, input validation, least-privilege DB accounts, WAF",
          "**XSS:** **reflected** (the victim sends the payload to the server in a link or query string, and it bounces back) vs **stored/persistent** (the payload is saved on the server, e.g., a forum post that attacks every reader). Controls: **output encoding**, input validation, CSP. (DOM-based XSS isn't covered in the book)",
          "**directory traversal:** `../../etc/passwd` in a parameter. **file inclusion:** **LFI** (runs a local file) vs **RFI** (runs code from a remote URL), often used to plant a **web shell**. Controls: input validation, allow-lists, file permissions",
          "**CSRF/XSRF:** abuses the site's trust in a logged-in user's browser. Controls: anti-CSRF tokens, SameSite cookies, re-authentication",
          "**SSRF:** tricks the *server* into requesting URLs (for example internal metadata services). Controls: allow-list destinations, block internal ranges",
          "**broken access control:** users act outside their permissions (IDOR, missing authorization checks). Check server-side, deny by default",
          "**identification & authentication failures:** password reuse, **credential stuffing** (stolen pairs tried on other sites), **password spraying** (a few common passwords tried on many accounts), impersonation, **on-path (MitM)**, **session hijacking**. Controls: MFA, rate limiting, secure session management, TLS",
          "**data poisoning:** tampered training data produces bad ML models. Controls: protect and validate training data"
        ]
      }
    ]
  },
  {
    "objectiveId": "2.5",
    "domain": "Vulnerability Management",
    "label": "2.5 – Vulnerability Response, Handling & Management",
    "objective": "Explain concepts related to vulnerability response, handling, and management",
    "readings": [
      {
        "chapter": 6,
        "section": "Developing a Remediation Workflow",
        "pages": "221–226"
      },
      {
        "chapter": 8,
        "section": "Analyzing Risk",
        "pages": "294–299"
      },
      {
        "chapter": 8,
        "section": "Managing Risk",
        "pages": "300–302"
      },
      {
        "chapter": 8,
        "section": "Implementing Security Controls",
        "pages": "303–304"
      },
      {
        "chapter": 8,
        "section": "Threat Classification / Threat Research and Modeling",
        "pages": "305–306"
      },
      {
        "chapter": 8,
        "section": "Managing the Computing Environment",
        "pages": "307–310"
      },
      {
        "chapter": 8,
        "section": "Software Assurance Best Practices",
        "pages": "310–318"
      },
      {
        "chapter": 8,
        "section": "Designing and Coding for Security",
        "pages": "319–320"
      },
      {
        "chapter": 8,
        "section": "Policies, Governance, and Service Level Objectives",
        "pages": "325–332"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 1,
        "section": "Evaluating Security Risks",
        "pages": "6–11"
      },
      {
        "chapter": 1,
        "section": "Secure Endpoint Management",
        "pages": "19–20"
      }
    ],
    "sections": [
      {
        "title": "⚖️ risk management principles",
        "ref": "Ch 8 p. 294–302 · Ch 1 p. 6–11",
        "points": [
          "**risk = threat × vulnerability.** Its size depends on **probability (likelihood)** and **magnitude (impact)**",
          "**threat categories (Ch 1):** adversarial, accidental, structural, environmental",
          "**quantitative:** **AV** (asset value) × **EF** (exposure factor, %) = **SLE**. SLE × **ARO** (yearly rate) = **ALE**. Worked example (Ch 8 review): AV $500k × EF 100% = SLE $500k. ARO 0.05 → ALE $25k",
          "**qualitative:** high/medium/low ratings on a likelihood × impact matrix",
          "**BIA:** a structured way to prioritize business functions and risks",
          "**the 4 strategies:** **mitigate** (add controls, e.g., a WAF), **avoid** (stop doing the risky activity), **transfer** (insurance, outsourcing), **accept** (deliberately do nothing more)"
        ]
      },
      {
        "title": "🧱 control types",
        "ref": "Ch 8 p. 303–304",
        "points": [
          "**categories:** **technical** (firewalls, encryption), **operational** (processes run by people: reviews, training), **managerial** (risk management processes: assessments, policy)",
          "**types:** **preventive** (stop it), **detective** (spot it), **responsive** (act during an incident), **corrective** (fix after), **compensating** (cover for an exception when the main control isn't possible)",
          "A firewall is a technical, preventive control"
        ]
      },
      {
        "title": "🧭 threat modeling & attack surface",
        "ref": "Ch 8 p. 305–309",
        "points": [
          "**threat modeling inputs:** adversary capability, total attack surface, attack vectors, likely impact, likelihood. Classification models: **STRIDE** (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege), **PASTA**, **LINDDUN**",
          "**threat reputation:** IP, domain, and file reputation feeds. Behavioral assessments help spot **insider threats**",
          "**attack surface management:** edge discovery scans, passive discovery, security controls testing, **pentests and bug bounties**, then **attack surface reduction** (close and remove what you don't need)",
          "**change & configuration management:** baselines, approvals, **version control**",
          "**patching & maintenance windows:** test patches, roll them out in scheduled windows, plan rollback"
        ]
      },
      {
        "title": "💻 secure SDLC & secure coding",
        "ref": "Ch 8 p. 310–320",
        "points": [
          "**SDLC phases:** feasibility → analysis & requirements → design → development (unit testing) → testing & integration (UAT) → training & transition → operations & maintenance → disposition",
          "**models:** **Waterfall** (strictly sequential), **Spiral** (linear phases repeated as 4-phase loops, risk-driven), **Agile** (iterative sprints, backlogs, user stories, planning poker, timeboxing), **RAD** (rapid prototypes: business, data, and process modeling → application generation → testing & turnover)",
          "**DevOps / DevSecOps:** security built into a pipeline with **CI** (frequent merges to a shared repo plus automated tests) and **CD** (automatic deploy)",
          "**common dev issues:** improper error handling, null-pointer dereference, insecure object references, race conditions, broken authentication, sensitive data exposure, insecure components, insufficient logging, weak defaults, insecure functions",
          "**secure coding best practices:** **input validation**, **output encoding**, secure session management, authentication (MFA), data protection (encryption), **parameterized queries**"
        ]
      },
      {
        "title": "📜 policies, governance & SLOs",
        "ref": "Ch 8 p. 325–332",
        "points": [
          "**policy** (high-level management intent, approved by leadership) → **standard** (mandatory specifics, e.g., \"workstations must have template X applied\") → **procedure** (step by step) → **guideline** (recommended, optional)",
          "**common policies:** information security policy, AUP, data ownership, classification, retention, account management, password",
          "**exceptions & compensating controls:** document the requirement, the reason, the justification, scope and duration, the compensating control, and who approved it",
          "**SLOs:** formal service expectations (e.g., \"five nines\" = 99.999% uptime, under ~6 min of downtime a year), documented in **SLAs** with penalties. SLAs and MOUs can *delay* patching (see 4.1 inhibitors)",
          "**prioritization & escalation:** fix by severity and criticality, and escalate overdue or blocked fixes to management"
        ]
      }
    ]
  },
  {
    "objectiveId": "3.1",
    "domain": "Incident Response",
    "label": "3.1 – Attack Methodology Frameworks (Kill Chain, MITRE ATT&CK)",
    "objective": "Explain concepts related to attack methodology frameworks",
    "readings": [
      {
        "chapter": 9,
        "section": "Attack Frameworks",
        "pages": "361–367"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 1,
        "section": "Penetration Testing",
        "pages": "21–24"
      }
    ],
    "sections": [
      {
        "title": "🧩 MITRE ATT&CK",
        "ref": "Ch 9 p. 361–362",
        "points": [
          "**ATT&CK** = Adversarial Tactics, Techniques, and Common Knowledge. A knowledge base of real adversary behavior organized in **matrices** (Enterprise, Mobile, ICS)",
          "**tactics** = the *why* (goal columns such as Initial Access, Persistence, Privilege Escalation, Lateral Movement, Exfiltration). **techniques/sub-techniques** = the *how*. Each entry includes detection and mitigation ideas",
          "Use it to map detections and gaps, profile threat groups, and plan hunts. It's descriptive, not an ordered sequence"
        ]
      },
      {
        "title": "💎 Diamond Model of Intrusion Analysis",
        "ref": "Ch 9 p. 362–364",
        "points": [
          "**core features (the four vertices):** **adversary**, **capability** (tools/malware), **infrastructure** (IPs, domains, C2), **victim**. An adversary uses a capability over infrastructure against a victim",
          "**meta-features:** start and end timestamps, phase, result, direction, methodology, resources. Plus a **confidence value** that the analyst assigns",
          "Good for *pivoting* from one vertex to another (for example, a known C2 domain leads to other victims) and for linking events into activity threads"
        ]
      },
      {
        "title": "⛓️ Lockheed Martin Cyber Kill Chain",
        "ref": "Ch 9 p. 364–366",
        "points": [
          "**7 stages:** **Reconnaissance → Weaponization → Delivery → Exploitation → Installation** (persistent backdoor) **→ Command & Control (C2) → Actions on Objectives**",
          "Defenders try to break the chain as early as possible. **Criticisms:** it includes steps outside the defended network (recon, weaponization), focuses on the perimeter and anti-malware, and handles insider threats poorly",
          "**Unified Kill Chain** (not on the objectives): merges the Kill Chain, ATT&CK, and others into **18 phases** covering attacks inside and outside the network"
        ]
      },
      {
        "title": "🧪 testing methodologies",
        "ref": "Ch 9 p. 367",
        "points": [
          "**OSSTMM** (Open Source Security Testing Methodology Manual, ISECOM): testing the security of **physical locations, human interactions, and communications**",
          "**OWASP Web Security Testing Guide:** methodology for testing **web applications**",
          "🆚 Kill Chain/Diamond/ATT&CK describe *attacks*. OSSTMM/OWASP guide *your testing*"
        ]
      }
    ]
  },
  {
    "objectiveId": "3.2",
    "domain": "Incident Response",
    "label": "3.2 – Perform Incident Response Activities",
    "objective": "Given a scenario, perform incident response activities",
    "readings": [
      {
        "chapter": 9,
        "section": "Security Incidents",
        "pages": "344–344"
      },
      {
        "chapter": 9,
        "section": "Phases of Incident Response",
        "pages": "345–350"
      },
      {
        "chapter": 9,
        "section": "Classifying Incidents",
        "pages": "356–360"
      },
      {
        "chapter": 10,
        "section": "Indicators of Compromise",
        "pages": "378–380"
      },
      {
        "chapter": 10,
        "section": "Investigating IoCs",
        "pages": "381–387"
      },
      {
        "chapter": 10,
        "section": "Evidence Acquisition and Preservation",
        "pages": "388–389"
      },
      {
        "chapter": 11,
        "section": "Containing the Damage",
        "pages": "398–405"
      },
      {
        "chapter": 11,
        "section": "Incident Eradication and Recovery",
        "pages": "406–410"
      },
      {
        "chapter": 13,
        "section": "Understanding Forensic Software",
        "pages": "450–454"
      },
      {
        "chapter": 13,
        "section": "Conducting Endpoint Forensics",
        "pages": "455–457"
      },
      {
        "chapter": 13,
        "section": "Network Forensics",
        "pages": "458–459"
      },
      {
        "chapter": 13,
        "section": "Cloud, Virtual, and Container Forensics",
        "pages": "460–461"
      },
      {
        "chapter": 13,
        "section": "Post-Incident Activity and Evidence Acquisition",
        "pages": "462–471"
      },
      {
        "chapter": 13,
        "section": "Forensic Investigation: An Example",
        "pages": "472–478"
      }
    ],
    "supportingReadings": [],
    "sections": [
      {
        "title": "🚨 events vs incidents & the IR cycle",
        "ref": "Ch 9 p. 344–349",
        "points": [
          "**event** = anything observable. **adverse event** = an event with negative consequences. **security incident** = a violation or imminent threat of violation of security policy, AUP, or standard practice. Every incident is made of events, but not every event is an incident",
          "**NIST SP 800-61 phases:** Preparation → **Detection & Analysis** → **Containment, Eradication & Recovery** → Post-Incident Activity (and back to preparation)",
          "**detection sources:** alerts (IDS/IPS, SIEM, AV, FIM), logs, public info, people. Correlation requires **NTP**-synchronized clocks"
        ]
      },
      {
        "title": "🏷️ classifying incidents",
        "ref": "Ch 9 p. 356–360",
        "points": [
          "**NIST attack vectors:** external/removable media, **attrition** (brute force, DDoS), **web** (XSS), **email**, **impersonation** (spoofing, on-path, rogue AP, SQLi), improper usage, loss/theft of equipment, unknown, other",
          "**functional impact:** None · Low (all critical services still up, efficiency lost) · **Medium** (lost a critical service for a *subset* of users) · High (lost some critical services for *all* users)",
          "**economic impact (book example):** none · low ≤ $10k · medium $10k–$500k · high ≥ $500k",
          "**recoverability:** Regular · Supplemented (needs extra resources) · **Extended** (unpredictable, needs outside help) · Not Recoverable",
          "**information impact:** None · Privacy breach (PII) · Proprietary breach · **Integrity loss** (data changed or deleted). A stolen *encrypted* laptop = None",
          "**APT & zero-days:** stealthy long-term actors. Zero-days are unknown flaws with no patch available"
        ]
      },
      {
        "title": "🔍 detection & analysis: IoCs",
        "ref": "Ch 10 p. 378–387",
        "points": [
          "**IoC** = data about activity or behavior tied to malicious behavior (IPs, hashes, domains, file names, registry keys). Feeds such as AlienVault **OTX**. Main issue with open feeds: **quality**. When an IoC fires, **review the alert to see why** before acting",
          "**unusual network traffic:** compare to **baselines**. Active monitoring (pings, iPerf) vs passive (flows, captures). A sudden drop in traffic may just be a failed link",
          "**resource usage:** CPU, memory, disk spikes. A filling disk: search for large files and directories. Unusual DB disk reads may point to exfiltration",
          "**account & login anomalies:** off-hours logins, impossible travel, privilege use, repeated failures (**brute force**), bot-like logins to many machines. Check **authentication and user-creation logs**",
          "**file & config modifications:** FIM, unexpected changes, persistence through **cron** or scheduled tasks",
          "**DoS:** sudden surges from many sources (DDoS). Tools to measure it: iPerf, flows. **unusual DNS:** DGA domains, tunneling, unexpected resolvers",
          "**combining IoCs** raises confidence: one indicator alone is weak"
        ]
      },
      {
        "title": "🧾 evidence acquisition & preservation",
        "ref": "Ch 10 p. 388–389 · Ch 13 p. 463–471",
        "points": [
          "**preservation:** keep evidence unchanged (write blockers, forensic copies). **chain of custody:** document every person who handled the evidence and when. Needed for court and law enforcement",
          "**legal hold:** preserve data related to pending or active litigation, overriding normal deletion and retention schedules",
          "**validating data integrity:** hash the original and the copy (MD5/SHA-1/SHA-256). Matching hashes prove the copy is intact. A mismatch means an unknown change or problem. (AES is encryption, *not* a hash)",
          "**imaging:** `dd` makes **RAW** bit-for-bit images. Use **write blockers**. **Live imaging** captures memory and encryption keys (needed for encrypted drives) but can change the system and can't fully preserve state",
          "**other sources:** logs, USB history, memory-resident data (**Volatility**), core dumps, hibernation files, mobile devices (manual access if tools can't reach the device)",
          "**antiforensics:** tools like CCleaner or wipers suggest someone tried to cover their tracks"
        ]
      },
      {
        "title": "🧯 containment",
        "ref": "Ch 11 p. 398–405",
        "points": [
          "**containment comes first:** stop the spread before you eradicate or recover",
          "**choosing a strategy:** potential damage, need to preserve evidence, service availability, time and resources, effectiveness, duration. Log volume is *not* a criterion",
          "**segmentation** (move the system to a quarantine VLAN with limited access) → **isolation** (cut it off from other internal systems, sometimes leaving Internet so you can watch the attacker) → **removal** (disconnect completely)",
          "**isolating the attacker:** sandbox or honeypot setups let you watch them safely",
          "**identifying attackers:** usually a waste of IR time. Focus on containment and recovery (NIST's view)"
        ]
      },
      {
        "title": "🧹 eradication & recovery",
        "ref": "Ch 11 p. 406–410",
        "points": [
          "**eradication:** remove every artifact (malware, backdoors, accounts). **Reimaging/rebuilding** is the surest way to purge a compromise",
          "**recovery:** restore services and harden them: **patching**, permissions, logging, scanning, compensating controls",
          "**NIST SP 800-88 sanitization:** **Clear** (logical overwrite or factory reset) · **Purge** (crypto-erase, degaussing, block erase, which defeats lab recovery) · **Destroy** (shred, pulverize, incinerate: for the most sensitive media)",
          "**recovery validation:** confirm patches, permissions, scans, and logging. Brand-new firewall rules aren't part of validation"
        ]
      },
      {
        "title": "🔬 forensic tools & techniques (detection & analysis)",
        "ref": "Ch 13 p. 448–478",
        "points": [
          "**forensic suites:** FTK, EnCase, SIFT, The Sleuth Kit/Autopsy. Capabilities: imaging, analysis, **file carving** (recover files without a filesystem), chain-of-custody tracking, hashing and validation, **timelines**",
          "**endpoint forensics:** disk, memory (Volatility), mobile, password crackers, crypto tools, log viewers",
          "**network forensics:** **Wireshark** (GUI) and **tcpdump** (command line on headless Linux servers)",
          "**cloud, VM & container forensics:** systems are often **ephemeral**, you depend on the provider, and snapshots and logs have to be captured before they disappear"
        ]
      }
    ]
  },
  {
    "objectiveId": "3.3",
    "domain": "Incident Response",
    "label": "3.3 – Preparation & Post-Incident Activity Phases",
    "objective": "Explain the preparation and post-incident activity phases of the incident management life cycle",
    "readings": [
      {
        "chapter": 9,
        "section": "Phases of Incident Response",
        "pages": "345–350"
      },
      {
        "chapter": 9,
        "section": "Building the Foundation for Incident Response",
        "pages": "351–353"
      },
      {
        "chapter": 9,
        "section": "Creating an Incident Response Team",
        "pages": "354–356"
      },
      {
        "chapter": 11,
        "section": "Wrapping Up the Response",
        "pages": "410–412"
      },
      {
        "chapter": 13,
        "section": "Building a Forensics Capability",
        "pages": "448–449"
      },
      {
        "chapter": 13,
        "section": "Post-Incident Activity and Evidence Acquisition",
        "pages": "462–471"
      },
      {
        "chapter": 13,
        "section": "Root Cause Analysis / Lessons Learned",
        "pages": "479–480"
      }
    ],
    "supportingReadings": [],
    "sections": [
      {
        "title": "🧰 preparation",
        "ref": "Ch 9 p. 346–356 · Ch 13 p. 448–449",
        "points": [
          "**preparation** = policy, procedures, training, testing, tooling, plus building defenses that make incidents less likely",
          "**IR toolkit (NIST):** forensic workstations, backup devices, laptops, spare server and network gear, blank media, portable printer, forensic and packet capture software, bootable USB with trusted tools, evidence-collection supplies",
          "**forensic toolkit:** workstation, forensic suite, **write blockers**, drive duplicators, wiped media, cables and adapters, camera, labels, chain-of-custody forms and notebooks",
          "**IR policy:** gives the CSIRT its authority, is approved by senior leadership (CEO), and avoids technical detail. **procedures** = tactical detail. **playbooks** = step-by-step for a specific incident type (they don't replace judgment)",
          "**IR plan documentation:** roles, communication plan, escalation, reporting requirements",
          "**BC/DR tie-in:** business continuity keeps operations going during an event, and disaster recovery restores them afterward. Coordinate both with IR",
          "**CSIRT:** diverse stakeholders (security, IT, legal, HR, PR, management). Can use outside **IR providers** (retainers). Define its **scope of control**",
          "**training & exercises:** tabletop exercises, simulations, media training (done in preparation)"
        ]
      },
      {
        "title": "📚 post-incident activity",
        "ref": "Ch 9 p. 349–350 · Ch 11 p. 410–412 · Ch 13 p. 463, 479–480",
        "points": [
          "**forensic analysis:** methodically rebuild what happened from evidence",
          "**root cause analysis (RCA):** define the event → identify causes and contributing factors (timeline) → find the root cause → identify solutions → implement fixes → validate → report. It's about *why it happened*, not *who to blame*. Risk analysis isn't one of the steps",
          "**lessons learned:** run by an **independent facilitator**. Cover what went well, what to improve, and new **IoCs** to watch for. Feed the results back into preparation",
          "**change control:** fixes made during recovery still go through change management afterward",
          "**final report:** documents the incident for the organization (it isn't usually shared outside)",
          "**evidence retention:** keep evidence per policy and law (e.g., US federal agencies keep IR records ≥ 3 years per GRS 3.2)"
        ]
      }
    ]
  },
  {
    "objectiveId": "4.1",
    "domain": "Reporting & Communication",
    "label": "4.1 – Vulnerability Management Reporting & Communication",
    "objective": "Explain the importance of vulnerability management reporting and communication",
    "readings": [
      {
        "chapter": 12,
        "section": "Vulnerability Management Reporting and Communication",
        "pages": "424–430"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 6,
        "section": "Developing a Remediation Workflow",
        "pages": "221–226"
      }
    ],
    "sections": [
      {
        "title": "📄 vulnerability management reporting",
        "ref": "Ch 12 p. 424–426",
        "points": [
          "**key report items:** vulnerabilities, **affected hosts** (IP/hostname), **risk score** (organization-specific context, not only CVSS), **mitigation** options (patches, updates, workarounds), **recurrence**, **prioritization**",
          "**recurrence** shows which fixes didn't stick, so it's the data point that best shows whether an issue keeps coming back",
          "**compliance reports:** regular reporting aligned to the standard's requirements (PCI DSS and others)"
        ]
      },
      {
        "title": "👥 stakeholders",
        "ref": "Ch 12 p. 426",
        "points": [
          "**stakeholder groups:** security operations and oversight (most interested in technical VM details), system owners and admins, management and executives, auditors/compliance",
          "Tailor the detail level and timing to each audience"
        ]
      },
      {
        "title": "🛠️ action plans",
        "ref": "Ch 12 p. 426–428",
        "points": [
          "**configuration management:** baselines and config management tools enforce patched, hardened builds",
          "**patching:** account for business processes and maintenance windows",
          "**compensating controls:** used when you can't patch (vendor won't support it, patch breaks functionality)",
          "**awareness, education & training:** fixes recurring human-driven issues that show up on dashboards",
          "**changing business requirements:** sometimes the process itself has to change"
        ]
      },
      {
        "title": "📈 metrics & KPIs",
        "ref": "Ch 12 p. 428–430",
        "points": [
          "**trends:** counts, severity, time to remediate. **top 10 lists:** biggest risks and most common vulnerabilities",
          "**critical vulnerabilities & zero-days:** zero-days won't appear in scans until signatures exist, so track response separately",
          "**SLOs:** time-to-remediate and time-to-patch targets. Measure gaps against them"
        ]
      },
      {
        "title": "🚧 inhibitors to remediation",
        "ref": "Ch 12 p. 430",
        "points": [
          "**MOUs** (uptime and performance targets), **SLAs** (performance targets can delay patching), **organizational governance** (approvals slow things down), **business process interruption**, **degrading functionality**, **legacy systems** (no patches), **proprietary systems** (vendor restrictions)",
          "**typical answer** when you can't patch: **identify and deploy a compensating control**"
        ]
      }
    ]
  },
  {
    "objectiveId": "4.2",
    "domain": "Reporting & Communication",
    "label": "4.2 – Incident Response Reporting & Communication",
    "objective": "Explain the importance of incident response reporting and communication",
    "readings": [
      {
        "chapter": 12,
        "section": "Incident Response Reporting and Communication",
        "pages": "431–438"
      }
    ],
    "supportingReadings": [
      {
        "chapter": 9,
        "section": "Classifying Incidents",
        "pages": "356–360"
      },
      {
        "chapter": 11,
        "section": "Wrapping Up the Response",
        "pages": "410–412"
      },
      {
        "chapter": 13,
        "section": "Root Cause Analysis / Lessons Learned",
        "pages": "479–480"
      }
    ],
    "sections": [
      {
        "title": "👥 stakeholders & communication",
        "ref": "Ch 12 p. 431–433",
        "points": [
          "**internal:** CSIRT, management and executives, legal, HR, PR, IT. **external:** customers, providers, law enforcement, outside counsel, regulators, media",
          "**communication happens in every IR phase**. Decide who needs what, how much detail, and when",
          "**NIST 800-61:** **predetermine communication guidelines** so only the right information goes to the right parties"
        ]
      },
      {
        "title": "📢 declaration & escalation",
        "ref": "Ch 12 p. 432",
        "points": [
          "IoCs go to responders → responders decide incident or false positive → if it's an incident, **declare** it, activate the IR plan and comms plan, then move into containment",
          "Escalate based on severity and classification (functional, economic, recoverability, information impact)"
        ]
      },
      {
        "title": "🗣️ communications",
        "ref": "Ch 12 p. 433–435",
        "points": [
          "**legal:** involve counsel early (notification laws, privilege). **PR:** customer communication and **media**: use designated spokespeople, **media training happens in preparation**, and don't just \"avoid the media entirely\"",
          "**regulatory reporting:** often the deciding factor in who must be notified and when, and it varies by location and industry",
          "**law enforcement:** can change the response (they may seize systems). Decide with legal counsel"
        ]
      },
      {
        "title": "🔁 RCA, lessons learned & metrics",
        "ref": "Ch 12 p. 435–437",
        "points": [
          "**RCA:** understand why it happened. Requires timelines and documenting secondary causes",
          "**lessons learned:** stop repeat incidents, and turn the report into improvements",
          "**IR metrics/KPIs:** **mean time to detect**, **mean time to respond**, **mean time to remediate**, **alert volume** (least useful on its own)"
        ]
      },
      {
        "title": "📝 incident response report",
        "ref": "Ch 12 p. 437–438 · Ch 11 p. 411",
        "points": [
          "**sections:** **executive summary**, **recommendations** (from lessons learned), **timeline**, **impact assessment** (what the outcome was), **scope** (what was affected), **evidence** (log excerpts usually go in an **appendix**)",
          "Answer who, what, when, where, why. The attacker's identity usually isn't included",
          "**prepared in:** the Post-Incident Activity phase"
        ]
      }
    ]
  }
];

export const BOOK_NOTES_BY_ID = Object.fromEntries(BOOK_NOTES.map((n) => [n.objectiveId, n]));

export const PLAN_READINGS = {
  "2026-11-10": {
    "minutes": 45,
    "readings": [
      {
        "chapter": "12",
        "section": "Incident Response Reporting and Communication",
        "pages": "431–438"
      },
      {
        "chapter": "12",
        "section": "Exam Essentials",
        "pages": "440"
      }
    ],
    "note": "Then the chapter 12 review questions tagged 4.2 (14 in the question bank)."
  },
  "2026-11-11": {
    "minutes": 60,
    "readings": [
      {
        "chapter": "9",
        "section": "Attack Frameworks and Developing Testing Strategies (3.1)",
        "pages": "361–367"
      },
      {
        "chapter": "12",
        "section": "Vulnerability Management Reporting and Communication (4.1, the objective with no videos)",
        "pages": "424–430"
      }
    ],
    "note": "Question bank items for 3.1 and 4.1, then the Domains 3–4 quiz."
  },
  "2026-11-12": {
    "minutes": 60,
    "readings": [
      {
        "chapter": "11",
        "section": "Containing the Damage through Wrapping Up the Response (3.2 / 3.3)",
        "pages": "398–412"
      }
    ],
    "note": "Chapter 11 review questions (20)."
  },
  "2026-11-13": {
    "minutes": 0,
    "readings": [],
    "note": "Practice exam day. Skim the book's Domain 1 exam notes for about 10 minutes beforehand."
  },
  "2026-11-14": {
    "minutes": 75,
    "readings": [
      {
        "chapter": "—",
        "section": "For each missed objective, read that objective's Book notes on the Videos tab.",
        "pages": "varies"
      }
    ],
    "note": "Printed assessment test (pp. xxxv–xxxviii) as a mixed check."
  },
  "2026-11-15": {
    "minutes": 90,
    "readings": [
      {
        "chapter": "1",
        "section": "Efficiency and Process Improvement (1.5)",
        "pages": "27–31"
      },
      {
        "chapter": "3",
        "section": "Determining Malicious Activity Using Tools and Techniques (1.3)",
        "pages": "104–125"
      }
    ],
    "note": "Chapter 3 review questions (20)."
  },
  "2026-11-16": {
    "minutes": 0,
    "readings": [],
    "note": "Skim the book's Domain 2 exam notes beforehand."
  },
  "2026-11-17": {
    "minutes": 60,
    "readings": [
      {
        "chapter": "2",
        "section": "Infrastructure, OS concepts, logging, and network architecture (1.1)",
        "pages": "38–52"
      }
    ],
    "note": "Chapter 2 review questions 1–10."
  },
  "2026-11-18": {
    "minutes": 60,
    "readings": [
      {
        "chapter": "7",
        "section": "Understanding CVSS and Validating Scan Results (2.3)",
        "pages": "250–259"
      },
      {
        "chapter": "6",
        "section": "Vulnerability Assessment Tools (2.2)",
        "pages": "228–237"
      }
    ],
    "note": "Chapter 7 review questions (20)."
  },
  "2026-11-19": {
    "minutes": 0,
    "readings": [],
    "note": ""
  },
  "2026-11-20": {
    "minutes": 60,
    "readings": [
      {
        "chapter": "7",
        "section": "Web Application Vulnerabilities (2.4)",
        "pages": "276–283"
      },
      {
        "chapter": "8",
        "section": "Managing Risk and Security Control Types (2.5)",
        "pages": "300–304"
      }
    ],
    "note": "Chapter 8 review questions (20)."
  },
  "2026-11-21": {
    "minutes": 0,
    "readings": [],
    "note": "Optional: open the 1.4 book notes on the Videos tab."
  },
  "2026-11-22": {
    "minutes": 90,
    "readings": [
      {
        "chapter": "10",
        "section": "Indicators of Compromise through Evidence Acquisition (3.2)",
        "pages": "378–389"
      },
      {
        "chapter": "13",
        "section": "Post-Incident Activity and Evidence Acquisition (3.2 / 3.3)",
        "pages": "462–471"
      }
    ],
    "note": "Chapter 10 and chapter 13 review questions."
  },
  "2026-11-23": {
    "minutes": 0,
    "readings": [],
    "note": ""
  },
  "2026-11-24": {
    "minutes": 60,
    "readings": [
      {
        "chapter": "8",
        "section": "Software Security Testing and Policies, Governance, and SLOs (2.1 / 2.5)",
        "pages": "321–332"
      }
    ],
    "note": "Chapter 9 review questions (20)."
  },
  "2026-11-25": {
    "minutes": 60,
    "readings": [
      {
        "chapter": "5",
        "section": "If this is a flex day: Port Scanning and Common Tools (nmap, Angry IP, Maltego, Recon-ng) (2.2)",
        "pages": "165–174"
      }
    ],
    "note": "If flex: chapter 5 review questions (20)."
  },
  "2026-11-26": {
    "minutes": 0,
    "readings": [],
    "note": ""
  },
  "2026-11-27": {
    "minutes": 30,
    "readings": [
      {
        "chapter": "—",
        "section": "Skim the book's exam notes and exam essentials end to end. No new chapter reading.",
        "pages": "—"
      }
    ],
    "note": ""
  }
};
