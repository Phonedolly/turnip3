import * as runtime from "react/jsx-runtime";
import { evaluate, evaluateSync } from "@mdx-js/mdx";
import componentsGenerator from "@/components/MDXUI";
import "highlight.js/styles/github.css";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

const manipulateMdx = (
  compiledMdx: Function,
  frontmatter: unknown,
  imageSizes: IImageSizes,
) => {
  console.log(111)
  console.log(frontmatter);
  const convertedFrontmatter = frontmatter as IPreStabilizedFrontmatter;
  const stabilizedFrontmatter: IStabilizedFrontmatter = {
    ...convertedFrontmatter,
    epoch: Number(convertedFrontmatter.epoch),
  };
  const content = compiledMdx({
    components: componentsGenerator(imageSizes),
  });
  return {
    content,
    frontmatter: stabilizedFrontmatter,
    imageSizes,
  };
};

// export const compileMdx = async (newMdx: string) => {
//   const { default: compiledMdx, frontmatter } = await evaluate(newMdx, {
//     ...(runtime as any),
//     development: false,
//     rehypePlugins: [rehypeMdxCodeProps, rehypeKatex],
//     remarkPlugins: [
//       remarkGfm,
//       remarkMath,
//       remarkFrontmatter,
//       remarkMdxFrontmatter,
//     ],
//   });

//   return manipulateMdx(compiledMdx, frontmatter as object);
// };

// export const compileMdxSync = (newMdx: string) => {
//   const { default: compiledMdx, frontmatter } = evaluateSync(newMdx, {
//     ...(runtime as any),
//     development: false,
//     rehypePlugins: [rehypeMdxCodeProps, rehypeKatex],
//     remarkPlugins: [
//       remarkGfm,
//       remarkMath,
//       remarkFrontmatter,
//       remarkMdxFrontmatter,
//     ],
//   });

//   return manipulateMdx(compiledMdx, frontmatter as object);
// };

export const compileMdxSyncCompiledOnly = (
  newMdx: string,
  imageSizes: IImageSizes,
) => {
  const { default: compiledMdx, frontmatter } = evaluateSync(newMdx, {
    ...(runtime as any),
    development: false,
    rehypePlugins: [rehypeMdxCodeProps, rehypeKatex],
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkFrontmatter,
      remarkMdxFrontmatter,
    ],
  });
  console.log(`ftonr`);
  console.log(compiledMdx.children);
  const re = manipulateMdx(compiledMdx, frontmatter as unknown, imageSizes);
  console.log(re.content);
  return re;
  // return {
  //   compiledMdx,
  //   frontmatter: {
  //     ...(frontmatter as Object),
  //     epoch: Number(frontmatter?.epoch),
  //   },
  // };
};
