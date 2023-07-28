import Image from "next/image";
import { outfit } from "../../layout";
import Header from "@/components/Header";
import { getDataFromS3 } from "@/lib/S3";
import Link from "next/link";
import RedirectToHome from "./RedirectToHome";

export default async function HomeWithMorePage({
  params,
}: {
  params: { slug: string };
}) {
  console.log(params);
  if (Number(params.slug) <= 0 || Number.isNaN(Number(params.slug))) {
    return <RedirectToHome />;
  }
  const { config, postKeys, categories } = await getDataFromS3();
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-between p-4">
      <Header categories={categories} />
      <h1 className="font-bold">가나다라마</h1>
    </main>
  );
}
