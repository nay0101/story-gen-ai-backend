export type Story = {
  id?: number;
  title: string;
  description: string;
  characters: string;
  readingLevel: string;
  language: string;
  pages: number;
  artStyle: string;
};

export type Page = {
  id?: number;
  story_id: number;
  title: string;
  page_number: number;
  page_content: string;
  image_url: string;
};
