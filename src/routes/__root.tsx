import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanstackProvider } from "fumadocs-core/framework/tanstack";
import type { ReactNode } from "react";
import appCss from "@/styles/app.css?url";

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html
			className="scheme-light-dark antialiased"
			lang="en"
			suppressHydrationWarning={true}
		>
			<head>
				<HeadContent />
			</head>
			<body className="bg-paper-50 text-paper-700 dark:bg-paper-950 dark:text-paper-100">
				<TanstackProvider>{children}</TanstackProvider>
				<Scripts />
			</body>
		</html>
	);
}

export const Route = createRootRoute({
	component: RootComponent,
	head: () => ({
		links: [
			{
				href: appCss,
				rel: "stylesheet",
			},
			{
				href: "/favicon.ico",
				rel: "icon",
			},
		],
		meta: [
			{
				charSet: "utf-8",
			},
			{
				content: "#13120A",
				media: "(prefers-color-scheme: dark)",
				name: "theme-color",
			},
			{
				content: "#F2F1ED",
				media: "(prefers-color-scheme: light)",
				name: "theme-color",
			},
			{
				content: "width=device-width, initial-scale=1",
				name: "viewport",
			},
			{
				title: "Armand Thuillart",
			},
			{
				content: "Designer and developer.",
				name: "description",
			},
			{
				content: "https://armandthuillart.com/opengraph-image.png",
				property: "og:image",
			},
			{
				content: "image/png",
				property: "og:image:type",
			},
			{
				content: "Armand Thuillart",
				property: "og:title",
			},
			{
				content: "Designer and developer.",
				property: "og:description",
			},
			{
				content: "summary_large_image",
				name: "twitter:card",
			},
			{
				content: "Armand Thuillart",
				name: "twitter:title",
			},
			{
				content: "Designer and developer.",
				name: "twitter:description",
			},
			{
				content: "https://armandthuillart.com/opengraph-image.png",
				name: "twitter:image",
			},
		],
	}),
});
