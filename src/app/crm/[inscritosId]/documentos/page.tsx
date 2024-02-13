import React from "react";
import DocumentosTable from "./table";
import AddDocumento from "./addDocu";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DocumentosPage({ searchParams }: Context) {
	return (
		<>
			<div className='mt-4'>
				<AddDocumento />
				<DocumentosTable mallas={MUDocs} />
			</div>
		</>
	);
}

const MUDocs = [
	{
		id: "1",
		documento: "PRUEBA",
		tipo: 'si',
		archivo: 'no',
		fecha: '10/12/24',
		visible: 'si',
	},
];
