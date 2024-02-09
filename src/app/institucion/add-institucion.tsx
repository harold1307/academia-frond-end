"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
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
import type { ZodInferSchema } from "@/utils/types";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { INSTITUCION_KEYS } from "./query-keys";

const createInstitucionSchema = z.object<ZodInferSchema<CreateSede>>({
	nombre: z.string(),
	pais: z.string(),
	provincia: z.string(),
	canton: z.string(),
	alias: z.string(),
});

type Data = z.infer<typeof createInstitucionSchema>;

export const institucionParams = {
	update: "actualizarInstitucion",
	delete: "eliminarInstitucion",
};

export default function AddInstitucion() {
	const [open, setOpen] = React.useState(false);
	const queryClient = useQueryClient();

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async (data: Data) => {
			return API.sedes.create(data);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			queryClient.invalidateQueries({
				queryKey: INSTITUCION_KEYS.lists(),
			});
			setOpen(false);
		},
	});

	const form = useForm<Data>({
		resolver: zodResolver(createInstitucionSchema),
		disabled: isSubmitting,
		shouldUnregister: true,
	});

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Adicionar institucion</h1>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='success'>Adicionar</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
					<DialogHeader>
						<DialogTitle>Adicionar institucion</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(data => onSubmit(data))}
							className='space-y-8'
						>
							<FormField
								control={form.control}
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
							{/* <FormField
								control={form.control}
								name='tipo'
								render={({ field }) => (
									<FormItem className='mx-auto w-52 md:w-[390px]'>
										<div className='flex items-center justify-end gap-2'>
											<FormLabel>Tipo</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className='md:max-w-xs'>
														<SelectValue placeholder='--------------------' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.keys(TipoInstitucion).map(t => (
														<SelectItem key={t} value={t}>
															{t}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/> */}
							<FormField
								control={form.control}
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
