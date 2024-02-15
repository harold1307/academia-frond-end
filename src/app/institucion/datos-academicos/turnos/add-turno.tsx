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
import type { CreateTurno } from "@/core/api/turnos";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";

const schema = z.object<ZodInferSchema<Omit<CreateTurno, "sesionId">>>({
	horas: z.number(),
	comienza: z.string(),
	termina: z.string(),
});

export const turnosParams = {
	update: "actualizarTurno",
	delete: "eliminarTurno",
};

export default function AddTurno({
	sesionId,
}: {
	sesionId: string | undefined;
}) {
	const router = useRouter();
	const {
		form,
		mutation: { isPending, mutate },
		open,
		setOpen,
	} = useMutateModule({
		schema,
		mutationFn: async ({ comienza, termina, horas }) => {
			if (!sesionId) return;

			const comienzaDate = new Date();
			const [comienzaHours, comienzaMinutes] = comienza.split(":");

			comienzaDate.setHours(+(comienzaHours || "0"));
			comienzaDate.setMinutes(+(comienzaMinutes || "0"));

			const terminaDate = new Date();
			const [terminaHours, terminaMinutes] = termina.split(":");

			terminaDate.setHours(+(terminaHours || "0"));
			terminaDate.setMinutes(+(terminaMinutes || "0"));

			return API.sesiones.createTurno({
				sesionId,
				data: {
					horas,
					comienza: comienzaDate.toISOString(),
					termina: terminaDate.toISOString(),
				},
			});
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
				title='Adicionar turno'
				withTrigger
				triggerLabel='Adicionar'
			>
				{turnoFields.map(f => {
					return (
						<FormField
							control={form.control}
							name={f.name}
							key={f.name}
							disabled={isPending}
							shouldUnregister={true}
							render={({ field }) => {
								if (f.inputType === "time") {
									return (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													type={f.inputType}
													className='col-span-9 w-48'
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
												onChange={e => field.onChange(+e.target.value)}
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

export const turnoFields = [
	{
		name: "comienza",
		label: "Comienza",
		inputType: "time",
	},
	{
		name: "termina",
		label: "Termina",
		inputType: "time",
	},
	{
		name: "horas",
		label: "Horas",
		inputType: "number",
	},
] satisfies Field<keyof z.infer<typeof schema>>[];
