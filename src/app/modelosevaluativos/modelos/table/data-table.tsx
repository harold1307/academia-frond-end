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
import {
	modelosEvaluativosColumns,
	ModelosEvaluativosTableItem,
} from "./columns";

interface DataTableProps {
	columns: typeof modelosEvaluativosColumns;
	data: ModelosEvaluativosTableItem[];
}

export function DataTable({ columns, data }: DataTableProps) {
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			columnVisibility,
		},
	});

	React.useEffect(() => {
		table.setColumnVisibility({
			id: false,
		});
	}, [table]);

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
										className={`${index === 0 ? "rounded-l-md border-l-2" : ""} 
										${index === headerGroup.headers.length - 1 ? " rounded-r-md border-r-2" : ""} 
										relative h-40 w-2 px-0 py-0 font-light`}
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
									<TableCell key={cell.id} className={`p-0`}>
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
