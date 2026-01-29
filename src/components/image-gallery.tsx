import { Dialog } from "@base-ui/react";
import { Image } from "@unpic/react";
import { useState } from "react";
import { ImageViewer } from "@/components/image-viewer";

export type GalleryImage = {
	url: string;
	alt: string;
};

type ImageGalleryProps = { images: GalleryImage[] };

export function ImageGallery({ images }: ImageGalleryProps) {
	const [index, setIndex] = useState<number | null>(null);

	return (
		<Dialog.Root>
			<div className="relative my-8 block w-full md:left-1/2 md:my-16 md:w-screen md:max-w-6xl md:-translate-x-1/2">
				<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
					{images.map((image, index) => (
						<Dialog.Trigger
							aria-label={`Open image: ${image.alt}`}
							className="cursor-pointer overflow-hidden rounded-md outline-paper-1000 hover:opacity-90"
							key={image.url}
							onClick={() => setIndex(index)}
							type="button"
						>
							<Image
								alt={image.alt}
								className="size-full object-cover"
								layout="fullWidth"
								loading="lazy"
								src={image.url}
							/>
						</Dialog.Trigger>
					))}
				</div>
			</div>

			{index !== null && <ImageViewer images={images} index={index} />}
		</Dialog.Root>
	);
}
