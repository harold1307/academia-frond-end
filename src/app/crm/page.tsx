import React from "react";
import CrmTable from "./table";
import AddAdmisiones from "./addAdmisiones";
import InscritosTable from "./inscritos/table";
import AddInscritos from "./inscritos/addInscritos";
import RespuestasPage from "./respuestas/page";
import SeguimientoPage from "./seguimiento/page";

export const dynamic = "force-dynamic";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function CrmPage({ searchParams }: Context) {
	const seccion = searchParams.seccion;

	if (seccion === "inscritos") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<AddInscritos />
						<InscritosTable mallas={MUinscritos} />
					</React.Suspense>
				</div>
			</>
		);
	}
	if (seccion === "respuestas") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<RespuestasPage />
					</React.Suspense>
				</div>
			</>
		);
	}
	if (seccion === "seguimiento") {
		return (
			<>
				<div className='mt-4'>
					<React.Suspense fallback={"Cargando tabla..."}>
						<SeguimientoPage />
					</React.Suspense>
				</div>
			</>
		);
	}
	return (
		<>
			<div className='mt-4'>
				<AddAdmisiones />
				<CrmTable mallas={MUInteresados} />
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

const MUinscritos = [
	{
		id: "1",
		nombre: "NOMBRE PRUEBA",
		identificacion: 12341245,
		emailTel: 12431123,
		asesorPrograma: 'ADMINISTRACION',
		codigo: '',
		vencido: 500,
		matricula: 'si',
		matriculaHabilitada: 'si',
		foto: '',
		seguimiento: 'si',
		activo: 'si',
	},
	{
		id: "2",
		nombre: "NOMBRE PRUEBA",
		identificacion: 12341245,
		emailTel: 12431123,
		asesorPrograma: 'ADMINISTRACION',
		codigo: '',
		vencido: 500,
		matricula: 'si',
		matriculaHabilitada: 'si',
		foto: 'si',
		seguimiento: 'si',
		activo: 'si',
	},
	{
		id: "3",
		nombre: "NOMBRE PRUEBA",
		identificacion: 12341245,
		emailTel: 12431123,
		asesorPrograma: 'ADMINISTRACION',
		codigo: '',
		vencido: 500,
		matricula: 'si',
		matriculaHabilitada: 'si',
		foto: '',
		seguimiento: 'si',
		activo: 'si',
	},
];
