import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Markdown mínimo para el cuerpo de las historias, sin dependencias y sin
 * dangerouslySetInnerHTML: todo se convierte en nodos de React.
 * Soporta: párrafos, ## y ###, listas (- y 1.), > citas, **negrita**, *cursiva*
 * y [enlaces](url). Los enlaces internos (/…) usan <Link>.
 */

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of source.trim().split(/\n{2,}/)) {
    const lines = chunk.split("\n").map((l) => l.trim());
    const first = lines[0] ?? "";
    if (first.startsWith("### ")) blocks.push({ type: "h3", text: first.slice(4) });
    else if (first.startsWith("## ")) blocks.push({ type: "h2", text: first.slice(3) });
    else if (lines.every((l) => l.startsWith("> ")))
      blocks.push({ type: "quote", text: lines.map((l) => l.slice(2)).join(" ") });
    else if (lines.every((l) => l.startsWith("- ")))
      blocks.push({ type: "ul", items: lines.map((l) => l.slice(2)) });
    else if (lines.every((l) => /^\d+\.\s/.test(l)))
      blocks.push({ type: "ol", items: lines.map((l) => l.replace(/^\d+\.\s/, "")) });
    else blocks.push({ type: "p", text: lines.join(" ") });
  }
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label = "", href = ""] = link;
      if (href.startsWith("/")) {
        return (
          <Link key={key} href={href}>
            {label}
          </Link>
        );
      }
      // Solo http(s): nada de javascript: ni otros esquemas.
      return /^https?:\/\//.test(href) ? (
        <a key={key} href={href} rel="noopener noreferrer" target="_blank">
          {label}
        </a>
      ) : (
        label
      );
    }
    return part;
  });
}

export interface MarkdownClassNames {
  h2?: string;
  h3?: string;
  p?: string;
  quote?: string;
  list?: string;
}

export function renderMarkdown(source: string, classes: MarkdownClassNames = {}): ReactNode[] {
  return parseBlocks(source).map((block, i) => {
    const key = `b${i}`;
    switch (block.type) {
      case "h2":
        return (
          <h2 key={key} className={classes.h2}>
            {renderInline(block.text, key)}
          </h2>
        );
      case "h3":
        return (
          <h3 key={key} className={classes.h3}>
            {renderInline(block.text, key)}
          </h3>
        );
      case "quote":
        return (
          <blockquote key={key} className={classes.quote}>
            <p>{renderInline(block.text, key)}</p>
          </blockquote>
        );
      case "ul":
      case "ol": {
        const List = block.type;
        return (
          <List key={key} className={classes.list}>
            {block.items.map((item, j) => (
              <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>
            ))}
          </List>
        );
      }
      default:
        return (
          <p key={key} className={classes.p}>
            {renderInline(block.text, key)}
          </p>
        );
    }
  });
}
