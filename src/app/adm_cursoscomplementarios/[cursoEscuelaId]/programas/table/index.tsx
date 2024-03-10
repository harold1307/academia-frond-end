"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import type { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { DataTable } from "@/app/_components/table";
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
import type { CursoEscuelaWithProgramasFromAPI } from "@/core/api/curso-escuelas";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { formatDate } from "@/utils";
import {
	cursoEscuelaSchema,
	programaFields,
	programasEnCursoEscuelaParams,
} from "../add-programa";
import { columns, type ProgramaEnCursoEscuelaTableItem } from "./columns";
import { NIVELES_PREFIXES } from "@/utils/forms";

interface ProgramasTableProps {
	data: ProgramaEnCursoEscuelaTableItem[];
}

export default function ProgramasEnCursoEscuelaTable({
	data,
}: ProgramasTableProps) {
	return (
		<section>
			<DataTable<typeof columns, ProgramaEnCursoEscuelaTableItem[]>
				columns={columns}
				data={data}
				hideColumns={{
					id: false,
					cursoEscuelaEstado: false,
				}}
			/>
		</section>
	);
}

export function UpdateProgramaModal({
	programasEnCursoEscuela,
}: {
	programasEnCursoEscuela: CursoEscuelaWithProgramasFromAPI["programas"];
}) {
	const { router, searchParams, replaceDelete } = useMutateSearchParams();
	const { form, mutation } = useMutateModule({
		schema: cursoEscuelaSchema.partial(),
		mutationFn: ({
			data,
			id,
		}: {
			data: Partial<z.infer<typeof cursoEscuelaSchema>>;
			id: string;
		}) => {
			return API.programasCursosEscuela.update({
				data,
				id,
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	const { modalidadId, programaId, mallaId, nivelDesde, nivelHasta } =
		form.watch();

	const {
		data: modalidades,
		isLoading: modalidadesAreLoading,
		refetch: fetchModalidades,
	} = useQuery({
		queryKey: MODALIDAD_KEYS.list(""),
		queryFn: () => {
			return API.modalidades.getMany();
		},
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
		enabled: !!mallaId || (!!modalidadId && !!programaId),
	});

	const programasParamsId = React.useMemo(
		() => searchParams.get(programasEnCursoEscuelaParams.update),
		[searchParams],
	);

	React.useEffect(() => {
		const selectedPrograma = programasEnCursoEscuela.find(
			i => i.id === programasParamsId,
		);

		if (modalidadId === undefined && selectedPrograma?.modalidadId) {
			form.setValue("modalidadId", selectedPrograma.modalidadId);
		}

		if (programaId === undefined && selectedPrograma?.programaId) {
			form.setValue("programaId", selectedPrograma.programaId);
		}

		if (mallaId === undefined && selectedPrograma?.mallaId) {
			form.setValue("mallaId", selectedPrograma.mallaId);
		}

		if (nivelDesde === undefined && selectedPrograma?.nivelDesde) {
			form.setValue("nivelDesde", selectedPrograma.nivelDesde);
		}

		if (nivelHasta === undefined && selectedPrograma?.nivelHasta) {
			form.setValue("nivelHasta", selectedPrograma.nivelHasta);
		}
	}, [
		modalidadId,
		programaId,
		mallaId,
		nivelDesde,
		nivelHasta,
		programasParamsId,
		form,
		programasEnCursoEscuela,
	]);

	if (!programasParamsId) return null;

	const selectedPrograma = programasEnCursoEscuela.find(
		i => i.id === programasParamsId,
	);

	if (!selectedPrograma) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(programasEnCursoEscuelaParams.update)}
			/>
		);
	}

	return (
		<section>
			<MutateModal
				dialogProps={{
					defaultOpen: true,
					onOpenChange: open => {
						if (mutation.isPending) return;
						if (!open) {
							replaceDelete(programasEnCursoEscuelaParams.update);
							return;
						}
					},
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data =>
					mutation.mutate({ data, id: selectedPrograma.id }),
				)}
				title={`Modificar programa de curso ${selectedPrograma.programa.nombre}`}
			>
				{programaFields.map(f =>
					f.inputType === "checkbox" ? (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedPrograma[f.name]}
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
							defaultValue={selectedPrograma[f.name] ?? undefined}
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

									console.log({
										options,
										nivelDesde,
										nivelHasta,
										fromField: field.value,
									});
								}

								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={String(field.value)}
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

export function DeactivateProgramaModal({
	programas,
}: {
	programas: ProgramaEnCursoEscuelaTableItem[];
}) {
	const { router, replaceDelete, searchParams } = useMutateSearchParams();

	const { mutation } = useMutateModule({
		// invalidateQueryKey: CURSO_KEYS.lists(),
		mutationFn: (id: string) => {
			return API.programasCursosEscuela.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(programasEnCursoEscuelaParams.delete);
			router.refresh();
		},
	});

	const programaId = React.useMemo(
		() => searchParams.get(programasEnCursoEscuelaParams.delete),
		[searchParams],
	);

	if (!programaId) return null;

	const selectedPrograma = programas.find(i => i.id === programaId);

	if (!selectedPrograma) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(programasEnCursoEscuelaParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el programa: ${selectedPrograma.programa}`}
			title='Eliminar programa de curso'
			onDelete={() => mutation.mutate(selectedPrograma.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(programasEnCursoEscuelaParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(programasEnCursoEscuelaParams.delete);
						return;
					}
				},
			}}
			deleteButtonLabel={mutation.isPending ? "Eliminando..." : "Eliminar"}
		/>
	);
}
