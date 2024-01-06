import type {
	$Enums,
	AreaConocimiento,
	Asignatura,
	AsignaturaEnMalla,
	CampoFormacion,
	EjeFormativo,
	MallaCurricular,
} from "@prisma/client";

import type { ReplaceDateToString } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type AsignaturaEnMallaFromAPI = ReplaceDateToString<
	AsignaturaEnMalla & {
		ejeFormativo: EjeFormativo | null;
		areaConocimiento: AreaConocimiento | null;
		campoFormacion: CampoFormacion | null;
	}
>;

export type MallaCurricularFromAPI = ReplaceDateToString<MallaCurricular>;

export type MallaCurricularWithAsignaturasFromAPI = MallaCurricularFromAPI & {
	asignaturasEnMalla: (AsignaturaEnMallaFromAPI & {
		asignatura: Asignatura;
	})[];
};

export type UpdateMallaData = Partial<MallaCurricularFromAPI>;

export class MallaCurricularClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		mallaCurricular: UpdateMallaData;
	}): Promise<APIResponse<MallaCurricularFromAPI>> {
		const res = await fetch(
			this.apiUrl + `/api/mallas-curriculares/${params.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.mallaCurricular),
			},
		);

		if (!res.ok) {
			console.error("Error al actualizar la malla.", await res.json());
			throw new APIError("Error al actualizar la malla.");
		}

		return res.json();
	}

	async create(
		MallaCurricular: Omit<
			MallaCurricularFromAPI,
			"id" | "createdAt" | "fechaAprobacion" | "fechaLimiteVigencia"
		> & { fechaAprobacion: string; fechaLimiteVigencia: string },
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(MallaCurricular),
		});

		if (!res.ok) {
			console.error("Error al crear la malla.", await res.json());
			throw new APIError("Error al crear la malla.");
		}

		return res.json();
	}

	async getMany(
		_: void,
	): Promise<APIResponse<MallaCurricularWithAsignaturasFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/mallas-curriculares");

		if (!res.ok) {
			console.error("Error al obtener mallas.", await res.json());
			throw new APIError("Error al obtener mallas.");
		}

		return res.json();
	}

	async getById(
		id: string,
	): Promise<APIResponse<MallaCurricularFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares/${id}`);

		if (!res.ok) {
			console.error("Error al obtener malla.", await res.json());
			throw new APIError("Error al obtener malla.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar la malla.", await res.json());
			throw new APIError("Error al eliminar la malla.");
		}

		return res.json();
	}

	async createAsignaturaEnMalla({
		asignaturaId,
		data,
		mallaId,
	}: CreateAsignaturaEnMallaParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/mallas-curriculares/${mallaId}/asignaturas/${asignaturaId}`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			console.error("Error al crear la asigantura en malla.", await res.json());
			throw new APIError("Error al crear la asigantura en malla.");
		}

		return res.json();
	}

	async getMallaWithAsignaturasByMallaId(
		id: string,
	): Promise<APIResponse<MallaCurricularWithAsignaturasFromAPI>> {
		const res = await fetch(
			this.apiUrl + `/api/mallas-curriculares/${id}/asignaturas`,
		);

		if (!res.ok) {
			console.error(
				"Error al obtener mallas con asignaturas.",
				await res.json(),
			);
			throw new APIError("Error al obtener mallas con asignaturas.");
		}

		return res.json();
	}
}

export type CreateAsignaturaEnMallaParams = {
	mallaId: string;
	asignaturaId: string;
	data: {
		esAnexo: boolean;
		nivel: number;
		tipoAsignatura: $Enums.TipoAsignatura;
		identificacion: string;
		permiteMatriculacion: boolean;
		validaCredito: boolean;
		validaPromedio: boolean;
		costoEnMatricula: boolean;
		practicasPreProfesionales: boolean;
		requeridaEgreso: boolean;
		cantidadMatriculas: number;
		horasSemanales: number;
		horasColaborativas: number;
		horasAsistidasDocente: number;
		horasAutonomas: number;
		horasPracticas: number;
		creditos: number;
		noValidaAsistencia: boolean;
		materiaComun: boolean;
		objetivos: string | null;
		descripcion: string | null;
		resultadosAprendizaje: string | null;

		competenciaGenerica: string | null;
		ejeFormativoId: string;
		areaConocimientoId: string;
		campoFormacionId: string;
	};
};
