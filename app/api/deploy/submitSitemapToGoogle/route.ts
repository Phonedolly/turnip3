import { NextResponse } from "next/server";

export async function GET() {
  const result = fetch(
    `https://www.google.com/ping?sitemap=${
      process.env.NEXT_PUBLIC_APP_URL as string
    }/sitemap.xml`,
    { next: { revalidate: 0 } },
  )
    .then(async (res) => {
      const data = await res.json();
      return NextResponse.json({ ...data }, { status: 200 });
    })
    .catch(() => NextResponse.json({}, { status: 500 }));

  return result;
}
