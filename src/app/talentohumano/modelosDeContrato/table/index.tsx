"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type ModeloDeContratoTableItem,
	ModeloDeContratoColumns,
	modeloDeContratoParams,
} from "./columns";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutateModule } from "@/hooks/use-mutate-module";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import DeleteModal from "@/app/_components/modals/delete-modal";
import {
	modeloDeContratoFields,
	type ModeloDeContratoSchema,
} from "../add-modeloDeContrato";

interface ModeloDeContratoTableProps {
	data: ModeloDeContratoSchema[];
}

export default function ModeloDeContratoTable({
	data,
}: ModeloDeContratoTableProps) {
	const modeloDeContrato = React.useMemo(() => {
		return data?.map(
			ModeloDeContratoTable =>
				({
					...ModeloDeContratoTable,
				}) satisfies ModeloDeContratoTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={ModeloDeContratoColumns} data={modeloDeContrato} />
			<UpdateModeloDeContratoModal modeloDeContrato={modeloDeContrato} />
			<DeactivateModeloDeContrato modeloDeContrato={modeloDeContrato} />
		</section>
	);
}

function UpdateModeloDeContratoModal({
	modeloDeContrato,
}: {
	modeloDeContrato: ModeloDeContratoSchema[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation } = useMutateModule({
		// schema,
		mutationFn: async () => {
			//update
		},
		onSuccess: response => {
			console.log(response);
		},
		onError: error => {
			console.log(error);
		},
	});

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(modeloDeContratoParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const modeloDeContratoParamsId = React.useMemo(
		() => searchParams.get(modeloDeContratoParams.update),
		[searchParams],
	);

	if (!modeloDeContratoParamsId) return null;

	const selectedModeloDeContrato = modeloDeContrato.find(
		i => i.id === modeloDeContratoParamsId,
	);

	if (!selectedModeloDeContrato) {
		return <ModalFallback action='update' redirectTo={() => dismissModal()} />;
	}
	return (
		<section>
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
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(
					data => console.log("Falta implementar lógica", data),
					// mutation.mutate(data)
				)}
				title={`Editar modelo de Contrato ${selectedModeloDeContrato.nombredescripcion}`}
				withTrigger
				triggerLabel='Editar modelo de Contrato'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{modeloDeContratoFields.map(f =>
						f.inputType === "checkbox" ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={selectedModeloDeContrato[f.name]}
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
						) : (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={selectedModeloDeContrato[f.name]}
								render={({ field }) => {
									return (
										<FormItem className='flex w-full items-center justify-start gap-2'>
											<FormLabel className='text-md col-span-3 w-[20%] text-start'>
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
						),
					)}
				</div>
			</MutateModal>
		</section>
	);
}

function DeactivateModeloDeContrato({
	modeloDeContrato,
}: {
	modeloDeContrato: ModeloDeContratoSchema[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(modeloDeContratoParams.deactivate);

		router.replace(pathname + "?" + newParams.toString());
	};

	const { mutation } = useMutateModule({
		// invalidateQueryKey: CURSO_KEYS.lists(),
		mutationFn: async () => {},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			dismissModal();
		},
	});

	const modeloDeContratoId = React.useMemo(
		() => searchParams.get(modeloDeContratoParams.deactivate),
		[searchParams],
	);

	if (!modeloDeContratoId) return null;

	const selectedModeloDeContrato = modeloDeContrato.find(
		i => i.id === modeloDeContratoId,
	);

	if (!selectedModeloDeContrato) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedModeloDeContrato.nombredescripcion}`}
			title='Desactivar variante'
			onDelete={() =>
				console.log(
					"falta implementar lógica de delete",
					selectedModeloDeContrato,
				)
			}
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
