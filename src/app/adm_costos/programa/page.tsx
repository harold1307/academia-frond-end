import AddPrograma from "./addPrograma";
import SelectedProgramaTable from "./selectedtable";
import ProgramaTable from "./table";
import ProgramaDescuentosTable from "./tableDescuentos";
import ProgramaFechasTable from "./tableFechas";
import ProgramaFechasBTable from "./tableFechasB";
import ProgramaMateriasTable from "./tableMaterias";
import ProgramaRecargasTable from "./tableRecargas";
import ProgramaRubrosTable from "./tableRubros";

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

function ProgramaPage({ searchParams }: Context) {
	const seccionPrograma = searchParams;

	return (
		<>
			<div className='mt-4'>
				<AddPrograma />
				<SelectedProgramaTable programa={MUSelected} />
				<div className='flex flex-row gap-2'>
					<ProgramaTable programa={MUPrograma} />
					{seccionPrograma.materias && (
						<ProgramaMateriasTable programa={MuMaterias} />
					)}
					{seccionPrograma.rubros && (
						<ProgramaRubrosTable programa={MURubros} />
					)}
					{seccionPrograma.descuentos && (
						<ProgramaDescuentosTable programa={MUDescuentos} />
					)}
					{seccionPrograma.fechas && (
						<>
							<ProgramaFechasTable programa={MUFechas} />
							<ProgramaFechasBTable programa={MUFechasB} />
						</>
					)}
					{seccionPrograma.recargas && (
						<ProgramaRecargasTable programa={MURecargas} />
					)}
				</div>
			</div>
		</>
	);
}

const MUSelected = [
	{
		id: 1,
		inscripcion: "0,00",
		matricula: "0,00",
		modulo: "0,00",
		segundaMatricula: "0,00",
		valorSegunda: "0,00",
		terceraMatricula: "0,00",
		valorTercera: "0,00",
		MatriculaExtra: "0,00",
		matriculaEspecial: "0,00",
		valorMatriculaEspecial: "0,00",
		primerArancel: "0,00",
		recargoMatricula: true,
		valorRecargoMatricula: "0,00",
		recargoArancel: false,
		valorRecargoArancel: "0,00",
		recargoOtros: true,
		valorRecargoOtros: "0,00",
	},
];

const MUPrograma = [
	{
		id: 1,
		nombre: "test costos",
		detalle: "detalles",
		total: "5",
		activo: true,
	},
];

const MuMaterias = [
	{
		id: 1,
		asignatura: "Matemáticas",
		valor: "20,00",
		valorExtra: "5,00",
	},
];

const MURubros = [
	{
		id: 1,
		fecha: "23/09/2022",
		otrosValores: "0",
		valor: "0",
	},
];

const MUDescuentos = [
	{
		id: 1,
		tipo: "Completa",
		tipoRubro: "",
		porcentaje: "10%",
		valor: "10,00",
	},
];

const MUFechas = [
	{
		id: 1,
		creditos: "2",
		cuotas: "6",
	},
];

const MUFechasB = [
	{
		id: 1,
		cuotas: "4",
		fecha: "9/12/2018",
	},
];

const MURecargas = [
	{
		id: 1,
		tipo: "",
		porcentaje: "20%",
		valor: "10,00",
	},
];

export default ProgramaPage;
