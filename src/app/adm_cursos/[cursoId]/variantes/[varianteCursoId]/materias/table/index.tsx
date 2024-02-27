"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import type { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
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
import { ToggleSwitch } from "@/app/_components/ui/toggle";
import { useToast } from "@/app/_components/ui/use-toast";
import { ASIGNATURA_KEYS } from "@/app/asignatura/query-keys";
import { MODELOS_EVALUATIVOS_KEYS } from "@/app/modelosevaluativos/query-keys";
import { API } from "@/core/api-client";
import type { AsignaturaEnVarianteCursoFromAPI } from "@/core/api/variantes-curso";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { assertReferenceInput } from "@/utils/forms";
import {
	createAsignaturaEnVarianteSchema,
	materiaFields,
} from "../add-materia";
import {
	materiasColumns,
	materiasParams,
	type MateriaTableItem,
} from "./columns";
import { DataTable } from "./data-table";

interface MateriasTableProps {
	tableData: MateriaTableItem[];
	data: AsignaturaEnVarianteCursoFromAPI[];
}

export default function MateriasTable({ data, tableData }: MateriasTableProps) {
	return (
		<section className=''>
			<DataTable columns={materiasColumns} data={tableData} />
			<UpdateMateriaModal materias={data} />
			<DeactivateMateriasModal materias={data} />
		</section>
	);
}

function UpdateMateriaModal({
	materias,
}: {
	materias: AsignaturaEnVarianteCursoFromAPI[];
}) {
	const { replaceDelete, searchParams, router } = useMutateSearchParams();
	const { toast } = useToast();

	const { form, mutation } = useMutateModule({
		schema: createAsignaturaEnVarianteSchema.partial(),
		mutationFn: ({
			data,
			materiaId,
		}: {
			data: Partial<z.infer<typeof createAsignaturaEnVarianteSchema>>;
			materiaId: string;
		}) => {
			return API.asignaturasEnVariantesCurso.update({ id: materiaId, data });
		},
		onSuccess: response => {
			console.log(response);
			replaceDelete(materiasParams.update);
			router.refresh();
		},
		onError: error => {
			console.log(error);
			toast({
				title: "Error al actualizar materia",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const { data: asignaturas, isFetching: asignaturasAreLoading } = useQuery({
		queryKey: ASIGNATURA_KEYS.lists(),
		queryFn: () => {
			return API.asignaturas.getMany();
		},
	});

	const { data: modelosEvaluativos, isFetching: modelosEvaluativosAreLoading } =
		useQuery({
			queryKey: MODELOS_EVALUATIVOS_KEYS.lists(),
			queryFn: () => {
				return API.modelosEvaluativos.getMany();
			},
		});

	const materiaParamsId = React.useMemo(
		() => searchParams.get(materiasParams.update),
		[searchParams],
	);

	const selectedMateria = materias.find(i => i.id === materiaParamsId);
	if (!materiaParamsId) return null;

	if (!selectedMateria) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(materiasParams.update)}
			/>
		);
	}

	const {
		horasAsistidasDocente,
		horasAutonomas,
		horasColaborativas,
		horasPracticas,
		calificar,

		modeloEvaluativoId,
		notaMaxima,
		notaMinima,
	} = form.watch();

	return (
		<section>
			<MutateModal
				dialogProps={{
					defaultOpen: true,
					onOpenChange: open => {
						if (mutation.isPending) return;
						if (!open) {
							replaceDelete(materiasParams.update);
							return;
						}
					},
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data =>
					mutation.mutate({ data, materiaId: selectedMateria.id }),
				)}
				title={`Actualizar materia en variante de curso ${selectedMateria.asignatura.nombre}`}
			>
				{materiaFields.map(f =>
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
										f.name === "reference-horas"
											? (horasColaborativas ?? 0) +
												(horasAsistidasDocente ?? 0) +
												(horasAutonomas ?? 0) +
												(horasPracticas ?? 0)
											: f.name === "reference-horasDocencia"
												? (horasColaborativas ?? 0) +
													(horasAsistidasDocente ?? 0)
												: (horasAutonomas ?? 0) + (horasPracticas ?? 0)
									}
									className='col-span-9'
									disabled={true}
								/>
							</FormControl>
						</FormItem>
					) : f.inputType === "checkbox" ? (
						<FormField
							defaultValue={
								f.name === "calificar"
									? !!selectedMateria.modeloEvaluativoId ||
										!!selectedMateria.notaMinima
									: selectedMateria[f.name]
							}
							control={form.control}
							name={f.name}
							key={f.name}
							render={({ field }) => {
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
							}}
						/>
					) : f.inputType === "custom-select" ? (
						(f.name === "modeloEvaluativoId" &&
							form.getValues("calificar") === true) ||
						f.name !== "modeloEvaluativoId" ? (
							<FormField
								defaultValue={selectedMateria[f.name]}
								control={form.control}
								name={f.name}
								key={
									f.name === "modeloEvaluativoId" ? f.name + calificar : f.name
								}
								rules={{
									required: true,
								}}
								render={({ field }) => {
									let options:
										| { label: string; value: string }[]
										| string[]
										| undefined = undefined;
									let loading;

									if (f.name === "asignaturaId") {
										options = asignaturas?.data.map(a => ({
											value: a.id,
											label: a.nombre,
										}));

										loading = asignaturasAreLoading;
									}

									if (f.name === "modeloEvaluativoId") {
										options = modelosEvaluativos?.data.map(a => ({
											value: a.id,
											label: a.nombre,
										}));

										loading = modelosEvaluativosAreLoading;
									}

									return (
										<FormItem className='grid w-full grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												disabled={field.disabled}
												defaultValue={selectedMateria[f.name] ?? ""}
											>
												<FormControl>
													<SelectTrigger className='col-span-9'>
														<SelectValue
															placeholder={
																loading ? "Cargando opciones..." : f.placeholder
															}
															className='w-full'
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{loading
														? "Cargando opciones..."
														: options?.length
															? options.map(o => (
																	<SelectItem value={o.value} key={o.value}>
																		{o.label}
																	</SelectItem>
																))
															: "No hay resultados"}
												</SelectContent>
											</Select>
										</FormItem>
									);
								}}
							/>
						) : null
					) : (["notaMaxima", "notaMinima", "cantidadDecimales"].includes(
							f.name,
					  ) &&
							form.getValues("calificar") === true) ||
					  !["notaMaxima", "notaMinima", "cantidadDecimales"].includes(
							f.name,
					  ) ? (
						<FormField
							defaultValue={selectedMateria[f.name]}
							control={form.control}
							name={f.name}
							key={
								["notaMaxima", "notaMinima", "cantidadDecimales"].includes(
									f.name,
								)
									? f.name + calificar
									: f.name
							}
							render={({ field }) => {
								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={e => field.onChange(+e.target.value)}
												value={field.value ?? undefined}
												type={f.inputType}
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					) : null,
				)}
				{/* {form.getValues("calificar") === true ? <h1>ola</h1> : null} */}
			</MutateModal>
		</section>
	);
}

function DeactivateMateriasModal({
	materias,
}: {
	materias: AsignaturaEnVarianteCursoFromAPI[];
}) {
	const { searchParams, replaceDelete, router } = useMutateSearchParams();
	const { toast } = useToast();

	const { mutation } = useMutateModule({
		mutationFn: (id: string) => {
			return API.asignaturasEnVariantesCurso.deleteById(id);
		},
		onSuccess: response => {
			console.log(response);
			replaceDelete(materiasParams.deactivate);
			router.refresh();
		},
		onError: error => {
			console.log(error);
			toast({
				title: "Error al eliminar materia",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const materiaId = React.useMemo(
		() => searchParams.get(materiasParams.deactivate),
		[searchParams],
	);

	if (!materiaId) return null;

	const selectedMateria = materias.find(i => i.id === materiaId);

	if (!selectedMateria) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(materiasParams.deactivate)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la la asignatura en variante de curso: ${selectedMateria.asignatura.nombre}`}
			title='Eliminar la asignatura en variante de curso'
			onDelete={() => mutation.mutate(selectedMateria.id)}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(materiasParams.deactivate)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(materiasParams.deactivate);
						return;
					}
				},
			}}
			deleteButtonLabel={mutation.isPending ? "Eliminando..." : "Eliminar"}
		/>
	);
}
