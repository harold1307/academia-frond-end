"use client"
import React from "react";
import { DataTable } from "./data-table";
import { ModelosEvaluativoSchema, modeloEvaluativoFields } from "../add-modelo";
import { ModelosEvaluativosTableItem, modelosEvaluativosColumns, modelosEvaluativosParams } from "./columns";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutateModule } from "@/hooks/use-mutate-module";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import DeleteModal from "@/app/_components/modals/delete-modal";
import CamposModelosEvaluativosTableServer from "../../[modeloEvaluativoId]/campos/table/server";

interface ModelosEvaluativosTableProps {
	data: ModelosEvaluativoSchema[]
}


export default function ModeloEvaluativoTable({ data }:ModelosEvaluativosTableProps) {

	const modelosEvaluativos = React.useMemo(() => {
		return data?.map(
			modeloEvaluativo =>
				({
					...modeloEvaluativo,
				}) satisfies ModelosEvaluativosTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={modelosEvaluativosColumns} data={modelosEvaluativos} />
			<UpdateModeloEvaluativoModal modelosEvaluativos={modelosEvaluativos} />
			<DeactivateModeloEvaluativo modelosEvaluativos={modelosEvaluativos}/>
            <CloneModeloEvaluativo modelosEvaluativos={modelosEvaluativos} />
			<LogicaDeModeloEvaluativo modelosEvaluativos={modelosEvaluativos} />
		</section>
	);
}

function UpdateModeloEvaluativoModal({ modelosEvaluativos }: { modelosEvaluativos: ModelosEvaluativoSchema[] }) {
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
		newParams.delete(modelosEvaluativosParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};


	const modeloEvaluativoParamsId = React.useMemo(
		() => searchParams.get(modelosEvaluativosParams.update),
		[searchParams],
	);

	if (!modeloEvaluativoParamsId) return null;

	const selectedModeloEvaluativo = modelosEvaluativos.find(i => i.id === modeloEvaluativoParamsId);

	if (!selectedModeloEvaluativo) {
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
				title={`Editar modelo evaluativo ${selectedModeloEvaluativo.nombre}`}
				withTrigger
				triggerLabel='Editar modelo evaluativo'
			>
				<div className='flex items-start justify-start flex-col gap-8 w-full px-8'>
					{modeloEvaluativoFields.map(f => (
						f.inputType === 'checkbox' ?
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={selectedModeloEvaluativo[f.name]}
							render={({ field }) => {
								return(
								<FormItem
								 className='flex justify-between items-center gap-4 space-y-0 border-2 rounded-2xl w-60 h-16 p-4'
								 style={{
									boxShadow: '0 0 20px rgba(67, 84, 234, .7)'
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
								)
							}}
						/>
						: (
                            <FormField
                                control={form.control}
                                name={f.name}
                                key={f.name}
                                defaultValue={selectedModeloEvaluativo[f.name]}
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
                        )
					))}
				</div>
			</MutateModal>
		</section>
    )
}

function DeactivateModeloEvaluativo({ modelosEvaluativos }: { modelosEvaluativos: ModelosEvaluativoSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(modelosEvaluativosParams.deactivate);

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

	const modeloEvaluativoId = React.useMemo(
		() => searchParams.get(modelosEvaluativosParams.deactivate),
		[searchParams],
	);

	if (!modeloEvaluativoId) return null;

	const selectedModeloEvaluativo = modelosEvaluativos.find(i => i.id === modeloEvaluativoId);

	if (!selectedModeloEvaluativo) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedModeloEvaluativo.nombre}`}
			title='Desactivar variante'
			onDelete={() => console.log('falta implementar lógica de delete', selectedModeloEvaluativo)}
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

function CloneModeloEvaluativo({ modelosEvaluativos }: { modelosEvaluativos: ModelosEvaluativoSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation, } = useMutateModule({
		// schema,
		mutationFn: async (params: {
            data: {name:string},
            currentModeloEvaluativo:ModelosEvaluativoSchema
        }) => {
			//update
            const clone:ModelosEvaluativoSchema = {
                ...params.currentModeloEvaluativo,
                nombre: params.data.name
            }
            console.log('Falta implementar lógica', clone)
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
		newParams.delete(modelosEvaluativosParams.clone);

		router.replace(pathname + "?" + newParams.toString());
	};


	const modeloEvaluativoParamsId = React.useMemo(
		() => searchParams.get(modelosEvaluativosParams.clone),
		[searchParams],
	);

	if (!modeloEvaluativoParamsId) return null;

	const selectedModeloEvaluativo = modelosEvaluativos.find(i => i.id === modeloEvaluativoParamsId);

	if (!selectedModeloEvaluativo) {
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
					// console.log('Falta implementar lógica', data)
					mutation.mutate({data, currentModeloEvaluativo: selectedModeloEvaluativo})
				)}
				title={`Clonar modelo evaluativo ${selectedModeloEvaluativo.nombre}`}
				withTrigger
				triggerLabel='Clonar modelo evaluativo'
			>
				<div className='flex items-start justify-start flex-col gap-8 w-full px-8'>
                    <FormField
                        control={form.control}
                        name={'name'}
                        render={({ field }) => {
                            return(
                            <FormItem
                             className='flex justify-between items-center gap-4 space-y-0 border-2 rounded-2xl w-60 h-16 p-4'
                             style={{
                                boxShadow: '0 0 20px rgba(67, 84, 234, .7)'
                             }}
                            >
                                <FormLabel className='col-span-3 text-start'>
                                    Nombre
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='text'
                                    />
                                </FormControl>
                            </FormItem>
                            )
                        }}
                    />
				</div>
			</MutateModal>
		</section>
    )
}

function LogicaDeModeloEvaluativo({ modelosEvaluativos }: { modelosEvaluativos: ModelosEvaluativoSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation, } = useMutateModule({
		// schema,
		mutationFn: async (data) => {
			//update logic
            console.log('Falta implementar lógica', data)
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
		newParams.delete(modelosEvaluativosParams.logic);

		router.replace(pathname + "?" + newParams.toString());
	};


	const modeloEvaluativoParamsId = React.useMemo(
		() => searchParams.get(modelosEvaluativosParams.logic),
		[searchParams],
	);

	if (!modeloEvaluativoParamsId) return null;

	const selectedModeloEvaluativo = modelosEvaluativos.find(i => i.id === modeloEvaluativoParamsId);

	if (!selectedModeloEvaluativo) {
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
					// console.log('Falta implementar lógica', data)
					mutation.mutate({data })
				)}
				title={`Lógica modelo evaluativo ${selectedModeloEvaluativo.nombre}`}
				withTrigger
				triggerLabel='logica modelo evaluativo'
			>
				<div className='flex items-start justify-start flex-col gap-8 w-full px-8'>
                    <div className="w-full flex flex-col items-start justify-start gap-4">
						<span >Lógica</span>
						<FormField
                        control={form.control}
                        name={'logic'}
                        render={({ field }) => {
                            return(
                            <FormItem
                             className='flex justify-between items-center gap-4 space-y-0 border-2 rounded-2xl w-full p-4'
                             style={{
                                boxShadow: '0 0 20px rgba(67, 84, 234, .7)'
                             }}
                            >
                                <FormLabel className='col-span-3 text-start'>
                                    lógica:
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='custom-text-area'
                                    />
                                </FormControl>
                            </FormItem>
                            )
                        }}
                    />
					</div>
					<div className='w-full'>
						<span>Campos</span>
						<CamposModelosEvaluativosTableServer />
					</div>
				</div>
			</MutateModal>
		</section>
    )
}