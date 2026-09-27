import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

/**
 * 文章里的时间一律按**中国时间（Asia/Shanghai, UTC+8）**理解。
 *
 * frontmatter 里写 `pubDatetime: 2026-09-28T00:00:00Z`（或只写日期）时，
 * YAML 会把它当成 UTC 零点；对中国作者来说那其实是北京时间 9 月 28 日早上 8 点，
 * 于是「9.28 发的文章」在本初子午线还没到 9.28 时就发不出来。
 * 这里统一往前挪 8 小时，让「写下的日期 = 北京时间的日期」，
 * 定时发布也就跟着按北京时间零点生效。
 */
const CHINA_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;
const asChinaTime = (value: Date) =>
  new Date(value.getTime() - CHINA_UTC_OFFSET_MS);

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date().transform(asChinaTime),
      modDatetime: z
        .date()
        .optional()
        .nullable()
        .transform(value => (value ? asChinaTime(value) : value)),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      category: z.enum(["research", "course", "daily", "others"]).default("others"),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      /** Per-post accent color (hex), e.g. "#e8734a". Optional. */
      theme: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
