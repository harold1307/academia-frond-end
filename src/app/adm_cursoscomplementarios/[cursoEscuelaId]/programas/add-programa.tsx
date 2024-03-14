"use client";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { PROGRAMAS_KEYS } from "@/app/adm_cursos/[cursoId]/variantes/[varianteCursoId]/programas/table/query-keys";
import { MODALIDAD_KEYS } from "@/app/institucion/datos-academicos/modalidades/query-keys";
import { MALLA_KEYS } from "@/app/malla/query-keys";
import { API } from "@/core/api-client";
import type { CreateProgramaEnCursoEscuela } from "@/core/api/programas-cursos-escuela";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { formatDate } from "@/utils";
import { NIVELES_PREFIXES, type Field } from "@/utils/forms";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";

export const programasEnCursoEscuelaParams = {
	update: "actualizarPrograma",
	delete: "eliminarPrograma",
};

type AddProgramaProps = {
	cursoEscuelaId: string;
	cursoEscuelaEstado: boolean;
};

export const cursoEscuelaSchema = z.object<
	ZodInferSchema<
		ReplaceNullableToOptional<
			Omit<CreateProgramaEnCursoEscuela, "cursoEscuelaId">
		>
	>
>({
	registroExterno: z.boolean(),
	programaId: z.string(),
	modalidadId: z.string().optional(),
	mallaId: z.string().optional(),
	nivelDesde: z.number({ coerce: true }).optional(),
	nivelHasta: z.number({ coerce: true }).optional(),
});

export default function AddProgramaEnCursoEscuela({
	cursoEscuelaId,
	cursoEscuelaEstado,
}: AddProgramaProps) {
	const router = useRouter();

	const { form, mutation, open, setOpen } = useMutateModule({
		schema: cursoEscuelaSchema,
		mutationFn: ({ mallaId, modalidadId, nivelDesde, nivelHasta, ...data }) => {
			return API.cursoEscuelas.createProgramaEnCursoEscuela({
				data: {
					...data,
					mallaId: mallaId ?? null,
					modalidadId: modalidadId ?? null,
					nivelDesde: nivelDesde ?? null,
					nivelHasta: nivelHasta ?? null,
				},
				cursoEscuelaId,
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	const { modalidadId, programaId } = form.watch();

	const {
		data: modalidades,
		isLoading: modalidadesAreLoading,
		refetch: fetchModalidades,
	} = useQuery({
		queryKey: MODALIDAD_KEYS.list(""),
		queryFn: () => {
			return API.modalidades.getMany();
		},
		enabled: false,
	});

	const {
		data: programas,
		isLoading: programasAreLoading,
		refetch: fetchProgramas,
	} = useQuery({
		queryKey: PROGRAMAS_KEYS.list(""),
		queryFn: () => {
			return API.programas.getMany();
		},
		enabled: false,
	});

	const {
		data: mallas,
		isLoading: mallasAreLoading,
		refetch: fetchMallas,
	} = useQuery({
		queryKey: MALLA_KEYS.list(JSON.stringify({ modalidadId, programaId })),
		queryFn: () => {
			return API.mallasCurriculares.getMany({
				modalidadId,
				programaId,
			});
		},
		enabled: false,
	});

	if (!cursoEscuelaEstado) return null;

	return (
		<section>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title={`Adicionar programa a de curso`}
				withTrigger
				triggerLabel='Agregar'
			>
				{programaFields.map(f =>
					f.inputType === "checkbox" ? (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={false}
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
					) : f.inputType === "custom-select" ? (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							render={({ field }) => {
								let options:
									| { label: string; value: string }[]
									| string[]
									| undefined = Array.isArray(f.options)
									? f.options
									: undefined;
								let loading;

								if (f.options === "custom") {
									switch (f.name) {
										case "modalidadId": {
											options = modalidades?.data.map(m => ({
												label: m.nombre,
												value: m.id,
											}));

											loading = modalidadesAreLoading;
											break;
										}
										case "programaId": {
											options = programas?.data.map(p => ({
												label: p.nombre,
												value: p.id,
											}));

											loading = programasAreLoading;
											break;
										}
										case "mallaId": {
											options = mallas?.data.map(t => ({
												label: `${programas?.data.find(
													p => p.id === t.programaId,
												)?.nombre} - ${t.modalidad.nombre} - ${formatDate(
													t.fechaAprobacion,
													{
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
													},
												)} - ${formatDate(t.fechaLimiteVigencia, {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												})}`,
												value: t.id,
											}));

											loading = mallasAreLoading;
											break;
										}
									}
								}

								if (f.options === "mallaId") {
									options = NIVELES_PREFIXES.slice(
										0,
										mallas?.data
											.map(m => m.niveles.length)
											.sort((a, b) => b - a)
											.at(0) ?? 0,
									).map((prefix, i) => ({
										value: String(i + 1),
										label: prefix,
									}));
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
												if (f.name === "programaId" && !programas) {
													fetchProgramas();
												}
												if (
													f.name === "mallaId" &&
													!mallas &&
													modalidadId &&
													programaId
												) {
													fetchMallas();
												}
											}}
										>
											<FormControl>
												<SelectTrigger className='col-span-9'>
													<SelectValue className='w-full' />
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
							}}
						/>
					) : null,
				)}
			</MutateModal>
		</section>
	);
}

export const programaFields = [
	{
		name: "registroExterno",
		inputType: "checkbox",
		label: "Para registro externo",
	},
	{
		name: "programaId",
		inputType: "custom-select",
		options: "custom",
		label: "Programa",
	},
	{
		name: "modalidadId",
		inputType: "custom-select",
		options: "custom",
		label: "Modalidad",
	},
	{
		name: "mallaId",
		inputType: "custom-select",
		options: "custom",
		label: "Malla",
	},
	{
		name: "nivelDesde",
		inputType: "custom-select",
		label: "Nivel desde",
		options: "mallaId",
	},
	{
		name: "nivelHasta",
		inputType: "custom-select",
		label: "Nivel hasta",
		options: "mallaId",
	},
] satisfies Field<keyof z.infer<typeof cursoEscuelaSchema>>[];
