"use client";
import React from "react";
import {
	type ProgramaTableItem,
	programasColumns,
	programasParams,
} from "./columns";
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
import { type ProgramaSchema, programaFields } from "../add-programa";

interface ProgramasTableProps {
	data: ProgramaSchema[];
}

export default function ProgramasTable({ data }: ProgramasTableProps) {
	const programas = React.useMemo(() => {
		return data?.map(
			curso =>
				({
					...curso,
				}) satisfies ProgramaTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={programasColumns} data={programas} />
			<UpdateProgramaModal programas={programas} />
			<DeactivateProgramaModal programas={programas} />
		</section>
	);
}

function UpdateProgramaModal({ programas }: { programas: ProgramaSchema[] }) {
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
		newParams.delete(programasParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const programasParamsId = React.useMemo(
		() => searchParams.get(programasParams.update),
		[searchParams],
	);

	if (!programasParamsId) return null;

	const selectedPrograma = programas.find(i => i.id === programasParamsId);

	if (!selectedPrograma) {
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
				disabled={false}
				form={form}
				onSubmit={form.handleSubmit(
					data => console.log("Falta implementar lógica de actualizar", data),
					// mutation.mutate(data)
				)}
				title={`Modificar programa ${selectedPrograma.programa}`}
				withTrigger
				triggerLabel='Adicionar programa en variante de curso'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{programaFields.map(f =>
						f.inputType === "checkbox" ? (
							<FormField
								// control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={selectedPrograma[f.name]}
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
													defaultChecked={selectedPrograma[f.name]}
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
								defaultValue={selectedPrograma[f.name]}
								render={({ field }) => {
									const options = f.options ? f.options : ["A", "B"];
									const selectedOption = options.indexOf(
										selectedPrograma[f.name],
									);
									return (
										<FormItem className='grid w-full grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 w-2/12 text-end'>
												{f.label}
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={
													options[selectedOption] || ("----" as string)
												}
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
						) : null,
					)}
				</div>
			</MutateModal>
		</section>
	);
}

function DeactivateProgramaModal({
	programas,
}: {
	programas: ProgramaSchema[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(programasParams.deactivate);

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

	const programaId = React.useMemo(
		() => searchParams.get(programasParams.deactivate),
		[searchParams],
	);

	if (!programaId) return null;

	const selectedPrograma = programas.find(i => i.id === programaId);

	if (!selectedPrograma) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedPrograma.programa}`}
			title='Desactivar variante'
			onDelete={() =>
				console.log("falta implementar lógica de delete", selectedPrograma)
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
