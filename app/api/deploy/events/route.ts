import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  const result = await fetch(
    `https://api.vercel.com/v2/deployments/${id}}/events`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: "get",
    },
  );
  const data = await result.json();
  return NextResponse.json(data);
}