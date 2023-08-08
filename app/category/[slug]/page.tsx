import getInitDataFromS3 from "@/lib/getInitData";
import { getAverageColor } from "fast-average-color-node";
import tinycolor from "tinycolor2";
import image2uri from "image2uri";
import PostCardViewer from "@/components/PostCardsViewer";

export async function generateStaticParams() {
  const { categories } = await getInitDataFromS3();

  return categories.map((category) => ({
    slug: category,
  }));
}

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string };
}) {
  const { posts, categories } = await getInitDataFromS3();
  const postsToShow = posts.filter(
    (post) => post.frontmatter.complete === true,
  );
  return (
    <main className="flex h-full w-full flex-col items-center justify-between gap-y-4 lg:gap-y-16">
      <h1 className="my-12 font-outfit text-5xl font-bold lg:text-6xl">
        {decodeURI(params.slug)}
      </h1>
      <PostCardViewer posts={postsToShow} />
    </main>
  );
}
