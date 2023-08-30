import compileMDX from "@/lib/compileMDX";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const mdxSource = formData.get("mdxSource") as string;

  const result = await compileMDX(mdxSource)
    .then((result) =>
      NextResponse.json(
        { code: result.code, frontmatter: result.frontmatter },
        { status: 200 },
      ),
    )
    .catch((errReason) =>
      NextResponse.json(
        { code: "", frontmatter: { error: errReason } },
        { status: 400 },
      ),
    );

  return result;
}
