import { cn } from "@/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import React from "react";

const CollapsibleItem = Collapsible.Root;

const CollapsibleTrigger = React.forwardRef<
	React.ElementRef<typeof Collapsible.Trigger>,
	React.ComponentPropsWithoutRef<typeof Collapsible.Trigger>
>(({ className, children, ...props }, ref) => {
	return (
		<Collapsible.Trigger
			ref={ref}
			className={cn("w-100", className)}
			{...props}
		>
			{children}
		</Collapsible.Trigger>
	);
});

const CollapsibleContent = React.forwardRef<
	React.ElementRef<typeof Collapsible.Content>,
	React.ComponentPropsWithoutRef<typeof Collapsible.Content>
>(({ className, children, ...props }, ref) => {
	return (
		<Collapsible.Content ref={ref} className={cn("", className)} {...props}>
			{children}
		</Collapsible.Content>
	);
});

export { CollapsibleItem, CollapsibleTrigger, CollapsibleContent };
