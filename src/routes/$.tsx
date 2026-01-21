import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { Suspense } from "react";
import { getMDXComponents } from "@/components/mdx-components";
import { source } from "@/lib/source";

// biome-ignore assist/source/useSortedKeys: loader has to be first
export const Route = createFileRoute("/$")({
	component: Page,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
	head: ({ loaderData }) => ({
		meta: [{ title: loaderData?.title }],
	}),
});

const serverLoader = createServerFn({
	method: "GET",
})
	.inputValidator((slugs: string[]) => slugs)
	.handler(async ({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) throw notFound();

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

function Page() {
	const data = useFumadocsLoader(Route.useLoaderData());

	return (
		<div className="px-8">
			<div className="mx-auto max-w-xl">
				<div className="py-16 lg:pt-32">
					<Suspense>{clientLoader.useContent(data.path)}</Suspense>
				</div>
			</div>
		</div>
	);
}
