"use client"
import React from "react";
import { VariantesTableItem, variantesColumns, variantesParams } from "./columns";

import { DataTable } from "./data-table";

import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { VarianteCurso } from "@prisma/client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { varianteCursoFields } from "../add-variante";
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";

import { DatePickerDemo } from "@/app/_components/date-picker";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { CursoWithVariantes } from "@/core/api/cursos";

interface VarianteTableProps {
	data: CursoWithVariantes
}
export default function VarianteTable({ data }:VarianteTableProps) {


	const variantes = React.useMemo(() => {
		return data?.variantes?.map(
			curso =>
				({
					...curso,
				}) satisfies VariantesTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={variantesColumns} data={variantes} />
			<UpdateVarianteModal variantes={variantes} />
			<DeactivateVarianteModal variantes={variantes}/>
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

	const selectedVariante = variantes.find(i => i.id === varianteParamsId);
	if (!varianteParamsId) return null;


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
									control={form.control}
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
									control={form.control}
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
					{
						form.getValues('verificarEdad') === true ? (
							varianteCursoFields.filter(el => {
								return el.inputType === 'number'
							}).map(f => (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									render={({ field }) => {
										return(
										<FormItem
										className='flex w-full items-center justify-start gap-2'
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
										)
									}}
								/>
							))
						) : (
							null
						)
					}
				</div>
				<div className='flex items-center justify-between gap-8 flex-wrap w-full px-8'>
					{varianteCursoFields.map(f => (
						f.inputType === 'checkbox' ?
						<FormField
							control={form.control}
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


function DeactivateVarianteModal({ variantes }: { variantes: VarianteCurso[] }) {
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
		console.log('falta implementar desactivar', varianteId)
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