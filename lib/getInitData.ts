import { cache } from "react";
import initS3Client from "./S3";
import getAllCompiledPostWithImageSizes from "./getAllCompiledPostWithImageSize";

const getInitData = cache(async () => {
  const s3 = initS3Client();
  const categories = (process.env.APP_CATEGORIES as string).split(",");
  const posts = await getAllCompiledPostWithImageSizes(s3);

  return { posts, categories };
});

export default getInitData;
