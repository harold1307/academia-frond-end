"use client";
import { useQuery } from "@tanstack/react-query";
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
import type { CreateSesion } from "@/core/api/sesiones";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { SEDE_KEYS } from "../../query-keys";

const schema = z.object<ZodInferSchema<CreateSesion>>({
	nombre: z.string(),
	sedeId: z.string(),
	alias: z.string(),
	lunes: z.boolean(),
	martes: z.boolean(),
	miercoles: z.boolean(),
	jueves: z.boolean(),
	viernes: z.boolean(),
	sabado: z.boolean(),
	domingo: z.boolean(),
});

export const sesionesParams = {
	update: "actualizarSesion",
	delete: "eliminarSesion",
};

export default function AddSesion() {
	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		mutationFn: async data => {
			return API.sesiones.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		hookFormProps: {
			defaultValues: {
				lunes: false,
				martes: false,
				miercoles: false,
				jueves: false,
				viernes: false,
				sabado: false,
				domingo: false,
			},
		},
	});

	const {
		data: sedes,
		isLoading: sedesAreLoading,
		refetch: fetchSedes,
	} = useQuery({
		queryKey: SEDE_KEYS.all,
		queryFn: () => {
			return API.sedes.getMany();
		},
		enabled: false,
	});

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
				title='Adicionar sesion'
				withTrigger
				triggerLabel='Adicionar'
			>
				{sesionFields.map(f => {
					if (f.inputType === "custom-select") {
						return (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								disabled={isPending}
								shouldUnregister={true}
								render={({ field }) => (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											{f.label}
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value as string}
											disabled={field.disabled}
											onOpenChange={() => {
												if (!sedes) {
													fetchSedes();
												}
											}}
										>
											<FormControl>
												<SelectTrigger className='col-span-9'>
													<SelectValue className='w-full' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{sedesAreLoading
													? "Cargando opciones..."
													: sedes?.data?.length
														? sedes?.data.map(s => (
																<SelectItem value={s.id} key={s.id}>
																	{s.nombre}
																</SelectItem>
															))
														: "No hay resultados"}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						);
					}

					if (f.inputType === "checkbox") {
						return (
							<FormField
								control={form.control}
								name={f.name}
								key={f.name}
								disabled={isPending}
								shouldUnregister={true}
								render={({ field }) => (
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
								)}
							/>
						);
					}

					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							render={({ field }) => {
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
												onChange={e => field.onChange(e.target.value)}
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

export const sesionFields = [
	{
		name: "nombre",
		label: "Nombre",
		inputType: "text",
	},
	{
		name: "sedeId",
		label: "Sede",
		inputType: "custom-select",
		options: "custom",
	},
	{
		name: "alias",
		label: "Alias",
		inputType: "text",
	},
	{
		name: "lunes",
		label: "Lunes",
		inputType: "checkbox",
	},
	{
		name: "martes",
		label: "Martes",
		inputType: "checkbox",
	},
	{
		name: "miercoles",
		label: "Miercoles",
		inputType: "checkbox",
	},
	{
		name: "jueves",
		label: "Jueves",
		inputType: "checkbox",
	},
	{
		name: "viernes",
		label: "Viernes",
		inputType: "checkbox",
	},
	{
		name: "sabado",
		label: "Sabado",
		inputType: "checkbox",
	},
	{
		name: "domingo",
		label: "Domingo",
		inputType: "checkbox",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
