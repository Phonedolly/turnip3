import Image from "next/image";

import Header from "@/components/Header";

import Link from "next/link";
import RedirectToHome from "./RedirectToHome";
import { getInitDataFromS3 } from "@/lib/getInitData";

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string };
}) {
  // if (Number(params.slug) <= 0 || Number.isNaN(Number(params.slug))) {
  //   return <RedirectToHome />;
  // }
  const { config, postKeys, posts, categories, compiledPosts } =
    await getInitDataFromS3();
  const post = compiledPosts.filter(
    (compiledPost) => compiledPost.epoch === Number(params.slug),
  )[0];
  const Content = () => post.contentWithImageSizes;
  return (
    <main className="flex h-full w-3/4 flex-col items-center justify-between p-4">
      <Content />
    </main>
  );
}
