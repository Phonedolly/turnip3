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
    imageSizes: IImageSize;
  })[];
  slug?: [number] | [string, string, number?];
  hasNext: boolean;
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
    imageSizes: IImageSize;
    code: string;
    frontmatter: IFrontmatter;
    mostReadableTextColor: string;
  }[];

  let prevButton;
  let nextButton;
  const buttonStyle =
    "text-2xl sm:text-3xl px-3.5 py-2.5 font-outfit shadow-card rounded-xl";
  /* Home Page */
  if (!props.slug) {
    prevButton = null;
    nextButton = props.hasNext ? (
      <Link href={`/1`} className={buttonStyle}>
        next
      </Link>
    ) : null;
  } else if (props.slug && typeof props.slug[0] === "number") {
    /* Explore by Post */
    prevButton = (
      <Link href={`/${props.slug[0] - 1}`} className={buttonStyle}>
        prev
      </Link>
    );
    nextButton = props.hasNext ? (
      <Link href={`/${props.slug[0] + 1}`} className={buttonStyle}>
        next
      </Link>
    ) : null;
  } else if (
    props.slug &&
    typeof props.slug[0] === "string" &&
    props.slug.length >= 3
  ) {
    /* Explore by Category */
    prevButton = (
      <Link
        href={`/${props.slug[0]}/${props.slug[1]}/${
          props.slug[2] && props.slug[2] > 1 ? props.slug[2] - 1 : ``
        }`}
        className={buttonStyle}
      >
        prev
      </Link>
    );
    nextButton = props.hasNext ? (
      <Link
        href={`/${props.slug[0]}/${props.slug[1] ? props.slug[1] + 1 : `1`}`}
        className={buttonStyle}
      >
        next
      </Link>
    ) : null;
  }
  return (
    <div className="my-2 flex h-full w-full flex-col items-center gap-y-16">
      {postsToShowIncludingTitleColor.length > 0 ? (
        <div className="flex h-full w-full flex-col items-center gap-y-9 px-2 sm:grid-cols-2 md:grid md:max-w-3xl md:justify-items-center md:gap-14 lg:max-w-4xl lg:gap-20 xl:max-w-5xl">
          {postsToShowIncludingTitleColor.map((post) => {
            return (
              <Link
                href={`/post/${post.frontmatter.epoch}`}
                key={uuidv4()}
                className="group/Link relative flex h-full w-full cursor-pointer select-none flex-col items-center overflow-hidden rounded-3xl pt-[75%] shadow-card transition duration-[400ms] hover:scale-[1.02] hover:shadow-card-hover hover:saturate-150"
              >
                <div className="absolute top-0 h-full w-full" key={uuidv4()}>
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
                      className="mr-3 mt-3 rounded-2xl bg-neutral-100/20 px-3 py-2 font-outfit text-base font-bold text-neutral-900 backdrop-blur-md sm:text-xl md:text-xl lg:text-2xl"
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
                      className={`mx-3 mb-3 line-clamp-3 rounded-2xl bg-neutral-100/20 px-3 py-1 font-outfit text-lg font-bold leading-7 backdrop-blur-2xl transition-all duration-[400ms] group-hover/Link:bg-white/40 sm:text-3xl md:text-xl lg:px-2.5 lg:py-2.5 lg:text-2xl xl:px-3 xl:py-3 xl:text-3xl`}
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
      ) : (
        <div className="flex w-full flex-row justify-center">
          <h1 className="select-none rounded-3xl p-8 text-center font-outfit text-7xl leading-loose transition duration-300 hover:scale-110 hover:cursor-pointer hover:shadow-card-hover">
            ~~&gt;_&lt;~~
            <br />
            No Posts!
          </h1>
        </div>
      )}
      <div className="flex w-full flex-row justify-center">
        <div className="flex flex-row gap-x-3">
          {prevButton}
          {nextButton}
        </div>
      </div>
    </div>
  );
};

export default PostCardViewer;
