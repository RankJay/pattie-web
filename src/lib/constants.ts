export const siteConfig = {
  name: "Pattie",
  shortName: "Pattie",
  tagline: "Virtual audio devices, created from code",
  description:
    "Your app creates a named microphone or speaker. Other apps list it like ordinary hardware. One call creates it, one call drops it, and your users never install a virtual cable.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

const github = "https://github.com/YOUR-ORG/pattie";

export const links = {
  github,
  readme: `${github}#readme`,
  method: `${github}#where-it-stands`,
  discord: "https://discord.gg/YOUR-INVITE",
} as const;

export const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Status", href: "/#status" },
  { label: "Community", href: links.discord },
  { label: "GitHub", href: links.github },
] as const;
