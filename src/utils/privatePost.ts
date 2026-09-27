import type { CollectionEntry } from "astro:content";

/**
 * Posts tagged `private` never ship as plain text: their rendered body is
 * encrypted at build time (see `src/integrations/privatePosts.ts`) with a
 * password taken from the environment, and the published page only contains the
 * ciphertext plus a lock screen. Nothing can be read without the password —
 * not even from "view source".
 *
 * Configure one password per post in `.env` (git-ignored), named after the
 * file:
 *   PRIVATE_POST_PASSWORD_MY_SECRET_NOTE=135790
 * There is deliberately no shared/global password.
 */

export const PRIVATE_TAG = "private";

type Env = Record<string, string | undefined>;

function readEnv(key: string): string | undefined {
  const viteEnv = (import.meta as unknown as { env?: Env }).env ?? {};
  return viteEnv[key] ?? (globalThis.process?.env as Env | undefined)?.[key];
}

/** `posts/nested/My Post.mdx` -> `MY_POST` (used to build per-post env keys). */
export function privateEnvSuffix(idOrSlug: string): string {
  return idOrSlug
    .replace(/\.(md|mdx)$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

export function isPrivatePost(post: CollectionEntry<"posts">): boolean {
  return (post.data.tags ?? []).some(tag => tag.toLowerCase() === PRIVATE_TAG);
}

/**
 * Password of one post: `PRIVATE_POST_PASSWORD_<SLUG>` where `<SLUG>` is the
 * file name upper-cased with non-alphanumerics replaced by `_`
 * (`course-electric-weeek2.mdx` -> `COURSE_ELECTRIC_WEEEK2`).
 * Returns null when that post has no password configured.
 */
export function getPrivatePassword(
  post: CollectionEntry<"posts">
): string | null {
  const key = `PRIVATE_POST_PASSWORD_${privateEnvSuffix(post.id)}`;
  const password = (readEnv(key) ?? "").trim();
  return password.length > 0 ? password : null;
}
