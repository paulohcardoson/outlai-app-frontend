import type { PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
	className?: string;
}>;

export const Title = (props: Props) => (
	<h3 className={`font-semibold ${props.className}`}>{props.children}</h3>
);
