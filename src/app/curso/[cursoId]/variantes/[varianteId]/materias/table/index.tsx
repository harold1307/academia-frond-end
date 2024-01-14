"use client"
import React from "react";
import { DataTable } from "./data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutateModule } from "@/hooks/use-mutate-module";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { MateriaTableItem, materiasColumns, materiasParams } from "./columns";
import { MateriaSchema, materiaFields } from "../add-materia";

interface MateriasTableProps {
	data: MateriaSchema[]
}


export default function MateriasTable({ data }:MateriasTableProps) {

	const materias = React.useMemo(() => {
		return data?.map(
			curso =>
				({
					...curso,
				}) satisfies MateriaTableItem,
		);
	}, [data]);

	return (
		<section className=''>
			<DataTable columns={materiasColumns} data={materias} />
			<UpdateMateriaModal materias={materias} />
			<DeactivateMateriasModal materias={materias}/>
		</section>
	);
}

function UpdateMateriaModal({ materias }: { materias: MateriaSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { form, mutation } = useMutateModule({
		// schema,
		mutationFn: async () => {

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
		newParams.delete(materiasParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};


	const materiaParamsId = React.useMemo(
		() => searchParams.get(materiasParams.update),
		[searchParams],
	);

	const selectedMateria = materias.find(i => i.id === materiaParamsId);
	if (!materiaParamsId) return null;


	if (!selectedMateria) {
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
				onSubmit={form.handleSubmit(data => 
					console.log('Falta implementar lógica de actualizar', data)
					// mutation.mutate(data)
				)}
				title={`Adicionar Materia en variante de curso ${selectedMateria.asginatura}`}
				withTrigger
				triggerLabel='Adicionar Materia en variante de curso'
			>
				<div className='flex items-start justify-start flex-wrap gap-8 w-full px-8'>
					{materiaFields.map(f => (
						f.inputType === 'checkbox' ?
                        (
                            <FormField
                                control={form.control}
                                name={f.name}
                                key={f.name}
                                defaultValue={selectedMateria[f.name]}
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
                        )
						: (
                            f.inputType === 'custom-select'? 
                            (
                                (f.name === 'modeloEvaluativo' && form.getValues('calificar') === true) || f.name !== 'modeloEvaluativo' ? (
                                    <FormField
                                            control={form.control}
                                            name={f.name}
                                            key={f.name}
                                            render={({ field }) => {
                                                const options = f.options ? f.options : ['A', 'B']
										        const selectedOption = options.indexOf(selectedMateria[f.name] as string)
                                                return(
                                                    <FormItem className='grid grid-cols-12 items-center gap-4 space-y-0 w-full'>
                                                        <FormLabel className='col-span-3 text-end w-2/12'>
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
                                                )
                                            }}
                                    />

                                ) : null
                            ) : 
                            (
                                (['notaParaAprobar', 'notaMaxima', 'cantidadDecimales'].includes(f.name)  && form.getValues('calificar') === true) ||
                                !['notaParaAprobar', 'notaMaxima', 'cantidadDecimales'].includes(f.name) ? 
                                (
                                    <FormField
                                        control={form.control}
                                        name={f.name}
                                        key={f.name}
                                        defaultValue={selectedMateria[f.name]}
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

                                ) : null
                            )
                        )
					))}
                    {
                        form.getValues('calificar') === true ? <h1>ola</h1> : null
                    }
				</div>
			</MutateModal>
		</section>
    )
}

function DeactivateMateriasModal({ materias }: { materias: MateriaSchema[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(materiasParams.deactivate);

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

	const materiaId = React.useMemo(
		() => searchParams.get(materiasParams.deactivate),
		[searchParams],
	);

	if (!materiaId) return null;

	const selectedMateria = materias.find(i => i.id === materiaId);

	if (!selectedMateria) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar la variante: ${selectedMateria.asginatura}`}
			title='Desactivar variante'
			onDelete={() => console.log('falta implementar lógica de delete', selectedMateria)}
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