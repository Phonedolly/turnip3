import getInitData from "@/lib/getInitData";
// eslint-disable @typescript-eslint/no-explicit-any
import { getServerSideSitemap } from "next-sitemap";

export async function GET() {
  const initData = await getInitData();
  const app_url = process.env.NEXT_PUBLIC_APP_URL?.endsWith("/")
    ? process.env.NEXT_PUBLIC_APP_URL.slice(
        0,
        process.env.NEXT_PUBLIC_APP_URL.lastIndexOf("/"),
      )
    : process.env.NEXT_PUBLIC_APP_URL;

  return getServerSideSitemap(
    initData.posts
      .filter((compiledPost) => compiledPost.frontmatter.complete === true)
      .map((compiledPost) => {
        return {
          loc: `${app_url}/${compiledPost.frontmatter.epoch}`,
          lastmod: `${
            compiledPost.frontmatter.updateTime !== undefined
              ? new Date(
                  compiledPost.frontmatter.updateTime[
                    compiledPost.frontmatter.updateTime.length - 1
                  ],
                ).toISOString()
              : new Date().toISOString()
          }`,
          changefreq: "weekly",
        };
      })
      .concat(
        initData.posts.reduce(
          (acc, _, i) => {
            if (i === 0) {
              return acc.concat([
                {
                  loc: `${app_url}`,
                  lastmod: new Date().toISOString(),
                  changefreq: "hourly",
                },
              ]);
            } else if ((i + 1) % 10 === 0) {
              return acc.concat([
                {
                  loc: `${app_url}/${String(Math.floor((i + 1) / 10))}`,
                  lastmod: new Date().toISOString(),
                  changefreq: "hourly",
                },
              ]);
            }
            return acc;
          },
          [] as { loc: string; lastmod: string; changefreq: string }[],
        ),
      ),
    // .concat(
    //   initData.categories.map((category) => ({
    //     loc: `${app_url}/${category}`,
    //     lastmod: new Date().toISOString(),
    //     changefreq: "hourly",
    //   })),
    // ),
  );
}
