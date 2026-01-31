import { Dialog } from "@base-ui/react/dialog";
import { Image } from "@unpic/react";
import { useEffect, useState } from "react";
import type { GalleryImage } from "@/components/image-gallery.tsx";

interface ImageViewerProps {
	images: GalleryImage[];
	index: number;
}

export function ImageViewer({ images, index }: ImageViewerProps) {
	const [currentIndex, setCurrentIndex] = useState(index);
	const currentImage = images[currentIndex];

	function goToPrevious() {
		setCurrentIndex((prev) => {
			if (prev > 0) {
				return prev - 1;
			}
			return images.length - 1;
		});
	}

	function goToNext() {
		setCurrentIndex((prev) => {
			if (prev < images.length - 1) {
				return prev + 1;
			}
			return 0;
		});
	}

	useEffect(() => {
		setCurrentIndex(index);
	}, [index]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft") {
				setCurrentIndex((prev) => {
					if (prev > 0) {
						return prev - 1;
					}
					return images.length - 1;
				});
				event.stopPropagation();
			} else if (event.key === "ArrowRight") {
				setCurrentIndex((prev) => {
					if (prev < images.length - 1) {
						return prev + 1;
					}
					return 0;
				});
				event.stopPropagation();
			}
		};

		document.addEventListener("keydown", handleKeyDown, true);
		return () => {
			document.removeEventListener("keydown", handleKeyDown, true);
		};
	}, [images.length]);

	return (
		<Dialog.Portal>
			<Dialog.Backdrop className="fixed inset-0 z-40 h-dvh bg-radial from-black/90 to-black/95 backdrop-blur-[2px]" />

			<Dialog.Popup className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none focus-visible:outline-none md:px-24">
				<Dialog.Title className="sr-only">Image viewer</Dialog.Title>
				<Dialog.Description className="sr-only">
					Navigate through images with arrow keys
				</Dialog.Description>

				<Dialog.Close
					aria-hidden={true}
					className="absolute inset-0 z-0"
					tabIndex={-1}
				/>

				<div className="relative z-10 aspect-3/2 max-h-200 w-full max-w-300">
					<div className="relative size-full overflow-hidden drop-shadow-2xl">
						<Image
							alt={currentImage.alt}
							className="size-full object-cover"
							layout="fullWidth"
							src={currentImage.url}
						/>

						<div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-black/60 to-transparent p-6 text-center text-white">
							<p className="font-light text-sm tracking-wide opacity-90 md:text-base">
								{currentImage.alt}
							</p>
						</div>
					</div>
				</div>

				<Dialog.Close
					aria-label="Close modal"
					className="absolute top-4 right-4 z-50 rounded-full text-white hover:opacity-80 focus-visible:outline-2 focus-visible:outline-paper-1000 focus-visible:outline-offset-2 md:top-8 md:right-8"
				>
					<svg
						aria-hidden="true"
						className="size-8"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M6 18L18 6M6 6l12 12" />
					</svg>
				</Dialog.Close>

				{images.length > 1 && (
					<>
						<button
							aria-label="Previous image"
							className="absolute right-1/2 bottom-4 z-50 size-fit -translate-y-1/2 rounded-full p-2 text-white hover:opacity-80 focus-visible:outline-2 focus-visible:outline-paper-1000 focus-visible:outline-offset-2 md:top-1/2 md:right-auto md:left-4"
							onClick={goToPrevious}
							type="button"
						>
							<svg
								aria-hidden="true"
								className="size-10"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M15 19l-7-7 7-7"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</button>

						<button
							aria-label="Next image"
							className="absolute bottom-4 left-1/2 z-50 size-fit -translate-y-1/2 rounded-full p-2 text-white hover:opacity-80 focus-visible:outline-2 focus-visible:outline-paper-1000 focus-visible:outline-offset-2 md:top-1/2 md:right-4 md:left-auto"
							onClick={goToNext}
							type="button"
						>
							<svg
								aria-hidden="true"
								className="size-10"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9 5l7 7-7 7"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</button>
					</>
				)}
			</Dialog.Popup>
		</Dialog.Portal>
	);
}
