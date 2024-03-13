"use client";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { DatePickerDemo } from "@/app/_components/date-picker";
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
import { VARIANTES_KEYS } from "./query-keys";

type AddVarianteProps = {
	cursoId: string;
};

export const createVarianteCursoSchema = z.object<
	ZodInferSchema<
		Omit<CreateVarianteCurso, "edadMinima" | "edadMaxima"> & {
			verificarEdad: boolean;
			// react-hook-form doesnt submit values if the fields are not visible and
			// these depends on "verificarEdad" field to be shown. So, hard-coding optional is necessary
			edadMinima?: number | null;
			edadMaxima?: number | null;
		}
	>
>({
	nombre: z.string(),
	codigoBase: z.string(),
	descripcion: z.string(),
	registroExterno: z.boolean(),
	registroInterno: z.boolean(),
	verificaSesion: z.boolean(),
	verificarEdad: z.boolean(),
	edadMinima: z.number().nullable().optional(),
	edadMaxima: z.number().nullable().optional(),
	fechaAprobacion: z.date().transform(date => date.toISOString()),
	registroDesdeOtraSede: z.boolean(),
	costoPorMateria: z.boolean(),
	cumpleRequisitosMalla: z.boolean(),
	pasarRecord: z.boolean(),
	costoPorCantidadMateria: z.boolean(),
});

export default function AddVariante({ cursoId }: AddVarianteProps) {
	const router = useRouter();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema: createVarianteCursoSchema,
		invalidateQueryKey: VARIANTES_KEYS.all,
		mutationFn: ({ verificarEdad, ...data }) => {
			return API.cursos.createVarianteCurso(cursoId, {
				...data,
				edadMinima: verificarEdad ? data.edadMinima ?? null : null,
				edadMaxima: verificarEdad ? data.edadMaxima ?? null : null,
			});
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		hookFormProps: {
			defaultValues: {
				registroExterno: false,
				registroInterno: false,
				verificaSesion: false,
				registroDesdeOtraSede: false,
				costoPorMateria: false,
				cumpleRequisitosMalla: false,
				pasarRecord: false,
				costoPorCantidadMateria: false,

				verificarEdad: false,

				edadMinima: 0,
				edadMaxima: 0,
			},
		},
	});
	// const seeData = () => console.log("DATA: ", mutation.data);
	// console.log(form.formState.errors);

	const { costoPorMateria } = form.watch();

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
					mutation.mutate(data),
				)}
				title='Adicionar variante de curso'
				withTrigger
				triggerLabel='Agregar'
			>
				<div className='mb-10 flex flex-col items-center justify-center gap-6 px-8'>
					{varianteCursoFields.map(f =>
						f.inputType === "text" || f.inputType === "custom-text-area" ? (
							f.name === "fechaAprobacion" ? (
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
						) : null,
					)}
					{form.getValues("verificarEdad") === true
						? varianteCursoFields
								.filter(el => {
									return el.inputType === "number";
								})
								.map(f => (
									<FormField
										control={form.control}
										name={f.name}
										key={f.name}
										render={({ field }) => {
											return (
												<FormItem className='flex w-full items-center justify-start gap-2'>
													<FormLabel className='col-span-3 text-start'>
														{f.label}
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={
																typeof field.value === "number"
																	? field.value
																	: undefined
															}
															type={f.inputType}
															onChange={e => field.onChange(+e.target.value)}
														/>
													</FormControl>
												</FormItem>
											);
										}}
									/>
								))
						: null}
				</div>
				<div className='flex w-full flex-wrap items-center justify-between gap-8 px-8'>
					{varianteCursoFields.map(f =>
						f.name === "costoPorCantidadMateria" ? (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								defaultValue={false}
								rules={{
									validate: costoPorCantidadMateria => {
										return !(!costoPorMateria && costoPorCantidadMateria);
									},
								}}
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
													disabled={!costoPorMateria}
													type={f.inputType}
												/>
											</FormControl>
										</FormItem>
									);
								}}
							/>
						) : f.inputType === "checkbox" ? (
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
						) : null,
					)}
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
	{
		name: "costoPorCantidadMateria",
		inputType: "checkbox",
		label: "Costo por cant. Materia",
	},
	{ name: "verificaSesion", inputType: "checkbox", label: "Verifica Sesion" },
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
] satisfies Field<keyof z.infer<typeof createVarianteCursoSchema>>[];
