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
              : Date.now()
          }`,
          changefreq: "weekly",
        };
      }),
    // .concat(
    //   initData.categories.map((category) => ({
    //     loc: `${app_url}/${category}`,
    //     lastmod: new Date().toISOString(),
    //     changefreq: "hourly",
    //   })),
    // ),
  );
}
