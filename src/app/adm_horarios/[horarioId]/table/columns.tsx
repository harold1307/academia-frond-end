"use client";
import { createColumnHelper } from "@tanstack/react-table";

export type Week = {
	lunes: string;
	martes: string;
	miercoles: string;
	jueves: string;
	viernes: string;
	sabado: string;
	domingo: string;
};
export type WeekTableItem = Week;

const helper = createColumnHelper<WeekTableItem>();

export const weekColumns = [
	helper.accessor("lunes", {
		header: "Lunes",
	}),
	helper.accessor("martes", {
		header: "Martes",
	}),
	helper.accessor("miercoles", {
		header: "Miércoles",
	}),
	helper.accessor("jueves", {
		header: "Jueves",
	}),
	helper.accessor("viernes", {
		header: "Viernes",
	}),
	helper.accessor("sabado", {
		header: "Sábado",
	}),
	helper.accessor("domingo", {
		header: "Domingo",
	}),
];
