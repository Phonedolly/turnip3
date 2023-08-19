import getInitDataFromS3 from "@/lib/getInitData";
import PostCardViewer from "@/components/PostCardsViewer";
import { Metadata } from "next";

export async function generateStaticParams() {
  const { posts, categories } = await getInitDataFromS3();

  const result = categories.reduce(
    (totalSlugsAcc, curCategory) => {
      const postsByCategory = posts.filter(
        (post) => post.frontmatter.category === curCategory,
      );
      const slugs = postsByCategory.reduce((slugsAcc, _, i) => {
        if (i === 0) {
          return slugsAcc.concat([[curCategory]]);
        } else if ((i + 1) % 10 === 0) {
          return slugsAcc.concat([
            curCategory,
            String(Math.floor((i + 1) / 10)),
          ]);
        }
        return slugsAcc;
      }, [] as string[][]);

      return totalSlugsAcc.concat(slugs.map((slug) => ({ slug })));
    },
    [] as { slug: string[] }[],
  );

  return result;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const { posts } = await getInitDataFromS3();
  const thisCategory = decodeURI(params.slug[0]);
  return {
    title: `${process.env.NEXT_PUBLIC_APP_NAME} | ${thisCategory}`,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} | ${thisCategory}`,
    openGraph: {
      title: `${process.env.NEXT_PUBLIC_APP_NAME} | ${thisCategory}`,
      description: `${process.env.NEXT_PUBLIC_APP_NAME} | ${thisCategory}`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/category/${thisCategory}${
        params.slug.length === 2 ? params.slug[1] : ``
      }`,
    },
  };
}

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { posts, categories } = await getInitDataFromS3();
  const decodedSlug = params.slug.map((s) => decodeURI(s));
  let slugToSend: [string, string] | [string, string, number] = [
    "category",
    "",
  ];

  if (decodedSlug && decodedSlug.length === 1) {
    slugToSend = ["category", decodedSlug[0]];
  } else if (
    decodedSlug &&
    decodedSlug.length === 2 &&
    !isNaN(Number(decodedSlug[1])) &&
    Number(decodedSlug[1]) * 10 <= posts.length
  ) {
    slugToSend = ["category", decodedSlug[0], Number(decodedSlug[1])];
  }
  let hasNext;
  const postsToShow = posts
    .filter(
      (post) =>
        post.frontmatter.complete === true &&
        post.frontmatter.category === decodeURI(params.slug[0]),
    )
    .slice(
      slugToSend.length === 3 ? slugToSend[2] * 10 : 0,
      slugToSend.length === 3 ? slugToSend[2] * 10 + 10 : 10,
    );
  if (!slugToSend) {
    if (posts.length > 10) {
      hasNext = true;
    } else {
      hasNext = false;
    }
  } else if (
    slugToSend.length === 3 &&
    slugToSend[2] * 10 + 10 < posts.length
  ) {
    hasNext = true;
  } else {
    hasNext = false;
  }

  return (
    <main className="flex h-full w-full flex-col items-center justify-between gap-y-4 lg:gap-y-16">
      <h1 className="my-12 font-outfit text-5xl font-bold lg:text-6xl">
        {decodedSlug}
      </h1>
      <PostCardViewer posts={postsToShow} slug={slugToSend} hasNext={hasNext} />
    </main>
  );
}
