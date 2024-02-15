import { createColumnHelper } from "@tanstack/react-table";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { turnosParams } from "../add-turno";
import { useMutation } from "@tanstack/react-query";
import { API } from "@/core/api-client";
import { useRouter } from "next/navigation";

export function formatDateToTurnoTime(dateString: Date | string) {
	let date = new Date();

	if (dateString instanceof Date) {
		date = dateString;
	} else {
		date = new Date(dateString);
	}

	return new Intl.DateTimeFormat(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export type TurnoTableItem = {
	id: string;
	horas: number;
	comienza: Date;
	termina: Date;
	enUso: boolean;
	activo: boolean;
};

const helper = createColumnHelper<TurnoTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.display({
		id: "nombre",
		header: "Nombre",
		cell: ({ row }) => {
			const comienzaDate = row.getValue("comienza") as Date;
			const terminaDate = row.getValue("termina") as Date;

			return `TURNO [${formatDateToTurnoTime(
				comienzaDate,
			)} a ${formatDateToTurnoTime(terminaDate)}]`;
		},
	}),
	helper.accessor("horas", {
		header: "Horas",
	}),
	helper.accessor("comienza", {
		header: "Comienza",
		cell: ({ getValue }) => formatDateToTurnoTime(getValue()),
	}),
	helper.accessor("termina", {
		header: "Termina",
		cell: ({ getValue }) => formatDateToTurnoTime(getValue()),
	}),
	helper.accessor("enUso", {
		header: "En uso",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.accessor("activo", {
		header: "Activo",
		cell: function Activo({ getValue, column, row }) {
			const router = useRouter();
			const { mutate, isPending } = useMutation({
				mutationFn: () => {
					return API.turnos.update({
						id: row.getValue("id") as string,
						data: {
							estado: !getValue(),
						},
					});
				},
				onSuccess: () => {
					router.refresh();
				},
			});
			return (
				<StatusButtonTooltip
					onClick={async () => {
						if (isPending) return;

						await mutate();
					}}
					status={getValue()}
					hoverTitle={column.columnDef.header as string}
				/>
			);
		},
	}),
	helper.display({
		id: "actions",
		cell: function Actions({ row }) {
			const { replaceSet } = useMutateSearchParams();
			const id = row.getValue("id") as string;
			const enUso = row.getValue("enUso") as boolean;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => replaceSet(turnosParams.update, id),
						},
						show: !enUso,
					}}
					deleteOptions={{
						buttonProps: {
							onClick: () => replaceSet(turnosParams.delete, id),
						},
						show: !enUso,
					}}
				/>
			);
		},
	}),
];
