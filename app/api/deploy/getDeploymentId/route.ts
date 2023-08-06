import { NextResponse } from "next/server";

export async function GET() {
  const result = await fetch(
    `https://api.vercel.com/v6/deployments?app=${process.env.VERCEL_PROJECT_NAME}&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: "get",
    },
  );

  const data = await result.json();
  return NextResponse.json({
    id: data.deployments[0].uid,
    created: Number(data.deployments[0].created),
  });
}
