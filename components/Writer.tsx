"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MdxEditor from "./MDXEditor";
import ImageIcon from "./icons/ImageIcon";
import { _Object } from "@aws-sdk/client-s3";
import { MediaListWithObjectUrl } from "@/types/MediaListWithObjectUrl";
import TrashIcon from "./icons/TrashIcon";
import PublishIcon from "./icons/PublishIcon";
import { useRouter } from "next/navigation";
import { IPost } from "@/types/IPost";
import Preview from "./MDXEditor/Preview";
import Image from "next/image";
import path from "path";
import { getTime, parseISO } from "date-fns";
import AppIcon from "./icons/AppIcon";

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
  const [previewScrollTop, setPreviewScrollTop] = useState<number>(0);
  const [sortRule, setSortRule] = useState<
    "date-asc" | "date-desc" | "name-asc" | "name-desc"
  >("date-asc");
  const router = useRouter();

  const MemoizedPreview = useMemo(
    () => (
      <Preview
        code={post.code}
        imageSizes={imageSizes}
        frontmatter={post.frontmatter}
        previewScrollTop={previewScrollTop}
        setPreviewScrollTop={setPreviewScrollTop}
      />
    ),
    [imageSizes, post.code, post.frontmatter],
  );

  useEffect(() => {
    switch (sortRule) {
      case "date-asc":
        setMediaList((prev) =>
          prev.sort((a: MediaListWithObjectUrl, b: MediaListWithObjectUrl) => {
            const aTime = getTime(
              parseISO((a.LastModified as Date).toString()),
            );
            const bTime = getTime(
              parseISO((b.LastModified as Date).toString()),
            );
            return aTime - bTime;
          }),
        );
        break;
      case "date-desc":
        setMediaList((prev) =>
          prev.sort((a: MediaListWithObjectUrl, b: MediaListWithObjectUrl) => {
            const aTime = getTime(
              parseISO((a.LastModified as Date).toString()),
            );
            const bTime = getTime(
              parseISO((b.LastModified as Date).toString()),
            );
            return bTime - aTime;
          }),
        );
        break;
      case "name-asc":
        setMediaList((prev) =>
          prev.sort((a: MediaListWithObjectUrl, b: MediaListWithObjectUrl) => {
            const aName = a.Key as string;
            const bName = b.Key as string;
            return aName.localeCompare(bName);
          }),
        );
        break;
      case "name-desc":
        setMediaList((prev) =>
          prev.sort((a: MediaListWithObjectUrl, b: MediaListWithObjectUrl) => {
            const aName = a.Key as string;
            const bName = b.Key as string;
            return bName.localeCompare(aName);
          }),
        );
        break;

      default:
        break;
    }
  }, [sortRule, mediaList]);

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
    const files = e.target.files;
    if (!files) {
      return;
    }
    setIsWorking(true);

    // const filename = encodeURIComponent(file.name);
    // const fileType = encodeURIComponent(file.type);
    const formData = new FormData();
    formData.append("epoch", String(props.epoch as Number));
    formData.append("numOfFiles", String(files.length));

    for (let i = 0; i < files.length; i++) {
      formData.append(`file_${i}`, files[i]);
    }
    // formData.append("file", file);

    fetch("/api/writer/uploadImage", {
      method: "POST",
      body: formData,
    })
      .then(async () => {
        getMediaList();
        setIsWorking(false);
      })
      .catch((err) => console.error(err));

    const res = await fetch(`/api/writer/getImageSizes?epoch=${props.epoch}`);
    const sizes = await res.json();
    setImageSizes(sizes);
  };

  const publish = async () => {
    // TODO check some conditions
    if (
      post.frontmatter &&
      (!post.frontmatter.title ||
        !post.frontmatter.category ||
        !post.frontmatter.thumbnail ||
        !post.frontmatter.date ||
        !post.frontmatter.epoch)
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
        router.push(`/`);
      });
  };

  if (!props.epoch) {
    return <EpochIsNull />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center lg:w-[95vw]">
      {/* Header */}
      <div
        className="z-10 my-4 mx-0.5 flex h-14 w-full flex-row items-center justify-between rounded-xl bg-white px-2 shadow-[0px_2px_8px_4px_rgba(0,0,0,0.1)] lg:h-16"
        key={uuidv4()}
      >
        <div className="flex flex-row items-center">
          <AppIcon className="h-9 w-9" />
          <h1 className="select-none px-2 font-outfit text-xl font-bold">
            Post Writer
          </h1>
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
      <div className="grid h-[calc(100vh-5rem)] w-full grid-rows-2 lg:flex-none lg:grid-cols-2 lg:grid-rows-1">
        {/* Monaco Editor */}
        <div className=" w-full border-b-2 border-b-neutral-300 px-6 lg:border-b-0 lg:border-r-2 lg:border-r-neutral-300">
          <MdxEditor
            setPost={setPost}
            imageSizes={imageSizes}
            epoch={props.epoch}
            initialCompiledMdxInfo={props.initialCompiledMdxInfo}
          />
        </div>
        {/* Content Preview */}
        <div className="h-full w-full overflow-y-scroll border-t-2 border-t-neutral-300 px-6 lg:border-l-2 lg:border-t-0 lg:border-l-neutral-300">
          {MemoizedPreview}
        </div>
        {/* Image Management Popup */}
        {isShowImagesPopup === true ? (
          <div
            className="fixed left-0 right-0 top-0 z-20 flex h-screen flex-row items-center justify-center bg-black/20"
            onClick={() => setIsShowImagesPopup(false)}
          >
            <div
              className="relative flex h-5/6 w-11/12 flex-col items-center justify-center gap-y-2 rounded-2xl bg-white p-6 shadow-[0px_20px_24px_20px_rgba(0,0,0,0.15)] md:mx-10 md:max-w-full md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="w-full text-left font-outfit text-2xl font-bold sm:text-4xl md:text-5xl">
                Content
                <br />
                Management
              </h1>
              <div className="flex w-full flex-row items-center justify-between">
                <input
                  disabled={isWorking}
                  type="file"
                  className="w-full py-4"
                  accept="image/*"
                  multiple
                  onChange={uploadImage}
                />
                <div className="flex h-auto cursor-pointer select-none flex-col items-center justify-center gap-y-1 rounded-md bg-neutral-200 px-2 font-outfit font-bold">
                  <h1
                    className={`rounded-t-md p-1 ${
                      sortRule === "date-asc" || sortRule === "date-desc"
                        ? `text-xl font-bold italic`
                        : `text-neutral-500`
                    }`}
                    onClick={() => {
                      switch (sortRule) {
                        case "date-asc":
                          setSortRule("date-desc");
                          break;
                        case "date-desc":
                          setSortRule("date-asc");
                          break;
                        case "name-asc":
                        case "name-desc":
                          setSortRule("date-asc");
                        default:
                          break;
                      }
                    }}
                  >
                    Date
                    {sortRule === "date-asc" || sortRule === "date-desc"
                      ? sortRule.split("-")[1].toUpperCase()
                      : ""}
                  </h1>
                  <h1
                    className={`whitespace-nowrap ${
                      sortRule === "name-asc" || sortRule === "name-desc"
                        ? `text-xl font-bold italic`
                        : `text-neutral-500`
                    }`}
                    onClick={() => {
                      switch (sortRule) {
                        case "date-asc":
                        case "date-desc":
                          setSortRule("name-asc");
                          break;
                        case "name-asc":
                          setSortRule("name-desc");
                          break;
                        case "name-desc":
                          setSortRule("name-asc");
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    Name{" "}
                    {sortRule === "name-asc" || sortRule === "name-desc"
                      ? sortRule.split("-")[1].toUpperCase()
                      : ""}
                  </h1>
                </div>
              </div>
              <div className="flex h-full w-full flex-col gap-y-2 overflow-y-scroll rounded-xl md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
                  return (
                    <div
                      className="flex aspect-square flex-col rounded-2xl bg-neutral-200/50"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `![](${media.objectUrl})`,
                        );
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
                          className="aspect-[4/3] rounded-3xl object-cover p-3"
                        />
                      ) : null}

                      {/* Image Description */}
                      <div
                        className="flex w-full flex-row items-center justify-between gap-x-2 px-3 md:flex-col md:justify-between"
                        key={uuidv4()}
                      >
                        <div className="flex w-1/2 flex-row items-center p-2 md:w-full">
                          <h1 className="break-all font-mono text-sm font-bold sm:text-base md:text-lg">
                            {media.Key?.split("/")[2]}
                          </h1>
                        </div>
                        <div className="flex w-1/2 flex-row items-center justify-end p-2 md:w-full">
                          <div className="flex w-3/5 flex-col py-4 md:w-full">
                            <h1 className="p-2 text-xs font-bold italic sm:text-sm md:text-base">
                              {media.LastModified &&
                                (media.LastModified as unknown as string)}
                            </h1>
                            <h1 className="cursor-pointer break-all rounded-xl bg-neutral-200 px-2.5 py-2 font-mono text-xs sm:text-sm md:text-base">
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
    </div>
  );
}
