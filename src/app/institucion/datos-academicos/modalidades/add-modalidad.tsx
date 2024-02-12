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
import { API } from "@/core/api-client";
import type { CreateModalidad } from "@/core/api/modalidades";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";

const schema = z.object<ZodInferSchema<CreateModalidad>>({
	nombre: z.string(),
	alias: z.string().nullable(),
});

export const modalidadesParams = {
	update: "actualizarModalidad",
	delete: "eliminarModalidad",
};

export default function AddModalidad() {
	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		mutationFn: async data => {
			return API.modalidades.create({ ...data, alias: data.alias || null });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
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
				title='Adicionar modalidad'
				withTrigger
				triggerLabel='Adicionar'
			>
				{modalidadFields.map(f => {
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

export const modalidadFields = [
	{
		name: "nombre",
		label: "Nombre",
		inputType: "text",
	},
	{
		name: "alias",
		label: "Alias",
		inputType: "text",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
