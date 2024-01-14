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
import type { VariantesTableItem, variantesColumns } from "./columns";

interface DataTableProps {
	columns: typeof variantesColumns;
	data: VariantesTableItem[];
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
			<Table >
				<TableHeader>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => {
								return (
									<TableHead key={header.id}
									 className={
										`${index === 0 ? 'border-l-2 rounded-l-md' : ''} 
										${index === headerGroup.headers.length - 1 ? ' border-r-2 rounded-r-md' : ''} 
										font-light px-0 py-0 h-52 w-2 relative`
									 }
									>
										<p 
										 className={`${index > 2 && index < (headerGroup.headers.length - 1)? 'absolute h-full w-52 top-0 left-0 -rotate-90 text-left pl-4' : ' absolute bottom-0 w-full pb-2'}`}
										>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											)}
										</p>
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
