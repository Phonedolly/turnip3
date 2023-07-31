"use client";

import React, { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MdxEditor from "./MDXEditor";
import ImageIcon from "./icons/ImageIcon";
import { _Object } from "@aws-sdk/client-s3";
import { MediaListWithObjectUrl } from "@/types/MediaListWithObjectUrl";
import TrashIcon from "./icons/TrashIcon";
import PublishIcon from "./icons/PublishIcon";
import { useRouter } from "next/navigation";
import { IPost } from "@/types/IPost";
import Preview from "./Preview";
import Image from "next/image";
import path from "path";

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
  });
  const [mediaList, setMediaList] = useState<MediaListWithObjectUrl[]>([]);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [imageSizes, setImageSizes] = useState<IImageSizes>(props.imageSizes);
  const [frontmatter, setFrontmatter] = useState<{
    [key: string]: any;
  }>(props.initialCompiledMdxInfo.frontmatter);
  const [previewScrollTop, setPreviewScrollTop] = useState<number>(0);
  const router = useRouter();

  const MemoizedPreview = useMemo(
    () => (
      <Preview
        code={post.code}
        imageSizes={imageSizes}
        previewScrollTop={previewScrollTop}
        setPreviewScrollTop={setPreviewScrollTop}
      />
    ),
    [imageSizes, post.code],
  );

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
      {/* Monaco Editor */}
      <div className="h-1/2 w-full bg-red-500">
        {/* Header */}
        <div
          className="flex h-16 w-full flex-row items-center justify-between bg-neutral-200 px-2"
          key={uuidv4()}
        >
          <div>
            <h1 className="px-2 font-outfit text-xl font-bold">Post Writer</h1>
          </div>
          <div className="flex flex-row">
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
        </div>
      </div>
      <MdxEditor
        setPost={setPost}
        imageSizes={imageSizes}
        setFrontmatter={setFrontmatter}
        epoch={props.epoch}
        initialCompiledMdxInfo={props.initialCompiledMdxInfo}
      />
      {/* Content Preview */}
      {MemoizedPreview}
      {/* Image Management Popup */}
      {isShowImagesPopup === true ? (
        <div
          className="fixed flex h-full w-full flex-row items-center justify-center bg-neutral-200/20"
          onClick={() => setIsShowImagesPopup(false)}
        >
          <div
            className="relative flex h-4/5 w-11/12 flex-col items-center justify-center gap-y-4 rounded-2xl bg-white p-6 shadow-[0px_8px_24px_20px_rgba(0,0,0,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-outfit text-4xl font-bold">
              Content Management
            </h1>
            <input
              disabled={isWorking}
              type="file"
              className="w-full py-4"
              accept="image/*"
              onChange={uploadImage}
            />
            <div className="flex h-16 flex-row items-center gap-x-2 rounded-xl bg-neutral-200 px-4">
              <h1 className="font-outfit text-xl font-bold ">Workspace</h1>
              <h1 className="relative top-0.5 w-full font-mono text-xs font-bold">
                s3:{(mediaList && mediaList[0]?.Key) || ""}
              </h1>
            </div>
            <div className="flex h-full w-full flex-col gap-y-2 overflow-y-scroll">
              {mediaList?.slice(1).map((media) => {
                const specificImageSize =
                  imageSizes[
                    decodeURIComponent(
                      path.parse(media.objectUrl as string).name,
                    ) +
                      decodeURIComponent(
                        path.parse(media.objectUrl as string).ext,
                      )
                  ];
                console.log(specificImageSize);
                return (
                  <div
                    className="m-1 flex flex-col rounded-2xl bg-neutral-200/50"
                    onClick={() => {
                      navigator.clipboard.writeText(`![](${media.objectUrl})`);
                      setIsShowImagesPopup(false);
                    }}
                    key={uuidv4()}
                  >
                    {/* Image Preview */}
                    {specificImageSize ? (
                      <Image
                        src={media.objectUrl}
                        height={specificImageSize.height}
                        width={specificImageSize.width}
                        alt=""
                        className="rounded-3xl p-3"
                      />
                    ) : null}

                    {/* Image Description */}
                    <div
                      className="flex w-full flex-row items-center justify-between gap-x-2  px-3"
                      key={uuidv4()}
                    >
                      <div className="flex w-1/2 flex-row items-center px-4 py-4">
                        <h1 className="break-all font-mono text-sm font-bold">
                          {media.Key?.split("/")[2]}
                        </h1>
                      </div>
                      <div className="flex w-3/5 flex-col py-4">
                        <h1 className="text-xs font-bold italic">
                          {media.LastModified &&
                            (media.LastModified as unknown as string)}
                        </h1>
                        <h1 className="font-mon cursor-pointer break-all text-xs">
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
                          ).json()) as
                            | { success: boolean }
                            | { errReason: any };
                          if (!res) {
                            console.error("Failed to Delete Image!");
                            console.error(res);
                          }
                          getMediaList();
                          setIsWorking(true);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      {isWorking === true ? (
        <div className="absolute flex h-full w-full flex-row items-center justify-center">
          <div className="rounded-xl bg-neutral-900 px-5 py-5">
            <h1 className="select-none font-mono text-2xl font-bold text-white">
              Working...
            </h1>
          </div>
        </div>
      ) : null}
    </div>
  );
}
