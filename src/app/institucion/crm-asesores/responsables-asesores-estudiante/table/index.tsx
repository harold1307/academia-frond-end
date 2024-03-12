"use client";
import React from "react";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { API } from "@/core/api-client";
import type { ResponsableAsesorEstudianteFromAPI } from "@/core/api/responsables-asesores-estudiante";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { formatFullName } from "@/utils";
import { responsablesAsesorEstudianteParams } from "../add-responsable-asesor-estudiante";
import { RESPONSABLES_ASESORES_ESTUDIANTE_KEYS } from "../query-keys";
import { columns, type ResponsableAsesorEstudianteTableItem } from "./columns";
import { DataTable } from "./data-table";

type ResponsableAsesorEstudianteTableProps = {
	responsablesAsesorEstudiante: ResponsableAsesorEstudianteTableItem[];
};

export default function ResponsableAsesorEstudianteTable({
	responsablesAsesorEstudiante,
}: ResponsableAsesorEstudianteTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={responsablesAsesorEstudiante} />
		</section>
	);
}

export function DeleteResponsableAsesorEstudiante({
	responsablesAsesorEstudiante,
}: {
	responsablesAsesorEstudiante: ResponsableAsesorEstudianteFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.responsablesAsesoresEstudiante.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(responsablesAsesorEstudianteParams.delete);
			router.refresh();
		},
		invalidateQueryKey: RESPONSABLES_ASESORES_ESTUDIANTE_KEYS.all,
	});

	const paramResponsableAsesorEstudianteId = React.useMemo(
		() => searchParams.get(responsablesAsesorEstudianteParams.delete),
		[searchParams],
	);

	if (!paramResponsableAsesorEstudianteId) return null;

	const selectedResponsableAsesorEstudiante = responsablesAsesorEstudiante.find(
		i => i.id === paramResponsableAsesorEstudianteId,
	);

	if (!selectedResponsableAsesorEstudiante) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() =>
					replaceDelete(responsablesAsesorEstudianteParams.delete)
				}
			/>
		);
	}

	const fullName = formatFullName(
		selectedResponsableAsesorEstudiante.administrativo.usuario.nombres,
		selectedResponsableAsesorEstudiante.administrativo.usuario.primerApellido,
		selectedResponsableAsesorEstudiante.administrativo.usuario.segundoApellido,
	);

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el responsable de asesor de estudiante: ${fullName}`}
			title='Eliminar responsable de asesor de estudiante'
			onDelete={() => mutate(selectedResponsableAsesorEstudiante.id)}
			disabled={isPending}
			onClose={() => replaceDelete(responsablesAsesorEstudianteParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(responsablesAsesorEstudianteParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
