"use client";
import { createColumnHelper } from "@tanstack/react-table";

export type AsignaturaEnMallaTableItem = {
	id: string;
	ejeFormativo: string;
};

export const helper = createColumnHelper<AsignaturaEnMallaTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("ejeFormativo", {
		header: "",
	}),
];
