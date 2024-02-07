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
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/_components/ui/popover";
import { PlusCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/core/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Textarea } from "@/app/_components/ui/textarea";
import { z } from "zod";
import { MallaCurricular } from "@prisma/client";

export default function PeriodosLectivosTables() {
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Periodos lectivos</h1>
			<DataTable columns={columns} data={MUPeriodos} />
			<UpdatePeriodoTableModal periodos={MUPeriodos} />
		</section>
	);
}

function UpdatePeriodoTableModal(props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const [open, setOpen] = React.useState(false);

	type CreatePeriodoInput = Omit<
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

	type CreatePeriodoOutput = Omit<
		MallaCurricular,
		"id" | "createdAt" | "fechaAprobacion" | "fechaLimiteVigencia"
	> & {
		fechaAprobacion: string;
		fechaLimiteVigencia: string;
	};

	const createPeriodoSchema: z.ZodType = z.object({
		data: z.string(),
		id: z.string(),
	});

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async (data: createPeriodoSchema) => {
			return API.periodos.update({ periodos: data, id });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			setOpen(false);
			router.refresh();
		},
	});

	const form = useForm({
		resolver: zodResolver(createPeriodoSchema),
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Adicionar periodo</DialogTitle>
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
								onClick={() => setOpen(false)}
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
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Fecha de Matriculas",
	},
	{
		name: "matriculacion",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Matriculaciòn",
	},
	{
		name: "estrucuraNivel",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Estructura por nivel",
	},
	{
		name: "nivelacion",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Nivelaciòn",
	},
	{
		name: "legalizarMatricula",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Legalizar Matricula",
	},
	{
		name: "legalizacionPago",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Legalizaciòn por pago",
	},
	{
		name: "cerrado",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Cerrado",
	},
	{
		name: "vigente",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Vigente",
	},
	{
		name: "planifCargaHoraria",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Planif. carga horaria",
	},
	{
		name: "planifProfObl",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Planif. profesores obl.",
	},
	{
		name: "planifProfTotal",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Planif. profesores total",
	},
	{
		name: "AprobPlanif",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Aprob. Planificaciòn",
	},
	{
		name: "NotasCoord",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Notas por coordinaciòn",
	},
	{
		name: "AutoExtraordinaria",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Automat. extraordinaria",
	},
	{
		name: "AutoArrastre",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Automat. con arrastre",
	},
	{
		name: "AutoSecMatriculas",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Automat. 2das matriculas",
	},
	{
		name: "matricula",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "# Matricula",
	},
	{
		name: "AutoMatriculas",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "# matricula automatica",
	},
	{
		name: "matriculaLegal",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "# matricula al legalizar",
	},
	{
		name: "Secuencia",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Secuencia",
	},
	{
		name: "EvaluacionDocente",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Evaluaciòn al docente",
	},
	{
		name: "CostoSeccion",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Costos por sesiòn",
	},
	{
		name: "PlanCostos",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Plan de costos",
	},
	{
		name: "Activo",
		inputType: "custom-select",
		placeholder: "-----------",
		options: ["si", "no"],
		label: "Activo",
	},
];
