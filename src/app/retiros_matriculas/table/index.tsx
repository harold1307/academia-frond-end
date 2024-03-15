"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { PlusCircle } from "lucide-react";
import React from "react";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { type CorteFromAPI } from "@/core/api/cortes";
import { useMutateModule } from "@/hooks/use-mutate-module";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export default function RetirosTable({ retiros }: { retiros: any[] }) {
	return (
		<section className='my-2'>
			<DataTable columns={columns} data={retiros} />
			<MotivoRetiro retiros={retiros} />
		</section>
	);
}

function MotivoRetiro(props: { retiros: any[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();

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
			router.replace(ROUTES.retiros_matriculas.path);
			router.refresh();
		},
	});

	const watch = form.watch();

	const retiroId = React.useMemo(
		() => searchParams.get("motivo"),
		[searchParams],
	);
	console.log(watch);
	if (!retiroId) return null;

	const selectedRetiro = props.retiros.find(i => i.id === retiroId);

	if (!selectedRetiro) {
		return (
			<ModalFallback
				action='update'
				redirectTo={() => router.replace(ROUTES.retiros_matriculas.path)}
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
					router.replace(ROUTES.retiros_matriculas.path);
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
                <DialogDescription>
                    {selectedRetiro.motivo}
                </DialogDescription>
				<DialogFooter>
					<Button disabled={isPending} type='submit' variant='success'>
						Guardar
					</Button>
					<Button
						disabled={isPending}
						variant='destructive'
						type='button'
						onClick={() => router.replace(ROUTES.retiros_matriculas.path)}
					>
						Cancelar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
