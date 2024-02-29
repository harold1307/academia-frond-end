"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import React from "react";
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { API } from "@/core/api-client";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { useMutateModule } from "@/hooks/use-mutate-module";

export const cortesParams = {
	add: "agregarCorte",
	update: "actualizarCorte",
	delete: "eliminarCorte",
} as const;

const createCortesSchema = z.object({
	nombre: z.string(),
});

export default function AddCortes() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);

	const {
		mutation: { mutate, isPending },
	} = useMutateModule({
		mutationFn: async data => {
			return API.cortes.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			setOpen(false);
			router.refresh();
		},
	});

	const form = useForm({
		resolver: zodResolver(createCortesSchema),
		defaultValues: {},
		disabled: isPending,
		shouldUnregister: true,
	});

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Cortes</h1>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button className='flex flex-row items-center gap-2 rounded-md border border-slate-400 p-2 hover:bg-slate-200 hover:text-slate-800'>
						<PlusCircle /> Agregar
					</button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar cortes</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => mutate(data))}
							className='space-y-8'
						>
							<FormField
								control={form.control}
								name='nombre'
								key={"nombre"}
								render={({ field }) => {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												Nombre
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													value={
														typeof field.value === "boolean"
															? undefined
															: field.value || undefined
													}
													onChange={e => field.onChange(e.target.value)}
													type={"text"}
													placeholder={"Ingrese nombre de corte"}
													className='col-span-9'
												/>
											</FormControl>
										</FormItem>
									);
								}}
							/>
							<DialogFooter>
								<Button disabled={isPending} type='submit' variant='success'>
									Guardar
								</Button>
								<Button
									disabled={isPending}
									variant='destructive'
									type='button'
									onClick={() => setOpen(false)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</section>
	);
}

const fields = [
	{
		name: "nombre",
		inputType: "text",
		placeholder: "",
		label: "Nombre",
	},
	{
		name: "inscritos",
		inputType: "number",
		placeholder: "",
		label: "Inscritos",
	},
	{ name: "matriculas", inputType: "number", label: "Matriculas" },
];
