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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { CostosSchema, costoFields } from "../add-costos";
import { CostosTableItem, costosColumns, costosParams } from "./columns";

interface CostosTableProps {
	data: CostosSchema[];
}

export default function CostosTable({ data }: CostosTableProps) {
	const costos = React.useMemo(() => {
		return data?.map(
			costo =>
				({
					...costo,
				}) satisfies CostosTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={costosColumns} data={costos} />
			<UpdateCostosModal costos={costos} />
			<DeactivateCostosModal costos={costos} />
		</section>
	);
}

function UpdateCostosModal({ costos }: { costos: CostosSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation } = useMutateModule({
		// schema,
		mutationFn: async () => {},
		onSuccess: response => {
			console.log(response);
		},
		onError: error => {
			console.log(error);
		},
	});

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(costosParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const costoParamsId = React.useMemo(
		() => searchParams.get(costosParams.update),
		[searchParams],
	);

	const selectedCosto = costos.find(i => i.id === costoParamsId);
	if (!costoParamsId) return null;

	if (!selectedCosto) {
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
				title={`Modificar Costos en variante de curso ${selectedCosto.id}`}
				withTrigger
				triggerLabel='modificar costos en variante de curso'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{costoFields.map(f =>
						f.inputType === "checkbox" ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={selectedCosto[f.name]}
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
						) : f.inputType === "custom-select" ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={selectedCosto[f.name]}
								render={({ field }) => {
									const options = f.options ? f.options : ["A", "B"];
									const selectedOption = options.indexOf(
										selectedCosto[f.name] as string,
									);
									return (
										<FormItem className='grid w-full grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 w-2/12 text-end'>
												{f.label}
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={options[selectedOption] as string}
												disabled={field.disabled}
											>
												<FormControl>
													<SelectTrigger className='col-span-9'>
														<SelectValue
															placeholder={f.placeholder}
															className='w-full'
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{options.map(o =>
														typeof o === "string" ? (
															<SelectItem value={o} key={o}>
																{o}
															</SelectItem>
														) : (
															<SelectItem value={o} key={o}>
																{o}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</FormItem>
									);
								}}
							/>
						) : (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={selectedCosto[f.name]}
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
						),
					)}
				</div>
			</MutateModal>
		</section>
	);
}

function DeactivateCostosModal({ costos }: { costos: CostosSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(costosParams.deactivate);

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

	const costoId = React.useMemo(
		() => searchParams.get(costosParams.deactivate),
		[searchParams],
	);

	if (!costoId) return null;

	const selectedCosto = costos.find(i => i.id === costoId);

	if (!selectedCosto) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedCosto.programa}`}
			title='Desactivar variante'
			onDelete={() =>
				console.log("falta implementar lógica de delete", selectedCosto)
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
