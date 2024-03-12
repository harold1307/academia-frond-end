"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import React from "react";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { Button } from "@/app/_components/ui/button";
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
import { FormInputFile } from "@/app/_components/ui/form-input-file";
import { Input } from "@/app/_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { ToggleSwitch } from "@/app/_components/ui/toggle";
import { API } from "@/core/api-client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useRouter, useSearchParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { ROUTES } from "@/core/routes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function ProgramaFechasTable({ programa }: { programa: any }) {
	return (
		<section className='my-2 w-2/4'>
			<AddCreditos />
			<DataTable columns={columns} data={programa} />
		</section>
	);
}


function AddCreditos() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async data => {
			return API.periodos.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			setOpen(false);
			router.refresh();
		},
	});

	const form = useForm({
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	return (
		<section>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button className='flex flex-row items-center gap-2 rounded-md border border-slate-400 p-2 hover:bg-slate-200 hover:text-slate-800'>
						<PlusCircle /> Agregar
					</button>
				</DialogTrigger>
				{/* <DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar descuento</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => onSubmit(data))}
							className='space-y-8'
						>
							{fields.map(f => (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									render={({ field }) => {
										switch (f.inputType) {
											case "custom-select": {
												const options = f.options;

												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value as string}
															disabled={field.disabled}
														>
															<FormControl>
																<SelectTrigger className='col-span-9'>
																	<SelectValue
																		placeholder={f.placeholder}
																		className='w-full'
																	/>
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{options?.map(o =>
																	typeof o === "string" ? (
																		<SelectItem value={o} key={o}>
																			{o}
																		</SelectItem>
																	) : (
																		<SelectItem value={o.value} key={o.value}>
																			{o.label}
																		</SelectItem>
																	),
																)}
															</SelectContent>
														</Select>
													</FormItem>
												);
											}
											default: {
												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={
																	typeof field.value === "boolean"
																		? undefined
																		: field.value || undefined
																}
																onChange={e =>
																	f.inputType === "number"
																		? field.onChange(+e.target.value)
																		: field.onChange(e.target.value)
																}
																type={f.inputType}
																placeholder={f.placeholder}
																className='col-span-9'
															/>
														</FormControl>
													</FormItem>
												);
											}
										}
									}}
								/>
							))}
							<DialogFooter>
								<Button disabled={isSubmitting} type='submit' variant='success'>
									Guardar
								</Button>
								<Button
									disabled={isSubmitting}
									variant='destructive'
									type='button'
									onClick={() => setOpen(false)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent> */}
			</Dialog>
		</section>
	);
}

const fields = [
	{
		name: "tipo",
		inputType: "custom-select",
		options: ["------"],
		label: "Tipo de matricula",
	},
	{
		name: "porcentaje",
		inputType: "number",
		label: "Porcentaje",
	},
	{
		name: "valor",
		inputType: "number",
		label: "Valor",
	},
];
