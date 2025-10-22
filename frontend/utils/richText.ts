import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { StarterKit } from "@tiptap/starter-kit";
import { createElement, Fragment } from "react";
import type { ReactNode } from "react";
import { linkClasses } from "@/components/Link";

export const richTextExtensions = [
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  StarterKit.configure({ listItem: { HTMLAttributes: { class: "[&>p]:inline" } } }),
  Link.configure({ defaultProtocol: "https" }),
  Underline,
];

const urlMatcher = /(https?:\/\/[^\s]+|www\.[^\s]+)/giu;

export const linkifyLineItemText = (text: string): ReactNode => {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlMatcher.exec(trimmed)) !== null) {
    const matchedUrl = match[0];
    const matchStart = match.index;

    if (matchStart > lastIndex) {
      parts.push(trimmed.slice(lastIndex, matchStart));
    }

    if (matchedUrl.includes("@")) {
      parts.push(matchedUrl);
    } else {
      const href = matchedUrl.startsWith("http") ? matchedUrl : `https://${matchedUrl}`;
      parts.push(
        createElement(
          "a",
          {
            key: `${href}-${parts.length}`,
            href,
            className: linkClasses,
            rel: "noreferrer noopener",
            target: "_blank",
          },
          matchedUrl,
        ),
      );
    }

    lastIndex = matchStart + matchedUrl.length;
  }

  if (lastIndex < trimmed.length) {
    parts.push(trimmed.slice(lastIndex));
  }

  if (parts.length === 0) return trimmed;

  return createElement(Fragment, null, ...parts);
};
