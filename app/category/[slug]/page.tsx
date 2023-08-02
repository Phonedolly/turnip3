import { getInitDataFromS3 } from "@/lib/getInitData";
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
  const { compiledPosts, categories } = await getInitDataFromS3();
  const postsToShow = compiledPosts.filter(
    (post) => post.frontmatter.category === decodeURI(params.slug),
  );
  // .slice(0, 9); // TODO When Post is enough to show, remove this line
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
    <main className="flex h-full w-full flex-col items-center justify-between gap-y-4 lg:gap-y-16">
      <h1 className="mt-4 font-outfit text-5xl font-bold lg:text-7xl">
        {decodeURI(params.slug)}
      </h1>
      <PostCardViewer cardsData={postsToShowIncludingTitleColor} />
    </main>
  );
}
