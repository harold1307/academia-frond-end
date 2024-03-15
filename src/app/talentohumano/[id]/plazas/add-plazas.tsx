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

export type PlazasDepartamentosSchema = {
	cargo: string;
	id: string;
	persona: string;
	responsable: boolean;
	tienecontrato: string | void;
	plazas: string | void;
	contrato: string;
	activo: boolean;
};

export default function AddPlazasDepartamentos() {
	const { form, mutation, open, setOpen } = useMutateModule({
		// schema: ModeloEvaluativoSchema,
		mutationFn: async data => {},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
		hookFormProps: {
			defaultValues: {
				examenComplexivo: false,
				defineMaximos: false,
				camposActualizanEstados: false,
			},
		},
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
				onSubmit={form.handleSubmit(
					data => console.log("Falta implementar lógica", data),
					// mutation.mutate(data)
				)}
				title={`Agregar PlazasDepartamentos`}
				withTrigger
				triggerLabel='Agregar PlazasDepartamentos'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{PlazasDepartamentosFields.map(f => (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							render={({ field }) => {
								return (
									<FormItem className='flex w-full items-center justify-start gap-2'>
										<FormLabel className='text-md col-span-3 w-[20%] text-start'>
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

export const PlazasDepartamentosFields = [
	{
		name: "cargo",
		inputType: "text",
		label: "Cargo",
	},
	{
		name: "contrato",
		inputType: "text",
		label: "Plazas",
	},
	{
		name: "plazas",
		inputType: "text",
		label: "Cantidad de Plazas",
	},
] satisfies Field<keyof PlazasDepartamentosSchema>[];
