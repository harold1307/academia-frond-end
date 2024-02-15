"use client";
import React from "react";
import { DataTable } from "./data-table";
import {
	type ProyectoIntegradorSchema,
	proyectoIntegradorFields,
} from "../add-proyecto-integrador";
import {
	type ProyectoIntegradorTableItem,
	proyectoIntegradorColumns,
	proyectoIntegradorParams,
} from "./columns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutateModule } from "@/hooks/use-mutate-module";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import DeleteModal from "@/app/_components/modals/delete-modal";

interface ProyctoIntegradorTableProps {
	data: ProyectoIntegradorSchema[];
}

export default function ProyectoIntegradorTable({
	data,
}: ProyctoIntegradorTableProps) {
	const proyectosIntegradores = React.useMemo(() => {
		return data?.map(
			proyectoIntegrador =>
				({
					...proyectoIntegrador,
				}) satisfies ProyectoIntegradorTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable
				columns={proyectoIntegradorColumns}
				data={proyectosIntegradores}
			/>
			<UpdateProyectoIntegrador proyectosIntegradores={proyectosIntegradores} />
			<DeactivateProyectorIntegrador
				proyectosIntegradores={proyectosIntegradores}
			/>
		</section>
	);
}

function UpdateProyectoIntegrador({
	proyectosIntegradores,
}: {
	proyectosIntegradores: ProyectoIntegradorSchema[];
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
		newParams.delete(proyectoIntegradorParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const proyectoIntegradorParamsId = React.useMemo(
		() => searchParams.get(proyectoIntegradorParams.update),
		[searchParams],
	);

	if (!proyectoIntegradorParamsId) return null;

	const selectedProyectorIntegrador = proyectosIntegradores.find(
		i => i.id === proyectoIntegradorParamsId,
	);

	if (!selectedProyectorIntegrador) {
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
				title={`Editar proyecto integrador: ${selectedProyectorIntegrador.nombre}`}
				withTrigger
				triggerLabel='Editar proyecto integrador'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{proyectoIntegradorFields.map(f => (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedProyectorIntegrador[f.name]}
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
					))}
				</div>
			</MutateModal>
		</section>
	);
}

function DeactivateProyectorIntegrador({
	proyectosIntegradores,
}: {
	proyectosIntegradores: ProyectoIntegradorSchema[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(proyectoIntegradorParams.deactivate);

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

	const proyectoIntegradorId = React.useMemo(
		() => searchParams.get(proyectoIntegradorParams.deactivate),
		[searchParams],
	);

	if (!proyectoIntegradorId) return null;

	const selectedProyectorIntegrador = proyectosIntegradores.find(
		i => i.id === proyectoIntegradorId,
	);

	if (!selectedProyectorIntegrador) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar el proyecto integrador: ${selectedProyectorIntegrador.nombre}`}
			title='Desactivar Proyecto Integrador'
			onDelete={() =>
				console.log(
					"falta implementar lógica de delete",
					selectedProyectorIntegrador,
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
