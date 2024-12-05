/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "localhost:3000",
  generateRobotsTxt: true,
  sitemapSize: 10000,
  exclude: ["/getCountryFlags"],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.SITE_URL || "localhost:3000"}/server-sitemap-index.xml`,
    ],
  },
};
