"use client";
import React from "react";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { API } from "@/core/api-client";
import type { ResponsableAsesorEstudianteWithAsesoresFromAPI } from "@/core/api/responsables-asesores-estudiante";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { formatFullName } from "@/utils";
import { asesoresAsignadosParams } from "../add-asesor-asignado";
import { ASESORES_ASIGNADOS_KEYS } from "../query-keys";
import { columns, type AsesorAsignadoTableItem } from "./columns";
import { DataTable } from "./data-table";

type AsesorAsignadoTableProps = {
	asesoresAsignados: AsesorAsignadoTableItem[];
};

export default function AsesorAsignadoTable({
	asesoresAsignados,
}: AsesorAsignadoTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={asesoresAsignados} />
		</section>
	);
}

export function DeleteAsesorAsignado({
	asesoresAsignados,
}: {
	asesoresAsignados: ResponsableAsesorEstudianteWithAsesoresFromAPI["asesores"];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.responsablesAsesoresEstudiante.deleteAsesorRelation({
				responsableEnAsesorEstudianteId: id,
			});
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(asesoresAsignadosParams.delete);
			router.refresh();
		},
		invalidateQueryKey: ASESORES_ASIGNADOS_KEYS.all,
	});

	const paramAsesorAsignadoId = React.useMemo(
		() => searchParams.get(asesoresAsignadosParams.delete),
		[searchParams],
	);

	if (!paramAsesorAsignadoId) return null;

	const selectedAsesorAsignado = asesoresAsignados.find(
		i => i.asesorEstudiante.id === paramAsesorAsignadoId,
	);

	if (!selectedAsesorAsignado) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(asesoresAsignadosParams.delete)}
			/>
		);
	}

	const fullName = formatFullName(
		selectedAsesorAsignado.asesorEstudiante.administrativo.usuario.nombres,
		selectedAsesorAsignado.asesorEstudiante.administrativo.usuario
			.primerApellido,
		selectedAsesorAsignado.asesorEstudiante.administrativo.usuario
			.segundoApellido,
	);

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el asesor asignado a responsable: ${fullName}`}
			title='Eliminar asesor asignado a responsable'
			onDelete={() => mutate(selectedAsesorAsignado.id)}
			disabled={isPending}
			onClose={() => replaceDelete(asesoresAsignadosParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(asesoresAsignadosParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
