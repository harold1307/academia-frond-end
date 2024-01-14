"use client";
import type { Curso } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { z } from "zod";

import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { API } from "@/core/api-client";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { cursosParams, fields } from "../add-curso";
import { CURSO_KEYS } from "../query-keys";
import { columns, type CursoTableItem } from "./columns";
import { DataTable } from "./data-table";
import DeleteModal from "@/app/_components/modals/delete-modal";

interface CursoTableProps {
	data: Curso[]
}

export default function CursoTable({ data }:CursoTableProps) {

	const cursos = React.useMemo(() => {
		return data?.map(
			curso =>
				({
					...curso,
				}) satisfies CursoTableItem,
		);
	}, [data]);


	if (!cursos) return "Ha ocurrido un error en el fetch";

	return (
		<section className=''>
			{/* <h1 className='text-2xl font-semibold'>Tabla</h1> */}
			<DataTable columns={columns} data={cursos} />
			<UpdateCursoModal cursos={cursos} />
			<DeactivateCursoModal cursos={cursos} />
		</section>
	);
}

const schema = z.object({
	nombre: z.string(),
	certificado: z.string().optional(),
	alias: z.string().optional(),
});

function UpdateCursoModal({ cursos }: { cursos: Curso[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(cursosParams.update);

		router.replace(pathname + "?" + newParams.toString());
	};

	const { form, mutation } = useMutateModule({
		invalidateQueryKey: CURSO_KEYS.lists(),
		schema,
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: z.infer<typeof schema>;
		}) => {
			return API.cursos.update({
				id,
				curso: data,
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			dismissModal();
		},
	});

	const paramCursoId = React.useMemo(
		() => searchParams.get(cursosParams.update),
		[searchParams],
	);

	if (!paramCursoId) return null;

	const selectedCurso = cursos.find(i => i.id === paramCursoId);

	if (!selectedCurso) {
		return <ModalFallback action='update' redirectTo={() => dismissModal()} />;
	}

	return (
		<MutateModal
			form={form}
			title='Actualizar curso'
			disabled={mutation.isPending}
			onSubmit={form.handleSubmit(data =>
				mutation.mutate({ data, id: paramCursoId }),
			)}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						dismissModal();
						return;
					}
				},
			}}
		>
			{fields.map(f => (
				<FormField
					control={form.control}
					name={f.name}
					key={f.name}
					defaultValue={selectedCurso[f.name] || undefined}
					render={({ field }) => (
						<FormItem className='grid grid-cols-12 items-center gap-4 space-y-0'>
							<FormLabel className='col-span-3 text-end'>{f.label}</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value || undefined}
									type={f.inputType}
									className='col-span-9'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			))}
		</MutateModal>
	);
}

function DeactivateCursoModal({ cursos }: { cursos: Curso[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const dismissModal = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete(cursosParams.deactivate);

		router.replace(pathname + "?" + newParams.toString());
	};

	const { mutation } = useMutateModule({
		invalidateQueryKey: CURSO_KEYS.lists(),
		mutationFn: async ({ id, estado }: { id: string; estado: boolean }) => {
			return API.cursos.update({
				id,
				curso: {
					estado: !estado,
				},
			});
		},
		onError: console.error,
		onSuccess: response => {
			console.log({ response });
			dismissModal();
		},
	});

	const paramAsignaturaId = React.useMemo(
		() => searchParams.get(cursosParams.deactivate),
		[searchParams],
	);

	if (!paramAsignaturaId) return null;

	const selectedCurso = cursos.find(i => i.id === paramAsignaturaId);

	if (!selectedCurso) {
		return <ModalFallback action='delete' redirectTo={() => dismissModal()} />;
	}

	return (
		<DeleteModal
			description={`Estas seguro que deseas desactivar el curso: ${selectedCurso.nombre}`}
			title='Desactivar curso'
			onDelete={() =>
				mutation.mutate({ id: selectedCurso.id, estado: selectedCurso.estado })
			}
			disabled={mutation.isPending}
			onClose={() => dismissModal()}
			dialogProps={{
				open: true,
				onOpenChange: open => {
					if (mutation.isPending) return;
					if (!open) {
						dismissModal();
						return;
					}
				},
			}}
			deleteButtonLabel={mutation.isPending ? "Desactivando..." : "Desactivar"}
		/>
	);
}
