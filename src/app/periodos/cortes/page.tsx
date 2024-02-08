import React from "react";
import CortesTable from "./table";
import AddCortes from "./addCortes";

function CortesPage() {
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddCortes />
					<CortesTable mallas={MUCortes} />
				</React.Suspense>
			</div>
		</>
	);
}

const MUCortes = [
	{ id: "1", nombre: "PRUEBA", inscritos: 0, matriculas: 0 },
	{ id: "2", nombre: "PRUEBA2", inscritos: 0, matriculas: 0 },
	{ id: "3", nombre: "PRUEBA3", inscritos: 0, matriculas: 0 },
	{ id: "4", nombre: "PRUEBA4", inscritos: 0, matriculas: 0 },
	{ id: "5", nombre: "PRUEBA5", inscritos: 0, matriculas: 0 },
];

export default CortesPage;
