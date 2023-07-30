import { v4 as uuidv4 } from "uuid";
import { getAverageColor } from 'fast-average-color-node';
import image2uri from "image2uri";
import tinycolor from "tinycolor2";
import Image from "next/image";
import Header from "@/components/Header";
import { getInitDataFromS3 } from "@/lib/getInitData";
import Link from "next/link";

export default async function Home() {
  const { config, postKeys, posts, compiledPosts, categories } =
    await getInitDataFromS3();
  const postsToShow = compiledPosts.slice(0, 9);
  const postsToShowIncludingTitleColor = (
    await Promise.all(
      postsToShow
        .map(post => new Promise(
          async resolve => {
            /* prepare data uri of thumbnail */

            const dataUriOfThumbnail = await image2uri(post.compiledPost.frontmatter.thumbnail)
            const avgColor = (await getAverageColor(dataUriOfThumbnail)).rgba;
            const mostReadableTextColor = tinycolor.mostReadable(avgColor, ["#FFFFFF", "#000000"], { includeFallbackColors: true, level: "AA", size: "large" }).toHexString();
            resolve({ ...post, mostReadableTextColor })
          })
        ))
  ) as {
    originalPost: string,
    epoch: number;
    compiledPost: {
      content: JSX.Element;
      frontmatter: {
        title?: string | undefined;
        category?: string | undefined;
        thumbnail: string;
        epoch: number;
        date?: string | undefined;
        description?: string | undefined;
      }
    }, mostReadableTextColor: string
  }[];

  return (
    <main className="flex h-full w-full flex-col items-center justify-between py-2">
      <div className="m-2 flex h-full w-full flex-col items-center gap-9 py-2">
        <div className="flex w-full flex-col items-center gap-9 px-2 md:grid md:grid-cols-2 md:justify-items-center md:max-w-3xl">
          {postsToShowIncludingTitleColor.map((post) => {
            console.log(post.mostReadableTextColor)
            return (
              <Link href={`/post/${post.epoch}`} key={uuidv4()} className="relative flex h-[64vw] sm:h-[56vw] sm:w-3/4 w-11/12 cursor-pointer select-none flex-col items-center rounded-2xl bg-neutral-200/20 shadow-[0px_2px_10px_3px_rgba(0,0,0,0.1)]">


                <div
                  className="relative h-full w-full overflow-hidden rounded-2xl"
                  key={uuidv4()}
                >
                  <Image
                    src={post.compiledPost.frontmatter.thumbnail}
                    fill
                    style={{ objectFit: "cover" }}
                    alt="Thumbnail of Post"
                  />
                </div>
                <div
                  className="absolute flex h-full w-full flex-col justify-between"
                  key={uuidv4()}
                >
                  <div
                    className="flex flex-row items-center justify-end"
                    key={uuidv4()}
                  >
                    <h1 className="mr-2.5 mt-2.5 rounded-lg bg-white/30 px-2 py-1 text-base text-neutral-900 font-bold backdrop-blur-md sm:text-xl">
                      {post.compiledPost.frontmatter.category}
                    </h1>
                  </div>
                  <div
                    className="flex w-full flex-row items-center"
                    key={uuidv4()}
                  >
                    <h1
                      className={`mx-2.5 mb-2.5 line-clamp-3 rounded-lg leading-7 bg-white/30 px-3 py-1 text-lg font-bold backdrop-blur-2xl sm:text-3xl font-outfit`}
                      style={{ color: post.mostReadableTextColor }}
                    >
                      {post.compiledPost.frontmatter.title}
                    </h1>
                  </div>
                </div>


              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
