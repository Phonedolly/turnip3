import Link from "next/link";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import image2uri from "image2uri";
import { getAverageColor } from "fast-average-color-node";
import tinycolor from "tinycolor2";
import { ICompileMDXOutput } from "@/types/ICompileMDXOutput";

const PostCardViewer = async (props: {
  posts: (ICompileMDXOutput & {
    mdx: string;
  } & {
    imageSizes: IImageSizes;
  })[];
}) => {
  const postsToShowIncludingTitleColor = (await Promise.all(
    props.posts.map(
      (post) =>
        new Promise(async (resolve) => {
          /* prepare data uri of thumbnail */
          if (!post.frontmatter.thumbnail) {
            resolve({ ...post, mostReadableTextColor: "#000000" });
            return;
          }
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
    frontmatter: IFrontmatter;
    mostReadableTextColor: string;
  }[];
  return (
    <div className="my-2 flex w-full flex-col items-center gap-12 px-2 sm:grid-cols-2 md:grid md:max-w-3xl md:justify-items-center md:gap-14 lg:max-w-4xl lg:gap-20 xl:max-w-5xl">
      {postsToShowIncludingTitleColor.map((post) => {
        return (
          <Link
            href={`/post/${post.frontmatter.epoch}`}
            key={uuidv4()}
            className="relative flex h-full w-full cursor-pointer select-none flex-col items-center rounded-2xl bg-neutral-200/20 pt-[75%] shadow-card transition duration-[400ms] hover:scale-[1.02] hover:shadow-card-hover"
          >
            <div
              className="absolute top-0 h-full w-full overflow-hidden rounded-2xl"
              key={uuidv4()}
            >
              <Image
                src={post.frontmatter.thumbnail}
                fill
                className="object-cover"
                alt="Thumbnail of Post"
              />
            </div>
            <div
              className="absolute top-0 flex h-full w-full flex-col justify-between"
              key={uuidv4()}
            >
              <div
                className="flex flex-row items-center justify-end"
                key={uuidv4()}
              >
                <h1
                  className="mr-2.5 mt-2.5 rounded-lg bg-neutral-100/20 px-2 py-1 font-outfit text-base font-bold text-neutral-900 backdrop-blur-md sm:text-xl md:text-xl lg:text-2xl"
                  style={{ color: post.mostReadableTextColor }}
                >
                  {post.frontmatter.category}
                </h1>
              </div>
              <div className="flex w-full flex-row items-center" key={uuidv4()}>
                <h1
                  className={`mx-2.5 mb-2.5 line-clamp-3 rounded-lg bg-neutral-100/20 px-3 py-1 font-outfit text-lg font-bold leading-7 backdrop-blur-2xl sm:text-3xl md:text-xl lg:px-2.5 lg:py-2.5 lg:text-2xl xl:px-3 xl:py-3 xl:text-3xl`}
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
  );
};

export default PostCardViewer;
