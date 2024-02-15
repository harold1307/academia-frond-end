"use client";
import { $Enums } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import type { CreateAsignaturaModuloEnMalla } from "@/core/api/modulos-malla";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { assertReferenceInput, type Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";

const schema = z.object<
	ZodInferSchema<
		Omit<
			CreateAsignaturaModuloEnMalla,
			| "descripcion"
			| "resultados"
			| "competencia"
			| "objetivos"
			| "esAnexo"
			| "nivel"
			| "ejeFormativoId"
		> & {
			asignaturaId: string;
			descripcion?: string;
			resultados?: string;
			competencia?: string;
			objetivos?: string;
			"dummy-validaCantidadMatriculas"?: boolean;
			"dummy-minimoCreditos"?: boolean;
		}
	>
>({
	tipoAsignatura: z.enum(["PRACTICA", "TEORICA", "TEORICA_PRACTICA"] as const),
	identificacion: z.string(),
	permiteMatriculacion: z.boolean(),
	validaParaCredito: z.boolean(),
	validaParaPromedio: z.boolean(),
	costoEnMatricula: z.boolean(),
	requeridaParaGraduar: z.boolean(),
	cantidadMatriculas: z.number(),
	cantidadMatriculasAutorizadas: z.number().nullable(),
	minimoCreditosRequeridos: z.number().nullable(),
	maximaCantidadHorasSemanalas: z.number(),
	horasColaborativas: z.number(),
	horasAsistidasDocente: z.number(),
	horasAutonomas: z.number(),
	horasPracticas: z.number(),
	sumaHoras: z.boolean(),
	creditos: z.number(),
	noValidaAsistencia: z.boolean(),
	materiaGeneral: z.boolean(),
	guiaPracticaMetodologiaObligatoria: z.boolean(),
	aprobarGuiaPracticaMetodologica: z.boolean(),
	competencia: z.string().optional(),
	objetivosEspecificos: z.string().nullable(),
	descripcion: z.string().optional(),
	resultados: z.string().optional(),
	aporteAsignaturaAlPerfil: z.string().nullable(),
	objetivoGeneral: z.string().nullable(),
	objetivos: z.string().optional(),

	asignaturaId: z.string().uuid(),
	areaConocimientoId: z.string().uuid(),
	campoFormacionId: z.string(),
	mallaId: z.string().uuid(),

	"dummy-validaCantidadMatriculas": z.boolean().optional(),
	"dummy-minimoCreditos": z.boolean().optional(),
});

type AddModuloProps = {
	mallaCurricularId: string;
};

export default function AddModulo({ mallaCurricularId }: AddModuloProps) {
	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		hookFormProps: {
			defaultValues: {
				permiteMatriculacion: false,
				validaParaCredito: false,
				validaParaPromedio: false,
				costoEnMatricula: false,
				requeridaParaGraduar: false,
				sumaHoras: false,
				noValidaAsistencia: false,
				materiaGeneral: false,
				guiaPracticaMetodologiaObligatoria: false,
				aprobarGuiaPracticaMetodologica: false,
				horasColaborativas: 0,
				horasAsistidasDocente: 0,
				horasAutonomas: 0,
				horasPracticas: 0,
				"dummy-minimoCreditos": false,
				"dummy-validaCantidadMatriculas": false,
			},
		},
		mutationFn: async ({
			asignaturaId,
			competencia,
			objetivosEspecificos,
			descripcion,
			resultados,
			aporteAsignaturaAlPerfil,
			objetivoGeneral,
			cantidadMatriculasAutorizadas,
			minimoCreditosRequeridos,
			guiaPracticaMetodologiaObligatoria,
			aprobarGuiaPracticaMetodologica,
			...data
		}) => {
			return API.mallasCurriculares.createModulo({
				mallaCurricularId,
				asignaturaId,
				data: {
					...data,
					competencia: competencia || null,
					objetivosEspecificos: objetivosEspecificos || null,
					descripcion: descripcion || null,
					resultados: resultados || null,
					aporteAsignaturaAlPerfil: aporteAsignaturaAlPerfil || null,
					objetivoGeneral: objetivoGeneral || null,
					cantidadMatriculasAutorizadas: data["dummy-validaCantidadMatriculas"]
						? cantidadMatriculasAutorizadas
						: null,
					minimoCreditosRequeridos: data["dummy-minimoCreditos"]
						? minimoCreditosRequeridos
						: null,
					guiaPracticaMetodologiaObligatoria:
						guiaPracticaMetodologiaObligatoria,
					aprobarGuiaPracticaMetodologica: guiaPracticaMetodologiaObligatoria
						? aprobarGuiaPracticaMetodologica
						: false,
				},
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
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
		data: asignaturas,
		isLoading: asignaturasAreLoading,
		refetch: fetchAsignaturas,
	} = useQuery({
		queryKey: ["asignaturasEnAsignaturaEnMalla"],
		queryFn: async () => {
			return API.asignaturas.getMany();
		},
		enabled: false,
	});

	const {
		horasColaborativas,
		horasAsistidasDocente,
		horasAutonomas,
		horasPracticas,
		...formValues
	} = form.watch();

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Adicionar modulo</h1>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutate(data))}
				title='Adicionar modulo'
				withTrigger
				triggerLabel='Adicionar'
			>
				{fields.map(f => {
					if (assertReferenceInput(f.name)) {
						return (
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
						);
					}

					if (f.dependsOn && !formValues[f.dependsOn]) return null;

					if (f.dependsOn && f.inputType === "number") {
						return (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								disabled={isPending}
								shouldUnregister={true}
								render={({ field }) => (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || undefined}
												onChange={e => field.onChange(+e.target.value)}
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

					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							render={({ field }) => {
								switch (f.inputType) {
									case "custom-select": {
										let options:
											| { label: string; value: string }[]
											| string[]
											| undefined = Array.isArray(f.options)
											? f.options
											: undefined;
										let loading;

										if (f.options === "custom") {
											switch (f.name) {
												case "asignaturaId": {
													options = asignaturas?.data.map(m => ({
														label: m.nombre,
														value: m.id,
													}));

													loading = asignaturasAreLoading;
													break;
												}
												case "campoFormacionId": {
													options = camposFormacion?.data.map(t => ({
														label: t.nombre,
														value: t.id,
													}));

													loading = camposAreLoading;
													break;
												}

												case "areaConocimientoId": {
													options = areasConocimiento?.data.map(t => ({
														label: t.nombre,
														value: t.id,
													}));

													loading = areasAreLoading;
													break;
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
														if (f.name === "asignaturaId" && !asignaturas) {
															fetchAsignaturas();
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
					);
				})}
			</MutateModal>
		</section>
	);
}

const fields = [
	{
		name: "asignaturaId",
		inputType: "custom-select",
		label: "Asignatura",
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
		name: "validaParaCredito",
		label: "Valida para credito",
		inputType: "checkbox",
	},
	{
		name: "validaParaPromedio",
		label: "Valida para promedio",
		inputType: "checkbox",
	},
	{
		name: "costoEnMatricula",
		label: "Costo en matricula",
		inputType: "checkbox",
	},
	{
		name: "requeridaParaGraduar",
		label: "Requerida para graduar",
		inputType: "checkbox",
	},
	{
		name: "cantidadMatriculas",
		label: "Cantidad matriculas",
		inputType: "number",
	},
	{
		name: "dummy-validaCantidadMatriculas",
		label: "Valida cantidad matriculas autorizadas",
		inputType: "checkbox",
	},
	{
		name: "cantidadMatriculasAutorizadas",
		label: "Cantidad matriculas autorizadas",
		inputType: "number",
		dependsOn: "dummy-validaCantidadMatriculas",
	},
	{
		name: "dummy-minimoCreditos",
		label: "Minimo de creditos requeridos",
		inputType: "checkbox",
	},
	{
		name: "minimoCreditosRequeridos",
		label: "Creditos requeridos",
		inputType: "number",
		dependsOn: "dummy-minimoCreditos",
	},
	{
		name: "maximaCantidadHorasSemanalas",
		label: "Maxima cantidad de horas semanales",
		inputType: "number",
	},
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
	{ name: "sumaHoras", label: "Suma horas", inputType: "checkbox" },
	{
		name: "noValidaAsistencia",
		label: "No valida asistencia",
		inputType: "checkbox",
	},
	{ name: "materiaGeneral", label: "Materia general", inputType: "checkbox" },
	{
		name: "guiaPracticaMetodologiaObligatoria",
		label: "Guia practica o metodologica obligatoria",
		inputType: "checkbox",
	},
	{
		name: "aprobarGuiaPracticaMetodologica",
		label: "Aprobar guia practica o metodologica",
		inputType: "checkbox",
		dependsOn: "guiaPracticaMetodologiaObligatoria",
	},
	{
		name: "competencia",
		label: "Competencia",
		inputType: "custom-text-area",
	},
	{
		name: "objetivosEspecificos",
		label: "Objetivos especificos de la asignatura",
		inputType: "custom-text-area",
	},
	{
		name: "descripcion",
		label: "Descripcion de la asignatura",
		inputType: "custom-text-area",
	},
	{
		name: "resultados",
		label: "Resultados de aprendizaje",
		inputType: "custom-text-area",
	},
	{
		name: "aporteAsignaturaAlPerfil",
		label: "Aporte de la asignatura al perfil profesional",
		inputType: "custom-text-area",
	},
	{
		name: "objetivoGeneral",
		label: "Objetivo general",
		inputType: "custom-text-area",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
