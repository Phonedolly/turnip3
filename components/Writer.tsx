"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MdxEditor from "./MDXEditor";
import SignOut from "./SignOut";
import ImageIcon from "./icons/ImageIcon";
import { _Object } from "@aws-sdk/client-s3";
import { MediaListWithObjectUrl } from "@/types/MediaListWithObjectUrl";
import TrashIcon from "./icons/TrashIcon";
import PublishIcon from "./icons/PublishIcon";
import { useRouter } from "next/navigation";
import { getMDXComponent } from "mdx-bundler/client";
import { IPost } from "@/types/IPost";

const EpochIsNull = () => (
  <div className="text-bold flex h-full w-full select-none flex-col items-center justify-center bg-red-500 font-outfit text-5xl font-bold">
    Failed to Initialize Storage for Post!
  </div>
);

export default function Writer(props: {
  epoch: number;
  imageSizes: IImageSizes;
  initialCompiledMdxInfo: {
    code: string;
    frontmatter: {
      [key: string]: any;
    };
    mdx: string;
  };
}) {
  const [isShowImagesPopup, setIsShowImagesPopup] = useState<boolean>(false);
  useState<boolean>(false);
  const [post, setPost] = useState<IPost>({
    code: props.initialCompiledMdxInfo.code,
    frontmatter: props.initialCompiledMdxInfo.frontmatter,
    mdx: props.initialCompiledMdxInfo.mdx,
    content: getMDXComponent(props.initialCompiledMdxInfo.code),
  });
  const [mediaList, setMediaList] = useState<MediaListWithObjectUrl[]>([]);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [imageSizes, setImageSizes] = useState<IImageSizes>(props.imageSizes);
  const [frontmatter, setFrontmatter] = useState<{
    [key: string]: any;
  }>(props.initialCompiledMdxInfo.frontmatter);

  const Component = useMemo(() => getMDXComponent(post.code), [post.code]);
  const router = useRouter();

  const getMediaList = async () => {
    setIsWorking(true);
    const mediaList = (
      await (
        await fetch(`/api/writer/getMediaList?epoch=${props.epoch}`)
      ).json()
    ).files;
    setMediaList(mediaList);
    const imageSizesFromServer = (await (
      await fetch(`/api/writer/getImageSizes?epoch=${props.epoch}`)
    ).json()) as IImageSizes;
    setImageSizes(imageSizesFromServer);
    setIsWorking(false);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;
    if (!file) {
      return;
    }
    setIsWorking(true);

    // const filename = encodeURIComponent(file.name);
    // const fileType = encodeURIComponent(file.type);
    const formData = new FormData();
    formData.append("epoch", String(props.epoch as Number));
    formData.append("file", file);
    formData.append("name", file.name);

    fetch("/api/writer/uploadImage", {
      method: "POST",
      body: formData,
    })
      .then(async () => {
        getMediaList();
        setIsWorking(false);
      })
      .catch((err) => console.log(err));

    const res = await fetch(`/api/writer/getImageSizes?epoch=${props.epoch}`);
    const sizes = await res.json();
    setImageSizes(sizes);
  };

  const publish = async () => {
    // TODO check some conditions
    if (
      frontmatter &&
      (!frontmatter.title ||
        !frontmatter.category ||
        !frontmatter.thumbnail ||
        !frontmatter.date ||
        !frontmatter.epoch)
    ) {
      alert("Please fill in all the fields of frontmatter!");
    }
    setIsWorking(true);

    const formData = new FormData();

    formData.append("epoch", String(props.epoch as Number));
    formData.append("mdx", post.mdx);

    fetch("/api/writer/publishPost", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        await res.json();
      })
      .catch((errReason) => {
        console.error("publish failed!");
        console.error(errReason);
      })
      .then((resAsJson) => {
        console.log("publish success!");
        console.log(resAsJson);
        setIsWorking(false);
        router.push(`/`);
      });
  };

  if (!props.epoch) {
    return <EpochIsNull />;
  }

  return (
    <div className="flex h-max w-full flex-col items-center">
      {/* <SignOut /> */}
      {/* Monaco Editor */}
      <div className="h-[50vh] w-full bg-red-500">
        <div
          className="px-.5 flex h-12 w-full flex-row items-center justify-between bg-neutral-300"
          key={uuidv4()}
        >
          <ImageIcon
            className="h-12 w-12 cursor-pointer p-2"
            onClick={() => {
              getMediaList();
              setIsShowImagesPopup(true);
            }}
          />
          <PublishIcon
            className="h-12 w-12 cursor-pointer p-2"
            onClick={publish}
          />
        </div>
        <MdxEditor
          setPost={setPost}
          imageSizes={imageSizes}
          setFrontmatter={setFrontmatter}
          epoch={props.epoch}
          initialCompiledMdxInfo={props.initialCompiledMdxInfo}
        />
      </div>
      {/* Content Preview */}
      <div
        className="h-[50vh] w-full overflow-y-scroll px-10 py-12"
        key={uuidv4()}
      >
        <Component />
      </div>
      {/* Image Management Popup */}
      {isShowImagesPopup === true ? (
        <div
          className="fixed flex h-full w-full flex-row items-center justify-center bg-neutral-200/20"
          onClick={() => setIsShowImagesPopup(false)}
        >
          <div
            className="relative flex h-[50vh] w-[70vw] flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-[0px_8px_24px_20px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {isWorking === true ? (
              <div className="absolute flex h-full w-full flex-row items-center justify-center">
                <div className="rounded-xl bg-neutral-900 px-5 py-5">
                  <h1 className="select-none font-mono text-2xl font-bold text-white">
                    Working...
                  </h1>
                </div>
              </div>
            ) : null}
            <h1 className="font-outfit text-4xl font-bold">
              Content Management
            </h1>
            <input
              disabled={isWorking}
              type="file"
              className="w-full"
              accept="image/*"
              onChange={uploadImage}
            />
            <div className="flex h-16 flex-row items-center gap-x-2 bg-neutral-300 px-4">
              <h1 className="font-outfit text-xl font-bold ">Workspace</h1>
              <h1 className="relative top-0.5 w-full font-mono text-sm font-bold">
                s3:{(mediaList && mediaList[0]?.Key) || ""}
              </h1>
            </div>
            <div className="flex h-full w-full flex-col overflow-y-scroll">
              {mediaList?.slice(1).map((media) => {
                return (
                  <div
                    className="flex min-h-[2rem] w-full flex-row items-center justify-between border-b-2 border-t-2 border-neutral-400 bg-neutral-200 px-3"
                    key={uuidv4()}
                  >
                    <div className="flex w-1/2 flex-row items-center px-4">
                      <h1 className="break-all font-mono text-sm font-bold">
                        {media.Key?.split("/")[2]}
                      </h1>
                    </div>
                    <div className="flex w-3/5 flex-col">
                      <h1 className="text-xs font-bold italic">
                        {media.LastModified &&
                          (media.LastModified as unknown as string)}
                      </h1>
                      <h1
                        className="font-mon cursor-pointer break-all text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `![](${media.objectUrl})`,
                          );
                          setIsShowImagesPopup(false);
                        }}
                      >
                        {media.objectUrl}
                      </h1>
                    </div>
                    <TrashIcon
                      className="h-9 w-9 cursor-pointer"
                      onClick={async () => {
                        setIsWorking(true);
                        const res = (await (
                          await fetch(
                            `/api/writer/deleteImage?key=${media.Key}`,
                          )
                        ).json()) as { success: boolean } | { errReason: any };
                        if (!res) {
                          console.error("Failed to Delete Image!");
                          console.error(res);
                        }
                        getMediaList();
                        setIsWorking(true);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
