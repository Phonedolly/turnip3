import Link from "next/link";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

const PostCardViewer = (props: {
  cardsData: {
    postAsMdx: string;
    epoch: number;
    imageSizes: IImageSizes;
    code: string;
    frontmatter: {
      [key: string]: any;
    };
    mostReadableTextColor: string;
  }[];
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-10 px-2 md:grid md:max-w-3xl md:grid-cols-2 md:justify-items-center">
      {props.cardsData.map((post) => {
        return (
          <Link
            href={`/post/${post.epoch}`}
            key={uuidv4()}
            className="relative flex h-[64vw] w-11/12 cursor-pointer select-none flex-col items-center rounded-2xl bg-neutral-200/20 shadow-[0px_8px_12px_4px_rgba(0,0,0,0.15)] sm:h-[56vw] sm:w-3/4"
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
                  className="mr-2.5 mt-2.5 rounded-lg bg-neutral-100/50 px-2 py-1 text-base font-bold text-neutral-900 backdrop-blur-md sm:text-xl"
                  style={{ color: post.mostReadableTextColor }}
                >
                  {post.frontmatter.category}
                </h1>
              </div>
              <div className="flex w-full flex-row items-center" key={uuidv4()}>
                <h1
                  className={`mx-2.5 mb-2.5 line-clamp-3 rounded-lg bg-neutral-100/50 px-3 py-1 font-outfit text-lg font-bold leading-7 backdrop-blur-2xl sm:text-3xl`}
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
