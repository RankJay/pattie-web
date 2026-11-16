export const siteConfig = {
  name: "Pattie",
  shortName: "Pattie",
  tagline: "Manage virtual audio devices",
  description: "Pattie is a platform for managing virtual audio devices",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;
