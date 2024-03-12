import SolicitudesTable from "./table";
import EspeciesTable from "./table";

function SolicitudesPage() {
	return (
		<>
			<div className='mt-4'>
				<SolicitudesTable especies={MUSolicitudes} />
			</div>
		</>
	);
}

const MUSolicitudes = [
	{
		id: 1,
		nombre: "test solicitud",
		iva: "SIN IVA",
		costo: "5",
		costoBase: "10",
		horaLim: "100",
		activo: true,
	},
];

export default SolicitudesPage;
