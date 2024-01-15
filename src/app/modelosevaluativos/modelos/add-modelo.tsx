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
export type ModelosEvaluativoSchema = {
	id:string	
	nombre: string
    examenComplexivo: boolean
    notaMaxima: number
    notaParaAprobar: number
    notaParaRecuperacion: number
    porcentajeAsistenciaAprobar: number
    decimalesNotaFinal: number
    defineMaximos: boolean
    camposActualizanEstado: boolean
    observaciones:string
}

export default function AddModeloEvaluativo() {
	const { form, mutation, open, setOpen } = useMutateModule({
		// schema: ModeloEvaluativoSchema,
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
				title={`Adicionar Modelo Evaluativo`}
				withTrigger
				triggerLabel='Adicionar modelo evaluativo'
			>
				<div className='flex items-start justify-start flex-col gap-8 w-full px-8'>
					{modeloEvaluativoFields.map(f => (
						f.inputType === 'checkbox' ?
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							defaultValue={false}
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
	);
}

export const modeloEvaluativoFields = [
	{
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	{
		name: "examenComplexivo",
		inputType: "checkbox",
		label: "Para examen Complexivo?",
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
		name: "notaParaRecuperacion",
		inputType: "number",
		label: "Nota para Recuperación",
	},
	{
		name: "porcentajeAsistenciaAprobar",
		inputType: "number",
		label: "% Asistencia para Aprobar",
	},
	{
		name: "decimalesNotaFinal",
		inputType: "number",
		label: "Decimales nota Final",
	},
	{
		name: "defineMaximos",
		inputType: "checkbox",
		label: "Define Máximos?",
	},
	{
		name: "camposActualizanEstado",
		inputType: "checkbox",
		label: "Campos actualizan Estados?",
	},
	{
		name: "observaciones",
		inputType: "custom-text-area",
		label: "Observaciones",
	},
] satisfies Field<keyof ModelosEvaluativoSchema>[];
