import { notFound } from "next/navigation";
import { APIserver } from "@/core/api-server";
import { type CostosSchema } from "../add-costos";
import CostosTable from ".";

interface MockUpDataI {
	costos: CostosSchema[];
}
const data: MockUpDataI = {
	costos: [
		{
			id: "1",
			tipo: "TipoA",
			iva: "Iva12",
			programa: "Programa3",
			modalidad: "VIRTUAL",
			codigoExterno: "Cod2",
			cantidadMaterias: 5,
			valorTotal: 10,
			numeroCuotas: 12,
			porcientoPrimeraCuota: 10,
			cronogramaFecha: true,
			fechaDesdeMatricula: true,
			proximoADias: 30,
			generacionManual: false,
			descuentoFicha: false,
			aplicaBecaAuto: false,
			descuentoAutomatico: false,
		},
	],
};

interface CostosTableServer {
	varianteId: string;
}
export default async function CostosTableServer({
	varianteId,
}: CostosTableServer) {
	//Fetch costos

	// if (!costos.data) return notFound();

	return <CostosTable data={data.costos} />;
}
