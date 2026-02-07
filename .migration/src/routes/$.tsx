import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { getMDXComponents } from "@/components/mdx-components";
import { source } from "@/lib/source";

const serverLoader = createServerFn({
	method: "GET",
})
	.inputValidator((slugs: string[]) => slugs)
	.handler(({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) {
			throw notFound();
		}

		return {
			path: page.path,
			title: page.data.title,
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component({ default: MDX }) {
		return <MDX components={getMDXComponents()} />;
	},
});

function RouteComponent() {
	const { path } = useFumadocsLoader(Route.useLoaderData());

	return (
		<>
			<Header />
			<main className="isolate overflow-clip">
				<article className="mx-auto max-w-164 px-6 py-20 lg:px-10">
					<Suspense>{clientLoader.useContent(path)}</Suspense>
				</article>
			</main>
		</>
	);
}

// biome-ignore assist/source/useSortedKeys: loader has to be first
export const Route = createFileRoute("/$")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await Promise.resolve(serverLoader({ data: slugs }));
		clientLoader.preload(data.path);
		return data;
	},
	head: ({ loaderData }) => ({
		meta: [{ title: loaderData?.title }],
	}),
});
