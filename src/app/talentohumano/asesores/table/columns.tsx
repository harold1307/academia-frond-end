"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import EstudiantesTableModal from "../../[asesoresId]/estudiantes";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes";
import { Equal } from "lucide-react";

export type AsesoresSchema = {
	nombre: string;
	id: string;
	emailtelefono: string;
	estudiantes: number;
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
	helper.accessor("estudiantes", {
		header: "",
		cell: () => <ButtonEstudiantes />,
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

function ButtonEstudiantes() {
	return <EstudiantesTableModal />;
}
