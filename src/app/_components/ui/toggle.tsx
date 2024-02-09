"use client";

import * as Toggle from "@radix-ui/react-toggle";
import * as React from "react";

const ToggleSwitch = React.forwardRef<
	React.ElementRef<typeof Toggle.Root>,
	React.ComponentPropsWithoutRef<typeof Toggle.Root>
>(({ children, ...props }, ref) => (
	<Toggle.Root
		ref={ref}
		{...props}
		className='flex h-9 w-9 items-center justify-center rounded-md border border-slate-500 p-2 text-base text-slate-300/80 ring-slate-400 focus:ring data-[state=off]:bg-blue-600 data-[state=off]:text-slate-300 data-[state=off]:after:content-["SI"] data-[state=on]:after:content-["NO"]'
	></Toggle.Root>
));

ToggleSwitch.displayName = Toggle.Root.displayName;

export { ToggleSwitch };
