import type { VarianteCursoTableItem } from "@/app/curso/[cursoId]/variantes/table/columns";
import type { CursoTableItem } from "@/app/curso/table/columns";

export const isLoading = false;

//Cursos
export const MUCursos: CursoTableItem[] = [
	{
		id: "1",
		alias: "alias1",
		certificado: "certificado1",
		estado: true,
		nombre: "nombre1",
	},
	{
		id: "2",
		alias: "alias2",
		certificado: "certificado2",
		estado: true,
		nombre: "nombre2",
	},
	{
		id: "2",
		alias: "alias2",
		certificado: "certificado2",
		estado: false,
		nombre: "nombre2",
	},
];

//Variantes de cursos
export const MUVariantes: VarianteCursoTableItem[] = [
	{
		id: "1",
		nombre: "Variante1",
		codigo: "CodigoBaseVar1",
		// descripcion: "Desc Var 1",
		registroExterno: true,
		registroInterno: true,
		verificaSesion: true,
		rangoEdad: true,
		registroOtraSede: true,
		costoPorMateria: true,
		// costoPorCantidadDeMateria: true,
		edadMinima: 10,
		edadMaxima: 21,
		requisitosMalla: true,
		pasarRecord: true,
		// curso: true,
		nivelMinimo: true,
		// nivel: "Básico",
		// fechaAprobacion: new Date("10-10-2020"),
		aprobada: new Date("10-10-2020").toISOString(),
		enUso: true,
		activa: true,
		// cursoId: "1",
		cursoPrevio: true,
		cursosCount: 0,
		materiasCount: 0,
	},
	{
		id: "2",
		nombre: "Variante2",
		codigo: "CodigoBaseVar2",
		// descripcion: "Desc Var 2",
		registroExterno: true,
		registroInterno: true,
		verificaSesion: true,
		rangoEdad: true,
		registroOtraSede: true,
		costoPorMateria: true,
		// costoPorCantidadDeMateria: true,
		edadMinima: 10,
		edadMaxima: 21,
		requisitosMalla: true,
		pasarRecord: true,
		// curso: true,
		nivelMinimo: true,
		// nivel: "Básico",
		// fechaAprobacion: new Date("10-10-2020"),
		aprobada: new Date("10-10-2021").toISOString(),
		enUso: true,
		activa: true,
		// cursoId: "1",
		cursoPrevio: true,
		cursosCount: 0,
		materiasCount: 0,
	},
	{
		id: "3",
		nombre: "Variante3",
		codigo: "CodigoBaseVar3",
		// descripcion: "Desc Var 3",
		registroExterno: true,
		registroInterno: true,
		verificaSesion: true,
		rangoEdad: true,
		registroOtraSede: true,
		costoPorMateria: true,
		// costoPorCantidadDeMateria: true,
		edadMinima: 10,
		edadMaxima: 21,
		requisitosMalla: true,
		pasarRecord: true,
		// curso: true,
		nivelMinimo: true,
		// nivel: "Básico",
		// fechaAprobacion: new Date("10-10-2020"),
		aprobada: new Date("10-10-2022").toISOString(),
		enUso: true,
		activa: true,
		// cursoId: "1",
		cursoPrevio: true,
		cursosCount: 0,
		materiasCount: 0,
	},
	{
		id: "4",
		nombre: "Variante4",
		codigo: "CodigoBaseVar4",
		// descripcion: "Desc Var 4",
		registroExterno: true,
		registroInterno: true,
		verificaSesion: true,
		rangoEdad: true,
		registroOtraSede: true,
		costoPorMateria: true,
		// costoPorCantidadDeMateria: true,
		edadMinima: 10,
		edadMaxima: 21,
		requisitosMalla: true,
		pasarRecord: true,
		// curso: true,
		nivelMinimo: true,
		// nivel: "Básico",
		// fechaAprobacion: new Date("10-10-2020"),
		aprobada: new Date("10-01-2024").toISOString(),
		enUso: true,
		activa: true,
		// cursoId: "1",
		cursoPrevio: true,
		cursosCount: 0,
		materiasCount: 0,
	},
];
