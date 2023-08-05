import getInitData from '@/lib/getInitData'
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
    initData.compiledPosts
      .filter((compiledPost) => compiledPost.frontmatter.complete === true)
      .map((compiledPost) => {
        return {
          loc: `${app_url}/${compiledPost.epoch}`,
          lastmod: `${new Date(
            compiledPost.frontmatter.updateTime[
              compiledPost.frontmatter.updateTime.length - 1
            ],
          ).toISOString()}`,
          changefreq: "weekly",
        };
      })
      .concat(
        initData.categories.map((category) => ({
          loc: `${app_url}/${category}`,
          lastmod: new Date().toISOString(),
          changefreq: "hourly",
        })),
      ),
  );
}
