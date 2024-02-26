"use client";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { API } from "@/core/api-client";
import type { CreateCurso } from "@/core/api/cursos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import MutateModal from "../_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "../_components/ui/form";
import { Input } from "../_components/ui/input";

export const cursosParams = {
	update: "actualizarCurso",
	deactivate: "desactivarCurso",
	delete: "eliminarCurso",
} as const;

const schema = z.object<ZodInferSchema<CreateCurso>>({
	nombre: z.string(),
});

export default function AddCurso() {
	const router = useRouter();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async data => {
			return API.cursos.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	return (
		<section>
			{/* <h1 className='text-2xl font-semibold'>Adicionar curso</h1> */}
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar curso'
				withTrigger
				triggerLabel='Adicionar curso'
			>
				{fields.map(f => (
					<FormField
						control={form.control}
						name={f.name}
						key={f.name}
						render={({ field }) => (
							<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
								<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value || undefined}
										type={f.inputType}
										className='col-span-9'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				))}
			</MutateModal>
		</section>
	);
}

export const fields = [
	{
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	// {
	// 	name: "certificado",
	// 	inputType: "text",
	// 	label: "Certificado a obtener",
	// },
	// {
	// 	name: "alias",
	// 	inputType: "text",
	// 	label: "Alias",
	// },
] satisfies Field<keyof z.infer<typeof schema>>[];
