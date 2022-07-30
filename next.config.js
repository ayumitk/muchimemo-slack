/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['files.slack.com','avatars.slack-edge.com','secure.gravatar.com','img.youtube.com','images-fe.ssl-images-amazon.com','cdn.discordapp.com','newsatcl-pctr.c.yimg.jp','eiga.k-img.com','static-spur.hpplus.jp','i.guim.co.uk','cdn.cnn.com','deadline.com','image.news.livedoor.com','i.gzn.jp','discord.com','i.ytimg.com','media.npr.org','embed.pixiv.net','img.papy.co.jp','media-cldnry.s-nbcnews.com','dxdpress.com','images.gr-assets.com'],
  },
  i18n: {
    locales: ["ja"],
    defaultLocale: "ja",
  },
}

module.exports = nextConfig
