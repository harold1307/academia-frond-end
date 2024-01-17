"use client";
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
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";

type AddProgramaProps = {
	varianteId: string;
};

//Esquema de mockup hasta tener el schema en prisma
export type ProgramaSchema = {
	id: string;
	todosLosProgramas: boolean;
	programa: string;
	modalidad: string;
	malla: string;
	registroExterno: boolean;
};
// export const varianteCursoSchema = z.object<ZodInferSchema<any>>

export default function AddPrograma({ varianteId }: AddProgramaProps) {
	const { form, mutation, open, setOpen } = useMutateModule({
		// schema: varianteCursoSchema,
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
				title={`Adicionar Programa en variante de curso ${varianteId}`}
				withTrigger
				triggerLabel='Adicionar programa en variante de curso'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{programaFields.map(f =>
						f.inputType === "checkbox" ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={false}
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
								render={({ field }) => {
									const options = f.options ? f.options : ["A", "B"];
									return (
										<FormItem className='grid w-full grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 w-2/12 text-end'>
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

export const programaFields = [
	{
		name: "todosLosProgramas",
		inputType: "checkbox",
		label: "Todos los Programas",
	},
	{
		name: "programa",
		inputType: "custom-select",
		placeholder: "--------",
		options: ["programaA", "programaB", "programaC"],
		label: "Programa",
	},
	{
		name: "modalidad",
		inputType: "custom-select",
		placeholder: "--------",
		options: ["Modalidad1", "Modalidad2"],
		label: "Modalidad",
	},
	{
		name: "malla",
		inputType: "custom-select",
		placeholder: "--------",
		options: ["MallaA", "MallaB", "MallaC"],
		label: "Malla",
	},
	{
		name: "registroExterno",
		inputType: "checkbox",
		label: "Registro Externo",
	},
] satisfies Field<keyof ProgramaSchema>[];
