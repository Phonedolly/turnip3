import { v4 as uuidv4 } from "uuid";
import { getAverageColor } from "fast-average-color-node";
import image2uri from "image2uri";
import tinycolor from "tinycolor2";
import Image from "next/image";
import Header from "@/components/Header";
import { getInitDataFromS3 } from "@/lib/getInitData";
import Link from "next/link";
import PostCardViewer from "@/components/PostCardsViewer";
import Footer from "@/components/Footer";

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
        <PostCardViewer cardsData={postsToShowIncludingTitleColor} />
      </div>
    </main>
  );
}
