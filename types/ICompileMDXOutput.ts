import { Message } from "esbuild";
import grayMatter from "gray-matter";

export interface ICompileMDXOutput {
  code: string;
  frontmatter: IFrontmatter;
  errors: Message[];
  matter: Omit<grayMatter.GrayMatterFile<string>, "data"> & {
    data: IFrontmatter;
  };
}
