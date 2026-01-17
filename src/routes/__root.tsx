import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanstackProvider } from "fumadocs-core/framework/tanstack";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import appCss from "@/styles/app.css?url";

export const Route = createRootRoute({
	component: RootComponent,
	head: () => {
		const baseURL = import.meta.env.VITE_SITE_URL ?? "http://localhost:3000";

		return {
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
					content: `${baseURL}/opengraph-image.png`,
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
					content: `${baseURL}/opengraph-image.png`,
					name: "twitter:image",
				},
			],
		};
	},
});

function RootComponent() {
	return (
		<ThemeProvider>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</ThemeProvider>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="relative bg-background font-sans text-foreground antialiased">
				<TanstackProvider>{children}</TanstackProvider>
				<Scripts />
			</body>
		</html>
	);
}
