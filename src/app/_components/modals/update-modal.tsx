"use client";
import type { UseFormReturn } from "react-hook-form";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type UpdateModalProps = {
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	form: UseFormReturn<any>;
	dialogProps: Parameters<typeof Dialog>[0];
	disabled: boolean;
	title: string;
};

/**
 *
 * @param children FormFields
 */
export default function UpdateModal({
	onSubmit,
	dialogProps,
	form,
	disabled,
	children,
	title,
}: React.PropsWithChildren<UpdateModalProps>) {
	return (
		<Dialog {...dialogProps}>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-auto sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className='space-y-8'>
						{children}
						<DialogFooter>
							<Button type='submit' variant='success' disabled={disabled}>
								{disabled ? "Guardando..." : "Guardar"}
							</Button>
							<Button
								variant='destructive'
								type='button'
								onClick={() => dialogProps.onOpenChange?.(false)}
								disabled={disabled}
							>
								Cancelar
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
