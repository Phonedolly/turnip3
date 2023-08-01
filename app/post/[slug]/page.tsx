import { getInitDataFromS3 } from "@/lib/getInitData";
import { getServerSession } from "next-auth";
import { initS3Client } from "@/lib/S3";
import getImagesSizes from "@/lib/getImageSizes";
import { getMDXComponent } from "mdx-bundler/client";
import componentsGenerator from "@/components/PostComponents";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import PostWrapper from "@/components/PostWrapper";

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  const s3 = initS3Client();
  const { compiledPosts } = await getInitDataFromS3();
  const epoch = Number(params.slug);
  const post = compiledPosts.find((p) => p.epoch === epoch);
  if (!post) {
    return <>Not Found</>;
  }
  const imageSizes = (await getImagesSizes(s3, epoch)) as IImageSizes;
  const Component = getMDXComponent(post.code);
  return (
    <main className="flex h-full w-11/12 flex-col items-center justify-between p-2 m-2">
      <PostWrapper
        code={post.code}
        imageSizes={imageSizes}
        frontmatter={post.frontmatter}
      />
    </main>
  );
}

// if (!session || !session.user) {
//   return <SignIn />
// } else {
// const epoch: number | null = await initNewPost();
