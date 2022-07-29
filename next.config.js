/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['files.slack.com','avatars.slack-edge.com','secure.gravatar.com'],
  },
}

module.exports = nextConfig
