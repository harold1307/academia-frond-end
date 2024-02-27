import React from "react";
import InscritosTable from "./table";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function InscritosPage({ searchParams }: Context) {
	return (
		<>
			<div className='mt-4'>
				<InscritosTable mallas={MUInteresados} />
			</div>
		</>
	);
}

const MUInteresados = [
	{
		id: "1",
		preinscripto: "PRUEBA",
		cedula: 0,
		registradoPor: 0,
		emailTel: 0,
		codigo: 0,
		registro: 2,
		seguimiento: 0,
	},
	{
		id: "2",
		preinscripto: "PRUEBA2",
		cedula: 0,
		registradoPor: 0,
		emailTel: 0,
		codigo: 0,
		registro: 2,
		seguimiento: 0,
	},
	{
		id: "3",
		preinscripto: "PRUEBA3",
		cedula: 0,
		registradoPor: 0,
		emailTel: 0,
		codigo: 0,
		registro: 2,
		seguimiento: 0,
	},
	{
		id: "4",
		preinscripto: "PRUEBA4",
		cedula: 0,
		registradoPor: 0,
		emailTel: 0,
		codigo: 0,
		registro: 2,
		seguimiento: 0,
	},
	{
		id: "5",
		preinscripto: "PRUEBA5",
		cedula: 0,
		registradoPor: 0,
		emailTel: 0,
		codigo: 0,
		registro: 2,
		seguimiento: 0,
	},
];
