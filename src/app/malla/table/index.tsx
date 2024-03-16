"use client";
import { TipoDuracion } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { DataTable } from "@/app/_components/table";
import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { Textarea } from "@/app/_components/ui/textarea";
import { ASIGNATURA_KEYS } from "@/app/asignatura/query-keys";
import { API } from "@/core/api-client";
import type {
	MallaCurricularFromAPI,
	UpdateMallaData,
} from "@/core/api/mallas-curriculares";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { cn, formatDate } from "@/utils";
import {
	NIVELES_PREFIXES,
	assertReferenceInput,
	type Field,
} from "@/utils/forms";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";
import { Calendar } from "../../_components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../_components/ui/popover";
import { mallaParams } from "../add-malla";
import { MALLA_KEYS } from "../query-keys";
import type { MallaCurricularTableItem } from "./columns";
import { columns } from "./columns";

export default function MallaCurricularTable({
	mallas,
	programaName,
}: {
	mallas: MallaCurricularTableItem[];
	programaName: string;
}) {
	return (
		<section>
			<DataTable<typeof columns, MallaCurricularTableItem[]>
				columns={columns}
				data={mallas}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}

const schema = z.object<
	ZodInferSchema<
		ReplaceNullableToOptional<
			Omit<UpdateMallaData, "estado"> & {
				tituloObtenidoId?: string | null;
				codigo?: string | null;
				cantidadArrastres?: number | null;
				porcentajeMinimoPasarNivel?: number | null;
				maximoMateriasAdelantar?: number | null;
				perfilEgreso?: string | null;
				observaciones?: string | null;
				"reference-practicasPreProfesionales": boolean;
				"reference-pppLigadasAMaterias"?: boolean;
				"reference-practicasComunitarias": boolean;
				"reference-pcLigadasAMaterias"?: boolean;
				"reference-calculoAvanceNivel": boolean;
				"reference-puedeAdelantarMaterias": boolean;
				modalidadId?: string;
				niveles?: number;
			}
		>
	>
>({
	modalidadId: z.string().optional(),
	niveles: z.number().optional(),
	tituloObtenidoId: z.string().optional(),
	tipoDuracion: z
		.enum(["ANOS", "CREDITOS", "HORAS", "SEMESTRES"] as const)
		.optional(),
	codigo: z.string().optional(),
	fechaAprobacion: z.string().datetime().optional(),
	fechaLimiteVigencia: z.string().datetime().optional(),
	cantidadOtrasMateriasMatricula: z.number().optional(),
	limiteSeleccionMateriaPorAdministrativo: z.boolean().optional(),
	cantidadArrastres: z.number().optional(),
	porcentajeMinimoPasarNivel: z.number().optional(),
	maximoMateriasAdelantar: z.number().optional(),
	automatriculaModulos: z.boolean().optional(),
	plantillasSilabo: z.boolean().optional(),
	modeloPlanificacion: z.boolean().optional(),
	perfilEgreso: z.string().optional(),
	observaciones: z.string().optional(),

	practicaComunitariaRequiereAutorizacion: z.boolean().optional(),
	practicaComunitariaHoras: z.number().optional(),
	practicaComunitariaCreditos: z.number().optional(),
	practicaComunitariaRegistroDesdeNivel: z.number().int().optional(),
	practicaComunitariaRegistroPracticasAdelantadas: z.boolean().optional(),
	practicaComunitariaRegistroMultiple: z.boolean().optional(),

	practicaPreProfesionalRequiereAutorizacion: z.boolean().optional(),
	practicaPreProfesionalHoras: z.number().optional(),
	practicaPreProfesionalCreditos: z.number().optional(),
	practicaPreProfesionalRegistroDesdeNivel: z.number().int().optional(),
	practicaPreProfesionalRegistroPracticasAdelantadas: z.boolean().optional(),

	"reference-practicasPreProfesionales": z.boolean(),
	"reference-pppLigadasAMaterias": z.boolean().optional(),
	"reference-practicasComunitarias": z.boolean(),
	"reference-pcLigadasAMaterias": z.boolean().optional(),
	"reference-calculoAvanceNivel": z.boolean(),
	"reference-puedeAdelantarMaterias": z.boolean(),
});

const disabledFields = ["modalidadId", "niveles"];

type UpdateMallaProps = {
	mallas: MallaCurricularTableItem[];
	programaName: string;
};

export function UpdateMalla({ mallas }: { mallas: MallaCurricularFromAPI[] }) {
	const { replaceDelete, searchParams, router } = useMutateSearchParams();
	const {
		form,
		mutation: { isPending, mutate },
	} = useMutateModule({
		schema,
		invalidateQueryKey: MALLA_KEYS.all,
		mutationFn: ({
			id,
			data: {
				tipoDuracion,
				codigo,
				cantidadArrastres,
				porcentajeMinimoPasarNivel,
				maximoMateriasAdelantar,
				perfilEgreso,
				observaciones,
				tituloObtenidoId,

				practicaComunitariaCreditos,
				practicaComunitariaHoras,
				practicaComunitariaRegistroDesdeNivel,
				practicaComunitariaRegistroMultiple,
				practicaComunitariaRegistroPracticasAdelantadas,
				practicaComunitariaRequiereAutorizacion,

				practicaPreProfesionalCreditos,
				practicaPreProfesionalHoras,
				practicaPreProfesionalRegistroDesdeNivel,
				practicaPreProfesionalRegistroPracticasAdelantadas,
				practicaPreProfesionalRequiereAutorizacion,

				...data
			},
		}: {
			id: string;
			data: z.infer<typeof schema>;
		}) => {
			return API.mallasCurriculares.update({
				id: id,
				data: {
					...data,
					tipoDuracion: tipoDuracion ?? null,
					codigo: codigo ?? null,
					cantidadArrastres: cantidadArrastres ?? null,
					porcentajeMinimoPasarNivel: porcentajeMinimoPasarNivel ?? null,
					maximoMateriasAdelantar: maximoMateriasAdelantar ?? null,
					perfilEgreso: perfilEgreso ?? null,
					observaciones: observaciones ?? null,
					tituloObtenidoId: tituloObtenidoId ?? null,
					...(data["reference-practicasComunitarias"]
						? {
								practicaComunitariaRequiereAutorizacion:
									practicaComunitariaRequiereAutorizacion ?? false,
								practicaComunitariaCreditos: data[
									"reference-pcLigadasAMaterias"
								]
									? null
									: practicaComunitariaCreditos ?? null,
								practicaComunitariaHoras: data["reference-pcLigadasAMaterias"]
									? null
									: practicaComunitariaHoras ?? null,
								practicaComunitariaRegistroDesdeNivel: data[
									"reference-pcLigadasAMaterias"
								]
									? null
									: practicaComunitariaRegistroDesdeNivel ?? null,
								practicaComunitariaRegistroPracticasAdelantadas:
									practicaComunitariaRegistroPracticasAdelantadas ?? false,
								practicaComunitariaRegistroMultiple:
									practicaComunitariaRegistroMultiple ?? false,
							}
						: {
								practicaComunitariaRequiereAutorizacion: null,
								practicaComunitariaHoras: null,
								practicaComunitariaCreditos: null,
								practicaComunitariaRegistroDesdeNivel: null,
								practicaComunitariaRegistroPracticasAdelantadas: null,
								practicaComunitariaRegistroMultiple: null,
							}),
					...(data["reference-practicasPreProfesionales"]
						? {
								practicaPreProfesionalRequiereAutorizacion:
									practicaPreProfesionalRequiereAutorizacion ?? false,
								practicaPreProfesionalCreditos: data[
									"reference-pppLigadasAMaterias"
								]
									? null
									: practicaPreProfesionalCreditos ?? null,
								practicaPreProfesionalHoras: data[
									"reference-pppLigadasAMaterias"
								]
									? null
									: practicaPreProfesionalHoras ?? null,
								practicaPreProfesionalRegistroDesdeNivel: data[
									"reference-pppLigadasAMaterias"
								]
									? null
									: practicaPreProfesionalRegistroDesdeNivel ?? null,
								practicaPreProfesionalRegistroPracticasAdelantadas:
									practicaPreProfesionalRegistroPracticasAdelantadas ?? false,
							}
						: {
								practicaPreProfesionalCreditos: null,
								practicaPreProfesionalHoras: null,
								practicaPreProfesionalRegistroDesdeNivel: null,
								practicaPreProfesionalRegistroPracticasAdelantadas: null,
								practicaPreProfesionalRequiereAutorizacion: null,
							}),
				},
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(mallaParams.update);
			router.refresh();
		},
		hookFormProps: {
			defaultValues: {
				practicaComunitariaHoras: 0,
				practicaComunitariaCreditos: 0,
				practicaPreProfesionalHoras: 0,
				practicaPreProfesionalCreditos: 0,
			},
		},
	});

	const {
		data: modalidades,
		isLoading: modalidadesAreLoading,
		refetch: fetchModalidades,
	} = useQuery({
		queryKey: ASIGNATURA_KEYS.list(""),
		queryFn: () => {
			return API.modalidades.getMany();
		},
	});

	const {
		data: titulosObtenidos,
		isLoading: titulosObtenidosAreLoading,
		refetch: fetchTitulosObtenidos,
	} = useQuery({
		queryKey: ["titulosObtenidos"],
		queryFn: () => {
			return API.titulosObtenidos.getMany();
		},
	});

	const formValues = form.watch();

	console.log(form.formState.errors);

	const paramMallaId = React.useMemo(
		() => searchParams.get(mallaParams.update),
		[searchParams],
	);

	React.useEffect(() => {
		const selectedMalla = mallas.find(i => i.id === paramMallaId);

		if (!selectedMalla) return;

		const preProfesionalesFields = [
			selectedMalla.practicaPreProfesionalHoras,
			selectedMalla.practicaPreProfesionalCreditos,
			selectedMalla.practicaPreProfesionalRegistroDesdeNivel,
			selectedMalla.practicaPreProfesionalRequiereAutorizacion,
			selectedMalla.practicaPreProfesionalRegistroPracticasAdelantadas,
		];

		const comunitariasFields = [
			selectedMalla.practicaComunitariaHoras,
			selectedMalla.practicaComunitariaCreditos,
			selectedMalla.practicaComunitariaRegistroDesdeNivel,
			selectedMalla.practicaComunitariaRequiereAutorizacion,
			selectedMalla.practicaComunitariaRegistroPracticasAdelantadas,
			selectedMalla.practicaComunitariaRegistroMultiple,
		];

		form.setValue(
			"reference-practicasPreProfesionales",
			preProfesionalesFields.some(f => f !== null),
		);
		form.setValue(
			"reference-pppLigadasAMaterias",
			preProfesionalesFields.slice(0, 3).every(f => f === null),
		);
		form.setValue(
			"reference-practicasComunitarias",
			comunitariasFields.some(f => f !== null),
		);
		form.setValue(
			"reference-pcLigadasAMaterias",
			comunitariasFields.slice(0, 3).every(f => f === null),
		);
		form.setValue(
			"reference-calculoAvanceNivel",
			!!selectedMalla.porcentajeMinimoPasarNivel,
		);
		form.setValue(
			"reference-puedeAdelantarMaterias",
			!!selectedMalla.maximoMateriasAdelantar,
		);
	}, [paramMallaId, form, mallas]);

	if (!paramMallaId) return null;

	const selectedMalla = mallas.find(i => i.id === paramMallaId);

	if (!selectedMalla) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(mallaParams.update)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			key={selectedMalla.id}
			title='Editar malla curricular'
			disabled={isPending}
			onSubmit={form.handleSubmit(data => mutate({ data, id: paramMallaId }))}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(mallaParams.update);
						return;
					}
				},
			}}
		>
			{fields.map(f => {
				if (assertReferenceInput(f.name)) {
					if (f.name === "reference-pppLigadasAMaterias") {
						if (!formValues[f.dependsOn]) {
							return null;
						}
					}

					if (f.dependsOn && !formValues[f.dependsOn]) {
						return null;
					}

					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							// disabled={disabledFields.includes(f.name) || isPending}
							render={({ field }) => {
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
							}}
						/>
					);
				}

				if (f.dependsOn) {
					if (f.dependsOn === "reference-calculoAvanceNivel") {
						if (f.name === "cantidadArrastres" && !formValues[f.dependsOn]) {
							return (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									// disabled={disabledFields.includes(f.name) || isPending}
									defaultValue={selectedMalla[f.name] ?? undefined}
									render={({ field }) => (
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
									)}
								/>
							);
						}

						if (
							f.name === "porcentajeMinimoPasarNivel" &&
							formValues[f.dependsOn]
						) {
							return (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									// disabled={disabledFields.includes(f.name) || isPending}
									defaultValue={selectedMalla[f.name] ?? undefined}
									render={({ field }) => (
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
									)}
								/>
							);
						}

						return null;
					}

					if (
						f.dependsOn === "reference-practicasPreProfesionales" &&
						!formValues[f.dependsOn]
					) {
						return null;
					}

					if (
						f.dependsOn === "reference-practicasComunitarias" &&
						!formValues[f.dependsOn]
					) {
						return null;
					}

					if (f.dependsOn === "reference-pppLigadasAMaterias") {
						if (!formValues["reference-practicasPreProfesionales"]) return null;

						if (formValues[f.dependsOn]) return null;
					}

					if (f.dependsOn === "reference-pcLigadasAMaterias") {
						if (!formValues["reference-practicasComunitarias"]) return null;

						if (formValues[f.dependsOn]) return null;
					}

					if (f.dependsOn === "reference-puedeAdelantarMaterias") {
						if (!formValues[f.dependsOn]) return null;
					}
				}

				return (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						disabled={disabledFields.includes(f.name) || isPending}
						shouldUnregister={true}
						defaultValue={
							f.name === "niveles"
								? selectedMalla.niveles.length
								: selectedMalla[f.name] ?? undefined
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

									if (f.options === "niveles") {
										options = NIVELES_PREFIXES.slice(0, formValues.niveles).map(
											(v, idx) =>
												({
													value: `${idx + 1}`,
													label: `${v} NIVEL`,
												}) satisfies {
													label: string;
													value: string;
												},
										);
									} else if (f.options === "custom") {
										switch (f.name) {
											case "modalidadId": {
												options = modalidades?.data.map(m => ({
													label: m.nombre,
													value: m.id,
												}));

												loading = modalidadesAreLoading;
												break;
											}
											case "tituloObtenidoId": {
												options = titulosObtenidos?.data.map(t => ({
													label: t.nombre,
													value: t.id,
												}));

												loading = titulosObtenidosAreLoading;
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
													if (f.name === "modalidadId" && !modalidades) {
														fetchModalidades();
													}
													if (
														f.name === "tituloObtenidoId" &&
														!titulosObtenidos
													) {
														fetchTitulosObtenidos();
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
											// disabled={disabledFields.includes(f.name) || isPending}
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
	);
}

export function DeleteMalla({ mallas, programaName }: UpdateMallaProps) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const { mutation } = useMutateModule({
		invalidateQueryKey: MALLA_KEYS.all,
		mutationFn: (id: string) => {
			return API.mallasCurriculares.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(mallaParams.delete);
			router.refresh();
		},
	});

	const paramMallaId = React.useMemo(
		() => searchParams.get(mallaParams.delete),
		[searchParams],
	);

	if (!paramMallaId) return null;

	const selectedMalla = mallas.find(i => i.id === paramMallaId);

	if (!selectedMalla) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(mallaParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la malla: ${programaName}, ${
				selectedMalla.modalidad
			} del ${formatDate(selectedMalla.vigencia.fechaAprobacion, {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})}`}
			title='Eliminar malla'
			onDelete={() => mutation.mutate(selectedMalla.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(mallaParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(mallaParams.delete);
						return;
					}
				},
			}}
		/>
	);
}

const practicasPreProfesionalesFields = [
	{
		name: "reference-practicasPreProfesionales",
		inputType: "checkbox",
		label: "Realizan practicas preprofesionales",
	},
	{
		name: "practicaPreProfesionalRequiereAutorizacion",
		inputType: "checkbox",
		label: "Requiere autorizacion para iniciar practicas",
		dependsOn: "reference-practicasPreProfesionales",
	},
	{
		name: "reference-pppLigadasAMaterias",
		inputType: "checkbox",
		label: "Practicas preprofesionales ligadas a materias",
		dependsOn: "reference-practicasPreProfesionales",
	},
	{
		name: "practicaPreProfesionalHoras",
		inputType: "number",
		label: "Horas de practicas preprofesionales",
		dependsOn: "reference-pppLigadasAMaterias",
	},
	{
		name: "practicaPreProfesionalCreditos",
		inputType: "number",
		label: "Creditos de practicas preprofesionales",
		dependsOn: "reference-pppLigadasAMaterias",
	},
	{
		name: "practicaPreProfesionalRegistroDesdeNivel",
		inputType: "custom-select",
		placeholder: "------------",
		label: "Registro de practicas preprofesionales desde",
		options: "niveles",
		dependsOn: "reference-pppLigadasAMaterias",
	},
	{
		name: "practicaPreProfesionalRegistroPracticasAdelantadas",
		inputType: "checkbox",
		label: "Registro de practicas preprofesionales adelantadas",
		dependsOn: "reference-practicasPreProfesionales",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];

const practicasComunitariasFields = [
	{
		name: "reference-practicasComunitarias",
		inputType: "checkbox",
		label: "Realizan practicas comunitarias",
	},
	{
		name: "practicaComunitariaRequiereAutorizacion",
		inputType: "checkbox",
		label: "Requiere autorizacion para iniciar practicas",
		dependsOn: "reference-practicasComunitarias",
	},
	{
		name: "reference-pcLigadasAMaterias",
		inputType: "checkbox",
		label: "Practicas comunitarias ligadas a materias",
		dependsOn: "reference-practicasComunitarias",
	},
	{
		name: "practicaComunitariaHoras",
		inputType: "number",
		label: "Horas de practicas comunitarias",
		dependsOn: "reference-pcLigadasAMaterias",
	},
	{
		name: "practicaComunitariaCreditos",
		inputType: "number",
		label: "Creditos de practicas comunitarias",
		dependsOn: "reference-pcLigadasAMaterias",
	},
	{
		name: "practicaComunitariaRegistroDesdeNivel",
		inputType: "custom-select",
		placeholder: "------------",
		label: "Registro de practicas comunitarias desde",
		options: "niveles",
		dependsOn: "reference-pcLigadasAMaterias",
	},
	{
		name: "practicaComunitariaRegistroPracticasAdelantadas",
		inputType: "checkbox",
		label: "Registro de practicas comunitarias adelantadas",
		dependsOn: "reference-practicasComunitarias",
	},
	{
		name: "practicaComunitariaRegistroMultiple",
		inputType: "checkbox",
		label: "Puede registrarse en multiples practicas comunitarias",
		dependsOn: "reference-practicasComunitarias",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];

const fields = [
	{
		name: "modalidadId",
		inputType: "custom-select",
		options: "custom",
		placeholder: "------------",
		label: "Modalidad",
	},
	{
		name: "tituloObtenidoId",
		inputType: "custom-select",
		label: "Titulo obtenido",
		options: "custom",
	},
	{
		name: "tipoDuracion",
		inputType: "custom-select",
		placeholder: "------------",
		options: Object.keys(TipoDuracion),
		label: "Tipo duracion",
	},
	{
		name: "codigo",
		inputType: "text",
		label: "Codigo",
	},
	{
		name: "fechaAprobacion",
		inputType: "custom-date",
		label: "Fecha de aprobacion",
	},
	{
		name: "fechaLimiteVigencia",
		inputType: "custom-date",
		label: "Fecha de limite de vigencia",
	},
	{
		name: "niveles",
		inputType: "number",
		label: "Niveles de la malla",
	},
	{
		name: "cantidadOtrasMateriasMatricula",
		inputType: "number",
		label: "Cantidad de otras materias en matricula",
	},
	{
		name: "limiteSeleccionMateriaPorAdministrativo",
		inputType: "checkbox",
		label: "Limite en selección de materias por administrativos",
	},
	{
		name: "reference-calculoAvanceNivel",
		inputType: "checkbox",
		label: "Calculo de avance de nivel por %",
	},
	{
		name: "cantidadArrastres",
		inputType: "number",
		label: "Cantidad de arrastres",
		dependsOn: "reference-calculoAvanceNivel",
	},
	{
		name: "porcentajeMinimoPasarNivel",
		inputType: "number",
		label: "Porcentaje minimo pasar nivel",
		dependsOn: "reference-calculoAvanceNivel",
	},
	...practicasPreProfesionalesFields,
	...practicasComunitariasFields,
	{
		name: "reference-puedeAdelantarMaterias",
		inputType: "checkbox",
		label: "Puede adelantar materias",
	},
	{
		name: "maximoMateriasAdelantar",
		inputType: "number",
		label: "Maximo materias adelantar",
		dependsOn: "reference-puedeAdelantarMaterias",
	},
	{
		name: "automatriculaModulos",
		inputType: "number",
		label: "Automatricula en modulos",
	},
	{
		name: "plantillasSilabo",
		inputType: "number",
		label: "Plantillas de silabo",
	},
	{
		name: "modeloPlanificacion",
		inputType: "checkbox",
		label: "Modelo de planificacion",
	},
	{
		name: "perfilEgreso",
		inputType: "custom-text-area",
		label: "Perfil de egreso",
	},
	{
		name: "observaciones",
		inputType: "custom-text-area",
		label: "Observaciones",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
