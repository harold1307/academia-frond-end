"use client";
import { FileSignature, X } from "lucide-react";

import { cn } from "@/utils";
import { Button, type ButtonProps } from "./ui/button";

type BaseTableActionsProps = {
	updateOptions?: {
		buttonProps?: ButtonProps & React.RefAttributes<HTMLButtonElement>;
		show?: boolean;
		icon?: React.ReactNode;
	};
	deleteOptions?: {
		buttonProps?: ButtonProps & React.RefAttributes<HTMLButtonElement>;
		show?: boolean;
		icon?: React.ReactNode;
	};
};

export default function BaseTableActions({
	updateOptions,
	deleteOptions,
}: BaseTableActionsProps) {
	return (
		<div className='flex items-center justify-center gap-2'>
			{updateOptions?.show === undefined || !!updateOptions.show ? (
				<Button
					size='icon'
					variant='info'
					{...updateOptions?.buttonProps}
					className={cn(updateOptions?.buttonProps?.className)}
				>
					{updateOptions?.icon || <FileSignature className='h-4 w-4' />}
				</Button>
			) : null}
			{deleteOptions?.show === undefined || !!deleteOptions.show ? (
				<Button
					size='icon'
					variant='destructive'
					{...deleteOptions?.buttonProps}
				>
					{deleteOptions?.icon || <X className='h-4 w-4' />}
				</Button>
			) : null}
		</div>
	);
}
