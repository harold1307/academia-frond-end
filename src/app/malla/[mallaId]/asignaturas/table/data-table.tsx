"use client";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type VisibilityState,
} from "@tanstack/react-table";
import React from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/app/_components/ui/table";
import type { MallaCurricularFromAPI } from "@/core/api/mallas-curriculares";
import type { NIVELES_PREFIXES } from "@/utils/forms";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			id: false,
		});

	const table = useReactTable({
		data,
		columns,
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
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-24 text-center'>
								No results.
							</TableCell>
						</TableRow>
					)}
					{!!table.getRowModel().rows?.length &&
						(() => {
							const { rows } = table.getRowModel();
							const totalNivelesConfig = {
								horas: 0,
								horasSem: 0,
								credits: 0,
							};
							const niveles = columns
								.filter(c => (c.header as string)?.includes("NIVEL"))
								.map(c => c.id as `${(typeof NIVELES_PREFIXES)[number]} NIVEL`)
								.map(nivel => {
									const config = {
										horas: 0,
										horasSem: 0,
										credits: 0,
										name: nivel,
									};

									rows.forEach(r => {
										const asignaturas = r.getValue(
											nivel,
										) as MallaCurricularFromAPI["niveles"][number]["asignaturas"];

										asignaturas.forEach(asignatura => {
											if (asignatura.sumaHoras) {
												config.horasSem +=
													asignatura.maximaCantidadHorasSemanalas;
												config.horas +=
													asignatura.horasAsistidasDocente +
													asignatura.horasAutonomas +
													asignatura.horasColaborativas +
													asignatura.horasPracticas;
												config.credits += asignatura.creditos;
											}
										});
									});

									totalNivelesConfig.horasSem += config.horasSem;
									totalNivelesConfig.horas += config.horas;
									totalNivelesConfig.credits += config.credits;

									return config;
								});

							console.log({ niveles });

							return (
								<TableRow>
									<TableCell>TOTALES</TableCell>
									{niveles.map(nivel => {
										return (
											<TableCell key={nivel.name}>
												<div>Horas: {nivel.horas}</div>
												<div>Horas Sem: {nivel.horasSem}</div>
												<div>Creditos: {nivel.credits}</div>
											</TableCell>
										);
									})}
									<TableCell>
										<div>Horas: {totalNivelesConfig.horas}</div>
										<div>Horas Sem: {totalNivelesConfig.horasSem}</div>
										<div>Creditos: {totalNivelesConfig.credits}</div>
									</TableCell>
								</TableRow>
							);
						})()}
				</TableBody>
			</Table>
		</div>
	);
}
