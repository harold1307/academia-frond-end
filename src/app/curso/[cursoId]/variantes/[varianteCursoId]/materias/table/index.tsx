"use client";
import React from "react";

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
	const { replaceDelete, searchParams } = useMutateSearchParams();
	const { form, mutation } = useMutateModule({
		schema: createAsignaturaEnVarianteSchema,
		mutationFn: async () => {},
		onSuccess: response => {
			console.log(response);
		},
		onError: error => {
			console.log(error);
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

		modeloEvaluativoId,
		notaMaxima,
		notaMinima,
	} = form.watch();

	return (
		<section>
			<MutateModal
				dialogProps={{
					open: true,
					onOpenChange: open => {
						// if (mutation.isPending) return;
						if (!open) {
							replaceDelete(materiasParams.update);
							return;
						}
					},
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(
					data => console.log("Falta implementar lógica de actualizar", data),
					// mutation.mutate(data)
				)}
				title={`Adicionar Materia en variante de curso ${selectedMateria.asignatura.nombre}`}
				withTrigger
				triggerLabel='Adicionar Materia en variante de curso'
			>
				<div className='flex w-full flex-wrap items-start justify-start gap-8 px-8'>
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
						) : f.inputType === "checkbox" ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={
									f.name === "calificar"
										? !!modeloEvaluativoId ||
											(!modeloEvaluativoId &&
												(notaMaxima !== null || notaMinima !== null))
										: selectedMateria[f.name]
								}
								render={({ field }) => {
									return (
										<FormItem
											className='flex h-16 w-60 items-center justify-between gap-4 space-y-0 rounded-2xl border-2 p-4'
											style={{
												boxShadow: "0 0 20px rgba(67, 84, 234, .7)",
											}}
										>
											<FormLabel className='col-span-3 text-start'>
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
													type={f.inputType}
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
									control={form.control}
									name={f.name}
									key={f.name}
									render={({ field }) => {
										const options = f.options ? f.options : ["A", "B"];
										const selectedOption = options.indexOf(
											selectedMateria[f.name] as string,
										);
										return (
											<FormItem className='grid w-full grid-cols-12 items-center gap-4 space-y-0'>
												<FormLabel className='col-span-3 w-2/12 text-end'>
													{f.label}
												</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={options[selectedOption] as string}
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
														{options.map(o =>
															typeof o === "string" ? (
																<SelectItem value={o} key={o}>
																	{o}
																</SelectItem>
															) : (
																<SelectItem value={o} key={o}>
																	{o}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
											</FormItem>
										);
									}}
								/>
							) : null
						) : ([
								"notaParaAprobar",
								"notaMaxima",
								"cantidadDecimales",
						  ].includes(f.name) &&
								form.getValues("calificar") === true) ||
						  !["notaParaAprobar", "notaMaxima", "cantidadDecimales"].includes(
								f.name,
						  ) ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={selectedMateria[f.name]}
								render={({ field }) => {
									return (
										<FormItem className='flex w-full items-center justify-start gap-2'>
											<FormLabel className='text-md col-span-3 w-[12%] text-start'>
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
													type={f.inputType}
												/>
											</FormControl>
										</FormItem>
									);
								}}
							/>
						) : null,
					)}
					{form.getValues("calificar") === true ? <h1>ola</h1> : null}
				</div>
			</MutateModal>
		</section>
	);
}

function DeactivateMateriasModal({
	materias,
}: {
	materias: AsignaturaEnVarianteCursoFromAPI[];
}) {
	const { searchParams, replaceDelete } = useMutateSearchParams();

	const { mutation } = useMutateModule({
		mutationFn: async () => {},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(materiasParams.deactivate);
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
			description={`Estas seguro que deseas desactivar la variante: ${selectedMateria.asignatura.nombre}`}
			title='Desactivar variante'
			onDelete={() =>
				console.log("falta implementar lógica de delete", selectedMateria)
			}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(materiasParams.deactivate)}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(materiasParams.deactivate);
						return;
					}
				},
			}}
			deleteButtonLabel={mutation.isPending ? "Desactivando..." : "Desactivar"}
		/>
	);
}
