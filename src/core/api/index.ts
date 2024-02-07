import { createZodFetcher } from "zod-fetch";

import { AlternativaEvaluacionClass } from "./alternativas-evaluacion";
import { AreaConocimientoClass } from "./areas-conocimiento";
import { AsignaturaClass } from "./asignaturas";
import { AsignaturaEnCursoEscuelaClass } from "./asignaturas-curso-escuelas";
import { CampoFormacionClass } from "./campos-formacion";
import { CampoModeloEvaluativoClass } from "./campos-modelos-evaluativos";
import { CampoProyectoIntegradorClass } from "./campos-proyectos-integradores";
import { CoordinacionClass } from "./coordinaciones";
import { CursoEscuelaClass } from "./curso-escuelas";
import { CursoClass } from "./cursos";
import { DetalleNivelTitulacionClass } from "./detalles-nivel-titulacion";
import { EjeFormativoClass } from "./ejes-formativos";
import { MallaCurricularClass } from "./mallas-curriculares";
import { ModalidadClass } from "./modalidades";
import { ModeloEvaluativoClass } from "./modelos-evaluativos";
import { ModeloNivelacionClass } from "./modelos-nivelacion";
import { NivelTitulacionClass } from "./niveles-titulacion";
import { ParaleloClass } from "./paralelos";
import { PerfilPracticaClass } from "./perfiles-practica";
import { ProgramaClass } from "./programas";
import { ProyectoIntegradorClass } from "./proyectos-integradores";
import { SedeClass } from "./sede";
import { SesionClass } from "./sesiones";
import { TipoDocumentoClass } from "./tipos-documento";
import { TipoDocumentoEnProgramaClass } from "./tipos-documento-programas";
import { TituloObtenidoClass } from "./titulos-obtenidos";
import { TurnoClass } from "./turnos";
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

export class APIClass {
	constructor(private _apiUrl: string) {}

	get sedes() {
		return new SedeClass(this._apiUrl);
	}

	get mallasCurriculares() {
		return new MallaCurricularClass(this._apiUrl);
	}

	get periodos() {
		return new MallaCurricularClass(this._apiUrl);
	}
	
	get asignaturas() {
		return new AsignaturaClass(this._apiUrl);
	}

	get cursos() {
		return new CursoClass(this._apiUrl);
	}

	get ejesFormativos() {
		return new EjeFormativoClass(this._apiUrl);
	}

	get camposFormacion() {
		return new CampoFormacionClass(this._apiUrl);
	}

	get areasConocimiento() {
		return new AreaConocimientoClass(this._apiUrl);
	}

	get variantesCurso() {
		return new VarianteCursoClass(this._apiUrl);
	}

	get modalidades() {
		return new ModalidadClass(this._apiUrl);
	}

	get paralelos() {
		return new ParaleloClass(this._apiUrl);
	}

	get cursoEscuelas() {
		return new CursoEscuelaClass(this._apiUrl);
	}

	get alternativasEvaluacion() {
		return new AlternativaEvaluacionClass(this._apiUrl);
	}

	get asignaturasCursoEscuelas() {
		return new AsignaturaEnCursoEscuelaClass(this._apiUrl);
	}

	get camposModelosEvaluativos() {
		return new CampoModeloEvaluativoClass(this._apiUrl);
	}

	get camposProyectosIntegradores() {
		return new CampoProyectoIntegradorClass(this._apiUrl);
	}

	get coordinaciones() {
		return new CoordinacionClass(this._apiUrl);
	}

	get detallesNivelTitulacion() {
		return new DetalleNivelTitulacionClass(this._apiUrl);
	}

	get modelosEvaluativos() {
		return new ModeloEvaluativoClass(this._apiUrl);
	}

	get modelosNivelacion() {
		return new ModeloNivelacionClass(this._apiUrl);
	}

	get nivelesTitulacion() {
		return new NivelTitulacionClass(this._apiUrl);
	}

	get perfilesPractica() {
		return new PerfilPracticaClass(this._apiUrl);
	}

	get programas() {
		return new ProgramaClass(this._apiUrl);
	}

	get proyectosIntegradores() {
		return new ProyectoIntegradorClass(this._apiUrl);
	}

	get sesiones() {
		return new SesionClass(this._apiUrl);
	}

	get tiposDocumentosProgramas() {
		return new TipoDocumentoEnProgramaClass(this._apiUrl);
	}

	get tiposDocumento() {
		return new TipoDocumentoClass(this._apiUrl);
	}

	get titulosObtenidos() {
		return new TituloObtenidoClass(this._apiUrl);
	}

	get turnos() {
		return new TurnoClass(this._apiUrl);
	}
}

export class APIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "APIError";
	}
}
