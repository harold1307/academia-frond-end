import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/utils";

type ComboboxProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	value: string;
	setValue: (value: string) => void;
	emptyText?: string;
	placeholder: string;
	options: { label: string; value: string }[];
};

export function Combobox({
	onOpenChange,
	open,
	placeholder,
	setValue,
	value,
	emptyText,
	options,
}: ComboboxProps) {
	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-[200px] justify-between'
				>
					{value
						? options.find(option => option.value === value)?.label
						: placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder={placeholder} />
					{emptyText && <CommandEmpty>{emptyText}</CommandEmpty>}
					<CommandGroup>
						{options.map(option => (
							<CommandItem
								key={option.value}
								value={option.value}
								onSelect={currentValue => {
									setValue(currentValue === value ? "" : currentValue);
									onOpenChange(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === option.value ? "opacity-100" : "opacity-0",
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}