"use client"
import React from "react";
import { VariantesTableItem, variantesColumns, variantesParams } from "./columns";

import { DataTable } from "./data-table";

import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { VarianteCurso } from "@prisma/client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { z } from "zod";
import { API } from "@/core/api-client";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { varianteCursoFields, varianteCursoSchema } from "../add-variante";
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";

//MockUp
import { MUVariantes as data, isLoading } from "@/utils/mockupData";
import { useQuery } from "@tanstack/react-query";
import { VARIANTES_KEYS } from "../query-keys";
import { DatePickerDemo } from "@/app/_components/date-picker";
import { CreateVarianteCurso } from "@/core/api/cursos";
import { ZodInferSchema } from "@/utils/types";
import { AnyNaptrRecord } from "dns";
import DeleteModal from "@/app/_components/modals/delete-modal";

interface VarianteTableProps {
	cursoId: string
}
export default function VarianteTable({ cursoId }:VarianteTableProps) {

	const { isLoading, data } = useQuery({
		
		queryKey: VARIANTES_KEYS.lists(),
		queryFn: async () => {
			const data = await API.cursos.getCursoWithVariantesByCursoId(cursoId);

			return data.data;
		},
	});

	const variantes = React.useMemo(() => {
		return data?.variantes?.map(
			curso =>
				({
					...curso,
				}) satisfies VariantesTableItem,
		);
	}, [data]);

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !variantes) {
		return "WTF";
	}

	if (!variantes) return "Ha ocurrido un error en el fetch";

	return (
		<section className=''>
			<DataTable columns={variantesColumns} data={variantes} />
			<UpdateVarianteModal variantes={variantes} />
			<DeactivateVariatneModal variantes={variantes}/>
		</section>
	);
}


// const schema = z.object<any>

function UpdateVarianteModal({ variantes }: { variantes: VarianteCurso[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation } = useMutateModule({
		// schema,
		mutationFn: async () => {

		},
		onSuccess: (response) => {
			console.log(response)
		},
		onError: (error) => {
			console.log(error)
		}

	})

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(variantesParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};


	const varianteParamsId = React.useMemo(
		() => searchParams.get(variantesParams.update),
		[searchParams],
	);

	if (!varianteParamsId) return null;

	const selectedVariante = variantes.find(i => i.id === varianteParamsId);

	if (!selectedVariante) {
		return <ModalFallback action='update' redirectTo={() => dismissModal()} />;
	}
	return (
		<section>
			{/* <h1 className='text-2xl font-semibold'>Adicionar variante de curso</h1> */}
			<MutateModal
				dialogProps={{
					open: true,
					onOpenChange: open => {
						// if (mutation.isPending) return;
						if (!open) {
							dismissModal();
							return;
						}
					},
				}}
				disabled={false}
				form={form}
				onSubmit={
					form.handleSubmit(data => console.log('falta implementar actualizar: ', data))
				}
				title={`Adicionar variante de curso ${selectedVariante.nombre}`}
				withTrigger
				triggerLabel='Adicionar variante de curso'
			>
				<div className='mb-10 flex flex-col items-center justify-center gap-6 px-8'>
					{varianteCursoFields.map(f =>
						f.inputType === "text" ? (
							f.name === 'fechaAprobacion' ? (
								<FormField
									// control={form.control}
									name={f.name}
									key={f.name}
									defaultValue={selectedVariante[f.name] || undefined}
									render={({ field }) => {
										return (
											<FormItem className='flex w-full items-center justify-start gap-2'>
												<FormLabel className='text-md col-span-3 w-[12%] text-start'>
													{f.label}
												</FormLabel>
												<FormControl>
													<DatePickerDemo value={field.value} onChangeValue={field.onChange} />
												</FormControl>
											</FormItem>
										);
									}}
								/>
							) : (
								<FormField
									// control={form.control}
									name={f.name}
									key={f.name}
									defaultValue={selectedVariante[f.name] || undefined}
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
							) 
						) : null
					)}
				</div>
				<div className='flex items-center justify-between gap-8 flex-wrap w-full px-8'>
					{varianteCursoFields.map(f => (
						f.inputType === 'checkbox' ?
						<FormField
							// control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedVariante[f.name] || undefined}
							render={({ field }) => {
								return(
								<FormItem
								 className='flex justify-between items-center gap-4 space-y-0 border-2 rounded-2xl w-60 h-16 p-4'
								 style={{
									boxShadow: '0 0 20px rgba(67, 84, 234, .7)'
								 }}
								>
									<FormLabel className='col-span-3 text-start'>
										{f.label}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											defaultChecked={selectedVariante[f.name]}
											type={f.inputType}
										/>
									</FormControl>
								</FormItem>
								)
							}}
						/>
						: null
					))}
				</div>
			</MutateModal>
		</section>
	);
}


function DeactivateVariatneModal({ variantes }: { variantes: VarianteCurso[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(variantesParams.deactivate);

		router.replace(pathname + "?" + newParams.toString());
	};

	const { mutation } = useMutateModule({
		// invalidateQueryKey: CURSO_KEYS.lists(),
		mutationFn: async () => {
			
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			dismissModal();
		},
	});

	const varianteId = React.useMemo(
		() => searchParams.get(variantesParams.deactivate),
		[searchParams],
	);

	if (!varianteId) return null;

	const selectedVariante = variantes.find(i => i.id === varianteId);

	if (!selectedVariante) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}
	const faltaDesactivar = () => {
		console.log('falta implementar desactivar')
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedVariante.nombre}`}
			title='Desactivar variante'
			onDelete={faltaDesactivar}
			disabled={mutation.isPending}
			onClose={() => dismissModal()}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						dismissModal();
						return;
					}
				},
			}}
			deleteButtonLabel={mutation.isPending ? "Desactivando..." : "Desactivar"}
		/>
	);
}