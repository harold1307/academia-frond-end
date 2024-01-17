import { AreaConocimientoClass } from "./areas-conocimiento";
import { AsignaturaClass } from "./asignaturas";
import { CampoFormacionClass } from "./campos-formacion";
import { CursoClass } from "./cursos";
import { EjeFormativoClass } from "./ejes-formativos";
import { InstitucionClass } from "./institucion";
import { MallaCurricularClass } from "./malla-curricular";
import { ModalidadClass } from "./modalidades";
import { VarianteCursoClass } from "./variantes-curso";

export type APIResponse<D> = {
	data: D;
	message: string;
};
export type SimpleAPIResponse = {
	message: string;
};

export class APIClass {
	constructor(private _apiUrl: string) {}

	get instituciones() {
		return new InstitucionClass(this._apiUrl);
	}

	get mallas() {
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
}

export class APIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "APIError";
	}
}
