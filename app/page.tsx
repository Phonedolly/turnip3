import { v4 as uuidv4 } from "uuid";
import { getAverageColor } from "fast-average-color-node";
import image2uri from "image2uri";
import tinycolor from "tinycolor2";
import Image from "next/image";
import Header from "@/components/Header";
import { getInitDataFromS3 } from "@/lib/getInitData";
import Link from "next/link";

export default async function Home() {
  const { config, compiledPosts, categories } = await getInitDataFromS3();
  const postsToShow = compiledPosts.slice(0, 9);
  const postsToShowIncludingTitleColor = (await Promise.all(
    postsToShow.map(
      (post) =>
        new Promise(async (resolve) => {
          /* prepare data uri of thumbnail */
          const dataUriOfThumbnail = await image2uri(
            post.frontmatter.thumbnail,
          );
          const avgColor = (await getAverageColor(dataUriOfThumbnail)).rgba;
          const mostReadableTextColor = tinycolor
            .mostReadable(avgColor, ["#FFFFFF", "#000000"], {
              includeFallbackColors: true,
              level: "AA",
              size: "large",
            })
            .toHexString();
          resolve({ ...post, mostReadableTextColor });
        }),
    ),
  )) as {
    postAsMdx: string;
    epoch: number;
    imageSizes: IImageSizes;
    code: string;
    frontmatter: {
      [key: string]: any;
    };
    mostReadableTextColor: string;
  }[];

  return (
    <main className="flex h-full w-full flex-col items-center justify-between py-2">
      <div className="m-2 flex h-full w-full flex-col items-center gap-9 py-2">
        <div className="flex w-full flex-col items-center gap-9 px-2 md:grid md:max-w-3xl md:grid-cols-2 md:justify-items-center">
          {postsToShowIncludingTitleColor.map((post) => {
            return (
              <Link
                href={`/post/${post.epoch}`}
                key={uuidv4()}
                className="relative flex h-[64vw] w-11/12 cursor-pointer select-none flex-col items-center rounded-2xl bg-neutral-200/20 shadow-[0px_2px_10px_3px_rgba(0,0,0,0.1)] sm:h-[56vw] sm:w-3/4"
              >
                <div
                  className="relative h-full w-full overflow-hidden rounded-2xl"
                  key={uuidv4()}
                >
                  <Image
                    src={post.frontmatter.thumbnail}
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
                    <h1
                      className="mr-2.5 mt-2.5 rounded-lg bg-white/30 px-2 py-1 text-base font-bold text-neutral-900 backdrop-blur-md sm:text-xl"
                      style={{ color: post.mostReadableTextColor }}
                    >
                      {post.frontmatter.category}
                    </h1>
                  </div>
                  <div
                    className="flex w-full flex-row items-center"
                    key={uuidv4()}
                  >
                    <h1
                      className={`mx-2.5 mb-2.5 line-clamp-3 rounded-lg bg-white/30 px-3 py-1 font-outfit text-lg font-bold leading-7 backdrop-blur-2xl sm:text-3xl`}
                      style={{ color: post.mostReadableTextColor }}
                    >
                      {post.frontmatter.title}
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
