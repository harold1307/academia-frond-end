import { createColumnHelper } from "@tanstack/react-table";

export type TalentoHumano = {
	nombre: string;
	departamento: string;
	id: string;
	emailtelefono: string;
	datos: string;
	etnia: string;
	asesor: boolean;
	discapacidad: boolean;
	admin: boolean;
	profesor: boolean;
	foto: boolean;
};

export type TalentoHumanoTableItem = TalentoHumano;

const helper = createColumnHelper<TalentoHumanoTableItem>();

export const TalentoHumanoColumns = [
	helper.accessor("nombre", {
		header: "Nombre",
	}),
	helper.accessor("departamento", {
		header: "Departamento",
	}),
	helper.accessor("id", {
		header: "ID",
	}),
	helper.accessor("emailtelefono", {
		header: "Email/Telefono",
	}),
	helper.accessor("datos", {
		header: "Datos",
	}),
	helper.accessor("etnia", {
		header: "Etnia",
	}),
	helper.accessor("asesor", {
		header: "Asesor",
	}),
	helper.accessor("discapacidad", {
		header: "Discapacidad",
	}),
	helper.accessor("admin", {
		header: "Admin",
	}),
	helper.accessor("profesor", {
		header: "Profesor",
	}),
	helper.accessor("foto", {
		header: "Foto",
	}),
];
