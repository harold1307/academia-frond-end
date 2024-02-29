<<<<<<< HEAD
import React from "react";
import CortesTable from "./table";
import AddCortes from "./addCortes";
import { APIserver } from "@/core/api-server";

async function CortesPage() {
	const cortes = await APIserver.cortes.getMany()
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddCortes />
					<CortesTable cortes={cortes.data} />
				</React.Suspense>
			</div>
		</>
	);
}

export default CortesPage;
=======
import React from "react";
import CortesTable from "./table";
import AddCortes from "./addCortes";
import { APIserver } from "@/core/api-server";

async function CortesPage() {
	const cortes = await APIserver.cortes.getMany();
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddCortes />
					<CortesTable cortes={cortes.data} />
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
>>>>>>> 141acad7653eea714b3def88cf98e017bc0e9bb4
