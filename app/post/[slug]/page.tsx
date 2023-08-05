import { Metadata, ResolvingMetadata } from "next";
import getInitDataFromS3 from "@/lib/getInitData";
import PostWrapper from "@/components/PostWrapper";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { compiledPosts } = await getInitDataFromS3();
  const thisPost = compiledPosts.find((p) => p.epoch === Number(params.slug));
  return {
    title: thisPost?.frontmatter.title,
    description: thisPost?.frontmatter.description,
    openGraph: {
      title: thisPost?.frontmatter.title,
      description: thisPost?.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  const { compiledPosts } = await getInitDataFromS3();

  return compiledPosts.map((compiledPost) => ({
    slug: String(compiledPost.epoch),
  }));
}

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string };
}) {
  const { compiledPosts } = await getInitDataFromS3();
  const epoch = Number(params.slug);
  const post = compiledPosts.find((p) => p.epoch === epoch);

  if (!post) {
    return <>Not Found</>;
  }

  return (
    <main className="m-2 flex h-full w-11/12 flex-col items-center justify-between py-2 sm:px-2">
      <PostWrapper
        code={post.code}
        imageSizes={post.imageSizes}
        frontmatter={post.frontmatter}
      />
    </main>
  );
}

// if (!session || !session.user) {
//   return <SignIn />
// } else {
// const epoch: number | null = await initNewPost();
