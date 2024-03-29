"use client";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
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
import type { columns, CursoTableItem } from "./columns";

interface DataTableProps {
	columns: typeof columns;
	data: CursoTableItem[];
}

export function DataTable({ columns, data }: DataTableProps) {
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
		<div>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => {
								return (
									<TableHead
										key={header.id}
										className={`${
											index === 0 ? "rounded-l-md border-l-2" : ""
										} ${
											index === headerGroup.headers.length - 1
												? " rounded-r-md border-r-2"
												: ""
										}`}
									>
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
				<TableBody
				// className="before:content-['space'] before:leading-8 before:text-transparent"
				>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map(row => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell, index) => (
									<TableCell
										key={cell.id}
										className={`${index === 1 ? "w-5/12" : ""} ${
											index === 0
												? "w-2/12 text-left"
												: index === row.getVisibleCells().length - 1
													? "flex items-end justify-end text-right"
													: " "
										}`}
									>
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
				</TableBody>
			</Table>
		</div>
	);
}
