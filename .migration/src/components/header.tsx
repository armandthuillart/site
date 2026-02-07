import { ArrowBendUpLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowBendUpLeft";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { LinkIcon } from "@phosphor-icons/react/dist/ssr/Link";
import {
	Link,
	useCanGoBack,
	useLocation,
	useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COPY_LINK_DELAY = 1000;

export function Header() {
	const [hasCopied, setHasCopied] = useState(false);

	const { pathname, href } = useLocation();
	const { history } = useRouter();

	const canGoBack = useCanGoBack();

	function handleCopy() {
		navigator.clipboard.writeText(href).then(() => {
			setHasCopied(true);
			setTimeout(() => setHasCopied(false), COPY_LINK_DELAY);
		});
	}

	return (
		<header
			className={cn("mx-auto w-full max-w-164 px-6 pt-20 lg:px-10", {
				hidden: pathname === "/",
			})}
		>
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
						to=".."
					>
						<ArrowBendUpLeftIcon weight="bold" />
					</Link>
				)}

				<Button onClick={handleCopy} size="icon" variant="secondary">
					{Boolean(hasCopied) && <CheckIcon weight="bold" />}
					{Boolean(!hasCopied) && <LinkIcon weight="bold" />}
				</Button>
			</nav>
		</header>
	);
}
