import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { Element, Root, Text } from "hast";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

function isElement(node: Element | Root | { type: string }): node is Element {
	return node.type === "element";
}

function hasId(node: Element): boolean {
	return Boolean(node.properties?.id);
}

function isAnchor(node: Element): boolean {
	return node.tagName === "a";
}

function hasHref(node: Element): boolean {
	return Boolean(node.properties?.href);
}

function hasChildren(
	node: Element | Root,
): node is Element | (Root & { children: Element[] }) {
	return "children" in node;
}

function customizeFootnoteIds() {
	return (tree: Root) => {
		const walk = (node: Element | Root) => {
			if (isElement(node)) {
				if (hasId(node)) {
					const nodeId = String(node.properties.id);
					if (nodeId.startsWith("fnref")) {
						node.properties.id = nodeId.replace("fnref", "footnote-ref");
					} else if (nodeId.startsWith("fn")) {
						node.properties.id = nodeId.replace("fn", "footnote");
					}
				}
				if (isAnchor(node) && hasHref(node)) {
					const nodeHref = String(node.properties.href);
					if (nodeHref.startsWith("#fnref")) {
						node.properties.href = nodeHref.replace("#fnref", "#footnote-ref");
					} else if (nodeHref.startsWith("#fn")) {
						node.properties.href = nodeHref.replace("#fn", "#footnote");
					}
				}
			}
			if (hasChildren(node)) {
				for (const child of node.children) {
					if (isElement(child)) walk(child);
				}
			}
		};
		walk(tree);
	};
}

export const docs = defineDocs({
	dir: "content/docs",
});

export default defineConfig({
	mdxOptions: {
		rehypePlugins: (currentPlugins) => [
			...currentPlugins,
			rehypeKatex,
			customizeFootnoteIds,
		],
		remarkPlugins: [remarkMath],
		remarkRehypeOptions: {
			clobberPrefix: "",
			footnoteBackContent(
				_: number,
				rereferenceIndex: number,
			): Array<Element | Text> {
				const result: Array<Element | Text> = [
					{
						children: [
							{
								children: [],
								properties: {
									d: "M7.49023 12L3.74023 15.75M3.74023 15.75L7.49023 19.5M3.74023 15.75H20.2402V4.49902",
								},
								tagName: "path",
								type: "element",
							},
						],
						properties: {
							ariaHidden: "true",
							className: [
								"size-4 inline-block -translate-y-0.5 hover:opacity-80",
							],
							fill: "none",
							height: 24,
							stroke: "currentColor",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 1.5,
							viewBox: "0 0 24 24",
							width: 24,
							xmlns: "http://www.w3.org/2000/svg",
						},
						tagName: "svg",
						type: "element",
					},
				];

				if (rereferenceIndex > 1) {
					result.push({
						children: [
							{
								type: "text",
								value: String(rereferenceIndex),
							},
						],
						properties: {},
						tagName: "sup",
						type: "element",
					});
				}

				return result;
			},
			footnoteLabelProperties: {
				className: "sr-only",
			},
			footnoteLabelTagName: "h5",
		},
	},
});
