"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@/app/_components/ui/dropdown-menu";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { ROUTES } from "@/core/routes";
import { FormInputFile } from "@/app/_components/ui/form-input-file";
import { states } from "@/utils/states";

export const crmParams = {
	add: "agregarAdm",
	update: "actualizarAdm",
	actualizarUniforme: "actualizarUniforme",
	seguimientos: "seguimiento",
	agendarSeguimiento: "agendarSeguimiento",
} as const;

const createCortesSchema: z.ZodType<z.ZodTypeDef> = z.object({});

export default function AddInscritos() {
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
							<DialogTitle>Adicionar Inscritos</DialogTitle>
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
							onClick={() => setOpentSeg(true)}
							className='flex flex-row gap-2'
						>
							<Plus className='w-8' />
							<span>Seguimientos</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<section>
					<div className='flex flex-row flex-wrap items-center gap-2'>
						<h4>Filtros :</h4>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LAS SEDES</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>TODOS LAS SEDES</SelectItem>
									<SelectItem value='2'>PRINCIPAL</SelectItem>
								</SelectContent>
							</Select>
						</SelectGroup>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LOS PROGRAMAS</SelectTrigger>
								<SelectContent>
									{SelectProgramas.map(e => {
										return (
											<SelectItem key={e.value} value={`${e.value}`}>
												{e.field}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</SelectGroup>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LAS MODALIDADES</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>TODOS LOS MODALIDADES</SelectItem>
									<SelectItem value='2'>DUAL</SelectItem>
									<SelectItem value='3'>EN LINEA</SelectItem>
									<SelectItem value='4'>HIBRIDA</SelectItem>
									<SelectItem value='5'>PRESENCIAL</SelectItem>
									<SelectItem value='6'>SEMIPRESENCIAL</SelectItem>
								</SelectContent>
							</Select>
						</SelectGroup>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LOS NIVELES</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>NIVELACION</SelectItem>
									<SelectItem value='2'>1ER NIVEL</SelectItem>
									<SelectItem value='3'>2ER NIVEL</SelectItem>
									<SelectItem value='4'>3ER NIVEL</SelectItem>
									<SelectItem value='5'>4TO NIVEL</SelectItem>
									<SelectItem value='6'>5TO NIVEL</SelectItem>
									<SelectItem value='7'>6TO NIVEL</SelectItem>
								</SelectContent>
							</Select>
						</SelectGroup>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LAS SESIONES</SelectTrigger>
								<SelectContent>
									{selectSesiones.map(e => {
										return (
											<SelectItem key={e.id} value={`${e.id}`}>
												{e.nombre}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</SelectGroup>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LOS ASESORES</SelectTrigger>
								<SelectContent>
									{selectAsesores.map(e => {
										return (
											<SelectItem key={e.id} value={`${e.id}`}>
												{e.nombre}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</SelectGroup>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LAS OPCIONES DE REGISTRO</SelectTrigger>
								<SelectContent>
									<SelectItem value='1'>
										TODOS LAS OPCIONES DE REGISTRO
									</SelectItem>
									<SelectItem value='2'>
										HOMOLOGACIÓN POR EJERCICIO PROFRESIONAL (VALIDANDO)
									</SelectItem>
									<SelectItem value='3'>
										HOMOLOGACIÓN POR VALIDACIÓN DE CONOCIMIENTOS (VALIDANDO)
									</SelectItem>
									<SelectItem value='4'>
										RECONOCIMIENTOS DE ESTUDIOS (VALIDANDO)
									</SelectItem>
									<SelectItem value='5'>REGULAR</SelectItem>
								</SelectContent>
							</Select>
						</SelectGroup>
						<SelectGroup>
							<Select>
								<SelectTrigger>TODOS LOS PERIODOS</SelectTrigger>
								<SelectContent>
									{selectPeriodos.map(e => {
										return (
											<SelectItem key={e.id} value={`${e.id}`}>
												{e.nombre}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</SelectGroup>
					</div>
				</section>
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
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	{
		name: "identifiacion",
		inputType: "number",
		label: "Identificación",
	},
	{
		name: "emailTel",
		inputType: "text",
		label: "Email / Teléfono",
	},
	{
		name: "asesorPrograma",
		inputType: "text",
		label: "Asesor / Programa",
	},
	{
		name: "codigo",
		inputType: "number",
		label: "Codigo promoción",
	},
	{
		name: "vencido",
		inputType: "number",
		label: "Vencido",
	},
	{
		name: "matricula",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Matricula",
	},
	{
		name: "Hab. Matricula",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Pais de nacimiento",
	},
	{
		name: "foto",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Foto",
	},
	{
		name: "seguimiento",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Seguimientos",
	},
	{
		name: "activo",
		inputType: "custom-select",
		options: ["si", "no"],
		label: "Activo",
	},
];

const SelectProgramas = [
	{
		value: 1,
		field: "TODAS LOS PROGRAMAS",
	},
	{
		value: 2,
		field: "ADMINISTRACIÓN",
	},
	{
		value: 3,
		field: "ADMINISTRACIÓN DE EMPRESAS E INTELIGENCIA DE NEGOCIOS",
	},
	{
		value: 4,
		field: "ADMINISTRACIÓN DE EMPRESAS Y EMPRENDIMIENTO",
	},
	{
		value: 5,
		field: "ADMINISTRACIÓN DE NEGOCIOS",
	},
	{
		value: 6,
		field: "ADMINISTRACIÓN FINANCIERA",
	},
	{
		value: 7,
		field: "DESARROLLO DE APLICACIONES MOVILES",
	},
	{
		value: 8,
		field: "DESARROLLO DE APLICACIONES WEB",
	},
	{
		value: 9,
		field: "DESARROLLO INFANTIL INTEGRAL",
	},
	{
		value: 10,
		field: "ELECTRONICA DIGITAL",
	},
	{
		value: 11,
		field: "ENFERMERIA",
	},
	{
		value: 12,
		field: "FORMACION CONTINUA",
	},
	{
		value: 13,
		field: "GESTIÓN DE FINANZAS Y RIESGOS FINANCIEROS",
	},
	{
		value: 14,
		field: "GESTION ESTRATÉGICA DEL MARKETING DIGITAL",
	},
	{
		value: 15,
		field: "INFORMATICA",
	},
	{
		value: 16,
		field: "LABORATORIO CLÍNICO",
	},
	{
		value: 17,
		field: "LOGISTICA Y TRANSPORTE",
	},
	{
		value: 18,
		field: "MARKETING",
	},
	{
		value: 19,
		field: "PREPARACIÓN FISICA DE ALTO RENDIMIENTO",
	},
	{
		value: 20,
		field: "PROGRAMA PRUEBA CON MENCIÓN EN PRUEBAS",
	},
];

const selectAsesores = [
	{
		id: 1,
		nombre: "ADMINISTRADOR AOK SISTEMA",
	},
	{
		id: 2,
		nombre: "CASTRO MARTIN JULIO DAVID",
	},
	{
		id: 3,
		nombre: "CASTRO VARGAS JESSICA SAMANTA",
	},
	{
		id: 4,
		nombre: "HERRERA GUEVARA PAULA CRISTINA",
	},
	{
		id: 5,
		nombre: "JACOME YANEZ CARLA LISSETTE",
	},
	{
		id: 6,
		nombre: "MANTILLA LOGROÑO ANDREA CRISTINA",
	},
	{
		id: 7,
		nombre: "NUÑEZ SANTAMARIA ADRIANA CRISTINA",
	},
	{
		id: 8,
		nombre: "SANCHEZ SANTANA DANIELA PATRICIA",
	},
	{
		id: 9,
		nombre: "VILLAFUERTE GARCIA KAREN ANNETTE",
	},
	{
		id: 10,
		nombre: "ADMINISTRADOR AOK SISTEMA",
	},
];

const selectPeriodos = [
	{
		id: 1,
		nombre: "ABRIL - AGOSTO 2024",
	},
	{
		id: 2,
		nombre: "NOVIEMBRE 2023 - MARZO 2024",
	},
	{
		id: 3,
		nombre: "PERIODO DE PRUEBA",
	},
	{
		id: 4,
		nombre: "UNIVERSITARIA JUNIO - OCTUBRE 2023",
	},
	{
		id: 5,
		nombre: "JUNIO - SEPTIEMBRE 2023",
	},
	{
		id: 6,
		nombre: "SALUD - MAYO - SEPTIEMBRE 2023",
	},
	{
		id: 7,
		nombre: "UNIVERSITARIA MAYO - SEPTIEMBRE 2023",
	},
	{
		id: 8,
		nombre: "UNIVERSITARIA - FEBRERO - JUNIO 2023",
	},
	{
		id: 9,
		nombre: "ENERO - MAYO 2023",
	},
	{
		id: 10,
		nombre: "SALUD - OCTUBRE 2022 - FEBRERO 2023",
	},
	{
		id: 11,
		nombre: "AGOSTO - DICIEMBRE 2022",
	},
	{
		id: 12,
		nombre: "FEBRERO  - JUNIO 2022",
	},
	{
		id: 13,
		nombre: "AGOSTO - DICIEMBRE 2021",
	},
	{
		id: 14,
		nombre: "ENERO - JUNIO 2021",
	},
	{
		id: 15,
		nombre: "JUNIO - NOVIEMBRE 2020",
	},
	{
		id: 16,
		nombre: "SEPTIEMBRE 2019 - FEBRERO 2020",
	},
];

const selectSesiones = [
	{
		id: 1,
		nombre: "ABRIL - AGOSTO 2024",
	},
	{
		id: 2,
		nombre: "NOVIEMBRE 2023 - MARZO 2024",
	},
	{
		id: 3,
		nombre: "PERIODO DE PRUEBA",
	},
	{
		id: 4,
		nombre: "UNIVERSITARIA JUNIO - OCTUBRE 2023",
	},
	{
		id: 5,
		nombre: "JUNIO - SEPTIEMBRE 2023",
	},
	{
		id: 6,
		nombre: "SALUD - MAYO - SEPTIEMBRE 2023",
	},
	{
		id: 7,
		nombre: "UNIVERSITARIA MAYO - SEPTIEMBRE 2023",
	},
	{
		id: 8,
		nombre: "UNIVERSITARIA - FEBRERO - JUNIO 2023",
	},
	{
		id: 9,
		nombre: "ENERO - MAYO 2023",
	},
	{
		id: 10,
		nombre: "SALUD - OCTUBRE 2022 - FEBRERO 2023",
	},
	{
		id: 11,
		nombre: "AGOSTO - DICIEMBRE 2022",
	},
	{
		id: 12,
		nombre: "FEBRERO  - JUNIO 2022",
	},
	{
		id: 13,
		nombre: "AGOSTO - DICIEMBRE 2021",
	},
	{
		id: 14,
		nombre: "ENERO - JUNIO 2021",
	},
	{
		id: 15,
		nombre: "JUNIO - NOVIEMBRE 2020",
	},
	{
		id: 16,
		nombre: "SEPTIEMBRE 2019 - FEBRERO 2020",
	},
];
