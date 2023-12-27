import { Button } from "@/app/_components/ui/button";
import type { MallaCurricular } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

export type MallaCurricularTableItem = Omit<
	MallaCurricular,
	"createdAt" | "fechaAprobacion" | "fechaLimiteVigencia"
> & {
	credits: number;
	coursesCount: number;
	totalHours: number;
	coursesHours: number;
	approved: {
		fechaAprobacion: Date;
		fechaLimiteVigencia: Date;
	};
	isCurrent: boolean;
	isUsed: boolean;
	modulesCount: number;
	onlineCoursesCount: number;
	studentsUsingCount: number;
};

const helper = createColumnHelper<MallaCurricularTableItem>();

export const columns = [
	helper.accessor("id", {}),
	helper.accessor("modalidad", {
		header: "Modalidad",
	}),
	helper.accessor("tituloObtenido", {
		header: "Titulo obtenido",
	}),
	helper.accessor("credits", {
		header: "Creditos",
	}),
	helper.accessor("totalHours", {
		header: "Horas totales",
	}),
	helper.accessor("coursesHours", {
		header: "Horas materias",
	}),
	helper.accessor("horasPractica", {
		header: "Horas pract.",
	}),
	helper.accessor("horasVinculacion", {
		header: "Horas vinc.",
	}),
	helper.accessor("niveles", {
		header: "Niveles",
	}),
	helper.accessor("cantidadLibreOpcionEgreso", {
		header: "Libre opcion",
	}),
	helper.accessor("cantidadOptativasEgreso", {
		header: "Optativas",
	}),
	helper.accessor("coursesCount", {
		header: "Materias",
	}),
	helper.accessor("modulesCount", {
		header: "Modulos",
	}),
	helper.accessor("onlineCoursesCount", {
		header: "Materias online",
	}),
	helper.accessor("approved", {
		header: "Aprobada",
		cell: ({ cell }) => {
			const { fechaAprobacion, fechaLimiteVigencia } = cell.getValue();
			return (
				<>
					<div>{format(fechaAprobacion, "dd/LL/yyyy")}</div>
					<div>{format(fechaLimiteVigencia, "dd/LL/yyyy")}</div>
				</>
			);
		},
	}),
	helper.accessor("isCurrent", {
		header: "Vigencia",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("usaNivelacion", {
		header: "Niv.",
		cell: ({ getValue }) => (getValue() ? "SI" : "NO"),
	}),
	helper.accessor("studentsUsingCount", {
		header: "Uso",
	}),
	helper.display({
		id: "actions",
		cell: () => <Button>Acciones</Button>,
	}),
];
