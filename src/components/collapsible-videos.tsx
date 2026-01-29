type CollapsibleVideosProps = {
	title: string;
	videos: {
		url: string;
		alt: string;
	}[];
};

export function CollapsibleVideos({ title, videos }: CollapsibleVideosProps) {
	return (
		<details className="my-4">
			<summary className="my-4 mb-2 cursor-pointer text-paper-700/60 text-sm focus-visible:text-paper-1000 focus-visible:outline-none dark:text-paper-100/60">
				{title}
			</summary>

			{videos.length > 1 ? (
				<div className="relative my-8 block w-full md:left-1/2 md:my-16 md:w-screen md:max-w-6xl md:-translate-x-1/2">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{videos.map((video) => (
							<iframe
								allow="autoplay; encrypted-media"
								allowFullScreen
								className="my-4 aspect-video rounded-md"
								key={video.url}
								loading="lazy"
								src={video.url}
								title={video.alt}
							/>
						))}
					</div>
				</div>
			) : (
				<iframe
					allow="autoplay; encrypted-media"
					allowFullScreen
					className="my-4 aspect-video rounded-md"
					loading="lazy"
					src={videos[0].url}
					title={videos[0].alt}
				/>
			)}
		</details>
	);
}
