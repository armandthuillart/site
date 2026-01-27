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
		links: [
			{
				href: `https://armandthuillart.com${loaderData?.url}`,
				rel: "canonical",
			},
		],
		meta: [
			{ title: loaderData?.title },
			{ content: loaderData?.description, name: "description" },
			{ content: loaderData?.title, property: "og:title" },
			{ content: loaderData?.description, property: "og:description" },
			{ content: loaderData?.title, name: "twitter:title" },
			{ content: loaderData?.description, name: "twitter:description" },
		],
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
			description: page.data.description,
			path: page.path,
			title: page.data.title,
			url: page.url,
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component({ default: MDX }) {
		return <MDX components={getMDXComponents()} />;
	},
});

function Page() {
	const loaderData = Route.useLoaderData();
	const data = useFumadocsLoader(loaderData);

	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		author: {
			"@type": "Person",
			name: "Armand Thuillart",
			url: "https://armandthuillart.com",
		},
		description: loaderData.description,
		headline: loaderData.title,
		url: `https://armandthuillart.com${loaderData.url}`,
	};

	return (
		<>
			<script
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
				type="application/ld+json"
			/>
			<main className="px-8">
				<article className="mx-auto max-w-xl">
					<div className="py-16 lg:pt-32">
						<Suspense>{clientLoader.useContent(data.path)}</Suspense>
					</div>
				</article>
			</main>
		</>
	);
}
