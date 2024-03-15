"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type FuncionesTableItem,
	FuncionesColumns,
	funcionesParams,
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
import { FuncionesSchema, funcionesFields } from "../add-funciones";

interface PersonalTableProps {
	data: FuncionesSchema[];
}

export default function PersonalTable({ data }: PersonalTableProps) {
	const personal = React.useMemo(() => {
		return data?.map(
			PersonalTable =>
				({
					...PersonalTable,
				}) satisfies FuncionesTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={FuncionesColumns} data={personal} />
			<UpdatePersonalModal personal={personal} />
			<DeactivatePersonal personal={personal} />
		</section>
	);
}

function UpdatePersonalModal({ personal }: { personal: FuncionesSchema[] }) {
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
		newParams.delete(funcionesParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const funcionesParamsId = React.useMemo(
		() => searchParams.get(funcionesParams.update),
		[searchParams],
	);

	if (!funcionesParamsId) return null;

	const selectedFunciones = personal.find(i => i.id === funcionesParamsId);

	if (!selectedFunciones) {
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
				title={`Editar Personal ${selectedFunciones.funcion}`}
				withTrigger
				triggerLabel='Editar Personal'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{funcionesFields.map(f => (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedFunciones[f.name]}
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
					))}
				</div>
			</MutateModal>
		</section>
	);
}

function DeactivatePersonal({ personal }: { personal: FuncionesSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(funcionesParams.deactivate);

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

	const funcionesId = React.useMemo(
		() => searchParams.get(funcionesParams.deactivate),
		[searchParams],
	);

	if (!funcionesId) return null;

	const selectedFunciones = personal.find(i => i.id === funcionesId);

	if (!selectedFunciones) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedFunciones.funcion}`}
			title='Desactivar variante'
			onDelete={() =>
				console.log("falta implementar lógica de delete", selectedFunciones)
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
