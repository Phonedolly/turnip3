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
  if (Number(params.slug) <= 0 || Number.isNaN(Number(params.slug))) {
    return <RedirectToHome />;
  }
  const { config, categories } = await getInitDataFromS3();
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-between p-4">
      <Header categories={categories} />
      <h1 className="font-bold">가나다라마</h1>
    </main>
  );
}
