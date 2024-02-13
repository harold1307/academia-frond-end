import React from "react";
import DocumentosTable from "./table";
import AddDeposito from "./addDeposito";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DocumentosPage({ searchParams }: Context) {
	return (
		<>
			<div className='mt-4'>
				<AddDeposito />
				<DocumentosTable mallas={MUDocs} />
			</div>
		</>
	);
}

const MUDocs = [
	{
		id: "1",
		fecha: '10/12/24',
		referencia: '121614652',
		tipo: 'pago matricula',
		motivo: 'deposito',
		cuenta: 'BANCO PICHINCHA',
		procesado: 'si',
		autorizado: 'si',
		valor: 400,
	},
];
