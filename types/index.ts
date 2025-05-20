export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  image: string;
  author: Author;
  publishedAt: string;
  featured: boolean;
  tags: string[];
}

export type Category = 
  | "technologie" 
  | "mode-et-beaute" 
  | "voyage" 
  | "loisirs" 
  | "sante-et-bien-etre";

export interface CategoryInfo {
  slug: Category;
  name: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}