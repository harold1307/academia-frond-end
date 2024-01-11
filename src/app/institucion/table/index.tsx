"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoInstitucion } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { API } from "@/core/api-client";
import { ROUTES } from "@/core/routes";
import { institucionParams } from "../add-institucion";
import { INSTITUCION_KEYS } from "../query-keys";
import { columns, type InstitucionTableItem } from "./columns";
import { DataTable } from "./data-table";

export default function InstitucionTable() {
	const { data, isLoading } = useQuery({
		queryKey: INSTITUCION_KEYS.lists(),
		queryFn: async () => {
			const data = await API.instituciones.getMany();

			return data.data.map(({ createdAt: _, ...rest }) => ({
				...rest,
			}));
		},
	});

	if (isLoading) {
		return "Cargando tabla...";
	}

	if (isLoading && !data) {
		return "WTF";
	}

	if (!data) return "Ha ocurrido un error en el fetch";

	return (
		<section>
			<h1 className='text-2xl font-semibold'>Tabla</h1>
			<DataTable columns={columns} data={data} />
			<UpdateInstitucionTableModal instituciones={data} />
			<DeleteInstitucionModal instituciones={data} />
		</section>
	);
}

const createInstitucionSchema = z.object({
	nombre: z.string(),
	tipo: z.nativeEnum(TipoInstitucion),
	pais: z.string(),
	provincia: z.string(),
	canton: z.string(),
	codigo: z.string(),
});

type Data = z.infer<typeof createInstitucionSchema>;

function UpdateInstitucionTableModal(props: {
	instituciones: InstitucionTableItem[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async ({ data, id }: { data: Data; id: string }) => {
			return API.instituciones.update({ institucion: data, id });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			queryClient.invalidateQueries({
				queryKey: INSTITUCION_KEYS.lists(),
			});
			router.replace(ROUTES.institucion);
		},
	});

	const form = useForm<Data>({
		resolver: zodResolver(createInstitucionSchema),
		disabled: isSubmitting,
	});

	const paramInstitucionId = React.useMemo(
		() => searchParams.get(institucionParams.update),
		[searchParams],
	);

	if (!paramInstitucionId) return null;

	const selectedInstitucion = props.instituciones.find(
		i => i.id === paramInstitucionId,
	);

	if (!selectedInstitucion) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.institucion)}
			/>
		);
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={open => {
				if (isSubmitting) return;
				if (!open) {
					router.replace(ROUTES.institucion);
					return;
				}
			}}
		>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Actualizar institucion</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(data =>
							onSubmit({ data, id: paramInstitucionId }),
						)}
						className='space-y-8'
					>
						<FormField
							control={form.control}
							name='nombre'
							defaultValue={selectedInstitucion.nombre}
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
							name='tipo'
							defaultValue={selectedInstitucion.tipo}
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
						/>
						<FormField
							control={form.control}
							name='pais'
							defaultValue={selectedInstitucion.pais}
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
							defaultValue={selectedInstitucion.provincia}
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
							defaultValue={selectedInstitucion.canton}
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
							name='codigo'
							defaultValue={selectedInstitucion.codigo}
							render={({ field }) => (
								<FormItem className='mx-auto w-52 md:w-[390px]'>
									<div className='flex items-center justify-end gap-2'>
										<FormLabel>Codigo</FormLabel>
										<FormControl>
											<Input {...field} className='md:max-w-xs' />
										</FormControl>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type='submit' variant='success' disabled={isSubmitting}>
								{isSubmitting ? "Guardando..." : "Guardar"}
							</Button>
							<Button
								variant='destructive'
								type='button'
								onClick={() => router.replace(ROUTES.institucion)}
								disabled={isSubmitting}
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

function DeleteInstitucionModal(props: {
	instituciones: InstitucionTableItem[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
		mutationFn: async (id: string) => {
			return API.instituciones.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			queryClient.invalidateQueries({
				queryKey: INSTITUCION_KEYS.lists(),
			});
			router.replace(ROUTES.institucion);
		},
	});

	const paramInstitucionId = React.useMemo(
		() => searchParams.get("eliminarInstitucion"),
		[searchParams],
	);

	if (!paramInstitucionId) return null;

	const selectedInstitucion = props.instituciones.find(
		i => i.id === paramInstitucionId,
	);

	if (!selectedInstitucion) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => router.replace(ROUTES.institucion)}
			/>
		);
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar la institucion: ${selectedInstitucion.nombre}`}
			title='Eliminar institucion'
			onDelete={() => onSubmit(selectedInstitucion.id)}
			disabled={isSubmitting}
			onClose={() => router.replace(ROUTES.institucion)}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (isSubmitting) return;
					if (!open) {
						router.replace(ROUTES.institucion);
						return;
					}
				},
			}}
		/>
	);
}
