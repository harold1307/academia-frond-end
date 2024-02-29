"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoDuracion, type MallaCurricular } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Plus, PlusCircle } from "lucide-react";
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
	SelectGroup,
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { ROUTES } from "@/core/routes";
import { FormInputFile } from "../_components/ui/form-input-file";
import { countries } from "@/utils/countries";
import { states } from "@/utils/states";
import { ToggleSwitch } from "../_components/ui/toggle";

export const admisionParams = {
	add: "agregarAdm",
	update: "actualizarAdm",
} as const;

const createCortesSchema: z.ZodType<z.ZodTypeDef> = z.object({});

export default function AddAdmisiones() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [openInt, setOpenInt] = React.useState(false);
	const [opentSeg, setOpentSeg] = React.useState(false);

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async data => {
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
		resolver: zodResolver(createCortesSchema),
		defaultValues: {},
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Admisiones - interesados</h1>
			<div className='flex flex-row gap-4'>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button variant={"outline"}>
							<PlusCircle /> Agregar
						</Button>
					</DialogTrigger>
					<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Adicionar cortes</DialogTitle>
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
														f.options === "countries"
															? countries
																	.map(e => e.countries.map(e => e.name))
																	.join(",")
																	.split(",")
															: f.options === "sectors"
																? states
																		.map(e => e.states.map(e => e.name))
																		.join(",")
																		.split(",")
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
									<Button
										disabled={isSubmitting}
										type='submit'
										variant='success'
									>
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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant={"outline"} className='flex gap-2'>
							Importar <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-56'>
						<DropdownMenuItem
							onClick={() => setOpenInt(true)}
							className='flex flex-row gap-2'
						>
							<Plus className='w-8' />
							<span>Interesados</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setOpentSeg(true)}
							className='flex flex-row gap-2'
						>
							<Plus className='w-8' />
							<span>Seguimientos</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<SelectGroup>
					<Select>
						<SelectTrigger>TODOS LOS ESTADOS</SelectTrigger>
						<SelectContent>
							<SelectItem value='1'>TODOS LOS ESTADOS</SelectItem>
							<SelectItem value='2'>INSCRITOS</SelectItem>
							<SelectItem value='3'>NO INSCRITOS</SelectItem>
							<SelectItem value='4'>DESCARTADOS</SelectItem>
						</SelectContent>
					</Select>
				</SelectGroup>
				<SelectGroup>
					<Select>
						<SelectTrigger>TODOS LOS INTERESADOS</SelectTrigger>
						<SelectContent>
							<SelectItem value='1'>TODOS LOS INTERESADOS</SelectItem>
							<SelectItem value='2'>CON ASESOR</SelectItem>
							<SelectItem value='3'>SIN ASESOR</SelectItem>
						</SelectContent>
					</Select>
				</SelectGroup>
				<SelectGroup>
					<Select>
						<SelectTrigger>TODOS LOS ASESORES</SelectTrigger>
						<SelectContent>
							<SelectItem value='1'>INSCRITOS</SelectItem>
							<SelectItem value='2'>NO INSCRITOS</SelectItem>
							<SelectItem value='3'>DESCARTADOS</SelectItem>
						</SelectContent>
					</Select>
				</SelectGroup>
				<Dialog open={openInt} onOpenChange={setOpenInt}>
					<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Importar interesados</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(data => onSubmit(data))}
								className='space-y-8'
							>
								<FormControl>
									<FormInputFile />
								</FormControl>
								<p className='ml-6 text-sm text-green-400'>
									Tamaño maximo permitido 100mb, en formato xls, xlsx
								</p>
								<DialogFooter>
									<Button
										disabled={isSubmitting}
										type='submit'
										variant='success'
									>
										Guardar
									</Button>
									<Button
										disabled={isSubmitting}
										variant='destructive'
										type='button'
										onClick={() => setOpenInt(false)}
									>
										Cancelar
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
				<Dialog open={opentSeg} onOpenChange={setOpentSeg}>
					<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
						<DialogHeader>
							<DialogTitle>Importar seguimientos</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(data => onSubmit(data))}
								className='space-y-8'
							>
								<FormControl>
									<FormInputFile />
								</FormControl>
								<p className='ml-6 text-sm text-green-400'>
									Tamaño maximo permitido 100mb, en formato xls, xlsx
								</p>
								<DialogFooter>
									<Button
										disabled={isSubmitting}
										type='submit'
										variant='success'
									>
										Guardar
									</Button>
									<Button
										disabled={isSubmitting}
										variant='destructive'
										type='button'
										onClick={() => setOpentSeg(false)}
									>
										Cancelar
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</div>
		</section>
	);
}

const fields = [
	{
		name: "cedula",
		inputType: "text",
		label: "Cedula",
	},
	{
		name: "pasaporte",
		inputType: "text",
		label: "Pasaporte",
	},
	{
		name: "nombre",
		inputType: "text",
		label: "Nombres",
	},
	{
		name: "firstApellido",
		inputType: "text",
		label: "1er apellido",
	},
	{
		name: "secondApellido",
		inputType: "text",
		label: "2er apellido",
	},
	{
		name: "nacionalidad",
		inputType: "text",
		label: "Nacionalidad",
	},
	{
		name: "nacimiento",
		inputType: "text",
		label: "Pais de nacimiento",
	},
	{
		name: "nacimientoProv",
		inputType: "text",
		label: "Provincia nacimiento",
	},
	{
		name: "nacimientoCanton",
		inputType: "text",
		label: "Canton nacimiento",
	},
	{
		name: "sexo",
		inputType: "custom-select",
		options: ["Masculino", "Femenino", "Otro"],
		label: "Sexo",
	},
	{
		name: "genero",
		inputType: "custom-select",
		options: ["Masculino", "Femenino", "Otro"],
		label: "Género",
	},
	{
		name: "etnia",
		inputType: "text",
		label: "Etnia",
	},
	{
		name: "telMovil",
		inputType: "number",
		label: "Telefono movil",
	},
	{
		name: "telFijo",
		inputType: "number",
		label: "Telefono fijo",
	},
	{
		name: "residencia",
		inputType: "custom-select",
		options: "countries",
		label: "Pais de residencia",
	},
	{
		name: "sector",
		inputType: "custom-select",
		options: "sectors",
		label: "Sector reside",
	},
	{
		name: "direccion",
		inputType: "text",
		label: "Direccion",
	},
	{
		name: "correo",
		inputType: "email",
		label: "Correo electronico",
	},
	{
		name: "motivo",
		inputType: "custom-select",
		options: ["1", 2],
		label: "Como se entero de la institución?",
	},
	{
		name: "razones",
		inputType: "custom-select",
		options: ["1", 2],
		label: "Razones para inscribirse",
	},
	{
		name: "codigo",
		inputType: "number",
		label: "Codigo de promoción",
	},
	{
		name: "cobertura",
		inputType: "custom-select",
		options: ["1", 2],
		label: "¿Quien cubre los gastos del estudiante?",
	},
];
