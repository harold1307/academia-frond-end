import AddGrupoCostos from "./addGrupoCostos";
import GrupoCostosTable from "./table";

function GrupoCostosPage() {
	return (
		<>
			<div className='mt-4'>
				<AddGrupoCostos />
				<GrupoCostosTable costos={MUCostos} />
			</div>
		</>
	);
}

const MUCostos = [
	{
		id: 1,
		nombre: "test costos",
		detalle: "detalles",
		total: "5",
		activo: true,
	},
];

export default GrupoCostosPage;
