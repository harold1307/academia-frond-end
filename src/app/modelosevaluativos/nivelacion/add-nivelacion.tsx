"use client";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";

//Esquema de MockUp hasta tener el esquema de Prisma
export type NivelacionSchema = {
	id:string	
	nombre: string
    notaMaxima: number
    notaParaAprobar: number
    decimalesNotaFinal: number
    logicaModelo:string
    observaciones:string
}

export default function AddNivelacion() {
	const { form, mutation, open, setOpen } = useMutateModule({
		// schema: nivelacionSchema,
		mutationFn: async data => {

        },
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
        hookFormProps: {
            defaultValues: {
                examenComplexivo: false,
                defineMaximos: false,
                camposActualizanEstados: false
            }
        }
	});
	console.log(form.formState.errors);
	return (
		<section>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => 
					console.log('Falta implementar lógica', data)
					// mutation.mutate(data)
				)}
				title={`Adicionar Nivelación`}
				withTrigger
				triggerLabel='Adicionar nivelacion'
			>
				<div className='flex items-start justify-start flex-col gap-8 w-full px-8'>
					{nivelacionFields.map(f => (
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
					))}
				</div>
			</MutateModal>
		</section>
	);
}

export const nivelacionFields = [
	{
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	{
		name: "notaMaxima",
		inputType: "number",
		label: "Nota Máxima",
	},
	{
		name: "notaParaAprobar",
		inputType: "number",
		label: "Nota para Aprobar",
	},
	{
		name: "decimalesNotaFinal",
		inputType: "number",
		label: "Decimales nota Final",
	},
    {
        name: "logicaModelo",
        inputType: "custom-text-area",
        label: "Lógica del Modelo"
    },
	{
		name: "observaciones",
		inputType: "custom-text-area",
		label: "Observaciones",
	},
] satisfies Field<keyof NivelacionSchema>[];
