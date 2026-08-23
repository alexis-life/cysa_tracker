import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { DOMAINS, c } from "./theme";

const OBJECTIVES = {
  "Security Operations": [
    { id: "1.1", label: "1.1 – System & Network Architecture in Security Operations" },
    { id: "1.2", label: "1.2 – Analyze Indicators of Potentially Malicious Activity" },
    { id: "1.3", label: "1.3 – Tools & Techniques to Determine Malicious Activity" },
    { id: "1.4", label: "1.4 – Threat Intelligence & Threat Hunting Concepts" },
    { id: "1.5", label: "1.5 – Efficiency & Process Improvement in Security Operations" },
  ],
  "Vulnerability Management": [
    { id: "2.1", label: "2.1 – Implement Vulnerability Scanning Methods & Concepts" },
    { id: "2.2", label: "2.2 – Analyze Output from Vulnerability Assessment Tools" },
    { id: "2.3", label: "2.3 – Analyze Data to Prioritize Vulnerabilities" },
    { id: "2.4", label: "2.4 – Recommend Controls to Mitigate Attacks & Vulnerabilities" },
    { id: "2.5", label: "2.5 – Vulnerability Response, Handling & Management" },
  ],
  "Incident Response": [
    { id: "3.1", label: "3.1 – Attack Methodology Frameworks (Kill Chain, MITRE ATT&CK)" },
    { id: "3.2", label: "3.2 – Perform Incident Response Activities" },
    { id: "3.3", label: "3.3 – Preparation & Post-Incident Activity Phases" },
  ],
  "Reporting & Communication": [
    { id: "4.1", label: "4.1 – Vulnerability Management Reporting & Communication" },
    { id: "4.2", label: "4.2 – Incident Response Reporting & Communication" },
  ],
};

const ALL_OBJECTIVES_FLAT = Object.entries(OBJECTIVES).flatMap(([domain, objs]) =>
  objs.map((o) => ({ ...o, domain }))
);

const SEED_QUESTIONS = [
  { id: "book-1", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Naomi wants to make her applications portable and easy to move to new environments without the overhead of a full operating system. What type of solution should she select?", options: ["An x86 architecture", "Virtualization", "Containerization", "A SASE solution"], answer: 2, explanation: "Naomi should containerize her application. This will provide her with a lightweight option that can be moved between services and environments without requiring her to have an OS included in her container. Virtualization would include a full operating system. SASE is a solution for edge-focused security, whereas x86 is a hardware architecture." , source: "Sybex Practice Questions" },
  { id: "book-2", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Bharath wants to make changes to the Windows Registry. What tool should he select?", options: ["regwiz.msc", "notepad.exe", "secpol.msc", "regedit"], answer: 3, explanation: "The built-in Windows Registry editor is regedit. The secpol.msc tool is used to view and manage security policies. There is no regwiz tool, and Notepad, while handy, shouldn’t be used to try to edit the Registry!." , source: "Sybex Practice Questions" },
  { id: "book-3", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Tom wants to set an appropriate logging level for his Cisco networking equipment while he’s troubleshooting. What log level should he set?", options: ["1", "3", "5", "7"], answer: 3, explanation: "Tom knows that log level 7 provides debugging messages that he will need during troubleshooting. Once he’s done, he’ll likely want to set a lower log level to ensure that he doesn’t create lots of noise in his logs." , source: "Sybex Practice Questions" },
  { id: "book-4", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Which of the following is not a common use of network segmentation?", options: ["Decreasing attack surfaces", "Limiting the scope of regulatory compliance", "Reducing availability", "Increasing the efficiency of a network"], answer: 2, explanation: "Segmentation is sometimes used to increase availability by reducing the potential impact of an attack or issue—intentionally reducing availability is unlikely to be a path chosen by most organizations." , source: "Sybex Practice Questions" },
  { id: "book-5", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Ric’s organization wants to implement zero trust. What concern should Ric raise about zero trust implementations?", options: ["They can be complex to implement.", "Zero trust does not support TLS inspection.", "Zero trust is not compatible with modern software-defined networks.", "They are likely to prevent users from accomplishing their jobs."], answer: 0, explanation: "Ric knows that zero trust can be complex to implement. Zero trust does not specifically prevent TLS inspection or conflict with SDN, and a successful zero trust implementation needs to validate user permissions but allow them to do their jobs." , source: "Sybex Practice Questions" },
  { id: "book-6", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Michelle has a security token that her company issues to her. What type of authentication factor does she have?", options: ["Biometric", "Possession", "Knowledge", "Inherence"], answer: 1, explanation: "Michelle’s security token is an example of a possession factor, or “something you have.” A password or PIN would be a knowledge factor or “something you know,” and a fingerprint or retina scan would be a biometric, or inherence, factor." , source: "Sybex Practice Questions" },
  { id: "book-7", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Which party in a federated identity service model makes assertions about identities to service providers?", options: ["RPs", "CDUs", "IDPs", "APs"], answer: 2, explanation: "Identity providers (IDPs) make assertions about identities to relying parties and service providers in a federation. CDUs and APs are not terms used in federated identity designs." , source: "Sybex Practice Questions" },
  { id: "book-8", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "What design concept requires that each action requested be verified and validated before it is allowed to occur?", options: ["Secure access service edge", "Zero trust", "Trust but verify", "Extended validation network"], answer: 1, explanation: "Zero trust requires each action or use of privileges to be validated and verified before it is allowed to occur. Secure access service edge combines software-defined networking with other security products and services to control edge device security rather than requiring a secured central service or network. Trust but verify and extended validation network are not design concepts." , source: "Sybex Practice Questions" },
  { id: "book-9", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Juan’s organization uses LDAP to allow users to log into a variety of services without having to type in their username and password again. What type of service is in use?", options: ["SSO", "MFA", "EDR", "ZeroAuth"], answer: 0, explanation: "Juan’s organization is using a single sign-on (SSO) solution that allows users to sign in once and use multiple services. MFA is multifactor authentication; EDR is endpoint detection and response, an endpoint security tool; and ZeroAuth was made up for this question." , source: "Sybex Practice Questions" },
  { id: "book-10", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Jen’s organization wants to ensure that administrator credentials are not used improperly. What type of solution should Jen recommend to address this requirement?", options: ["SAML", "CASB", "PAM", "PKI"], answer: 2, explanation: "A privilege access management (PAM) system would not only allow Jen’s organization to manage and monitor privilege use for administrator accounts but would be helpful for other privileges as well. SAML is an XML-based language used to send authorization and authentication data, a CASB is a cloud access security broker used to manage cloud access rights, and PKI is a public key infrastructure used to issue and manage security certificates." , source: "Sybex Practice Questions" },
  { id: "book-11", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Financial and medical records are an example of what type of data?", options: ["CHD", "PCI", "PII", "TS/SCI"], answer: 2, explanation: "Common examples of PII include financial records, addresses and phone numbers, and national or state identification numbers like Social Security numbers, passport numbers, and driver’s license numbers in the United States. CHD is cardholder data. PCI is the payment card industry, which defines the PCI DSS security standard. TS/SCI is a U.S. classification label standing for Top Secret/Sensitive Compartmented Information." , source: "Sybex Practice Questions" },
  { id: "book-12", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Which of the following is not part of cardholder data for credit cards?", options: ["The cardholder’s name", "The CVV code", "The expiration date", "The primary account number"], answer: 1, explanation: "The primary account number (PAN), the cardholder’s name, and the expiration date of the card are considered cardholder data. Sensitive authentication data includes the CVV code, the contents of the magnetic stripe and chip, and the PIN code if one is used." , source: "Sybex Practice Questions" },
  { id: "book-13", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Sally wants to find configuration files for a Windows system. Which of the following is not a common configuration file location?", options: ["The Windows Registry", "C:\\Program Files\\", "directory:\\Windows\\Temp", "C:\\ProgramData\\"], answer: 2, explanation: "The temporary files directory is not a common location for configuration files for programs. Instead, the Registry, ProgramData, and Program Data directories are commonly used to store configuration information." , source: "Sybex Practice Questions" },
  { id: "book-14", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "What type of factor is a PIN?", options: ["A location factor", "A biometric factor", "A possession factor", "A knowledge factor"], answer: 3, explanation: "A PIN is something you know and thus is a knowledge factor." , source: "Sybex Practice Questions" },
  { id: "book-15", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "What protocol is used to ensure that logs are time synchronized?", options: ["TTP", "NTP", "SAML", "FTP"], answer: 1, explanation: "NTP (Network Time Protocol) is the underlying protocol used to ensure that systems are using synchronized time." , source: "Sybex Practice Questions" },
  { id: "book-16", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "OAuth, OpenID, SAML, and AD FS are all examples of what type of technology?", options: ["Federation", "Multifactor authentication", "Identity vetting", "PKI"], answer: 0, explanation: "OAuth, OpenID, SAML, and AD FS are all examples of technologies used for federated identity. They aren’t MFA, identity vetting, or PKI technologies." , source: "Sybex Practice Questions" },
  { id: "book-17", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Example Corporation has split their network into network zones that include sales, HR, research and development, and guest networks, each separated from the others using network security devices. What concept is Example Corporation using for their network security?", options: ["Segmentation", "Software-defined networking", "Single-point-of-failure avoidance", "Zoned routing"], answer: 0, explanation: "Example Corporation is using segmentation, separating different risk or functional groupings. Software-defined networking is not mentioned, as no code-based changes or configurations are being made. There is nothing to indicate a single point of failure, and zoned routing was made up for this question—but the zone routing protocol is a network protocol used to maintain routes in a local network region." , source: "Sybex Practice Questions" },
  { id: "book-18", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "During a penetration test of Anna’s company, the penetration testers were able to compromise the company’s web servers and deleted their log files, preventing analysis of their attacks. What compensating control is best suited to prevent this issue in the future?", options: ["Using full-disk encryption", "Using log rotation", "Sending logs to a syslog server", "Using TLS to protect traffic"], answer: 2, explanation: "Sending logs to a remote log server or bastion host is an appropriate compensating control. This ensures that copies of the logs exist in a secure location, allowing them to be reviewed if a similar compromise occurred. Full-disk encryption leaves files decrypted while in use and would not secure the log files from a compromise, whereas log rotation simply means that logs get changed out when they hit a specific size or time frame. TLS encryption for data (including logs) in transit can keep it private and prevent modification but wouldn’t protect the logs from being deleted." , source: "Sybex Practice Questions" },
  { id: "book-19", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Ben is preparing a system hardening procedure for his organization. Which of the following is not a typical system hardening process or step?", options: ["Updating and patching systems", "Enabling additional services", "Enabling logging", "Configuration disk encryption"], answer: 1, explanation: "Ben knows that hardening processes typically focus on disabling unnecessary services, not enabling additional services. Updating, patching, enabling logging, and configuring security capabilities like disk encryption are all common hardening practices." , source: "Sybex Practice Questions" },
  { id: "book-20", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Gabby is designing a multifactor authentication system for her company. She has decided to use a passphrase, a time-based code generator, and a PIN to provide additional security. How many distinct factors will she have implemented when she is done?", options: ["One", "Two", "Three", "Four Malicious Activity"], answer: 1, explanation: "While it may seem like Gabby has implemented three different factors, both a PIN and a passphrase are knowledge-based factors and cannot be considered distinct factors. She has implemented two distinct factors with her design. If she wanted to add a third factor, she could replace either the password or the PIN with a fingerprint scan or other biometric factor." , source: "Sybex Practice Questions" },
  { id: "book-21", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "Which of the following Linux commands will show you how much disk space is in use?", options: ["top", "df", "lsof", "ps"], answer: 1, explanation: "The df command will show you a system’s current disk utilization. Both the top command and the ps command will show you information about processes, CPU, and memory utilization, whereas lsof is a multifunction tool for listing open files." , source: "Sybex Practice Questions" },
  { id: "book-22", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "What Windows tool provides detailed information, including information about USB host controllers, memory usage, and disk transfers?", options: ["Statmon", "Resmon", "Perfmon", "Winmon"], answer: 2, explanation: "Perfmon, or Performance Monitor, provides the ability to gather detailed usage statistics for many items in Windows. Resmon, or Resource Monitor, monitors CPU, memory, and disk usage but does not provide information about things like USB host controllers and other detailed instrumentation. Statmon and winmon are not Windows built-in tools." , source: "Sybex Practice Questions" },
  { id: "book-23", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "What type of network information should you capture to be able to provide a report about how much traffic systems in your network sent to remote systems?", options: ["Syslog data", "WMI data", "Resmon data", "Flow data"], answer: 3, explanation: "Flow data provides information about the source and destination IP address, protocol, and total data sent and would provide the detail needed. Syslog, WMI, and resmon data are all system log information and would not provide this information." , source: "Sybex Practice Questions" },
  { id: "book-24", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "Which of the following technologies is best suited to prevent wired rogue devices from connecting to a network?", options: ["NAC", "PRTG", "Port security", "NTP"], answer: 0, explanation: "Network access control (NAC) can be set up to require authentication. Port security is limited to recognizing MAC addresses, making it less suited to preventing rogue devices. PRTG is a monitoring tool, and NTP is the Network Time Protocol." , source: "Sybex Practice Questions" },
  { id: "book-25", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "As part of her job, Danielle sets an alarm to notify her team via email if her Windows server uses 80 percent of its memory and to send a text message if it reaches 90 percent utilization. What is this setting called?", options: ["A monitoring threshold", "A preset notification level", "Page monitoring", "Perfmon calibration"], answer: 0, explanation: "A monitoring threshold is set to determine when an alarm or report action is taken. Thresholds are often set to specific values or percentages of capacity." , source: "Sybex Practice Questions" },
  { id: "book-26", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "Chris is reviewing a file that is part of an exploit package. He notes that there is a file that has content with curly brackets ({}) around statements. What file type from the following list he most likely reviewing?", options: ["Plain text", "JSON", "XML", "HTML"], answer: 1, explanation: "Chris is most likely reviewing a JSON file. HTML and XML typically use angle brackets (< and >) rather than curly brackets. Plain text does not use or require either." , source: "Sybex Practice Questions" },
  { id: "book-27", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "What term describes a system sending heartbeat traffic to a botnet command-and-control server?", options: ["Beaconing", "Zombie ping", "CNCstatus", "CNClog"], answer: 0, explanation: "Beaconing activity (sometimes called heartbeat traffic) occurs when traffic is sent to a botnet command-and-control system. The other terms are made up." , source: "Sybex Practice Questions" },
  { id: "book-28", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "Cameron wants to check if a file matches a known-good original. What technique can he use to do so?", options: ["Decrypt both the file and the original to compare them.", "Use strings to compare the file content.", "Hash both the file and the original and compare the hashes.", "Check the file size and creation date."], answer: 2, explanation: "Cameron should compare the hashes of the known-good original and the new file to see if they match. The files are not described as encrypted, so decrypting them won’t help. Strings can show text in binary files but won’t compare the files. File size and creation date are not guarantees of a file being the same." , source: "Sybex Practice Questions" },
  { id: "book-29", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "What can the MAC address of a rogue device tell you?", options: ["Its operating system version", "The TTL of the device", "What type of rogue it is", "The manufacturer of the device"], answer: 3, explanation: "Hardware vendor ID codes are part of MAC addresses and can be checked for devices that have not had their MAC address changed. It is possible to change MAC addresses, so relying on only the MAC address is not recommended, but it can be useful to help identify what a rogue device might be." , source: "Sybex Practice Questions" },
  { id: "book-30", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "How can Jim most effectively locate a wireless rogue access point that is causing complaints from employees in his building?", options: ["Nmap", "Signal strength and triangulation", "Connecting to the rogue AP", "NAC"], answer: 1, explanation: "Locating a rogue AP is often best done by performing a physical survey and triangulating the likely location of the device by checking its signal strength. If the AP is plugged into the organization’s network, nmap may be able to find it, but connecting to it is unlikely to provide its location (or be safe!). NAC would help prevent the rogue device from connecting to an organizational network but won’t help locate it." , source: "Sybex Practice Questions" },
  { id: "book-31", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "Which of the following tools does not provide real-time drive capacity monitoring for Windows?", options: ["Microsoft Configuration Manager", "Resmon", "SCOM", "Perfmon"], answer: 0, explanation: "Microsoft Configuration Manager provides non-real-time reporting for disk space. Resmon, perfmon, and SCOM can all provide real-time reporting, which can help identify problems before they take a system down." , source: "Sybex Practice Questions" },
  { id: "book-32", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "One of the business managers in Geeta’s organization reports that she received an email with a link that appeared to be a link to the organization’s HR website, and that the website it went to when she clicked on it was very similar to the organization’s website. Fortunately, the manager noticed that the URL was different than usual. What technique best describes a link that is disguised to appear legitimate?", options: ["An obfuscated link", "A symbolic link", "A phishing link", "A decoy link"], answer: 0, explanation: "Obfuscated links take advantage of tricks, including using alternate encodings, typos, and long URLs that contain legitimate links wrapped in longer malicious links. Symbolic links are a pointer used by Linux operating systems to point to an actual file using a filename and link. Phishing links and decoy links are not common terms." , source: "Sybex Practice Questions" },
  { id: "book-33", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "Angela wants to review the syslog on a Linux system. What directory should she check to find it on most Linux distributions?", options: ["/home/log", "/var/log", "/log", "/var/syslog"], answer: 1, explanation: "The syslog file is found in /var/log on most Linux hosts." , source: "Sybex Practice Questions" },
  { id: "book-34", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "Laura wants to review headers in an email that one of her staff is suspicious of. What should she not have that person do if she wants to preserve the headers?", options: ["She shouldn’t have them print the email.", "She shouldn’t have them reply to the email.", "She shouldn’t have them forward the email to her.", "She shouldn’t have them download the email."], answer: 2, explanation: "Forwarding an email will remove the headers and replace them with new headers on the forwarded email—but not the original. Laura should use a “view headers” or “view original email” option if it exists to view and analyze the headers. Printing, replying, or downloading an email will not impact the headers." , source: "Sybex Practice Questions" },
  { id: "book-35", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "Which of the following is a key differentiator between a SIEM and a SOAR?", options: ["A SIEM does not provide a dashboard.", "A SOAR provides automated response capabilities.", "A SOAR does not provide log aggregation.", "A SIEM provides log analysis."], answer: 1, explanation: "SOAR tools focus on orchestration and response. SIEM tools typically do not focus on automated response. Both leverage log analysis and aggregation and will provide dashboards and reporting." , source: "Sybex Practice Questions" },
  { id: "book-36", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "Which of the following options is not a valid way to check the status of a service in Windows?", options: ["Use sc at the command line.", "Use service ––status at the command line.", "Use services.msc.", "Query service status using PowerShell."], answer: 1, explanation: "The service --status command is a Linux command. Windows service status can be queried using sc, the Services snap-in for the Microsoft Management Console (MMC), or via a PowerShell query." , source: "Sybex Practice Questions" },
  { id: "book-37", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "Avik has been asked to identify unexpected traffic on her organization’s network. Which of the following is not a technique she should use?", options: ["Protocol analysis", "Heuristics", "Baselining", "Beaconing"], answer: 3, explanation: "Protocol analysis, using heuristic (behavior)-based detection capabilities, and building a network traffic baseline are all common techniques used to identify unexpected network traffic. Beaconing occurs when a system contacts a botnet command-and-control (C&C) system, and it is likely to be a source of unexpected traffic." , source: "Sybex Practice Questions" },
  { id: "book-38", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "Sofia suspects that a system in her datacenter may be sending beaconing traffic to a remote system. Which of the following is not a useful tool to help verify her suspicions?", options: ["Flows", "A protocol analyzer", "SNMP", "An IDS or IPS"], answer: 2, explanation: "SNMP will not typically provide specific information about a system’s network traffic that would allow you to identify outbound connections. Flows, sniffers (protocol analyzers), and an IDS or IPS can all provide a view that would allow the suspect traffic to be captured." , source: "Sybex Practice Questions" },
  { id: "book-39", domain: "Security Operations", objectiveId: "1.2", topic: "Malicious Activity", question: "Susan wants to use an email security protocol to determine the authenticity of an email. Which of the following options will ensure that her organization’s email server can determine if it should accept email from a sender?", options: ["DMARC", "SPF", "DKIM", "POP3"], answer: 0, explanation: "DMARC (Domain-Based Message Authentication, Reporting, and Conformance) is a protocol that combines SPF and DKIM to prove that a sender is who they claim to be. DKIM validates that a domain is associated with a message, whereas SPF lists the servers that are authorized to send from your domain. POP3 is an email protocol but does not perform the function described." , source: "Sybex Practice Questions" },
  { id: "book-40", domain: "Security Operations", objectiveId: "1.3", topic: "Malicious Activity", question: "Juan wants to see a list of processes along with their CPU utilization in an interactive format. What built-in Linux tool should he use?", options: ["df", "top", "tail", "cpugrep Threat Intelligence"], answer: 1, explanation: "The top command in Linux provides an interactive interface to view CPU utilization, memory usage, and other details for running processes. df shows disk usage, tail displays the end of a file, and cpugrep is a made-up command." , source: "Sybex Practice Questions" },
  { id: "book-41", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Which of the following measures is not commonly used to assess threat intelligence?", options: ["Timeliness", "Detail", "Accuracy", "Relevance"], answer: 1, explanation: "While higher levels of detail can be useful, it isn’t a common measure used to assess threat intelligence. Instead, the timeliness, accuracy, and relevance of the information are considered critical to determining whether you should use the threat information." , source: "Sybex Practice Questions" },
  { id: "book-42", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Nandita has encountered an attacker who appears to be using a commonly available exploit package to attack her organization. The package seems to have been run with default configurations against her entire public-facing Internet presence from a single system. What type of threat actor is she most likely facing?", options: ["An APT", "A hacktivist", "A script kiddie", "A nation-state actor"], answer: 2, explanation: "The lack of complexity and nuance most likely indicates that she has discovered an attack by an unskilled attacker, sometimes called a “script kiddie”." , source: "Sybex Practice Questions" },
  { id: "book-43", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Which of the following activities follows threat data analysis in the threat intelligence cycle?", options: ["Gathering feedback", "Threat data collection", "Threat data review", "Threat intelligence dissemination"], answer: 3, explanation: "Threat intelligence dissemination or sharing typically follows threat data analysis. The goal is to get the threat data into the hands of the organizations and individuals who need it." , source: "Sybex Practice Questions" },
  { id: "book-44", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Susan wants to start performing intelligence gathering. Which of the following options is frequently conducted in the requirements gathering stage?", options: ["Review of security breaches or compromises your organization has faced", "Review of current vulnerability scans", "Review of current data handling standards", "Review of threat intelligence feeds for new threats"], answer: 0, explanation: "Understanding what your organization needs is important for the requirements gathering phase of the intelligence cycle. Reviewing recent breaches and compromises can help to define what threats you are currently facing. Current vulnerability scans can identify where you may be vulnerable but are less useful for threat identification. Data handling standards do not provide threat information, and intelligence feed reviews list new threats, but those are useful only if you know what type of threats you’re likely to face so that you can determine which ones you should target." , source: "Sybex Practice Questions" },
  { id: "book-45", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "What organizations did the U.S. government help create to help share knowledge between organizations in specific verticals?", options: ["DHS", "SANS", "CERTs", "ISACs"], answer: 3, explanation: "The U.S. government created the information sharing and analysis centers (ISACs). ISACs help infrastructure owners and operators share threat information, as well as provide tools and assistance to their members." , source: "Sybex Practice Questions" },
  { id: "book-46", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Which of the following threat actors typically has the greatest access to resources?", options: ["Nation-state actors", "Organized crime", "Hacktivists", "Insider threats"], answer: 0, explanation: "Nation-state actors are government sponsored and typically have the greatest access to resources, including tools, money, and talent." , source: "Sybex Practice Questions" },
  { id: "book-47", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Organizations like Anonymous, which target governments and businesses for political reasons, are examples of what type of threat actor?", options: ["Hacktivists", "Military assets", "Nation-state actors", "Organized crime"], answer: 0, explanation: "Hacktivists execute attacks for political reasons, including those against governments and businesses. The key element in this question is the political reasons behind the attack." , source: "Sybex Practice Questions" },
  { id: "book-48", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Jason gathers threat intelligence that tells him that an adversary his organization considers a threat likes to use USB key drops to compromise their targets. What is this an example of?", options: ["His organization’s attack surface", "A possible attack vector", "An example of adversary capability", "A probability assessment"], answer: 1, explanation: "Attack vectors, or the means by which an attacker can gain access to their target, can include things like USB key drops. You may be tempted to answer this question with adversary capability, but remember the definition: the resources, intent, or ability of the likely threat actor. Capability here doesn’t mean what they can do but their ability to do so. The attack surface might include the organization’s parking lot in this example, but this is not an example of an attack surface, and there was no probability assessment included in this problem." , source: "Sybex Practice Questions" },
  { id: "book-49", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "What type of assessment is particularly useful for identifying insider threats?", options: ["Behavioral", "Instinctual", "Habitual", "IOCs"], answer: 0, explanation: "Behavioral assessments are very useful when you are attempting to identify insider threats. Since insider threats are often hard to distinguish from normal behavior context of the actions performed, such as after-hours logins, misuse of credentials, and logins from abnormal locations or in abnormal patterns, other behavioral indicators are often used." , source: "Sybex Practice Questions" },
  { id: "book-50", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Felix want to gather threat intelligence about an organized crime threat actor. Where is he most likely to find information published by the threat actor ?", options: ["Social media", "Blogs", "Government bulletins", "The dark web"], answer: 3, explanation: "Threat actors like criminal organizations frequently operate via the dark web. Forums operate as clearinghouses for information, resources, and access via TOR-hosted sites. While social media, blogs, or government bulletins may provide information about a criminal organization, more likely to publish information themselves on the dark web." , source: "Sybex Practice Questions" },
  { id: "book-51", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Which of the following is not a common indicator of compromise?", options: ["Administrative account logins", "Unexpected modifications of configuration files", "Login activity from atypical countries or locations", "Large outbound data transfers from administrative systems"], answer: 0, explanation: "Administrative logins themselves are not IOCs, but unexpected behavior associated with them or other atypical behavior is an indicator of compromise. Unexpected modifications of configuration files, login activity from atypical countries or locations, and large file transfers from administrative systems are all common indicators of compromise." , source: "Sybex Practice Questions" },
  { id: "book-52", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Nick wants to analyze attacker tactics and techniques. What type of tool can he deploy to most effectively capture actual attack data for analysis?", options: ["A firewall", "A honeypot", "A web application firewall", "A SIEM"], answer: 1, explanation: "Nick should deploy a honeypot to capture attack tools and techniques for further analysis. Firewalls block traffic. A web application firewall is a firewall designed to protect web applications, and while it may capture useful information it is not as well suited to this purpose. A SIEM, or security information and event management tool, may also capture relevant attack data but it’s not specifically designed for the purpose like a honeypot is." , source: "Sybex Practice Questions" },
  { id: "book-53", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Which of the following is not a common focus area for threat hunting activities?", options: ["Policies", "Misconfigurations", "Isolated networks", "Business-critical assets"], answer: 0, explanation: "Threat hunters are less likely to look at policies. Instead, configurations and misconfigurations, isolated networks, and business-critical assets are all common focuses of threat hunters." , source: "Sybex Practice Questions" },
  { id: "book-54", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "What term describes an analysis of threat information that might include details such as whether it is confirmed by multiple independent sources or has been directly confirmed?", options: ["Threat quality level", "STIX level", "Confidence level", "Assurance level"], answer: 2, explanation: "The confidence level of your threat information is how certain you are of the information. A high confidence threat assessment will typically be confirmed either by multiple independent and reliable sources or via direct verification." , source: "Sybex Practice Questions" },
  { id: "book-55", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "What drove the creation of ISACs in the United States?", options: ["Threat information sharing for infrastructure owners", "The Cybersecurity Act of 1994", "Threat information collection network providers", "The 1998 ISAC Act"], answer: 0, explanation: "ISACs were introduced in 1998 as part of a presidential directive, and they focus on threat information sharing and analysis for critical infrastructure owners." , source: "Sybex Practice Questions" },
  { id: "book-56", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "How is threat intelligence sharing most frequently used for vulnerability management?", options: ["To identify zero-day threats before they are released", "As part of vulnerability feeds for scanning systems", "As part of patch management processes to determine which patches are not installed", "To perform quantitative risk assessment"], answer: 1, explanation: "Threat intelligence feeds often provide information about what vulnerabilities are being actively exploited as well as about new exploits. This can influence patching priorities and vulnerability management efforts. Zero-day threats aren’t known until they are released. Vulnerability management efforts help to determine what patches aren’t installed, but threat intelligence doesn’t determine that. Threat intelligence isn’t directly leveraged for quantitative risk assessment as part of vulnerability management efforts in typical organizations." , source: "Sybex Practice Questions" },
  { id: "book-57", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "OpenIOC uses a base set of indicators of compromise originally created and provided by which security company?", options: ["Mandiant", "McAfee", "CrowdStrike", "Cisco"], answer: 0, explanation: "The threat indicators built into OpenIOC are based on Mandiant’s indicator list. You can extend and include additional indicators of compromise beyond the 500 built-in definitions." , source: "Sybex Practice Questions" },
  { id: "book-58", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Advanced persistent threats are most commonly associated with which type of threat actor?", options: ["Insider threats", "Nation-state actors", "Organized crime", "Hacktivists"], answer: 1, explanation: "Advanced persistent threats (APTs) are most commonly associated with nation-state actors. The complexity of their operations and the advanced tools that they bring typically require significant resources to leverage fully." , source: "Sybex Practice Questions" },
  { id: "book-59", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "What are the two types of insider threats?", options: ["Attack and defense", "Approved and prohibited", "Real and imagined", "Intentional and unintentional"], answer: 3, explanation: "Insider threats may be intentional or unintentional." , source: "Sybex Practice Questions" },
  { id: "book-60", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence", question: "Forensic data is most often used for what type of threat assessment data?", options: ["STIX", "Behavioral", "IOCs", "TAXII Reconnaissance and Intelligence Gathering"], answer: 2, explanation: "Forensic data is very helpful when defining indicators of compromise (IOCs). Behavioral threat assessments can also be partially defined by forensic data, but the key here is where the data is most frequently used." , source: "Sybex Practice Questions" },
  { id: "book-61", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Megan wants to use the Metasploit Framework to conduct a web application vulnerability scan. What module from the following list is best suited to her needs?", options: ["smb_login", "Angry IP", "nmap", "wmap"], answer: 3, explanation: "The wmap scanner is a web application scanner module for the Metasploit Framework that can scan for vulnerable web applications. The smb_login tool looks for SMB shares, not web applications. Angry IP Scanner is not integrated with Metasploit, and nmap is a port scanner, not a full web application vulnerability scanner." , source: "Sybex Practice Questions" },
  { id: "book-62", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "What flag does nmap use to enable operating system identification?", options: ["–os", "–id", "–O", "–osscan"], answer: 2, explanation: "Nmap’s operating system identification flag is –O and it enables OS detection. –A also enables OS identification and other features. –osscan with modifiers like –limit and –guess set specific OS identification features. –os and –id are not nmap flags." , source: "Sybex Practice Questions" },
  { id: "book-63", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "What command-line tool can be used to determine the path that traffic takes to a remote system?", options: ["Whois", "traceroute", "nslookup", "routeview"], answer: 1, explanation: "Traceroute (or tracert on Windows systems) is a command-line tool that uses ICMP to trace the route that a packet takes to a host. Whois and nslookup are domain tools, and routeview is not a command-line tool." , source: "Sybex Practice Questions" },
  { id: "book-64", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Valerie wants to use a graphical interface to control nmap and wants to display her scans as a visual map to help her understand her target networks. What tool from the following list should she use?", options: ["Angry IP Scanner", "wmap", "Zenmap", "nmap-gs"], answer: 2, explanation: "Zenmap is a graphical user interface for nmap that also supports graphical output, including visual maps of networks. Valerie can use Zenmap to control nmap and create the output she wants. Angry IP Scanner is a separate scanner and does not generate a visual map of networks—instead, it provides lists. Wmap is a plug-in for the Metasploit Framework and a stand-alone tool that is a web application and service vulnerability testing tool, and nmapgs was made up for this question." , source: "Sybex Practice Questions" },
  { id: "book-65", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Susan runs an nmap scan using the following command: nmap -O -Pn 192.168.1.0/255 What information will she see about the hosts she scans?", options: ["The hostname and service ports", "The hostname, service ports, and operating system", "The hostname and operating system", "The hostname, uptime, and logged-in user"], answer: 1, explanation: "Along with the time to run the scan and time to live of packets sent, Susan will see the hostname, service ports, and operating system using the scan flags above. The -O flag attempts to identify the operating system, while the -Pn flag skips pinging and scans all hosts in the network on their typically scanned ports." , source: "Sybex Practice Questions" },
  { id: "book-66", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Tuan wants to gather additional information about a domain that he has entered in Maltego. What functionality is used to perform server-based actions in Maltego?", options: ["A worker", "A query", "A transform", "A scan"], answer: 2, explanation: "Maltego calls its server-based functions for information gathering “transforms.”" , source: "Sybex Practice Questions" },
  { id: "book-67", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Laura wants to conduct a search for hosts using Recon-ng but wants to leverage a search engine with API access to acquire existing data. What module should she use?", options: ["recon/companies-multi/whois_miner", "import/nmap", "recon/domains-hosts/shodan_hostname", "import/list"], answer: 2, explanation: "While you may not know the full list of Recon-ng plug-ins, Shodan is a well-known search engine. Laura could leverage API access to Shodan to gather information from previously performed searches. Both the import utilities will require her to have data she has already gathered, and the Whois miner can be assumed to use Whois information rather than an existing search engine dataset." , source: "Sybex Practice Questions" },
  { id: "book-68", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "After running an nmap scan, Geoff sees ports 80 and 443 open on a system he scanned. What reasonable guess can he make about the system based on this result?", options: ["The system is a Windows system.", "The system is running a database server.", "The system is a Linux system.", "The system is running a web server."], answer: 3, explanation: "Ports 80 and 443 are commonly associated with unencrypted (port 80) and TLS encrypted (port 443) web servers. There is not enough information to determine if this might be a Windows or Linux system, and these are not typical ports for a database server." , source: "Sybex Practice Questions" },
  { id: "book-69", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "What information is used to identify network segments and topology when conducting an nmap scan?", options: ["IP addresses", "Hostnames", "Time to live", "Port numbers"], answer: 2, explanation: "The time to live (TTL) provided as part of responses is used to evaluate the number of hops in a network, and thus to derive a best guess at network topology. While IP addresses can sometimes be related to network topology, they’re less likely to be directly associated with it. Hostnames and port numbers have no correlation to topology." , source: "Sybex Practice Questions" },
  { id: "book-70", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Murali wants to scan a network using nmap and has run a scan without any flags without discovering all of the hosts that he thinks should show. What scan flag can he use to scan without performing host discovery that will also determine if services are open on the systems?", options: ["-sn", "-PS", "-Pn", "-sL"], answer: 2, explanation: "The -Pn, or “no ping”, flag skips host discovery and performs a port scan. The -sn flag skips the port scan after discovery, sL lists hosts by performing DNS lookups, and -PS performs probes using a TCP SYN." , source: "Sybex Practice Questions" },
  { id: "book-71", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Jaime is using the Angry IP Scanner and notices that it supports multiple types of pings to identify hosts. Why might she choose to use a specific type of ping over others?", options: ["To bypass firewalls", "To allow better vulnerability detection", "To prevent the scan from being flagged by DDoS protection tools", "To leverage the faster speed of TCP pings over UDP pings"], answer: 0, explanation: "Some firewalls block ICMP ping but allow UDP or TCP pings. Jaime knows that choosing her ping protocol can help to bypass some firewalls. Angry IP Scanner is not a vulnerability scanner, and UDP pings are faster than TCP pings." , source: "Sybex Practice Questions" },
  { id: "book-72", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Hue wants to perform network footprinting as part of a reconnaissance effort. Which of the following tools is best suited to passive footprinting given a domain name as the starting point for her efforts?", options: ["Traceroute", "Maltego", "Nmap", "Angry IP Scanner"], answer: 1, explanation: "Hue knows that Maltego provides transforms that can identify hosts and IP addresses related to a domain and that it can then gather additional information using other OSINT transforms. Nmap and Angry IP Scanner are both active scanning tools, and traceroute won’t provide useful footprinting information given just a domain name." , source: "Sybex Practice Questions" },
  { id: "book-73", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Jack wants to scan a system using the Angry IP Scanner. What information does he need to run the scan?", options: ["The system’s IP address", "The system’s Whois data", "The system’s MAC address", "The system administrator’s username and password"], answer: 0, explanation: "To conduct a port scan, all Jack needs is an IP address, hostname, or IP range." , source: "Sybex Practice Questions" },
  { id: "book-74", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Which of the following is not a reason that security professionals often perform packet capture while conducting port and vulnerability scanning?", options: ["Work process documentation", "To capture additional data for analysis", "To prevent external attacks", "To provide a timeline"], answer: 2, explanation: "A packet capture can’t prevent external attacks, although it might capture evidence of one. Packet capture is often used to document work, including the time that a given scan or process occurred, and it can also be used to provide additional data for further analysis." , source: "Sybex Practice Questions" },
  { id: "book-75", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "What process uses information such as the way that a system’s TCP stack responds to queries, what TCP options it supports, and the initial window size it uses?", options: ["Service identification", "Fuzzing", "Application scanning", "OS detection"], answer: 3, explanation: "Operating system detection often uses TCP options support, IP ID sampling, and window size checks, as well as other indicators that create unique fingerprints for various operating systems. Service identification often leverages banners since TCP capabilities are not unique to a given service. Fuzzing is a code testing method, and application scanning is usually related to web application security." , source: "Sybex Practice Questions" },
  { id: "book-76", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Li wants to use Recon-ng to gather data from systems. Which of the following is not a common use for Recon-ng?", options: ["Conducting vulnerability scans of services", "Looking for sensitive files", "Conducting OSINT gathering of Whois, DNS, and similar data", "Finding target IP addresses"], answer: 0, explanation: "Recon-ng is not a vulnerability scanner. It does help with OSINT activities like looking for sensitive files, conducting OSINT information gathering, and finding target IP addresses. Li knows that Recong-ng is an OSINT-focused tool and that vulnerability scanning is an active, rather than passive, information-gathering effort. While Recon-ng supports port scanning, it does not have a vulnerability scanner function." , source: "Sybex Practice Questions" },
  { id: "book-77", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Jason wants to conduct a port scan using the Metasploit Framework. What tool can he use from the framework to do this?", options: ["Angry IP Scanner", "Recon-ng", "Maltego", "Nmap"], answer: 3, explanation: "Nmap support is built into MSF, allowing easy port scanning by simply calling nmap as you would normally from the command line. Angry IP Scanner is not built in, and both Recon-ng and Maltego are separate tools with OSINT and information management capabilities." , source: "Sybex Practice Questions" },
  { id: "book-78", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Sally wants to use operating system identification using nmap to determine what OS a device is running. Which of the following is not a datapoint used by nmap to identify operating systems?", options: ["TCP sequences", "TCP timestamps", "TCP OS header", "TCP options"], answer: 2, explanation: "Operating system fingerprinting relies in many cases on knowing what the TCP stack for a given operating system does when it sends responses. You can read more detail about the many ways nmap tests for and filters the data at https://nmap.org/book/ osdetect-methods.html#osdetect-probes. Sally knows that banners are provided at interactive logins or by services and that nmap uses network protocol data for OS detection." , source: "Sybex Practice Questions" },
  { id: "book-79", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Chris wants to perform network-based asset discovery. What limitation will he encounter if he relies on a port scanner to perform his discovery?", options: ["Port scanners cannot detect vulnerabilities.", "Port scanners cannot determine what services are running on a given port.", "Firewalls can prevent port scanners from detecting systems.", "A port scanner can create a denial-of-service condition for many modern systems."], answer: 2, explanation: "Firewalls can prevent responses to port scanners, making systems essentially invisible to the scanner. A port scanner alone is not sufficient for asset discovery in many networks. Port scanners often have some limited vulnerability detection built in, often relying on version information or fingerprinting, but not detecting vulnerabilities does not prevent discovery. Port scanners make a best guess at services on a port based on information provided by the service. Port scanners do not typically cause problems for most modern applications and services but can under some circumstances. This shouldn’t stop a discovery port scan, though!" , source: "Sybex Practice Questions" },
  { id: "book-80", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Reconnaissance and Intelligence Gathering", question: "Emily wants to gather open source intelligence and centralize it using an open source tool. Which of the following tools is best suited to managing the collection of data for her OSINT efforts?", options: ["The Metasploit Framework", "Recon-ng", "nmap", "Angry IP Scanner DOMAIN II Vulnerability Management Designing a Vulnerability Management Program"], answer: 1, explanation: "Recon-ng is a Python-based open source framework for open source intelligence gathering and web-based reconnaissance. The Metasploit Framework is a penetration testing and compromise tool with a multitude of other features, but it is not as well suited to information gathering as a core purpose. Nmap and the Angry IP Scanner are both port scanners." , source: "Sybex Practice Questions" },
  { id: "book-81", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "What federal law requires the use of vulnerability scanning on information systems operated by federal government agencies?", options: ["HIPAA", "GLBA", "FISMA", "FERPA"], answer: 2, explanation: "The Federal Information Security Management Act (FISMA) requires that federal agencies implement vulnerability management programs for federal information systems. The Health Insurance Portability and Accountability Act (HIPAA) regulates the ways that healthcare providers, insurance companies, and their business associates handle protected health (PHI) information. Similarly, the Gramm–Leach–Bliley Act (GLBA) governs how financial institutions handle customer financial records. The Family Educational Rights and Privacy Act (FERPA), which is not covered in this chapter or on the CySA+ exam, allows parents to access their children’s educational records." , source: "Sybex Practice Questions" },
  { id: "book-82", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Which one of the following industry standards describes a standard approach for setting up an information security management system?", options: ["OWASP", "CIS", "ISO 27002", "ISO 27001"], answer: 3, explanation: "ISO 27001 describes a standard approach for setting up an information security management system, while ISO 27002 goes into more detail on the specifics of information security controls. The Open Web Application Security Project (OWASP) provides advice and tools focused on web application security. The Center for Internet Security (CIS) produces a set of configuration benchmarks used to securely configure operating systems, applications, and devices." , source: "Sybex Practice Questions" },
  { id: "book-83", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "What tool can administrators use to help identify the systems present on a network prior to conducting vulnerability scans?", options: ["Asset inventory", "Web application assessment", "Router", "DLP"], answer: 0, explanation: "An asset inventory supplements automated tools with other information to detect systems present on a network. The asset inventory provides critical information for vulnerability scans." , source: "Sybex Practice Questions" },
  { id: "book-84", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Tonya is configuring vulnerability scans for a system that is subject to the PCI DSS compliance standard. What is the minimum frequency with which she must conduct scans?", options: ["Daily", "Weekly", "Monthly", "Quarterly"], answer: 3, explanation: "PCI DSS requires that organizations conduct vulnerability scans on at least a quarterly basis, although many organizations choose to conduct scans on a much more frequent basis." , source: "Sybex Practice Questions" },
  { id: "book-85", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Which one of the following is not an example of a vulnerability scanning tool?", options: ["Nikto", "Snort", "Nessus", "OpenVAS"], answer: 1, explanation: "Nessus and OpenVAS are network vulnerability scanning tools, while Nikto is a web application vulnerability scanner. Snort is an intrusion detection system." , source: "Sybex Practice Questions" },
  { id: "book-86", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Bethany is the vulnerability management specialist for a large retail organization. She completed her last PCI DSS compliance scan in March. In April, the organization upgraded their point-of-sale system, and Bethany is preparing to conduct new scans. When must she complete the new scan?", options: ["Immediately.", "June.", "December.", "No scans are required."], answer: 0, explanation: "PCI DSS requires that organizations conduct vulnerability scans quarterly, which would have Bethany’s next regularly scheduled scan scheduled for June. However, the standard also requires scanning after any significant change in the payment card environment. This would include an upgrade to the point-of-sale system, so Bethany must complete a new compliance scan immediately." , source: "Sybex Practice Questions" },
  { id: "book-87", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Renee is configuring her vulnerability management solution to perform credentialed scans of servers on her network. What type of account should she provide to the scanner?", options: ["Domain administrator", "Local administrator", "Root", "Read-only"], answer: 3, explanation: "Credentialed scans only require read-only access to target servers. Renee should follow the principle of least privilege and limit the access available to the scanner." , source: "Sybex Practice Questions" },
  { id: "book-88", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Jason is writing a report about a potential security vulnerability in a software product and wishes to use standardized product names to ensure that other security analysts understand the report. Which SCAP component can Jason turn to for assistance?", options: ["CVSS", "CVE", "CPE", "OVAL"], answer: 2, explanation: "Common Platform Enumeration (CPE) is an SCAP component that provides standardized nomenclature for product names and versions." , source: "Sybex Practice Questions" },
  { id: "book-89", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Bill would like to run an internal vulnerability scan on a system for PCI DSS compliance purposes. Who is authorized to complete one of these scans?", options: ["Any employee of the organization", "An approved scanning vendor", "A PCI DSS service provider", "Any qualified individual"], answer: 3, explanation: "Internal scans completed for PCI DSS compliance purposes may be conducted by any qualified individual." , source: "Sybex Practice Questions" },
  { id: "book-90", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Which type of organization is the most likely to face a regulatory requirement to conduct vulnerability scans?", options: ["Bank", "Hospital", "Government agency", "Doctor’s office"], answer: 2, explanation: "The Federal Information Security Management Act (FISMA) requires that government agencies conduct vulnerability scans. HIPAA, which governs hospitals and doctors’ offices, does not include a vulnerability scanning requirement, nor does GLBA, which covers financial institutions. Banks may be required to conduct scans under PCI DSS, but this is a contractual obligation and not a statutory requirement." , source: "Sybex Practice Questions" },
  { id: "book-91", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Which one of the following organizations focuses on providing tools and advice for secure web application development?", options: ["OWASP", "CIS", "NIST", "Microsoft"], answer: 0, explanation: "All of these organizations provide security tools and advice. However, only the Open Web Application Security Project (OWASP) has a dedicated focus on the development of secure web applications." , source: "Sybex Practice Questions" },
  { id: "book-92", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "What term describes an organization’s willingness to tolerate risk in their computing environment?", options: ["Risk landscape", "Risk appetite", "Risk level", "Risk adaptation"], answer: 1, explanation: "The organization’s risk appetite is its willingness to tolerate risk within the environment. If an organization is extremely risk-averse, it may choose to conduct scans more frequently to minimize the amount of time between when a vulnerability comes into existence and when it is detected by a scan." , source: "Sybex Practice Questions" },
  { id: "book-93", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Which one of the following factors is least likely to impact vulnerability scanning schedules?", options: ["Regulatory requirements", "Technical constraints", "Business constraints", "Staff availability"], answer: 3, explanation: "Scan schedules are most often determined by the organization’s risk appetite, regulatory requirements, technical constraints, business constraints, and licensing limitations. Most scans are automated and do not require staff availability." , source: "Sybex Practice Questions" },
  { id: "book-94", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Barry placed all of his organization’s credit card processing systems on an isolated network dedicated to card processing. He has implemented appropriate segmentation controls to limit the scope of PCI DSS to those systems through the use of VLANs and firewalls. When Barry goes to conduct vulnerability scans for PCI DSS compliance purposes, what systems must he scan?", options: ["Customer systems", "Systems on the isolated network", "Systems on the general enterprise network", "Both B and C"], answer: 1, explanation: "If Barry is able to limit the scope of his PCI DSS compliance efforts to the isolated network, then that is the only network that must be scanned for PCI DSS compliance purposes." , source: "Sybex Practice Questions" },
  { id: "book-95", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Ryan is planning to conduct a vulnerability scan of a business-critical system using dangerous plug-ins. What would be the best approach for the initial scan?", options: ["Run the scan against production systems to achieve the most realistic results possible.", "Run the scan during business hours.", "Run the scan in a test environment.", "Do not run the scan to avoid disrupting the business."], answer: 2, explanation: "Ryan should first run his scan against a test environment to identify likely vulnerabilities and assess whether the scan itself might disrupt business activities." , source: "Sybex Practice Questions" },
  { id: "book-96", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Which one of the following activities is not part of the vulnerability management life cycle?", options: ["Detection", "Remediation", "Reporting", "Testing"], answer: 2, explanation: "Although reporting and communication are an important part of vulnerability management, they are not included in the life cycle. The three life-cycle phases are detection, remediation, and testing." , source: "Sybex Practice Questions" },
  { id: "book-97", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "What approach to vulnerability scanning incorporates information from agents running on the target servers?", options: ["Continuous monitoring", "Ongoing scanning", "On-demand scanning", "Alerting"], answer: 0, explanation: "Continuous monitoring incorporates data from agent-based approaches to vulnerability detection and reports security-related configuration changes to the vulnerability management platform as soon as they occur, providing the ability to analyze those changes for potential vulnerabilities." , source: "Sybex Practice Questions" },
  { id: "book-98", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Kolin would like to use an automated web application vulnerability scanner to identify any potential security issues in an application that is about to be deployed in his environment. Which one of the following tools is least likely to meet his needs?", options: ["ZAP", "Nikto", "Arachni", "Burp Suite"], answer: 0, explanation: "The Zed Attack Proxy (ZAP) is a proxy server that may be used in web application penetration tests but it is not itself an automated vulnerability scanning tool. Nikto and Arachni are examples of dedicated web application vulnerability scanners. Burp Suite is a web proxy used in penetration testing." , source: "Sybex Practice Questions" },
  { id: "book-99", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Jessica is reading reports from vulnerability scans run by different part of her organization using different products. She is responsible for assigning remediation resources and is having difficulty prioritizing issues from different sources. What SCAP component can help Jessica with this task?", options: ["CVSS", "CVE", "CPE", "XCCDF"], answer: 0, explanation: "The Common Vulnerability Scoring System (CVSS) provides a standardized approach for measuring and describing the severity of security vulnerabilities. Jessica could use this scoring system to prioritize issues raised by different source systems." , source: "Sybex Practice Questions" },
  { id: "book-100", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "Sarah would like to run an external vulnerability scan on a system for PCI DSS compliance purposes. Who is authorized to complete one of these scans?", options: ["Any employee of the organization", "An approved scanning vendor", "A PCI DSS service provider", "Any qualified individual Analyzing Vulnerability Scans"], answer: 1, explanation: "While any qualified individual may conduct internal compliance scans, PCI DSS requires the use of a scanning vendor approved by the PCI SSC for external compliance scans." , source: "Sybex Practice Questions" },
  { id: "book-101", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Tom is reviewing a vulnerability scan report and finds that one of the servers on his network suffers from an internal IP address disclosure vulnerability. What technology is likely in use on this network that resulted in this vulnerability?", options: ["TLS", "NAT", "SSH", "VPN"], answer: 1, explanation: "Although the network can support any of these protocols, internal IP disclosure vulnerabilities occur when a network uses Network Address Translation (NAT) to map public and private IP addresses but a server inadvertently discloses its private IP address to remote systems." , source: "Sybex Practice Questions" },
  { id: "book-102", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Which one of the CVSS metrics would contain information about the type of account access that an attacker must have to execute an attack?", options: ["AV", "C", "PR", "AC"], answer: 2, explanation: "The privileges required (PR) metric indicates the type of account access the attacker must have." , source: "Sybex Practice Questions" },
  { id: "book-103", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Which one of the following values for the CVSS attack complexity metric would indicate that the specified attack is simplest to exploit?", options: ["High", "Medium", "Low", "Severe"], answer: 2, explanation: "An attack complexity of “low” indicates that exploiting the vulnerability does not require any specialized conditions." , source: "Sybex Practice Questions" },
  { id: "book-104", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Which one of the following values for the confidentiality, integrity, or availability CVSS metric would indicate the potential for total compromise of a system?", options: ["N", "L", "M", "H"], answer: 3, explanation: "A value of High (H) for an impact metric indicates the potential for complete loss of confidentiality, integrity, and/or availability." , source: "Sybex Practice Questions" },
  { id: "book-105", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "What is the most recent version of CVSS that is currently available?", options: ["2.0", "2.5", "3.1", "3.2"], answer: 2, explanation: "CVSS 3.1 is the most recent version of the standard as of the time this book was published in 2023." , source: "Sybex Practice Questions" },
  { id: "book-106", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Which one of the following metrics is not included in the calculation of the CVSS exploitability score?", options: ["Attack vector", "Vulnerability age", "Attack complexity", "Privileges required"], answer: 1, explanation: "The CVSS exploitability score is computed using the attack vector (AV), attack complexity (AC), privileges required (PR), and user interaction (UI) metrics. Vulnerability age is not an included metric." , source: "Sybex Practice Questions" },
  { id: "book-107", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Kevin recently identified a new software vulnerability and computed its CVSS base score as 6.5. Which risk category would this vulnerability fall into?", options: ["Low", "Medium", "High", "Critical"], answer: 1, explanation: "Vulnerabilities with CVSS base scores between 4.0 and 6.9 fit into the medium risk category." , source: "Sybex Practice Questions" },
  { id: "book-108", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Tara recently analyzed the results of a vulnerability scan report and found that a vulnerability reported by the scanner did not exist because the system was actually patched as specified. What type of error occurred?", options: ["False positive", "False negative", "True positive", "True negative"], answer: 0, explanation: "A false positive error occurs when the vulnerability scanner reports a vulnerability that does not actually exist." , source: "Sybex Practice Questions" },
  { id: "book-109", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Which one of the following is not a common source of information that may be correlated with vulnerability scan results?", options: ["Logs", "Database tables", "SIEM", "Configuration management system"], answer: 1, explanation: "It is unlikely that a database table would contain information relevant to assessing a vulnerability scan report. Logs, SIEM reports, and configuration management systems are much more likely to contain relevant information." , source: "Sybex Practice Questions" },
  { id: "book-110", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Which one of the following operating systems should be avoided on production networks?", options: ["Windows Server 2008 R2", "Red Hat Enterprise Linux 9", "Debian Linux 11", "Ubuntu 22"], answer: 0, explanation: "Microsoft discontinued support for Windows Server 2008 R2 in 2020, and it is highly likely that the operating system contains unpatchable vulnerabilities." , source: "Sybex Practice Questions" },
  { id: "book-111", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "In what type of attack does the attacker place more information in a memory location than is allocated for that use?", options: ["SQL injection", "LDAP injection", "Cross-site scripting", "Buffer overflow"], answer: 3, explanation: "Buffer overflow attacks occur when an attacker manipulates a program into placing more data into an area of memory than is allocated for that program’s use. The goal is to overwrite other information in memory with instructions that may be executed by a different process running on the system." , source: "Sybex Practice Questions" },
  { id: "book-112", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "The Dirty COW attack is an example of what type of vulnerability?", options: ["Malicious code", "Privilege escalation", "Buffer overflow", "LDAP injection"], answer: 1, explanation: "In October 2016, security researchers announced the discovery of a Linux kernel vulnerability dubbed Dirty COW. This vulnerability, present in the Linux kernel for nine years, was extremely easy to exploit and provided successful attackers with administrative control of affected systems." , source: "Sybex Practice Questions" },
  { id: "book-113", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Which one of the following protocols should never be used on a public network?", options: ["SSH", "HTTPS", "SFTP", "Telnet"], answer: 3, explanation: "Telnet is an insecure protocol that does not make use of encryption. The other protocols mentioned are all considered secure." , source: "Sybex Practice Questions" },
  { id: "book-114", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Betty is selecting a transport encryption protocol for use in a new public website she is creating. Which protocol would be the best choice?", options: ["SSL 2.0", "SSL 3.0", "TLS 1.0", "TLS 1.3"], answer: 3, explanation: "TLS 1.3 is a secure transport protocol that supports web traffic. The other protocols listed all have flaws that render them insecure and unsuitable for use." , source: "Sybex Practice Questions" },
  { id: "book-115", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Which one of the following conditions would not result in a certificate warning during a vulnerability scan of a web server?", options: ["Use of an untrusted CA", "Inclusion of a public encryption key", "Expiration of the certificate", "Mismatch in certificate name"], answer: 1, explanation: "Digital certificates are intended to provide public encryption keys, and this would not cause an error. The other circumstances are all causes for concern and would trigger an alert during a vulnerability scan." , source: "Sybex Practice Questions" },
  { id: "book-116", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "What type of attack depends on the fact that users are often logged into many websites simultaneously in the same browser?", options: ["SQL injection", "Cross-site scripting", "Cross-site request forgery", "File inclusion"], answer: 2, explanation: "XSRF attacks work by making the reasonable assumption that users are often logged into many different websites at the same time. Attackers then embed code in one website that sends a command to a second website." , source: "Sybex Practice Questions" },
  { id: "book-117", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Bonnie discovers entries in a web server log indicating that penetration testers attempted to access the following URL: www.mycompany.com/sortusers.php?file=C:\\uploads\\attack.exe What type of attack did they most likely attempt?", options: ["Reflected XSS", "Persistent XSS", "Local file inclusion", "Remote file inclusion"], answer: 2, explanation: "This URL contains the address of a local file passed to a web application as an argument. It is most likely a local file inclusion (LFI) exploit, attempting to execute a malicious file that the testers previously uploaded to the server." , source: "Sybex Practice Questions" },
  { id: "book-118", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Which one of the following terms is not typically used to describe the connection of physical devices to a network?", options: ["IoT", "IDS", "SCADA", "ICS"], answer: 1, explanation: "Intrusion detection systems (IDSs) are a security control used to detect network or host attacks. The Internet of Things (IoT), supervisory control and data acquisition (SCADA) systems, and industrial control systems (ICSs) are all associated with connecting physical world objects to a network." , source: "Sybex Practice Questions" },
  { id: "book-119", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "Monica discovers that an attacker posted a message in a web forum that she manages that is attacking users who visit the site. Which one of the following attack types is most likely to have occurred?", options: ["SQL injection", "Malware injection", "LDAP injection", "Cross-site scripting"], answer: 3, explanation: "In a cross-site scripting (XSS) attack, an attacker embeds scripting commands on a website that will later be executed by an unsuspecting visitor accessing the site. The idea is to trick a user visiting a trusted site into executing malicious code placed there by an untrusted third party." , source: "Sybex Practice Questions" },
  { id: "book-120", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Analyzing Vulnerability Scans", question: "Alan is reviewing web server logs after an attack and finds many records that contain semicolons and apostrophes in queries from end users. What type of attack should he suspect?", options: ["SQL injection", "LDAP injection", "Cross-site scripting", "Buffer overflow Responding to Vulnerabilities"], answer: 0, explanation: "In a SQL injection attack, the attacker seeks to use a web application to gain access to an underlying database. Semicolons and apostrophes are characteristic of these attacks." , source: "Sybex Practice Questions" },
  { id: "book-121", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Jen identified a missing patch on a Windows server that might allow an attacker to gain remote control of the system. After consulting with her manager, she applied the patch. From a risk management perspective, what has she done?", options: ["Removed the threat", "Reduced the threat", "Removed the vulnerability", "Reduced the vulnerability"], answer: 2, explanation: "By applying the patch, Jen has removed the vulnerability from her server. This also has the effect of eliminating this particular risk. Jen cannot control the external threat of an attacker attempting to gain access to her server." , source: "Sybex Practice Questions" },
  { id: "book-122", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "You notice a high number of SQL injection attacks against a web application run by your organization and you install a web application firewall to block many of these attacks before they reach the server. How have you altered the severity of this risk?", options: ["Reduced the magnitude", "Eliminated the vulnerability", "Reduced the probability", "Eliminated the threat Questions 3 through 7 refer to the following scenario. Aziz is responsible for the administration of an e-commerce website that generates $100,000 per day in revenue for his firm. The website uses a database that contains sensitive information about the firm’s customers. He expects that a compromise of that database would result in $500,000 of fines against his firm. Aziz is assessing the risk of a SQL injection attack against the database where the attacker would steal all of the customer personally identifiable information (PII) from the database. After consulting threat intelligence, he believes that there is a 5% chance of a successful attack in any given year."], answer: 2, explanation: "Installing a web application firewall reduces the probability that an attack will reach the web server. Vulnerabilities may still exist in the web application and the threat of an external attack is unchanged. The impact of a successful SQL injection attack is also unchanged by a web application firewall." , source: "Sybex Practice Questions" },
  { id: "book-123", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Aziz is responsible for the administration of an e-commerce website that generates $100,000 per day in revenue for his firm. The website uses a database that contains sensitive information about the firm's customers. He expects that a compromise of that database would result in $500,000 of fines against his firm. Aziz is assessing the risk of a SQL injection attack against the database where the attacker would steal all of the customer personally identifiable information (PII) from the database. After consulting threat intelligence, he believes that there is a 5% chance of a successful attack in any given year. What is the asset value (AV)?", options: ["$5,000", "$100,000", "$500,000", "$600,000"], answer: 2, explanation: "The asset at risk in this case is the customer database. Losing control of the database would result in a $500,000 fine, so the asset value (AV) is $500,000." , source: "Sybex Practice Questions" },
  { id: "book-124", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Aziz is responsible for the administration of an e-commerce website that generates $100,000 per day in revenue for his firm. The website uses a database that contains sensitive information about the firm's customers. He expects that a compromise of that database would result in $500,000 of fines against his firm. Aziz is assessing the risk of a SQL injection attack against the database where the attacker would steal all of the customer personally identifiable information (PII) from the database. After consulting threat intelligence, he believes that there is a 5% chance of a successful attack in any given year. What is the exposure factor (EF)?", options: ["5%", "20%", "50%", "100%"], answer: 3, explanation: "The attack would result in the total loss of customer data stored in the database, making the exposure factor (EF) 100%." , source: "Sybex Practice Questions" },
  { id: "book-125", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Aziz is responsible for the administration of an e-commerce website that generates $100,000 per day in revenue for his firm. The website uses a database that contains sensitive information about the firm's customers. He expects that a compromise of that database would result in $500,000 of fines against his firm. Aziz is assessing the risk of a SQL injection attack against the database where the attacker would steal all of the customer personally identifiable information (PII) from the database. After consulting threat intelligence, he believes that there is a 5% chance of a successful attack in any given year. What is the single loss expectancy (SLE)?", options: ["$5,000", "$100,000", "$500,000", "$600,000"], answer: 2, explanation: "We compute the single loss expectancy (SLE) by multiplying the asset value (AV) ($500,000) and the exposure factor (EF) (100%) to get an SLE of $500,000." , source: "Sybex Practice Questions" },
  { id: "book-126", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Aziz is responsible for the administration of an e-commerce website that generates $100,000 per day in revenue for his firm. The website uses a database that contains sensitive information about the firm's customers. He expects that a compromise of that database would result in $500,000 of fines against his firm. Aziz is assessing the risk of a SQL injection attack against the database where the attacker would steal all of the customer personally identifiable information (PII) from the database. After consulting threat intelligence, he believes that there is a 5% chance of a successful attack in any given year. What is the annualized rate of occurrence (ARO)?", options: ["0.05", "0.20", "2.00", "5.00"], answer: 0, explanation: "Aziz’s threat intelligence research determined that the threat has a 5% likelihood of occurrence each year. This is an ARO of 0.05." , source: "Sybex Practice Questions" },
  { id: "book-127", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Aziz is responsible for the administration of an e-commerce website that generates $100,000 per day in revenue for his firm. The website uses a database that contains sensitive information about the firm's customers. He expects that a compromise of that database would result in $500,000 of fines against his firm. Aziz is assessing the risk of a SQL injection attack against the database where the attacker would steal all of the customer personally identifiable information (PII) from the database. After consulting threat intelligence, he believes that there is a 5% chance of a successful attack in any given year. What is the annualized loss expectancy (ALE)?", options: ["$5,000", "$25,000", "$100,000", "$500,000 Questions 8–11 refer to the following scenario. Grace recently completed a risk assessment of her organization’s exposure to data breaches and determined that there is a high level of risk related to the loss of sensitive personal information. She is considering a variety of approaches to managing this risk."], answer: 1, explanation: "We compute the annualized loss expectancy (ALE) by multiplying the SLE ($500,000) and the ARO (0.05) to get an ALE of $25,000." , source: "Sybex Practice Questions" },
  { id: "book-128", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Grace recently completed a risk assessment of her organization's exposure to data breaches and determined that there is a high level of risk related to the loss of sensitive personal information. She is considering a variety of approaches to managing this risk. Grace’s first idea is to add a web application firewall to protect her organization against SQL injection attacks. What risk management strategy does this approach adopt?", options: ["Risk acceptance", "Risk avoidance", "Risk mitigation", "Risk transference"], answer: 2, explanation: "Installing new controls or upgrading existing controls is an effort to reduce the probability or magnitude of a risk. This is an example of a risk mitigation activity." , source: "Sybex Practice Questions" },
  { id: "book-129", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Grace recently completed a risk assessment of her organization's exposure to data breaches and determined that there is a high level of risk related to the loss of sensitive personal information. She is considering a variety of approaches to managing this risk. Business leaders are considering dropping the customer activities that collect and store sensitive personal information. What risk management strategy would this approach use?", options: ["Risk acceptance", "Risk avoidance", "Risk mitigation", "Risk transference"], answer: 1, explanation: "Changing business processes or activities to eliminate a risk is an example of risk avoidance." , source: "Sybex Practice Questions" },
  { id: "book-130", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Grace recently completed a risk assessment of her organization's exposure to data breaches and determined that there is a high level of risk related to the loss of sensitive personal information. She is considering a variety of approaches to managing this risk. The business decided to install the web application firewall and continue doing business. They still were worried about other risks to the information that were not addressed by the firewall and consider purchasing an insurance policy to cover those risks. What strategy does this use?", options: ["Risk acceptance", "Risk avoidance", "Risk mitigation", "Risk transference"], answer: 3, explanation: "Insurance policies use a risk transference strategy by shifting some or all of the financial risk from the organization to an insurance company." , source: "Sybex Practice Questions" },
  { id: "book-131", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Grace recently completed a risk assessment of her organization's exposure to data breaches and determined that there is a high level of risk related to the loss of sensitive personal information. She is considering a variety of approaches to managing this risk. In the end, risk managers found that the insurance policy was too expensive and opted not to purchase it. They are taking no additional action. What risk management strategy is being used in this situation?", options: ["Risk acceptance", "Risk avoidance", "Risk mitigation", "Risk transference"], answer: 0, explanation: "When an organization decides to take no further action to address remaining risk, they are choosing a strategy of risk acceptance." , source: "Sybex Practice Questions" },
  { id: "book-132", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Which of the following is a formal process that allows organizations to open their systems to inspection by security researchers in a controlled environment?", options: ["Edge discovery", "Passive discovery", "Security controls testing", "Bug bounty"], answer: 3, explanation: "Bug bounty programs provide a formal process that allows organizations to open their systems to inspection by security researchers in a controlled environment that encourages attackers to report vulnerabilities in a responsible fashion. Edge discovery scanning identifies any systems or devices with public exposure by scanning IP addresses belonging to the organization. Passive discovery techniques monitor inbound and outbound traffic to detect devices that did not appear during other discovery scans. Security controls testing verifies that the organization’s array of security controls are functioning properly." , source: "Sybex Practice Questions" },
  { id: "book-133", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Which of the following is often used to assist with the prevention of XSS and SQL injection attacks?", options: ["Secure session management", "Input validation", "SLOs", "Maintenance windows"], answer: 1, explanation: "Input validation helps prevent a wide range of problems, from cross-site scripting (XSS) to SQL injection attacks. Secure session management ensures that attackers cannot hijack user sessions or that session issues don’t cause confusion among users. Organizations that offer technology services to customers may define service level objectives (SLOs) that set formal expectations for service availability, data preservation, and other key requirements. Many organizations choose to consolidate many changes in a single period of time known as a maintenance window. Maintenance windows typically occur on evenings and weekends or during other periods of time where business activity is low." , source: "Sybex Practice Questions" },
  { id: "book-134", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Which of the following is designed specifically to support penetration testing and the reverse engineering of malware?", options: ["Immunity debugger", "GDB", "SDLC", "Parameterized queries"], answer: 0, explanation: "The Immunity debugger is designed specifically to support penetration testing and the reverse engineering of malware. GNU debugger (GDB) is a widely used open source debugger for Linux that works with a variety of programming languages. The software development life cycle (SDLC) describes the steps in a model for software development throughout its life. Parameterized queries prevent SQL injection attacks by precompiling SQL queries so that new code may not be inserted when the query is executed." , source: "Sybex Practice Questions" },
  { id: "book-135", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Jason gathers threat intelligence that notes that an adversary that his organization considers a threat likes to use USB key drops to compromise their targets. What is this an example of?", options: ["His organization’s attack surface", "A possible attack vector", "An example of adversary capability", "A probability assessment"], answer: 1, explanation: "Attack vectors, or the means by which an attacker can gain access to their target can include things like USB key drops. You may be tempted to answer this question with adversary capability, but remember the definition: the resources, intent, or ability of the likely threat actor. Capability here doesn’t mean what they can do, but their ability to do so. The attack surface might include the organization’s parking lot in this example, but this is not an example of an attack surface, and there was no probability assessment included in this problem." , source: "Sybex Practice Questions" },
  { id: "book-136", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "What type of assessment is particularly useful for identifying insider threats?", options: ["Behavioral", "Instinctual", "Habitual", "IOCs"], answer: 0, explanation: "Behavioral assessments are very useful when you are attempting to identify insider threats. Since insider threats are often hard to distinguish from normal behavior, context of the actions performed, such as afterhours logins, misuse of credentials, logins from abnormal locations or in abnormal patterns, and other behavioral indicators, are often used." , source: "Sybex Practice Questions" },
  { id: "book-137", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "STRIDE, PASTA, and LIDDUN are all examples of what?", options: ["Zero-day rating systems", "Vulnerability assessment tools", "Adversary analysis tools", "Threat classification tools"], answer: 3, explanation: "STRIDE, PASTA, and LIDDUN are all examples of threat classification tools. LIDDUN focuses on threats to privacy, STRIDE is a Microsoft tool, and PASTA is an attacker-centric threat modeling tool." , source: "Sybex Practice Questions" },
  { id: "book-138", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "What type of software testing tool executes the code as it is being tested?", options: ["Static analysis", "Dynamic analysis", "Compilation", "Decompilation"], answer: 1, explanation: "Dynamic analysis techniques actually execute the code during the testing process. Static code analysis tools and techniques analyze the structure and content of code without executing the code itself. Compilation is the process of transforming source code into an executable and decompilation attempts to reverse that process. Neither compilation nor decompilation executes the code." , source: "Sybex Practice Questions" },
  { id: "book-139", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "Adam is conducting software testing by reviewing the source code of the application. What type of code testing is Adam conducting?", options: ["Mutation testing", "Static code analysis", "Dynamic code analysis", "Fuzzing"], answer: 1, explanation: "Adam is conducting static code analysis by reviewing the source code. Dynamic code analysis requires running the program, and both mutation testing and fuzzing are types of dynamic analysis." , source: "Sybex Practice Questions" },
  { id: "book-140", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Responding to Vulnerabilities", question: "During testing, Tiffany slowly increases the number of connections to an application until it fails. What is she doing?", options: ["Regression testing", "Unit testing", "Stress testing", "Fagan testing DOMAIN III Incident Response and Management Building an Incident Response Program"], answer: 2, explanation: "Tiffany is stress-testing the application. Stress testing intentionally goes beyond the application’s normal limits to see how it responds to extreme loads or other abnormal conditions beyond its normal capacity. Unit testing tests individual components of an applications, while regression testing is done to ensure that new versions don’t introduce old bugs. Fagan testing is a formal method of code inspection." , source: "Sybex Practice Questions" },
  { id: "book-141", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Which one of the following is an example of a computer security incident?", options: ["User accesses a secure file", "Administrator changes a file’s permission settings", "Intruder breaks into a building", "Former employee crashes a server"], answer: 3, explanation: "A former employee crashing a server is an example of a computer security incident because it is an actual violation of the availability of that system. A user accessing a secure file and an administrator changing file permission settings are examples of security events but are not security incidents. An intruder breaking into a building may be a security event, but it is not necessarily a computer security event unless they perform some action affecting a computer system." , source: "Sybex Practice Questions" },
  { id: "book-142", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "During what phase of the incident response process would an organization implement defenses designed to reduce the likelihood of a security incident?", options: ["Preparation", "Detection and analysis", "Containment, eradication, and recovery", "Post-incident activity"], answer: 0, explanation: "Organizations should build solid, defense-in-depth approaches to cybersecurity during the preparation phase of the incident response process. The controls built during this phase serve to reduce the likelihood and impact of future incidents." , source: "Sybex Practice Questions" },
  { id: "book-143", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Alan is responsible for developing his organization’s detection and analysis capabilities. He would like to purchase a system that can combine log records from multiple sources to detect potential security incidents. What type of system is best suited to meet Alan’s security objective?", options: ["IPS", "IDS", "SIEM", "Firewall"], answer: 2, explanation: "A security information and event management (SIEM) system correlates log entries from multiple sources and attempts to identify potential security incidents." , source: "Sybex Practice Questions" },
  { id: "book-144", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Ben is working to classify the functional impact of an incident. The incident has disabled email service for approximately 30 percent of his organization’s staff. How should Ben classify the functional impact of this incident according to the NIST scale?", options: ["None", "Low", "Medium", "High"], answer: 2, explanation: "The definition of a medium functional impact is that the organization has lost the ability to provide a critical service to a subset of system users. That accurately describes the situation that Ben finds himself in. Assigning a low functional impact is only done when the organization can provide all critical services to all users at diminished efficiency. Assigning a high functional impact is only done if a critical service is not available to all users." , source: "Sybex Practice Questions" },
  { id: "book-145", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "What phase of the incident response process would include measures designed to limit the damage caused by an ongoing breach?", options: ["Preparation", "Detection and analysis", "Containment, eradication, and recovery", "Post-incident activity"], answer: 2, explanation: "The containment protocols contained in the containment, eradication, and recovery phases are designed to limit the damage caused by an ongoing security incident." , source: "Sybex Practice Questions" },
  { id: "book-146", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "What common criticism is leveled at the Cyber Kill Chain?", options: ["Not all threats are aimed at a kill.", "It is too detailed.", "It includes actions outside the defended network.", "It focuses too much on insider threats."], answer: 2, explanation: "The Kill Chain includes actions outside the defended network which many defenders cannot take action on, resulting in one of the common criticisms of the model. Other criticisms include the focus on a traditional perimeter and on antimalware-based techniques, as well as a lack of focus on insider threats." , source: "Sybex Practice Questions" },
  { id: "book-147", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Karen is responding to a security incident that resulted from an intruder stealing files from a government agency. Those files contained unencrypted information about protected critical infrastructure. How should Karen rate the information impact of this loss?", options: ["None", "Privacy breach", "Proprietary breach", "Integrity loss"], answer: 2, explanation: "In a proprietary breach, unclassified proprietary information is accessed or exfiltrated. Protected critical infrastructure information (PCII) is an example of unclassified proprietary information." , source: "Sybex Practice Questions" },
  { id: "book-148", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Matt is concerned about the fact that log records from his organization contain conflicting timestamps due to unsynchronized clocks. What protocol can he use to synchronize clocks throughout the enterprise?", options: ["NTP", "FTP", "ARP", "SSH"], answer: 0, explanation: "The Network Time Protocol (NTP) provides a common source of time information that allows the synchronizing of clocks throughout an enterprise." , source: "Sybex Practice Questions" },
  { id: "book-149", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Which one of the following document types would outline the authority of a CSIRT responding to a security incident?", options: ["Policy", "Procedure", "Playbook", "Baseline"], answer: 0, explanation: "An organization’s incident response policy should contain a clear description of the authority assigned to the CSIRT while responding to an active security incident." , source: "Sybex Practice Questions" },
  { id: "book-150", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "A cross-site scripting attack is an example of what type of threat vector?", options: ["Impersonation", "Email", "Attrition", "Web"], answer: 3, explanation: "A web attack is an attack executed from a website or web-based application—for example, a cross-site scripting attack used to steal credentials or redirect to a site that exploits a browser vulnerability and installs malware." , source: "Sybex Practice Questions" },
  { id: "book-151", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "What phase of the Cyber Kill Chain includes creation of persistent backdoor access for attackers?", options: ["Delivery", "Exploitation", "Installation", "C2"], answer: 2, explanation: "The installation phase of the Cyber Kill Chain focuses on providing persistent backdoor access for attackers. Delivery occurs when the tool is put into action either directly or indirectly, whereas exploitation occurs when a vulnerability is exploited. Command-and-Control (C2) uses two-way communications to provide continued remote control." , source: "Sybex Practice Questions" },
  { id: "book-152", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Robert is finishing a draft of a proposed incident response policy for his organization. Who would be the most appropriate person to sign the policy?", options: ["CEO", "Director of security", "CIO", "CSIRT leader"], answer: 0, explanation: "The incident response policy provides the CSIRT with the authority needed to do their job. Therefore, it should be approved by the highest possible level of authority within the organization, preferably the CEO." , source: "Sybex Practice Questions" },
  { id: "book-153", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Which one of the following is not an objective of the containment, eradication, and recovery phase of incident response?", options: ["Detect an incident in progress.", "Implement a containment strategy.", "Identify the attackers.", "Eradicate the effects of the incident."], answer: 0, explanation: "Detection of a potential incident occurs during the detection and analysis phase of incident response. The other activities listed are all objectives of the containment, eradication, and recovery phase." , source: "Sybex Practice Questions" },
  { id: "book-154", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Renee is responding to a security incident that resulted in the unavailability of a website critical to her company’s operations. She is unsure of the amount of time and effort that it will take to recover the website. How should Renee classify the recoverability effort?", options: ["Regular", "Supplemented", "Extended", "Not recoverable"], answer: 2, explanation: "Extended recoverability effort occurs when the time to recovery is unpredictable. In those cases, additional resources and outside help are typically needed." , source: "Sybex Practice Questions" },
  { id: "book-155", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Which one of the following is an example of an attrition attack?", options: ["SQL injection", "Theft of a laptop", "User installs file sharing software", "Brute-force password attack"], answer: 3, explanation: "An attrition attack employs brute-force methods to compromise, degrade, or destroy systems, networks, or services—for example, a DDoS attack intended to impair or deny access to a service or application or a brute-force attack against an authentication mechanism." , source: "Sybex Practice Questions" },
  { id: "book-156", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Who is the best facilitator for a post-incident lessons learned session?", options: ["CEO", "CSIRT leader", "Independent facilitator", "First responder"], answer: 2, explanation: "Lessons learned sessions are most effective when facilitated by an independent party who was not involved in the incident response effort." , source: "Sybex Practice Questions" },
  { id: "book-157", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Which one of the following elements is not normally found in an incident response policy?", options: ["Performance measures for the CSIRT", "Definition of cybersecurity incidents", "Definition of roles, responsibilities, and levels of authority", "Procedures for rebuilding systems"], answer: 3, explanation: "Procedures for rebuilding systems are highly technical and would normally be included in a playbook or procedure document rather than an incident response policy." , source: "Sybex Practice Questions" },
  { id: "book-158", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "An on-path attack is an example of what type of threat vector?", options: ["Attrition", "Impersonation", "Web", "Email"], answer: 1, explanation: "An impersonation attack involves the replacement of something benign with something malicious—for example, spoofing, on-path (man-in-the-middle) attacks, rogue wireless access points, and SQL injection attacks all involve impersonation." , source: "Sybex Practice Questions" },
  { id: "book-159", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Tommy is the CSIRT team leader for his organization and is responding to a newly discovered security incident. What document is most likely to contain step-by-step instructions that he might follow in the early hours of the response effort?", options: ["Policy", "Baseline", "Playbook", "Textbook"], answer: 2, explanation: "Incident response playbooks contain detailed, step-by-step instructions that guide the early response to a cybersecurity incident. Organizations typically have playbooks prepared for high-severity and frequently occurring incident types." , source: "Sybex Practice Questions" },
  { id: "book-160", domain: "Incident Response", objectiveId: "3.1", topic: "Building an Incident Response Program", question: "Hank is responding to a security event where the CEO of his company had her laptop stolen. The laptop was encrypted but contained sensitive information about the company’s employees. How should Hank classify the information impact of this security event?", options: ["None", "Privacy breach", "Proprietary breach", "Integrity loss Incident Detection and Analysis"], answer: 0, explanation: "The event described in this scenario would not qualify as a security incident with measurable information impact. Although the laptop did contain information that might cause a privacy breach, that breach was avoided by the use of encryption to protect the contents of the laptop." , source: "Sybex Practice Questions" },
  { id: "book-161", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Susan needs to track evidence that has been obtained throughout its life cycle. What documentation does she need to create and maintain if she expects the evidence to be used in a legal case?", options: ["Forensic hashes", "Legal hold", "Chain of custody", "IoC ratings"], answer: 2, explanation: "Susan needs to track the chain of custody for the evidence and should ensure that a proper chain of custody is maintained. This is especially important when dealing with data that may become part of legal proceedings. Forensic hashes are typically generated as part of forensic processes to ensure that the original and copies of forensic data match, but a hash alone does not provide chain-of-custody tracking. Legal holds require organizations to preserve data but don’t track chain of custody, and IoC ratings are unrelated to this question." , source: "Sybex Practice Questions" },
  { id: "book-162", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Hui wants to comply with a legal hold but knows that her organization has a regular process that purges logs after 45 days due to space limitations. What should she do if the logs are covered by the legal hold?", options: ["Notify counsel that the logs will be deleted automatically in 45 days.", "Delete the logs now to allow longer before space is filled up.", "Identify a preservation method to comply with the hold.", "Make no changes; holds allow ongoing processes to continue as normal."], answer: 2, explanation: "Hui knows that she needs to preserve the logs per the legal hold notice and will need to identify a method to preserve the logs while maintaining operations for her organization. Failing to do so can have significant legal repercussions." , source: "Sybex Practice Questions" },
  { id: "book-163", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Juan wants to validate the integrity of a drive that he has forensically imaged as part of an incident response process. Which of the options should he select?", options: ["Compare a hash of the original drive to the drive image.", "Compare the file size on disk of the original drive to the space taken up by the drive image.", "Compare the vendor’s drive size listing to the space taken up by the drive image.", "Use PGP to encrypt the drive and image and make sure that both encrypted versions match."], answer: 0, explanation: "Hashes are used to validate drive images and other forensic artifacts. Comparing a hash of the original and the image is commonly used to ensure that they match. None of the other options will validate a drive image, and encrypting a drive will modify it, spoiling the evidence." , source: "Sybex Practice Questions" },
  { id: "book-164", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Kathleen wants to determine if the traffic she is seeing is unusual for her network. Which of the following options would be most useful to determine if traffic levels are not typical for this time of day in a normal week?", options: ["Heuristics", "Baselines", "Protocol analysis", "Network flow logs"], answer: 1, explanation: "A baseline for traffic patterns and levels would allow Kathleen to determine if the traffic was typical or if something unusual was going on. Heuristics focus on behaviors, and Kathleen wants to see if traffic levels are different, not behaviors. Protocol analysis looks at whether there is an unusual protocol or data, and network flow logs are useful for determining which systems are sending traffic to where and via what protocol." , source: "Sybex Practice Questions" },
  { id: "book-165", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Renee wants to adopt an open IoC feed. What issue is Renee most likely to need to address when adopting it?", options: ["The cost of the IoC feed", "The quality of the feed", "The update frequency of the feed", "The level of detail in the feed"], answer: 1, explanation: "Open feed data can vary in quality and reliability. That means Renee will have to put processes in place to assess the quality and reliability of the IoC information she is receiving. An open feed implies that it is free. Open feeds are generally active, and IoC detail levels vary as IoCs are created and updated, regardless of the type of feed." , source: "Sybex Practice Questions" },
  { id: "book-166", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Chris wants to use an active monitoring approach to test his network. Which of the following techniques is appropriate?", options: ["Collecting NetFlow data", "Using a protocol analyzer", "Pinging remote systems", "Enabling SNMP"], answer: 2, explanation: "Active monitoring is focused on reaching out to gather data using tools like ping and iPerf. Passive monitoring using protocol analyzers collects network traffic and router-based monitoring using SNMP, and flows gather data by receiving or collecting logged information." , source: "Sybex Practice Questions" },
  { id: "book-167", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Which of the following is not information commonly found in an IoC?", options: ["IP addresses", "Domain names", "System images", "Behavior-based information"], answer: 2, explanation: "System images are not typically part of an IOC. Hashes of malicious software may be, as well as IP addresses, hostnames, domains, and behavior- based information, among other common details." , source: "Sybex Practice Questions" },
  { id: "book-168", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Cameron wants to be able to detect a denial-of-service attack against his web server. Which of the following tools should he avoid?", options: ["Log analysis", "Flow monitoring", "iPerf", "IPS"], answer: 2, explanation: "Log analysis, flow monitoring, and deploying an IPS are all appropriate solutions to help detect denial-of-service attacks. iPerf is a performance testing tool used to establish the maximum bandwidth available on a network connection." , source: "Sybex Practice Questions" },
  { id: "book-169", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Sameer finds log information that indicates that a process that he believes is malicious starts at the same time every day on a Linux system. Where should he start looking for an issue like this?", options: ["He should review the system log.", "He should check the Task Scheduler.", "He should check cron jobs.", "He should check user directories."], answer: 2, explanation: "While there could be other issues, a recurring scheduled task is most likely to be set as a cron job, and Sameer should start his search there. The Task Scheduler is a Windows tool, system logs may or may not contain information about the process, and searching user directories would not provide indications of what process was starting at a given time." , source: "Sybex Practice Questions" },
  { id: "book-170", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Jim uses an IoC feed to help detect new attacks against his organization. What should he do first if his security monitoring system flags a match for an IoC?", options: ["Shut down the system that caused the alert", "Review the alert to determine why it occurred", "Check network logs to identify the remote attacker", "Run a port scan to determine if the system is compromised"], answer: 1, explanation: "Reviewing why the alert occurred is Jim's first step. IoCs in isolation may not indicate a compromise or attack, so validating the alert is an important first step. shutting down a system due to an alert could cause an outage or prevent forensic investigation. There is nothing in question to indicate that this is a network-based attack that will have been logged, and port scans are also not indicated by the question." , source: "Sybex Practice Questions" },
  { id: "book-171", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "While monitoring network traffic to his web server cluster, Mark notices a significant increase in traffic. He checks the source addresses for inbound traffic and finds that the traffic is coming from many different systems all over the world. What should Mark identify this as if he believes that it may be an attack?", options: ["A denial-of-service attack", "A distributed network scan", "A DNS-based attack", "A distributed denial-of-service attack"], answer: 3, explanation: "The behavior described with a significant increase in traffic from many systems all over the world is most likely a distributed denial-of-service attack if it is malicious. Mark’s challenge will be in determining if it is an attack or if some other event has occurred that is driving traffic to his website—a post that goes viral can be difficult to differentiate from an attack in some cases!" , source: "Sybex Practice Questions" },
  { id: "book-172", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Valentine wants to check for unauthorized access to a system. What two log types are most likely to contain this information?", options: ["Authentication logs and user creation logs", "System logs and application logs", "Authentication logs and application logs", "System logs and authentication logs"], answer: 0, explanation: "Valentine knows that unauthorized access often involves the creation of unauthorized user accounts and authentication events that allowed access to the system. System logs contain system events, but not authentication or user creation information. Application logs track application events and also typically won’t show this type of information." , source: "Sybex Practice Questions" },
  { id: "book-173", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Sayed notices that a remote system has attempted to log into a system he is responsible for multiple times using the same administrator’s user ID but different passwords. What has Sayed most likely discovered?", options: ["A user who forgot their password", "A broken application", "A brute-force attack", "A misconfigured service"], answer: 2, explanation: "A series of attempted logins from the remote system with the same username but different passwords is a common indicator of a brute-force attack. While more sophisticated attackers will use multiple remote systems and will spread attempts over time, a simple brute-force attack will appear exactly like this. Sayed can verify this by checking in with the administrator whose username is being used." , source: "Sybex Practice Questions" },
  { id: "book-174", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "While Susan is monitoring a router via network flows, she sees a sudden drop in network traffic levels to zero, and the traffic chart shows a flat line. What has likely happened?", options: ["The sampling rate is set incorrectly.", "The router is using SNMP.", "The monitored link failed.", "A DDoS attack is occurring."], answer: 2, explanation: "The most likely answer is that the link has failed. Incorrectly set sampling rates will not provide a good view of traffic, and a DDoS attack is more likely to show large amounts of traffic. SNMP is a monitoring tool and would not result in flow data changing." , source: "Sybex Practice Questions" },
  { id: "book-175", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Leo wants to monitor his application for common issues. Which of the following is not a typical method of monitoring for application issues?", options: ["Up/down logging", "System logging", "Performance logging", "Transactional logging"], answer: 1, explanation: "System logging is typically handled separately from application logging. Up/down, performance, transactional logs, and service logging are all common forms of monitoring used to ensure applications are performing correctly." , source: "Sybex Practice Questions" },
  { id: "book-176", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Greg notices that a user account on a Linux server he is responsible for has connected to 10 machines via SSH within seconds. What type of IoC best matches this type of behavior?", options: ["Bot-like behavior", "Port scanning", "Denial of service", "Escalation of privileges"], answer: 0, explanation: "Actions performed more quickly than a typical user would perform them can be an indicator of bot-like behavior. If the user performing the actions does not typically run scripts or connect to multiple machines, Greg may want to investigate more deeply, including checking logs on the remote systems to see what authentication was attempted. SSH connections alone are not indicators of port scanning, escalation of privilege, or denial-of-service attacks." , source: "Sybex Practice Questions" },
  { id: "book-177", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Arun wants to monitor for unusual database usage. Which of the following is most likely to be indicative of a malicious actor?", options: ["Increases in cached hits to the database", "Decreases in network traffic to the database", "Increases in disk reads for the database", "Decreases in database size"], answer: 2, explanation: "An attacker is likely to attempt to gather information from the entire database, meaning that cached hits will not make up the full volume of queries. Thus, disk reads from a database may be a more important indicator of compromise than an increase in cached hits that may simply be more typical usage." , source: "Sybex Practice Questions" },
  { id: "book-178", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Valerie is concerned that an attacker may have gained access to a system in her datacenter. Which of the following behaviors is not a common network-based IoC that she should monitor for?", options: ["Traffic to unexpected destinations", "Unusual volumes of outbound traffic", "Increases in system memory consumption", "Outbound traffic at unusual times"], answer: 2, explanation: "Valerie is specifically looking for network-related IoCs, and system memory consumption is a host- or system-related IoC, not a network-related IoC." , source: "Sybex Practice Questions" },
  { id: "book-179", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Alex has noticed that the primary disk for his Windows server is quickly filling up. What should he do to determine what is filling up the drive?", options: ["Check the filesystem logs.", "Check the security logs.", "Search for large files and directories.", "Search for file changes."], answer: 2, explanation: "The first step in Alex’s process should be to identify where the files that are filling the drive are located and what they are. A simple search can help with this by sorting by large directories and files. Windows does not have a filesystem log that would record this, and security logs are focused on security events, not filesystem information. Searching for files that have changed requires a tool that tracks changes, which is not part of a default Windows installation." , source: "Sybex Practice Questions" },
  { id: "book-180", domain: "Incident Response", objectiveId: "3.2", topic: "Incident Detection and Analysis", question: "Joseph wants to be notified if user behaviors vary from normal on systems he maintains. He uses a tool to capture and analyze a week of user behavior and uses that to determine if unusual behavior occurs. What is this practice called?", options: ["Pattern matching", "Baselining", "Fingerprinting", "User modeling Containment, Eradication, and Recovery"], answer: 1, explanation: "Joseph has created a user behavior baseline, which will allow him to see if there are exceptions to the normal behaviors and commands that users run. Pattern matching, fingerprinting, and user modeling are not terms used to describe this process." , source: "Sybex Practice Questions" },
  { id: "book-181", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the phases of incident response involves primarily active undertakings designed to limit the damage that an attacker might cause?", options: ["Containment, Eradication, and Recovery", "Preparation", "Post-Incident Activity", "Detection and Analysis"], answer: 0, explanation: "The Containment, Eradication, and Recovery phase of incident response includes active undertakings designed to minimize the damage caused by the incident and restore normal operations as quickly as possible." , source: "Sybex Practice Questions" },
  { id: "book-182", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following criteria is not normally used when evaluating the appropriateness of a cybersecurity incident containment strategy?", options: ["Effectiveness of the strategy", "Evidence preservation requirements", "Log records generated by the strategy", "Cost of the strategy"], answer: 2, explanation: "NIST recommends using six criteria to evaluate a containment strategy: the potential damage to resources, the need for evidence preservation, service availability, time and resources required (including cost), effectiveness of the strategy, and duration of the solution." , source: "Sybex Practice Questions" },
  { id: "book-183", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Alice is responding to a cybersecurity incident and notices a system that she suspects is compromised. She places this system on a quarantine VLAN with limited access to other networked systems. What containment strategy is Alice pursuing?", options: ["Eradication", "Isolation", "Segmentation", "Removal"], answer: 2, explanation: "In a segmentation approach, the suspect system is placed on a separate network where it has very limited access to other networked resources." , source: "Sybex Practice Questions" },
  { id: "book-184", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Alice confers with other team members and decides that even allowing limited access to other systems is an unacceptable risk and chooses instead to prevent the quarantine VLAN from accessing any other systems by putting firewall rules in place that limit access to other enterprise systems. The attacker can still control the system to allow Alice to continue monitoring the incident. What strategy is she now pursuing?", options: ["Eradication", "Isolation", "Segmentation", "Removal"], answer: 1, explanation: "In the isolation strategy, the quarantine network is directly connected to the Internet or restricted severely by firewall rules so that the attacker may continue to control it but not gain access to any other networked resources." , source: "Sybex Practice Questions" },
  { id: "book-185", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "After observing the attacker, Alice decides to remove the Internet connection entirely, leaving the systems running but inaccessible from outside the quarantine VLAN. What strategy is she now pursuing?", options: ["Eradication", "Isolation", "Segmentation", "Removal"], answer: 3, explanation: "In the removal approach, Alice keeps the systems running for forensic purposes but completely cuts off their access to or from other networks, including the Internet." , source: "Sybex Practice Questions" },
  { id: "book-186", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following tools may be used to isolate an attacker so that they may not cause damage to production systems but may still be observed by cybersecurity analysts?", options: ["Sandbox", "Playpen", "IDS", "DLP"], answer: 0, explanation: "Sandboxes are isolation tools used to contain attackers within an environment where they believe they are conducting an attack but, in reality, are operating in a benign environment." , source: "Sybex Practice Questions" },
  { id: "book-187", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Tamara is a cybersecurity analyst for a private business that is suffering a security breach. She believes the attackers have compromised a database containing sensitive information. Which one of the following activities should be Tamara’s first priority?", options: ["Identifying the source of the attack", "Eradication", "Containment", "Recovery"], answer: 2, explanation: "Tamara’s first priority should be containing the attack. This will prevent it from spreading to other systems and also potentially stop the exfiltration of sensitive information. Only after containing the attack should Tamara move on to eradication and recovery activities. Identifying the source of the attack should be a low priority." , source: "Sybex Practice Questions" },
  { id: "book-188", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "What should be clearly identified during a lessons learned review in order to reduce the likelihood of a similar incident escaping attention in the future?", options: ["IOCs", "Scope", "Impact", "Reimaging"], answer: 0, explanation: "During an incident investigation, the team may encounter new indicators of compromise (IOCs) based on the tools, techniques, and tactics used by attackers. As part of the lessons learned review, the team should clearly identify any new IOCs and make recommendations for updating the organization’s security monitoring program to include those IOCs. This will reduce the likelihood of a similar incident escaping attention in the future. Scope, impact, and reimaging should be considered during containment, eradication, and recovery." , source: "Sybex Practice Questions" },
  { id: "book-189", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following pieces of information is most critical to conducting a solid incident recovery effort?", options: ["Identity of the attacker", "Time of the attack", "Root cause of the attack", "Attacks on other organizations"], answer: 2, explanation: "Understanding the root cause of an attack is critical to the incident recovery effort. Analysts should examine all available information to help reconstruct the attacker’s actions. This information is crucial to remediating security controls and preventing future similar attacks." , source: "Sybex Practice Questions" },
  { id: "book-190", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Lynda is disposing of a drive containing sensitive information that was collected during the response to a cybersecurity incident. The information is categorized as a high security risk and she wishes to reuse the media during a future incident. What is the appropriate disposition for this information?", options: ["Clear", "Erase", "Purge", "Destroy"], answer: 2, explanation: "Lynda should consult the flowchart that appears in Figure 11.7. Following that chart, the appropriate disposition for media that contains high security risk information and will be reused within the organization is to purge it." , source: "Sybex Practice Questions" },
  { id: "book-191", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following activities is not normally conducted during the recovery validation phase?", options: ["Verify the permissions assigned to each account.", "Implement new firewall rules.", "Conduct vulnerability scans.", "Verify logging is functioning properly."], answer: 1, explanation: "New firewall rules, if required, would be implemented during the eradication and recovery phase. The validation phase includes verifying accounts and permissions, verifying that logging is working properly, and conducting vulnerability scans." , source: "Sybex Practice Questions" },
  { id: "book-192", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "What incident response activity focuses on removing any artifacts of the incident that may remain on the organization’s network?", options: ["Containment", "Recovery", "Post-Incident Activities", "Eradication"], answer: 3, explanation: "The primary purpose of eradication is to remove any of the artifacts of the incident that may remain on the organization’s network. This may include the removal of any malicious code from the network, the sanitization of compromised media, and the securing of compromised user accounts." , source: "Sybex Practice Questions" },
  { id: "book-193", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following is not a common use of formal incident reports?", options: ["Training new team members", "Sharing with other organizations", "Developing new security controls", "Assisting with legal action"], answer: 1, explanation: "There are many potential uses for written incident reports. First, it creates an institutional memory of the incident that is useful when developing new security controls and training new security team members. Second, it may serve as an important record of the incident if there is ever legal action that results from the incident. These reports should be classified and not disclosed to external parties." , source: "Sybex Practice Questions" },
  { id: "book-194", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following data elements would not normally be included in an evidence log?", options: ["Serial number", "Record of handling", "Storage location", "Malware signatures"], answer: 3, explanation: "Malware signatures would not normally be included in an evidence log. The log would typically contain identifying information (e.g., the location, serial number, model number, hostname, MAC addresses and IP addresses of a computer), the name, title and phone number of each individual who collected or handled the evidence during the investigation, the time and date (including time zone) of each occurrence of evidence handling, and the locations where the evidence was stored." , source: "Sybex Practice Questions" },
  { id: "book-195", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Sondra determines that an attacker has gained access to a server containing critical business files and wishes to ensure that the attacker cannot delete those files. Which one of the following strategies would meet Sondra’s goal?", options: ["Isolation", "Segmentation", "Removal", "None of the above"], answer: 3, explanation: "Even removing a system from the network doesn’t guarantee that the attack will not continue. In the example given in this chapter, an attacker can run a script on the server that detects when it has been removed from the network and then proceeds to destroy data stored on the server." , source: "Sybex Practice Questions" },
  { id: "book-196", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Joe would like to determine the appropriate disposition of a flash drive used to gather highly sensitive evidence during an incident response effort. He does not need to reuse the drive but wants to return it to its owner, an outside contractor. What is the appropriate disposition?", options: ["Destroy", "Clear", "Erase", "Purge"], answer: 0, explanation: "The data disposition flowchart in Figure 11.7 directs that any media containing highly sensitive information that will leave the control of the organization must be destroyed. Joe should purchase a new replacement device to provide to the contractor." , source: "Sybex Practice Questions" },
  { id: "book-197", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following is not typically found in a cybersecurity incident report?", options: ["Chronology of events", "Identity of the attacker", "Estimates of impact", "Documentation of lessons learned"], answer: 1, explanation: "Incident reports should include a chronology of events, estimates of the impact, and documentation of lessons learned, in addition to other information. Incident response efforts should not normally focus on uncovering the identity of the attacker, so this information would not be found in an incident report." , source: "Sybex Practice Questions" },
  { id: "book-198", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "What NIST publication contains guidance on cybersecurity incident handling?", options: ["SP 800-53", "SP 800-88", "SP 800-18", "SP 800-61"], answer: 3, explanation: "NIST SP 800-61 is the Computer Security Incident Handling Guide. NIST SP 800-53 is Security and Privacy Controls for Federal Information Systems and Organizations. NIST SP 800-88 is Guidelines for Media Sanitization. NIST SP 800-18 is the Guide for Developing Security Plans for Federal Information Systems." , source: "Sybex Practice Questions" },
  { id: "book-199", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Which one of the following is not a purging activity?", options: ["Resetting to factory state", "Overwriting", "Block erase", "Cryptographic erase"], answer: 0, explanation: "Resetting a device to factory state is an example of a data clearing activity. Data purging activities include overwriting, block erase, and cryptographic erase activities when performed through the use of dedicated, standardized device commands." , source: "Sybex Practice Questions" },
  { id: "book-200", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "Ben is responding to a security incident and determines that the attacker is using systems on Ben’s network to attack a third party. Which one of the following containment approaches will prevent Ben’s systems from being used in this manner?", options: ["Removal", "Isolation", "Detection", "Segmentation DOMAIN IV Reporting and Communication Reporting and Communication"], answer: 0, explanation: "Only removal of the compromised system from the network will stop the attack against other systems. Isolated and/or segmented systems are still permitted access to the Internet and could continue their attack. Detection is a purely passive activity that does not disrupt the attacker at all." , source: "Sybex Practice Questions" },
  { id: "book-201", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Why should organizations predetermine communication guidelines according to NIST?", options: ["To limit how many individuals know sensitive incident information", "To ensure compliance with federal law", "To ensure that appropriate communications are shared with the right parties", "To ensure consistency of communications"], answer: 2, explanation: "NIST guidelines note that predetermined communications ensure that appropriate communications are shared with the right parties." , source: "Sybex Practice Questions" },
  { id: "book-202", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "Valentine is preparing a vulnerability management report. What data point will provide the greatest help in determining if patching programs are not succeeding?", options: ["A list of affected hosts", "Information about recurrence", "Prioritization information", "Risk scores"], answer: 1, explanation: "Information about recurrence will help Valentine determine if there is an ongoing issue with the patching program. For example, recurrence might demonstrate that the underlying base images for systems were not being patched, resulting in vulnerabilities when new instances of an image are being deployed." , source: "Sybex Practice Questions" },
  { id: "book-203", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Jake wants to identify stakeholders for vulnerability management communications. Which stakeholder group is most likely to want information to be available via an API instead of a written communication?", options: ["Security operations and oversight stakeholders", "Audit and compliance stakeholders", "System administration stakeholders", "Management stakeholders"], answer: 0, explanation: "Security operations and oversight stakeholders will likely want to ingest vulnerability management data to perform data enrichment activities for other security systems. Audit and compliance, system administration, and management stakeholders are more likely to want written reports to review and use in their roles." , source: "Sybex Practice Questions" },
  { id: "book-204", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "What phase of the NIST IR cycle does communication to stakeholders occur in?", options: ["Detection and Analysis", "Containment, Eradication, and Recovery", "Post-Incident Activity", "All cycles include communication with stakeholders."], answer: 3, explanation: "Communication with stakeholders should occur during all phases of the NIST IR cycle to ensure that they are aware and participating as required." , source: "Sybex Practice Questions" },
  { id: "book-205", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Which of the following potential incident response metrics is least useful in understanding the organization’s ability to respond to incidents?", options: ["Mean time to detect", "Alert volume", "Mean time to respond", "Mean time to remediate"], answer: 1, explanation: "Simply knowing the volume of alerts for an organization is not a useful metric without context. It may indicate that the organization has a poorly tuned alerting system, that the system does not detect most events, or that there are other issues. Mean time to detect, mean time to respond, and mean time to remediate provide more useful information, although each requires context as well." , source: "Sybex Practice Questions" },
  { id: "book-206", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "Why might a service level agreement cause an organization to delay patching?", options: ["To force vendor compliance", "To remain compliance with licensing", "To achieve organizational governance targets", "To meet performance targets defined by the SLA"], answer: 3, explanation: "Service level agreements (SLAs) often have performance targets like uptime included. Organizations that need to meet an SLA may delay patching to ensure they meet their overall uptime guarantees. SLAs and patching are not typically used to force vendor compliance or to ensure license compliance, nor are they likely to impact organizational governance targets." , source: "Sybex Practice Questions" },
  { id: "book-207", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Ian wants to ensure that patches are installed as part of a baseline for his organization. What type of tool should he invest in as part of his overall action plan for remediation?", options: ["A vulnerability scanner", "A configuration management tool or system", "A baseline configuration scanner", "An endpoint detection and response (EDR) tool"], answer: 1, explanation: "Ian’s desire to ensure patches across his infrastructure points to a need for a configuration management tool that can be used to deploy patches at scale. A vulnerability scanner doesn’t install patches, baseline configuration scanners help determine whether the baseline is being met but won’t help maintain the baseline, and EDR is used to detect malicious software and activity, not to patch or maintain a patch level." , source: "Sybex Practice Questions" },
  { id: "book-208", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "Sally is preparing an incident response report. What part of the report is intended to help organizations understand the outcome of the incident and financial, reputational, or other damages?", options: ["The impact assessment", "The timeline", "The scope", "The recommendations"], answer: 0, explanation: "Impact assessments focus on describing what the incident means to the organization including financial, reputational, or other impacts. Timeline, scope, and recommendations all help describe the incident but don’t focus on impact." , source: "Sybex Practice Questions" },
  { id: "book-209", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Jaime is concerned that her organization may face multiple inhibitors to remediation. Which of the following inhibitors to remediation is most often associated with performance or uptime targets?", options: ["Organizational governance", "Legacy systems", "Memorandums of understanding", "Proprietary systems"], answer: 2, explanation: "Memorandums of understanding (MOUs) are often associated with performance or uptime targets that may not be met if systems are taken offline for patching. Jaime should review her infrastructure designs, MOUs, and patching processes to determine if they are all appropriate to what her organization can accomplish and needs to do to stay secure." , source: "Sybex Practice Questions" },
  { id: "book-210", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "Selah wants to include sections of relevant logs in her incident report. What report section most frequently includes logs?", options: ["In the timeline", "As part of the executive summary", "As evidence in the appendix", "As part of the recommendations"], answer: 2, explanation: "Detailed evidence like logs are typically attached as evidence in an appendix." , source: "Sybex Practice Questions" },
  { id: "book-211", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Danielle has completed her incident report and wants to ensure that her organization benefits from the process. What exercise is most frequently conducted after the report to improve future IR processes?", options: ["Media training", "Government compliance reporting", "A lessons learned exercise", "A mandatory report to auditors"], answer: 2, explanation: "A lessons learned exercise is used to ensure that organizations leverage their findings and experiences from incidents. Media training is useful, and a need for it might be a lesson learned, but it is not a typical follow-up. Reporting to the government or auditors is also not a typical process improvement step after an incident." , source: "Sybex Practice Questions" },
  { id: "book-212", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "What phase of the IR cycle does media training typically occur in?", options: ["Preparation", "Detection and Analysis", "Containment, Eradication, and Recovery", "Post-Incident Activity"], answer: 0, explanation: "Training is most commonly associated with the Preparation phase of the IR life cycle. Conducting media training during an incident is not a common practice." , source: "Sybex Practice Questions" },
  { id: "book-213", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Michelle is performing root cause analysis. Which of the following is not one of the four common steps in an RCA exercise?", options: ["Documenting the root cause analysis using a chart or diagram", "Establishing a timeline of events", "Determining which individual or team was responsible for the problem", "Identifying the problems and events that occurred during the event and describing them as completely as possible"], answer: 2, explanation: "Root cause analysis exercises are not designed or intended to determine who to blame. Instead, they focus on identifying the root cause so that it can be remediated." , source: "Sybex Practice Questions" },
  { id: "book-214", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "The organization that Charles works for has experienced a significant incident. Which of the following is most likely to require the organization to report the incident in a specific timeframe?", options: ["Organizational policy", "Internal governance", "Regulatory compliance", "Media requirements"], answer: 2, explanation: "Internal requirements are unlikely to require an incident report in a specific timeline, as they typically acknowledge the complexity of incident response. While the media may want a report in a specific timeframe, that does not require a response. Instead, of the listed items, regulatory compliance is the primary driver for reporting in a specific timeline for most organizations." , source: "Sybex Practice Questions" },
  { id: "book-215", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "After testing, Jim’s team has determined that installing a patch will result in degraded functionality due to a service being modified. What should Jim suggest to address this inhibitor to remediation?", options: ["Take the change through organizational governance.", "Identify a compensating control.", "Replace the legacy system.", "Update the service level agreement."], answer: 1, explanation: "The best option that Jim has will likely be to identify a compensating control. This may not be a suitable solution in the long term, and Jim’s organization may need to change their service or design to allow for the security fix to be put in place. Organizational governance won’t change the functional impact, no legacy system is mentioned, nor is there an SLA listed in the question." , source: "Sybex Practice Questions" },
  { id: "book-216", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "Which of the following is not a NIST-recommended practice to help with media communication procedures?", options: ["Avoiding media contact throughout IR processes", "Establishing procedures for briefing the media", "Maintaining an IR status document or statement", "Media training"], answer: 0, explanation: "NIST acknowledges the necessity of dealing with the media and recommends media training, establishing procedures for briefing the media, maintaining an IR status document or statement, preparing staff for media contact and requests for information, and holding ongoing practice sessions for incident responders as part of IR exercises." , source: "Sybex Practice Questions" },
  { id: "book-217", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "An incident report is typically prepared in what phase of the NIST incident response cycle?", options: ["Detection and Analysis", "Post-Incident Activity", "Preparation", "Containment, Eradication, and Recovery"], answer: 1, explanation: "Post-Incident Activity typically includes the incident report in the NIST IR life cycle." , source: "Sybex Practice Questions" },
  { id: "book-218", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "The security team that Chris works on has been notified of a zero-day vulnerability in Windows Server that was released earlier in the morning. Chris’s manager asks Chris to immediately check recent vulnerability reports to determine if the organization is impacted. What should Chris tell his manager?", options: ["That the reports will need to be rerun to list the zero-day vulnerability.", "He needs to update the vulnerability scanner to detect the zero-day vulnerability.", "Zero-day vulnerabilities won’t show in previously run vulnerability management reports.", "That zero-day vulnerabilities cannot be detected."], answer: 2, explanation: "Chris knows that a zero-day vulnerability means that the scanner won’t have had a rule or detection profile for the vulnerability. That means that previously run reports and scans won’t show it. It’s possible that their vendor may release a detection profile or rule for the zero-day, but with very little time from release to the request, that is unlikely to have occurred already. Rerunning reports won’t show unknown vulnerabilities, and zero-day vulnerabilities can be detected if there’s a rule." , source: "Sybex Practice Questions" },
  { id: "book-219", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Reporting and Communication", question: "Mikayla’s organization has identified an ongoing problem based on their vulnerability management dashboard reports. Trends indicate that patching is not occurring in a timely manner, and that patches are not being installed for some of the most critical vulnerabilities. What should Mikayla do if she believes that system administrators are not prioritizing patching?", options: ["Engage in awareness, education, and training activities.", "Assess changing business requirements.", "Deploy compensating controls.", "Engage management to punish administrators who are not patching."], answer: 0, explanation: "Mikayla knows that awareness and education are the first step to ensuring that staff are aware of the importance of patching. Her first step should be ensuring appropriate awareness, education, and training are in place. There is no indication of changing business requirements, compensating controls should only be used if they are needed, not as a general practice, and punishment is unlikely to resolve the underlying issues." , source: "Sybex Practice Questions" },
  { id: "book-220", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Reporting and Communication", question: "Geeta’s organization operates a critical system provided by a vendor that specifies that the operating system cannot be patched. What type of solution should Geeta recommend when her vulnerability reporting shows the system is behind on patching and has critical vulnerabilities?", options: ["Mark the vulnerabilities as unable to be remediated and continue operations to ensure business continuity.", "Shut off the system until a solution can be identified.", "Install the operating system patch and test if it causes issues.", "Identify and deploy a compensating control. Performing Forensic Analysis and Techniques for Incident Response"], answer: 3, explanation: "Geeta should identify a compensating control that will appropriately ensure the security of the system with minimal impact to its functionality. Examples might be placing a network firewall logically in front of the device, moving it to an isolated and secured network segment or VLAN, or otherwise adding protection. Marking the vulnerability as unable to be remediated does not protect the system or the company, shutting it off will impact the organization’s ability to function, and installing the patches may cause functional issues or prevent vendor support." , source: "Sybex Practice Questions" },
  { id: "book-221", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Which format does dd produce files in while disk imaging?", options: ["ddf", "RAW", "EN01", "OVF"], answer: 1, explanation: "dd creates files in RAW, bit-by-bit format. EN01 is the EnCase forensic file format, OVF is virtualization file format, and ddf is a made-up answer." , source: "Sybex Practice Questions" },
  { id: "book-222", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Gurvinder has completed his root cause analysis and wants to use it to avoid future problems. What should he document next?", options: ["Lessons learned", "The system architecture diagram", "An updated forensic process", "Current legal holds"], answer: 0, explanation: "Once a root cause analysis is done, lessons learned are often documented to ensure that future similar issues are avoided. Architecture diagrams and updated processes may be part of those lessons learned. A list of current legal holds is not typically part of this process." , source: "Sybex Practice Questions" },
  { id: "book-223", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Mike is conducting a root cause analysis. Which of the following is not a typical phase in the root cause analysis process?", options: ["Identifying contributing factors", "Identifying solutions to the root cause", "Performing a risk analysis", "Implementing controls or fixes to address the root cause"], answer: 2, explanation: "Whereas root cause analysis may involve cost–benefit analysis before controls or fixes are put in place, risk assessment is typically a separate process." , source: "Sybex Practice Questions" },
  { id: "book-224", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Alice wants to copy a drive without any chance of it being modified by the copying process. What type of device should she use to ensure that this does not happen during her data acquisition process?", options: ["A read blocker", "A drive cloner", "A write blocker", "A hash validator"], answer: 2, explanation: "Write blockers ensure that no changes are made to a source drive when creating a forensic copy. Preventing reads would stop you from copying the drive, drive cloners may or may not have write blocking capabilities built in, and hash validation is useful to ensure contents match but don’t stop changes to the source drive from occurring." , source: "Sybex Practice Questions" },
  { id: "book-225", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Frederick’s organization has been informed that data must be preserved due to pending legal action. What is this type of requirement called?", options: ["A retainer", "A legal hold", "A data freeze", "An extra-legal hold"], answer: 1, explanation: "A legal hold is a process used to preserve all data related to pending legal action or when legal action may be expected. A retainer is paid to a lawyer to keep them available for work. The other two terms were made up for this question." , source: "Sybex Practice Questions" },
  { id: "book-226", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "What process is often performed as part of incident response forensic analysis?", options: ["Blame assignment", "Root cause analysis", "Reverse hashing", "Legal holds"], answer: 1, explanation: "A root cause analysis is often performed to identify what went wrong and why. Lessons learned are then identified and applied to ensure the organization doesn’t experience the same issue in the future. Blame assignment is not a part of a forensic procedure and is typically discouraged in most organizations. Reverse hashing isn’t possible, as hashes are oneway functions. Legal holds are associated with legal action, not incident response forensics." , source: "Sybex Practice Questions" },
  { id: "book-227", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Jeff is investigating a system compromise and knows that the first event was reported on October 5. What forensic tool capability should he use to map other events found in logs and files to this date?", options: ["A timeline", "A log viewer", "Registry analysis", "Timestamp validator"], answer: 0, explanation: "Timelines are one of the most useful tools when conducting an investigation of a compromise or other event. Forensic tools provide built-in timeline capabilities to allow this type of analysis." , source: "Sybex Practice Questions" },
  { id: "book-228", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "During her forensic copy validation process, Danielle hashed the original, cloned the image files, and received the following MD5 sums. What is likely wrong? b49794e007e909c00a51ae208cacb169 original.img d9ff8a0cf6bc0ab066b6416e7e7abf35 clone.img", options: ["The original was modified.", "The clone was modified.", "dd failed.", "An unknown change or problem occurred."], answer: 3, explanation: "Since Danielle did not hash her source drive prior to cloning, you cannot determine where the problem occurred. If she had run MD5sum prior to the cloning process as well as after, she could verify that the original disk had not changed." , source: "Sybex Practice Questions" },
  { id: "book-229", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Jennifer wants to perform memory analysis and forensics for Windows, macOS, and Linux systems. Which of the following is best suited to her needs?", options: ["LiME", "DumpIt", "fmem", "The Volatility Framework"], answer: 3, explanation: "The Volatility Framework is designed to work with Windows, macOS, and Linux, and it provides in-depth memory forensics and analysis capabilities. LiME and fmem are Linux tools, whereas DumpIt is a Windows-only tool." , source: "Sybex Practice Questions" },
  { id: "book-230", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "As part of her review of a forensic process, Lisa is reviewing a log that lists each time a person handled a forensic image. She notices that an entry lists forensic analysis actions but does not have a name logged. What concept does this violate?", options: ["Image integrity", "Forensic authenticity", "Preservation", "Chain of custody"], answer: 3, explanation: "Lisa has discovered an issue with chain of custody documentation. Each transfer, forensic action, or other change or event that occurs should be logged as part of a chain of custody." , source: "Sybex Practice Questions" },
  { id: "book-231", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Why is validating data integrity critical to forensic processes?", options: ["It ensures the system has not been compromised.", "It ensures the system has not been altered by the forensic examiner.", "It ensures the operating system version matches the expected version.", "It is required by the legal hold process."], answer: 1, explanation: "Validating data integrity ensures that images or files are forensically sound and have not been altered or modified either on purpose or accidentally during the forensic acquisition and analysis process. It does not ensure the system has not been compromised, and although artifacts can be assessed to validate file versions, typically they are not used to validate operating system versions. Finally, legal holds require data preservation, not data integrity validation." , source: "Sybex Practice Questions" },
  { id: "book-232", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Carl does not have the ability to capture data from a cell phone using mobile forensic or imaging software, and the phone does not have removable storage. Fortunately, the phone was not set up with a PIN or screen lock. What is his best option to ensure he can see email and other data stored there?", options: ["Physical acquisition", "Logical access", "Filesystem access", "Manual access"], answer: 3, explanation: "Manual access is used when phones cannot be forensically imaged or accessed as a volume or filesystem. Manual access requires that the phone be reviewed by hand, with pictures and notes preserved to document the contents of the phone." , source: "Sybex Practice Questions" },
  { id: "book-233", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "What forensic issue might the presence of a program like CCleaner indicate?", options: ["Antiforensic activities", "Full disk encryption", "Malware packing", "MAC time modifications"], answer: 0, explanation: "CCleaner is a PC cleanup utility that wipes Internet history, destroys cookies and other cached data, and can impede forensic investigations. CCleaner may be an indication of intentional antiforensic activities on a system. It is not a full-disk encryption tool or malware packer, nor will it modify MAC times." , source: "Sybex Practice Questions" },
  { id: "book-234", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Which of the following is not a potential issue with live imaging of a system?", options: ["Remnant data from the imaging tool will remain.", "Unallocated space will be captured.", "Memory or drive contents may change during the imaging process.", "Malware may detect the imaging tool and work to avoid it."], answer: 1, explanation: "Unallocated space is typically not captured during a live image, potentially resulting in data being missed. Remnant data from the tool, memory and drive contents changing while the image is occurring, and malware detecting the tool are all possible issues." , source: "Sybex Practice Questions" },
  { id: "book-235", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "During his investigation, Jeff, a certified forensic examiner, is provided with a drive image created by an IT staff member and is asked to add it to his forensic case. What is the most important issue that Jeff could encounter if the case goes to court and his procedures are questioned?", options: ["Bad checksums", "Hash mismatch", "Antiforensic activities", "Inability to certify chain of custody"], answer: 3, explanation: "Jeff did not create the image and cannot validate chain of custody for the drive. This also means he cannot prove that the drive is a copy of the original. Since we do not know the checksum for the original drive, we do not have a bad checksum or a hash mismatch—there isn’t an original to compare it to. Antiforensic activities may have occurred, but we cannot determine that from the question." , source: "Sybex Practice Questions" },
  { id: "book-236", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Jeff is investigating a system that is running malware that he believes encrypts its data on the drive. What process should he use to have the best chance of viewing that data in an unencrypted form?", options: ["Live imaging", "Offline imaging", "Brute-force encryption cracking", "Causing a system crash and analyzing the memory dump"], answer: 0, explanation: "Imaging the system while the program is live has the best probability of allowing Jeff to capture the encryption keys or decrypted data from memory. An offline image after the system is shut down will likely result in having to deal with the encrypted file. Brute-force attacks are typically slow and may not succeed, and causing a system crash may result in corrupted or nonexistent data." , source: "Sybex Practice Questions" },
  { id: "book-237", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Susan needs to capture network traffic from a Linux server that does not use a GUI. What packet capture utility is found on many Linux systems and works from the command line?", options: ["tcpdump", "netdd", "Wireshark", "Snifman"], answer: 0, explanation: "The tcpdump utility is a command-line packet capture tool that is found on many Linux systems. Wireshark is a GUI tool available for most operating systems. Netdd and snifman were made up for this question." , source: "Sybex Practice Questions" },
  { id: "book-238", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "During a forensic investigation, Ben asks Chris to sit with him and to sign off on the actions he has taken. What is he doing?", options: ["Maintaining chain of custody", "Over-the-shoulder validation", "Pair forensics", "Separation of duties"], answer: 0, explanation: "Ben is maintaining chain of custody documentation. Chris is acting as the validator for the actions that Ben takes and acts as a witness to the process." , source: "Sybex Practice Questions" },
  { id: "book-239", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Which tool is not commonly used to generate the hash of a forensic copy?", options: ["MD5", "FTK", "SHA1", "AES"], answer: 3, explanation: "While AES does have a hashing mode, MD5, SHA1, and built-in hashing tools in FTK and other commercial tools are more commonly used for forensic hashes." , source: "Sybex Practice Questions" },
  { id: "book-240", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Which of the following issues makes both cloud and virtualized environments more difficult to perform forensics on?", options: ["Other organizations manage them.", "Systems may be ephemeral.", "No forensic tools work in both environments.", "Drive images cannot be verified."], answer: 1, explanation: "Both cloud and virtualized environments are often temporary (ephemeral) and thus can be difficult to perform forensics on. If you have a cloud, virtualized, or containerized environment, make sure you have considered how you would perform forensics, and what data preservation techniques you may need to use." , source: "Sybex Practice Questions" },
  { id: "comptia-1", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "A cybersecurity analyst is doing triage in a SIEM and notices that the time stamps between the firewall and the host under investigation are off by 43 minutes. Which of the following is the most likely scenario occurring with the time stamps?", options: ["The NTP server is not configured on the host.", "The cybersecurity analyst is looking at the wrong information.", "The firewall is using UTC time.", "The host with the logs is offline."], answer: 0, explanation: "A 43-minute offset is a strong indicator of unsynchronized clocks, most likely because NTP is not configured on the host. Time synchronization is critical for accurate log correlation in a SIEM.", source: "CompTIA Practice Questions" },
  { id: "comptia-2", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "An analyst receives an alert from the EDR indicating a user has downloaded a malicious file that is attempting to compromise the laptop. The analyst gathers file attribute values (long hexadecimal strings) for zipcontainer.dll, xwizard.dtd, and svch0st.exe after isolating the machine to determine which file was in fact malicious. Which of the following techniques is the analyst using to identify the files?", options: ["Hashing", "File extensions", "Pattern recognition", "Interpreting commands"], answer: 0, explanation: "The long hexadecimal values shown are cryptographic hashes (e.g., MD5/SHA) used to uniquely identify and verify files, which is the technique being used here.", source: "CompTIA Practice Questions" },
  { id: "comptia-3", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "An organization's security operations team has been experiencing issues with fake news events about potential cyberattacks that could impact the organization's systems. Which of the following is the most trusted source for gathering threat intelligence?", options: ["Popular hacker blogs", "Industry-related government bulletins", "Cybersecurity social media groups", "Dark web cyber resource groups"], answer: 1, explanation: "Government bulletins (e.g., CISA advisories) are official, vetted sources of threat intelligence, making them more trustworthy than blogs, social media, or dark web sources, which can spread unverified or misleading information.", source: "CompTIA Practice Questions" },
  { id: "comptia-4", domain: "Security Operations", objectiveId: "1.5", topic: "Efficiency & Process Improvement in Security Operations", question: "A SOC analyst determined that a significant number of the reported alarms could be closed after removing the duplicates. Which of the following could help the analyst reduce the number of alarms with the least effort?", options: ["SOAR", "API", "XDR", "REST"], answer: 0, explanation: "A SOAR (Security Orchestration, Automation, and Response) platform can automatically deduplicate and correlate alerts, reducing alarm volume with minimal manual analyst effort.", source: "CompTIA Practice Questions" },
  { id: "comptia-5", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Recommend Controls to Mitigate Attacks & Vulnerabilities", question: "A manufacturing company's assembly line machinery only functions on an end-of-life OS. Consequently, no patches exist for several highly exploitable OS vulnerabilities. Which of the following is the best mitigating control to reduce the risk of these current conditions?", options: ["Enforce strict network segmentation to isolate vulnerable systems from the production network.", "Increase the system resources for vulnerable devices to prevent denial of service.", "Perform penetration testing to verify the exploitability of these vulnerabilities.", "Develop in-house patches to address these vulnerabilities."], answer: 0, explanation: "Since patches aren't available for the EOL OS, network segmentation is the best compensating control—it isolates the vulnerable systems and limits an attacker's ability to reach or pivot from them.", source: "CompTIA Practice Questions" },
  { id: "comptia-6", domain: "Incident Response", objectiveId: "3.1", topic: "Attack Methodology Frameworks", question: "Which of the following would a security analyst most likely use to compare TTPs between different known adversaries of an organization?", options: ["MITRE ATT&CK", "Cyber Kill Chain", "OWASP", "STIX/TAXII"], answer: 0, explanation: "MITRE ATT&CK is a knowledge base that catalogs adversary tactics, techniques, and procedures (TTPs), making it the go-to framework for comparing TTPs across different threat actors.", source: "CompTIA Practice Questions" },
  { id: "comptia-7", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "During a cybersecurity incident, one of the web servers at the perimeter network was affected by ransomware. Which of the following actions should be performed immediately?", options: ["Shut down the server.", "Reimage the server.", "Quarantine the server.", "Update the OS to latest version."], answer: 2, explanation: "Quarantining (isolating) the server immediately contains the ransomware and prevents further spread, while preserving the system state for investigation—unlike shutting it down, which can destroy volatile evidence.", source: "CompTIA Practice Questions" },
  { id: "comptia-8", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "During which of the following incident response phases would root cause analysis occur?", options: ["Post-incident activity", "Containment, eradication, and recovery", "Preparation", "Detection and analysis"], answer: 0, explanation: "Root cause analysis is part of the post-incident activity (lessons learned) phase, where the team reviews what happened and why to improve future response.", source: "CompTIA Practice Questions" },
  { id: "comptia-9", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "Which of the following is the best action to take after the conclusion of a security incident to improve incident response in the future?", options: ["Develop a call tree to inform impacted users.", "Schedule a review with all teams to discuss what occurred.", "Create an executive summary to update company leadership.", "Review regulatory compliance with public relations for official notification."], answer: 1, explanation: "A lessons-learned review with all involved teams is the best way to capture what happened and identify improvements for future incident response.", source: "CompTIA Practice Questions" },
  { id: "comptia-10", domain: "Incident Response", objectiveId: "3.2", topic: "Containment, Eradication, and Recovery", question: "An analyst is remediating items associated with a recent incident. The analyst has isolated the vulnerability and is actively removing it from the system. Which of the following steps of the process does this describe?", options: ["Eradication", "Recovery", "Containment", "Preparation"], answer: 0, explanation: "Eradication is the step where the root cause (e.g., malware, vulnerability) is actively removed from the environment, following containment/isolation.", source: "CompTIA Practice Questions" },
  { id: "quizlet-1", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Vulnerability Management Reporting & Communication", question: "What should organizations prioritize when selecting tools for vulnerability reporting?", options: ["The cost of the tools", "The reporting needs of the organization", "The complexity of the tools", "The number of vulnerabilities identified"], answer: 1, explanation: "Organizations should prioritize their reporting needs over cost, complexity, or the number of vulnerabilities identified when selecting vulnerability reporting tools. This includes considering specific requirements such as data type, organization size, and available resources.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-2", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "You are using Wireshark to capture packets on your company network, analyzing traffic to a web server before it is put into production and looking for security risks. The capture shows the username and password parameters being transferred in cleartext at login. What should you tell the project manager about whether to launch the new site?", options: ["Tell them the username and password parameters are being transferred in cleartext at login.", "Tell them the user_token field is using a generic token and needs to be updated.", "Tell them to change the password for the admin user to something stronger.", "Tell them the site is ready to go with no reason to delay launch."], answer: 0, explanation: "The site is not ready to launch because credentials are being transferred in cleartext rather than hashed/encrypted. Changing the password would not fix this, since the new password would also be sent in cleartext.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-3", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Incident Response Reporting & Communication", question: "A company has just experienced a data breach that exposed sensitive customer information. The security team has determined that the breach likely originated from a specific IP address. What entity should the company notify in this situation?", options: ["Information technology team", "Public relations team", "Law enforcement", "Legal team"], answer: 2, explanation: "Law enforcement should be notified because they have the resources and legal authority to investigate cybercrimes, including complex data breach cases. The legal and PR teams play supporting roles, but investigating and pursuing the attacker is not their primary function.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-4", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "A security analyst is working to discover zero-day attacks before the system is compromised. What is one method for discovering these types of attacks that the security analyst should try?", options: ["Rely on the signature-based antivirus program to update its database.", "Train the network's users to change their passwords regularly and require them to report any password breaches as soon as they are aware of them.", "Regularly run a signature-based antivirus program scan.", "Write rules in a program like YARA that recognizes similar patterns of code found in other malware and flags them if they interact with the system."], answer: 3, explanation: "YARA rules can identify new malware samples by matching patterns and strings to known malware code, detecting a threat before its signature exists in an antivirus database. Signature-based scanning alone cannot catch zero-days.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-5", domain: "Security Operations", objectiveId: "1.2", topic: "Analyze Indicators of Potentially Malicious Activity", question: "A security analyst needs to analyze alert data over a period of time to determine what might be happening, establish patterns to predict future events, and improve the security baseline. Which of the following methods would meet these analysis requirements?", options: ["Heuristic", "Anomaly-based", "Signature detection", "Trend"], answer: 3, explanation: "Trend analysis looks at data over time — frequency, volume, and statistical deviations — to find patterns and predict future events. Heuristic/anomaly-based analysis compares activity to a baseline in real time rather than analyzing trends over time, and signature detection matches known patterns in a database.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-6", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "A company experiences a severe security incident where an attacker accesses and steals sensitive information from its servers. The incident response team investigates and performs a root cause and forensic analysis. What will the company gain from conducting the forensic analysis specifically?", options: ["To restore services and systems as quickly as possible", "To identify areas for improvement in the incident response plan", "To gather evidence", "To identify the initial entry point of the attack"], answer: 2, explanation: "Forensic analysis is primarily conducted to collect and analyze evidence associated with a security incident, such as identifying the attacker and determining what data was compromised. Identifying the entry point and improving the IR plan are related but separate goals of root cause analysis and post-incident review.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-7", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "A multinational corporation wants to enhance its incident response capabilities and ensure continuous improvement in the process. What should the SOC focus on to achieve this objective?", options: ["Conduct security training", "Review playbooks", "Conduct post-incident reviews", "Implement a threat intelligence program"], answer: 2, explanation: "Post-incident reviews involve analyzing the incident response process, identifying areas of improvement, and implementing changes to enhance the team's effectiveness — this is the core mechanism for continuous improvement, more so than training, playbook review, or threat intel alone.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-8", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "Which options differentiate an incident response plan from a business continuity/disaster recovery (BC/DR) plan?", options: ["An incident response plan minimizes the impact of security incidents on the organization, while a BC/DR plan maintains essential business functions during a disruption.", "An incident response plan restores normal business operations as quickly as possible, while a BC/DR plan identifies and mitigates risks to the organization.", "An incident response plan and a BC/DR plan are the same thing.", "An incident response plan is only used after a BC/DR plan has failed."], answer: 0, explanation: "An incident response plan focuses on minimizing the impact of security incidents, while a BC/DR plan focuses on maintaining essential business functions during a disruption. They are distinct plans with different primary objectives.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-9", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "A security analyst is reviewing a vulnerability report and notices that the same vulnerability has been present in the same system for the past three months. What does this indicate?", options: ["A configuration management issue", "Lack of vulnerability management tools", "Inadequate training and awareness", "A recurring vulnerability trend"], answer: 3, explanation: "The recurring presence of the same vulnerability on the same system over multiple reporting periods indicates a recurring vulnerability trend that the analyst must address to reduce risk, rather than a specific training, tooling, or configuration management failure (though those could be contributing causes).", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-10", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "Which of the following malware detection methods establishes a baseline for a system and then alerts the user if any suspicious changes occur, but cannot distinguish whether a change is from malware, a system failure, or another cause?", options: ["YARA rule writing", "Code emulation", "Integrity checking", "Interception"], answer: 2, explanation: "Integrity checking establishes a system baseline and alerts on suspicious changes, but cannot determine the cause of the change. Code emulation runs code in a virtual environment to catch polymorphic malware, interception blocks risky requests like logic bombs/Trojans, and YARA rule writing matches known malware patterns.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-11", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "A tech startup suffers a cyberattack that steals intellectual property and defaces its website. The enraged CEO directs the cybersecurity team to \"hit the attackers hard!\" What process is the CEO directing the team to undertake?", options: ["Vulnerability management", "Risk management", "Security engineering", "Active defense"], answer: 3, explanation: "Active defense is the most offensive cyber defense strategy, using offensive actions to outmaneuver an adversary and increase the likelihood that attackers make mistakes and expose their methods. Vulnerability and risk management don't address an ongoing breach, and security engineering focuses on designing secure features rather than responding to an active attacker.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-12", domain: "Security Operations", objectiveId: "1.2", topic: "Analyze Indicators of Potentially Malicious Activity", question: "Which of the following BEST describes MAC spoofing?", options: ["Driving around in a car and searching for wireless networks that allow MAC addresses to be captured.", "Configuring a network card to run in promiscuous mode, allowing MAC addresses to be captured.", "The process of sending many Ethernet frames, each containing different source MAC addresses, to a switch.", "Changing a hacker's network card to match a legitimate address being used on a network."], answer: 3, explanation: "MAC spoofing is changing a network interface card's MAC address to a different, legitimate MAC address to impersonate another computer or disguise the source of a transmission. Sending many frames with different source MACs is MAC flooding, not spoofing, and promiscuous mode/wardriving describe different techniques entirely.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-13", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "A support technician conducts system hardening after provisioning a server. Why is system hardening such a vital practice? (Select three.)", options: ["System hardening eliminates the need for employee security training.", "System hardening involves patching the operating system.", "System hardening reduces the attack surface of a system.", "System hardening eliminates monitoring software.", "System hardening stores operating system configuration information.", "System hardening includes configuring security policies.", "System hardening includes disabling unnecessary services."], answer: [1, 2, 6], explanation: "The purpose of system hardening is to reduce the attack surface of a system. Hardening involves enabling or disabling specific features and restricting access to sensitive areas of the system, such as protected operating system files, the Windows Registry, configuration files, and logs. System hardening includes making many changes to a system, such as disabling unnecessary services. Best-practice hardening configurations can be very complex. Patching the operating system is one of many procedures that can take place while hardening a system. System hardening does not eliminate monitoring software — installing monitoring software to protect against malware and intrusions is a component of system hardening. The Windows Registry is a database for storing operating system, device, and software application configuration information; it is not a system hardening tool. Although system hardening does help with reducing network and device vulnerabilities, it does not replace the need for employee security training. System hardening does not normally include the task of configuring security policies for the network.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-14", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "A network engineer is gathering requirements from a security operations center (SOC) analyst. Which of the following requirements might lead the engineer to suggest deploying a honeypot? (Select two.)", options: ["Analysts need to track the attacker's email and text messages.", "Analysts need the ability to code in eXtensible Markup Language (XML).", "The organization needs to minimize human interaction through orchestration.", "Network defenders need the ability to observe attacks on the network.", "The organization needs to regularly develop new indicators of compromise (IoCs) and indicators of attack (IoAs) based on the attacks they are experiencing."], answer: [3, 4], explanation: "A honeypot is a fake file, host, or network designed to lure an attacker away from legitimate assets so defenders can observe attacks and develop new IoCs/IoAs based on what they see. It does not give access to an attacker's email/texts, XML coding ability is unrelated, and minimizing human interaction describes SOAR, not honeypots.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-15", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "A company's security team has identified several indicators of compromise (IoCs) in its system logs, including unusual network traffic and the presence of a suspicious file on a system. What actions can the team take to respond to these IoCs? (Select two.)", options: ["The team can conduct network traffic analysis to identify the source and destination of the unusual traffic and any associated systems and users.", "The team can notify all employees of the security incident and advise them to be cautious when opening emails or accessing websites.", "The team can update the antivirus software on all systems to detect and prevent any further malware infections.", "The team can quarantine and analyze the suspicious file to identify any malware or other security threats it may contain.", "The team can create proper documentation regarding the incident, the response, and any recommendations for future action."], answer: [0, 3], explanation: "Network traffic analysis identifies the source/destination of unusual traffic and affected systems/users, while quarantining and analyzing the suspicious file identifies what threat it contains and isolates it from further damage. Updating antivirus, notifying employees, and documentation are all reasonable follow-ups but not the direct response to the specific IoCs described.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-16", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Which of the following are security benefits of using software-defined networking (SDN) and virtualization in a network environment? (Select two.)", options: ["Improved network performance through optimized routing", "Simplified network segmentation and isolation for easier threat containment", "Enhanced network security through hardware-based firewalls", "Increased network agility for faster deployment of security controls", "An easier transition to a cloud computing network architecture"], answer: [1, 3], explanation: "SDN and virtualization simplify network segmentation/isolation (easier threat containment) and increase network agility for faster deployment of security controls. SDN improves security through centralized management rather than hardware-based firewalls, and while it can improve performance and ease cloud transitions, those are not its primary security benefits.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-17", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "A company has tasked a network administrator with implementing vulnerability scanning methods to ensure the security of the company's network. The administrator decides to begin with asset discovery and device fingerprinting. How does this help with securing the company's network? (Select two.)", options: ["It identifies vulnerabilities within the network.", "It identifies all employees who are connected to the network.", "It identifies the purpose, vendor, software, and configuration of each device on the network.", "It identifies the tampering of network and wireless equipment and computers.", "It detects malware and other malicious software on the network."], answer: [0, 2], explanation: "Asset discovery and device fingerprinting identify potential vulnerabilities and reveal the purpose, vendor, software, and configuration of each device on the network. They don't identify individual employees, detect malware directly, or specifically identify hardware tampering (though fingerprinting can support that separately).", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-18", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Designing a Vulnerability Management Program", question: "An information security project manager of a large software firm is researching alternative vulnerability scanners for the security operations center's reduced budget and proposes several free, open-source software (FOSS) options. Which of these vulnerability scanners fits the needs of the enterprise business? (Select two.)", options: ["SecurityScorecard", "Qualys", "Nessus", "OpenSCAP", "OpenVAS"], answer: [3, 4], explanation: "OpenSCAP and OpenVAS are both free, open-source vulnerability scanners capable of CVSS scoring. Nessus is commercial for enterprise use (free only for home users), Qualys is a commercial cloud-based platform, and SecurityScorecard is a paid cloud-based solution.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-19", domain: "Security Operations", objectiveId: "1.2", topic: "Analyze Indicators of Potentially Malicious Activity", question: "A security analyst is going through systems looking for potential misconfigurations. What are some key items the analyst should search for while misconfiguration hunting? (Select three.)", options: ["Open ports", "Unpatched software", "New user creation", "Weak passwords", "Isolated networks", "Money transfer", "Physical access points"], answer: [0, 1, 3], explanation: "Open ports, unpatched software, and weak passwords are all key items to search for during misconfiguration hunting — each can be exploited by attackers. New user creation and money transfer relate to business-critical asset hunting, isolated networks and physical access points relate to isolated-network hunting, not general misconfiguration hunting.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-20", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Incident Response Reporting & Communication", question: "The economic impact of an incident can be tangible or intangible. Which of the following costs would be considered intangible? (Select two.)", options: ["Lost data", "Loss of potential customers", "Damage to reputation", "Damaged hardware", "Stolen passwords"], answer: [1, 2], explanation: "Intangible costs are difficult to pinpoint and quantify, such as loss of potential customers and damage to reputation. Tangible costs — lost data, damaged hardware, and stolen passwords — can be easily identified and quantified.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-21", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Incident Response Reporting & Communication", question: "The recommendations in your IR report include details about what to do in response to the incident. Which of the following should be important characteristics of your response recommendations? (Select two.)", options: ["Measureable", "Actionable", "Specific", "Trackable", "Illustrated"], answer: [1, 2], explanation: "IR report recommendations must be specific and actionable. Once decisions are made, the resulting actions should be measurable and trackable to confirm completion, but \"specific\" and \"actionable\" are the defining characteristics of the recommendations themselves.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-22", domain: "Security Operations", objectiveId: "1.2", topic: "Analyze Indicators of Potentially Malicious Activity", question: "Which of the following statements are true when describing Heuristic analysis? (Select two.)", options: ["Analyzes data over a period of time to establish patterns.", "Looks at frequency, volume, and statistical deviations data.", "Requires little human interaction.", "Triggers an alert when any activity falls outside a baseline.", "Involves security teams analyzing logs and data."], answer: [2, 3], explanation: "Heuristic (statistical anomaly-based) analysis requires little human interaction and triggers an alert when activity falls outside an established baseline. Analyzing data over time to find patterns, and looking at frequency/volume/statistical deviations, describe trend analysis instead.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-23", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "Attackers often target data and intangible assets. What might hackers do with the information they collect? (Select two.)", options: ["Stage an on-path attack", "Hijack DNS", "Damage or disable a firewall", "Harm a company's reputation", "Sell the data to the competition"], answer: [3, 4], explanation: "Attackers profit from stolen information by selling it to competitors, and hacktivists in particular seek to harm a company's reputation by leaking embarrassing data. Staging on-path attacks, hijacking DNS, or disabling a firewall are techniques used to gain access to data in the first place, not things done with data already collected.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-24", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "A project manager is overseeing a new device management system deployment that comes with the added benefit of keeping devices current. What would this type of system allow the company to accomplish?", options: ["Changing business requirements", "Compensating controls", "Patching", "Awareness training"], answer: 2, explanation: "Device management systems can automate and streamline the patching process, which is often the first line of defense against exploited software vulnerabilities.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-25", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Vulnerability Management Reporting & Communication", question: "Which of the following statements is true concerning the use of top 10 style lists?", options: ["They are useful for developing policies and procedures but not effort prioritization.", "They are ineffective when used in a detailed report.", "They provide an exhaustive list of all potential problems.", "They allow for a quick and easy overview of important activities and trends."], answer: 3, explanation: "Top 10 lists give a quick, easy overview of important activities and trends, useful in both summary and detailed reports and for prioritizing effort — they aren't exhaustive.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-26", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "A cybersecurity analyst at a large organization is working on improving techniques for identifying malicious activity on the company's network. Which actions should the analyst prioritize to enhance their ability to detect and respond to potential threats?", options: ["Deploy additional firewalls throughout the network.", "Implement stronger password policies.", "Conduct regular penetration testing of web applications.", "Implement network traffic analysis and threat hunting."], answer: 3, explanation: "Network traffic analysis and threat hunting, guided by frameworks like OSSTMM and MITRE ATT&CK, directly target the goal of identifying malicious activity — more firewalls, password policy, or pen testing don't align as closely with that specific objective.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-27", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Recommend Controls to Mitigate Attacks & Vulnerabilities", question: "The CISO has informed a security analyst that an attacker has compromised a critical system through an unpatched vulnerability. The analyst recommends implementing compensating controls and isolating the system. How can the security analyst use compensating controls in this scenario?", options: ["To patch the unpatched vulnerability and prevent the attacker from accessing the system again", "To isolate the compromised system and prevent the attacker from exploiting the vulnerability again", "To provide additional security controls to the compromised system and prevent future attacks", "To monitor and detect further intrusion attempts (but not isolate the compromised system)"], answer: 1, explanation: "Compensating controls here are used to isolate the compromised system and prevent further exploitation of the unpatched vulnerability — they compensate for the missing patch rather than replacing it or serving as general monitoring.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-28", domain: "Security Operations", objectiveId: "1.2", topic: "Analyze Indicators of Potentially Malicious Activity", question: "Behavioral threat research combines IoCs to show patterns and techniques used in previous attacks. Which of the following threat indicators is normally associated with a denial-of-service (DoS) attack?", options: ["Rapidly changing domain IP addresses", "Port hopping", "High memory usage", "IP addresses from unusual geographic locations"], answer: 3, explanation: "IP addresses from unusual geographic locations is normally an indicator of a DoS attack. High memory usage typically indicates a virus, while port hopping and rapidly changing domain IPs are typically APT indicators.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge", confidence: "low" },
  { id: "quizlet-29", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "A security administrator has identified a critical vulnerability in a computer system. They know the vulnerability can be fixed by applying a patch but are hesitant. What could be the possible inhibitor to vulnerability remediation in this scenario?", options: ["Organizational governance", "Service-level objectives", "Business process interruption", "Legacy systems"], answer: 3, explanation: "Legacy systems are difficult to update and maintain, and applying a patch could risk business process interruption or degraded functionality — making them a common inhibitor to remediation.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-30", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "A software developer is working on a Linux-based application and encounters an unexpected issue in the code execution, needing to inspect the runtime state and modify the program's execution flow. Which of the following tools is BEST suited for this task?", options: ["Cuckoo", "GNU debugger", "Tcpdump", "Wireshark"], answer: 1, explanation: "The GNU Debugger (GDB) is built for examining and debugging Linux applications, inspecting runtime state, and altering execution flow. Tcpdump and Wireshark are network traffic tools, and Cuckoo is a malware sandbox.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-31", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "A system administrator is looking for a process that reduces the time and resources required to keep the company network up to date with the latest patches and configurations. Which of the following is specifically designed to meet the administrator's requirements?", options: ["Centralized operating system, application, and device management", "Awareness training", "Compensating controls", "Patching and policies"], answer: 0, explanation: "Centralized OS, application, and device management lets administrators manage patches and configurations for multiple systems from a single location, directly reducing the time and resources required.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-32", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Vulnerability Scanning Methods & Concepts", question: "Select the ISO 27k standard number that focuses on personal data and privacy.", options: ["27017", "27018", "27701", "27002"], answer: 2, explanation: "ISO/IEC 27701 extends the ISO 27001/27002 framework specifically to cover personal data and privacy management. 27002 defines general security controls, and 27017/27018 focus on cloud security.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-33", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Vulnerability Management Reporting & Communication", question: "Which of the following is a benefit of vulnerability management reporting?", options: ["Reduced response time to cyber threats", "Higher risk of cyberattacks", "Increased complexity of IT infrastructure", "Decreased awareness of potential weaknesses in systems"], answer: 0, explanation: "Vulnerability management reporting improves an organization's response to cyber threats by helping identify and respond to security incidents efficiently, reducing response time — the other options run counter to its purpose.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge", confidence: "low" },
  { id: "quizlet-34", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "A security administrator is conducting a digital forensic investigation and has found evidence on an employee's work computer that could be used in a legal case against the employee. What next step should the security administrator take in handling this evidence?", options: ["Ignore the evidence and continue the investigation.", "Secure the evidence and notify the legal department.", "Share the evidence with the employee's coworkers for their input.", "Report the employee to management and terminate their employment."], answer: 1, explanation: "When evidence could be part of a legal case, it should be secured and the legal department notified so they can determine the appropriate next steps and ensure proper collection/handling — sharing it with coworkers or terminating employment aren't the immediate next step.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-35", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "Which command is included in C/C++ and allows a string to be copied in code, but can be exploited to carry out overflow attacks because it doesn't check for buffer boundaries?", options: ["ls -l", "strcpy", "icacls", "chmod"], answer: 1, explanation: "strcpy copies strings without checking whether the data being copied overwrites buffer boundaries, making it exploitable for overflow attacks. icacls and chmod are permission tools, and ls -l lists file permissions.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-36", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "Which of the following tools will allow a security analyst to run the module auxiliary/admin/networking/cisco_secure_acs_bypass to scan for vulnerabilities on a Cisco device?", options: ["Metasploit Framework", "Nmap", "Recon-ng", "Pacu"], answer: 0, explanation: "The Metasploit Framework organizes exploit/auxiliary modules using paths like auxiliary/admin/networking/cisco_secure_acs_bypass. Nmap is a port scanner, Recon-ng is an OSINT framework, and Pacu targets AWS environments.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-37", domain: "Vulnerability Management", objectiveId: "2.2", topic: "Analyze Output from Vulnerability Assessment Tools", question: "An unauthenticated attacker exploited a company's web portal after noticing the system had a default database account still enabled, and authenticated using default credentials to steal data. What kind of web application vulnerability did the attacker exploit?", options: ["Broken access control", "Software and data integrity failures", "Security misconfiguration", "Injection"], answer: 2, explanation: "A default account left active is a classic security misconfiguration — configuring a system insecurely, such as using default credentials. Broken access control involves manipulating authorized access paths, and injection involves inserting malicious code/commands.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-38", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Two regular users should have Read/Write permissions to a storage share; two others were given access for a specific project but should have had Write permissions removed afterward. What is it called when permissions are given for a task but never removed when no longer required?", options: ["Privilege creep", "Account elevation", "Privilege elevation", "SAM database creep"], answer: 0, explanation: "Privilege creep is the gradual accumulation of permissions beyond what a person needs to do their job, exactly as described — access granted for a project that was never revoked.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-39", domain: "Security Operations", objectiveId: "1.2", topic: "Analyze Indicators of Potentially Malicious Activity", question: "A security analyst discovers that an attacker is attempting to launch a distributed denial-of-service (DDoS) attack on the company's network. What action should the security analyst take to prevent the DDoS attack from succeeding?", options: ["Configure the router to limit the amount of traffic coming from the attacker's IP address", "Implement a firewall to block traffic from the attacker's IP address", "Shut down the server until the attacker is identified", "Add more bandwidth to the server to handle the increased traffic"], answer: 0, explanation: "Rate-limiting traffic from the attacker's IP at the router prevents the attacker from overwhelming the server. Adding bandwidth could make things worse by giving the attacker more resources to consume, and shutting the server down just causes the downtime the attack is trying to cause.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-40", domain: "Security Operations", objectiveId: "1.5", topic: "Efficiency & Process Improvement in Security Operations", question: "An organization's cybersecurity staff needs to be competent at their jobs or serious consequences can occur. Which of the following is an important component to staying up to date and honing a team's cybersecurity skills?", options: ["Device reconfiguration", "Activity registration", "Training", "Outsourcing"], answer: 2, explanation: "Defensive and offensive cybersecurity techniques constantly change, so ongoing training and practice exercises are essential for a team to stay current — outsourcing wouldn't keep the internal team's skills sharp.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-41", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Vulnerability Scanning Methods & Concepts", question: "An analyst reviews an alert detecting a rogue backend server deployed behind the company's load balancer, and the DMZ firewall blocks the analyst's attempt to identify the possible threat. What process was the analyst using to identify where the device was connected on the network?", options: ["Discovery scan", "Dynamic analysis", "Vulnerability scan", "Device fingerprinting"], answer: 0, explanation: "A discovery (map) scan identifies devices connected to a network or segment. Device fingerprinting focuses on a single already-found device, vulnerability scans look for weaknesses rather than connectivity, and dynamic analysis is a code-testing technique.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-42", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "A security analyst who has discovered a data breach on an organization's network has also identified the source of the attack and must now remediate the issue. What is the BEST course of action for the analyst to take for remediation?", options: ["The analyst should ignore the issue and hope it doesn't happen again.", "The analyst should immediately shut down the affected system to prevent further damage.", "The analyst should patch the affected system to prevent the vulnerability from being exploited again.", "The analyst should restore the system from a backup taken prior to the attack."], answer: 2, explanation: "Patching the affected system addresses the root cause of the breach. Shutting the system down doesn't fix the underlying vulnerability, restoring from backup may not be feasible or address the root cause, and ignoring the issue leaves the system exposed.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-43", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Recommend Controls to Mitigate Attacks & Vulnerabilities", question: "Which of the following is the MOST effective first step that an organization can do when using the CIS Benchmarks?", options: ["Incorporate the benchmarks into their cybersecurity program.", "Determine the best way to implement the benchmarks.", "Monitor the network based on the benchmarks.", "Identify the specific benchmarks most relevant to them."], answer: 3, explanation: "Organizations should first identify which specific CIS Benchmarks are relevant to them, then determine implementation, then incorporate them into the program, and finally monitor based on them — identification comes first.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-44", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "The CISO received a legal request to preserve an employee's data under investigation for insider trading, kept under legal hold until the investigation concludes. Which of the following is true regarding the chain of custody in this scenario?", options: ["Chain of custody refers to the process of analyzing digital evidence to identify the source and cause of a security incident.", "Chain of custody refers to the security controls implemented to protect evidence from unauthorized access, modification, or deletion.", "Chain of custody is the documentation of evidence movement from one person to another, including who had custody of the evidence, when and why they transferred it, and what they did with it.", "Chain of custody refers to the process of restoring data from backup after a security incident."], answer: 2, explanation: "Chain of custody is specifically the documentation trail of who held evidence, when, why, and what was done with it — not the analysis itself, the protective controls around it, or backup restoration.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-45", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "A network engineer wants to simplify network and security services. How could Secure Access Service Edge (SASE) help to simplify these services for the engineer?", options: ["It combines network and security functions into a single cloud-hosted service.", "It offers elementary features.", "It blocks the remote manage of networks and systems.", "It requires dedicated hardware."], answer: 0, explanation: "SASE simplifies management by combining networking and security functions into a single cloud-hosted service, eliminating the need for dedicated hardware and enabling — not blocking — remote management.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-46", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "Which of the following is the core purpose of CCMSs (centralized configuration management systems)?", options: ["Reduced time and resources", "Automated deployment of patches and configurations", "System reliability", "Endpoint configuration and control"], answer: 3, explanation: "Endpoint configuration and control is the core purpose of a CCMS. Reduced time/resources, automated patch deployment, and system reliability are all resulting advantages, but not the core purpose itself.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-47", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Vulnerability Management Reporting & Communication", question: "A company's compliance team identifies a security vulnerability and presents it to the risk management team, who creates a response plan. What is the next best step in the process?", options: ["The compliance team creates policies to prevent future vulnerabilities.", "The governance team approves and codifies the response plan in policy documents.", "The risk management team presents the response plan to the board of directors.", "The technical team immediately implements the response plan."], answer: 1, explanation: "The governance team must approve and codify the response plan into policy documents to ensure compliance and enforcement before the technical team implements it or it goes to the board.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-48", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "You entered your password on a website and are sent a code to your cell phone. Which of the following is this an example of?", options: ["SSO", "SP", "MFA", "IDP"], answer: 2, explanation: "Requiring a password plus a code sent to a separate device is multi-factor authentication (MFA) — a knowledge factor plus a possession factor. SSO lets you sign in once for multiple services; SP/IDP are federation roles, not authentication factors.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-49", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Incident Response Reporting & Communication", question: "There are several types of breaches that may require outside reporting to customers, media, and the government. One type occurs if a device is lost or stolen. Which type of breach does this MOST likely describe?", options: ["Device theft or loss", "Integrity/availability", "Data exfiltration", "Accidental data breach"], answer: 0, explanation: "Device theft or loss is its own breach category and must be treated as a suspected breach even with encryption/strong authentication in place — distinct from exfiltration, integrity/availability attacks, or accidental breaches from employee error.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-50", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "A cybersecurity analyst is working to identify active threats within their organization and needs to preserve certain data and logs for potential legal proceedings while continuing the investigation. Which action should the analyst take?", options: ["Share the relevant data and logs with the legal department for review.", "Conduct a full system backup, including all data and logs.", "Implement a legal hold on the relevant data and logs.", "Archive the relevant data and logs on an encrypted external storage device."], answer: 2, explanation: "A legal hold ensures the relevant data and logs are preserved and protected from alteration or deletion for potential legal proceedings, while allowing the investigation to continue — a full backup or archiving doesn't specifically guarantee that preservation.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-51", domain: "Vulnerability Management", objectiveId: "2.3", topic: "Analyzing Vulnerability Scans", question: "A security analyst is evaluating the company's vulnerability management program in a mixed infrastructure environment. Which of the following infrastructure models requires the analyst to consider multiple environments when understanding vulnerability scoring concepts?", options: ["Hybrid cloud", "On-premises", "Private cloud", "Public cloud"], answer: 0, explanation: "A hybrid cloud model spans both on-premises and cloud infrastructure, requiring the analyst to consider multiple environments for vulnerability scoring — the other models are each a single, self-contained environment.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-52", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "Which of the following incident response documents is used to track critical details about an incident?", options: ["Incident form", "Incident response playbook", "Escalation list", "Incident checklist"], answer: 0, explanation: "An incident form tracks critical details about a specific incident. A playbook defines response steps, an escalation list has contact info, and a checklist provides an overview of activities to complete.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-53", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "On Wireshark, you have used a filter to help capture only the desired types of packets. Which of the following BEST describes the effects of using the host 192.168.0.34 filter?", options: ["Only packets with 192.168.0.34 in the source address are captured.", "Only packets with 192.168.0.34 in the destination address are captured.", "Only packets on the 192.168.0.34 network are captured.", "Only packets with 192.168.0.34 in either the source or destination address are captured."], answer: 3, explanation: "Wireshark's host filter captures packets where the specified IP address appears in either the source or the destination address — not just one direction, and not an entire network (that address is a single host, not a network).", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-54", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Recommend Controls to Mitigate Attacks & Vulnerabilities", question: "A cybersecurity team at a large organization comes across a set of security configuration best practices that offer a secure baseline configuration for various operating systems, applications, and hardware devices. Which of the following provides this specific set of best practices?", options: ["CMMI", "CIS Benchmarks", "PCI DSS", "CSA STAR"], answer: 1, explanation: "CIS Benchmarks are a set of security configuration best practices providing secure baseline configurations for various platforms. PCI DSS covers cardholder data requirements, CMMI is a process-improvement framework, and CSA STAR certifies cloud providers.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-55", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "What is the primary difference between reconnaissance and enumeration?", options: ["An attacker uses information gathered from enumeration to discover key personnel information for phishing and other social networking purposes.", "Reconnaissance is active discovery; enumeration is passive discovery.", "Reconnaissance is passive discovery; enumeration is active discovery.", "Enumeration uses publicly available resources, such as magazine articles and the internet, to gather information about an organization."], answer: 2, explanation: "Reconnaissance is passive (using publicly available resources like websites, financial reports, dumpster diving), while enumeration is active discovery — moving from passive reconnaissance to actively probing public-facing resources.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-56", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Which of the following concepts related to security operations involves the use of digital certificates to establish trust between entities and secure communication channels?", options: ["Single sign-on (SSO)", "Firewall", "Public key infrastructure (PKI)", "Intrusion detection system (IDS)"], answer: 2, explanation: "PKI is the framework that uses digital certificates to authenticate and establish trust between entities, enabling protocols like SSL/TLS. SSO, firewalls, and IDS serve different functions entirely.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-57", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Recommend Controls to Mitigate Attacks & Vulnerabilities", question: "A financial services company has discovered that its web application suffers from broken access control issues. Which of the following controls should a security expert recommend to mitigate the risks associated with these issues?", options: ["Employ Role-Based Access Control (RBAC)", "Adopt a Security Development Lifecycle (SDLC) approach", "Implement a Web Application Firewall (WAF)", "Enforce password complexity requirements"], answer: 0, explanation: "RBAC directly addresses broken access control by restricting resource access based on assigned roles. A WAF, password complexity, and SDLC can help overall security but don't directly fix broken access control in an existing application.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-58", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Vulnerability Management Reporting & Communication", question: "What is the main purpose of a memorandum of understanding (MoU)?", options: ["To outline the services provided by a third-party service provider", "To ensure all parties involved in an agreement understand each other's expectations and obligations", "To protect both parties involved in a service-level agreement", "To legally bind two or more parties to an agreement"], answer: 1, explanation: "An MoU's main purpose is to ensure all parties understand each other's expectations and obligations. It doesn't legally bind parties the way a contract does, and it isn't the same as an SLA (which outlines third-party services).", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-59", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "Which of the following BEST describes Structured Threat Information eXpression (STIX)?", options: ["A method for the threat information to be shared at the application level using HTTPS.", "A site for security collaboration between the FBI and industry professionals.", "A website that provides extensive information on recent attacks, threats, and security updates.", "An XML standardized information-sharing system that defines malware, threat actors, tools, and attack patterns."], answer: 3, explanation: "STIX is an XML standardized information-sharing format defining malware, threat actors, tools, and attack patterns. TAXII (not STIX) is the transport method over HTTPS, and InfraGard/CISA are separate collaboration resources.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-60", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Which of the following is a security procedure that is essential to verifying that website certificates are valid, helping protect against on-path attacks?", options: ["SSL inspection", "Personally identifiable information (PII)", "Cardholder data (CHD)", "Public key infrastructure (PKI)"], answer: 0, explanation: "SSL inspection verifies website certificates are valid and helps detect on-path (man-in-the-middle) attacks and traffic encrypted with untrusted certificates. PKI underpins certificate issuance broadly but isn't the specific verification procedure described; PII and CHD are data types, not procedures.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-61", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Incident Response Reporting & Communication", question: "Which of the following is an example of a Key Performance Indicator (KPI) that can indicate a trend in an organization's cybersecurity incidents over time?", options: ["Indicators of Compromise (IoCs)", "Risk Assessment", "Detection Time", "Resource Allocation"], answer: 0, explanation: "Tracking IoCs over time as a KPI shows whether they're increasing, revealing a trend in cybersecurity incidents. Detection time and resource allocation are useful KPIs but don't specifically indicate an incident trend, and risk assessment doesn't track trends over time.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge", confidence: "low" },
  { id: "quizlet-62", domain: "Vulnerability Management", objectiveId: "2.4", topic: "Recommend Controls to Mitigate Attacks & Vulnerabilities", question: "What are compensating controls used for?", options: ["To track and control changes in system configuration.", "To replace primary security measures.", "To ensure that security approaches and capabilities are aligned with changing business requirements.", "To add additional layers of security when traditional measures are not viable."], answer: 3, explanation: "Compensating controls add additional layers of security when traditional/primary measures aren't viable — they're an alternative, not a replacement, and should be reviewed regularly for the organization's specific needs.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-63", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "A gray hat hacker who desires to be ethical has discovered a critical vulnerability that could potentially compromise a company's user data. What should the gray hat hacker do next?", options: ["Create a list of patching exceptions.", "Implement session management.", "Conduct adversary emulation to determine whether an APT could gain access.", "Submit the findings to the company's bug bounty program."], answer: 3, explanation: "Submitting findings to the company's bug bounty program is the ethical, responsible disclosure path for an independent researcher — the hacker isn't emulating an adversary, managing sessions, or creating patch exceptions internally.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-64", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "A security analyst is reviewing an announcement from the Cybersecurity and Infrastructure Security Agency (CISA). Which source of Defensive OSINT does the Agency represent?", options: ["Government bulletins", "CSIRT", "Internal Sources", "CERT"], answer: 0, explanation: "CISA publishes cybersecurity guidance and directives as government bulletins — a defensive OSINT source. CSIRTs and CERTs are incident response teams, not intelligence-publishing bodies in this context, and internal sources refer to evidence within the protected environment.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-65", domain: "Reporting & Communication", objectiveId: "4.1", topic: "Vulnerability Management Reporting & Communication", question: "A security auditor reviews the compliance reports of an organization to evaluate their adherence to regulations and standards. What information can typically be in this type of report?", options: ["Configuration management policies", "Top 10 lists of security risks", "Employee training records", "Vulnerability scan results"], answer: 2, explanation: "Compliance reports commonly include employee training records as evidence of adherence to regulations and standards. Vulnerability scan results and top 10 risk lists are typically found in vulnerability reports/dashboards instead.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge", confidence: "low" },
  { id: "quizlet-66", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "While investigating malicious activity against an organization, an analyst establishes that a malicious actor is using anti-forensic techniques to evade detection. What type of actor is MOST likely responsible for this activity?", options: ["MITRE ATT&CK", "Script kiddie", "Command and control (C&C)", "Advanced persistent threat (APT)"], answer: 3, explanation: "Anti-forensic techniques require significant sophistication, resources, and coordination — most associated with APT actors like organized criminals or nation-states. A script kiddie lacks this sophistication, MITRE ATT&CK is a framework (not an actor), and C&C describes a communication technique, not an actor type.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-67", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "As part of a new policy, a system administrator must ensure that system configurations remain consistent, compliant, and secure. What kind of control should the administrator set up?", options: ["Awareness training", "Patching", "Centralized configuration management system", "Compensating controls"], answer: 2, explanation: "A centralized configuration management system (CCMS) is designed to keep systems consistent, compliant, and secure by streamlining patching and configuration management from a central location.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-68", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "A security team is working to maintain operational visibility during a security incident involving potential indicators of compromise (IoCs) on a critical system. What should be the primary focus of the team's investigation?", options: ["System log inconsistencies", "Monitoring and analyzing anomalous activity", "Unauthorized scheduled tasks", "Reviewing suspicious email attachments"], answer: 1, explanation: "Monitoring and analyzing anomalous activity gives the broadest, most immediate insight into active threats, letting the team detect, assess, and respond faster. Log inconsistencies, scheduled tasks, and email attachments are narrower signals that feed into that broader analysis rather than replace it.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-69", domain: "Security Operations", objectiveId: "1.4", topic: "Threat Intelligence & Threat Hunting Concepts", question: "Which of the following honeypot interaction levels can't be compromised completely and is generally set to collect information about attacks, like network probes and worms?", options: ["Medium", "Low", "High", "Critical"], answer: 1, explanation: "A low-interaction honeypot only simulates a limited set of services, so it can't be fully compromised — it's meant to collect basic attack data like probes and worms. Medium simulates a fuller OS/application facade, and high-interaction honeypots can be completely compromised for deeper study. 'Critical' isn't a recognized honeypot interaction level.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-70", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "A company is investigating a potential incident and preparing to validate the integrity of collected data and logs. Why should the company avoid deleting irrelevant log entries during the incident response?", options: ["Because they may contain sensitive information that should not be deleted.", "Because they may contain relevant evidence.", "Because they may contain false information that could lead to erroneous conclusions.", "Because deleting them is not an efficient use of time."], answer: 1, explanation: "Even seemingly irrelevant log entries can hold valuable evidence about the events surrounding an incident, so nothing should be deleted — the primary reason is preserving all potential evidence, not efficiency or sensitivity concerns.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-71", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "Which of the following is the practice of gathering insight about network events based on users' daily behaviors to create a baseline for anomaly detection?", options: ["ETDR", "UEBA", "File monitoring", "DGA monitoring"], answer: 1, explanation: "UEBA (user and entity behavior analysis) builds a baseline of normal daily behavior to help recognize anomalies. ETDR monitors endpoints, file monitoring tracks file changes, and DGA monitoring watches for algorithmically generated malicious domains.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-72", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "The cybersecurity leadership team of a company is reviewing its incident response plan (IRP) and must consider the role of business continuity (BC) and disaster recovery (DR) in the IRP. How should the company account for BC/DR in its incident response plan?", options: ["Conduct regular tabletop exercises.", "Develop and test BC/DR plans for operational resilience.", "Establish an incident response team.", "Train employees on phishing awareness."], answer: 1, explanation: "Integrating and testing BC/DR plans directly ensures operational resilience and improves the IRP's effectiveness. Tabletop exercises, an IR team, and phishing training are all valuable but don't specifically address integrating BC/DR into the IRP.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-73", domain: "Reporting & Communication", objectiveId: "4.2", topic: "Incident Response Reporting & Communication", question: "During a security breach, a security administrator identifies the stakeholders affected by the incident. What next step should the administrator take to ensure effective communication with the stakeholders?", options: ["Develop a communication plan based on stakeholder needs and interests", "Avoid communication with stakeholders until the incident has been fully resolved", "Delegate stakeholder communication to the public relations team", "Send a detailed email to all stakeholders without prioritizing communication methods"], answer: 0, explanation: "A communication plan tailored to stakeholder needs and interests is essential for effective, trust-building communication — blanket emails, blind delegation to PR, or silence until resolution all risk mishandling stakeholder relationships.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-74", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "An employee asks why playbooks are necessary when the incident response plan already exists. How would the trainer explain the difference between an incident response plan and playbooks?", options: ["An incident response plan is a general framework for responding to any incident, while playbooks provide detailed procedures for responding to specific incidents.", "An incident response plan focuses on restoring business operations after an incident, while playbooks focus on containing and resolving the incident.", "An incident response plan is a step-by-step guide for responding to an incident, while playbooks provide guidelines and best practices for incident response."], answer: 0, explanation: "An IR plan is the general framework covering any incident, while playbooks provide detailed, specific procedures for particular incident types — the plan minimizes impact broadly, while playbooks contain and resolve specific scenarios.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-75", domain: "Vulnerability Management", objectiveId: "2.5", topic: "Vulnerability Response, Handling & Management", question: "A system administrator is responsible for keeping software up to date and protected from known vulnerabilities. Which concept is most relevant to updating software to address these vulnerabilities?", options: ["Patch management", "Time synchronization", "Log analysis", "Windows Registry management"], answer: 0, explanation: "Patch management specifically deals with identifying, acquiring, and deploying software updates to fix known vulnerabilities — time sync, log analysis, and Registry management serve other purposes.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-76", domain: "Security Operations", objectiveId: "1.1", topic: "System and Network Architecture", question: "Which of the following BEST describes Central Policy?", options: ["An access management strategy where an attribute is created for every element of an organization's operations.", "An authentication process that requires two or more steps.", "A program that checks for the correct attributes in an attribute-based system.", "An access management strategy where people are granted privileges based on their role in the organization."], answer: 2, explanation: "Central Policy is the program that validates correct attributes within an attribute-based (ABAC) system. MFA is the two-step authentication process, RBAC grants privileges by role, and ABAC itself is the strategy of creating attributes for every operational element.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-77", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "You suspect an attacker has been staging sensitive files on a Windows host for exfiltration and want to check for hidden files or folders using the Windows dir command. Which of the following commands would you use to find these hidden files or folders?", options: ["dir /AH", "dir /Q", "dir /L", "dir /R"], answer: 0, explanation: "dir /AH displays only hidden files and folders, making it far easier to find malicious hidden content than scanning every entry manually. dir /Q shows ownership, dir /R shows alternate data streams, and dir /L lowercases output.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-78", domain: "Incident Response", objectiveId: "3.2", topic: "Performing Forensic Analysis and Techniques", question: "What is the name of the sanitization method that involves destruction of an encryption key to render a drive's data useless?", options: ["Secure disposal", "Cryptographic erase", "Degaussing", "Reimaging"], answer: 1, explanation: "A cryptographic erase destroys the encryption key so the encrypted data becomes unrecoverable and safe to overwrite. Degaussing uses magnetic force to wipe a drive physically, reimaging restores factory settings, and secure disposal ensures nothing recoverable is left behind after destruction.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-79", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "A large organization suffers a major data breach and tasks the cybersecurity team with conducting a forensic analysis to understand the damage and identify vulnerabilities. Which step is most crucial in effectively applying the lessons learned to improve the organization's security posture?", options: ["Performing vulnerability assessments on key systems", "Collecting and preserving digital evidence", "Implementing architectural changes based on findings", "Conducting regular network traffic analysis"], answer: 2, explanation: "Actually implementing architectural changes based on forensic findings is what translates lessons learned into an improved security posture — evidence collection, vulnerability assessments, and traffic analysis all feed into that but don't themselves apply the lessons.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-80", domain: "Security Operations", objectiveId: "1.3", topic: "Tools & Techniques to Determine Malicious Activity", question: "Where are network device log files stored by default?", options: ["On the SIEM system", "On the local device", "On the nearest server", "On an intrusion detection system"], answer: 1, explanation: "Infrastructure-related security events (servers, switches, routers, firewalls, IDS) are stored locally on each device by default, not automatically forwarded to a SIEM, nearby server, or IDS unless explicitly configured to do so.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-81", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Reconnaissance and Intelligence Gathering", question: "A company's security team needs to assess the security posture of its AWS environment, focusing on both reconnaissance and exploitation phases of a penetration testing engagement, and needs a tool that automates attack scenarios and validates cloud security controls. Which tool is best suited for this task?", options: ["Zed Attack Proxy (ZAP)", "Tenable.io", "Suricata", "Pacu"], answer: 3, explanation: "Pacu is an open-source AWS exploitation framework purpose-built to automate attack scenarios and validate cloud security controls in AWS environments. ZAP targets web apps, Tenable.io is a general vulnerability management platform, and Suricata is a network threat detection engine.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-82", domain: "Incident Response", objectiveId: "3.3", topic: "Preparation & Post-Incident Activity Phases", question: "A company experiences a security incident where an attacker steals sensitive information. The team performs a root cause and forensic analysis to determine how the breach occurred. What can the company gain by performing a root cause analysis specifically?", options: ["To gather forensic evidence", "To restore services and systems as quickly as possible", "To identify areas for improvement in the incident response plan", "To identify the initial entry point of the attack"], answer: 2, explanation: "Root cause analysis identifies the underlying cause(s) of an incident so the team can make changes that prevent similar incidents in the future — gathering evidence and restoring services are separate goals of forensic analysis and recovery, respectively.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge" },
  { id: "quizlet-83", domain: "Vulnerability Management", objectiveId: "2.1", topic: "Vulnerability Scanning Methods & Concepts", question: "A company has discovered that sensitive data leaked to the public and needs to assess potential vulnerabilities and identify the attack vectors that could have led to this incident. Which methodology framework can the team use to guide their testing process?", options: ["Open Source Security Testing Methodology Manual (OSSTMM)", "Open Web Application Security Project (OWASP) Testing Guide", "Penetration Testing Execution Standard (PTES)", "NIST Special Publication 800-53"], answer: 0, explanation: "OSSTMM provides a comprehensive framework covering asset identification, threat modeling, and vulnerability analysis suited to this broad data-leak investigation. OWASP's guide is web-app specific, PTES fits general penetration testing engagements more than this exact scenario, and NIST SP 800-53 is a security/privacy controls catalog, not a testing methodology.", source: "Quizlet - A.4 CompTIA CySA+ Practice Exam by Rina_Ge", confidence: "low" },
];

// "CompTIA CySA+ Full Course (CS0-003)" by Certify Breakfast on YouTube.
// The course itself predates CS0-003 and follows the old CS0-002 5-domain
// outline, so `objectives` below is a manual re-mapping to today's 4-domain/
// 15-objective structure based on what each video actually covers, not its
// title. A video with no clean match to one objective covers more than one
// (see 2.2/2.3 and 3.2/4.2 below); videos that are pure course intro or
// don't fit the CS0-003 outline at all (AI/ML) are flagged with `section`
// instead of being forced into an objective.
const VIDEO_PLAYLIST_ID = "PLMYSjEaGLw_vGxGsAIUgmkbEm52QR02tx";
const VIDEOS = [
  { n: 1, id: "IGihuL5clDs", title: "CompTIA CySA+ Full Course Part 01: What is the CompTIA CySA+ Exam?", duration: "10:36", section: "orientation" },
  { n: 2, id: "eVbmvGCpJHI", title: "CompTIA CySA+ Full Course Part 02: How Difficult Is the CySA+ Exam?", duration: "8:17", section: "orientation" },
  { n: 3, id: "6OEqp2YyxYo", title: "CompTIA CySA+ Full Course Part 03: One Day in the Life of a Cybersecurity Analyst", duration: "6:54", section: "orientation" },
  { n: 4, id: "Y95I2v5-GcI", title: "CompTIA CySA+ Full Course Part 04: Threat Intelligence Cycle", duration: "9:26", objectives: ["1.4"] },
  { n: 5, id: "YLPDppHdzho", title: "CompTIA CySA+ Full Course Part 05: Intelligence Sources", duration: "16:55", objectives: ["1.4"] },
  { n: 6, id: "6zOA3zJgWss", title: "CompTIA CySA+ Full Course Part 06: Security Intelligence Sharing", duration: "11:59", objectives: ["1.4"] },
  { n: 7, id: "kXdOAUEO8yQ", title: "CompTIA CySA+ Full Course Part 07: Threat Classification and Threat Actors", duration: "17:53", objectives: ["1.4"] },
  { n: 8, id: "rbKH1NiUiwY", title: "CompTIA CySA+ Full Course Part 08: Threat Research and Indicators of Compromise", duration: "22:36", objectives: ["1.4"] },
  { n: 9, id: "mdr0i9uoDzo", title: "CompTIA CySA+ Full Course Part 09: Attack Frameworks and The Cyber Kill Chain", duration: "19:57", objectives: ["3.1"] },
  { n: 10, id: "lmoaVlKE79g", title: "CompTIA CySA+ Full Course Part 10: Defining Threat Modeling & Threat Hunting", duration: "22:20", objectives: ["1.4"] },
  { n: 11, id: "FPvqlDodLTg", title: "CompTIA CySA+ Full Course Part 11: Vulnerability Identification and Validation", duration: "27:29", objectives: ["2.1"] },
  { n: 12, id: "WToRPXfg1eo", title: "CompTIA CySA+ Full Course Part 12: Vulnerability Scan Results and CVSS Scores", duration: "34:01", objectives: ["2.2", "2.3"] },
  { n: 13, id: "aaCy_-HuOuI", title: "CompTIA CySA+ Full Course Part 13: Nmap and Enumeration Tools", duration: "31:31", objectives: ["2.1"] },
  { n: 14, id: "I48FuwUKmYc", title: "CompTIA CySA+ Full Course Part 14: Security Controls", duration: "20:21", objectives: ["2.4"] },
  { n: 15, id: "NaXBU2a_UaU", title: "CompTIA CySA+ Full Course Part 15: Defense in Depth and Security Baselines", duration: "17:55", objectives: ["2.4"] },
  { n: 16, id: "QYPJckUdEwg", title: "CompTIA CySA+ Full Course Part 16: Security Trend Analysis", duration: "11:15", objectives: ["2.3"] },
  { n: 17, id: "ZKKNHPzE8BU", title: "CompTIA CySA+ Full Course Part 17: Remediation Issues", duration: "15:07", objectives: ["2.5"] },
  { n: 18, id: "sPGCwkXWM7o", title: "CompTIA CySA+ Full Course Part 18: Asset, Change and Configuration Management", duration: "19:13", objectives: ["2.5"] },
  { n: 19, id: "6wtV7lFM2Kc", title: "CompTIA CySA+ Full Course Part 19: Software Development Lifecycle / Development Methodologies", duration: "34:55", objectives: ["2.4"] },
  { n: 20, id: "JP3D3Kz3F3g", title: "CompTIA CySA+ Full Course Part 20: Secure Coding", duration: "57:05", objectives: ["2.4"] },
  { n: 21, id: "cjNs8kqWH5A", title: "CompTIA CySA+ Full Course Part 21: Software Assessment and Code Review", duration: "42:54", objectives: ["2.4"] },
  { n: 22, id: "AyHFhegGMDc", title: "CompTIA CySA+ Full Course Part 22: Mitigating Attacks: Buffer Overflows, Race Conditions & more", duration: "41:01", objectives: ["2.4"] },
  { n: 23, id: "krEtUQoeSuY", title: "CompTIA CySA+ Full Course Part 23: Mitigating Attacks: Integer Overflow, XSS, SQL & XML Injection", duration: "39:12", objectives: ["2.4"] },
  { n: 24, id: "khuERSYNNq4", title: "CompTIA CySA+ Full Course Part 24: Mitigating CSRF/XSRF, securing web sessions & cookies", duration: "34:05", objectives: ["2.4"] },
  { n: 25, id: "iU7zTueohoc", title: "CompTIA CySA+ Full Course Part 25: Passwords & Hashing", duration: "39:36", objectives: ["2.4"] },
  { n: 26, id: "ybs3iqyzDnw", title: "CompTIA CySA+ Full Course Part 26: Privilege Escalation & Man-in-the-Middle", duration: "32:24", objectives: ["2.4"] },
  { n: 27, id: "Gj0kKdi4bnY", title: "CompTIA CySA+ Full Course Part 27: Network-Based IoCs (1/2)", duration: "37:50", objectives: ["1.2"] },
  { n: 28, id: "WLygNRfg-5s", title: "CompTIA CySA+ Full Course Part 28: Host-Based IoCs (2/2)", duration: "28:06", objectives: ["1.2"] },
  { n: 29, id: "ExcQ25WRCH0", title: "CompTIA CySA+ Full Course Part 29: Network Architecture and Segmentation", duration: "41:23", objectives: ["1.1"] },
  { n: 30, id: "PD6UGP_N1jI", title: "CompTIA CySA+ Full Course Part 30: Network Traffic and Protocol Analysis", duration: "36:37", objectives: ["1.3"] },
  { n: 31, id: "brA6oiGJljc", title: "CompTIA CySA+ Full Course Part 31: Pentesting and Active Defense", duration: "38:25", objectives: ["1.3"] },
  { n: 32, id: "2_vGUyTyHTY", title: "CompTIA CySA+ Full Course Part 32: Configuring Firewalls", duration: "42:46", objectives: ["1.1"] },
  { n: 33, id: "2hdBzFXv2Y0", title: "CompTIA CySA+ Full Course Part 33: URL Analysis & DNS in Malware", duration: "30:33", objectives: ["1.3"] },
  { n: 34, id: "W8b2vEBt8BE", title: "CompTIA CySA+ Full Course Part 34: Port Security & Network Access Control (NAC)", duration: "24:10", objectives: ["1.1"] },
  { n: 35, id: "QKCG_gnLaSA", title: "CompTIA CySA+ Full Course Part 35: Identity & Access Management", duration: "41:03", objectives: ["1.1"] },
  { n: 36, id: "61bvu_8JMss", title: "CompTIA CySA+ Full Course Part 36: Web Application Scanners", duration: "19:46", objectives: ["2.1"] },
  { n: 37, id: "i6XsAngZ3_c", title: "CompTIA CySA+ Full Course Part 37: SSL/TLS Certificate Management", duration: "24:39", objectives: ["1.1"] },
  { n: 38, id: "7pFqpH3qT4U", title: "CompTIA CySA+ Full Course Part 38: Mobile Threats", duration: "15:44", objectives: ["2.4"] },
  { n: 39, id: "g-hCKndXG6Y", title: "CompTIA CySA+ Full Course Part 39: Email Threats and Mitigation", duration: "21:51", objectives: ["1.2"] },
  { n: 40, id: "80FMLYeAV80", title: "CompTIA CySA+ Full Course Part 40: Data Loss Prevention (DLP)", duration: "11:51", objectives: ["1.1"] },
  { n: 41, id: "DpkpohAuLhE", title: "CompTIA CySA+ Full Course Part 41: Endpoint Security & Behaviour Analysis", duration: "20:11", objectives: ["1.3"] },
  { n: 42, id: "5Zj2seJ9nJQ", title: "CompTIA CySA+ Full Course Part 42: Hardware Assurance", duration: "21:00", objectives: ["2.4"] },
  { n: 43, id: "R8pS5qz-NOA", title: "CompTIA CySA+ Full Course Part 43: Traffic Blackholes and Sinkholes", duration: "11:31", objectives: ["2.4"] },
  { n: 44, id: "Hm1yfd1YumI", title: "CompTIA CySA+ Full Course Part 44: IoT, Embedded Systems & ICS/SCADA Threats", duration: "21:06", objectives: ["2.4"] },
  { n: 45, id: "IJc_MQnPpRQ", title: "CompTIA CySA+ Full Course Part 45: Log Analysis & Continuous Security Monitoring", duration: "20:31", objectives: ["1.3", "1.5"] },
  { n: 46, id: "MLYtrSNwU84", title: "CompTIA CySA+ Full Course Part 46: SIEM and Event Correlation", duration: "28:32", objectives: ["1.3"] },
  { n: 47, id: "wAbD7EPq_tc", title: "CompTIA CySA+ Full Course Part 47: Malware Analysis", duration: "24:03", objectives: ["1.3"] },
  { n: 48, id: "nw8AyIiSMgc", title: "CompTIA CySA+ Full Course Part 48: Cloud Models and Service Threats", duration: "24:41", objectives: ["1.1"] },
  { n: 49, id: "DFtA4kJWc2E", title: "CompTIA CySA+ Full Course Part 49: Cloud Automation and Other Cloud Threats", duration: "20:19", objectives: ["1.1"] },
  { n: 50, id: "ACix1NCOiZ4", title: "CompTIA CySA+ Full Course Part 50: VDI, Containers, Microservices", duration: "20:40", objectives: ["1.1"] },
  { n: 51, id: "jl68qcQqo38", title: "CompTIA CySA+ Full Course Part 51: CI/CD, IaC, DevOps", duration: "12:05", objectives: ["1.5"] },
  { n: 52, id: "9-yG9dWBSFs", title: "CompTIA CySA+ Full Course Part 52: Artificial Intelligence and Machine Learning", duration: "5:42", section: "supplemental" },
  { n: 53, id: "oPsmZArxhJw", title: "CompTIA CySA+ Full Course Part 53: Digital Forensics", duration: "31:11", objectives: ["3.2"] },
  { n: 54, id: "7ebjDlgxrwM", title: "CompTIA CySA+ Full Course Part 54: Technical Controls for Securing Data", duration: "23:57", objectives: ["1.1"] },
  { n: 55, id: "wuFKlx533q0", title: "CompTIA CySA+ Full Course Part 55: Non-Technical Controls for Securing Data", duration: "20:32", objectives: ["1.1"] },
  { n: 56, id: "nkYkucNp9Vw", title: "CompTIA CySA+ Full Course Part 56: Security Policies and Procedures", duration: "22:15", objectives: ["3.3"] },
  { n: 57, id: "p1_pLigW1sc", title: "CompTIA CySA+ Full Course Part 57: Continuity Planning & Risk Assessment", duration: "28:34", objectives: ["3.3"] },
  { n: 58, id: "omlz8iqMUk4", title: "CompTIA CySA+ Full Course Part 58: Incident Response Phases & Communication", duration: "27:51", objectives: ["3.2", "4.2"] },
];

function durationToSeconds(d) {
  const parts = d.split(":").map(Number);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}

const TOTAL_VIDEO_SECONDS = VIDEOS.reduce((a, v) => a + durationToSeconds(v.duration), 0);

// Video runtime per objective, so thin/missing coverage (this course predates
// CS0-003 and doesn't cover every current objective proportionally) can be
// flagged instead of silently under-representing e.g. Incident Response.
const THIN_COVERAGE_SECONDS = 15 * 60;
const OBJECTIVE_VIDEO_STATS = Object.fromEntries(
  ALL_OBJECTIVES_FLAT.map((o) => {
    const vids = VIDEOS.filter((v) => v.objectives?.includes(o.id));
    const totalSec = vids.reduce((a, v) => a + durationToSeconds(v.duration), 0);
    return [o.id, { videoCount: vids.length, totalSec, gap: vids.length === 0, thin: vids.length > 0 && totalSec < THIN_COVERAGE_SECONDS }];
  })
);

// A thin video count alone isn't a real gap if the question bank covers the
// slack (e.g. 4.1 has zero video but 16+ questions) — only flag an objective
// as needing outside material when BOTH sources are thin (e.g. 1.5).
const QUESTION_THIN_THRESHOLD = 10;
const QUESTION_COUNTS_BY_OBJECTIVE = SEED_QUESTIONS.reduce((acc, q) => {
  acc[q.objectiveId] = (acc[q.objectiveId] || 0) + 1;
  return acc;
}, {});

function formatWeekRange(startISO) {
  const start = new Date(startISO + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

// 8-week compressed plan (chosen over the original ~16-week schedule to
// reduce forgetting — review is spread across every week instead of being
// crammed into a final cram phase). Dates are fixed to this specific run at
// the exam so "current week" can be computed against real time.
const EXAM_DATE = "2026-10-18"; // booked: Sunday Oct 18, 2026, 1:30 PM PDT check-in
const STUDY_PLAN = [
  { week: 1, start: "2026-08-21", focus: "Orientation + 1.1, 1.2, 1.3", objectiveIds: ["1.1", "1.2", "1.3"], review: "Practice each objective right after watching it — don't wait." },
  { week: 2, start: "2026-08-28", focus: "1.4, 1.5 — finishes Security Operations", objectiveIds: ["1.4", "1.5"], review: "Redo any Week 1 missed questions before moving on." },
  { week: 3, start: "2026-09-04", focus: "2.1, 2.2, 2.3", objectiveIds: ["2.1", "2.2", "2.3"], review: "15 min/day quick-practice on Domain 1 so it doesn't go cold." },
  { week: 4, start: "2026-09-11", focus: "2.4 — the single biggest chunk (~7h of video)", objectiveIds: ["2.4"], review: "15–20 min/day mixed review across Domains 1–2." },
  { week: 5, start: "2026-09-18", focus: "2.5 — finishes Vulnerability Management", objectiveIds: ["2.5"], review: "Heavy VulnMgmt practice + a Domain 1 spot-check." },
  { week: 6, start: "2026-09-25", focus: "All of Domain 3 & 4 — light on video here, so supplement 4.1 (zero video coverage) with outside reading", objectiveIds: ["3.1", "3.2", "3.3", "4.1", "4.2"], review: "Keep touching Domains 1–2 daily so they don't go cold." },
  { week: 7, start: "2026-10-02", focus: "No new content — full practice sweep across all 15 objectives", objectiveIds: [], review: "Driven entirely by the Dashboard's weakest-objective flags." },
  { week: 8, start: "2026-10-09", focus: "No new content — a timed full practice exam (use Dion's CS0-003 Practice Exams course on Udemy, Exam mode: 90 questions/2h45m — NOT the Dion \"Complete Course,\" which updated to CS0-004 and no longer matches this exam), then gap-fill only your 2–3 weakest objectives", objectiveIds: [], review: "Light review only — rest before test day." },
];

const STORAGE_KEY = "cysa-tracker-v2";

async function loadData() {
  try {
    const { data, error } = await supabase
      .from("tracker_data")
      .select("value")
      .eq("id", STORAGE_KEY)
      .maybeSingle();
    if (error) throw error;
    if (data && data.value) return data.value;
  } catch (err) {
    console.error("Load failed:", err);
  }
  return { history: [], seenIds: [] };
}

async function saveData(data) {
  try {
    const { error } = await supabase
      .from("tracker_data")
      .upsert({ id: STORAGE_KEY, value: data, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch (err) {
    console.error("Save failed:", err);
  }
}

const VIDEO_STORAGE_KEY = "cysa-tracker-videos-v1";

async function loadWatchedVideos() {
  try {
    const { data, error } = await supabase
      .from("tracker_data")
      .select("value")
      .eq("id", VIDEO_STORAGE_KEY)
      .maybeSingle();
    if (error) throw error;
    if (data && data.value) return data.value;
  } catch (err) {
    console.error("Load failed:", err);
  }
  return { watched: [] };
}

async function saveWatchedVideos(watched) {
  try {
    const { error } = await supabase
      .from("tracker_data")
      .upsert({ id: VIDEO_STORAGE_KEY, value: { watched }, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch (err) {
    console.error("Save failed:", err);
  }
}

const PLAN_STORAGE_KEY = "cysa-tracker-plan-v1";

async function loadPlanProgress() {
  try {
    const { data, error } = await supabase
      .from("tracker_data")
      .select("value")
      .eq("id", PLAN_STORAGE_KEY)
      .maybeSingle();
    if (error) throw error;
    if (data && data.value) return data.value;
  } catch (err) {
    console.error("Load failed:", err);
  }
  return { completedWeeks: [] };
}

async function savePlanProgress(completedWeeks) {
  try {
    const { error } = await supabase
      .from("tracker_data")
      .upsert({ id: PLAN_STORAGE_KEY, value: { completedWeeks }, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch (err) {
    console.error("Save failed:", err);
  }
}

function BarChart({ stats, colorKey, order }) {
  const keys = order ? order.filter((k) => stats[k]) : Object.keys(stats);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "9px", width: "100%" }}>
      {keys.map((label) => {
        const stat = stats[label];
        const color = colorKey[label] || "#888";
        const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
        return (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span style={{ fontSize: "10px", color: "#8a2846", fontFamily: "'Poppins', sans-serif", maxWidth: "75%" }}>{label}</span>
              <span style={{ fontSize: "10px", color: pct !== null ? color : "#ff9ebb", fontFamily: "'Poppins', sans-serif", fontWeight: "700" }}>
                {pct !== null ? `${stat.correct}/${stat.total} (${pct}%)` : "—"}
              </span>
            </div>
            <div style={{ height: "5px", background: "#ffe0e9", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct || 0}%`, background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: "3px", transition: "width 0.5s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RadarChart({ domainStats }) {
  const domains = Object.keys(DOMAINS);
  const size = 240; const cx = size / 2; const cy = size / 2; const r = 88;
  const angle = (i) => (Math.PI * 2 * i) / domains.length - Math.PI / 2;
  const point = (i, rad) => ({ x: cx + rad * Math.cos(angle(i)), y: cy + rad * Math.sin(angle(i)) });
  const gridLines = [1, 2, 3, 4].map((l) => domains.map((_, i) => point(i, (r * l) / 4)));
  const dataPoints = domains.map((d, i) => {
    const s = domainStats[d] || { correct: 0, total: 0 };
    return point(i, r * (s.total > 0 ? s.correct / s.total : 0));
  });
  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {gridLines.map((pts, l) => <polygon key={l} points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#ffe0e9" strokeWidth="1" />)}
      {domains.map((_, i) => { const o = point(i, r); return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke="#ffe0e9" strokeWidth="1" />; })}
      <polygon points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="rgba(194,68,122,0.12)" stroke="#b9375e" strokeWidth="2" />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill={Object.values(DOMAINS)[i].color} />)}
      {domains.map((d, i) => {
        const lp = point(i, r + 24);
        const s = domainStats[d] || { correct: 0, total: 0 };
        const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
        return (
          <g key={i}>
            <text x={lp.x} y={lp.y - 5} textAnchor="middle" fill="#8a2846" fontSize="8" fontFamily="'Poppins', sans-serif">{DOMAINS[d].short}</text>
            <text x={lp.x} y={lp.y + 7} textAnchor="middle" fill={Object.values(DOMAINS)[i].color} fontSize="10" fontFamily="'Poppins', sans-serif" fontWeight="700">{pct !== null ? `${pct}%` : "—"}</text>
          </g>
        );
      })}
    </svg>
  );
}

function VideoRow({ video, checked, onToggle, disabled }) {
  const url = `https://www.youtube.com/watch?v=${video.id}&list=${VIDEO_PLAYLIST_ID}&index=${video.n}`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "7px 0", borderBottom: "1px solid #ffe0e9" }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onToggle(video.id)}
        title={disabled ? "Sign in to track progress" : undefined}
        style={{ flexShrink: 0, width: "13px", height: "13px", accentColor: "#b9375e", cursor: disabled ? "default" : "pointer" }}
      />
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ flex: 1, fontSize: "10.5px", lineHeight: "1.45", color: checked ? "#ff9ebb" : "#522e38", textDecoration: checked ? "line-through" : "none" }}>
        {video.title}
      </a>
      <span style={{ fontSize: "9px", color: "#8a2846", whiteSpace: "nowrap", flexShrink: 0 }}>{video.duration}</span>
    </div>
  );
}

export default function CySATracker() {
  const [tab, setTab] = useState("dashboard");
  const [history, setHistory] = useState([]);
  const [seenIds, setSeenIds] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [planCompletedWeeks, setPlanCompletedWeeks] = useState([]);
  const [highlightTarget, setHighlightTarget] = useState(null); // objective id (e.g. "1.2") or `domain:<name>`

  const [currentQ, setCurrentQ] = useState(null);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [filterDomain, setFilterDomain] = useState("Any Domain");
  const [filterObjective, setFilterObjective] = useState("Any Objective");
  const [includeLowConfidence, setIncludeLowConfidence] = useState(false);
  const [questionSource, setQuestionSource] = useState("book"); // "book" | "recommended"
  const [apiError, setApiError] = useState(null);
  const [dashView, setDashView] = useState("domain"); // "domain" | "objective"

  // Manual log form state
  const [logDomain, setLogDomain] = useState(Object.keys(DOMAINS)[0]);
  const [logObjective, setLogObjective] = useState(OBJECTIVES[Object.keys(DOMAINS)[0]][0].id);
  const [logTopic, setLogTopic] = useState("");
  const [logQuestion, setLogQuestion] = useState("");
  const [logCorrect, setLogCorrect] = useState(true);
  const [logAnswer, setLogAnswer] = useState("");
  const [logExplanation, setLogExplanation] = useState("");
  const [logSaved, setLogSaved] = useState(false);
  const [logClassifying, setLogClassifying] = useState(false);
  const [logObjSearch, setLogObjSearch] = useState("");
  const [logObjOpen, setLogObjOpen] = useState(false);
  const [expandedHistId, setExpandedHistId] = useState(null);
  const [historyFilter, setHistoryFilter] = useState("all"); // "all" | "missed"
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState(null); // null | "ok" | "err"
  const [showImport, setShowImport] = useState(false);

  // Auth state
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoginLoading(false);
    if (error) {
      setLoginError(error.message);
    } else {
      setShowLogin(false);
      setLoginEmail(""); setLoginPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const isLoggedIn = !!session;

  useEffect(() => {
    loadData().then((d) => { setHistory(d.history || []); setSeenIds(d.seenIds || []); setLoaded(true); });
    loadWatchedVideos().then((d) => setWatchedVideos(d.watched || []));
    loadPlanProgress().then((d) => setPlanCompletedWeeks(d.completedWeeks || []));
  }, []);

  // Scroll to and briefly highlight an objective/domain in the Videos tab
  // when jumped to from Dashboard's Focus Areas or Coverage Gaps.
  useEffect(() => {
    if (tab !== "videos" || !highlightTarget) return;
    const id = highlightTarget.startsWith("domain:")
      ? `domain-${highlightTarget.slice(7).replace(/\s+/g, "-")}`
      : `obj-${highlightTarget}`;
    // Instant, not smooth: an animated scrollIntoView on this tab's heavy DOM
    // (58+ video rows under a sticky header) let the sticky nav's active-tab
    // underline visibly lag a frame behind the scroll, showing the previous
    // tab as active for a moment. Waiting a frame first lets the newly
    // mounted Videos content finish layout before we measure/scroll to it.
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "center" });
    });
    const t = setTimeout(() => setHighlightTarget(null), 2500);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [tab, highlightTarget]);

  const jumpToObjective = (objectiveId) => { setHighlightTarget(objectiveId); setTab("videos"); };
  const jumpToDomain = (domain) => { setHighlightTarget(`domain:${domain}`); setTab("videos"); };
  const jumpToPractice = (domain) => {
    setFilterDomain(domain); setFilterObjective("Any Objective");
    setCurrentQ(null); setSelected(null); setRevealed(false);
    setTab("practice");
  };

  const persist = (h, s) => saveData({ history: h, seenIds: s });

  const toggleWatched = (videoId) => {
    if (!isLoggedIn) return;
    setWatchedVideos((prev) => {
      const next = prev.includes(videoId) ? prev.filter((v) => v !== videoId) : [...prev, videoId];
      saveWatchedVideos(next);
      return next;
    });
  };

  const togglePlanWeek = (week) => {
    if (!isLoggedIn) return;
    setPlanCompletedWeeks((prev) => {
      const next = prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week];
      savePlanProgress(next);
      return next;
    });
  };

  // Stats by domain
  const domainStats = history.reduce((acc, item) => {
    if (!acc[item.domain]) acc[item.domain] = { correct: 0, total: 0 };
    acc[item.domain].total++;
    if (item.correct) acc[item.domain].correct++;
    return acc;
  }, {});

  // Stats by objective
  const objectiveStats = history.reduce((acc, item) => {
    if (!item.objectiveId) return acc;
    const obj = ALL_OBJECTIVES_FLAT.find((o) => o.id === item.objectiveId);
    const key = obj ? obj.label : item.objectiveId;
    if (!acc[key]) acc[key] = { correct: 0, total: 0, color: DOMAINS[item.domain]?.color || "#888" };
    acc[key].total++;
    if (item.correct) acc[key].correct++;
    return acc;
  }, {});

  const objectiveColorMap = Object.fromEntries(
    Object.entries(objectiveStats).map(([k, v]) => [k, v.color])
  );

  const totalCorrect = history.filter((h) => h.correct).length;
  const totalAnswered = history.length;
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

  const totalVideos = VIDEOS.length;
  const watchedVideoCount = watchedVideos.length;
  const watchedVideoPct = totalVideos > 0 ? Math.round((watchedVideoCount / totalVideos) * 100) : 0;

  const weakestDomain = Object.entries(domainStats).filter(([, s]) => s.total >= 2)
    .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)[0]?.[0];

  const weakestObjective = Object.entries(objectiveStats).filter(([, s]) => s.total >= 2)
    .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)[0]?.[0];
  const weakestObjectiveId = ALL_OBJECTIVES_FLAT.find((o) => o.label === weakestObjective)?.id;

  const coverageGaps = ALL_OBJECTIVES_FLAT.filter((o) => {
    const v = OBJECTIVE_VIDEO_STATS[o.id];
    const videoThin = v?.gap || v?.thin;
    const questionThin = (QUESTION_COUNTS_BY_OBJECTIVE[o.id] || 0) < QUESTION_THIN_THRESHOLD;
    return videoThin && questionThin;
  });

  const now = new Date();
  const daysUntilExam = Math.ceil((new Date(EXAM_DATE + "T00:00:00") - now) / 86400000);
  let currentWeekIndex = STUDY_PLAN.findIndex((w) => {
    const start = new Date(w.start + "T00:00:00");
    const end = new Date(start); end.setDate(end.getDate() + 7);
    return now >= start && now < end;
  });
  if (currentWeekIndex === -1) currentWeekIndex = now < new Date(STUDY_PLAN[0].start + "T00:00:00") ? 0 : STUDY_PLAN.length;
  const currentPlanWeek = STUDY_PLAN[currentWeekIndex];

  // Weighted by exam domain percentages (33/30/20/17, summing to 100) rather
  // than a flat average, so an untouched heavy domain drags the score down
  // instead of being invisible next to a well-practiced light one.
  const examReadiness = totalAnswered > 0
    ? Math.round(Object.entries(DOMAINS).reduce((sum, [d, meta]) => {
        const s = domainStats[d];
        const acc = s && s.total > 0 ? s.correct / s.total : 0;
        return sum + acc * (parseInt(meta.weight, 10) || 0);
      }, 0))
    : null;

  const RETENTION_STALE_DAYS = 7;
  const domainLastPracticed = {};
  history.forEach((h) => {
    const t = new Date(h.timestamp);
    if (!domainLastPracticed[h.domain] || t > domainLastPracticed[h.domain]) domainLastPracticed[h.domain] = t;
  });
  const staleDomains = Object.keys(DOMAINS)
    .filter((d) => domainLastPracticed[d])
    .map((d) => ({ domain: d, daysSince: Math.floor((now - domainLastPracticed[d]) / 86400000) }))
    .filter((s) => s.daysSince >= RETENTION_STALE_DAYS)
    .sort((a, b) => b.daysSince - a.daysSince);
  const stalestDomain = staleDomains[0];

  // Drives "Recommended" practice: prefer the weakest objective (most
  // specific, most actionable), fall back to the stalest domain, so this
  // mode always points at whatever Today's Focus is already flagging.
  const recommendedTarget = weakestObjectiveId
    ? { domain: ALL_OBJECTIVES_FLAT.find((o) => o.id === weakestObjectiveId)?.domain, objectiveId: weakestObjectiveId, reason: `weakest objective — ${objectiveStats[weakestObjective]?.correct}/${objectiveStats[weakestObjective]?.total} correct` }
    : stalestDomain
    ? { domain: stalestDomain.domain, objectiveId: null, reason: `${stalestDomain.daysSince} days since last practiced` }
    : null;

  const availableObjectives = filterDomain === "Any Domain"
    ? [{ id: "any", label: "Any Objective" }, ...ALL_OBJECTIVES_FLAT.map((o) => ({ id: o.id, label: o.label }))]
    : [{ id: "any", label: "Any Objective" }, ...(OBJECTIVES[filterDomain] || [])];

  const getNextSeed = () => {
    const pool = SEED_QUESTIONS.filter((q) => {
      if (seenIds.includes(q.id)) return false;
      if (q.confidence === "low" && !includeLowConfidence) return false;
      if (questionSource === "recommended") {
        if (!recommendedTarget) return true;
        if (recommendedTarget.objectiveId) return q.objectiveId === recommendedTarget.objectiveId;
        return q.domain === recommendedTarget.domain;
      }
      if (filterDomain !== "Any Domain" && q.domain !== filterDomain) return false;
      if (filterObjective !== "Any Objective") {
        const obj = ALL_OBJECTIVES_FLAT.find((o) => o.label === filterObjective || o.id === filterObjective);
        if (obj && q.objectiveId !== obj.id) return false;
      }
      return true;
    });
    return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
  };

  const loadQuestion = () => {
    setSelected(null); setRevealed(false); setApiError(null);
    const seed = getNextSeed();
    if (seed) { setCurrentQ(seed); return; }
    setCurrentQ(null);
    setApiError(questionSource === "recommended"
      ? "No unused questions left for this recommended target yet. Try Question Bank mode with a different filter, or ask Claude.ai for more and Import the results."
      : "No unused questions left in the question bank for this domain/objective. Try a different filter, or ask Claude.ai for more and Import the results.");
  };

  const isMultiSelect = Array.isArray(currentQ?.answer);

  const submitAnswer = () => {
    if (!currentQ) return;
    if (isMultiSelect) {
      if (!selected || selected.length === 0) return;
    } else if (selected === null) return;

    const correct = isMultiSelect
      ? selected.length === currentQ.answer.length && [...selected].sort().every((v, i) => v === [...currentQ.answer].sort()[i])
      : selected === currentQ.answer;
    const answerLabel = isMultiSelect
      ? currentQ.answer.map((i) => currentQ.options?.[i]).join("; ")
      : currentQ.options?.[currentQ.answer] || "";
    const yourAnswerLabel = isMultiSelect
      ? selected.map((i) => currentQ.options?.[i]).join("; ")
      : currentQ.options?.[selected] || "";
    const entry = {
      id: currentQ.id,
      domain: currentQ.domain,
      objectiveId: currentQ.objectiveId || null,
      objectiveLabel: currentQ.objectiveLabel || null,
      topic: currentQ.topic || "",
      question: currentQ.question,
      options: currentQ.options,
      answerIndex: currentQ.answer,
      answer: answerLabel,
      yourAnswer: yourAnswerLabel,
      explanation: currentQ.explanation || "",
      correct,
      source: currentQ.source || (currentQ.id?.startsWith("book-") ? "Sybex Practice Questions" : "AI Generated"),
      timestamp: new Date().toISOString(),
    };
    const newHistory = [entry, ...history];
    const newSeen = currentQ.id.startsWith("book-") && correct ? [...seenIds, currentQ.id] : seenIds;
    setHistory(newHistory); setSeenIds(newSeen); persist(newHistory, newSeen);
    setRevealed(true);
  };

  const classifyQuestion = async () => {
    if (!logQuestion.trim()) return;
    setLogClassifying(true);
    const prompt = `You are a CompTIA CySA+ CS0-003 exam expert. Classify this question into the correct domain and exam objective.

Question: "${logQuestion.trim()}"

Domains and objectives:
- Security Operations: 1.1, 1.2, 1.3, 1.4, 1.5
- Vulnerability Management: 2.1, 2.2, 2.3, 2.4, 2.5
- Incident Response: 3.1, 3.2, 3.3
- Reporting & Communication: 4.1, 4.2

Return ONLY valid JSON, no markdown:
{"domain": "<exact domain name>", "objectiveId": "<e.g. 2.3>", "topic": "<3-5 word topic label>"}`;

    try {
      const res = await fetch("/api/classify-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (parsed.domain && DOMAINS[parsed.domain]) {
        setLogDomain(parsed.domain);
        setLogObjective(parsed.objectiveId);
        if (parsed.topic && !logTopic.trim()) setLogTopic(parsed.topic);
      }
    } catch {}
    setLogClassifying(false);
  };

  const logManualQuestion = () => {
    if (!logQuestion.trim()) return;
    const objLabel = ALL_OBJECTIVES_FLAT.find((o) => o.id === logObjective)?.label || logObjective;
    const entry = {
      id: `manual-${Date.now()}`,
      domain: logDomain,
      objectiveId: logObjective,
      objectiveLabel: objLabel,
      topic: logTopic.trim() || "Manually logged question",
      question: logQuestion.trim(),
      correct: logCorrect,
      answer: logAnswer.trim(),
      explanation: logExplanation.trim(),
      timestamp: new Date().toISOString(),
    };
    const newHistory = [entry, ...history];
    setHistory(newHistory); persist(newHistory, seenIds);
    setLogSaved(true);
    setLogTopic(""); setLogQuestion(""); setLogAnswer(""); setLogExplanation(""); setLogCorrect(true);
    setLogObjSearch(""); setLogObjOpen(false);
    setTimeout(() => setLogSaved(false), 2200);
  };

  const exportData = () => {
    const payload = JSON.stringify({ history, seenIds }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "cysa-tracker-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed.history)) throw new Error();
      const merged = [...parsed.history, ...history].filter(
        (item, idx, arr) => arr.findIndex(x => x.id === item.id) === idx
      );
      const mergedSeen = [...new Set([...(parsed.seenIds || []), ...seenIds])];
      setHistory(merged); setSeenIds(mergedSeen); persist(merged, mergedSeen);
      setImportStatus("ok"); setImportText("");
      setTimeout(() => { setImportStatus(null); setShowImport(false); }, 2000);
    } catch { setImportStatus("err"); }
  };

  const clearHistory = async () => {
    if (!confirm("Clear all study history?")) return;
    setHistory([]); setSeenIds([]); persist([], []); setCurrentQ(null);
  };

  const getObjectiveLabel = (q) => {
    if (q.objectiveLabel) return q.objectiveLabel;
    const obj = ALL_OBJECTIVES_FLAT.find((o) => o.id === q.objectiveId);
    return obj ? obj.label : q.objectiveId || null;
  };

  if (!loaded) return (
    <div style={{ ...c.app, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <span style={{ color: "#8a2846", fontSize: "11px", letterSpacing: "0.1em" }}>LOADING...</span>
    </div>
  );

  return (
    <div style={c.app}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="topbar" style={c.hdr}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={c.title}>CySA+ Study Tracker</p>
            <p style={c.sub}>CS0-003 · All Exam Objectives</p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <a href="https://claude.ai/public/artifacts/ccbb856b-df12-4de6-a100-f1accccef3c4" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a2846", background: "#fff", border: "1px solid #ffc2d4", borderRadius: "20px", padding: "6px 14px", textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: "600", whiteSpace: "nowrap" }}>
              Practice on Claude.ai ↗
            </a>
            {authChecked && (
              isLoggedIn ? (
                <button onClick={handleLogout} style={{ fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a2846", background: "none", border: "1px solid #ffc2d4", borderRadius: "20px", padding: "6px 14px", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
                  Sign out
                </button>
              ) : (
                <button onClick={() => setShowLogin(!showLogin)} style={{ fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#b9375e", background: "#ffe0e9", border: "1px solid #ffc2d4", borderRadius: "20px", padding: "6px 14px", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "700" }}>
                  Sign in
                </button>
              )
            )}
          </div>
        </div>

        <div style={{ fontSize: "8px", color: "#ff9ebb", marginTop: "4px", marginBottom: "4px" }}>
          Practicing on Claude.ai uses your normal Claude usage, not your API credits. Export from there, then Import here to bring your results in.
        </div>

        {showLogin && !isLoggedIn && (
          <form onSubmit={handleLogin} style={{ background: "#fff", border: "1px solid #ffc2d4", borderRadius: "10px", padding: "16px", marginBottom: "16px", maxWidth: "320px" }}>
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required
              style={{ width: "100%", padding: "9px 11px", marginBottom: "8px", border: "1px solid #ffc2d4", borderRadius: "7px", fontSize: "11px", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }} />
            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required
              style={{ width: "100%", padding: "9px 11px", marginBottom: "8px", border: "1px solid #ffc2d4", borderRadius: "7px", fontSize: "11px", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }} />
            {loginError && <div style={{ color: "#C24444", fontSize: "9px", marginBottom: "8px" }}>{loginError}</div>}
            <button type="submit" disabled={loginLoading} style={{ width: "100%", padding: "10px", background: "#b9375e", color: "#fff", border: "none", borderRadius: "7px", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "700", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              {loginLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        <nav className="nav-tabs">
          {["dashboard", "plan", "practice", "log", "videos", "history"].map((t) => (
            <button key={t} className={`nav-tab ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
      </div>

      <div style={c.body}>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <>
            <div style={c.statRow}>
              <div style={c.sBox("#b9375e")}><span style={c.sNum("#b9375e")}>{totalAnswered}</span><span style={c.sLbl}>Answered</span></div>
              <div style={c.sBox("#3F8F5F")}><span style={c.sNum("#3F8F5F")}>{totalCorrect}</span><span style={c.sLbl}>Correct</span></div>
              <div style={c.sBox(overallPct >= 70 ? "#3F8F5F" : "#b9375e")}><span style={c.sNum(overallPct >= 70 ? "#3F8F5F" : "#b9375e")}>{overallPct !== null ? `${overallPct}%` : "—"}</span><span style={c.sLbl}>Overall</span></div>
            </div>

            {examReadiness !== null && (
              <div style={{ ...c.card, textAlign: "center" }}>
                <div style={c.sec}>🎯 Weighted Exam Readiness</div>
                <div style={{ fontSize: "36px", fontWeight: "800", lineHeight: "1", fontFamily: "'Poppins', sans-serif", color: examReadiness >= 70 ? "#3F8F5F" : examReadiness >= 40 ? "#e05780" : "#b9375e" }}>
                  {examReadiness}%
                </div>
                <div style={{ fontSize: "8px", color: "#8a2846", margin: "4px 0 12px" }}>Weighted by exam domain % (33/30/20/17) — not a flat average, so an untouched heavy domain drags this down</div>
                <div style={{ textAlign: "left" }}>
                  {Object.entries(DOMAINS).map(([d, meta]) => {
                    const s = domainStats[d];
                    const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
                    return (
                      <div key={d} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #ffe0e9" }}>
                        <span style={{ fontSize: "9.5px", color: "#522e38" }}>{d} <span style={{ color: "#8a2846" }}>({meta.weight})</span></span>
                        <span style={{ fontSize: "9px", fontWeight: "700", color: acc === null ? "#ff9ebb" : acc >= 70 ? "#3F8F5F" : acc >= 40 ? "#e05780" : "#b9375e" }}>
                          {acc === null ? "not started" : `${acc}%`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(currentPlanWeek || weakestDomain || weakestObjective || stalestDomain) && (
              <div style={{ ...c.card, borderColor: "#ff9ebb", background: "#ffe0e9", marginBottom: "14px" }}>
                <div style={{ fontSize: "8px", color: "#b9375e", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px", fontWeight: "700" }}>📋 Today's Focus</div>

                {currentPlanWeek && (
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "9px", color: "#8a2846", marginBottom: "2px" }}>This week (Week {currentPlanWeek.week})</div>
                    <div style={{ fontSize: "11px", color: "#522e38", fontWeight: "600", marginBottom: currentPlanWeek.objectiveIds.length ? "6px" : "0" }}>{currentPlanWeek.focus}</div>
                    {currentPlanWeek.objectiveIds.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {currentPlanWeek.objectiveIds.map((id) => (
                          <button key={id} onClick={() => jumpToObjective(id)} style={{ fontSize: "9px", padding: "3px 9px", borderRadius: "20px", background: "#fff", border: "1px solid #ffc2d4", color: "#8a2846", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "600" }}>
                            {id}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {weakestDomain && (
                  <div style={{ marginBottom: "10px", paddingTop: currentPlanWeek ? "10px" : "0", borderTop: currentPlanWeek ? "1px solid rgba(185,55,94,0.15)" : "none", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: "9px", color: "#8a2846", marginBottom: "2px" }}>Weakest domain</div>
                      <div style={{ fontSize: "12px", color: "#522e38", fontWeight: "600" }}>{weakestDomain}</div>
                      <div style={{ fontSize: "9px", color: "#8a2846" }}>{domainStats[weakestDomain].correct}/{domainStats[weakestDomain].total} correct</div>
                    </div>
                    <button onClick={() => jumpToDomain(weakestDomain)} style={{ fontSize: "8px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b9375e", background: "#fff", border: "1px solid #ffc2d4", borderRadius: "20px", padding: "5px 10px", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "700", whiteSpace: "nowrap" }}>
                      ▶ Watch videos
                    </button>
                  </div>
                )}

                {weakestObjective && weakestObjectiveId && (
                  <div style={{ marginBottom: "10px", paddingTop: (currentPlanWeek || weakestDomain) ? "10px" : "0", borderTop: (currentPlanWeek || weakestDomain) ? "1px solid rgba(185,55,94,0.15)" : "none", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: "9px", color: "#8a2846", marginBottom: "2px" }}>Weakest objective</div>
                      <div style={{ fontSize: "11px", color: "#522e38", fontWeight: "600" }}>{weakestObjective}</div>
                      <div style={{ fontSize: "9px", color: "#8a2846" }}>{objectiveStats[weakestObjective].correct}/{objectiveStats[weakestObjective].total} correct</div>
                    </div>
                    <button onClick={() => jumpToObjective(weakestObjectiveId)} style={{ fontSize: "8px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#b9375e", background: "#fff", border: "1px solid #ffc2d4", borderRadius: "20px", padding: "5px 10px", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "700", whiteSpace: "nowrap" }}>
                      ▶ Watch videos
                    </button>
                  </div>
                )}

                {stalestDomain && (
                  <div style={{ paddingTop: (currentPlanWeek || weakestDomain || weakestObjective) ? "10px" : "0", borderTop: (currentPlanWeek || weakestDomain || weakestObjective) ? "1px solid rgba(185,55,94,0.15)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "9.5px", color: "#9a6a1a" }}>⏰ {stalestDomain.daysSince} days since you last practiced <strong>{stalestDomain.domain}</strong> — retention risk</div>
                    <button onClick={() => jumpToPractice(stalestDomain.domain)} style={{ fontSize: "8px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a6a1a", background: "#fff", border: "1px solid rgba(154,106,26,0.35)", borderRadius: "20px", padding: "5px 10px", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "700", whiteSpace: "nowrap" }}>
                      ▶ Practice now
                    </button>
                  </div>
                )}
              </div>
            )}

            {coverageGaps.length > 0 && (
              <div style={{ ...c.card, marginBottom: "14px" }}>
                <div style={{ fontSize: "8px", color: "#9a6a1a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px", fontWeight: "700" }}>⚠ Coverage Gaps</div>
                <div style={{ fontSize: "9px", color: "#8a2846", marginBottom: "8px" }}>
                  Thin on both video and practice questions — these genuinely need outside material (an objective thin on just one source isn't listed here, since the other one covers it):
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {coverageGaps.map((o) => (
                    <button key={o.id} onClick={() => jumpToObjective(o.id)} style={{
                      fontSize: "9px", padding: "4px 10px", borderRadius: "20px", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "700",
                      background: OBJECTIVE_VIDEO_STATS[o.id].gap ? "rgba(194,68,68,0.08)" : "rgba(154,106,26,0.08)",
                      border: `1px solid ${OBJECTIVE_VIDEO_STATS[o.id].gap ? "rgba(194,68,68,0.3)" : "rgba(154,106,26,0.3)"}`,
                      color: OBJECTIVE_VIDEO_STATS[o.id].gap ? "#A23333" : "#9a6a1a",
                    }}>
                      {o.id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={c.card}>
              <div style={c.togRow}>
                <button style={c.tog(dashView === "domain")} onClick={() => setDashView("domain")}>By Domain</button>
                <button style={c.tog(dashView === "objective")} onClick={() => setDashView("objective")}>By Objective</button>
              </div>
              {dashView === "domain" ? (
                <BarChart stats={domainStats} colorKey={Object.fromEntries(Object.entries(DOMAINS).map(([k, v]) => [k, v.color]))} order={Object.keys(DOMAINS)} />
              ) : (
                Object.keys(objectiveStats).length > 0
                  ? <BarChart stats={objectiveStats} colorKey={objectiveColorMap} order={ALL_OBJECTIVES_FLAT.map((o) => o.label)} />
                  : <div style={{ color: "#ff9ebb", fontSize: "10px", textAlign: "center", padding: "16px 0" }}>No objective data yet — answer more questions</div>
              )}
            </div>

            <div style={{ ...c.card, display: "flex", justifyContent: "center" }}>
              <div>
                <div style={{ ...c.sec, textAlign: "center" }}>Domain Radar</div>
                <RadarChart domainStats={domainStats} />
              </div>
            </div>

            {/* Objectives checklist */}
            <div style={c.card}>
              <div style={c.sec}>Exam Objective Coverage</div>
              {Object.entries(OBJECTIVES).map(([domain, objs]) => (
                <div key={domain} style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", color: DOMAINS[domain]?.color, letterSpacing: "0.06em", fontWeight: "700", marginBottom: "6px" }}>
                    {domain.toUpperCase()} ({DOMAINS[domain]?.weight})
                  </div>
                  {objs.map((obj) => {
                    const stat = objectiveStats[obj.label] || { correct: 0, total: 0 };
                    const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
                    return (
                      <div key={obj.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #ffe0e9" }}>
                        <span style={{ fontSize: "10.5px", color: "#522e38" }}>{obj.label}</span>
                        <span style={{ fontSize: "9px", color: pct !== null ? (pct >= 70 ? "#3F8F5F" : pct >= 40 ? "#e05780" : "#b9375e") : "#ff9ebb", fontWeight: "700", whiteSpace: "nowrap", marginLeft: "8px" }}>
                          {pct !== null ? `${pct}% (${stat.total})` : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {isLoggedIn && totalAnswered > 0 && (
              <button onClick={clearHistory} style={{ ...c.btn("rgba(255,68,102,0.5)"), background: "transparent" }}>Clear All History</button>
            )}
            {totalAnswered === 0 && <div style={{ textAlign: "center", color: "#ff9ebb", fontSize: "10px", padding: "16px 0" }}>No data yet — head to Practice</div>}

            {/* Export / Import */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button onClick={exportData} style={{ ...c.btn("#3F8F5F"), flex: 1, marginTop: 0 }}>↓ Export Data</button>
              {isLoggedIn && (
                <button onClick={() => { setShowImport(!showImport); setImportStatus(null); }} style={{ ...c.btn("#8a2846"), flex: 1, marginTop: 0 }}>↑ Import Data</button>
              )}
            </div>

            {showImport && isLoggedIn && (
              <div style={{ ...c.card, marginTop: "10px" }}>
                <label style={c.label}>Paste exported JSON backup</label>
                <textarea
                  style={{ ...c.textarea, fontSize: "9px", fontFamily: "'Poppins', sans-serif" }}
                  rows={5}
                  placeholder={'{\n  "history": [...],\n  "seenIds": [...]\n}'}
                  value={importText}
                  onChange={(e) => { setImportText(e.target.value); setImportStatus(null); }}
                />
                {importStatus === "ok" && <div style={{ color: "#3F8F5F", fontSize: "9px", marginBottom: "8px" }}>✓ Imported & merged successfully!</div>}
                {importStatus === "err" && <div style={{ color: "#C24444", fontSize: "9px", marginBottom: "8px" }}>✗ Invalid JSON — make sure you pasted the full export</div>}
                <button style={c.btn("#b9375e")} onClick={importData} disabled={!importText.trim()}>Merge into Current Data</button>
              </div>
            )}
          </>
        )}

        {/* ── PLAN ── */}
        {tab === "plan" && (
          <>
            <div style={c.statRow}>
              <div style={c.sBox(daysUntilExam <= 14 ? "#C24444" : "#b9375e")}><span style={c.sNum()}>{daysUntilExam}</span><span style={c.sLbl}>Days To Exam</span></div>
              <div style={c.sBox("#8a2846")}><span style={c.sNum()}>{Math.min(currentWeekIndex + 1, STUDY_PLAN.length)}/{STUDY_PLAN.length}</span><span style={c.sLbl}>Current Week</span></div>
              <div style={c.sBox("#3F8F5F")}><span style={c.sNum()}>{planCompletedWeeks.length}/{STUDY_PLAN.length}</span><span style={c.sLbl}>Weeks Done</span></div>
            </div>

            <div style={{ fontSize: "8px", color: "#ff9ebb", marginTop: "-8px", marginBottom: "14px" }}>
              8-week compressed plan targeting exam day {new Date(EXAM_DATE + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — chosen over a longer schedule so review stays spread across every week instead of crammed at the end. CS0-003 retires Dec 22, 2026, so this still leaves buffer for a retake if needed.
              {!isLoggedIn && " Sign in to save which weeks you've completed."}
            </div>

            {STUDY_PLAN.map((w, i) => {
              const isComplete = planCompletedWeeks.includes(w.week);
              const isCurrent = i === currentWeekIndex;
              const isPast = i < currentWeekIndex;
              return (
                <div key={w.week} style={{
                  ...c.card,
                  border: `1px solid ${isComplete ? "#3F8F5F" : isCurrent ? "#b9375e" : "#ffc2d4"}`,
                  background: isComplete ? "rgba(63,143,95,0.05)" : isCurrent ? "#fff7fa" : "#fff",
                  opacity: isPast && !isComplete ? 0.7 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "10px", color: "#b9375e", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "700" }}>
                      Week {w.week} · {formatWeekRange(w.start)}
                      {isCurrent && <span style={{ marginLeft: "8px", fontSize: "8px", background: "#b9375e", color: "#fff", padding: "2px 8px", borderRadius: "20px" }}>CURRENT</span>}
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: isLoggedIn ? "pointer" : "default" }}>
                      <input type="checkbox" checked={isComplete} disabled={!isLoggedIn} onChange={() => togglePlanWeek(w.week)} title={!isLoggedIn ? "Sign in to track progress" : undefined}
                        style={{ accentColor: "#3F8F5F", cursor: isLoggedIn ? "pointer" : "default" }} />
                      <span style={{ fontSize: "8px", color: "#8a2846", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "700" }}>Done</span>
                    </label>
                  </div>
                  <div style={{ fontSize: "11px", color: "#522e38", marginBottom: "6px", lineHeight: "1.5" }}>{w.focus}</div>
                  <div style={{ fontSize: "9px", color: "#8a2846", marginBottom: w.objectiveIds.length ? "8px" : "0", lineHeight: "1.5" }}>
                    <strong style={{ color: "#b9375e" }}>Review: </strong>{w.review}
                  </div>
                  {w.objectiveIds.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {w.objectiveIds.map((id) => (
                        <button key={id} onClick={() => jumpToObjective(id)} style={{ fontSize: "9px", padding: "3px 9px", borderRadius: "20px", background: "#ffe0e9", border: "1px solid #ffc2d4", color: "#8a2846", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "600" }}>
                          {id}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ ...c.card, textAlign: "center", borderColor: "#b9375e", background: "#fff7fa" }}>
              <div style={{ fontSize: "10px", color: "#b9375e", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>🎯 Exam Day</div>
              <div style={{ fontSize: "12px", color: "#522e38", fontWeight: "600" }}>{new Date(EXAM_DATE + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
            </div>
          </>
        )}

        {/* ── PRACTICE ── */}
        {tab === "practice" && !isLoggedIn && (
          <div style={{ ...c.card, textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "12px", color: "#522e38", marginBottom: "6px", fontWeight: "600" }}>Sign in required</div>
            <div style={{ fontSize: "10px", color: "#8a2846" }}>Practice mode logs new answers, so it's locked to your account. Use the Sign in button above.</div>
          </div>
        )}
        {tab === "practice" && isLoggedIn && (
          <>
            {questionSource === "recommended" ? (
              <div style={{ ...c.card, marginBottom: "10px" }}>
                <div style={{ fontSize: "8px", color: "#b9375e", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "700", marginBottom: "4px" }}>🎯 Auto-targeting</div>
                {recommendedTarget ? (
                  <>
                    <div style={{ fontSize: "12px", color: "#522e38", fontWeight: "600" }}>{recommendedTarget.objectiveId ? ALL_OBJECTIVES_FLAT.find((o) => o.id === recommendedTarget.objectiveId)?.label : recommendedTarget.domain}</div>
                    <div style={{ fontSize: "9px", color: "#8a2846" }}>{recommendedTarget.reason}</div>
                  </>
                ) : (
                  <div style={{ fontSize: "10px", color: "#ff9ebb" }}>No weak spots or stale domains detected yet — answer a few questions first. Pulling from all domains for now.</div>
                )}
              </div>
            ) : (
              <>
                <select style={c.sel} value={filterDomain} onChange={(e) => { setFilterDomain(e.target.value); setFilterObjective("Any Objective"); setCurrentQ(null); setSelected(null); setRevealed(false); }}>
                  <option>Any Domain</option>
                  {Object.keys(DOMAINS).map((d) => <option key={d}>{d}</option>)}
                </select>

                <select style={c.sel} value={filterObjective} onChange={(e) => { setFilterObjective(e.target.value); setCurrentQ(null); setSelected(null); setRevealed(false); }}>
                  {availableObjectives.map((o) => <option key={o.id} value={o.id === "any" ? "Any Objective" : o.label}>{o.label}</option>)}
                </select>
              </>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9px", color: "#8a2846", marginTop: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={includeLowConfidence}
                onChange={(e) => { setIncludeLowConfidence(e.target.checked); setCurrentQ(null); setSelected(null); setRevealed(false); }}
              />
              Include low-confidence questions (answer may be debatable)
            </label>

            <div style={{ display: "flex", gap: "6px", marginTop: "8px", marginBottom: "4px" }}>
              {[
                { key: "recommended", label: "🎯 Recommended" },
                { key: "book", label: "📚 Question Bank" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setQuestionSource(opt.key); setCurrentQ(null); setSelected(null); setRevealed(false); setApiError(null); }}
                  style={{
                    flex: 1,
                    padding: "8px 6px",
                    fontSize: "9px",
                    letterSpacing: "0.06em",
                    borderRadius: "8px",
                    border: `1px solid ${questionSource === opt.key ? "#b9375e" : "#ffc2d4"}`,
                    background: questionSource === opt.key ? "#b9375e" : "#fff",
                    color: questionSource === opt.key ? "#fff" : "#8a2846",
                    cursor: "pointer",
                    fontWeight: questionSource === opt.key ? 700 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {!currentQ && (
              <div style={{ textAlign: "center", paddingTop: "30px" }}>
                <div style={{ color: "#ff9ebb", fontSize: "10px", marginBottom: "16px" }}>
                  {questionSource === "recommended"
                    ? (recommendedTarget ? (recommendedTarget.objectiveId ? ALL_OBJECTIVES_FLAT.find((o) => o.id === recommendedTarget.objectiveId)?.label : recommendedTarget.domain) : "All domains & objectives")
                    : filterObjective !== "Any Objective" ? filterObjective : filterDomain !== "Any Domain" ? filterDomain : "All domains & objectives"}
                </div>
                <button style={c.btn("#b9375e")} onClick={loadQuestion}>Start Question →</button>
              </div>
            )}

            {apiError && (
              <div style={{ color: "#C24444", fontSize: "10px", textAlign: "center", padding: "16px 0" }}>
                {apiError}<br />
                <button style={{ ...c.btn("#C24444"), width: "auto", padding: "8px 18px", marginTop: "10px" }} onClick={loadQuestion}>Retry</button>
              </div>
            )}

            {currentQ && (
              <div style={c.card}>
                <span style={c.domTag(currentQ.domain)}>{currentQ.domain}</span>
                {getObjectiveLabel(currentQ) && <span style={c.objTag(currentQ.domain)}>{getObjectiveLabel(currentQ)}</span>}
                {currentQ.topic && <div style={{ fontSize: "8px", color: "#8a2846", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: currentQ.confidence === "low" ? "2px" : "10px" }}>Topic: {currentQ.topic}</div>}
                {currentQ.confidence === "low" && (
                  <div style={{ fontSize: "8px", color: "#9a6a1a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>⚠ Debatable answer</div>
                )}
                <div style={{ fontSize: "12px", lineHeight: "1.75", marginBottom: "16px", color: "#522e38" }}>{currentQ.question}</div>

                {isMultiSelect && (
                  <div style={{ fontSize: "8px", color: "#8a2846", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Select all that apply</div>
                )}
                {currentQ.options.map((opt, i) => {
                  const isPicked = isMultiSelect ? selected?.includes(i) : i === selected;
                  let state = "default";
                  if (revealed) {
                    if (currentQ.answer.includes ? currentQ.answer.includes(i) : i === currentQ.answer) state = "correct";
                    else if (isPicked) state = "wrong";
                  } else if (isPicked) state = "selected";
                  const toggle = () => {
                    if (revealed) return;
                    if (isMultiSelect) {
                      setSelected((prev) => {
                        const cur = prev || [];
                        return cur.includes(i) ? cur.filter((v) => v !== i) : [...cur, i];
                      });
                    } else {
                      setSelected(i);
                    }
                  };
                  return <button key={i} style={c.opt(state, revealed)} onClick={toggle}>{isMultiSelect ? (isPicked ? "☑ " : "☐ ") : ""}{opt}</button>;
                })}

                {!revealed
                  ? <button style={{ ...c.btn("#b9375e"), opacity: (isMultiSelect ? !selected?.length : selected === null) ? 0.35 : 1 }} onClick={submitAnswer} disabled={isMultiSelect ? !selected?.length : selected === null}>Submit Answer</button>
                  : <>
                    <div style={c.expl}><strong style={{ color: "#b9375e" }}>Explanation: </strong>{currentQ.explanation}</div>
                    {currentQ.objectiveId && (
                      <button onClick={() => jumpToObjective(currentQ.objectiveId)} style={{ width: "100%", padding: "9px", background: "#fff", border: "1px solid #ffc2d4", borderRadius: "8px", color: "#b9375e", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "700", marginTop: "8px" }}>
                        ▶ Watch video for {currentQ.objectiveId}
                      </button>
                    )}
                    <button style={c.btn("#8a2846")} onClick={loadQuestion}>Next Question →</button>
                  </>
                }
              </div>
            )}
          </>
        )}

        {/* ── LOG ── */}
        {tab === "log" && !isLoggedIn && (
          <div style={{ ...c.card, textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "12px", color: "#522e38", marginBottom: "6px", fontWeight: "600" }}>Sign in required</div>
            <div style={{ fontSize: "10px", color: "#8a2846" }}>Logging questions writes to your tracker, so it's locked to your account. Use the Sign in button above.</div>
          </div>
        )}
        {tab === "log" && isLoggedIn && (
          <>
            <div style={{ fontSize: "9px", color: "#8a2846", marginBottom: "14px", lineHeight: "1.6" }}>
              Got a question from a screenshot, practice exam, or study session? Log it here to fold it into your stats.
            </div>

            <div style={c.card}>
              {/* Step 1: paste question + AI classify */}
              <label style={c.label}>Question text</label>
              <textarea style={c.textarea} rows={4} placeholder="Paste or type the question..." value={logQuestion} onChange={(e) => setLogQuestion(e.target.value)} />

              <button
                style={{ ...c.btn("#8a2846"), opacity: (!logQuestion.trim() || logClassifying) ? 0.45 : 1, marginBottom: "14px" }}
                onClick={classifyQuestion}
                disabled={!logQuestion.trim() || logClassifying}
              >
                {logClassifying ? "⟳ Classifying..." : "✦ AI: Auto-detect Domain & Objective"}
              </button>

              {/* Domain */}
              <label style={c.label}>Domain</label>
              <select style={c.sel} value={logDomain} onChange={(e) => { setLogDomain(e.target.value); setLogObjective(OBJECTIVES[e.target.value][0].id); setLogObjSearch(""); }}>
                {Object.keys(DOMAINS).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>

              {/* Searchable objective picker */}
              <label style={c.label}>Exam Objective</label>
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <div
                  style={{ ...c.sel, marginBottom: 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  onClick={() => setLogObjOpen(!logObjOpen)}
                >
                  <span style={{ color: logObjective ? "#522e38" : "#8a2846", fontSize: "10px" }}>
                    {ALL_OBJECTIVES_FLAT.find(o => o.id === logObjective)?.label || "Select objective..."}
                  </span>
                  <span style={{ color: "#8a2846", fontSize: "9px" }}>{logObjOpen ? "▲" : "▼"}</span>
                </div>
                {logObjOpen && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ffc2d4", borderRadius: "7px", zIndex: 99, maxHeight: "220px", overflow: "hidden", marginTop: "3px", boxShadow: "0 4px 16px rgba(122,35,72,0.12)" }}>
                    <input
                      autoFocus
                      style={{ ...c.sel, marginBottom: 0, borderRadius: "7px 7px 0 0", border: "none", borderBottom: "1px solid #ffc2d4" }}
                      placeholder="Search objectives..."
                      value={logObjSearch}
                      onChange={(e) => setLogObjSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div style={{ overflowY: "auto", maxHeight: "172px" }}>
                      {ALL_OBJECTIVES_FLAT
                        .filter(o => !logObjSearch || o.label.toLowerCase().includes(logObjSearch.toLowerCase()))
                        .map(o => (
                          <div
                            key={o.id}
                            style={{ padding: "9px 12px", fontSize: "10px", fontFamily: "'Poppins', sans-serif", color: o.id === logObjective ? "#b9375e" : "#8a2846", background: o.id === logObjective ? "rgba(194,68,122,0.07)" : "transparent", cursor: "pointer", borderBottom: "1px solid #ffe0e9" }}
                            onClick={() => { setLogDomain(o.domain); setLogObjective(o.id); setLogObjOpen(false); setLogObjSearch(""); }}
                          >
                            <span style={{ color: DOMAINS[o.domain]?.color, marginRight: "6px", fontSize: "9px" }}>{o.id}</span>
                            {o.label.replace(/^\d+\.\d+\s–\s/, "")}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Topic */}
              <label style={c.label}>Topic (short label)</label>
              <input style={c.sel} placeholder="e.g. Reverse Engineering Binaries" value={logTopic} onChange={(e) => setLogTopic(e.target.value)} />

              {/* Result toggle */}
              <label style={c.label}>Result</label>
              <div style={c.toggleRow}>
                <button style={c.tog(logCorrect)} onClick={() => setLogCorrect(true)}>✓ Got it right</button>
                <button style={c.tog(!logCorrect)} onClick={() => setLogCorrect(false)}>✗ Got it wrong</button>
              </div>

              {/* Correct answer */}
              <label style={c.label}>Correct Answer</label>
              <input style={c.sel} placeholder="e.g. C. Reverse engineering" value={logAnswer} onChange={(e) => setLogAnswer(e.target.value)} />

              {/* Explanation */}
              <label style={c.label}>Explanation (why that answer?)</label>
              <textarea style={c.textarea} rows={3} placeholder="Explain why the correct answer is right and the distractors are wrong..." value={logExplanation} onChange={(e) => setLogExplanation(e.target.value)} />

              <button style={c.btn("#b9375e")} onClick={logManualQuestion} disabled={!logQuestion.trim()}>
                {logSaved ? "✓ Saved to tracker" : "Save to Tracker"}
              </button>
            </div>
          </>
        )}

        {/* ── VIDEOS ── */}
        {tab === "videos" && (
          <>
            <div style={c.statRow}>
              <div style={c.sBox("#b9375e")}><span style={c.sNum()}>{totalVideos}</span><span style={c.sLbl}>Total Videos</span></div>
              <div style={c.sBox("#3F8F5F")}><span style={c.sNum()}>{watchedVideoCount}</span><span style={c.sLbl}>Watched</span></div>
              <div style={c.sBox(watchedVideoPct >= 70 ? "#3F8F5F" : "#b9375e")}><span style={c.sNum()}>{watchedVideoPct}%</span><span style={c.sLbl}>Complete</span></div>
            </div>

            <div style={{ fontSize: "8px", color: "#ff9ebb", marginTop: "-8px", marginBottom: "14px" }}>
              CompTIA CySA+ Full Course (CS0-003) by Certify Breakfast — 58 videos, re-mapped from the course's original 5-domain outline to the current objectives below.
              {!isLoggedIn && " Sign in to save your watched checkmarks."}
            </div>

            <div style={c.card}>
              <div style={c.sec}>Orientation</div>
              {VIDEOS.filter((v) => v.section === "orientation").map((v) => (
                <VideoRow key={v.id} video={v} checked={watchedVideos.includes(v.id)} onToggle={toggleWatched} disabled={!isLoggedIn} />
              ))}
            </div>

            {Object.entries(OBJECTIVES).map(([domain, objs]) => {
              const domainVideos = VIDEOS.filter((v) => v.objectives?.some((o) => objs.some((obj) => obj.id === o)));
              const domainVideoIds = new Set(domainVideos.map((v) => v.id));
              const domainWatched = [...domainVideoIds].filter((id) => watchedVideos.includes(id)).length;
              const domainTotalSec = domainVideos.reduce((a, v) => a + durationToSeconds(v.duration), 0);
              const courseSharePct = TOTAL_VIDEO_SECONDS > 0 ? Math.round((domainTotalSec / TOTAL_VIDEO_SECONDS) * 100) : 0;
              const weightPct = parseInt(DOMAINS[domain]?.weight, 10) || 0;
              const underCovered = courseSharePct < weightPct - 5;
              const domainHighlighted = highlightTarget === `domain:${domain}`;
              return (
                <div key={domain} id={`domain-${domain.replace(/\s+/g, "-")}`}
                  style={{ ...c.card, ...(domainHighlighted ? { boxShadow: "0 0 0 3px rgba(185,55,94,0.35)", background: "#fff7fa" } : {}) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <div style={{ fontSize: "10px", color: DOMAINS[domain]?.color, letterSpacing: "0.06em", fontWeight: "700" }}>
                      {domain.toUpperCase()} ({DOMAINS[domain]?.weight})
                    </div>
                    <div style={{ fontSize: "9px", color: "#8a2846", fontWeight: "700", whiteSpace: "nowrap" }}>
                      {domainVideoIds.size > 0 ? `${domainWatched}/${domainVideoIds.size} watched` : "—"}
                    </div>
                  </div>
                  <div style={{ fontSize: "8px", color: underCovered ? "#9a6a1a" : "#ff9ebb", marginBottom: "10px" }}>
                    {weightPct}% of exam · {courseSharePct}% of this course's runtime{underCovered ? " — under-represented here, plan extra outside review" : ""}
                  </div>
                  {objs.map((obj) => {
                    const vids = VIDEOS.filter((v) => v.objectives?.includes(obj.id));
                    const objWatched = vids.filter((v) => watchedVideos.includes(v.id)).length;
                    const stat = OBJECTIVE_VIDEO_STATS[obj.id];
                    const objHighlighted = highlightTarget === obj.id;
                    return (
                      <div key={obj.id} id={`obj-${obj.id}`}
                        style={{
                          marginBottom: objHighlighted ? "6px" : "14px",
                          ...(objHighlighted ? { boxShadow: "0 0 0 3px rgba(185,55,94,0.35)", borderRadius: "8px", background: "#fff7fa", padding: "8px", marginTop: "-8px", marginLeft: "-8px", marginRight: "-8px" } : {}),
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "10.5px", color: "#522e38", fontWeight: "600" }}>{obj.label}</span>
                          <span style={{ fontSize: "9px", fontWeight: "700", color: vids.length === 0 ? "#ff9ebb" : objWatched === vids.length ? "#3F8F5F" : "#b9375e", whiteSpace: "nowrap", marginLeft: "8px" }}>
                            {vids.length > 0 ? `${objWatched}/${vids.length}` : "—"}
                          </span>
                        </div>
                        {(() => {
                          const qCount = QUESTION_COUNTS_BY_OBJECTIVE[obj.id] || 0;
                          const questionThin = qCount < QUESTION_THIN_THRESHOLD;
                          if (stat?.gap) {
                            return questionThin
                              ? <div style={{ fontSize: "9px", color: "#A23333", background: "rgba(194,68,68,0.08)", border: "1px solid rgba(194,68,68,0.25)", borderRadius: "6px", padding: "5px 8px", marginBottom: "6px" }}>
                                  ⚠ No video AND only {qCount} practice question{qCount === 1 ? "" : "s"} — this objective needs outside material.
                                </div>
                              : <div style={{ fontSize: "9px", color: "#8a2846", background: "#ffe0e9", border: "1px solid #ffc2d4", borderRadius: "6px", padding: "5px 8px", marginBottom: "6px" }}>
                                  No video in this playlist, but {qCount} practice questions are available — drill it in Practice instead.
                                </div>;
                          }
                          if (stat?.thin) {
                            return questionThin
                              ? <div style={{ fontSize: "9px", color: "#9a6a1a", background: "rgba(154,106,26,0.08)", border: "1px solid rgba(154,106,26,0.25)", borderRadius: "6px", padding: "5px 8px", marginBottom: "6px" }}>
                                  ⚠ Thin coverage ({Math.round(stat.totalSec / 60)} min video, {qCount} questions) — consider supplementing.
                                </div>
                              : <div style={{ fontSize: "9px", color: "#8a2846", background: "#ffe0e9", border: "1px solid #ffc2d4", borderRadius: "6px", padding: "5px 8px", marginBottom: "6px" }}>
                                  Only {Math.round(stat.totalSec / 60)} min of video, but {qCount} practice questions are available.
                                </div>;
                          }
                          return null;
                        })()}
                        {vids.map((v) => (
                          <VideoRow key={`${obj.id}-${v.id}`} video={v} checked={watchedVideos.includes(v.id)} onToggle={toggleWatched} disabled={!isLoggedIn} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <div style={c.card}>
              <div style={c.sec}>Supplemental</div>
              <div style={{ fontSize: "9px", color: "#8a2846", marginBottom: "8px" }}>Doesn't map to a CS0-003 objective, but worth watching.</div>
              {VIDEOS.filter((v) => v.section === "supplemental").map((v) => (
                <VideoRow key={v.id} video={v} checked={watchedVideos.includes(v.id)} onToggle={toggleWatched} disabled={!isLoggedIn} />
              ))}
            </div>
          </>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <>
            {(() => {
              const missedCount = history.filter((h) => h.correct === false).length;
              return (
                <div style={c.togRow}>
                  <button style={c.tog(historyFilter === "all")} onClick={() => setHistoryFilter("all")}>All ({history.length})</button>
                  <button style={c.tog(historyFilter === "missed")} onClick={() => setHistoryFilter("missed")}>🔁 Missed Only ({missedCount})</button>
                </div>
              );
            })()}
            <div style={c.sec}>{historyFilter === "missed" ? "Missed Questions — Review These" : `Recent Questions (${history.length} total)`}</div>
            {history.length === 0 && <div style={{ color: "#ff9ebb", fontSize: "10px", textAlign: "center", padding: "36px 0" }}>No history yet</div>}
            {history.length > 0 && historyFilter === "missed" && history.filter((h) => h.correct === false).length === 0 && (
              <div style={{ color: "#3F8F5F", fontSize: "10px", textAlign: "center", padding: "36px 0" }}>Nothing missed — you've gotten everything right so far.</div>
            )}
            {(historyFilter === "missed" ? history.filter((h) => h.correct === false) : history).slice(0, 60).map((h, i) => {
              const key = h.id ? `${h.id}-${h.timestamp}` : i;
              const isOpen = expandedHistId === key;
              // Backfill missing detail (older entries saved before full question/options/explanation were stored)
              let hh = h;
              if (!h.options && !h.explanation) {
                const seed = SEED_QUESTIONS.find((s) => s.id === h.id);
                if (seed) {
                  hh = {
                    ...h,
                    question: seed.question,
                    options: seed.options,
                    answerIndex: seed.answer,
                    answer: seed.options[seed.answer],
                    explanation: seed.explanation,
                  };
                }
              }
              return (
                <div key={key} style={{ ...c.histItem(hh.correct), cursor: "pointer" }} onClick={() => setExpandedHistId(isOpen ? null : key)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={c.domTag(hh.domain)}>{DOMAINS[hh.domain]?.short || hh.domain}</span>
                      {hh.source && <span style={{ fontSize: "7px", color: "#b9375e", opacity: 0.65, marginLeft: "6px", letterSpacing: "0.04em" }}>{hh.source}</span>}
                      {hh.objectiveLabel && <div style={{ fontSize: "8px", color: "#8a2846", marginBottom: "2px", letterSpacing: "0.06em" }}>{hh.objectiveLabel}</div>}
                      {hh.topic && <div style={{ fontSize: "8px", color: "#ff9ebb", marginBottom: "3px" }}>{hh.topic}</div>}
                      <div style={{ fontSize: "9px", color: "#8a2846", overflow: isOpen ? "visible" : "hidden", textOverflow: "ellipsis", whiteSpace: isOpen ? "normal" : "nowrap" }}>
                        {hh.question}
                      </div>
                      {!isOpen && hh.answer && <div style={{ fontSize: "9px", color: "#3F8F5F", marginTop: "3px" }}>Answer: {hh.answer}</div>}
                    </div>
                    <span style={{ fontSize: "15px", flexShrink: 0 }}>{hh.correct ? "✓" : "✗"}</span>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #ffc2d4" }} onClick={(e) => e.stopPropagation()}>
                      {hh.options && hh.options.length > 0 && (
                        <div style={{ marginBottom: "10px" }}>
                          {hh.options.map((opt, oi) => {
                            const isCorrectOpt = Array.isArray(hh.answerIndex) ? hh.answerIndex.includes(oi) : oi === hh.answerIndex;
                            const isYourPick = (hh.yourAnswer || "").split("; ").includes(opt) && !hh.correct;
                            return (
                              <div key={oi} style={{
                                fontSize: "10px", padding: "6px 9px", marginBottom: "4px", borderRadius: "6px",
                                background: isCorrectOpt ? "rgba(63,143,95,0.08)" : isYourPick ? "rgba(194,68,68,0.08)" : "#fff",
                                border: `1px solid ${isCorrectOpt ? "rgba(63,143,95,0.3)" : isYourPick ? "rgba(194,68,68,0.3)" : "#ffe0e9"}`,
                                color: isCorrectOpt ? "#2D6B45" : isYourPick ? "#A23333" : "#522e38",
                              }}>
                                {opt}{isCorrectOpt ? "  ✓" : isYourPick ? "  ✗ (your answer)" : ""}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {!hh.options && hh.answer && (
                        <div style={{ fontSize: "10px", color: "#2D6B45", fontWeight: "600", marginBottom: "8px" }}>Correct Answer: {hh.answer}</div>
                      )}
                      {hh.explanation && (
                        <div style={c.expl}><strong style={{ color: "#b9375e" }}>Explanation: </strong>{hh.explanation}</div>
                      )}
                      {hh.objectiveId && (
                        <button onClick={() => jumpToObjective(hh.objectiveId)} style={{ width: "100%", padding: "9px", background: "#fff", border: "1px solid #ffc2d4", borderRadius: "8px", color: "#b9375e", fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "700", marginTop: "8px" }}>
                          ▶ Watch video for {hh.objectiveId}
                        </button>
                      )}
                      <div style={{ fontSize: "8px", color: "#ff9ebb", marginTop: "8px" }}>{new Date(hh.timestamp).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
