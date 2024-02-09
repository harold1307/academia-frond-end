import { Input } from "@/app/_components/ui/input";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useState } from "react";

export type Incidencias = {
	id: string;
	tipo: string; //Select
	descripcion: string;
};
export type IncidenciasTableItem = Incidencias;

const helper = createColumnHelper<IncidenciasTableItem>();

export const incidenciasColumn = [
	helper.accessor("tipo", {
		header: "Tipo",
	}),
];
