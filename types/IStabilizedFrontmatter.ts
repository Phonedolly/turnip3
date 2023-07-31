interface IStabilizedFrontmatter {
  title: string;
  category: string;
  thumbnail: string;
  date: string;
  epoch: number;
  description?: string;
}

interface IPreStabilizedFrontmatter {
  title: string;
  category: string;
  thumbnail: string;
  date: string;
  epoch: string; // 
  description?: string;
}
