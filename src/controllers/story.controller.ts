import express, { Request } from "express";
import OpenAI from "openai";
import { removeCodeFences } from "../utils/outputFormatUtils";
import {
  StoryRequest,
  StoryInfo,
  ArtStyle,
  Character,
  Page,
} from "../types/data";
import { pageModel, storyModel } from "../models/story.model";
import { Pool } from "pg";

const generateText = async (
  client: OpenAI,
  {
    description,
    characters,
    pages,
    readingLevel,
    language,
  }: Omit<StoryRequest, "artStyle">
): Promise<StoryInfo> => {
  try {
    const story_prompt = `
    You are an AI assistant specialized in creating children's stories. Your task is to generate a story based on specific parameters while incorporating well-developed characters. Please carefully follow the instructions to create an engaging, age-appropriate narrative.

    First, review the input parameters:

    <reading_level>
    ${readingLevel}
    </reading_level>

    <story_description>
    ${description}
    </story_description>

    <characters_description>
    ${characters}
    </characters_description>

    <page_count>
    ${pages}
    </page_count>

    <language>
    ${language}
    </language>

    Now, follow these steps to create your story:

    1. Adapt your language and content to the specified reading level, using appropriate vocabulary, sentence structure, and concepts.

    2. Develop a plot that naturally aligns with the given story description.

    3. Create main characters based on the provided description. Add details to the characters' appearances if needed. Ensure this character's actions and growth throughout the story align with the moral lesson.

    4. Introduce additional characters as needed to support the story's development.

    5. Structure your story to fit the specified number of pages. Each page should contain a coherent part of the narrative, with a clear beginning, middle, and end spread across all pages.

    6. Each page should contain no more than 200 words to maintain readability and engagement for children.

    7. Include descriptive language and dialogue to make the story engaging for children.

    8. Ensure that the story concludes in a meaningful way.

    Once you're satisfied with your story planning, write your story in the required JSON format. Use the following structure:

    {
      "title": "Your Story Title",
      "characters": [
        {
          "name": "Character Name",
          "description": "Detailed character appearance"
        }
        // Add more characters as needed
      ],
      "pages": [
        {
          "page_number": 1,
          "page_content": "Write the content for page 1 here."
        },
        {
          "page_number": 2,
          "page_content": "Write the content for page 2 here."
        }
        // Continue this pattern for all pages
      ]
    }

    Ensure that your JSON output includes:
    1. A title for the story
    2. Detailed descriptions for all characters involved
    3. All pages up to the specified number of pages

    Double-check that your story meets all the requirements before submitting your final answer. The story should be engaging, age-appropriate, and effectively aligns with the story description.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 1,
      messages: [
        {
          role: "system",
          content: story_prompt,
        },
      ],
    });

    let content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content generated");
    }

    const storyInfo: StoryInfo = JSON.parse(removeCodeFences(content));

    return storyInfo;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to generate story { cause: ${error} }`);
  }
};

const generateImage = async (
  client: OpenAI,
  {
    charactersInfo,
    page,
    artStyle,
  }: { charactersInfo: Character[]; page: Page; artStyle: ArtStyle }
): Promise<string> => {
  try {
    const characters = charactersInfo
      .map((character, index) => `${index + 1}. ${character.description}`)
      .join("\n");

    const imagePrompt = `
      I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:
      Generate a highly detailed and visually engaging illustration of the following description.

      <description>
      ${page.page_content}
      </description>

      The image should reflect the characters’ actions and emotions as described in the description.
      The characters should match the following appearance:
      ${characters}

      Use a ${artStyle} style with vibrant colors and dynamic lighting to enhance the mood.
      `;

    const image_response = await client.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    if (!image_response.data[0]?.b64_json) {
      throw new Error("No image generated");
    }

    const b64_json: string = image_response.data[0].b64_json;

    return b64_json;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to generate image { cause: ${error} }`);
  }
};

export const storyController = (db: Pool) => {
  const Story = storyModel(db);
  const Page = pageModel(db);
  return {
    async create(req: express.Request, res: express.Response): Promise<void> {
      try {
        const client: OpenAI = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const {
          description,
          characters,
          pages,
          readingLevel,
          language,
          artStyle,
        }: StoryRequest = req.body;

        const storyText = await generateText(client, {
          description,
          characters,
          pages,
          readingLevel,
          language,
        });
        const charactersInfo = storyText.characters;

        const storyID = await Story.create({
          title: storyText.title,
          description,
          characters,
          pages,
          readingLevel,
          language,
          artStyle,
        });

        if (!storyID) {
          throw new Error("Failed to create story");
        }

        for (const page of storyText.pages) {
          const imageB64 = await generateImage(client, {
            charactersInfo,
            page,
            artStyle,
          });

          await Page.create({
            story_id: storyID,
            title: storyText.title,
            page_number: page.page_number,
            page_content: page.page_content,
            image_url: `data:image/png;base64,${imageB64}`,
          });
        }

        res.status(201).json({ id: storyID });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    },
    async get(req: express.Request, res: express.Response): Promise<void> {
      try {
        const story = await Story.findById(Number(req.params.id));
        if (!story) {
          throw new Error("Story not found");
        }
        const pages = await Page.findByStoryId(story.id!);
        res.status(200).json({ story, pages });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    },
    async list(req: express.Request, res: express.Response): Promise<void> {
      try {
        const stories = await Story.findAll();
        if (!stories) {
          throw new Error("Story not found");
        }
        res.status(200).json({ stories });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    },
  };
};
