"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

const Deploy = () => {
  const router = useRouter();
  const [env, setEnv] = useState<any>({});
  useEffect(() => {
    fetch("/api/deploy")
      .then(async (res) => await res.json())
      .then((json) => {
        setEnv(json);
        console.log(json);
      });
  }, []);

  return (
    <div className="flex h-full w-11/12 flex-col items-center justify-center rounded-2xl bg-neutral-100/90 px-3">
      <div className="flex h-full w-full flex-col items-center justify-center gap-y-8 p-4">
        <div className="flex w-full flex-row justify-between">
          <h1 className="w-full text-left font-outfit text-5xl font-bold">
            Deploy
          </h1>
          <button
            onClick={() => signOut()}
            className="whitespace-nowrap rounded-xl bg-neutral-300 px-3 py-2 font-outfit text-2xl font-bold"
          >
            Sign Out
          </button>
        </div>
        <h2 className="w-full text-left font-outfit text-3xl font-bold">
          check your <code>.env</code>
        </h2>
        <table className="w-full rounded-xl bg-neutral-200/50">
          <thead>
            <tr className="border-b-4 border-b-neutral-800">
              <th className="p-4 text-left font-outfit text-xl font-bold">
                Name
              </th>
              <th className="p-4 text-left font-outfit text-xl font-bold">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(env).map((key) => (
              <tr
                key={key}
                className={`${
                  key === "REPO_URL" || key === "VERCEL_DEPLOY_HOOK"
                    ? `bg-yellow-400`
                    : ``
                }`}
              >
                <td className="p-4 text-left font-outfit text-xl font-bold">
                  {key}
                </td>
                <td className="p-4 text-left font-mono text-xl">
                  <input
                    type="text"
                    className="w-full break-all rounded-md bg-black p-1 text-black hover:bg-neutral-300/50"
                    value={env[key]}
                    disabled
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="rounded-full bg-neutral-800 p-10 text-5xl font-extrabold text-white shadow-[0px_8px_32px_rgba(0,0,0,0.5)] transition duration-[400ms] ease-in-out hover:rotate-6 hover:scale-110 hover:shadow-[0px_12px_48px_rgba(0,0,0,0.5)]"
          onClick={() => {
            if (!env["VERCEL_DEPLOY_HOOK"]) {
              alert("Vercel Git Hook is Unavailable!");
              return;
            }
            fetch(env["VERCEL_DEPLOY_HOOK"])
              .then(() => {
                alert("Deploy Request Submited!");
                router.replace("/");
              })
              .catch((errReason) => {
                console.error(errReason);
                alert("Failed to Submit Request.");
              });
          }}
        >
          Deploy
        </button>
      </div>
    </div>
  );
};

export default Deploy;
