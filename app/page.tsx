import { v4 as uuidv4 } from "uuid";
import { Metadata, ResolvingMetadata } from "next";
import { getAverageColor } from "fast-average-color-node";
import image2uri from "image2uri";
import tinycolor from "tinycolor2";
import { getInitDataFromS3 } from "@/lib/getInitData";
import PostCardViewer from "@/components/PostCardsViewer";

// export async function generateMetadata(
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   return {
//     title: (await parent).title,
//   };
// }

export default async function Home() {
  const { compiledPosts, categories } = await getInitDataFromS3();
  const postsToShow = compiledPosts;
  // .slice(0, 9); // TODO When Post is enough to show, remove this line
  const postsToShowIncludingTitleColor = (await Promise.all(
    postsToShow.map(
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
    frontmatter: {
      [key: string]: any;
    };
    mostReadableTextColor: string;
  }[];

  return (
    <main className="flex h-auto w-full flex-col items-center justify-between">
      <PostCardViewer cardsData={postsToShowIncludingTitleColor} />
    </main>
  );
}
