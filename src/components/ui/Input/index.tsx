import * as React from "react";

import { cn } from "@/lib/utils";

export type InputWithIconProps = React.ComponentProps<"input"> & {
	icon: React.ElementType;
};

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-primary focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
}

function InputWithIcon({
	className,
	type,
	icon: Icon,
	...props
}: InputWithIconProps) {
	return (
		<div
			className={cn(
				"flex items-center",
				"dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparenttext-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-within:border-primary focus-within:ring-ring/50 focus-within:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		>
			<div className="pl-3 pr-2">
				<Icon />
			</div>

			<input
				type={type}
				data-slot="input"
				className={cn(
					"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30  h-9 w-full min-w-0 rounded-md  bg-transparent pr-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
					"w-full h-full",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

export { Input, InputWithIcon };
