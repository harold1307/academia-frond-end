"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import type { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { DataTable } from "@/app/_components/table";
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
import { MODALIDAD_KEYS } from "@/app/institucion/datos-academicos/modalidades/query-keys";
import { MALLA_KEYS } from "@/app/malla/query-keys";
import { API } from "@/core/api-client";
import type { VarianteCursoWithProgramasFromAPI } from "@/core/api/variantes-curso";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { formatDate } from "@/utils";
import { programaFields, varianteCursoSchema } from "../add-programa";
import {
	programasColumns,
	programasEnVarianteParams,
	type ProgramaEnVarianteTableItem,
} from "./columns";
import { PROGRAMAS_KEYS } from "./query-keys";
import { Checkbox } from "@/app/_components/ui/checkbox";

interface ProgramasTableProps {
	data: ProgramaEnVarianteTableItem[];
}

export default function ProgramasEnVarianteTable({
	data,
}: ProgramasTableProps) {
	return (
		<section>
			<DataTable<typeof programasColumns, ProgramaEnVarianteTableItem[]>
				columns={programasColumns}
				data={data}
				hideColumns={{
					id: false,
					varianteEstado: false,
				}}
			/>
		</section>
	);
}

export function UpdateProgramaModal({
	programasEnVariante,
}: {
	programasEnVariante: VarianteCursoWithProgramasFromAPI["programas"];
}) {
	const { router, searchParams, replaceDelete } = useMutateSearchParams();
	const { form, mutation } = useMutateModule({
		schema: varianteCursoSchema.partial(),
		mutationFn: ({
			data,
			id,
		}: {
			data: Partial<z.infer<typeof varianteCursoSchema>>;
			id: string;
		}) => {
			return API.programasVariantesCurso.update({
				data,
				id,
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	const { modalidadId, programaId, mallaId } = form.watch();

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
			console.log({
				modalidadId,
				programaId,
			});
			return API.mallasCurriculares.getMany({
				modalidadId,
				programaId,
			});
		},
		enabled: !!mallaId || (!!modalidadId && !!programaId),
	});

	const programasParamsId = React.useMemo(
		() => searchParams.get(programasEnVarianteParams.update),
		[searchParams],
	);

	React.useEffect(() => {
		const selectedPrograma = programasEnVariante.find(
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
	}, [
		modalidadId,
		programaId,
		mallaId,
		programasParamsId,
		form,
		programasEnVariante,
	]);

	if (!programasParamsId) return null;

	const selectedPrograma = programasEnVariante.find(
		i => i.id === programasParamsId,
	);

	if (!selectedPrograma) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(programasEnVarianteParams.update)}
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
							replaceDelete(programasEnVarianteParams.update);
							return;
						}
					},
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data =>
					mutation.mutate({ data, id: selectedPrograma.id }),
				)}
				title={`Modificar programa de plantilla ${selectedPrograma.programa.nombre}`}
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
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

									return (
										<FormItem className='grid w-full grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 w-2/12 text-end'>
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
				</div>
			</MutateModal>
		</section>
	);
}

export function DeactivateProgramaModal({
	programas,
}: {
	programas: ProgramaEnVarianteTableItem[];
}) {
	const { router, replaceDelete, searchParams } = useMutateSearchParams();

	const { mutation } = useMutateModule({
		// invalidateQueryKey: CURSO_KEYS.lists(),
		mutationFn: (id: string) => {
			return API.programasVariantesCurso.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(programasEnVarianteParams.delete);
			router.refresh();
		},
	});

	const programaId = React.useMemo(
		() => searchParams.get(programasEnVarianteParams.delete),
		[searchParams],
	);

	if (!programaId) return null;

	const selectedPrograma = programas.find(i => i.id === programaId);

	if (!selectedPrograma) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(programasEnVarianteParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el programa: ${selectedPrograma.programa}`}
			title='Eliminar programa de plantilla de curso'
			onDelete={() => mutation.mutate(selectedPrograma.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(programasEnVarianteParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(programasEnVarianteParams.delete);
						return;
					}
				},
			}}
			deleteButtonLabel={mutation.isPending ? "Eliminando..." : "Eliminar"}
		/>
	);
}
