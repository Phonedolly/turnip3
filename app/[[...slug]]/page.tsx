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

/* https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params */
export async function generateStaticParams() {
  const { posts } = await getInitDataFromS3();

  const slugs = posts.reduce((acc, _, i) => {
    if ((i + 1) % 10 === 0) {
      return acc.concat([String(Math.floor((i + 1) / 10))]);
    }
    return acc;
  }, [] as string[]);
  const result = slugs.map((slug) => ({ slug }));

  return result;
}
export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const { posts } = await getInitDataFromS3();
  return {
    openGraph: {
      title: `${process.env.NEXT_PUBLIC_APP_NAME} | Home`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}${
        params.slug && params.slug.length === 1 ? params.slug[0] : ``
      }`,
    },
  };
}
export default async function Home({ params }: { params?: { slug: string } }) {
  const slugToSend =
    params?.slug &&
    params.slug.length === 1 &&
    !isNaN(Number(params.slug.length[1]))
      ? ([Number(params.slug)] as [number])
      : undefined;
  const { posts, categories } = await getInitDataFromS3();
  const postsToShow = posts
    .filter((post) => post.frontmatter.complete === true)
    .slice(
      slugToSend ? slugToSend[0] * 10 : 0,
      slugToSend ? slugToSend[0] * 10 + 10 : 10,
    );
  let hasNext;
  if (!slugToSend) {
    if (posts.length > 10) {
      hasNext = true;
    } else {
      hasNext = false;
    }
  } else if (slugToSend && slugToSend[0] * 10 + 10 < posts.length) {
    hasNext = true;
  } else {
    hasNext = false;
  }

  return (
    <main className="flex h-auto w-full flex-col items-center justify-between">
      <PostCardViewer posts={postsToShow} slug={slugToSend} hasNext={hasNext} />
    </main>
  );
}
