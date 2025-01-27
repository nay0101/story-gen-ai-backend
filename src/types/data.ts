export type ArtStyle = "realistic" | "semi-realistic" | "fantasy" | "cyberpunk";

export type ReadingLevel =
  | "Early Reader (Ages 5-6)"
  | "Beginning Reader (Ages 6-7)"
  | "Intermediate Reader (Ages 7-8)"
  | "Advanced Reader (Ages 8-10)";

export type StoryRequest = {
  description: string;
  characters: string;
  readingLevel: ReadingLevel;
  language: string;
  pages: number;
  artStyle: ArtStyle;
};

export type Character = {
  name: string;
  description: string;
};

export type Page = {
  page_number: number;
  page_content: string;
};

export type StoryInfo = {
  title: string;
  characters: Character[];
  pages: Page[];
};
