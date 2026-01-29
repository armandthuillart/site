export function NotFound() {
	return (
		<div className="flex h-dvh flex-col items-center justify-center">
			<div className="inline-flex items-center">
				<h1 className="mr-5 inline-block border-paper-700/10 border-r pr-6 font-medium text-2xl/loose dark:border-paper-100/10">
					404
				</h1>
				<h2 className="text-base">This page doesn't exist.</h2>
			</div>
		</div>
	);
}
