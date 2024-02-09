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
export type AlternativasEvaluacionSchema = {
	id: string;
	nombre: string;
	codigo: string;
};

export default function AddAlternativaEvaluacion() {
	const { form, mutation, open, setOpen } = useMutateModule({
		// schema: ModeloEvaluativoSchema,
		mutationFn: async data => {},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
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
				title={`Adicionar Alternativa Evaluación`}
				withTrigger
				triggerLabel='Adicionar alternativa evaluación'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{alternativaEvaluacionFields.map(f => (
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

export const alternativaEvaluacionFields = [
	{
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	{
		name: "codigo",
		inputType: "text",
		label: "Código",
	},
] satisfies Field<keyof AlternativasEvaluacionSchema>[];
