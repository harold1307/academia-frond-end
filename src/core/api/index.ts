import { createZodFetcher, type ZodFetcher } from "zod-fetch";

import { AlternativaEvaluacionClass } from "./alternativas-evaluacion";
import { AreaConocimientoClass } from "./areas-conocimiento";
import { AsignaturaClass } from "./asignaturas";
import { AsignaturaEnCursoEscuelaClass } from "./asignaturas-curso-escuelas";
import { AsignaturaEnNivelMallaClass } from "./asignaturas-niveles-malla";
import { AsignaturaEnVarianteCursoClass } from "./asignaturas-variantes-curso";
import { CampoFormacionClass } from "./campos-formacion";
import { CampoModeloEvaluativoClass } from "./campos-modelos-evaluativos";
import { CampoProyectoIntegradorClass } from "./campos-proyectos-integradores";
import { CentroInformacionClass } from "./centros-informacion";
import { CoordinacionClass } from "./coordinaciones";
import { CorteClass } from "./cortes";
import { CursoEscuelaClass } from "./curso-escuelas";
import { CursoClass } from "./cursos";
import { DetalleNivelTitulacionClass } from "./detalles-nivel-titulacion";
import { EjeFormativoClass } from "./ejes-formativos";
import { MallaCurricularClass } from "./mallas-curriculares";
import { MateriaEnHorarioClass } from "./materias-horario";
import { MateriaEnNivelAcademicoClass } from "./materias-niveles-academicos";
import { ModalidadClass } from "./modalidades";
import { ModeloEvaluativoClass } from "./modelos-evaluativos";
import { ModeloNivelacionClass } from "./modelos-nivelacion";
import { AsignaturaModuloEnMallaClass } from "./modulos-malla";
import { NivelAcademicoClass } from "./niveles-academicos";
import { NivelMallaClass } from "./niveles-malla";
import { NivelTitulacionClass } from "./niveles-titulacion";
import { ParaleloClass } from "./paralelos";
import { PerfilPracticaClass } from "./perfiles-practica";
import { PeriodoLectivoClass } from "./periodos-lectivos";
import { ProgramaClass } from "./programas";
import { ProyectoIntegradorClass } from "./proyectos-integradores";
import { SedeClass } from "./sede";
import { SesionClass } from "./sesiones";
import { TipoDocumentoClass } from "./tipos-documento";
import { TipoDocumentoEnProgramaClass } from "./tipos-documento-programas";
import { TituloObtenidoClass } from "./titulos-obtenidos";
import { TurnoClass } from "./turnos";
import { UbicacionClass } from "./ubicaciones";
import { VarianteCursoClass } from "./variantes-curso";

export type APIResponse<D> = {
	data: D;
	message: string;
};
export type SimpleAPIResponse = {
	message: string;
};

const defaultFetcher = async (...args: Parameters<typeof fetch>) => {
	const response = await fetch(...args);
	if (!response.ok) {
		const json = (await response.json()) as APIResponse<unknown>;
		throw new APIError(json.message);
	}

	return response.json();
};

export const zodFetcher = createZodFetcher(defaultFetcher);

const mockZodFetcher: ZodFetcher<typeof fetch> = async (schema, ...args) => {
	const response = await fetch(...args);

	// if (!response.ok) {
	// 	const json = (await response.json()) as APIResponse<unknown>;
	// 	throw new APIError(json.message);
	// }

	return response.json();
};

export class APIClass {
	private _fetcher: ZodFetcher<typeof fetch>;
	constructor(
		private _apiUrl: string,
		skipFetchParse?: boolean,
	) {
		this._fetcher = skipFetchParse ? mockZodFetcher : zodFetcher;
	}

	get sedes() {
		return new SedeClass(this._apiUrl, this._fetcher);
	}

	get mallasCurriculares() {
		return new MallaCurricularClass(this._apiUrl, this._fetcher);
	}

	get periodos() {
		return new PeriodoLectivoClass(this._apiUrl, this._fetcher);
	}

	/* get cronograma() {
		return new CronogramaMatriculas(this._apiUrl ,this._fetcher);
	}

	get traduccion() {
		return new TraduccionPeriodosClass(this._apiUrl ,this._fetcher);
	} */

	get asignaturas() {
		return new AsignaturaClass(this._apiUrl, this._fetcher);
	}

	get cursos() {
		return new CursoClass(this._apiUrl, this._fetcher);
	}

	get ejesFormativos() {
		return new EjeFormativoClass(this._apiUrl, this._fetcher);
	}

	get camposFormacion() {
		return new CampoFormacionClass(this._apiUrl, this._fetcher);
	}

	get areasConocimiento() {
		return new AreaConocimientoClass(this._apiUrl, this._fetcher);
	}

	get variantesCurso() {
		return new VarianteCursoClass(this._apiUrl, this._fetcher);
	}

	get modalidades() {
		return new ModalidadClass(this._apiUrl, this._fetcher);
	}

	get paralelos() {
		return new ParaleloClass(this._apiUrl, this._fetcher);
	}

	get cursoEscuelas() {
		return new CursoEscuelaClass(this._apiUrl, this._fetcher);
	}

	get alternativasEvaluacion() {
		return new AlternativaEvaluacionClass(this._apiUrl, this._fetcher);
	}

	get asignaturasCursoEscuelas() {
		return new AsignaturaEnCursoEscuelaClass(this._apiUrl, this._fetcher);
	}

	get camposModelosEvaluativos() {
		return new CampoModeloEvaluativoClass(this._apiUrl, this._fetcher);
	}

	get camposProyectosIntegradores() {
		return new CampoProyectoIntegradorClass(this._apiUrl, this._fetcher);
	}

	get coordinaciones() {
		return new CoordinacionClass(this._apiUrl, this._fetcher);
	}

	get detallesNivelTitulacion() {
		return new DetalleNivelTitulacionClass(this._apiUrl, this._fetcher);
	}

	get modelosEvaluativos() {
		return new ModeloEvaluativoClass(this._apiUrl, this._fetcher);
	}

	get modelosNivelacion() {
		return new ModeloNivelacionClass(this._apiUrl, this._fetcher);
	}

	get nivelesTitulacion() {
		return new NivelTitulacionClass(this._apiUrl, this._fetcher);
	}

	get perfilesPractica() {
		return new PerfilPracticaClass(this._apiUrl, this._fetcher);
	}

	get programas() {
		return new ProgramaClass(this._apiUrl, this._fetcher);
	}

	get proyectosIntegradores() {
		return new ProyectoIntegradorClass(this._apiUrl, this._fetcher);
	}

	get sesiones() {
		return new SesionClass(this._apiUrl, this._fetcher);
	}

	get tiposDocumentosProgramas() {
		return new TipoDocumentoEnProgramaClass(this._apiUrl, this._fetcher);
	}

	get tiposDocumento() {
		return new TipoDocumentoClass(this._apiUrl, this._fetcher);
	}

	get titulosObtenidos() {
		return new TituloObtenidoClass(this._apiUrl, this._fetcher);
	}

	get turnos() {
		return new TurnoClass(this._apiUrl, this._fetcher);
	}
	get nivelesMalla() {
		return new NivelMallaClass(this._apiUrl, this._fetcher);
	}

	get nivelesAcademicos() {
		return new NivelAcademicoClass(this._apiUrl, this._fetcher);
	}

	get materiasNivelesAcademicos() {
		return new MateriaEnNivelAcademicoClass(this._apiUrl, this._fetcher);
	}

	get asignaturasEnNivelesMalla() {
		return new AsignaturaEnNivelMallaClass(this._apiUrl, this._fetcher);
	}

	get materiasHorarios() {
		return new MateriaEnHorarioClass(this._apiUrl, this._fetcher);
	}

	get modulosMalla() {
		return new AsignaturaModuloEnMallaClass(this._apiUrl, this._fetcher);
	}

	get ubicaciones() {
		return new UbicacionClass(this._apiUrl, this._fetcher);
	}

	get cortes() {
		return new CorteClass(this._apiUrl, this._fetcher);
	}

	get asignaturasEnVariantesCurso() {
		return new AsignaturaEnVarianteCursoClass(this._apiUrl, this._fetcher);
	}

	get centrosInformacion() {
		return new CentroInformacionClass(this._apiUrl, this._fetcher);
	}
}

export class APIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "APIError";
	}
}
