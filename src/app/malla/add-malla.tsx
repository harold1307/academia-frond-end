"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modalidad, TipoDuracion, type MallaCurricular } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { Button } from "../_components/ui/button";
import { Calendar } from "../_components/ui/calendar";
import { Checkbox } from "../_components/ui/checkbox";
import { Input } from "../_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../_components/ui/popover";
import { Textarea } from "../_components/ui/textarea";

export const mallaParams = {
	update: "actualizarMalla",
};

type CreateMallaCurricularInput = Omit<
	MallaCurricular,
	| "id"
	| "createdAt"
	| "registroPracticasDesde"
	| "registroVinculacionDesde"
	| "registroProyectosDesde"
> & {
	registroPracticasDesde: (typeof NIVELES_PREFIXES)[number];
	registroVinculacionDesde: (typeof NIVELES_PREFIXES)[number];
	registroProyectosDesde: (typeof NIVELES_PREFIXES)[number];
};

type CreateMallaCurricularOutput = Omit<
	MallaCurricular,
	"id" | "createdAt" | "fechaAprobacion" | "fechaLimiteVigencia"
> & {
	fechaAprobacion: string;
	fechaLimiteVigencia: string;
};

const createMallaSchema: z.ZodType<
	CreateMallaCurricularOutput,
	z.ZodTypeDef,
	CreateMallaCurricularInput
> = z.object({
	modalidad: z.nativeEnum(Modalidad),
	tituloObtenido: z.string(),
	tipoDuracion: z.nativeEnum(TipoDuracion),
	fechaAprobacion: z.date().transform(date => date.toISOString()),
	fechaLimiteVigencia: z.date().transform(date => date.toISOString()),
	niveles: z.number(),
	maximoMateriasMatricula: z.number(),
	cantidadLibreOpcionEgreso: z.number(),
	cantidadOptativasEgreso: z.number(),
	cantidadArrastres: z.number(),
	practicasLigadasMaterias: z.boolean(),
	horasPractica: z.number(),
	registroPracticasDesde: z
		.enum(NIVELES_PREFIXES)
		.transform(v => NIVELES_PREFIXES.findIndex(i => i === v) + 1),
	horasVinculacion: z.number(),
	registroVinculacionDesde: z
		.enum(NIVELES_PREFIXES)
		.transform(v => NIVELES_PREFIXES.findIndex(i => i === v) + 1),
	registroProyectosDesde: z
		.enum(NIVELES_PREFIXES)
		.transform(v => NIVELES_PREFIXES.findIndex(i => i === v) + 1),
	usaNivelacion: z.boolean(),
	plantillasSilabo: z.boolean(),
	perfilEgreso: z.string(),
	observaciones: z.string(),
});

export default function AddMalla() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async (data: CreateMallaCurricularOutput) => {
			return API.mallas.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			setOpen(false);
			router.refresh();
		},
	});

	const form = useForm<CreateMallaCurricularOutput>({
		resolver: zodResolver(createMallaSchema),
		defaultValues: {
			practicasLigadasMaterias: false,
			plantillasSilabo: false,
			usaNivelacion: false,
			perfilEgreso: "",
			observaciones: "",
		},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Adicionar malla</h1>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='success'>Adicionar</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar malla</DialogTitle>
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
									key={
										f.name.includes("Desde")
											? f.name + form.watch().niveles
											: f.name
									}
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
												const options =
													f.options === "niveles"
														? NIVELES_PREFIXES.slice(
																0,
																form.getValues().niveles,
															).map(
																v =>
																	({
																		value: v,
																		label: `${v} NIVEL`,
																	}) satisfies {
																		label: string;
																		value: string;
																	},
															)
														: f.options;

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
																{options.map(o =>
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
				</DialogContent>
			</Dialog>
		</section>
	);
}

const fields = [
	{
		name: "modalidad",
		inputType: "custom-select",
		options: Object.keys(Modalidad),
		placeholder: "------------",
		label: "Modalidad",
	},
	{ name: "tituloObtenido", inputType: "text", label: "Titulo obtenido" },
	{
		name: "tipoDuracion",
		inputType: "custom-select",
		placeholder: "------------",
		options: Object.keys(TipoDuracion),
		label: "Tipo duracion",
	},
	{
		name: "fechaAprobacion",
		inputType: "custom-date",
		label: "Fecha de aprobacion",
	},
	{
		name: "fechaLimiteVigencia",
		inputType: "custom-date",
		label: "Fecha de limite de vigencia",
	},
	{ name: "niveles", inputType: "number", label: "Niveles de la malla" },
	{
		name: "maximoMateriasMatricula",
		inputType: "number",
		label: "Maximo de materias en matricula",
	},
	{
		name: "cantidadLibreOpcionEgreso",
		inputType: "number",
		label: "Cantidad de libre opcion para egresar",
	},
	{
		name: "cantidadOptativasEgreso",
		inputType: "number",
		label: "Cantidad de optativas para egresar",
	},
	{
		name: "cantidadArrastres",
		inputType: "number",
		label: "Cantidad de arrastres",
	},
	{
		name: "practicasLigadasMaterias",
		inputType: "checkbox",
		label: "Practicas ligadas a materias",
	},
	{ name: "horasPractica", inputType: "number", label: "Horas practica" },
	{
		name: "registroPracticasDesde",
		inputType: "custom-select",
		placeholder: "------------",
		options: "niveles",
		label: "Registro de practicas desde",
	},
	{ name: "horasVinculacion", inputType: "number", label: "Horas vinculacion" },
	{
		name: "registroVinculacionDesde",
		inputType: "custom-select",
		placeholder: "------------",
		options: "niveles",
		label: "Registro de vinculacion desde",
	},
	{
		name: "registroProyectosDesde",
		inputType: "custom-select",
		placeholder: "------------",
		options: "niveles",
		label: "Registro de proyectos desde",
	},
	{ name: "usaNivelacion", inputType: "checkbox", label: "Usa nivelacion" },
	{
		name: "plantillasSilabo",
		inputType: "checkbox",
		label: "Plantillas de silabo",
	},
	{
		name: "perfilEgreso",
		inputType: "custom-text-area",
		label: "Perfil de egreso",
	},
	{
		name: "observaciones",
		inputType: "custom-text-area",
		label: "Observaciones",
	},
] satisfies Field<keyof CreateMallaCurricularInput>[];
