import { MediaInfo } from "@/types/MediaListWithObjectUrl";
import getAllCompiledPostWithImageSizes from "./getAllCompiledPostWithImageSize";
import { S3Client } from "@aws-sdk/client-s3";
import listFiles from "./listFiles";

const getMediaList = async (s3: S3Client, epoch: number) => {
  const posts = await getAllCompiledPostWithImageSizes(s3);
  const identity = posts.find((post) => post.frontmatter.epoch === epoch);
  let dirName: string | number =
    identity?.frontmatter.complete === true
      ? (identity?.frontmatter.title as string)
      : (identity?.frontmatter.epoch as number);

  if (!identity) {
    dirName = epoch;
  }
  const files = (await listFiles(s3, `posts/${dirName}/`)).map((media) => ({
    ...media,
    objectUrl: encodeURI(
      `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${media.Key}`,
    ),
  })) as MediaInfo[];
  return files;
};

export default getMediaList;
