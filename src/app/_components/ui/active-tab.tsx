import Link from "next/link";

import { cn } from "@/utils";

type ActiveTabProps = React.ComponentProps<typeof Link> & {
	searchParam?: string;
	isActive?: boolean;
};

export function ActiveTab({
	href,
	isActive,
	className,
	...props
}: ActiveTabProps) {
	return (
		<Link
			{...props}
			href={href}
			className={cn(
				"rounded-lg  border border-transparent bg-background px-4 py-2 hover:border-white hover:bg-background/90",
				isActive && "border-white",
				className,
			)}
		/>
	);
}
