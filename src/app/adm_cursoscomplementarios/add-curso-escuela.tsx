"use client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
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
import type { CreateCursoEscuela } from "@/core/api/curso-escuelas";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { cn } from "@/utils";
import type { Field } from "@/utils/forms";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";
import MutateModal from "../_components/modals/mutate-modal";
import { Button } from "../_components/ui/button";
import { Calendar } from "../_components/ui/calendar";
import { Input } from "../_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../_components/ui/popover";
import { Textarea } from "../_components/ui/textarea";
import { useAppContext } from "../app-context";
import { PARALELO_KEYS } from "../institucion/datos-academicos/paralelos/query-keys";
import { SESIONES_KEYS } from "../institucion/datos-academicos/sesiones/query-keys";

export const cursosEscuelaParams = {
	update: "actualizarCursoEscuela",
	deactivate: "desactivarCursoEscuela",
	delete: "eliminarCursoEscuela",
} as const;

const schema = z.object<
	ZodInferSchema<
		ReplaceNullableToOptional<
			Omit<CreateCursoEscuela, "plantillaId" | "periodoId"> & {
				"dummy-especificaRangoEdad": boolean;
				"dummy-sinLimiteCupo": boolean;
			}
		>
	>
>({
	nombre: z.string(),
	codigo: z.string().optional(),
	tema: z.string(),
	observaciones: z.string().optional(),
	departamento: z.string().optional(),
	fechaInicio: z.string(),
	fechaFin: z.string(),
	fechaLimiteRegistro: z.string(),
	diasLimitePago: z.number(),
	cupos: z.number().optional(),
	evaluaProfesor: z.boolean(),
	matriculaConDeuda: z.boolean(),
	legalizarMatriculas: z.boolean(),
	registroExterno: z.boolean(),
	registroInterno: z.boolean(),
	verificaSesion: z.boolean(),
	registroDesdeOtraSede: z.boolean(),
	edadMinima: z.number().optional(),
	edadMaxima: z.number().optional(),
	costoPorMateria: z.boolean(),
	cumpleRequisitosMalla: z.boolean(),
	pasarRecord: z.boolean(),

	paraleloId: z.string().uuid(),
	sesionId: z.string().uuid(),

	"dummy-especificaRangoEdad": z.boolean(),
	"dummy-sinLimiteCupo": z.boolean(),
});

export default function AddCursoEscuela() {
	const router = useRouter();
	const { selectedPeriodoId } = useAppContext();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: ({
			codigo,
			observaciones,
			departamento,
			cupos,
			edadMinima,
			edadMaxima,
			...data
		}) => {
			if (!selectedPeriodoId) {
				throw new Error("No hay un periodo lectivo seleccionado");
			}

			return API.cursoEscuelas.create({
				...data,
				codigo: codigo ?? null,
				observaciones: observaciones ?? null,
				departamento: departamento ?? null,
				cupos: cupos ?? null,
				edadMinima: edadMinima ?? null,
				edadMaxima: edadMaxima ?? null,
				periodoId: selectedPeriodoId,
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		hookFormProps: {
			defaultValues: {
				evaluaProfesor: false,
				matriculaConDeuda: false,
				legalizarMatriculas: false,
				registroExterno: false,
				registroInterno: false,
				verificaSesion: false,
				registroDesdeOtraSede: false,
				costoPorMateria: false,
				cumpleRequisitosMalla: false,
				pasarRecord: false,
				"dummy-especificaRangoEdad": false,
				"dummy-sinLimiteCupo": false,

				diasLimitePago: 0,
				cupos: 0,
				edadMinima: 0,
				edadMaxima: 0,
			},
		},
	});

	const {
		data: paralelos,
		refetch: fetchParalelos,
		isLoading: paralelosAreLoading,
	} = useQuery({
		queryKey: PARALELO_KEYS.lists(),
		queryFn: () => API.paralelos.getMany(),
		enabled: false,
	});

	const {
		data: sesiones,
		refetch: fetchSesiones,
		isLoading: sesionesAreLoading,
	} = useQuery({
		queryKey: SESIONES_KEYS.lists(),
		queryFn: () => API.sesiones.getMany(),
		enabled: false,
	});

	const formValues = form.watch();

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
				title='Adicionar curso'
				withTrigger
				triggerLabel='Agregar'
			>
				{fields.map(f => {
					if (f.dependsOn) {
						if (
							f.dependsOn === "dummy-especificaRangoEdad" &&
							!formValues[f.dependsOn]
						)
							return null;

						if (
							f.dependsOn === "dummy-sinLimiteCupo" &&
							formValues[f.dependsOn]
						)
							return null;
					}

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
																	format(field.value as unknown as Date, "PPP")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className='w-auto p-0' align='start'>
														<Calendar
															mode='single'
															selected={field.value as unknown as Date}
															onSelect={date =>
																field.onChange(date?.toISOString())
															}
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

										switch (f.name) {
											case "paraleloId": {
												options = paralelos?.data.map(m => ({
													label: m.nombre,
													value: m.id,
												}));

												loading = paralelosAreLoading;
												break;
											}
											case "sesionId": {
												options = sesiones?.data.map(t => ({
													label: t.nombre,
													value: t.id,
												}));

												loading = sesionesAreLoading;
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
														if (f.name === "paraleloId" && !paralelos) {
															fetchParalelos();
														}
														if (f.name === "sesionId" && !sesiones) {
															fetchSesiones();
														}
													}}
												>
													<FormControl>
														<SelectTrigger className='col-span-9'>
															<SelectValue className='w-full' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{loading
															? "Cargando opciones..."
															: options?.length
																? options.map(o =>
																		typeof o === "string" ? (
																			<SelectItem value={o} key={o}>
																				{o}
																			</SelectItem>
																		) : (
																			<SelectItem value={o.value} key={o.value}>
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
																onChange={e => field.onChange(e.target.checked)}
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

export const fields = [
	{ name: "nombre", inputType: "text", label: "Nombre" },
	{ name: "codigo", inputType: "text", label: "Codigo" },
	{
		name: "paraleloId",
		inputType: "custom-select",
		options: "custom",
		label: "Paralelo",
	},
	{
		name: "sesionId",
		inputType: "custom-select",
		options: "custom",
		label: "Sesion",
	},
	{ name: "tema", inputType: "custom-text-area", label: "Tema" },
	{
		name: "observaciones",
		inputType: "custom-text-area",
		label: "Observaciones",
	},
	{ name: "departamento", inputType: "text", label: "Departamento" },
	{ name: "fechaInicio", inputType: "custom-date", label: "Fecha inicio" },
	{ name: "fechaFin", inputType: "custom-date", label: "Fecha fin" },
	{
		name: "fechaLimiteRegistro",
		inputType: "custom-date",
		label: "Fecha limite registro",
	},
	{
		name: "evaluaProfesor",
		inputType: "checkbox",
		label: "Se evalua al profesor",
	},
	{
		name: "registroExterno",
		inputType: "checkbox",
		label: "Permite registro externo",
	},
	{
		name: "registroInterno",
		inputType: "checkbox",
		label: "Permite registro interno",
	},
	{
		name: "registroDesdeOtraSede",
		inputType: "checkbox",
		label: "Permite desde otra sede",
	},
	{ name: "verificaSesion", inputType: "checkbox", label: "Verifica sesion" },
	{
		name: "dummy-sinLimiteCupo",
		inputType: "checkbox",
		label: "Sin limite cupo",
	},
	{
		name: "cupos",
		inputType: "number",
		label: "Cupos",
		dependsOn: "dummy-sinLimiteCupo",
	},
	{
		name: "dummy-especificaRangoEdad",
		inputType: "checkbox",
		label: "Especifica rango de edad",
	},
	{
		name: "edadMinima",
		inputType: "number",
		label: "Edad minima",
		dependsOn: "dummy-especificaRangoEdad",
	},
	{
		name: "edadMaxima",
		inputType: "number",
		label: "Edad maxima",
		dependsOn: "dummy-especificaRangoEdad",
	},
	{
		name: "matriculaConDeuda",
		inputType: "checkbox",
		label: "Matricula con deuda",
	},
	{
		name: "costoPorMateria",
		inputType: "checkbox",
		label: "Costo por materia",
	},
	{
		name: "legalizarMatriculas",
		inputType: "checkbox",
		label: "Legalizar matriculas",
	},
	{
		name: "diasLimitePago",
		inputType: "number",
		label: "Dias vencimiento matricula",
	},
	{
		name: "cumpleRequisitosMalla",
		inputType: "checkbox",
		label: "Cumple requisitos malla",
	},
	{ name: "pasarRecord", inputType: "checkbox", label: "Pasar al record" },
] satisfies Field<keyof z.infer<typeof schema>>[];
