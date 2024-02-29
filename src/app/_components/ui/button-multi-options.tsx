import type { LucideIcon } from "lucide-react";

import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";

export type ButtonOption = React.ComponentProps<typeof DropdownMenuItem> & {
	label: string;
	Icon?: LucideIcon;
};

export type ButtonMultiOptionProps = React.ComponentProps<typeof Button> & {
	options: ButtonOption[];
};

export function ButtonMultiOption({
	options,
	...buttonProps
}: ButtonMultiOptionProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' {...buttonProps} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuGroup>
					{options.map(({ Icon, label, ...itemProps }, idx) => (
						<DropdownMenuItem key={idx} {...itemProps}>
							{Icon && <Icon className='mr-2 h-4 w-4' />}
							<span>{label}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
