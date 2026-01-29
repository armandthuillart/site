import { Button as ButtonPrimitive } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
	"flex cursor-pointer items-center justify-center rounded-full outline-paper-1000 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			size: {
				icon: "size-9 [&>svg]:size-4",
			},
			variant: {
				secondary:
					"bg-paper-200 text-paper-700/60 hover:bg-paper-700/10 hover:text-paper-700 dark:bg-paper-700 dark:text-paper-100/60 dark:hover:bg-paper-200/10 dark:hover:text-paper-100",
			},
		},
	},
);

type ButtonProps = ButtonPrimitive.Props & {
	variant?: VariantProps<typeof buttonVariants>["variant"];
	size?: VariantProps<typeof buttonVariants>["size"];
};

export function Button({ className, size, variant, ...props }: ButtonProps) {
	return (
		<ButtonPrimitive
			className={cn(buttonVariants({ className, size, variant }))}
			{...props}
		/>
	);
}
