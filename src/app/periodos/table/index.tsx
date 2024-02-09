"use client";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { MUPeriodos } from "@/utils/mockupData";
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
import { Input } from "@/app/_components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/_components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/core/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Textarea } from "@/app/_components/ui/textarea";
import { z } from "zod";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { ROUTES } from "@/core/routes";
import { periodoParams } from "../addPeriodo";
import { cn } from "@/utils";
import { format } from "date-fns";
import { Calendar, CalendarIcon } from "lucide-react";
import { FormInputFile } from "@/app/_components/ui/form-input-file";
import { ToggleSwitch } from "@/app/_components/ui/toggle";

export default function PeriodosLectivosTables() {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={MUPeriodos} />
			<UpdatePeriodoTableModal periodos={MUPeriodos} />
			<TiposActividades periodos={MUPeriodos} />
			<Costos periodos={MUPeriodos} />
			<HabilitarMatricula periodos={MUPeriodos} />
			<ImportarPlanificaciones periodos={MUPeriodos} />
			<ActualizarCalificaciones periodos={MUPeriodos} />
		</section>
	);
}

function UpdatePeriodoTableModal(props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createPeriodoSchema: z.ZodType = z.object({
		data: z.string(),
		id: z.string(),
	});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }) => {
			return API.periodos.update({ periodos: { data, id } });
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
				if (isSubmitting) return;
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
						onSubmit={form.handleSubmit(data => onSubmit(data))}
						className='space-y-8'
					>
						{fields.map(f => (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name.includes("Desde") ? f.name + form.watch() : f.name}
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
													<ToggleSwitch
														value={(f.options === "SI").toString()}
													/>
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
		name: "Nombre",
		inputType: "text",
		placeholder: "",
		label: "Nombre",
	},
	{ name: "Inicio", inputType: "custom-date", label: "Inicio" },
	{ name: "Fin", inputType: "custom-date", label: "Fin" },
	{
		name: "inscritos",
		inputType: "number",
		placeholder: "",
		label: "Inscritos",
	},
	{
		name: "Materias",
		inputType: "number",
		placeholder: "",
		label: "Materias",
	},
	{
		name: "Matriculas",
		inputType: "number",
		placeholder: "",
		label: "Matriculas",
	},
	{
		name: "fechaMatriculas",
		inputType: "toggle",
		options: "SI",
		label: "Fecha de Matriculas",
	},
	{
		name: "matriculacion",
		inputType: "toggle",
		options: "SI",
		label: "Matriculaciòn",
	},
	{
		name: "estrucuraNivel",
		inputType: "toggle",
		options: "SI",
		label: "Estructura por nivel",
	},
	{
		name: "nivelacion",
		inputType: "toggle",
		options: "SI",
		label: "Nivelaciòn",
	},
	{
		name: "legalizarMatricula",
		inputType: "toggle",
		options: "SI",
		label: "Legalizar Matricula",
	},
	{
		name: "legalizacionPago",
		inputType: "toggle",
		options: "SI",
		label: "Legalizaciòn por pago",
	},
	{
		name: "cerrado",
		inputType: "toggle",
		options: "SI",
		label: "Cerrado",
	},
	{
		name: "vigente",
		inputType: "toggle",
		options: "SI",
		label: "Vigente",
	},
	{
		name: "planifCargaHoraria",
		inputType: "toggle",
		options: "SI",
		label: "Planif. carga horaria",
	},
	{
		name: "planifProfObl",
		inputType: "toggle",
		options: "SI",
		label: "Planif. profesores obl.",
	},
	{
		name: "planifProfTotal",
		inputType: "toggle",
		options: "SI",
		label: "Planif. profesores total",
	},
	{
		name: "AprobPlanif",
		inputType: "toggle",
		options: "SI",
		label: "Aprob. Planificaciòn",
	},
	{
		name: "NotasCoord",
		inputType: "toggle",
		options: "SI",
		label: "Notas por coordinaciòn",
	},
	{
		name: "AutoExtraordinaria",
		inputType: "toggle",
		options: "SI",
		label: "Automat. extraordinaria",
	},
	{
		name: "AutoArrastre",
		inputType: "toggle",
		options: "SI",
		label: "Automat. con arrastre",
	},
	{
		name: "AutoSecMatriculas",
		inputType: "toggle",
		options: "SI",
		label: "Automat. 2das matriculas",
	},
	{
		name: "matricula",
		inputType: "toggle",
		options: "SI",
		label: "# Matricula",
	},
	{
		name: "AutoMatriculas",
		inputType: "toggle",
		options: "SI",
		label: "# matricula automatica",
	},
	{
		name: "matriculaLegal",
		inputType: "toggle",
		options: "SI",
		label: "# matricula al legalizar",
	},
	{
		name: "Secuencia",
		inputType: "toggle",
		options: "SI",
		label: "Secuencia",
	},
	{
		name: "EvaluacionDocente",
		inputType: "toggle",
		options: "SI",
		label: "Evaluaciòn al docente",
	},
	{
		name: "CostoSeccion",
		inputType: "toggle",
		options: "SI",
		label: "Costos por sesiòn",
	},
	{
		name: "PlanCostos",
		inputType: "toggle",
		options: "SI",
		label: "Plan de costos",
	},
	{
		name: "Activo",
		inputType: "toggle",
		options: "SI",
		label: "Activo",
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
