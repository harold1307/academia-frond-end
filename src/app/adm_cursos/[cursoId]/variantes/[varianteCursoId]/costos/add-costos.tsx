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

type AddCostosProps = {
	varianteId: string;
};
//Esquema de MockUp hasta tener el esquema de Prisma
export type CostosSchema = {
	id: string;
	tipo: string; //Select
	iva: string; //select
	programa: string; //select
	modalidad: string; //select
	codigoExterno: string; //select
	cantidadMaterias: number;
	valorTotal: number;
	numeroCuotas: number;
	porcientoPrimeraCuota: number;
	cronogramaFecha: boolean;
	fechaDesdeMatricula: boolean;
	proximoADias: number;
	generacionManual: boolean;
	descuentoFicha: boolean;
	aplicaBecaAuto: boolean;
	descuentoAutomatico: boolean;
};
// export const varianteCursoSchema = z.object<ZodInferSchema<any>>

export default function AddCostos({ varianteId }: AddCostosProps) {
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
				title={`Adicionar Costos en variante de curso ${varianteId}`}
				withTrigger
				triggerLabel='Adicionar costos en variante de curso'
			>
				<div className='flex w-full flex-col items-start justify-start gap-8 px-8'>
					{costoFields.map(f =>
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
						),
					)}
				</div>
			</MutateModal>
		</section>
	);
}

export const costoFields = [
	{
		name: "tipo",
		inputType: "custom-select",
		placeholder: "------",
		options: ["TipoA", "TipoB"],
		label: "Tipo",
	},
	{
		name: "iva",
		inputType: "custom-select",
		placeholder: "--------",
		options: ["SinIva", "Iva12", "Iva21"],
		label: "IVA",
	},
	{
		name: "programa",
		inputType: "custom-select",
		placeholder: "--------",
		options: ["Programa1", "Programa2", "Programa3"],
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
		name: "codigoExterno",
		inputType: "custom-select",
		placeholder: "--------",
		options: ["Cod1", "Cod2", "Cod3"],
		label: "Código Externo",
	},
	{
		name: "cantidadMaterias",
		inputType: "number",
		label: "Cantidad de Materias",
	},
	{
		name: "valorTotal",
		inputType: "number",
		label: "Valor Total",
	},
	{
		name: "numeroCuotas",
		inputType: "number",
		label: "Número de Cuotas",
	},
	{
		name: "porcientoPrimeraCuota",
		inputType: "number",
		label: "Porciento Primera Cuota",
	},
	{
		name: "cronogramaFecha",
		inputType: "checkbox",
		label: "Cronograma de Fecha",
	},
	{
		name: "fechaDesdeMatricula",
		inputType: "checkbox",
		label: "Fecha Desde Matrícula",
	},
	{
		name: "proximoADias",
		inputType: "number",
		label: "Próximo a Días",
	},
	{
		name: "generacionManual",
		inputType: "checkbox",
		label: "Generación Manual",
	},
	{
		name: "descuentoFicha",
		inputType: "checkbox",
		label: "Cronograma de Ficha",
	},
	{
		name: "aplicaBecaAuto",
		inputType: "checkbox",
		label: "Aplica Beca Automáticamente",
	},
	{
		name: "descuentoAutomatico",
		inputType: "checkbox",
		label: "Descuento Automático",
	},
] satisfies Field<keyof CostosSchema>[];
