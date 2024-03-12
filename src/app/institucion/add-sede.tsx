"use client";
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
	FormMessage,
} from "@/app/_components/ui/form";
import { API } from "@/core/api-client";
import type { CreateSede } from "@/core/api/sede";
import { useMutateModule } from "@/hooks/use-mutate-module";
import type { ZodInferSchema } from "@/utils/types";
import { useRouter } from "next/navigation";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { SEDE_KEYS } from "./query-keys";

const createSedeSchema = z.object<ZodInferSchema<CreateSede>>({
	nombre: z.string(),
	pais: z.string(),
	provincia: z.string(),
	canton: z.string(),
	alias: z.string(),
});

export const sedeParams = {
	update: "actualizarSede",
	delete: "eliminarSede",
};

export default function AddSede() {
	const router = useRouter();

	const {
		mutation: { mutate, isPending },
		open,
		setOpen,
		form,
	} = useMutateModule({
		schema: createSedeSchema,
		invalidateQueryKey: SEDE_KEYS.all,
		mutationFn: async data => {
			return API.sedes.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.refresh();
		},
		hookFormProps: {
			shouldUnregister: true,
		},
	});

	return (
		<section className='mb-2'>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='success'>Adicionar</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar sede</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => mutate(data))}
							className='space-y-8'
						>
							<FormField
								control={form.control}
								disabled={isPending}
								name='nombre'
								render={({ field }) => (
									<FormItem className='mx-auto w-52 md:w-[390px]'>
										<div className='flex items-center justify-end gap-2'>
											<FormLabel>Nombre</FormLabel>
											<FormControl>
												<Input {...field} className='md:max-w-xs' />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								disabled={isPending}
								name='pais'
								render={({ field }) => (
									<FormItem className='mx-auto w-52 md:w-[390px]'>
										<div className='flex items-center justify-end gap-2'>
											<FormLabel>Pais</FormLabel>
											<FormControl>
												<Input {...field} className='md:max-w-xs' />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								disabled={isPending}
								name='provincia'
								render={({ field }) => (
									<FormItem className='mx-auto w-52 md:w-[390px]'>
										<div className='flex items-center justify-end gap-2'>
											<FormLabel>Provincia</FormLabel>
											<FormControl>
												<Input {...field} className='md:max-w-xs' />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								disabled={isPending}
								name='canton'
								render={({ field }) => (
									<FormItem className='mx-auto w-52 md:w-[390px]'>
										<div className='flex items-center justify-end gap-2'>
											<FormLabel>Canton</FormLabel>
											<FormControl>
												<Input {...field} className='md:max-w-xs' />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								disabled={isPending}
								name='alias'
								render={({ field }) => (
									<FormItem className='mx-auto w-52 md:w-[390px]'>
										<div className='flex items-center justify-end gap-2'>
											<FormLabel>Alias</FormLabel>
											<FormControl>
												<Input {...field} className='md:max-w-xs' />
											</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button type='submit' variant='success'>
									Guardar
								</Button>
								<Button
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
