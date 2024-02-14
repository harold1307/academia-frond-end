import * as Collapsible from "@radix-ui/react-collapsible";
import React from "react";

import { cn } from "@/utils";

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

CollapsibleTrigger.displayName = Collapsible.Trigger.displayName;

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

CollapsibleContent.displayName = Collapsible.Content.displayName;

export { CollapsibleContent, CollapsibleItem, CollapsibleTrigger };
