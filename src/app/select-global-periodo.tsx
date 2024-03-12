"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import React from "react";
import { Button } from "./_components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "./_components/ui/form";
import StatusIcon from "./_components/ui/icons/connect-status";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./_components/ui/select";
import { useAppContext } from "./app-context";

const schema = z.object({
	periodoId: z.string(),
});

export default function SelectGlobalPeriodo() {
	const [open, setOpen] = React.useState(false);
	const { selectPeriodo, periodos, selectedPeriodoId, selectedPeriodo } =
		useAppContext();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	});

	return (
		<Dialog open={open} onOpenChange={o => setOpen(o)}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					size={"lg"}
					className='shadow-default flex w-52 flex-row items-center gap-2 rounded-lg border border-slate-300 p-2'
				>
					<StatusIcon className='w-6' />
					{selectedPeriodo ? selectedPeriodo.nombre : "-----------------"}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-h-[80%] max-w-max overflow-y-auto sm:max-w-[425px] md:max-w-5xl'>
				<DialogHeader>
					<DialogTitle>Cambio de periodo</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(data => {
							selectPeriodo(data.periodoId);
							setOpen(false);
						})}
						className='space-y-8'
					>
						<FormField
							control={form.control}
							name={"periodoId"}
							render={({ field }) => (
								<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
									<FormLabel className='col-span-3 text-end'>Periodo</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={selectedPeriodoId as string}
										disabled={field.disabled}
									>
										<FormControl>
											<SelectTrigger className='col-span-9'>
												<SelectValue className='w-full' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{!periodos
												? "Cargando opciones..."
												: periodos.length
													? periodos.map(o => (
															<SelectItem value={o.id} key={o.id}>
																{o.nombre}
															</SelectItem>
														))
													: "No hay resultados"}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type='submit'
								variant='success'
								disabled={form.formState.disabled}
							>
								{form.formState.disabled ? "Guardando..." : "Guardar"}
							</Button>
							<Button
								variant='destructive'
								type='button'
								onClick={() => setOpen(false)}
								disabled={form.formState.disabled}
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
