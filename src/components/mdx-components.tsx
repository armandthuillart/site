import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { CollapsibleVideos } from "@/components/collapsible-videos";
import { ImageGallery } from "@/components/image-gallery";
import { TopArtists } from "@/components/top-artists";
import { TopTracks } from "@/components/top-tracks";
import { cn } from "@/lib/utils";

export function getMDXComponents() {
	return {
		a: ({ children, href, ...props }: ComponentProps<"a">) => {
			const hrefString = href?.toString() ?? "";
			const isExternal = hrefString.startsWith("http");
			const isHashLink = hrefString.startsWith("#");

			const className =
				"cursor-pointer scroll-mt-5 align-baseline underline decoration-1 underline-offset-[2.5px] focus-visible:outline-none focus-visible:decoration-paper-1000 focus-visible:decoration-2";

			if (isHashLink) {
				return (
					<Link className={className} to={hrefString} {...props}>
						{children}
					</Link>
				);
			}

			return (
				<Link
					className={className}
					rel={isExternal ? "noopener noreferrer" : undefined}
					target={isExternal ? "_blank" : undefined}
					to={hrefString}
					{...props}
				>
					{children}

					{isExternal && (
						<svg
							aria-hidden="true"
							className="inline size-4 align-middle"
							fill="currentColor"
							height="24"
							viewBox="0 0 256 256"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
						</svg>
					)}
				</Link>
			);
		},
		blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
			<blockquote
				className={cn(
					"mt-5 not-last:mb-5 border-paper-700/10 border-l-3 pl-3.5 text-lg dark:border-paper-100/10 [&>p]:m-0",
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
			<li className="text-lg marker:text-paper-700/60 dark:marker:text-paper-100/60" {...props} />
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
	};
}
