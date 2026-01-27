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
			{
				href: "https://armandthuillart.com",
				rel: "canonical",
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
			{
				content: "@armandthuillart",
				name: "twitter:creator",
			},
			{
				content: "@armandthuillart",
				name: "twitter:site",
			},
			{
				content: "#ffffff",
				name: "theme-color",
			},
		],
	}),
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
	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		email: "armand.thuillart@proton.me",
		image: "https://armandthuillart.com/opengraph-image.png",
		jobTitle: "Designer and Developer",
		name: "Armand Thuillart",
		sameAs: [
			"https://github.com/thuillart",
			"https://www.youtube.com/@armand.thuillart",
		],
		url: "https://armandthuillart.com",
		worksFor: {
			"@type": "Organization",
			name: "Neap",
		},
	};

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<script
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
					type="application/ld+json"
				/>
			</head>
			<body className="relative bg-background font-sans text-foreground antialiased">
				<TanstackProvider>{children}</TanstackProvider>
				<Scripts />
			</body>
		</html>
	);
}
