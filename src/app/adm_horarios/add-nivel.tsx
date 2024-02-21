"use client";
import { useRouter } from "next/navigation";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { API } from "@/core/api-client";
import type { AreaConocimientoClass } from "@/core/api/areas-conocimiento";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";
import { NivelAcademico } from "@prisma/client";
import { CreateNivelAcademico } from "@/core/api/niveles-academicos";
import { Textarea } from "../_components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../_components/ui/popover";
import { Button } from "../_components/ui/button";
import { cn } from "@/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../_components/ui/calendar";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { MALLA_KEYS } from "../malla/query-keys";

const schema = z.object<
	ZodInferSchema<
		Omit<
			CreateNivelAcademico,
			| "id"
			| "profesores"
			| "horarios"
			| "cuposMaterias"
			| "planificacionProfesores"
			| "matriculacion"
			| "estado"
			| "createdAt"
			| "updatedAt"
			>
		& { 
			mallaId: string | null,
			nivelId: string | null,
			modeloEvaluativoId: string | null,
			procesoPostMatricula: string | null,
			paraleloId: string| null,
			nombre: string | null,
			practicasComunitarias: boolean & {
				horas?: number | null
			} | null
			practicasProfesionales: boolean & {
				horas?: number | null
			} | null
			}
		>>({
			id: z.string(),
			nombre: z.string().nullable(),
			estado: z.boolean(),
			horarios: z.boolean(),
			matriculacion: z.boolean(),
			profesores: z.boolean(),
			planificacionProfesores: z.boolean(),
			cuposMaterias: z.boolean(),
			fechaInicio: z.string().datetime(),
			fechaFin: z.string().datetime(),
			inicioAgregaciones: z.string().datetime(),
			limiteAgregaciones: z.string().datetime(),
			validaRequisitosMalla: z.boolean(),
			validaCumplimientoMaterias: z.boolean(),
			horasMinimasPracticasComunitarias: z.number().nullable(),
			horasMinimasPracticasPreprofesionales: z.number().nullable(),
			estudiantesPuedenSeleccionarMaterias: z.boolean(),
			estudiantesPuedenSeleccionarMateriasOtrosHorarios: z.boolean(),
			estudiantesPuedenSeleccionarMateriasOtrasModalidades: z.boolean(),
			estudiantesRegistranProyectosIntegradores: z.boolean(),
			redireccionAPagos: z.boolean(),
			limiteOrdinaria: z.string().datetime(),
			limiteExtraordinaria: z.string().datetime(),
			limiteEspecial: z.string().datetime(),
			diasVencimientoMatricula: z.number(),
			capacidad: z.number().int().min(0),
			mensaje: z.string().nullable(),
			terminosCondiciones: z.string().nullable(),

			paraleloId: z.string(),
			modeloEvaluativoId: z.string().uuid(),
			sesionId: z.string().uuid(),
			nivelMallaId: z.string().uuid(),
});


export default function AddNivelAcademico() {
	const router = useRouter();
	
	const {
		data: mallas,
		isLoading: mallasAreLoading,
		refetch: fetchMallas,
	} = useQuery({
		queryKey: MALLA_KEYS.list(""),
		queryFn: async () => {
			return API.mallasCurriculares.getMany();
		},
		enabled: false,
	});
	
	const {
		data: modalidades,
		isLoading: modalidadesAreLoading,
		refetch: fetchModalidades,
	} = useQuery({
		queryKey: ["modalidades"],
		queryFn: async () => {
			return API.modalidades.getMany();
		},
		enabled: false,
	});
	
	const {
		data: paralelos,
		isLoading: paralelosAreLoading,
		refetch: fetchParalelos,
	} = useQuery({
		queryKey: ["Paralelos"],
		queryFn: async () => {
			return API.paralelos.getMany()
		},
		enabled: false
	})

	const { form, mutation, open, setOpen } = useMutateModule({
		//schema,
		mutationFn: async data => {
			return API.nivelesAcademicos.createMaterias({
				...data
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });

			router.refresh();
		},
		hookFormProps: {
			defaultValues : {
				estudiantesPuedenSeleccionarMaterias: false,
				estudiantesPuedenSeleccionarMateriasOtrosHorarios: false,
				estudiantesPuedenSeleccionarMateriasOtrasModalidades: false,
				estudiantesRegistranProyectosIntegradores: false,
				redireccionAPagos: false
			}
		}
	});

	return (
		<section>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar Nivel Académico'
				withTrigger
				triggerLabel='Adicionar'
			>
				{fields.map(f => {
					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={mutation.isPending}
							shouldUnregister={true}
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
										// 	options = NIVELES_PREFIXES.slice(0, niveles).map(
										// 		(v, idx) =>
										// 			({
										// 				value: `${idx + 1}`,
										// 				label: `${v} NIVEL`,
										// 			}) satisfies {
										// 				label: string;
										// 				value: string;
										// 			},
										// 	);
										} else if (f.options === "custom") {
											switch (f.name) {
												case "mallaId": {
													options = mallas?.data.map(m => ({
														label: m.codigo,
														value: m.id,
													}));

													loading = mallasAreLoading;
													break;
												}
												case "modalidadId": {
													options = modalidades?.data.map(m => ({
														label: m.nombre,
														value: m.id,
													}));

													loading = modalidadesAreLoading;
													break;
												}
												case "paraleloId": {
													options = paralelos?.data.map(t => ({
														label: t.nombre,
														value: t.id,
													}));

													loading = paralelosAreLoading;
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
														if (
															f.name === "mallaId" &&
															!mallas
														) {
															fetchMallas();
														}
														if (
															f.name === "modalidadId" &&
															!modalidades
														) {
															fetchModalidades();
														}
														if (
															f.name === "paraleloId" &&
															!paralelos
														) {
															fetchParalelos();
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
																? options.map(o =>
																		typeof o === "string" ? (
																			<SelectItem 
																				value={o} 
																				key={o}>
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
											<FormField
												control={form.control}
												name={f.name}
												key={f.name}
												disabled={mutation.isPending}
												shouldUnregister={true}
												render={({ field }) => (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={undefined}
																onChange={e =>
																	field.onChange(e.target.checked)
																}
																checked={field.value as boolean}
																type={f.inputType}
																className='col-span-9'
															/>
														</FormControl>
													</FormItem>
												)}
											/>
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
			</MutateModal>
		</section>
	);
}



const fields = [
	{
		name: "mallaId",
		inputType: "custom-select",
		label: "Malla",
		options: "custom",
		placeholder: "------------",
	},
	{
		name: "nivelId",
		inputType: "custom-select",
		label: "Nivel",
		options: "custom",
		placeholder: "------------",
	},
	{
		name: "modalidadId",
		inputType: "custom-select",
		label: "Modalidad",
		options: "custom",
		placeholder: "------------",
	},
	{
		name: "sesionId",
		inputType: "custom-select",
		label: "Sesión",
		options: "custom",
		placeholder: "------------",
	},
	{
		name: "paraleloId",
		inputType: "custom-select",
		label: "Paralelo",
		options: "custom",
		placeholder: "------------",
	},
	{
		name: "nombre",
		inputType: "string",
		label: "Nombre",
	},
	{
		name: "fechaInicio",
		inputType: "custom-date",
		label: "Fecha de inicio",
	},
	{
		name: "fechaFin",
		inputType: "custom-date",
		label: "Fecha de fin",
	},
	{
		name: "inicioAgregaciones",
		inputType: "custom-date",
		label: "Fecha Agregaciones",
	},
	{
		name: "limiteAgregaciones",
		inputType: "custom-date",
		label: "Limite Agregaciones",
	},
	{
		name: "inicioAgregaciones",
		inputType: "custom-date",
		label: "Fecha de Agregaciones",
	},
	{
		name: "validaRequisitosMalla",
		inputType: "boolean",
		label: "Valida requisitos malla",
	},
	{
		name: "inicioAgregaciones",
		inputType: "custom-date",
		label: "Fecha de Agregaciones",
	},
	//AGREGAR practicas profesionales y comunitarias
	{
		name: "estudiantesPuedenSeleccionarMaterias",
		inputType: "checkbox",
		label: "Estudiantes pueden seleccionar materias",
	},
	{
		name: "estudiantesPuedenSeleccionarMateriasOtrosHorarios",
		inputType: "checkbox",
		label: "Estudiantes pueden seleccionar materias otros horarios",
	},
	{
		name: "estudiantesPuedenSeleccionarMateriasOtrasModalidades",
		inputType: "checkbox",
		label: "Estudiantes pueden seleccionar materias otras modalidades",
	},
	{
		name: "estudiantesRegistranProyectosIntegradores",
		inputType: "checkbox",
		label: "Estudiantes registran proyectos integradores",
	},
	{
		name: "redireccionAPagos",
		inputType: "checkbox",
		label: "Redirección a Pagos",
	},
	{
		name: "limiteOrdinaria",
		inputType: "custom-date",
		label: "Limite ordinaria",
	},
	{
		name: "limiteExtraordinaria",
		inputType: "custom-date",
		label: "Limite extraordinaria",
	},
	{
		name: "limiteEspecial",
		inputType: "custom-date",
		label: "Limite especial",
	},
	{
		name: "diasVencimientoMatricula",
		inputType: "number",
		label: "Días vencimiento matrícula",
	},
	{
		name: "capacidad",
		inputType: "number",
		label: "Capacidad",
		placeholder: 0
	},
	{
		name: "diasVencimientoMatricula",
		inputType: "number",
		label: "Días vencimiento matrícula",
		placeholder: 0
	},
	{
		name: "mensaje",
		inputType: "string",
		label: "Mensaje",
	},
	{
		name: "terminosCondiciones",
		inputType: "string",
		label: "Terminos y Condiciones",
	},
	
	
	
	
	
	
	
	
	
]