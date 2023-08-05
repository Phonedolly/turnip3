import getInitData from "@/lib/getInitData";
// eslint-disable @typescript-eslint/no-explicit-any
import { getServerSideSitemapIndex } from "next-sitemap";

export async function GET(request: Request) {
  const app_url = process.env.NEXT_PUBLIC_APP_URL?.endsWith("/")
    ? process.env.NEXT_PUBLIC_APP_URL.slice(
        0,
        process.env.NEXT_PUBLIC_APP_URL.lastIndexOf("/"),
      )
    : process.env.NEXT_PUBLIC_APP_URL;

  // const initData = await getInitData();

  // const completePostLength = initData.compiledPosts.filter(
  //   (compiledPost) => compiledPost.frontmatter.complete,
  // ).length;

  // const numOfSitemaps = Math.ceil(completePostLength / 5000);
  // const sitemap: string[] = [];
  // for (let i = 0; i < numOfSitemaps; i++) {
  //   sitemap.push(`${app_url}/server-sitemap-${i}.xml`);
  // }
  return getServerSideSitemapIndex([`${app_url}/server-sitemap.xml`]);
}
