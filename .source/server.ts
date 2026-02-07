// @ts-nocheck
/// <reference types="vite/client" />
import { server } from "fumadocs-mdx/runtime/server";
import type * as Config from "../source.config";

const create = server<
	typeof Config,
	import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
		DocData: {};
	}
>({ doc: { passthroughs: ["extractedReferences"] } });

export const docs = await create.docs(
	"docs",
	"content/docs",
	import.meta.glob(["./**/*.{json,yaml}"], {
		base: "./../content/docs",
		eager: true,
		import: "default",
		query: {
			collection: "docs",
		},
	}),
	import.meta.glob(["./**/*.{mdx,md}"], {
		base: "./../content/docs",
		eager: true,
		query: {
			collection: "docs",
		},
	}),
);
