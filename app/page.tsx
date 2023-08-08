import { v4 as uuidv4 } from "uuid";
import { Metadata, ResolvingMetadata } from "next";
import { getAverageColor } from "fast-average-color-node";
import image2uri from "image2uri";
import tinycolor from "tinycolor2";
import getInitDataFromS3 from "@/lib/getInitData";
import PostCardViewer from "@/components/PostCardsViewer";

// export async function generateMetadata(
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   return {
//     title: (await parent).title,
//   };
// }

export default async function Home() {
  const { posts, categories } = await getInitDataFromS3();
  const postsToShow = posts.filter(
    (post) => post.frontmatter.complete === true,
  );
  // .slice(0, 9); // TODO When Post is enough to show, remove this line

  return (
    <main className="flex h-auto w-full flex-col items-center justify-between">
      <PostCardViewer posts={postsToShow} />
    </main>
  );
}
