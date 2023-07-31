import Image from "next/image";

import Header from "@/components/Header";

import Link from "next/link";
import RedirectToHome from "./RedirectToHome";
import { getInitDataFromS3 } from "@/lib/getInitData";
import { getServerSession } from "next-auth";
import { initS3Client } from "@/lib/S3";
import getImagesSizes from "@/lib/getImageSizes";
import { getMDXComponent } from "mdx-bundler/client";
import componentsGenerator from "@/components/MDXUI";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Post from "@/components/Post";

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  console.log(session);
  // if (!session || !session.user) {
  //   return <SignIn />
  // } else {
  // const epoch: number | null = await initNewPost();
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
    <main className="flex h-full w-3/4 flex-col items-center justify-between p-4">
      <Post code={post.code} imageSizes={imageSizes} />
    </main>
  );
}
