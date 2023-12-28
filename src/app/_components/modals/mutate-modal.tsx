"use client";
import type { UseFormReturn } from "react-hook-form";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type MutateModalProps =
	| {
			onSubmit: React.FormEventHandler<HTMLFormElement>;
			form: UseFormReturn<any>;
			dialogProps: Parameters<typeof Dialog>[0];
			disabled: boolean;
			title: string;
			withTrigger?: false;
			triggerLabel?: undefined;
	  }
	| {
			onSubmit: React.FormEventHandler<HTMLFormElement>;
			form: UseFormReturn<any>;
			dialogProps: Parameters<typeof Dialog>[0];
			disabled: boolean;
			title: string;
			withTrigger: true;
			triggerLabel: string | React.ReactNode;
	  };

/**
 *
 * @param children FormFields
 */
export default function MutateModal({
	onSubmit,
	dialogProps,
	form,
	disabled,
	children,
	title,
	triggerLabel,
	withTrigger,
}: React.PropsWithChildren<MutateModalProps>) {
	return (
		<Dialog {...dialogProps}>
			{withTrigger && (
				<DialogTrigger asChild>
					<Button variant='success'>{triggerLabel}</Button>
				</DialogTrigger>
			)}
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
