"use client"
import { Input } from "@/app/_components/ui/input"
import { createColumnHelper } from "@tanstack/react-table"
import Image from "next/image"
import { useEffect, useState } from "react"

export type Asistencias = {
    presentes: number
    ausentes: number
    total: number
}
export type AsistenciasTableItem = Asistencias

const helper = createColumnHelper<AsistenciasTableItem>();

export const asistenciasColumns = [
	helper.accessor("presentes", {
		header: "Presentes",
	}),
	helper.accessor("ausentes", {
		header: "Ausentes",
	}),
    helper.accessor("total", {
        header: "Total",
    }),
];