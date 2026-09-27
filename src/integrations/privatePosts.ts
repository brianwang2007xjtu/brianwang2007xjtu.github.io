import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { encryptForClient } from "../utils/privateCrypto";
import { privateEnvSuffix, privatePasswordKeys } from "../utils/privatePost";

const SOURCE_ATTR = "data-private-source";
const SOURCE_RE = /<template[^>]*data-private-source[^>]*>([\s\S]*?)<\/template>/;

/**
 * Reads the password configuration from `.env*` files (plus the real
 * environment, which wins). Deliberately dependency-free: `vite` is not a
 * direct dependency of the project.
 */
async function readPasswords(root: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};

  for (const name of [
    ".env",
    ".env.local",
    ".env.production",
    ".env.production.local",
  ]) {
    try {
      const text = await readFile(join(root, name), "utf8");
      for (const line of text.split("\n")) {
        const match = line.match(
          /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/
        );
        if (!match) continue;
        let value = match[2];
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        out[match[1]] = value;
      }
    } catch {
      // no such env file — fine
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (key.toUpperCase().startsWith("PRIVATE_POST_PASSWORD_") && value) {
      out[key] = value;
    }
  }

  return out;
}

async function htmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(full);
      return entry.name.endsWith(".html") ? [full] : [];
    })
  );
  return files.flat();
}

/**
 * Replaces the plain-text body of every private post with its encrypted
 * payload once the site has been built.
 *
 * The page renders the real article inside `<template data-private-source>`
 * (inert in the browser), which gives us the final HTML — syntax highlighting,
 * heading ids, diagrams and all — to encrypt here. The template is swapped for
 * a JSON payload that only the correct password can open, so the plain text
 * never reaches `dist`, the search index or the deployed site.
 */
export default function privatePosts() {
  return {
    name: "private-posts",
    hooks: {
      "astro:build:done": async ({
        dir,
        logger,
      }: {
        dir: URL;
        logger: { info: (m: string) => void; warn: (m: string) => void };
      }) => {
        const root = fileURLToPath(dir);
        const env = await readPasswords(process.cwd());
        // One password per post — there is no shared/global password.
        const passwordFor = (slug: string) => {
          const wanted = `PRIVATE_POST_PASSWORD_${privateEnvSuffix(slug)}`;
          const hit = Object.keys(env).find(
            key => key.toUpperCase() === wanted.toUpperCase()
          );
          return hit ? (env[hit] ?? "").trim() : "";
        };

        const visible = privatePasswordKeys();
        logger.info(
          visible.length > 0
            ? `private-post password variables found: ${visible.join(", ")}`
            : "no PRIVATE_POST_PASSWORD_* variable is visible to this build"
        );

        let locked = 0;
        let missing = 0;

        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, "utf8");
          if (!html.includes(SOURCE_ATTR)) continue;

          const match = html.match(SOURCE_RE);
          if (!match) continue;

          // posts/<slug>/index.html -> slug (nested folders joined with "_")
          const parts = relative(root, file).split(sep);
          const slug = parts.slice(1, -1).join("_");
          const password = passwordFor(slug);

          if (!password) {
            missing += 1;
            logger.warn(
              `private post "${slug}" has no password: body removed ` +
                `(set PRIVATE_POST_PASSWORD_${privateEnvSuffix(slug)} in .env).`
            );
          }

          const payload = password ? encryptForClient(match[1], password) : "";
          await writeFile(
            file,
            html.replace(
              match[0],
              `<script type="application/json" data-private-payload>${payload}</script>`
            ),
            "utf8"
          );
          locked += 1;
        }

        if (locked > 0) {
          logger.info(
            `encrypted ${locked} private post page(s)` +
              (missing > 0 ? `, ${missing} without a password` : "")
          );
        }
      },
    },
  };
}
