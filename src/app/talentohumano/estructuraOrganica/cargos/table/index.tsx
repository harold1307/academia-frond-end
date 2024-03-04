"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type CargosTableItem,
	CargosColumns,
	cargosParams,
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
import { CargosSchema, cargosFields } from "../add-cargos";

interface CargosTableProps {
	data: CargosSchema[];
}

export default function CargosTable({ data }: CargosTableProps) {
	const cargos = React.useMemo(() => {
		return data?.map(
			CargosTable =>
				({
					...CargosTable,
				}) satisfies CargosTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={CargosColumns} data={cargos} />
			<UpdateCargosModal cargos={cargos} />
			<DeactivateCargos cargos={cargos} />
		</section>
	);
}

function UpdateCargosModal({ cargos }: { cargos: CargosSchema[] }) {
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
		newParams.delete(cargosParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const cargosParamsId = React.useMemo(
		() => searchParams.get(cargosParams.update),
		[searchParams],
	);

	if (!cargosParamsId) return null;

	const selectedCargos = cargos.find(i => i.id === cargosParamsId);

	if (!selectedCargos) {
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
				title={`Editar cargos ${selectedCargos.cargos}`}
				withTrigger
				triggerLabel='Editar cargos'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
				 	{cargosFields.map(f => (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedCargos[f.name]}
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

function DeactivateCargos({ cargos }: { cargos: CargosSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(cargosParams.deactivate);

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

	const cargosId = React.useMemo(
		() => searchParams.get(cargosParams.deactivate),
		[searchParams],
	);

	if (!cargosId) return null;

	const selectedCargos = cargos.find(i => i.id === cargosId);

	if (!selectedCargos) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedCargos.cargos}`}
			title='Desactivar variante'
			onDelete={() =>
				console.log("falta implementar lógica de delete", selectedCargos)
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
