import { APIserver } from "@/core/api-server";
import NivelesTable from ".";
import { NivelesAcademicosSchema, nivelesAcademicosTableItem } from "./columns";
import { notFound } from "next/navigation";
import { ApiError } from "next/dist/server/api-utils";

const dateFormat = (date: string) => {
	return new Date(date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function NivelesTableServer({ programaId }: { programaId: string | undefined }) {
	if (!programaId) {
		return <div>Selecciona una carrera</div>
	}
	//Fetch programas

	const nivelMalla = await APIserver.nivelesAcademicos.getMany({ filters: { programaId: programaId } })

	const tabledata = nivelMalla.data.map(e => {
		const obj = {
			inicioFin: dateFormat(e.fechaInicio) + " " + dateFormat(e.fechaFin),
			fechaAgregaciones: dateFormat(e.inicioAgregaciones) + " " + dateFormat(e.limiteAgregaciones),
			fechasMatricula: dateFormat(e.limiteOrdinaria) + " " + dateFormat(e.limiteExtraordinaria) + " " + dateFormat(e.limiteEspecial),
			paralelo: e.paraleloId,
			cumplimientoMaterias: e.validaCumplimientoMaterias,
			sesionModalidad: e.sesion.nombre,
			seleccionMaterias: e.estudiantesPuedenSeleccionarMaterias,
			seleccionHorarios: e.estudiantesPuedenSeleccionarMateriasOtrosHorarios,
			seleccionModalidad: e.estudiantesPuedenSeleccionarMateriasOtrasModalidades,
			proyectosIntegradores: e.estudiantesRegistranProyectosIntegradores,
			nivelMalla: e.nivelMallaId
		}
		return {
			...e,
			...obj
		} satisfies nivelesAcademicosTableItem
	})

	//if (!nivel.data) return notFound();
	// console.log(tabledata)
	return <NivelesTable data={tabledata} />;
}
