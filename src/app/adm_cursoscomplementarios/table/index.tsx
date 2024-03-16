"use client";
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
import { Calendar } from "@/app/_components/ui/calendar";
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
import { useAppContext } from "@/app/app-context";
import { PARALELO_KEYS } from "@/app/institucion/datos-academicos/paralelos/query-keys";
import { SESIONES_KEYS } from "@/app/institucion/datos-academicos/sesiones/query-keys";
import { API } from "@/core/api-client";
import type {
	CreateCursoEscuela,
	CursoEscuelaFromAPI,
} from "@/core/api/curso-escuelas";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { cn } from "@/utils";
import type { Field } from "@/utils/forms";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../_components/ui/popover";
import { cursosEscuelaParams } from "../add-curso-escuela";
import { CURSO_ESCUELA_KEYS } from "../query-keys";
import { columns, type CursoEscuelaTableItem } from "./columns";

// export type CursoEscuelaTableProps = {
// 	data: CursoEscuelaTableItem[];
// };

// export function CursoTable({ data }: CursoEscuelaTableProps) {
export function CursoEscuelaTable() {
	const { selectedPeriodoId } = useAppContext();

	const { data: cursos } = useQuery({
		queryKey: CURSO_ESCUELA_KEYS.list(JSON.stringify({ selectedPeriodoId })),
		queryFn: () => {
			if (!selectedPeriodoId) return;

			return API.cursoEscuelas.getMany({
				filters: { periodoId: selectedPeriodoId },
			});
		},
		enabled: selectedPeriodoId !== undefined,
		select: data => {
			if (!data) return data;

			return data.data.map(
				c =>
					({
						...c,
						autoregistro: false,
						cursoCodigoSesion: {
							curso: c.nombre,
							codigo: c.codigo || "",
							sesion: c.tema,
						},
						inicioFinLimite: {
							inicio: c.fechaInicio,
							fin: c.fechaFin,
							limite: c.fechaLimiteRegistro,
						},
						profesoresAulasParaleloNivel: {
							profesores: [],
							aulas: [],
							paralelos: c.paraleloId,
							nivel: "",
						},
						cupo: c.cupos || 0,
						costo: false,
						diasVencimiento: c.diasLimitePago,
						especificaEdad: c.edadMaxima !== null,
						registrados: 0,
						retirados: 0,
						materias: 0,
						preRequisito: c.cumpleRequisitosMalla,
						legalizar: c.legalizarMatriculas,
						evaluacion: c.evaluaProfesor,
					}) satisfies CursoEscuelaTableItem,
			);
		},
	});

	if (!cursos) return "Cargando tabla...";

	return (
		<section>
			<DataTable<typeof columns, CursoEscuelaTableItem[]>
				columns={columns}
				data={cursos}
				hideColumns={{
					id: false,
					estado: false,
				}}
			/>
			<DeactivateCursoEscuela cursos={cursos} />
			<DeleteCursoEscuela cursos={cursos} />
			<CloneCursoEscuela cursos={cursos} />
		</section>
	);
}

// const schema = z.object<
// 	ZodInferSchema<Parameters<typeof API.cursoEscuelas.update>[0]["data"]>
// >({
// 	nombre: z.string().optional(),
// 	estado: z.boolean().optional(),
// });

// export function UpdateCursoModal({ cursos }: { cursos: CursoEscuelaFromAPI[] }) {
// 	const { searchParams, replaceDelete, router } = useMutateSearchParams();

// 	const { form, mutation } = useMutateModule({
// 		schema,
// 		mutationFn: async ({
// 			id,
// 			data,
// 		}: {
// 			id: string;
// 			data: z.infer<typeof schema>;
// 		}) => {
// 			return API.cursos.update({
// 				id,
// 				data: data,
// 			});
// 		},
// 		onError: console.error,
// 		onSuccess: response => {
// 			console.log({ response });
// 			replaceDelete(cursosEscuelaParams.update);
// 			router.refresh();
// 		},
// 	});

// 	const paramCursoId = React.useMemo(
// 		() => searchParams.get(cursosEscuelaParams.update),
// 		[searchParams],
// 	);

// 	if (!paramCursoId) return null;

// 	const selectedCurso = cursos.find(i => i.id === paramCursoId);

// 	if (!selectedCurso) {
// 		return (
// 			<ModalFallback
// 				action='update'
// 				redirectTo={() => replaceDelete(cursosEscuelaParams.update)}
// 			/>
// 		);
// 	}

// 	return (
// 		<MutateModal
// 			form={form}
// 			title='Actualizar curso'
// 			disabled={mutation.isPending}
// 			onSubmit={form.handleSubmit(data =>
// 				mutation.mutate({ data, id: paramCursoId }),
// 			)}
// 			dialogProps={{
// 				defaultOpen: true,
// 				onOpenChange: open => {
// 					if (mutation.isPending) return;
// 					if (!open) {
// 						replaceDelete(cursosEscuelaParams.update);
// 						return;
// 					}
// 				},
// 			}}
// 		>
// 			{fields.map(f => (
// 				<FormField
// 					control={form.control}
// 					name={f.name}
// 					key={f.name}
// 					defaultValue={selectedCurso[f.name] || undefined}
// 					render={({ field }) => (
// 						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
// 							<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
// 							<FormControl>
// 								<Input
// 									{...field}
// 									value={field.value || undefined}
// 									type={f.inputType}
// 									className='col-span-9'
// 								/>
// 							</FormControl>
// 						</FormItem>
// 					)}
// 				/>
// 			))}
// 		</MutateModal>
// 	);
// }

export function DeactivateCursoEscuela({
	cursos,
}: {
	cursos: CursoEscuelaFromAPI[];
}) {
	const { searchParams, replaceDelete, router } = useMutateSearchParams();

	const { mutation } = useMutateModule({
		invalidateQueryKey: CURSO_ESCUELA_KEYS.all,
		mutationFn: ({ id, estado }: { id: string; estado: boolean }) => {
			return API.cursos.update({
				id,
				data: {
					estado: !estado,
				},
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cursosEscuelaParams.deactivate);
			router.refresh();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosEscuelaParams.deactivate),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(cursosEscuelaParams.deactivate)}
			/>
		);
	}

	const config = selectedCurso.estado
		? {
				action: "desactivar",
				upperAction: "Desactivar",
				pendingAction: "Desactivando...",
			}
		: {
				action: "activar",
				upperAction: "Activar",
				pendingAction: "Activando...",
			};

	return (
		<DeleteModal
			description={`Estas seguro que deseas ${config.action} el curso: ${selectedCurso.nombre}`}
			title={`${config.upperAction} curso`}
			onDelete={() =>
				mutation.mutate({ id: selectedCurso.id, estado: selectedCurso.estado })
			}
			disabled={mutation.isPending}
			onClose={() => replaceDelete(cursosEscuelaParams.deactivate)}
			dialogProps={{
				open: !!paramCursoId,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(cursosEscuelaParams.deactivate);
						return;
					}
				},
			}}
			deleteButtonLabel={
				mutation.isPending ? config.pendingAction : config.upperAction
			}
		/>
	);
}

export function DeleteCursoEscuela(props: { cursos: CursoEscuelaFromAPI[] }) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();

	const {
		mutation: { mutate, isPending },
	} = useMutateModule({
		invalidateQueryKey: CURSO_ESCUELA_KEYS.all,
		mutationFn: (id: string) => {
			return API.cursos.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cursosEscuelaParams.delete);
			router.refresh();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosEscuelaParams.delete),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = props.cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(cursosEscuelaParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el curso: ${selectedCurso.nombre}`}
			title='Eliminar curso'
			onDelete={() => mutate(selectedCurso.id)}
			disabled={isPending}
			onClose={() => replaceDelete(cursosEscuelaParams.delete)}
			dialogProps={{
				open: !!paramCursoId,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(cursosEscuelaParams.delete);
						return;
					}
				},
			}}
		/>
	);
}

const cloneSchema = z.object<
	ZodInferSchema<
		ReplaceNullableToOptional<
			Pick<
				CreateCursoEscuela,
				| "nombre"
				| "codigo"
				| "paraleloId"
				| "sesionId"
				| "fechaFin"
				| "fechaInicio"
				| "fechaLimiteRegistro"
			>
		>
	>
>({
	nombre: z.string(),
	codigo: z.string().optional(),
	paraleloId: z.string().min(1),
	sesionId: z.string().min(1),
	fechaFin: z.string(),
	fechaInicio: z.string(),
	fechaLimiteRegistro: z.string(),
});

export function CloneCursoEscuela({
	cursos,
}: {
	cursos: CursoEscuelaFromAPI[];
}) {
	const { searchParams, replaceDelete, router } = useMutateSearchParams();

	const { form, mutation } = useMutateModule({
		schema: cloneSchema,
		invalidateQueryKey: CURSO_ESCUELA_KEYS.all,
		mutationFn: ({
			clonedCurso,
			data,
		}: {
			clonedCurso: CursoEscuelaFromAPI;
			data: z.infer<typeof cloneSchema>;
		}) => {
			return API.cursoEscuelas.create({
				...clonedCurso,
				...data,
				codigo: data.codigo ?? null,
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cursosEscuelaParams.clone);
			router.refresh();
		},

		hookFormProps: {
			defaultValues: {
				paraleloId: "",
				sesionId: "",
			},
		},
	});

	const {
		data: paralelos,
		refetch: fetchParalelos,
		isLoading: paralelosAreLoading,
	} = useQuery({
		queryKey: PARALELO_KEYS.lists(),
		queryFn: () => API.paralelos.getMany(),
		enabled: false,
	});

	const {
		data: sesiones,
		refetch: fetchSesiones,
		isLoading: sesionesAreLoading,
	} = useQuery({
		queryKey: SESIONES_KEYS.lists(),
		queryFn: () => API.sesiones.getMany(),
		enabled: false,
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosEscuelaParams.clone),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return (
			<ModalFallback
				action='clonar'
				redirectTo={() => replaceDelete(cursosEscuelaParams.clone)}
			/>
		);
	}

	return (
		<MutateModal
			form={form}
			title='Clonar curso'
			disabled={mutation.isPending}
			onSubmit={form.handleSubmit(data =>
				mutation.mutate({ data, clonedCurso: selectedCurso }),
			)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						replaceDelete(cursosEscuelaParams.clone);
						return;
					}
				},
			}}
		>
			{cloneFields.map(f => (
				<FormField
					control={form.control}
					name={f.name}
					key={f.name}
					defaultValue={selectedCurso[f.name] ?? undefined}
					render={({ field }) => {
						if (f.inputType === "custom-date") {
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
												onSelect={date => field.onChange(date?.toISOString())}
												disabled={date => date < new Date() || !!field.disabled}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</FormItem>
							);
						}

						if (f.inputType === "custom-select") {
							let options:
								| { label: string; value: string }[]
								| string[]
								| undefined = Array.isArray(f.options) ? f.options : undefined;
							let loading;

							switch (f.name) {
								case "paraleloId": {
									options = paralelos?.data.map(m => ({
										label: m.nombre,
										value: m.id,
									}));

									loading = paralelosAreLoading;
									break;
								}
								case "sesionId": {
									options = sesiones?.data.map(t => ({
										label: t.nombre,
										value: t.id,
									}));

									loading = sesionesAreLoading;
									break;
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
											if (f.name === "paraleloId" && !paralelos) {
												fetchParalelos();
											}
											if (f.name === "sesionId" && !sesiones) {
												fetchSesiones();
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
						}

						return (
							<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
								<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || undefined}
										type={f.inputType}
										className='col-span-9'
									/>
								</FormControl>
							</FormItem>
						);
					}}
				/>
			))}
		</MutateModal>
	);
}

const cloneFields = [
	{ name: "nombre", label: "Nombre", inputType: "text" },
	{ name: "codigo", label: "Codigo", inputType: "text" },
	{
		name: "paraleloId",
		label: "Paralelo",
		inputType: "custom-select",
		options: "custom",
	},
	{
		name: "sesionId",
		label: "Sesion",
		inputType: "custom-select",
		options: "custom",
	},
	{ name: "fechaFin", label: "Fecha Fin", inputType: "custom-date" },
	{ name: "fechaInicio", label: "Fecha Inicio", inputType: "custom-date" },
	{
		name: "fechaLimiteRegistro",
		label: "Fecha Limite Registro",
		inputType: "custom-date",
	},
] satisfies Field<keyof z.infer<typeof cloneSchema>>[];
