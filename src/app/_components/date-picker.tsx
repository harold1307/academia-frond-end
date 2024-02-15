"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useEffect } from "react";

import { cn } from "@/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ControllerProps } from "react-hook-form";

interface DatePickerDemoProps {
	value?: string;
	onChangeValue: (date: Date | undefined) => void;
}
export function DatePickerDemo({
	value = new Date().toString(),
	onChangeValue,
}: DatePickerDemoProps) {
	const [date, setDate] = React.useState<Date | undefined>(new Date(value));

	const updateDate = (day: Date | undefined) => {
		setDate(day);
		onChangeValue(day);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={date}
					onSelect={day => updateDate(day)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
