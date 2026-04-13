export type TeamMember = {
  id: string;
  slug: string;
  name: string;
  role: string;
  skills: string[];
  image?: string;
  github?: string;
  linkedin?: string;
  tier: "core" | "lead" | "member";
};

export const teamMembers: TeamMember[] = [
  {
    id: "abhishek",
    slug: "abhishek",
    name: "Abhishek",
    role: "Full Stack Architect",
    skills: ["React/Next.js", "Node.js", "Cyber Security", "UI/UX Design"],
    tier: "core",
    github: "#",
    linkedin: "#"
  },
  {
    id: "adrash",
    slug: "adrash",
    name: "Adrash",
    role: "Full Stack Dev.",
    skills: ["React/Next.js", "Node.js", "Backend Systems"],
    tier: "lead",
    github: "#",
    linkedin: "#"
  },
  {
    id: "utkarsh",
    slug: "utkarsh",
    name: "Utkarsh",
    role: "Full Stack Dev.",
    skills: ["Full Stack Development", "APIs", "System Design"],
    tier: "lead",
    github: "#",
    linkedin: "#"
  },
  {
    id: "alex",
    slug: "alex-vance",
    name: "Alex Vance",
    role: "President",
    skills: ["Offensive Security", "Reverse Engineering", "C/C++"],
    tier: "core",
    github: "#",
    linkedin: "#"
  },
  {
    id: "sarah",
    slug: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Vice President",
    skills: ["Cloud Security", "DevSecOps", "AWS"],
    tier: "core",
    github: "#"
  },
  {
    id: "marcus",
    slug: "marcus-chen",
    name: "Marcus Chen",
    role: "Head of Operations",
    skills: ["Network Security", "Blue Teaming", "Python"],
    tier: "core",
    linkedin: "#"
  },
  {
    id: "elena",
    slug: "elena-rodriguez",
    name: "Elena Rodriguez",
    role: "CTF Lead",
    skills: ["Cryptography", "Pwn", "Rust"],
    tier: "lead",
    github: "#"
  },
  {
    id: "david",
    slug: "david-kim",
    name: "David Kim",
    role: "Web Security Lead",
    skills: ["Web Exploitation", "Bug Bounty", "JavaScript"],
    tier: "lead",
    github: "#"
  },
  {
    id: "priya",
    slug: "priya-patel",
    name: "Priya Patel",
    role: "Hardware Security Lead",
    skills: ["IoT", "Embedded Systems", "Assembly"],
    tier: "lead",
  },
  {
    id: "james",
    slug: "james-wilson",
    name: "James Wilson",
    role: "Events Lead",
    skills: ["Logistics", "OSINT", "Public Speaking"],
    tier: "lead",
  },
  {
    id: "nina",
    slug: "nina-simone",
    name: "Nina Simone",
    role: "Member",
    skills: ["Malware Analysis", "Python"],
    tier: "member",
  },
  {
    id: "tom",
    slug: "tom-hardy",
    name: "Tom Hardy",
    role: "Member",
    skills: ["Penetration Testing", "Bash"],
    tier: "member",
  },
  {
    id: "alice",
    slug: "alice-wonderland",
    name: "Alice Wonderland",
    role: "Member",
    skills: ["Cryptography", "Math"],
    tier: "member",
  },
  {
    id: "bob",
    slug: "bob-builder",
    name: "Bob Builder",
    role: "Member",
    skills: ["Infrastructure", "Docker"],
    tier: "member",
  },
  {
    id: "eve",
    slug: "eve-hacker",
    name: "Eve Hacker",
    role: "Member",
    skills: ["Social Engineering", "OSINT"],
    tier: "member",
  },
  {
    id: "charlie",
    slug: "charlie-brown",
    name: "Charlie Brown",
    role: "Member",
    skills: ["Web Security", "React"],
    tier: "member",
  }
];
