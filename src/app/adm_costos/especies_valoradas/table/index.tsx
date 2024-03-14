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
import { useQuery } from "@tanstack/react-query";
import { especiesParams } from "../addEspecies";

export default function EspeciesTable({ especies }: { especies: any }) {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={especies} />
			<UpdateEspeciesTableModal especies={especies} />
		</section>
	);
}

function UpdateEspeciesTableModal(props: { especies: any }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const {
		mutation: { mutate, isPending },
		form,
	} = useMutateModule({
		mutationFn: async () => {
			return API.admCostos.update({ data, id });
		},
		onError: console.error,
		onSuccess: response => {
			router.replace(ROUTES.admCostos.especies());
			router.refresh();
		},
	});

	const formValues = form.watch();

	const paramEspeciesId = React.useMemo(
		() => searchParams.get(especiesParams.update),
		[searchParams],
	);

	if (!paramEspeciesId) return null;

	const selectedEspecie = props.especies.find(i => i.id == paramEspeciesId);
	console.log(selectedEspecie, paramEspeciesId);
	if (!selectedEspecie) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.admCostos.especies())}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isPending) return;
				if (!open) {
					router.replace(ROUTES.admCostos.especies());
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Actualizar periodo</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(data =>
							mutate({ data, id: paramEspeciesId }),
						)}
						className='space-y-8'
					>
						{fields.map(f => {
							return (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									defaultValue={selectedEspecie[f.name]}
									shouldUnregister={true}
									render={({ field }) => {
										switch (f.inputType) {
											case "custom-select": {
												let options = f.options;

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
																{options?.length
																	? options.map(o =>
																			typeof o === "string" ? (
																				<SelectItem value={o} key={o}>
																					{o}
																				</SelectItem>
																			) : (
																				<SelectItem
																					value={o.value}
																					key={o.value}
																				>
																					{o.label}
																				</SelectItem>
																			),
																		)
																	: "No hay resultados"}
															</SelectContent>
														</Select>
													</FormItem>
												);
											}
											case "custom-toggle": {
												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<FormControl>
															<ToggleSwitch
																checked={field.value as boolean}
																defaultChecked={field.value as boolean}
																defaultValue={field.value as string}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
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
																defaultValue={field.value as string}
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
							);
						})}
						<DialogFooter>
							<Button disabled={isPending} type='submit' variant='success'>
								Guardar
							</Button>
							<Button
								disabled={isPending}
								variant='destructive'
								type='button'
								onClick={() => router.replace(ROUTES.admCostos.especies())}
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

const fields = [
	{
		name: "nombre",
		inputType: "text",
		placeholder: "",
		label: "Nombre",
	},
	{
		name: "iva",
		inputType: "custom-select",
		options: ["------"],
		label: "IVA",
	},
	{
		name: "reporte",
		inputType: "custom-select",
		options: ["------"],
		label: "Reporte",
	},
	{
		name: "visible",
		inputType: "custom-toggle",
		label: "Visible para estudiantes",
	},
	{
		name: "vinculado",
		inputType: "custom-toggle",
		label: "Vinculado a materia",
	},
	{
		name: "descripcion",
		inputType: "custom-toggle",
		label: "Requiere descripción",
	},
];