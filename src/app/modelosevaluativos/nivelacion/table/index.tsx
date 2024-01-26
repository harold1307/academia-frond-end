"use client"
import React from "react";
import { DataTable } from "./data-table";
import { NivelacionTableItem, nivelacionColumns, nivelacionParams } from "./columns";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutateModule } from "@/hooks/use-mutate-module";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { NivelacionSchema, nivelacionFields } from "../add-nivelacion";

interface NivelacionTableProps {
	data: NivelacionSchema[]
}


export default function NivelacionTable({ data }:NivelacionTableProps) {

	const nivelaciones = React.useMemo(() => {
		return data?.map(
			nivelacion =>
				({
					...nivelacion,
				}) satisfies NivelacionTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={nivelacionColumns} data={nivelaciones} />
			<UpdateNivelacion nivelaciones={nivelaciones} />
			<DeactivateNivelacion nivelaciones={nivelaciones}/>
		</section>
	);
}

function UpdateNivelacion({ nivelaciones }: { nivelaciones: NivelacionSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation, } = useMutateModule({
		// schema,
		mutationFn: async () => {
			//update
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
		newParams.delete(nivelacionParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};


	const nivelacionId = React.useMemo(
		() => searchParams.get(nivelacionParams.update),
		[searchParams],
	);

	if (!nivelacionId) return null;

	const selectedNivelacion = nivelaciones.find(i => i.id === nivelacionId);

	if (!selectedNivelacion) {
		return <ModalFallback action='update' redirectTo={() => dismissModal()} />;
	}
    return(
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
				onSubmit={form.handleSubmit(data => 
					console.log('Falta implementar lógica', data)
					// mutation.mutate(data)
				)}
				title={`Editar nivelación ${selectedNivelacion.nombre}`}
				withTrigger
				triggerLabel='Editar nivelacion'
			>
				<div className='flex items-start justify-start flex-col gap-8 w-full px-8'>
					{nivelacionFields.map(f => (
                        <FormField
                            control={form.control}
                            name={f.name}
                            key={f.name}
                            defaultValue={selectedNivelacion[f.name]}
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
    )
}

function DeactivateNivelacion({ nivelaciones }: { nivelaciones: NivelacionSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(nivelacionParams.deactivate);

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

	const nivelacionId = React.useMemo(
		() => searchParams.get(nivelacionParams.deactivate),
		[searchParams],
	);

	if (!nivelacionId) return null;

	const selectedNivelacion = nivelaciones.find(i => i.id === nivelacionId);

	if (!selectedNivelacion) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la nivelación: ${selectedNivelacion.nombre}`}
			title='Desactivar nivelación'
			onDelete={() => console.log('falta implementar lógica de delete', selectedNivelacion)}
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