"use client";
import { z } from "zod";

import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { API } from "@/core/api-client";
import type { CreateVarianteCurso } from "@/core/api/cursos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { DatePickerDemo } from "@/app/_components/date-picker";

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

export const varianteCursoSchema = z.object<ZodInferSchema<CreateVarianteCursoSchema>>({
	nombre: z.string(),
	codigoBase: z.string(),
	descripcion: z.string(),
	registroExterno: z.boolean(),
	registroInterno: z.boolean(),
	verificarSesion: z.boolean(),
	verificarEdad: z.boolean(),
	edadMinima: z.number().optional(),
	edadMaxima: z.number().optional(),
	fechaAprobacion: z.string().datetime(),
	registroDesdeOtraSede: z.boolean(),
	costoPorMateria: z.boolean(),
	cumpleRequisitosMalla: z.boolean(),
	pasarRecord: z.boolean(),
	aprobarCursoPrevio: z.boolean(),
});

export default function AddVariante({ cursoId }: AddVarianteProps) {
	const { form, mutation, open, setOpen } = useMutateModule({
		schema: varianteCursoSchema,
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
	const seeData= () => console.log('DATA: ', mutation.data)
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
					// console.log(data)
					mutation.mutate(data)
				)}
				title='Adicionar variante de curso'
				withTrigger
				triggerLabel='Adicionar variante de curso'
			>
				<div className='mb-10 flex flex-col items-center justify-center gap-6 px-8'>
					{varianteCursoFields.map(f =>
						f.inputType === "text" || f.inputType === 'custom-text-area' ? (
							f.name === 'fechaAprobacion' ? (
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
													<DatePickerDemo onChangeValue={field.onChange} />
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
						) : null
					)}
					{
						form.getValues('verificarEdad') === true ? (
							varianteCursoFields.filter(el => {
								return el.inputType === 'number'
							}).map(f => (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									render={({ field }) => {
										return(
										<FormItem
										className='flex w-full items-center justify-start gap-2'
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
							))
						) : (
							null
						)
					}
				</div>
				<div className='flex items-center justify-between gap-8 flex-wrap w-full px-8'>
					{varianteCursoFields.map(f => (
						f.inputType === 'checkbox' ?
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
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
						: null
					))}
				</div>
			</MutateModal>
		</section>
	);
}

export const varianteCursoFields = [
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
		name: "fechaAprobacion",
		inputType: "text",
		label: "Fecha Aprobación",
	},
	{
		name: "registroExterno",
		inputType: "checkbox",
		label: "Registro Externo",
	},
	{
		name: "registroInterno",
		inputType: "checkbox",
		label: "Registro Interno",
	},
	{
		name: "registroDesdeOtraSede",
		inputType: "checkbox",
		label: "Registro desde otra Sede",
	},
	{
		name: "costoPorMateria",
		inputType: "checkbox",
		label: "Costo por Materia",
	},
	{ name: "verificarSesion", inputType: "checkbox", label: "Verifica Sesion" },
	{
		name: "verificarEdad",
		inputType: "checkbox",
		label: "Verifica rango de Edad",
	},
	{
		name: "cumpleRequisitosMalla",
		inputType: "checkbox",
		label: "Cumple requisitos de Malla",
	},
	{
		name: "pasarRecord",
		inputType: "checkbox",
		label: "Pasar el Record",
	},
	{
		name: "aprobarCursoPrevio",
		inputType: "checkbox",
		label: "Aprobar curso Previo",
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
