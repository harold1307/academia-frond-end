import AddEspecies from "./addEspecies";
import EspeciesTable from "./table";

function EspeciesPage() {
	return (
		<>
			<div className='mt-4'>
				<AddEspecies />
				<EspeciesTable especies={MUEspecies} />
			</div>
		</>
	);
}

const MUEspecies = [
	{
		id: 1,
		nombre: "test especies",
		reporte: "",
		iva: "SIN IVA",
		valor: 5,
		activo: true,
	},
];

export default EspeciesPage;
