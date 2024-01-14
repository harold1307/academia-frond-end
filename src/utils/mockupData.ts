import { VariantesTableItem } from "@/app/curso/[cursoId]/variantes/table/columns";
import { CursoTableItem } from "@/app/curso/table/columns";

export const isLoading = false


//Cursos
export const MUCursos:CursoTableItem[] = [
	{
		id: '1',
		alias: 'alias1',
		certificado: 'certificado1',
		estado: true,
		nombre: 'nombre1'
	},
	{
		id: '2',
		alias: 'alias2',
		certificado: 'certificado2',
		estado: true,
		nombre: 'nombre2'
	},
	{
		id: '2',
		alias: 'alias2',
		certificado: 'certificado2',
		estado: false,
		nombre: 'nombre2'
	},

]

//Variantes de cursos
export const MUVariantes:VariantesTableItem[] = [
	{
		id: '1',
		nombre: 'Variante1',
		codigoBase: 'CodigoBaseVar1',
		descripcion: 'Desc Var 1',
		registroExterno: true,
		registroInterno: true,
		verificaSesion: true,
		verificaRangoDeEdad: true,
		registroDesdeOtraSede: true,
		costoPorMateria: true,
		costoPorCantidadDeMateria: true,
		edadMinima: 10,
		edadMaxima: 21,
		cumpleRequisitosDeMalla: true,
		pasarAlRecord: true,
		aprobarCursoPrevio: true,
		nivelMinimo: true,
		nivel: 'Básico',
		fechaAprobacion: new Date('10-10-2020'),
		enUso: true,
		activo: true,
		cursoId: '1'
	},
	{
		id: '2',
		nombre: 'Variante2',
		codigoBase: 'CodigoBaseVar2',
		registroExterno: true,
		registroInterno: true,
		registroDesdeOtraSede: true,
		costoPorMateria: true,
		costoPorCantidadDeMateria: true,
		verificaSesion: true,
		verificaRangoDeEdad: false,
		edadMinima: undefined,
		edadMaxima: undefined,
		cumpleRequisitosDeMalla: true,
		pasarAlRecord: true,
		aprobarCursoPrevio: true,
		nivelMinimo: false,
		nivel: undefined,
		fechaAprobacion: new Date('05-05-2021'),
		descripcion: 'Desc Var 2',
		enUso: true,
		activo: true,
		cursoId: '2'
	},
	{
		id: '2',
		nombre: 'Variante2',
		codigoBase: 'CodigoBaseVar2',
		registroExterno: true,
		registroInterno: true,
		registroDesdeOtraSede: true,
		costoPorMateria: true,
		costoPorCantidadDeMateria: true,
		verificaSesion: true,
		verificaRangoDeEdad: false,
		edadMinima: undefined,
		edadMaxima: undefined,
		cumpleRequisitosDeMalla: true,
		pasarAlRecord: true,
		aprobarCursoPrevio: true,
		nivelMinimo: false,
		nivel: undefined,
		fechaAprobacion: new Date('05-05-2021'),
		descripcion: 'Desc Var 2',
		enUso: true,
		activo: true,
		cursoId: '1'
	},
	{
		id: '2',
		nombre: 'Variante2',
		codigoBase: 'CodigoBaseVar2',
		registroExterno: true,
		registroInterno: true,
		registroDesdeOtraSede: true,
		costoPorMateria: true,
		costoPorCantidadDeMateria: true,
		verificaSesion: true,
		verificaRangoDeEdad: false,
		edadMinima: undefined,
		edadMaxima: undefined,
		cumpleRequisitosDeMalla: true,
		pasarAlRecord: true,
		aprobarCursoPrevio: true,
		nivelMinimo: false,
		nivel: undefined,
		fechaAprobacion: new Date('05-05-2021'),
		descripcion: 'Desc Var 2',
		enUso: true,
		activo: true,
		cursoId: '2'
	},
]