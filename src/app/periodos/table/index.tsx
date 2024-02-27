"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ModalFallback from "@/app/_components/modals/modal-fallback";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import {
	type CreatePeriodoLectivo,
	type UpdateCalculoCosto,
	type PeriodoLectivoFromAPI,
} from "@/core/api/periodos-lectivos";
import { ROUTES } from "@/core/routes";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { cn } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { periodoParams } from "../addPeriodo";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
	type ReplaceNullableToOptional,
	type ZodInferSchema,
} from "@/utils/types";
import { type Field } from "@/utils/forms";

const schema = z.object<
	ZodInferSchema<
		ReplaceNullableToOptional<
			CreatePeriodoLectivo & {
				"dummy-fechaEnMatriculas": boolean;
				"dummy-estructuraParalelos": boolean;
				"dummy-planificacionProfesoresObligatoria": boolean;
				"dummy-legalizarMatriculas": boolean;
				"dummy-numeroMatricula": boolean;
				"dummy-numeroSecuencia": boolean;
			}
		>
	>
>({
	nombre: z.string(),
	inicio: z.string().datetime(),
	fin: z.string().datetime(),
	tipo: z.enum(["GRADO", "POSGRADO"] as const),
	limiteMatriculaOrdinaria: z.string().datetime().optional(),
	limiteMatriculaExtraordinaria: z.string().datetime().optional(),
	limiteMatriculaEspecial: z.string().datetime().optional(),
	automatriculaAlumnosFechaExtraordinaria: z.boolean().optional(),
	estudianteSeleccionaParaleloAutomatricula: z.boolean().optional(),
	seImpartioNivelacion: z.boolean(),
	planificacionCargaHoraria: z.boolean(),
	planificacionProfesoresFormaTotal: z.boolean().optional(),
	aprobacionPlanificacionProfesores: z.boolean().optional(),
	legalizacionAutomaticaContraPagos: z.boolean().optional(),
	numeroSecuencia: z.number().optional(),
	corteId: z.string().uuid().optional(),
	cronogramaNotasCoordinacion: z.boolean(),
	puedenAutomatricularseSegundasOMasMatriculas: z.boolean(),
	puedenMatricularseArrastre: z.boolean(),
	numeroMatriculaAutomatico: z.boolean().optional(),
	numeroMatricularAlLegalizar: z.boolean().optional(),

	"dummy-fechaEnMatriculas": z.boolean(),
	"dummy-estructuraParalelos": z.boolean(),
	"dummy-planificacionProfesoresObligatoria": z.boolean(),
	"dummy-legalizarMatriculas": z.boolean(),
	"dummy-numeroMatricula": z.boolean(),
	"dummy-numeroSecuencia": z.boolean(),
});

const schemaCosto = z.object<
	ZodInferSchema<
		UpdateCalculoCosto & {
			costoPorSesion?: boolean | undefined | null;
			estudiantesEligenOpcionPago?: boolean | undefined | null;
			cronogramaFechasOpcionPago?: boolean | undefined | null;
			planCostos?: boolean | undefined;
			"dummy-opcionesDePago": boolean;
		}
	>
>({
	tipo: z
		.enum(["COSTO_POR_PLAN_CUOTA", "COSTO_POR_NIVEL_Y_MATERIAS"] as const)
		.optional(),
	costoPorSesion: z.boolean().nullable().optional(),
	estudiantesEligenOpcionPago: z.boolean().nullable().optional(),
	cronogramaFechasOpcionPago: z.boolean().nullable().optional(),
	planCostos: z.boolean().optional(),

	"dummy-opcionesDePago": z.boolean(),
});

export default function PeriodosLectivosTables({
	periodos,
}: {
	periodos: PeriodoLectivoFromAPI[];
}) {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={periodos} />
			<UpdatePeriodoTableModal periodos={periodos} />
			<TiposActividades periodos={periodos} />
			<Costos periodos={periodos} />
			<HabilitarMatricula periodos={periodos} />
			<ImportarPlanificaciones periodos={periodos} />
			<ActualizarCalificaciones periodos={periodos} />
		</section>
	);
}

function UpdatePeriodoTableModal(props: { periodos: PeriodoLectivoFromAPI[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const {
		mutation: { mutate, isPending },
		form,
	} = useMutateModule({
		mutationFn: async ({ data, id }: { data: any; id: string }) => {
			return API.periodos.update({ data, id });
		},
		onError: console.error,
		onSuccess: response => {
			router.replace(ROUTES.periodo.path);
			router.refresh();
		},
	});

	const {
		data: cortes,
		isLoading: cortesAreLoading,
		refetch: fetchCortes,
	} = useQuery({
		queryKey: ["cortes"],
		queryFn: () => {
			return API.cortes.getMany();
		},
		enabled: false,
	});
	const formValues = form.watch();

	const paramPeriodoId = React.useMemo(
		() => searchParams.get(periodoParams.update),
		[searchParams],
	);

	if (!paramPeriodoId) return null;

	const selectedPeriodo = props.periodos.find(i => i.id === paramPeriodoId);

	if (!selectedPeriodo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.path)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isPending) return;
				if (!open) {
					router.replace(ROUTES.periodo.path);
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
							mutate({ data, id: paramPeriodoId }),
						)}
						className='space-y-8'
					>
						{fields.map(f => {
							if (f.dependsOn && !formValues[f.dependsOn]) {
								return null;
							}

							return (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									defaultValue={selectedPeriodo[f.name]}
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
																		defaultValue={field.value}
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
													| string[]
													| undefined
													| { value: string; label: string }[] =
													f.name === "tipo" ? f.options : undefined;
												let loading: boolean | undefined = undefined;

												if (f.name === "corteId") {
													options = cortes?.data.map(c => ({
														value: c.id,
														label: c.nombre,
													}));

													loading = cortesAreLoading;
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
																if (f.name === "corteId" && !cortes) {
																	fetchCortes();
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
								onClick={() => router.replace(ROUTES.periodo.path)}
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

function TiposActividades(props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createPeriodoSchema: z.ZodType = z.object({
		data: z.string(),
		id: z.string(),
	});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }) => {
			return API.periodos.actividadesHabilitadas(data, id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.replace(ROUTES.periodo.path);
			router.refresh();
		},
	});

	const form = useForm({
		resolver: zodResolver(createPeriodoSchema),
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	const paramPeriodoId = React.useMemo(
		() => searchParams.get(periodoParams.actividades),
		[searchParams],
	);

	if (!paramPeriodoId) return null;

	const selectedPeriodo = props.periodos.find(i => i.id === paramPeriodoId);

	if (!selectedPeriodo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.path)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isSubmitting) return;
				if (!open) {
					router.replace(ROUTES.periodo.path);
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Adicionar actividades</DialogTitle>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => onSubmit(data))}
							className='space-y-8'
						>
							{fieldsActs.map(f => (
								<FormField
									control={form.control}
									name={f.name}
									key={
										f.name.includes("Desde") ? f.name + form.watch() : f.name
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
																	disabled={(date: any) =>
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
									onClick={() => router.replace(ROUTES.periodo.path)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

function Costos(props: { periodos: PeriodoLectivoFromAPI[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const {
		mutation: { mutate, isPending },
		form,
		open,
		setOpen,
	} = useMutateModule({
		mutationFn: async ({
			periodoLectivoId,
			tipo,
			costoPorSesion,
			cronogramaFechasOpcionPago,
			estudiantesEligenOpcionPago,
			...data
		}) => {
			return API.periodos.updateCalculoCosto({
				tipo,
				costoPorSesion: costoPorSesion || null,
				cronogramaFechasOpcionPago: data["dummy-opcionesDePago"]
					? cronogramaFechasOpcionPago ?? false
					: null,
				estudiantesEligenOpcionPago: data["dummy-opcionesDePago"]
					? estudiantesEligenOpcionPago ?? false
					: null,
				periodoLectivoId,
				...data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.replace(ROUTES.periodo.path);
			router.refresh();
		},
	});

	const paramPeriodoId = React.useMemo(
		() => searchParams.get(periodoParams.costos),
		[searchParams],
	);
	const formValues = form.watch();

	if (!paramPeriodoId) return null;

	const selectedPeriodo = props.periodos.find(i => i.id === paramPeriodoId);

	if (!selectedPeriodo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.path)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isPending) return;
				if (!open) {
					router.replace(ROUTES.periodo.path);
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Editar tipo de calculo</DialogTitle>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data =>
								mutate({ data, periodoLectivoId: paramPeriodoId }),
							)}
							className='space-y-8'
						>
							{fieldsCostos.map(f => {
								if (formValues.tipo === "COSTO_POR_PLAN_CUOTA") {
									if (f.dependsOn && f.name !== "estudiantesEligenOpcionPago") {
										return null;
									}
								}
								if (formValues.tipo === "COSTO_POR_NIVEL_Y_MATERIAS") {
									if (
										f.dependsOn === "dummy-opcionesDePago" &&
										!formValues[f.dependsOn] &&
										f.name !== "costoPorSesion"
									) {
										return null;
									}
									if (
										f.dependsOn === "dummy-opcionesDePago" &&
										formValues[f.dependsOn] &&
										f.name === "costoPorSesion"
									) {
										return null;
									}
									if (
										f.dependsOn === "costoPorSesion" &&
										formValues[f.dependsOn] &&
										f.name === "dummy-opcionesDePago"
									) {
										return null;
									}
								}
								if (formValues.tipo === "COSTO_FIJO_POR_NIVEL_Y_NO_MATERIAS") {
									if (f.dependsOn) {
										return null;
									}
								}
								return (
									<FormField
										control={form.control}
										name={f.name}
										defaultValue={selectedPeriodo.calculoCosto[f.name]}
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
																				{o.split("_").join(" ")}
																			</SelectItem>
																		) : (
																			<SelectItem value={o} key={o}>
																				{o}
																			</SelectItem>
																		),
																	)}
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
									onClick={() => router.replace(ROUTES.periodo.path)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

function HabilitarMatricula(props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createPeriodoSchema: z.ZodType = z.object({
		data: z.string(),
		id: z.string(),
	});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }) => {
			return API.periodos.habilitar(data, id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.replace(ROUTES.periodo.path);
			router.refresh();
		},
	});

	const form = useForm({
		resolver: zodResolver(createPeriodoSchema),
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	const paramPeriodoId = React.useMemo(
		() => searchParams.get(periodoParams.habilitar),
		[searchParams],
	);

	if (!paramPeriodoId) return null;

	const selectedPeriodo = props.periodos.find(i => i.id === paramPeriodoId);

	if (!selectedPeriodo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.path)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isSubmitting) return;
				if (!open) {
					router.replace(ROUTES.periodo.path);
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Habilitar matricula</DialogTitle>
					<DialogDescription>
						Esta seguro(a) que desea habilitar matriculas en el periodo{" "}
						{props.periodos.nombreTipoCorte}
					</DialogDescription>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => onSubmit(data))}
							className='space-y-8'
						>
							<DialogFooter>
								<Button disabled={isSubmitting} type='submit' variant='success'>
									Guardar
								</Button>
								<Button
									disabled={isSubmitting}
									variant='destructive'
									type='button'
									onClick={() => router.replace(ROUTES.periodo.path)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

function ImportarPlanificaciones(props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createPeriodoSchema: z.ZodType = z.object({
		data: z.string(),
		id: z.string(),
	});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }) => {
			return API.periodos.habilitar(data, id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.replace(ROUTES.periodo.path);
			router.refresh();
		},
	});

	const form = useForm({
		resolver: zodResolver(createPeriodoSchema),
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	const paramPeriodoId = React.useMemo(
		() => searchParams.get(periodoParams.importar),
		[searchParams],
	);

	if (!paramPeriodoId) return null;

	const selectedPeriodo = props.periodos.find(i => i.id === paramPeriodoId);

	if (!selectedPeriodo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.path)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isSubmitting) return;
				if (!open) {
					router.replace(ROUTES.periodo.path);
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Importar planificaciones</DialogTitle>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => onSubmit(data))}
							className='space-y-8'
						>
							<FormField
								render={f => {
									return (
										<FormItem>
											{/* <FormLabel className='col-span-3 text-end'>
												Seleccione archivo
											</FormLabel> */}
											<FormInputFile />
										</FormItem>
									);
								}}
								name='file'
							/>
							<DialogFooter>
								<Button disabled={isSubmitting} type='submit' variant='success'>
									Guardar
								</Button>
								<Button
									disabled={isSubmitting}
									variant='destructive'
									type='button'
									onClick={() => router.replace(ROUTES.periodo.path)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

function ActualizarCalificaciones(props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createPeriodoSchema: z.ZodType = z.object({
		data: z.string(),
		id: z.string(),
	});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }) => {
			return API.periodos.actualizar(data, id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.replace(ROUTES.periodo.path);
			router.refresh();
		},
	});

	const form = useForm({
		resolver: zodResolver(createPeriodoSchema),
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	const paramPeriodoId = React.useMemo(
		() => searchParams.get(periodoParams.actualizarCalif),
		[searchParams],
	);

	if (!paramPeriodoId) return null;

	const selectedPeriodo = props.periodos.find(i => i.id === paramPeriodoId);

	if (!selectedPeriodo) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.path)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isSubmitting) return;
				if (!open) {
					router.replace(ROUTES.periodo.path);
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Actualizar calificaciones</DialogTitle>
					<DialogDescription>
						Esta seguro(a) que desea actualizar calificaciones en el record
						academico de los matriculados del periodo
						{props.periodos.nombreTipoCorte}
					</DialogDescription>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => onSubmit(data))}
							className='space-y-8'
						>
							<DialogFooter>
								<Button disabled={isSubmitting} type='submit' variant='success'>
									Guardar
								</Button>
								<Button
									disabled={isSubmitting}
									variant='destructive'
									type='button'
									onClick={() => router.replace(ROUTES.periodo.path)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogHeader>
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
	{ name: "inicio", inputType: "custom-date", label: "Inicio" },
	{ name: "fin", inputType: "custom-date", label: "Fin" },
	{
		name: "dummy-fechaEnMatriculas",
		inputType: "custom-toggle",
		label: "Usa fecha en matriculas",
	},
	{
		name: "limiteMatriculaOrdinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula ordinaria",
		dependsOn: "dummy-fechaEnMatriculas",
	},
	{
		name: "limiteMatriculaExtraordinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula extraordinaria",
		dependsOn: "dummy-fechaEnMatriculas",
	},
	{
		name: "limiteMatriculaEspecial",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula especial",
		dependsOn: "dummy-fechaEnMatriculas",
	},
	{
		name: "tipo",
		inputType: "custom-select",
		options: ["GRADO", "POSGRADO"],
		label: "Tipo de periodo",
	},
	{
		name: "corteId",
		inputType: "custom-select",
		options: "custom",
		label: "Corte",
	},
	{
		name: "dummy-estructuraParalelos",
		inputType: "custom-toggle",
		label: "Estructura de paralelos agrupados por nivel",
	},
	{
		name: "estudianteSeleccionaParaleloAutomatricula",
		inputType: "custom-toggle",
		label: "Estudiante seleccione paralelo en automatricula",
		dependsOn: "dummy-estructuraParalelos",
	},
	{
		name: "seImpartioNivelacion",
		inputType: "custom-toggle",
		label: "Se impartio nivelacion",
	},
	{
		name: "planificacionCargaHoraria",
		inputType: "custom-toggle",
		placeholder: "",
		label: "Planificacion carga horaria",
	},
	{
		name: "dummy-planificacionProfesoresObligatoria",
		inputType: "custom-toggle",
		label: "Planificacion de profesores obligatoria",
	},
	{
		name: "planificacionProfesoresFormaTotal",
		inputType: "custom-toggle",
		label: "Planificacion de profesores de forma total",
	},
	{
		name: "aprobacionPlanificacionProfesores",
		inputType: "custom-toggle",
		label: "Aprobacion de planificacion de profesores",
	},
	{
		name: "cronogramaNotasCoordinacion",
		inputType: "custom-toggle",
		label: "Cronograma por coordinacion",
	},
	{
		name: "dummy-legalizarMatriculas",
		inputType: "custom-toggle",
		label: "Legalizar Matricula",
	},
	{
		name: "legalizacionAutomaticaContraPagos",
		inputType: "custom-toggle",
		label: "Legalizaciòn por pago",
		dependsOn: "dummy-legalizarMatriculas",
	},
	{
		name: "automatriculaAlumnosFechaExtraordinaria",
		inputType: "custom-toggle",
		label: "Automat. extraordinaria",
	},
	{
		name: "puedenMatricularseArrastre",
		inputType: "custom-toggle",
		label: "Automat. con arrastre",
	},
	{
		name: "puedenAutomatricularseSegundasOMasMatriculas",
		inputType: "custom-toggle",
		label: "Automat. 2das matriculas",
	},
	{
		name: "dummy-numeroMatricula",
		inputType: "custom-toggle",
		label: "Numero de Matricula",
	},
	{
		name: "dummy-numeroSecuencia",
		inputType: "custom-toggle",
		label: "Secuencia desde numero especifico",
	},
	{
		name: "numeroSecuencia",
		inputType: "number",
		label: "Numero secuencia",
		dependsOn: "dummy-numeroSecuencia",
	},
	{
		name: "numeroMatriculaAutomatico",
		inputType: "custom-toggle",
		label: "Numero de matricula automatica",
	},
	{
		name: "numeroMatricularAlLegalizar",
		inputType: "custom-toggle",
		label: "Numero de matricula al legalizar",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];

const fieldsActs = [
	{
		name: "actividadesDoc",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Actividades de docencia",
	},
	{
		name: "actividadesInv",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Actividades de investigacion",
	},
	{
		name: "actividadesGestion",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Actividades de gestion",
	},
	{
		name: "actividadesComu",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Actividades de practicas comunitarias",
	},
	{
		name: "actividadesPre",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Actividades de practicas preprofesionales",
	},
	{
		name: "otrasActs",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Otras actividades",
	},
];

const fieldsCostos = [
	{
		name: "tipo",
		inputType: "custom-select",
		placeholder: "-----------",
		options: [
			"COSTO_POR_NIVEL_Y_MATERIAS",
			"COSTO_POR_PLAN_CUOTA",
			"COSTO_FIJO_POR_NIVEL_Y_NO_MATERIAS",
		],
		label: "Tipo càlculo costo",
	},
	{
		name: "costoPorSesion",
		inputType: "custom-toggle",
		label: "Costos por sesion",
		dependsOn: "dummy-opcionesDePago",
	},
	{
		name: "dummy-opcionesDePago",
		inputType: "custom-toggle",
		label: "Opciones de pago",
		dependsOn: "costoPorSesion",
	},
	{
		name: "estudiantesEligenOpcionPago",
		inputType: "custom-toggle",
		label: "Estudiantes eligen opciones de pago",
		dependsOn: "dummy-opcionesDePago",
	},
	{
		name: "cronogramaFechasOpcionPago",
		inputType: "custom-toggle",
		label: "Cronograma de fechas en opciones de pago",
		dependsOn: "dummy-opcionesDePago",
	},
] satisfies Field<keyof z.infer<typeof schemaCosto>>[];
