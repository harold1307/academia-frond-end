import RespuestasTable from "./table";

function RespuestasPage() {
	return <RespuestasTable mallas={MURespuestas} />;
}

const MURespuestas = [
	{
		id: 1,
		nombre: "GENERAL",
		comunico: "SI",
		activo: "NO",
	},
	{
		id: 2,
		nombre: "NO SE LOGRO COMUNICAR",
		comunico: "NO",
		activo: "SI",
	},
];

export default RespuestasPage;
