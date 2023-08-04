const Deploy = async () => {
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

  let deploymentInfo = {};
  let deployed = false;
  return (
    <div className="flex h-full w-11/12 flex-col items-center justify-center rounded-2xl bg-neutral-100/90 px-3">
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 p-4">
        <h1 className="w-full text-left font-outfit text-5xl font-bold">
          Deploy
        </h1>
        <h2 className="w-full text-left font-outfit text-3xl font-bold">
          check your <code>.env</code>
        </h2>
        <table className="w-full rounded-xl bg-neutral-200/50">
          <th>
            <tr className="border-b-4 border-b-neutral-800">
              <th className="p-4 text-left font-outfit text-xl font-bold">
                Name
              </th>
              <th className="p-4 text-left font-outfit text-xl font-bold">
                Value
              </th>
            </tr>
          </th>
          <td>
            {envNames.map((name) => (
              <tr
                key={name}
                className={`${
                  name === "REPO_URL" || name === "VERCEL_DEPLOY_HOOK"
                    ? `bg-yellow-400`
                    : ``
                }`}
              >
                <td className="p-4 text-left font-outfit text-xl font-bold">
                  {name}
                </td>
                <td className="p-4 text-left font-mono text-xl">
                  <input
                    type="text"
                    className="w-full break-all rounded-md bg-neutral-300/50 p-1"
                    defaultValue={env[name]}
                    disabled
                  />
                </td>
              </tr>
            ))}
          </td>
        </table>
        <button
          className="rounded-full bg-neutral-800 p-10 text-5xl font-extrabold text-white shadow-[0px_8px_32px_rgba(0,0,0,0.5)] transition duration-[400ms] ease-in-out hover:rotate-6 hover:scale-110 hover:shadow-[0px_12px_48px_rgba(0,0,0,0.5)]"
          disabled={deployed}
        >
          Deploy
        </button>
        <a>{process.env.VERCEL_DEPLOY_HOOK}</a>
      </div>
    </div>
  );
};

export default Deploy;
