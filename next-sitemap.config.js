/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  exclude: ['/deploy', '/writer/*', '/post/*', '/server-sitemap-index.xml', '/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [{
      userAgent: "*",
      disallow: ["/deploy", "/wrtier/*",],
      allow: ["/", "/category/*", "/post/*"],
    }],
    additionalSitemaps: [`${process.env.NEXT_PUBLIC_APP_URL?.endsWith("/")
      ? process.env.NEXT_PUBLIC_APP_URL.slice(
        0,
        process.env.NEXT_PUBLIC_APP_URL.lastIndexOf("/"),
      )
      : process.env.NEXT_PUBLIC_APP_URL}/server-sitemap.xml`,
    ],
  },
  // ...other options
}