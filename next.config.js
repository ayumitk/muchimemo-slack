/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['files.slack.com','avatars.slack-edge.com','secure.gravatar.com'],
  },
  i18n: {
    locales: ["ja"],
    defaultLocale: "ja",
  },
}

module.exports = nextConfig
