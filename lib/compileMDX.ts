import { ICompileMDXOutput } from "@/types/ICompileMDXOutput";
import { bundleMDX } from "mdx-bundler";
import rehypeKatex from "rehype-katex";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import {
  threeExports,
  reactThreeFiberExports,
  reactThreeDreiExports,
} from "./reactThreeExports";

const compileMDX = async (source: string) => {
  const result = (await bundleMDX<IFrontmatter>({
    globals: {
      three: {
        varName: "THREE",
        namedExports: threeExports,
        defaultExport: false,
      },
      "@react-three/fiber": {
        varName: "reactThreeFiber",
        namedExports: reactThreeFiberExports,
        defaultExport: false,
      },
      "@react-three/drei": {
        varName: "reactThreeDrei",
        namedExports: reactThreeDreiExports,
        defaultExport: false,
      },
    },
    source: source,
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [
        remarkGfm,
        remarkMath,
        remarkFrontmatter,
        remarkMdxFrontmatter,
      ];
      options.rehypePlugins = [rehypeKatex, rehypeMdxCodeProps];
      return options;
    },
  })) as ICompileMDXOutput;

  return result;
};

export default compileMDX;
