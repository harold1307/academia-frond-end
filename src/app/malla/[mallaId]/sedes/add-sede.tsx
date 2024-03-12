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
import { SEDE_KEYS } from "@/app/institucion/query-keys";
import { API } from "@/core/api-client";
import type { CreateLugarEjecucionParams } from "@/core/api/mallas-curriculares";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { ReplaceNullableToOptional, ZodInferSchema } from "@/utils/types";

const schema = z.object<
	ZodInferSchema<ReplaceNullableToOptional<CreateLugarEjecucionParams["data"]>>
>({
	codigo: z.string().optional(),
	sedeId: z.string(),
});

export default function AddSede({ mallaId }: { mallaId: string }) {
	const router = useRouter();
	const {
		data: instituciones,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: SEDE_KEYS.lists(),
		queryFn: () => {
			return API.sedes.getMany();
		},
		enabled: false,
	});
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async data => {
			return API.mallasCurriculares.createLugarEjecucion({
				mallaId,
				data: {
					...data,
					codigo: data.codigo || null,
				},
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
				title='Adicionar lugar de ejecucion'
				withTrigger
				triggerLabel='Agregar'
			>
				<FormField
					control={form.control}
					name='sedeId'
					render={({ field }) => {
						const options = instituciones?.data.map(i => ({
							value: i.id,
							label: i.nombre,
						}));

						return (
							<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
								<FormLabel className='col-span-3 text-end'>Sede</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value as string}
									disabled={field.disabled}
									onOpenChange={() => {
										if (!instituciones) {
											refetch();
										}
									}}
								>
									<FormControl>
										<SelectTrigger className='col-span-9'>
											<SelectValue
												placeholder={"------------"}
												className='w-full'
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{isLoading
											? "Cargando opciones..."
											: options
												? options.map(o => (
														<SelectItem value={o.value} key={o.value}>
															{o.label}
														</SelectItem>
													))
												: "No hay resultados"}
									</SelectContent>
								</Select>
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name={"codigo"}
					render={({ field }) => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 text-end'>Codigo</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value || undefined}
									className='col-span-9'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</MutateModal>
		</section>
	);
}
