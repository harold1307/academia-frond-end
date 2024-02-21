"use client";
import { format, formatISO, parseISO } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import React from "react";
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
import { ToggleSwitch } from "../_components/ui/toggle";
import { type ZodInferSchema } from "@/utils/types";
import { type CreatePeriodoLectivo } from "@/core/api/periodos-lectivos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { assertReferenceInput } from "@/utils/forms";

export const periodoParams = {
	add: "agregarPeriodo",
	update: "actualizarPeriodo",
	actividades: "actividadesHabilitadas",
	costos: "formatoCostos",
	habilitar: "habilitarMatricula",
	importar: "importarPlanificacion",
	actualizarCalif: "actualizarCalificaciones",
	subPeriodos: "actualizarSubperiodos",
} as const;

const defaultValues = {
	aprobacionPlanificacionProfesores: false,
	automatriculaAlumnosFechaExtraordinaria: false,
	cronogramaNotasCoordinacion: false,
	legalizacionAutomaticaContraPagos: false,
	legalizarMatriculas: false,
	limiteMatriculaEspecial: null,
	limiteMatriculaExtraordinaria: null,
	limiteMatriculaOrdinaria: null,
	numeroMatricula: false,
	numeroMatriculaAutomatico: false,
	numeroMatricularAlLegalizar: false,
	numeroSecuencia: null,
	corteId: null,
	estudianteSeleccionaParaleloAutomatricula: false,
	planificacionCargaHoraria: false,
	planificacionProfesoresFormaTotal: false,
	planificacionProfesoresObligatoria: false,
	puedenAutomatricularseSegundasOMasMatriculas: false,
	puedenMatricularseArrastre: false,
	seImpartioNivelacion: false,
};

const schema = z.object<ZodInferSchema<CreatePeriodoLectivo>>({
	nombre: z.string(),
	inicio: z.string().datetime(),
	fin: z.string().datetime(),
	tipo: z.enum(["GRADO", "POSGRADO"] as const),
	limiteMatriculaOrdinaria: z.string().datetime().nullable(),
	limiteMatriculaExtraordinaria: z.string().datetime().nullable(),
	limiteMatriculaEspecial: z.string().datetime().nullable(),
	automatriculaAlumnosFechaExtraordinaria: z.boolean().nullable(),
	estudianteSeleccionaParaleloAutomatricula: z.boolean().nullable(),
	seImpartioNivelacion: z.boolean(),
	planificacionCargaHoraria: z.boolean(),
	planificacionProfesoresFormaTotal: z.boolean().nullable(),
	aprobacionPlanificacionProfesores: z.boolean().nullable(),
	legalizacionAutomaticaContraPagos: z.boolean().nullable(),
	numeroSecuencia: z.number().nullable(),
	corteId: z.string().uuid().nullable(),
	cronogramaNotasCoordinacion: z.boolean(),
	puedenAutomatricularseSegundasOMasMatriculas: z.boolean(),
	puedenMatricularseArrastre: z.boolean(),
	numeroMatriculaAutomatico: z.boolean().nullable(),
	numeroMatricularAlLegalizar: z.boolean().nullable(),
});

export default function AddPeriodo() {
	const router = useRouter();
	const [depend, setDepend] = React.useState(false);
	const {
		mutation: { mutate, isPending },
		form,
		open,
		setOpen,
	} = useMutateModule({
		mutationFn: async data => {
			return API.periodos.create(data);
		},
		schema,
		hookFormProps: {
			defaultValues: defaultValues,
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	const { ...formValues } = form.watch();

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Periodos lectivos</h1>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button className='flex flex-row items-center gap-2 rounded-md border border-slate-400 p-2 hover:bg-slate-200 hover:text-slate-800'>
						<PlusCircle /> Agregar
					</button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar periodo</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => mutate(data))}
							className='space-y-8'
						>
							{fields.map(f => {
								return (
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
	{ name: "inicio", inputType: "custom-date", label: "Inicio" },
	{ name: "fin", inputType: "custom-date", label: "Fin" },
	{
		name: "reference-fechaEnMatriculas",
		inputType: "toggle",
		label: "Usa fecha en matriculas",
	},
	{
		name: "limiteMatriculaOrdinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula ordinaria",
		dependsOn: "reference-fechaEnMatriculas",
	},
	{
		name: "limiteMatriculaExtraordinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula extraordinaria",
		dependsOn: "reference-fechaEnMatriculas",
	},
	{
		name: "limiteMatriculaEspecial",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula especial",
		dependsOn: "reference-fechaEnMatriculas",
	},
	{
		name: "tipo",
		inputType: "custom-select",
		options: ["GRADO", "POSGRADO"],
		placeholder: "",
		label: "Tipo de periodo",
	},
	{
		name: "corteId",
		inputType: "custom-select",
		options: ["-------"],
		label: "Corte",
	},
	{
		name: "estructuraParalelos",
		inputType: "toggle",
		label: "Estructura de paralelos agrupados por nivel",
	},
	{
		name: "estudianteSeleccionaParaleloAutomatricula",
		inputType: "toggle",
		label: "Estudiante seleccione paralelo en automatricula",
	},
	{
		name: "seImpartioNivelacion",
		inputType: "toggle",
		label: "Se impartio nivelacion",
	},
	{
		name: "planificacionCargaHoraria",
		inputType: "toggle",
		placeholder: "",
		label: "Planificacion carga horaria",
	},
	{
		name: "planificacionProfesoresObligatoria",
		inputType: "toggle",
		label: "Planificacion de profesores obligatoria",
	},
	{
		name: "planificacionProfesoresFormaTotal",
		inputType: "toggle",
		label: "Planificacion de profesores de forma total",
	},
	{
		name: "aprobacionPlanificacionProfesores",
		inputType: "toggle",
		label: "Aprobacion de planificacion de profesores",
	},
	{
		name: "cronogramaNotasCoordinacion",
		inputType: "toggle",
		label: "Cronograma por coordinacion",
	},
	{
		name: "legalizarMatriculas",
		inputType: "toggle",
		label: "Legalizar Matricula",
	},
	{
		name: "legalizacionAutomaticaContraPagos",
		inputType: "toggle",
		label: "Legalizaciòn por pago",
	},
	{
		name: "automatriculaAlumnosFechaExtraordinaria",
		inputType: "toggle",
		label: "Automat. extraordinaria",
	},
	{
		name: "puedenMatricularseArrastre",
		inputType: "toggle",
		label: "Automat. con arrastre",
	},
	{
		name: "puedenAutomatricularseSegundasOMasMatriculas",
		inputType: "toggle",
		label: "Automat. 2das matriculas",
	},
	{
		name: "numeroMatricula",
		inputType: "toggle",
		label: "Numero de Matricula",
	},
	{
		name: "reference-numeroSecuencia",
		inputType: "toggle",
		label: "Secuencia desde numero especifico",
	},
	{
		name: "numeroSecuencia",
		inputType: "number",
		label: "Numero secuencia",
	},
	{
		name: "numeroMatriculaAutomatico",
		inputType: "toggle",
		label: "Numero de matricula automatica",
	},
	{
		name: "numeroMatricularAlLegalizar",
		inputType: "toggle",
		label: "Numero de matricula al legalizar",
	},
];
