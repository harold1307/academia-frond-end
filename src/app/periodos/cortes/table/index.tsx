"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { PlusCircle } from "lucide-react";
import React from "react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { ROUTES } from "@/core/routes";
import { cortesParams } from "../addCortes";
import { type CorteFromAPI } from "@/core/api/cortes";
import { useMutateModule } from "@/hooks/use-mutate-module";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export default function CortesTable({ cortes }: { cortes: CorteFromAPI[] }) {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={cortes} />
			<UpdateCortes cortes={cortes} />
			<DeleteCortes cortes={cortes} />
		</section>
	);
}

function UpdateCortes(props: { cortes: CorteFromAPI[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const createCorte = z.object({
		nombre: z.string(),
	});

	const updateCorteParams = z.object({
		data: createCorte,
		id: z.string(),
	});

	const {
		mutation: { mutate, isPending },
		form,
	} = useMutateModule({
		mutationFn: async ({ data, id }) => {
			return API.cortes.update({ data, id });
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			router.replace(ROUTES.periodo.cortes);
			router.refresh();
		},
	});

	const watch = form.watch();

	const cortesId = React.useMemo(
		() => searchParams.get(cortesParams.update),
		[searchParams],
	);
	console.log(watch);
	if (!cortesId) return null;

	const selectedCorte = props.cortes.find(i => i.id === cortesId);

	if (!selectedCorte) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.periodo.cortes)}
			/>
		);
	}
	return (
		<Dialog
			open={true}
			defaultOpen={true}
			onOpenChange={open => {
				if (isPending) return;
				if (!open) {
					router.replace(ROUTES.periodo.cortes);
					return;
				}
			}}
		>
			<DialogTrigger asChild>
				<button className='flex flex-row items-center gap-2 rounded-md border border-slate-400 p-2 hover:bg-slate-200 hover:text-slate-800'>
					<PlusCircle /> Agregar
				</button>
			</DialogTrigger>
			<DialogContent className='max-h-[80%] max-w-xs overflow-y-scroll sm:max-w-[425px] md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Actualizar cortes</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(data => mutate({ data, id: cortesId }))}
						className='space-y-8'
					>
						<FormField
							control={form.control}
							name='nombre'
							key={"nombre"}
							render={({ field }) => {
								return (
									<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
										<FormLabel className='col-span-3 text-end'>
											Nombre
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={
													typeof field.value === "boolean"
														? undefined
														: field.value || undefined
												}
												onChange={e => field.onChange(e.target.value)}
												type={"text"}
												placeholder={"Ingrese nombre de corte"}
												className='col-span-9'
											/>
										</FormControl>
									</FormItem>
								);
							}}
						/>
						<DialogFooter>
							<Button disabled={isPending} type='submit' variant='success'>
								Guardar
							</Button>
							<Button
								disabled={isPending}
								variant='destructive'
								type='button'
								onClick={() => router.replace(ROUTES.periodo.cortes)}
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

function DeleteCortes(props: { cortes: CorteFromAPI[] }) {
	const { replaceDelete, router, searchParams } = useMutateSearchParams();

	const {
		mutation: { mutate, isPending },
		form,
	} = useMutateModule({
		mutationFn: async id => {
			return API.cortes.deleteById(id);
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			replaceDelete(cortesParams.delete);
			router.refresh();
		},
	});

	const cortesId = React.useMemo(
		() => searchParams.get(cortesParams.delete),
		[searchParams],
	);
	if (!cortesId) return null;

	const selectedCorte = props.cortes.find(i => i.id === cortesId);

	if (!selectedCorte) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(cortesParams.delete)}
			/>
		);
	}
	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el corte: ${selectedCorte.nombre}`}
			title='Eliminar corte'
			onDelete={() => mutate(selectedCorte.id)}
			disabled={isPending}
			onClose={() => replaceDelete(cortesParams.delete)}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(cortesParams.delete);
						return;
					}
				},
			}}
			//deleteButtonLabel={isPending ? "Eliminando..." : "Eliminar"}
		/>
	);
}
