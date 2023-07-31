interface IPost {
  code: string;
  frontmatter: {
    [key: string]: any;
  };
  category?: string;
  epoch?: number;
  title?: string;
  mdxHasProblem?: boolean;
}
