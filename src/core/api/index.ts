import { AreaConocimientoClass } from "./areas-conocimiento";
import { AsignaturaClass } from "./asignaturas";
import { CampoFormacionClass } from "./campos-formacion";
import { CursoClass } from "./cursos";
import { EjeFormativoClass } from "./ejes-formativos";
import { InstitucionClass } from "./institucion";
import { MallaCurricularClass } from "./malla-curricular";

export type APIResponse<D> = {
	data: D;
	message: string;
};
export type SimpleAPIResponse = {
	message: string;
};

export class APIClass {
	constructor(private apiUrl: string) {}

	get instituciones() {
		return new InstitucionClass(this.apiUrl);
	}

	get mallas() {
		return new MallaCurricularClass(this.apiUrl);
	}

	get asignaturas() {
		return new AsignaturaClass(this.apiUrl);
	}

	get cursos() {
		return new CursoClass(this.apiUrl);
	}

	get ejesFormativos() {
		return new EjeFormativoClass(this.apiUrl);
	}

	get camposFormacion() {
		return new CampoFormacionClass(this.apiUrl);
	}

	get areasConocimiento() {
		return new AreaConocimientoClass(this.apiUrl);
	}
}

export class APIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "APIError";
	}
}
