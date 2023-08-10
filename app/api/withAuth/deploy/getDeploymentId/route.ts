import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const since = url.searchParams.get("since");
  const result = await fetch(
    `https://api.vercel.com/v6/deployments?app=${process.env.VERCEL_PROJECT_NAME}&since=${since}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: "get",
      next: { revalidate: 0 },
    },
  );

  const data = await result.json();

  if (data.deployments.length === 0) {
    return NextResponse.json({ deployStarted: false, id: null });
  } else {
    return NextResponse.json({
      deployStarted: true,
      id: data.deployments[0].uid,
      // created: Number(data.deployments[0].created),
    });
  }
}
