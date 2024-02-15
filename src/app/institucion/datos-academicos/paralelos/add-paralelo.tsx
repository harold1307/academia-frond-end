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
import type { CreateParalelo } from "@/core/api/paralelos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";

const schema = z.object<ZodInferSchema<CreateParalelo>>({
	nombre: z.string(),
	orden: z.number(),
});

export const paralelosParams = {
	update: "actualizarParalelo",
	delete: "eliminarParalelo",
};

export default function AddParalelo({ sedeId }: { sedeId?: string }) {
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

			return API.paralelos.create(data);
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
				title='Adicionar paralelo'
				withTrigger
				triggerLabel='Adicionar'
			>
				{paraleloFields.map(f => {
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

export const paraleloFields = [
	{
		name: "nombre",
		label: "Nombre",
		inputType: "text",
	},
	{
		name: "orden",
		label: "Orden",
		inputType: "number",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
