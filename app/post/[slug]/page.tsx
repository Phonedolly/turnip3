import { getInitDataFromS3 } from "@/lib/getInitData";
import { initS3Client } from "@/lib/S3";
import getImagesSizes from "@/lib/getImageSizes";
import PostWrapper from "@/components/PostWrapper";

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string };
}) {
  const s3 = initS3Client();
  const { compiledPosts } = await getInitDataFromS3();
  const epoch = Number(params.slug);
  const post = compiledPosts.find((p) => p.epoch === epoch);
  if (!post) {
    return <>Not Found</>;
  }
  const imageSizes = (await getImagesSizes(s3, epoch)) as IImageSizes;
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
