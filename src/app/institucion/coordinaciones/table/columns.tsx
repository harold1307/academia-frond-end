import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import React from "react";

import BaseTableActions from "@/app/_components/table-actions";
import StatusButtonTooltip from "@/app/_components/table/status-button-tooltip";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/app/_components/ui/table";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { coordinacionesParams } from "../add-coordinacion";

export type CoordinacionTableItem = {
	id: string;
	nombre: string;
	alias: string;
	profesores: number;
	programas: NestedProgramasInCoordinacionTableItem[];
	enUso: boolean;
};

export type NestedProgramasInCoordinacionTableItem = {
	id: string;
	programa: string;
	inscritos: number;
	egresados: number;
	graduados: number;
	retirados: number;
};

const nestedHelper =
	createColumnHelper<NestedProgramasInCoordinacionTableItem>();
const helper = createColumnHelper<CoordinacionTableItem>();

const nestedColumns = [
	nestedHelper.accessor("id", {}),
	nestedHelper.accessor("programa", {
		header: "Programa",
	}),
	nestedHelper.accessor("inscritos", {
		header: "Inscritos",
	}),
	nestedHelper.accessor("egresados", {
		header: "Egresados",
	}),
	nestedHelper.accessor("graduados", {
		header: "Graduados",
	}),
	nestedHelper.accessor("retirados", {
		header: "Retirados",
	}),
	nestedHelper.display({
		id: "actions",
	}),
];

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("alias", {
		header: "Alias",
	}),
	helper.accessor("profesores", {
		header: "Profesores",
	}),
	helper.accessor("programas", {
		header: "Programas",
		cell: function NestedTable({ getValue }) {
			const programas = getValue();

			const [columnVisibility, setColumnVisibility] =
				React.useState<VisibilityState>({ id: false });
			const table = useReactTable({
				data: programas,
				columns: nestedColumns,
				getCoreRowModel: getCoreRowModel(),
				onColumnVisibilityChange: setColumnVisibility,
				state: {
					columnVisibility,
				},
			});

			return (
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map(headerGroup => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map(header => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map(cell => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			);
		},
	}),
	helper.accessor("enUso", {
		header: "En Uso",
		cell: ({ getValue, column }) => (
			<StatusButtonTooltip
				status={getValue()}
				hoverTitle={column.columnDef.header as string}
			/>
		),
	}),
	helper.display({
		id: "actions",
		cell: function Actions({ row }) {
			const { replaceSet } = useMutateSearchParams();
			const enUso = row.getValue("enUso") as boolean;
			const id = row.getValue("id") as string;

			return (
				<BaseTableActions
					updateOptions={{
						buttonProps: {
							onClick: () => {
								replaceSet(coordinacionesParams.update, id);
							},
						},
					}}
					deleteOptions={{
						show: !enUso,
						buttonProps: {
							onClick: () => {
								replaceSet(coordinacionesParams.delete, id);
							},
						},
					}}
				/>
			);
		},
	}),
];
