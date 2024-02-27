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
import type { AreaConocimientoClass } from "@/core/api/areas-conocimiento";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";

const schema = z.object<
	ZodInferSchema<
		ReplaceNullableToOptional<Parameters<AreaConocimientoClass["create"]>[0]>
	>
>({
	nombre: z.string(),
	codigo: z.string().optional(),
});

export const areasConocimientoParams = {
	update: "actualizarArea",
	delete: "eliminarArea",
};

export default function AddArea() {
	const router = useRouter();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: data => {
			return API.areasConocimiento.create({
				...data,
				codigo: data.codigo || null,
			});
		},
		onSuccess: response => {
			console.log({ response });

			router.refresh();
		},
	});

	return (
		<section>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar area de conocimiento'
				withTrigger
				triggerLabel='Agregar'
			>
				<FormField
					control={form.control}
					name={"nombre"}
					render={({ field }) => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 text-end'>Nombre</FormLabel>
							<FormControl>
								<Input {...field} className='col-span-9' />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={"codigo"}
					render={({ field }) => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 text-end'>Codigo</FormLabel>
							<FormControl>
								<Input {...field} className='col-span-9' />
							</FormControl>
						</FormItem>
					)}
				/>
			</MutateModal>
		</section>
	);
}
