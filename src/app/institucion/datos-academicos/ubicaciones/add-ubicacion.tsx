"use client";
import { useRouter } from "next/navigation";
import { z } from "zod";

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
import { API } from "@/core/api-client";
import type { CreateUbicacion } from "@/core/api/ubicaciones";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";

const schema = z.object<ZodInferSchema<Omit<CreateUbicacion, "sedeId">>>({
	capacidad: z.number().int().min(0),
	entornoVirtual: z.boolean(),
	nombre: z.string(),
	tipo: z.enum(["AULA", "LABORATORIO", "TALLER", "SALON"] as const),
});

export const ubicacionesParams = {
	update: "actualizarUbicacion",
	delete: "eliminarUbicacion",
};

export default function AddUbicacion({
	sedeId,
}: {
	sedeId: string | undefined;
}) {
	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		mutationFn: async data => {
			if (!sedeId) return;

			return API.sedes.createUbicacion({
				sedeId,
				data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		hookFormProps: {
			defaultValues: {
				entornoVirtual: false,
			},
		},
	});

	console.log(sedeId);

	return (
		<section className='mb-2'>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutate(data))}
				title='Adicionar ubicacion'
				withTrigger
				triggerLabel='Adicionar'
			>
				{ubicacionFields.map(f => {
					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							render={({ field }) => {
								if (f.inputType === "custom-select") {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value as string}
												disabled={field.disabled}
											>
												<FormControl>
													<SelectTrigger className='col-span-9'>
														<SelectValue className='w-full' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{f.options.map(o => (
														<SelectItem value={o} key={o}>
															{o}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									);
								}

								if (f.inputType === "checkbox") {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													value={undefined}
													onChange={e => field.onChange(e.target.checked)}
													checked={field.value as boolean}
													type={f.inputType}
													className='col-span-9'
												/>
											</FormControl>
										</FormItem>
									);
								}

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
												onChange={e =>
													f.inputType === "number"
														? field.onChange(+e.target.value)
														: field.onChange(e.target.value)
												}
												type={f.inputType}
												className='col-span-9'
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
					);
				})}
			</MutateModal>
		</section>
	);
}

export const ubicacionFields = [
	{
		name: "nombre",
		label: "Nombre",
		inputType: "text",
	},
	{
		name: "tipo",
		label: "Tipo",
		inputType: "custom-select",
		options: ["AULA", "LABORATORIO", "TALLER", "SALON"],
	},
	{
		name: "capacidad",
		label: "Capacidad",
		inputType: "number",
	},
	{
		name: "entornoVirtual",
		label: "Entorno virtual",
		inputType: "checkbox",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
