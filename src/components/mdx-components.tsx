import { Link } from "@tanstack/react-router";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { CollapsibleVideos } from "@/components/collapsible-videos";
import { ImageGallery } from "@/components/image-gallery";
import { TopArtists } from "@/components/top-artists";
import { TopTracks } from "@/components/top-tracks";
import { cn } from "@/lib/utils";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		a: ({ href, ...props }: ComponentProps<"a">) => {
			const isExternal = href?.toString().startsWith("http");
			const isHashLink = href?.toString().startsWith("#");

			const className =
				"inline cursor-pointer scroll-mt-5 align-baseline underline decoration-1 decoration-muted-foreground underline-offset-3 hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

			if (isExternal || isHashLink) {
				return (
					<a
						className={className}
						href={href}
						rel={isExternal ? "noopener noreferrer" : undefined}
						target={isExternal ? "_blank" : undefined}
						{...props}
					/>
				);
			}

			return <Link className={className} to={href as "/$"} {...props} />;
		},
		blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
			<blockquote
				className={cn(
					"mt-5 not-last:mb-5 border-muted-foreground border-l-3 pl-3.5 text-lg [&>p]:m-0",
					className,
				)}
				{...props}
			/>
		),
		CollapsibleVideos,
		em: ({ className, ...props }: ComponentProps<"em">) => (
			<em className={cn("font-medium", className)} {...props} />
		),
		h1: (props: ComponentProps<"h1">) => (
			<h1 className="font-medium text-xl leading-8 lg:text-2xl" {...props} />
		),
		h2: (props: ComponentProps<"h2">) => (
			<h2
				className="mt-12 mb-2 font-medium text-lg tracking-tight lg:text-xl"
				{...props}
			/>
		),
		ImageGallery,
		li: (props: ComponentProps<"li">) => (
			<li className="text-lg marker:text-muted-foreground" {...props} />
		),
		ol: (props: ComponentProps<"ol">) => (
			<ol className="space-y-1 pl-4 *:*:mt-0 [&>li]:list-decimal" {...props} />
		),
		p: (props: ComponentProps<"p">) => (
			<p className="mt-5 not-last:mb-5 text-lg" {...props} />
		),
		sup: ({ className, ...props }: ComponentProps<"sup">) => (
			<sup className={cn("text-[.625rem]", className)} {...props} />
		),
		TopArtists,
		TopTracks,
		ul: (props: ComponentProps<"ul">) => (
			<ul className="space-y-1 pl-4 [&>li]:list-[square]" {...props} />
		),
		...components,
	};
}
