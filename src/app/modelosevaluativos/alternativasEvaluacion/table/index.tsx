"use client";
import React from "react";
import { DataTable } from "./data-table";
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
import {
	AlternativasEvaluacionSchema,
	alternativaEvaluacionFields,
} from "../add-alternativas-evaluacion";
import {
	AlternativaEvaluacionTableItem,
	alternativaEvaluacionColumns,
	alternativaEvaluacionParams,
} from "./columns";

interface AlternativaEvaluacionTableProps {
	data: AlternativasEvaluacionSchema[];
}

export default function AlternativaEvaluacionTable({
	data,
}: AlternativaEvaluacionTableProps) {
	const alternativasEvaluaciones = React.useMemo(() => {
		return data?.map(
			alternativaEvaluacion =>
				({
					...alternativaEvaluacion,
				}) satisfies AlternativaEvaluacionTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable
				columns={alternativaEvaluacionColumns}
				data={alternativasEvaluaciones}
			/>
			<UpdateAlternativaEvaluacion
				alternativasEvaluaciones={alternativasEvaluaciones}
			/>
			<DeactivateAlternativaEvaluacion
				alternativasEvaluaciones={alternativasEvaluaciones}
			/>
		</section>
	);
}

function UpdateAlternativaEvaluacion({
	alternativasEvaluaciones,
}: {
	alternativasEvaluaciones: AlternativasEvaluacionSchema[];
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
		newParams.delete(alternativaEvaluacionParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const alternativaEvaluacionId = React.useMemo(
		() => searchParams.get(alternativaEvaluacionParams.update),
		[searchParams],
	);

	if (!alternativaEvaluacionId) return null;

	const selectedAlternativaEvaluacion = alternativasEvaluaciones.find(
		i => i.id === alternativaEvaluacionId,
	);

	if (!selectedAlternativaEvaluacion) {
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
				title={`Editar alternativa evaluación: ${selectedAlternativaEvaluacion.nombre}`}
				withTrigger
				triggerLabel='Editar alternativa evaluacion'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{alternativaEvaluacionFields.map(f => (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedAlternativaEvaluacion[f.name]}
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

function DeactivateAlternativaEvaluacion({
	alternativasEvaluaciones,
}: {
	alternativasEvaluaciones: AlternativasEvaluacionSchema[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(alternativaEvaluacionParams.deactivate);

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

	const alternativaEvaluacionId = React.useMemo(
		() => searchParams.get(alternativaEvaluacionParams.deactivate),
		[searchParams],
	);

	if (!alternativaEvaluacionId) return null;

	const selectedAlternativaEvaluacion = alternativasEvaluaciones.find(
		i => i.id === alternativaEvaluacionId,
	);

	if (!selectedAlternativaEvaluacion) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la alternativa evaluación: ${selectedAlternativaEvaluacion.nombre}`}
			title='Desactivar Alternativa Evaluación'
			onDelete={() =>
				console.log(
					"falta implementar lógica de delete",
					selectedAlternativaEvaluacion,
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
