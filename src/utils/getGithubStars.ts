/**
 * 在构建时从 GitHub API 拉取仓库的 star 数（真实、随每次构建自动更新）。
 * 拉取失败时返回 0，页面会优雅回退。
 */
export const GITHUB_REPO = "brianwang2007xjtu/brianwang2007xjtu.github.io";

export async function getGithubStars(): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { "User-Agent": "astro-blog", Accept: "application/vnd.github+json" },
    });
    if (res.ok) {
      const data: { stargazers_count?: number } = await res.json();
      return data.stargazers_count ?? 0;
    }
  } catch {
    // ignore network / rate-limit errors
  }
  return 0;
}
