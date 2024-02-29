"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";

export type AsesoresSchema = {
	nombre: string;
	id: string;
	emailtelefono: string;
	activo: boolean;
};

export type AsesoresTableItem = AsesoresSchema;

const helper = createColumnHelper<AsesoresTableItem>();

export const AsesoresColumns = [
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("id", { header: "Identificacion" }),
	helper.accessor("emailtelefono", {
		header: "Email/Telefono",
	}),
	helper.display({
		id: "estudiantes",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			return <Estudiantes id={id} />;
		},
	}),
	helper.accessor("activo", {
		header: "Activo",
		cell: ({ getValue }) => {
			const value = getValue();
			return <Switcher value={value} />;
		},
	}),
];

function Switcher({ value }: { value: boolean }) {
	const [valor, setValor] = useState(value);

	return (
		<Button
			className='m-2 h-8 w-8 border border-current bg-transparent p-2 text-current hover:text-black'
			onClick={() => setValor(!valor)}
		>
			{valor ? "SI" : "NO"}
		</Button>
	);
}

function Estudiantes({ id }: { id: string }) {
	return (
		<Button className='hover:bg-slate-300 hover:text-slate-800'>
			Estudiantes - 25
		</Button>
	);
}
