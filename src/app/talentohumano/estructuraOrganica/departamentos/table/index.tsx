"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type DepartamentosTableItem,
	DepartamentosColumns,
	departamentosParams,
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
import { DepartamentosSchema, departamentosFields } from "../add-departamentos";

interface DepartamentosTableProps {
	data: DepartamentosSchema[];
}

export default function DepartamentosTable({ data }: DepartamentosTableProps) {
	const departamentos = React.useMemo(() => {
		return data?.map(
			DepartamentosTable =>
				({
					...DepartamentosTable,
				}) satisfies DepartamentosTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={DepartamentosColumns} data={departamentos} />
			<UpdateDepartamentosModal departamentos={departamentos} />
			<DeactivateDepartamentos departamentos={departamentos} />
		</section>
	);
}

function UpdateDepartamentosModal({ departamentos }: { departamentos: DepartamentosSchema[] }) {
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
		newParams.delete(departamentosParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const departamentosParamsId = React.useMemo(
		() => searchParams.get(departamentosParams.update),
		[searchParams],
	);

	if (!departamentosParamsId) return null;

	const selectedDepartamentos = departamentos.find(i => i.id === departamentosParamsId);

	if (!selectedDepartamentos) {
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
				title={`Editar departamentos ${selectedDepartamentos.departamento}`}
				withTrigger
				triggerLabel='Editar departamentos'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
				 	{departamentosFields.map(f => (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedDepartamentos[f.name]}
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

function DeactivateDepartamentos({ departamentos }: { departamentos: DepartamentosSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(departamentosParams.deactivate);

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

	const departamentosId = React.useMemo(
		() => searchParams.get(departamentosParams.deactivate),
		[searchParams],
	);

	if (!departamentosId) return null;

	const selectedDepartamentos = departamentos.find(i => i.id === departamentosId);

	if (!selectedDepartamentos) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedDepartamentos.departamento}`}
			title='Desactivar variante'
			onDelete={() =>
				console.log("falta implementar lógica de delete", selectedDepartamentos)
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
