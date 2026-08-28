/**
 * Remark plugin that removes the `## Table of contents` heading from posts.
 *
 * The table of contents is now rendered as a sticky sidebar, so the legacy
 * inline "Table of contents" heading (used by `remark-toc`) is no longer
 * needed and would otherwise show up as an empty heading in the article.
 */
export default function stripTableOfContentsHeading() {
  const textOf = node => {
    if (!node) return "";
    if (node.type === "text") return node.value ?? "";
    if (Array.isArray(node.children)) return node.children.map(textOf).join("");
    return "";
  };

  const remove = node => {
    if (Array.isArray(node.children)) {
      node.children = node.children.map(remove).filter(child => {
        if (child && child.type === "heading" && child.depth === 2) {
          const text = textOf(child).trim().toLowerCase();
          return text !== "table of contents";
        }
        return true;
      });
    }
    return node;
  };

  return tree => {
    remove(tree);
  };
}
