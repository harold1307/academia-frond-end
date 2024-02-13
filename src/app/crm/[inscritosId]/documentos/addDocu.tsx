"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoDuracion, type MallaCurricular } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
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
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Input } from "@/app/_components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Textarea } from "@/app/_components/ui/textarea";
import { ToggleSwitch } from "@/app/_components/ui/toggle";

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

const createPeriodoSchema: z.ZodType<z.ZodTypeDef> = z.object({});

export default function AddDocumento() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async (data: createPeriodoSchema) => {
			return API.periodos.create(data);
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
		<section>
			<h1 className='text-2xl font-semibold'>Documentos y archivos</h1>
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
											case "toggle": {
												return (
													<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
														<FormLabel className='col-span-3 text-end'>
															{f.label}
														</FormLabel>
														<FormControl>
															<ToggleSwitch value={f.options} />
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
		name: "documento",
		inputType: "custom-select",
		options: ["1", "2"],
		label: "Tipo documento",
	},
	{ name: "nombre", inputType: "text", label: "Nombre" },
	{ name: "observaciones", inputType: "textarea", label: "Observaciones" },
	{
		name: "copiaDigital",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Copia digital",
	},
	{
		name: "copiaFisica",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Copia fisica",
	},
	{
		name: "visible",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Visible para estudiante",
	},
];
