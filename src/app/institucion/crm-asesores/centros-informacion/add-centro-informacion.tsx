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
import type { CreateCentroInformacion } from "@/core/api/centros-informacion";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { CENTROS_INFORMACION_KEYS } from "./query-keys";

const schema = z.object<ZodInferSchema<CreateCentroInformacion>>({
	nombre: z.string(),
});

export const centrosInformacionParams = {
	update: "actualizarCentroInformacion",
	delete: "eliminarCentroInformacion",
};

export default function AddCentroInformacion() {
	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		mutationFn: data => {
			return API.centrosInformacion.create(data);
		},
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		invalidateQueryKey: CENTROS_INFORMACION_KEYS.all,
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
				title='Adicionar centro de informacion'
				withTrigger
				triggerLabel='Agregar'
			>
				{centroInformacionFields.map(f => {
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

export const centroInformacionFields = [
	{
		name: "nombre",
		label: "Nombre",
		inputType: "text",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
