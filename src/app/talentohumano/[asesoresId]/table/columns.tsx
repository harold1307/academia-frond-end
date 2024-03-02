import { createColumnHelper } from "@tanstack/react-table";

export type EstudiantesTableItem = {
	nombre: string;
	id: string;
	emailtelefono: string;
};

const helper = createColumnHelper<EstudiantesTableItem>();

export const estudiantesColumns = [
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("id", {
		header: "Identificación",
	}),
	helper.accessor("emailtelefono", {
		header: "Email/Telefono",
	}),
	helper.display({id: 'eliminar', cell: 'x'})
];
