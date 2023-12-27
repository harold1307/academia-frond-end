"use client";
import React from "react";

import { cn } from "@/utils";
import { Input, type InputProps } from "./input";
import { Label } from "./label";

const FormInputFile = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		const [name, setName] = React.useState<string | null>(null);

		return (
			<Label
				id={props.id}
				className={cn(
					"flex items-center gap-2 rounded-sm border px-3 py-2",
					className,
				)}
			>
				<div className='rounded-sm bg-primary/50 p-1'>
					Selecciona un archivo
				</div>
				<div className='font-normal'>
					{name || "Ningun archivo seleccionado"}
				</div>
				<Input
					className='hidden'
					{...props}
					type='file'
					id={props.id}
					ref={ref}
					onChange={e => {
						props.onChange?.(e);

						setName(e.target.files?.item(0)?.name || null);
					}}
				/>
			</Label>
		);
	},
);
FormInputFile.displayName = "FormInputFile";

export { FormInputFile };
