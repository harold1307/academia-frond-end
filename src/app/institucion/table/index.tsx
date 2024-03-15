"use client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { DataTable } from "@/app/_components/table";
import { Button } from "@/app/_components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/app/_components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { API } from "@/core/api-client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { sedeParams } from "../add-sede";
import { columns, type SedeTableItem } from "./columns";

export default function SedeTable({ sedes }: { sedes: SedeTableItem[] }) {
	return (
		<section>
			<DataTable<typeof columns, SedeTableItem[]>
				columns={columns}
				data={sedes}
				hideColumns={{
					id: false,
				}}
			/>
		</section>
	);
}

const createSedeSchema = z.object({
	nombre: z.string(),
	pais: z.string(),
	provincia: z.string(),
	canton: z.string(),
	alias: z.string(),
});

type Data = z.infer<typeof createSedeSchema>;

export function UpdateSedeTableModal(props: { sedees: SedeTableItem[] }) {
	const { router, replaceDelete, searchParams } = useMutateSearchParams();

	const {
		mutation: { mutate, isPending },
		form,
	} = useMutateModule({
		schema: createSedeSchema,
		mutationFn: async ({ data, id }: { data: Data; id: string }) => {
			return API.sedes.update({ data: data, id });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(sedeParams.delete);
			router.refresh();
		},
	});

	const paramSedeId = React.useMemo(
		() => searchParams.get(sedeParams.update),
		[searchParams],
	);

	if (!paramSedeId) return null;

	const selectedSede = props.sedees.find(i => i.id === paramSedeId);

	if (!selectedSede) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => replaceDelete(sedeParams.update)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isPending) return;
				if (!open) {
					replaceDelete(sedeParams.update);
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Actualizar sede</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(data =>
							mutate({ data, id: paramSedeId }),
						)}
						className='space-y-8'
					>
						<FormField
							control={form.control}
							name='nombre'
							defaultValue={selectedSede.nombre}
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
							defaultValue={selectedSede.tipo}
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
												{Object.keys(TipoSede).map(t => (
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
							defaultValue={selectedSede.pais}
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
							defaultValue={selectedSede.provincia}
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
							defaultValue={selectedSede.canton}
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
							defaultValue={selectedSede.alias}
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
							<Button type='submit' variant='success' disabled={isPending}>
								{isPending ? "Guardando..." : "Guardar"}
							</Button>
							<Button
								variant='destructive'
								type='button'
								onClick={() => replaceDelete(sedeParams.update)}
								disabled={isPending}
							>
								Cancelar
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function DeleteSedeModal(props: { sedees: SedeTableItem[] }) {
	const { replaceDelete, router, searchParams } = useMutateSearchParams();

	const { mutate: onSubmit, isPending: isPending } = useMutation({
		mutationFn: async (id: string) => {
			return API.sedes.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(sedeParams.delete);
			router.refresh();
		},
	});

	const paramSedeId = React.useMemo(
		() => searchParams.get(sedeParams.delete),
		[searchParams],
	);

	if (!paramSedeId) return null;

	const selectedSede = props.sedees.find(i => i.id === paramSedeId);

	if (!selectedSede) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(sedeParams.delete)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la sede: ${selectedSede.nombre}`}
			title='Eliminar sede'
			onDelete={() => onSubmit(selectedSede.id)}
			disabled={isPending}
			onClose={() => replaceDelete(sedeParams.delete)}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(sedeParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
