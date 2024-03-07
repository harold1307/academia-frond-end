"use client";
import React from "react";

import DeleteModal from "@/app/_components/modals/delete-modal";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import { API } from "@/core/api-client";
import type { ResponsableCrmFromAPI } from "@/core/api/responsables-crm";
import { useMutateModule } from "@/hooks/use-mutate-module";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { formatFullName } from "@/utils";
import { responsablesCrmParams } from "../add-responsable-crm";
import { RESPONSABLES_CRM_KEYS } from "../query-keys";
import { columns, type ResponsableCrmTableItem } from "./columns";
import { DataTable } from "./data-table";

type ResponsableCrmTableProps = {
	responsablesCrm: ResponsableCrmTableItem[];
};

export default function ResponsableCrmTable({
	responsablesCrm,
}: ResponsableCrmTableProps) {
	return (
		<section>
			<DataTable columns={columns} data={responsablesCrm} />
		</section>
	);
}

export function DeleteResponsableCrm({
	responsablesCrm,
}: {
	responsablesCrm: ResponsableCrmFromAPI[];
}) {
	const { searchParams, router, replaceDelete } = useMutateSearchParams();
	const {
		mutation: { isPending, mutate },
	} = useMutateModule({
		mutationFn: (id: string) => {
			return API.responsablesCrm.deleteById(id);
		},
		onSuccess: response => {
			console.log({ response });
			replaceDelete(responsablesCrmParams.delete);
			router.refresh();
		},
		invalidateQueryKey: RESPONSABLES_CRM_KEYS.all,
	});

	const paramResponsableCrmId = React.useMemo(
		() => searchParams.get(responsablesCrmParams.delete),
		[searchParams],
	);

	if (!paramResponsableCrmId) return null;

	const selectedResponsableCrm = responsablesCrm.find(
		i => i.id === paramResponsableCrmId,
	);

	if (!selectedResponsableCrm) {
		return (
			<ModalFallback
				action='delete'
				redirectTo={() => replaceDelete(responsablesCrmParams.delete)}
			/>
		);
	}

	const fullName = formatFullName(
		selectedResponsableCrm.administrativo.usuario.nombres,
		selectedResponsableCrm.administrativo.usuario.primerApellido,
		selectedResponsableCrm.administrativo.usuario.segundoApellido,
	);

	return (
		<DeleteModal
			description={`Estas seguro que deseas eliminar el responsable de CRM: ${fullName}`}
			title='Eliminar responsable de CRM'
			onDelete={() => mutate(selectedResponsableCrm.id)}
			disabled={isPending}
			onClose={() => replaceDelete(responsablesCrmParams.delete)}
			dialogProps={{
				defaultOpen: true,
				onOpenChange: open => {
					if (isPending) return;
					if (!open) {
						replaceDelete(responsablesCrmParams.delete);
						return;
					}
				},
			}}
		/>
	);
}
