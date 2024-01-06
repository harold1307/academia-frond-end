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
import type { CampoFormacionClass } from "@/core/api/campos-formacion";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { ZodInferSchema } from "@/utils/types";

const schema = z.object<
	ZodInferSchema<Parameters<CampoFormacionClass["create"]>[0]>
>({
	nombre: z.string(),
});

export default function AddCampo() {
	const router = useRouter();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async data => {
			return API.camposFormacion.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Adicionar campo de formacion</h1>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar campo de formacion'
				withTrigger
				triggerLabel='Adicionar'
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
			</MutateModal>
		</section>
	);
}
