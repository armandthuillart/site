import browserCollections from "fumadocs-mdx:collections/browser";
import {
	ArrowBendUpLeftIcon,
	CheckIcon,
	LinkIcon,
} from "@phosphor-icons/react";
import {
	createFileRoute,
	Link,
	notFound,
	useCanGoBack,
	useLocation,
	useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { Suspense, useState } from "react";
import { getMDXComponents } from "@/components/mdx-components.tsx";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { source } from "@/lib/source.ts";
import { cn } from "@/lib/utils.ts";

const COPY_LINK_DELAY = 2000;

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
	const canGoBack = useCanGoBack();
	const { path } = useFumadocsLoader(Route.useLoaderData());
	const { pathname } = useLocation();
	const { history } = useRouter();

	const [copied, setCopied] = useState(false);

	function handleCopyLink() {
		navigator.clipboard.writeText(window.location.href).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), COPY_LINK_DELAY);
		});
	}

	return (
		<div className="isolate overflow-clip px-8">
			<div
				className={cn("mx-auto max-w-xl py-20", {
					"flex flex-col gap-24": pathname !== "/",
				})}
			>
				{pathname !== "/" && (
					<nav className="flex justify-between">
						{canGoBack && (
							<Button
								onClick={() => history.back()}
								size="icon"
								variant="secondary"
							>
								<ArrowBendUpLeftIcon weight="bold" />
							</Button>
						)}

						{!canGoBack && (
							<Link
								className={buttonVariants({
									size: "icon",
									variant: "secondary",
								})}
								to={"/" as string}
							>
								<ArrowBendUpLeftIcon weight="bold" />
							</Link>
						)}

						<Button onClick={handleCopyLink} size="icon" variant="secondary">
							{Boolean(copied) && <CheckIcon weight="bold" />}
							{Boolean(!copied) && <LinkIcon weight="bold" />}
						</Button>
					</nav>
				)}

				<div>
					<Suspense>{clientLoader.useContent(path)}</Suspense>
				</div>
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 bg-center bg-repeat opacity-30 mix-blend-overlay dark:opacity-5"
				style={{ backgroundImage: "url(/paper-grain.svg)" }}
			/>
		</div>
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
