"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

const Deploy = () => {
  const router = useRouter();
  const [env, setEnv] = useState<any>({});
  const [isCompleteDeploying, setIsCompleteDeploying] =
    useState<boolean>(false);
  const [buildEvents, setBuildEvents] = useState<
    {
      [key: string]: any;
    }[]
  >([]);
  useEffect(() => {
    fetch("/api/deploy")
      .then(async (res) => await res.json())
      .then((json) => {
        setEnv(json);
        console.log(json);
      });
  }, []);

  useEffect(() => {
    if (!isCompleteDeploying) return;
  }, [isCompleteDeploying, buildEvents]);

  const handleDeploy = async () => {
    if (!env["VERCEL_DEPLOY_HOOK"]) {
      alert("Vercel Git Hook is Unavailable!");
      return;
    }
    /* Trigger build using hook */
    const now = Date.now(); // save current time
    await fetch(env["VERCEL_DEPLOY_HOOK"], { method: "POST" })
      .then(() => {
        alert("Deploy Request Submited!");
        // setIsCompleteDeploying(true);
      })
      .catch((errReason) => {
        console.error(errReason);
        alert("Failed to Submit Request.");
        router.replace("/");
      });
    console.log("trigger build hook");

    /* get deployment id */
    let deploymentId;
    /* until get current deployment */
    const getDeploymentId = async () =>
      new Promise<void>(async (resolve) => {
        const { id, created } = await fetch(`/api/deploy/getDeploymentId`).then(
          async (res) => await res.json(),
        );
        console.log(id);
        console.log(`created, now=====`);
        console.log(`${created}, ${now}`);
        if (created > now) {
          console.log("created > now");

          deploymentId = id;
          resolve();
        } else {
          console.log("created <= now");
          setTimeout(async () => {
            resolve(await getDeploymentId());
          }, 1000);
        }
      });

    await getDeploymentId();

    /* request deployment events until finish deployment */
    const getEventList = async () =>
      new Promise<void>(async (resolve) => {
        const eventList = await fetch(
          `/api/deploy/events?id=${deploymentId}`,
        ).then(async (res) => await res.json());

        console.log(eventList);
        setBuildEvents(eventList);
        if (
          eventList[eventList.length - 1].payload.text.startsWith(
            "Build cache uploaded:",
          )
        ) {
          setIsCompleteDeploying(true);
          await fetch(`/api/deploy/submitSitemapToGoogle`, {
            cache: "no-store",
          })
            .then(() => {
              setBuildEvents((prev) =>
                prev.concat({
                  type: "stdout",
                  payload: {
                    date: Date.now(),
                    text: "Upload Sitemap to Google.",
                  },
                }),
              );
              resolve();
            })
            .catch(() => {
              setBuildEvents((prev) =>
                prev.concat({
                  type: "stderr",
                  payload: {
                    date: Date.now(),
                    text: "Failed to Upload Sitemap to Google. Check Sitemap is submitted on Google Search Console.",
                  },
                }),
              );
              resolve();
            });
        } else {
          setTimeout(async () => resolve(await getEventList()), 1000);
        }
      });
    await getEventList();
  };

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
          onClick={handleDeploy}
        >
          Deploy
        </button>
      </div>
      <div className="flex h-auto w-full flex-col py-4">
        {buildEvents &&
          buildEvents.map((buildEvent) => {
            return (
              <div
                className={`flex w-full flex-row gap-x-4 p-1.5 font-mono text-sm first:rounded-t-md last:rounded-b-md ${
                  buildEvent.type === "stderr" ? `bg-red-400` : `bg-white`
                }`}
                key={uuidv4()}
              >
                <h1 className="text-black">
                  {new Date(buildEvent.payload.date as number).toISOString()}
                </h1>
                <h1 className="text-neutral-700">{buildEvent.payload.text}</h1>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Deploy;
