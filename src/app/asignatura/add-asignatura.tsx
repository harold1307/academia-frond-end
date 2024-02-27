"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { API } from "@/core/api-client";
import type { CreateAsignatura } from "@/core/api/asignaturas";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { Field } from "@/utils/forms";
import type { ZodInferSchema } from "@/utils/types";
import { useRouter } from "next/navigation";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { PlusCircle } from "lucide-react";

const schema = z.object<ZodInferSchema<CreateAsignatura>>({
	nombre: z.string(),
	codigo: z.string().nullable(),
});

export default function AddAsignatura() {
	const router = useRouter();
	const { form, mutation, open, setOpen } = useMutateModule({
		schema,
		mutationFn: async data => {
			return API.asignaturas.create({
				...data,
				codigo: data.codigo || null,
			});
		},

		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},

		hookFormProps: {
			resolver: zodResolver(schema),
			defaultValues: {
				codigo: "",
			},
			shouldUnregister: true,
		},
	});

	return (
		<section className='mb-2'>
			<Dialog
				open={open}
				onOpenChange={state => {
					if (mutation.isPending) return;
					setOpen(state);
				}}
			>
				<DialogTrigger asChild>
					<Button variant='outline'>
						<PlusCircle className='mr-2' />
						Agregar
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-auto sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar malla</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => mutation.mutate(data))}
							className='space-y-8'
						>
							{fields.map(f => (
								<FormField
									control={form.control}
									name={f.name}
									key={f.name}
									render={({ field }) => (
										<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
											<FormLabel className='col-span-3 text-end'>
												{f.label}
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													value={field.value as string}
													type={f.inputType}
													className='col-span-9'
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							))}
							<DialogFooter>
								<Button
									disabled={mutation.isPending}
									type='submit'
									variant='success'
								>
									Guardar
								</Button>
								<Button
									disabled={mutation.isPending}
									variant='destructive'
									type='button'
									onClick={() => setOpen(false)}
								>
									Cancelar
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</section>
	);
}

const fields = [
	{
		name: "nombre",
		inputType: "text",
		label: "Nombre",
	},
	{
		name: "codigo",
		inputType: "text",
		label: "Codigo",
	},
] satisfies Field<keyof CreateAsignatura>[];
