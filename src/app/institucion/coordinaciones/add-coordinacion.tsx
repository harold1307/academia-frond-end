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
import type { CreateCoordinacion } from "@/core/api/coordinaciones";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { ZodInferSchema } from "@/utils/types";
import { SEDE_KEYS } from "../query-keys";

const schema = z.object<ZodInferSchema<CreateCoordinacion>>({
	alias: z.string(),
	nombre: z.string(),
	sedeId: z.string(),
});

export const coordinacionesParams = {
	update: "actualizarCoordinacion",
	delete: "eliminarCoordinacion",
};

export default function AddCoordinacion() {
	const router = useRouter();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async ({ sedeId, ...data }) => {
			return API.sedes.createCoordinacion({
				sedeId,
				data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
	});

	const {
		data: asignaturas,
		refetch: fetchAsignaturas,
		isLoading: asignaturasAreLoading,
	} = useQuery({
		queryKey: SEDE_KEYS.lists(),
		queryFn: () => API.sedes.getMany(),
		enabled: false,
	});

	return (
		<section className='mb-2'>
			<MutateModal
				dialogProps={{
					open,
					onOpenChange: setOpen,
				}}
				disabled={mutation.isPending}
				form={form}
				onSubmit={form.handleSubmit(data => mutation.mutate(data))}
				title='Adicionar coordinacion'
				withTrigger
				triggerLabel='Adicionar'
			>
				<FormField
					control={form.control}
					name={"sedeId"}
					render={({ field }) => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 text-end'>Sede</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value as string}
								disabled={field.disabled}
								onOpenChange={() => {
									if (!asignaturas?.data) {
										fetchAsignaturas();
									}
								}}
							>
								<FormControl>
									<SelectTrigger className='col-span-9'>
										<SelectValue className='w-full' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{asignaturasAreLoading
										? "Cargando opciones..."
										: asignaturas?.data?.length
											? asignaturas.data.map(a => (
													<SelectItem value={a.id} key={a.id}>
														{a.nombre}
													</SelectItem>
												))
											: "No hay resultados"}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
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
					name={"alias"}
					render={({ field }) => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 text-end'>Alias</FormLabel>
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
