"use client";

import { cn } from "@/utils";
import * as CheckBox from "@radix-ui/react-checkbox";
import * as React from "react";

const ToggleSwitch = React.forwardRef<
	React.ElementRef<typeof CheckBox.Root>,
	React.ComponentPropsWithoutRef<typeof CheckBox.Root>
>(({ children, ...props }, ref) => (
	<CheckBox.Root
		ref={ref}
		className={cn(
			"peer h-8 w-8 shrink-0 rounded-sm border border-gray-500 data-[state=checked]:bg-blue-400 after:content-['NO'] data-[state='checked']:after:content-['SI'] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-inherit data-[state=checked]:text-slate-100 text-slate-400",
		)}
		{...props}
	>
		{/* <CheckBox.CheckboxIndicator
			className={cn("flex items-center justify-center text-white")}
		></CheckBox.CheckboxIndicator> */}
	</CheckBox.Root>
));

ToggleSwitch.displayName = CheckBox.Root.displayName;

export { ToggleSwitch };
