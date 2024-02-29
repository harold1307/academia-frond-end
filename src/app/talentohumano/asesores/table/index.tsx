"use client";
import React from "react";
import { DataTable } from "./data-table";
import { type AsesoresTableItem, AsesoresColumns } from "./columns";
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
import { asesoresFields } from "../add-asesores";
import { type AsesoresSchema } from "./columns";

interface AsesoresTableProps {
	data: AsesoresSchema[];
}

export default function AsesoresTable({ data }: AsesoresTableProps) {
	const asesores = React.useMemo(() => {
		return data?.map(
			AsesoresTable =>
				({
					...AsesoresTable,
				}) satisfies AsesoresTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={AsesoresColumns} data={asesores} />
			{/* <UpdateAsesoresModal asesores={asesores} />
			<DeactivateAsesores asesores={asesores} /> */}
		</section>
	);
}

// function UpdateAsesoresModal({ asesores }: { asesores: AsesoresSchema[] }) {
// 	const router = useRouter();
// 	const searchParams = useSearchParams();
// 	const pathname = usePathname();
// 	const { form, mutation } = useMutateModule({
// 		// schema,
// 		mutationFn: async () => {
// 			//update
// 		},
// 		onSuccess: response => {
// 			console.log(response);
// 		},
// 		onError: error => {
// 			console.log(error);
// 		},
// 	});

// 	const dismissModal = () => {
// 		const newParams = new URLSearchParams(searchParams);
// 		newParams.delete(AsesoresParams.update);

// 		router.replace(pathname + "?" + newParams.toString());
// 	};

// 	const AsesoresParamsId = React.useMemo(
// 		() => searchParams.get(AsesoresParams.update),
// 		[searchParams],
// 	);

// 	if (!AsesoresParamsId) return null;

// 	const selectedAsesores = asesores.find(i => i.id === AsesoresParamsId);

// 	if (!selectedAsesores) {
// 		return <ModalFallback action='update' redirectTo={() => dismissModal()} />;
// 	}
// 	return (
// 		<section>
// 			<MutateModal
// 				dialogProps={{
// 					open: true,
// 					onOpenChange: open => {
// 						// if (mutation.isPending) return;
// 						if (!open) {
// 							dismissModal();
// 							return;
// 						}
// 					},
// 				}}
// 				disabled={mutation.isPending}
// 				form={form}
// 				onSubmit={form.handleSubmit(
// 					data => console.log("Falta implementar lógica", data),
// 					// mutation.mutate(data)
// 				)}
// 				title={`Editar modelo de Contrato ${selectedAsesores.nombre}`}
// 				withTrigger
// 				triggerLabel='Editar modelo de Contrato'
// 			>
// 				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
// 					{asesoresFields.map(f =>
// 						f.inputType === "checkbox" ? (
// 							<FormField
// 								control={form.control}
// 								name={f.name}
// 								key={f.name}
// 								defaultValue={selectedAsesores[f.name]}
// 								render={({ field }) => {
// 									return (
// 										<FormItem
// 											className='flex h-16 w-60 items-center justify-between gap-4 space-y-0 rounded-2xl border-2 p-4'
// 											style={{
// 												boxShadow: "0 0 20px rgba(67, 84, 234, .7)",
// 											}}
// 										>
// 											<FormLabel className='col-span-3 text-start'>
// 												{f.label}
// 											</FormLabel>
// 											<FormControl>
// 												<Input
// 													{...field}
// 													value={
// 														typeof field.value === "boolean"
// 															? undefined
// 															: field.value || undefined
// 													}
// 													type={f.inputType}
// 												/>
// 											</FormControl>
// 										</FormItem>
// 									);
// 								}}
// 							/>
// 						) : (
// 							<FormField
// 								control={form.control}
// 								name={f.name}
// 								key={f.name}
// 								defaultValue={selectedAsesores[f.name]}
// 								render={({ field }) => {
// 									return (
// 										<FormItem className='flex w-full items-center justify-start gap-2'>
// 											<FormLabel className='text-md col-span-3 w-[20%] text-start'>
// 												{f.label}
// 											</FormLabel>
// 											<FormControl>
// 												<Input
// 													{...field}
// 													value={
// 														typeof field.value === "boolean"
// 															? undefined
// 															: field.value || undefined
// 													}
// 													type={f.inputType}
// 												/>
// 											</FormControl>
// 										</FormItem>
// 									);
// 								}}
// 							/>
// 						),
// 					)}
// 				</div>
// 			</MutateModal>
// 		</section>
// 	);
// }

// function DeactivateAsesores({ asesores }: { asesores: AsesoresSchema[] }) {
// 	const router = useRouter();
// 	const searchParams = useSearchParams();
// 	const pathname = usePathname();

// 	const dismissModal = () => {
// 		const newParams = new URLSearchParams(searchParams);
// 		newParams.delete(AsesoresParams.deactivate);

// 		router.replace(pathname + "?" + newParams.toString());
// 	};

// 	const { mutation } = useMutateModule({
// 		// invalidateQueryKey: CURSO_KEYS.lists(),
// 		mutationFn: async () => {},
// 		onError: console.error,
// 		onSuccess: response => {
// 			console.log({ response });
// 			dismissModal();
// 		},
// 	});

// 	const asesoresId = React.useMemo(
// 		() => searchParams.get(AsesoresParams.deactivate),
// 		[searchParams],
// 	);

// 	if (!asesoresId) return null;

// 	const selectedAsesores = asesores.find(i => i.id === asesoresId);

// 	if (!selectedAsesores) {
// 		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
// 	}

// 	return (
// 		<DeleteModal
// 			description={`Estas seguro que deseas desactivar la variante: ${selectedAsesores.nombre}`}
// 			title='Desactivar variante'
// 			onDelete={() =>
// 				console.log("falta implementar lógica de delete", selectedAsesores)
// 			}
// 			disabled={mutation.isPending}
// 			onClose={() => dismissModal()}
// 			dialogProps={{
// 				open: true,
// 				onOpenChange: open => {
// 					if (mutation.isPending) return;
// 					if (!open) {
// 						dismissModal();
// 						return;
// 					}
// 				},
// 			}}
// 			deleteButtonLabel={mutation.isPending ? "Desactivando..." : "Desactivar"}
// 		/>
// 	);
// }
