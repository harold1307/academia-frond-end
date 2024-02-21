"use client";
import { useMutation } from "@tanstack/react-query";
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
import { type PeriodoLectivoFromAPI } from "@/core/api/periodos-lectivos";
import { ROUTES } from "@/core/routes";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { cn } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { periodoParams } from "../addPeriodo";
import { columns } from "./columns";
import { DataTable } from "./data-table";

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

	const PeriodoClass = z.object({
		nombre: z.string(),
		inicio: z.coerce.date(),
		fin: z.coerce.date(),
		tipo: z.string(),
		limiteMatriculaOrdinaria: z.null().nullable(),
		limiteMatriculaExtraordinaria: z.null().nullable(),
		limiteMatriculaEspecial: z.null().nullable(),
		automatriculaAlumnosFechaExtraordinaria: z.null().nullable(),
		estudianteSeleccionaParaleloAutomatricula: z.null().nullable(),
		seImpartioNivelacion: z.boolean(),
		planificacionCargaHoraria: z.boolean(),
		planificacionProfesoresFormaTotal: z.null().nullable(),
		aprobacionPlanificacionProfesores: z.null().nullable(),
		legalizacionAutomaticaContraPagos: z.null().nullable(),
		numeroSecuencia: z.null().nullable(),
		corteId: z.null().nullable(),
		cronogramaNotasCoordinacion: z.boolean(),
		puedenAutomatricularseSegundasOMasMatriculas: z.boolean(),
		puedenMatricularseArrastre: z.boolean(),
		numeroMatriculaAutomatico: z.null().nullable(),
		numeroMatricularAlLegalizar: z.null().nullable(),
	});

	type Data = z.infer<typeof PeriodoClass>;

	const {
		mutation: { mutate, isPending },
		open,
		setOpen,
		form,
	} = useMutateModule({
		mutationFn: async ({ data, id }) => {
			return API.periodos.update({ data, id });
		},
		onError: console.error,
		onSuccess: response => {
			router.replace(ROUTES.periodo.path);
			router.refresh();
		},
	});

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
						{fields.map(f => (
							<FormField
								control={form.control}
								name={f.name}
								defaultValue={selectedPeriodo[f.name]}
								key={f.name}
								disabled={isPending}
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
																	defaultValue={field.value as string}
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
																	defaultValue={field.value}
																	className='w-full'
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{f.options.map(o => (
																<SelectItem value={o} key={o}>
																	{o}
																</SelectItem>
															))}
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
															defaultValue={field.value as string}
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
															defaultValue={field.value as string}
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
															defaultChecked={field.value as boolean}
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
															defaultValue={field.value as string}
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

function Costos(props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createPeriodoSchema: z.ZodType = z.object({
		data: z.string(),
		id: z.string(),
	});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }) => {
			return API.periodos.costos(data, id);
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
		() => searchParams.get(periodoParams.costos),
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
					<DialogTitle>Editar tipo de calculo</DialogTitle>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => onSubmit(data))}
							className='space-y-8'
						>
							{fieldsCostos.map(f => (
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
		name: "limiteMatriculaOrdinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula ordinaria",
	},
	{
		name: "limiteMatriculaExtraordinaria",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula extraordinaria",
	},
	{
		name: "limiteMatriculaEspecial",
		inputType: "custom-date",
		placeholder: "",
		label: "Limite matricula especial",
	},
	{
		name: "automatriculaAlumnosFechaExtraordinaria",
		inputType: "toggle",
		placeholder: "",
		label: "Automatricula de alumnos fecha extraordinaria",
	},
	{
		name: "tipo",
		inputType: "custom-select",
		options: ["GRADO", "POSGRADO"],
		placeholder: "",
		label: "Tipo de periodo",
	},
	{
		name: "corte",
		inputType: "custom-select",
		options: ["SI"],
		label: "Fecha de Matriculas",
	},
	{
		name: "seImpartioNivelacion:",
		inputType: "toggle",
		label: "Se impartio nivelacion",
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
		name: "automatriculaAlumnosFechaExtraordinaria:",
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
		label: "# Matricula",
	},
	{
		name: "numeroSecuencia",
		inputType: "toggle",
		label: "Secuencia",
	},
	{
		name: "numeroMatriculaAutomatico",
		inputType: "toggle",
		label: "# matricula automatica",
	},
	{
		name: "numeroMatricularAlLegalizar",
		inputType: "toggle",
		label: "# matricula al legalizar",
	},
];

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
		name: "tipoCalculo",
		inputType: "custom-select",
		placeholder: "-----------",
		options: [
			"COSTO POR NIVEL Y MATERIAS",
			"COSTO POR PLAN CUOTA",
			"COSTO FIJO POR NIVEL Y NO POR MATERIA",
		],
		label: "Tipo càlculo costo",
	},
	{
		name: "costosPorSesion",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Costos por sesion",
	},
];
