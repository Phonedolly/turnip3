import { NextResponse } from "next/server";

export async function GET() {
  return await fetch(
    `https://www.google.com/ping?sitemap=${
      process.env.NEXT_PUBLIC_APP_URL as string
    }/sitemap.xml`,
    { next: { revalidate: 0 } },
  ).then(async (response) => {
    if (response.ok) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  });
}
