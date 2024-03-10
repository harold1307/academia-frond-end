"use client";

import { columns } from "./columns";
import DataTable from "./data-table";

interface Graduados {
	id: string;
	nombre: string;
	contactos: string;
}

export default function GraduadosTable({ graduados }: { graduados: any[] }) {
	console.log("graduados", graduados);
	const lGraduados: Graduados[] = graduados.map(graduado => {
		return {
			id: graduado.id as string,
			nombre: `${graduado.nombres} ${graduado.primerApellido} ${graduado.segundoApellido}`,
			contactos: `${graduado.email ?? "No email"} / ${
				graduado.telefono ?? "No telefono"
			}`,
		};
	});

	return (
		<section className='my-2'>
			<DataTable columns={columns} data={lGraduados} />
		</section>
	);
}
