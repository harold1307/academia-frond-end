"use client";
import { $Enums } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
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
import { API } from "@/core/api-client";
import type { CreateAsignaturaEnMallaParams } from "@/core/api/malla-curricular";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { NIVELES_PREFIXES, type Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { ASIGNATURA_EN_MALLA_KEYS } from "./query-keys";

const schema = z.object<
	ZodInferSchema<
		Omit<
			CreateAsignaturaEnMallaParams["data"],
			| "descripcion"
			| "resultadosAprendizaje"
			| "competenciaGenerica"
			| "objetivos"
			| "esAnexo"
		> & {
			asignaturaId: string;
			descripcion?: string;
			resultadosAprendizaje?: string;
			competenciaGenerica?: string;
			objetivos?: string;
		}
	>
>({
	nivel: z.number({ coerce: true }),
	tipoAsignatura: z.nativeEnum($Enums.TipoAsignatura),
	identificacion: z.string(),
	permiteMatriculacion: z.boolean(),
	validaCredito: z.boolean(),
	validaPromedio: z.boolean(),
	costoEnMatricula: z.boolean(),
	practicasPreProfesionales: z.boolean(),
	requeridaEgreso: z.boolean(),
	cantidadMatriculas: z.number(),
	horasSemanales: z.number(),
	horasColaborativas: z.number(),
	horasAsistidasDocente: z.number(),
	horasAutonomas: z.number(),
	horasPracticas: z.number(),
	creditos: z.number(),
	noValidaAsistencia: z.boolean(),
	materiaComun: z.boolean(),
	objetivos: z.string().optional(),
	descripcion: z.string().optional(),
	resultadosAprendizaje: z.string().optional(),
	asignaturaId: z.string(),

	competenciaGenerica: z.string().optional(),
	ejeFormativoId: z.string(),
	areaConocimientoId: z.string(),
	campoFormacionId: z.string(),
});

export default function AddAsignaturaEnMalla({
	mallaId,
	asignaturas,
	mallaNiveles,
}: {
	mallaId: string;
	asignaturas: {
		id: string;
		nombre: string;
		codigo: string | null;
	}[];
	mallaNiveles: number | undefined;
}) {
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		invalidateQueryKey: ASIGNATURA_EN_MALLA_KEYS.lists(),
		hookFormProps: {
			defaultValues: {
				permiteMatriculacion: false,
				validaCredito: false,
				validaPromedio: false,
				costoEnMatricula: false,
				practicasPreProfesionales: false,
				requeridaEgreso: false,
				noValidaAsistencia: false,
				materiaComun: false,
				horasColaborativas: 0,
				horasAsistidasDocente: 0,
				horasAutonomas: 0,
				horasPracticas: 0,
			},
		},
		mutationFn: async ({ asignaturaId, ...data }) => {
			return API.mallas.createAsignaturaEnMalla({
				mallaId,
				asignaturaId,
				data: {
					...data,
					descripcion: data.descripcion || null,
					resultadosAprendizaje: data.resultadosAprendizaje || null,
					competenciaGenerica: data.competenciaGenerica || null,
					objetivos: data.objetivos || null,
					esAnexo: false,
				},
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
	});
	const {
		data: camposFormacion,
		isLoading: camposAreLoading,
		refetch: fetchCampos,
	} = useQuery({
		queryKey: ["camposEnAsignaturaEnMalla"],
		queryFn: async () => {
			return API.camposFormacion.getMany();
		},
		enabled: false,
	});
	const {
		data: ejesFormativos,
		isLoading: ejesAreLoading,
		refetch: fetchEjes,
	} = useQuery({
		queryKey: ["ejesEnAsignaturaEnMalla"],
		queryFn: async () => {
			return API.ejesFormativos.getMany();
		},
		enabled: false,
	});
	const {
		data: areasConocimiento,
		isLoading: areasAreLoading,
		refetch: fetchAreas,
	} = useQuery({
		queryKey: ["areasEnAsignaturaEnMalla"],
		queryFn: async () => {
			return API.areasConocimiento.getMany();
		},
		enabled: false,
	});

	const {
		horasColaborativas,
		horasAsistidasDocente,
		horasAutonomas,
		horasPracticas,
	} = form.watch();

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Adicionar asignatura en malla</h1>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar asignatura en malla curricular'
				withTrigger
				triggerLabel='Adicionar'
			>
				{fields.map(f =>
					assertReferenceInput(f.name) ? (
						<FormItem
							key={f.name}
							className='grid grid-cols-12 items-center gap-4 space-y-0'
						>
							<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
							<FormControl>
								<Input
									type={f.inputType}
									placeholder={f.placeholder}
									value={
										f.name === "reference-horasTotales"
											? horasColaborativas +
												horasAsistidasDocente +
												horasAutonomas +
												horasPracticas
											: f.name === "reference-horasDocencia"
												? horasColaborativas + horasAsistidasDocente
												: horasAutonomas + horasPracticas
									}
									className='col-span-9'
									disabled={true}
								/>
							</FormControl>
						</FormItem>
					) : (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							render={({ field }) => {
								switch (f.inputType) {
									case "custom-select": {
										let options: { label: string; value: string }[] | undefined;
										let loading;

										if (f.options === "custom") {
											switch (f.name) {
												case "asignaturaId": {
													options = asignaturas.map(
														a =>
															({ label: a.nombre, value: a.id }) satisfies {
																label: string;
																value: string;
															},
													);
													break;
												}
												case "nivel": {
													options = NIVELES_PREFIXES.slice(0, mallaNiveles).map(
														(v, idx) =>
															({
																value: `${idx + 1}`,
																label: `${v} NIVEL`,
															}) satisfies { label: string; value: string },
													);
													break;
												}
												case "ejeFormativoId": {
													options = ejesFormativos?.data.map(e => ({
														label: e.nombre,
														value: e.id,
													}));

													loading = ejesAreLoading;
													break;
												}
												case "campoFormacionId": {
													options = camposFormacion?.data.map(c => ({
														label: c.nombre,
														value: c.id,
													}));

													loading = camposAreLoading;
													break;
												}
												case "areaConocimientoId": {
													options = areasConocimiento?.data.map(a => ({
														label: a.nombre,
														value: a.id,
													}));

													loading = areasAreLoading;
													break;
												}
											}
										} else {
											options = f.options;
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
															f.name === "ejeFormativoId" &&
															!ejesFormativos
														) {
															fetchEjes();
														}
														if (
															f.name === "campoFormacionId" &&
															!camposFormacion
														) {
															fetchCampos();
														}
														if (
															f.name === "areaConocimientoId" &&
															!areasConocimiento
														) {
															fetchAreas();
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
					),
				)}
			</MutateModal>
		</section>
	);
}

function assertReferenceInput(name: string): name is `reference-${string}` {
	return name.includes("reference-");
}

const fields = [
	{
		name: "ejeFormativoId",
		inputType: "custom-select",
		label: "Eje formativo",
		options: "custom",
		placeholder: "-----------------",
	},
	{
		name: "nivel",
		inputType: "custom-select",
		label: "Nivel",
		options: "custom",
		placeholder: "-----------------",
	},
	{
		name: "asignaturaId",
		inputType: "custom-select",
		label: "Asignatura",
		options: "custom",
		placeholder: "-----------------",
	},
	{
		name: "areaConocimientoId",
		inputType: "custom-select",
		label: "Area de conocimiento",
		options: "custom",
		placeholder: "-----------------",
	},
	{
		name: "campoFormacionId",
		inputType: "custom-select",
		label: "Campo formacion",
		options: "custom",
		placeholder: "-----------------",
	},
	{
		name: "tipoAsignatura",
		label: "Tipo de asignatura",
		inputType: "custom-select",
		options: Object.keys($Enums.TipoAsignatura).map(k => ({
			label: k,
			value: k,
		})),
		placeholder: "-----------------",
	},
	{
		name: "identificacion",
		label: "Identificacion",
		inputType: "text",
	},
	{
		name: "permiteMatriculacion",
		label: "Permite matriculacion",
		inputType: "checkbox",
	},
	{
		name: "validaCredito",
		label: "Valida para credito",
		inputType: "checkbox",
	},
	{
		name: "validaPromedio",
		label: "Valida para promedio",
		inputType: "checkbox",
	},
	{
		name: "costoEnMatricula",
		label: "Costo en matricula",
		inputType: "checkbox",
	},
	{
		name: "practicasPreProfesionales",
		label: "Practicas pre-profesionales",
		inputType: "checkbox",
	},
	{
		name: "requeridaEgreso",
		label: "Requerida para egresar",
		inputType: "checkbox",
	},
	{
		name: "cantidadMatriculas",
		label: "Cantidad matriculas",
		inputType: "number",
	},
	{ name: "horasSemanales", label: "Horas semanales", inputType: "number" },
	{
		name: "reference-horasTotales",
		label: "Horas totales",
		inputType: "number",
	},
	{
		name: "reference-horasDocencia",
		label: "Horas docencia",
		inputType: "number",
	},
	{
		name: "horasColaborativas",
		label: "Horas colaborativas",
		inputType: "number",
	},
	{
		name: "horasAsistidasDocente",
		label: "Horas asistidas por el docente",
		inputType: "number",
	},
	{
		name: "reference-horasOrgAprendizaje",
		label: "Horas organizacion aprendizaje",
		inputType: "number",
	},
	{ name: "horasAutonomas", label: "Horas autonomas", inputType: "number" },
	{ name: "horasPracticas", label: "Horas practicas", inputType: "number" },
	{ name: "creditos", label: "Creditos", inputType: "number" },
	{
		name: "noValidaAsistencia",
		label: "No valida asistencia",
		inputType: "checkbox",
	},
	{ name: "materiaComun", label: "Materia comun", inputType: "checkbox" },
	{
		name: "competenciaGenerica",
		label: "Competencia generica",
		inputType: "custom-text-area",
	},
	{
		name: "objetivos",
		label: "Objetivos especificos de la asignatura",
		inputType: "custom-text-area",
	},
	{
		name: "descripcion",
		label: "Descripcion de la asignatura",
		inputType: "custom-text-area",
	},
	{
		name: "resultadosAprendizaje",
		label: "Resultados de aprendizaje",
		inputType: "custom-text-area",
	},
] satisfies Field<
	keyof (CreateAsignaturaEnMallaParams["data"] & { asignaturaId: string })
>[];
