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
import type { CursoTableItem, columns } from "./columns";

interface DataTableProps {
	columns: typeof columns;
	data: CursoTableItem[];
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
			<Table style={{
				borderCollapse:'separate',
				borderSpacing: '0 1.5rem',
				padding: '1.5rem',
				boxSizing: 'border-box'
			}}>
				<TableHeader className='rounded-md text-white-500 text-lg'
				style={{
					// marginTop: '5rem',
					boxShadow: '0 0 25px 0 rgba(67, 84, 234, .7)'
				}}>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => {
								return (
									<TableHead key={header.id}
									 className={`h-16 text-white-500 text-center ${index === 0 ? 'border-l-2 rounded-l-md' : ''} border-t-2 border-b-2 ${index === headerGroup.headers.length - 1 ? ' border-r-2 rounded-r-md' : ''}`}
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
				style={{zIndex: 10}}
				>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map(row => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className="rounded-md text-white-500"
								style={{
									boxShadow: '-10px 10px 7px rgba(67, 84, 234, .3)'
								}}
							>
								{row.getVisibleCells().map((cell, index) => (
									<TableCell key={cell.id} className={`${index === 1 ? 'w-5/12' : ''} ${index === 0 ? 'text-left w-2/12' : ( index === row.getVisibleCells().length - 1 ? 'text-right flex justify-end items-end' : 'text-center')} h-32`}>
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
