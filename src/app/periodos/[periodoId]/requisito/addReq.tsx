"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoDuracion, type MallaCurricular } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { API } from "@/core/api-client";
import { cn } from "@/utils";
import { NIVELES_PREFIXES, type Field } from "@/utils/forms";
import { useRouter } from "next/navigation";
import { Button } from "../../../_components/ui/button";
import { Calendar } from "../../../_components/ui/calendar";
import { Checkbox } from "../../../_components/ui/checkbox";
import { Input } from "../../../_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../_components/ui/popover";
import { Textarea } from "../../../_components/ui/textarea";
import { ToggleSwitch } from "@/app/_components/ui/toggle";
import { useMutateModule } from "@/hooks/use-mutate-module";

export const reqParams = {
	add: "agregarCorte",
	update: "actualizarCorte",
} as const;

const createReqSchema: z.ZodType<z.ZodTypeDef> = z.object({});

export default function AddReq() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);

	const {
		form,
		mutation: { mutate, isPending },
	} = useMutateModule({
		mutationFn: async data => {
			return API.periodos.createRequisitoMatriculacion(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			setOpen(false);
			router.refresh();
		},
	});

	const {
		data: programas,
		isLoading: programasAreLoading,
		refetch: fetchProgramas,
	} = useQuery({
		queryKey: ["cortes"],
		queryFn: () => {
			return API.programas.getMany();
		},
		enabled: false,
	});

	const {
		data: sede,
		isLoading: sedesAreLoading,
		refetch: fetchSedes,
	} = useQuery({
		queryKey: ["sedes"],
		queryFn: () => {
			return API.sedes.getMany();
		},
		enabled: false,
	});

	const {
		data: modalidad,
		isLoading: modalidadAreLoading,
		refetch: fetchModalidad,
	} = useQuery({
		queryKey: ["modalidad"],
		queryFn: () => {
			return API.modalidades.getMany();
		},
		enabled: false,
	});

	const { niveles } = form.watch();

	return (
		<section className='my-4'>
			<h1 className='my-2 text-2xl font-semibold'>
				Requisitos de Matriculacion
			</h1>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button className='flex flex-row items-center gap-2 rounded-md border border-slate-400 p-2 hover:bg-slate-200 hover:text-slate-800'>
						<PlusCircle /> Agregar
					</button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar requisito de matriculación</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => mutate(data))}
							className='space-y-8'
						>
							{fields.map(f => (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									render={({ field }) => {
										switch (f.inputType) {
											case "custom-date": {
												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={"outline"}
																		className={cn(
																			"col-span-9 w-[240px] pl-3 text-left font-normal",
																			!field.value && "text-muted-foreground",
																		)}
																		disabled={field.disabled}
																	>
																		{field.value ? (
																			format(
																				field.value as unknown as Date,
																				"PPP",
																			)
																		) : (
																			<span>Pick a date</span>
																		)}
																		<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className='w-auto p-0'
																align='start'
															>
																<Calendar
																	mode='single'
																	selected={field.value as unknown as Date}
																	onSelect={field.onChange}
																	disabled={date =>
																		date < new Date() || !!field.disabled
																	}
																	initialFocus
																/>
															</PopoverContent>
														</Popover>
													</FormItem>
												);
											}
											case "custom-select": {
												let options:
													| { label: string; value: string }[]
													| string[]
													| undefined = Array.isArray(f.options)
													? f.options
													: undefined;

												let loading;

												if (f.options === "niveles") {
													options = NIVELES_PREFIXES.slice(0, niveles).map(
														(v, idx) =>
															({
																value: `${idx + 1}`,
																label: `${v} NIVEL`,
															}) satisfies {
																label: string;
																value: string;
															},
													);
												} else if (f.options === "custom") {
													switch (f.name) {
														case "modalidad": {
															options = modalidad?.data.map(m => ({
																label: m.nombre,
																value: m.id,
															}));

															loading = modalidadAreLoading;
															break;
														}
														case "programa": {
															options = programas?.data.map(p => ({
																label: p.nombre,
																value: p.id,
															}));

															loading = programasAreLoading;
														}
														case "sede": {
															options = sede?.data.map(s => ({
																label: s.nombre,
																value: s.id,
															}));

															loading = sedesAreLoading;
														}
													}
												}
												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value as string}
															disabled={field.disabled}
															onOpenChange={() => {
																if (f.name === "modalidad" && !modalidad) {
																	fetchModalidad();
																}
																if (f.name === "programa" && !programas) {
																	fetchProgramas();
																}
																if (f.name === "sede" && !sede) {
																	fetchSedes();
																}
															}}
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
																{loading
																	? "Cargando opciones..."
																	: options?.length
																		? options?.map(o =>
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
											case "custom-text-area": {
												return (
													<FormItem className='grid grid-cols-12 items-start gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<FormControl>
															<Textarea
																className='col-span-9 resize-none'
																{...field}
																value={field.value as string}
															/>
														</FormControl>
													</FormItem>
												);
											}
											case "checkbox": {
												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<FormControl>
															<Checkbox
																checked={field.value as boolean}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
													</FormItem>
												);
											}
											case "toggle": {
												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<FormControl>
															<ToggleSwitch
																checked={field.value as boolean}
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
		name: "tipoDocumento",
		inputType: "text",
		placeholder: "",
		label: "Tipo documento",
	},
	{
		name: "nombre",
		inputType: "text",
		placeholder: "",
		label: "Nombre",
	},
	{
		name: "sede",
		inputType: "custom-select",
		options: "custom",
		label: "Sede",
	},
	{
		name: "programa",
		inputType: "custom-select",
		options: "custom",
		label: "Programa",
	},
	{
		name: "modalidad",
		inputType: "custom-select",
		options: "custom",
		label: "Modalidad",
	},
	{
		name: "niveles",
		inputType: "custom-select",
		options: "niveles",
		label: "Nivel",
	},
	{
		name: "obligatorio",
		inputType: "toggle",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Obligatorio",
	},
	{
		name: "transferenciaIES",
		inputType: "toggle",
		label: "Transferencia a otra IES",
	},
	{
		name: "primeraMatricula",
		inputType: "toggle",
		label: "Primera Matriculas",
	},
	{
		name: "repite",
		inputType: "toggle",
		label: "Repiten materias",
	},
	{
		name: "descripcion",
		inputType: "textarea",
		label: "Descripcion",
	},
	{
		name: "file",
		inputType: "file",
		label: "Seleccione archivo",
	},
];
