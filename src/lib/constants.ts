export const siteConfig = {
  name: "Pattie",
  shortName: "Pattie",
  tagline: "Virtual audio devices, made by your app",
  description:
    "Named virtual microphones and speakers that any app can create, and every other app sees as real audio devices. No VB-CABLE. No reboot. No admin prompt in your app.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export const links = {
  docs: "/docs",
  github: "https://github.com/YOUR-ORG/pattie",
  discord: "https://discord.gg/YOUR-INVITE",
} as const;

export const navLinks = [
  { label: "Docs", href: links.docs },
  { label: "CLI", href: `${links.docs}/cli` },
  { label: "Roadmap", href: "/#status" },
  { label: "Community", href: links.discord },
  { label: "GitHub", href: links.github },
] as const;
