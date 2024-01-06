"use client";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { API } from "@/core/api-client";
import type { CreateVarianteCurso } from "@/core/api/cursos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";

type AddVarianteProps = {
	cursoId: string;
};

type CreateVarianteCursoSchema = Omit<
	CreateVarianteCurso,
	"edadMinima" | "edadMaxima"
> & {
	edadMinima?: number;
	edadMaxima?: number;
};

const schema = z.object<ZodInferSchema<CreateVarianteCursoSchema>>({
	nombre: z.string(),
	codigoBase: z.string(),
	descripcion: z.string(),
	registroExterno: z.boolean(),
	registroInterno: z.boolean(),
	verificarSesion: z.boolean(),
	verificarEdad: z.boolean(),
	edadMinima: z.number().optional(),
	edadMaxima: z.number().optional(),
});

export default function AddVariante({ cursoId }: AddVarianteProps) {
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async data => {
			return API.cursos.createVarianteCurso(cursoId, {
				...data,
				edadMinima: data.edadMaxima || null,
				edadMaxima: data.edadMaxima || null,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
		},
		hookFormProps: {
			defaultValues: {
				registroExterno: false,
				registroInterno: false,
				verificarSesion: false,
				verificarEdad: false,
			},
		},
	});
	console.log(form.formState.errors);
	return (
		<section>
			<h1 className='text-2xl font-semibold'>Adicionar variante de curso</h1>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar variante de curso'
				withTrigger
				triggerLabel='Adicionar variante de curso'
			>
				{fields.map(f => (
					<FormField
						control={form.control}
						name={f.name}
						key={
							f.name === "edadMinima" || f.name === "edadMaxima"
								? f.name + form.watch().verificarEdad
								: f.name
						}
						render={({ field }) => {
							switch (f.inputType) {
								case "custom-text-area": {
									return (
										<FormItem className='grid grid-cols-12 items-start gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<FormControl>
												<Textarea
													className='col-span-9 resize-none'
													{...field}
													value={field.value as string}
												/>
											</FormControl>
										</FormItem>
									);
								}
								case "checkbox": {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<FormControl>
												<Checkbox
													checked={field.value as boolean}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									);
								}
								case "number": {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
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
													disabled={
														field.disabled || !form.watch().verificarEdad
													}
													onChange={e => field.onChange(+e.target.value)}
													type={f.inputType}
													className='col-span-9'
												/>
											</FormControl>
										</FormItem>
									);
								}
								default: {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
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
													className='col-span-9'
												/>
											</FormControl>
										</FormItem>
									);
								}
							}
						}}
					/>
				))}
			</MutateModal>
		</section>
	);
}

const fields = [
	{
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	{
		name: "codigoBase",
		inputType: "text",
		label: "Codigo Base",
	},
	{
		name: "registroExterno",
		inputType: "checkbox",
		label: "Permite registro externo",
	},
	{
		name: "registroInterno",
		inputType: "checkbox",
		label: "Permite registro interno",
	},
	{ name: "verificarSesion", inputType: "checkbox", label: "Verifica sesion" },
	{
		name: "verificarEdad",
		inputType: "checkbox",
		label: "Verifica rango de edad",
	},
	{
		name: "edadMinima",
		inputType: "number",
		label: "Edad minima",
	},
	{
		name: "edadMaxima",
		inputType: "number",
		label: "Edad maxima",
	},
	{
		name: "descripcion",
		inputType: "custom-text-area",
		label: "Descripcion",
	},
] satisfies Field<keyof CreateVarianteCursoSchema>[];
