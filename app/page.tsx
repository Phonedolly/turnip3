import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Header from "@/components/Header";
import { getDataFromS3 } from "@/lib/S3";

export default async function Home() {
  const { config, postKeys, posts, compiledPosts, categories } =
    await getDataFromS3();
  const postsToShow = compiledPosts.slice(0, 9);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between py-2">
      <div className="m-2 flex h-full w-full flex-col items-center gap-8 py-2">
        <Header categories={categories} />
        <div className="flex w-full flex-col items-center gap-8 px-2 md:grid md:grid-cols-2 md:justify-items-center md:max-w-3xl">
          {postsToShow.map((post) => {
            return (
              <div
                className="relative flex h-[64vw] w-11/12 max-w-sm cursor-pointer select-none flex-col items-center rounded-2xl bg-neutral-200/20 shadow-[0px_2px_10px_3px_rgba(0,0,0,0.1)] sm:h-60 sm:w-80"
                key={uuidv4()}
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
                    <h1 className="mr-2.5 mt-2.5 rounded-lg bg-white/30 px-2 py-1 text-base text-neutral-900 font-bold backdrop-blur-md sm:text-base">
                      {post.frontmatter.category}
                    </h1>
                  </div>
                  <div
                    className="flex w-full flex-row items-center"
                    key={uuidv4()}
                  >
                    <h1
                      className={`mx-2.5 mb-2.5 line-clamp-3 rounded-lg leading-8 bg-white/40 px-3 py-1 text-lg font-bold backdrop-blur-md sm:text-2xl font-outfit`}
                    >
                      {post.frontmatter.title}
                    </h1>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
