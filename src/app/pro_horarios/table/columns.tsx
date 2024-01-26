"use client";
import { createColumnHelper } from "@tanstack/react-table"
import HorarioCard, { HorarioCardT } from "../horarioCard";


export type Week = {
	lunes: HorarioCardT | string
	martes: HorarioCardT | string
	miercoles: HorarioCardT | string
	jueves: HorarioCardT | string
	viernes: HorarioCardT | string
	sabado: HorarioCardT | string
	domingo: HorarioCardT | string
}
export type WeekTableItem = Week

const helper = createColumnHelper<WeekTableItem>();

export const weekColumns = [
	helper.accessor("lunes", {
		header: "Lunes",
        cell: ({ getValue }) => {
			const value = getValue()
			if(typeof value === 'string') return value
			else return <HorarioCard data={getValue() as HorarioCardT} />
		}
	}),
	helper.accessor("martes", {
		header: "Martes",
		cell: ({ getValue }) => {
			const value = getValue()
			if(typeof value === 'string') return value
			else return <HorarioCard data={getValue() as HorarioCardT} />
		}
	}),
	helper.accessor("miercoles", {
		header: "Miércoles",
		cell: ({ getValue }) => {
			const value = getValue()
			if(typeof value === 'string') return value
			else return <HorarioCard data={getValue() as HorarioCardT} />
		}
	}),
	helper.accessor("jueves", {
		header: "Jueves",
		cell: ({ getValue }) => {
			const value = getValue()
			if(typeof value === 'string') return value
			else return <HorarioCard data={getValue() as HorarioCardT} />
		}
	}),
	helper.accessor("viernes", {
		header: "Viernes",
		cell: ({ getValue }) => {
			const value = getValue()
			if(typeof value === 'string') return value
			else return <HorarioCard data={getValue() as HorarioCardT} />
		}
	}),
	helper.accessor("sabado", {
		header: "Sábado",
		cell: ({ getValue }) => {
			const value = getValue()
			if(typeof value === 'string') return value
			else return <HorarioCard data={getValue() as HorarioCardT} />
		}
	}),
	helper.accessor("domingo", {
		header: "Domingo",
		cell: ({ getValue }) => {
			const value = getValue()
			if(typeof value === 'string') return value
			else return <HorarioCard data={getValue() as HorarioCardT} />
		}
	}),
];
