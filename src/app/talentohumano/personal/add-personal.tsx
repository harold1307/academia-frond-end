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
export type PersonalSchema = {
	nombre: string;
	departamento: string;
	id: string;
	emailtelefono: string;
	datos: string;
	etnia: string;
	asesor: boolean;
	discapacidad: boolean;
	admin: boolean;
	profesor: boolean;
	foto: boolean;
};

export default function AddPersonal() {
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
				title={`Agregar Personal`}
				withTrigger
				triggerLabel='Agregar Personal'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{personalFields.map(f =>
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
						) : (
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
						),
					)}
				</div>
			</MutateModal>
		</section>
	);
}

export const personalFields = [
	{
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	{
		name: "departamento",
		inputType: "text",
		label: "Departamento",
	},
	{
		name: "id",
		inputType: "number",
		label: "ID",
	},
	{
		name: "emailtelefono",
		inputType: "text",
		label: "Email/Telefono",
	},
	{
		name: "datos",
		inputType: "text",
		label: "Datos",
	},
	{
		name: "etnia",
		inputType: "text",
		label: "Etnia",
	},
	{
		name: "asesor",
		inputType: "checkbox",
		label: "Asesor",
	},
	{
		name: "discapacidad",
		inputType: "checkbox",
		label: "Discapacidad",
	},
	{
		name: "admin",
		inputType: "checkbox",
		label: "Admin",
	},
	{
		name: "profesor",
		inputType: "checkbox",
		label: "Profesor",
	},
	{
		name: "foto",
		inputType: "file",
		label: "Foto",
	},
] satisfies Field<keyof PersonalSchema>[];
