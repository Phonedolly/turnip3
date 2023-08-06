import { NextResponse } from "next/server";

export async function GET() {
  const envNames = [
    "__NEXT_PRIVATE_PREBUNDLED_REACT",

    "APP_NAME",
    "APP_CATEGORIES",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "S3_REGION",
    "S3_BUCKET_NAME",

    "COGNITO_CLIENT_ID",
    "COGNITO_CLIENT_SECRET",
    "COGNITO_ISSUER",

    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",

    "REPO_URL",

    "VERCEL_DEPLOY_HOOK",

    "NEXT_PUBLIC_APP_NAME",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_GA_ID",
    "NEXT_PUBLIC_LANG",
    "NEXT_PUBLIC_APP_ICON",
  ];
  const env: {
    [key: string]: any;
  } = {
    __NEXT_PRIVATE_PREBUNDLED_REACT:
      process.env.__NEXT_PRIVATE_PREBUNDLED_REACT,

    APP_NAME: process.env.APP_NAME,
    APP_CATEGORIES: process.env.APP_CATEGORIES,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,

    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    REPO_URL: process.env.REPO_URL,

    VERCEL_DEPLOY_HOOK: process.env.VERCEL_DEPLOY_HOOK,

    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_LANG: process.env.NEXT_PUBLIC_LANG,
    NEXT_PUBLIC_APP_ICON: process.env.NEXT_PUBLIC_APP_ICON,
  };

  return NextResponse.json({ ...env });
}
