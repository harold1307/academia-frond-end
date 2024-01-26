"use client";
import { z } from "zod";

import { API } from "@/core/api-client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import type { Field } from "@/utils/forms";
import { useRouter } from "next/navigation";
import { Incidencias } from "./columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import MutateModal from "@/app/_components/modals/mutate-modal";
import { Input } from "@/app/_components/ui/input";


export default function AddIncidencia() {
	const router = useRouter()
	const { form, mutation, open, setOpen } = useMutateModule({
		// invalidateQueryKey: 
		// schema,
		mutationFn: async data => {
            console.log('falta agregar lógica', data)
		},
		onError: console.error,
		onSuccess: response => {
			// router.refresh()
			console.log({ response });
		},
		hookFormProps: {},
	});

	return (
		<section>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar Incidencia'
				withTrigger
				triggerLabel='Adicionar incidencia'
			>
				{incidenciasFields.map(f => (
					f.inputType === "custom-select" ? (
                        <FormField
                            control={form.control}
                            name={f.name}
                            key={f.name}
                            render={({ field }) => {
                                const options = f.options ? f.options : ['A', 'B']
                                return(
                                    <FormItem className='grid grid-cols-12 items-center gap-4 space-y-0 w-full'>
                                        <FormLabel className='col-span-3 text-end w-2/12'>
                                            {f.label}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value as string}
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
                    ) : (
                    <FormField
                            control={form.control}
                            name={f.name}
                            key={f.name}
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
			</MutateModal>
		</section>
	);
}

export const incidenciasFields = [
	{
		name: "tipo",
		inputType: "custom-select",
        options: ['Tipo1', 'Tipo2'],
		label: "Tipo de Incidencia",
        placeholder: '-----'
	},
	{
		name: "descripcion",
		inputType: "custom-text-area",
		label: "Descripción",
	},
] satisfies Field<keyof Incidencias>[];
