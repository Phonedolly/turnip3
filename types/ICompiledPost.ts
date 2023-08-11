interface ICompiledPost {
  postAsMdx: string;
  epoch: number;
  imageSizes: IImageSize;
  code: string;
  frontmatter: IFrontmatter;
}
