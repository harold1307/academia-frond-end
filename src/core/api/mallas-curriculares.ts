import type {
	AsignaturaEnNivelMalla,
	AsignaturaModuloEnMalla,
	LugarEjecucion,
	MallaCurricular,
	NivelMalla,
	PracticaComunitariaEnMalla,
	PracticaPreProfesionalEnMalla,
} from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type {
	NonNullableObject,
	ReplaceDateToString,
	ZodInferSchema,
} from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	areaConocimientoSchema,
	type AreaConocimientoFromAPI,
} from "./areas-conocimiento";
import { asignaturaSchema, type AsignaturaFromAPI } from "./asignaturas";
import {
	campoFormacionSchema,
	type CampoFormacionFromAPI,
} from "./campos-formacion";
import {
	ejeFormativoSchema,
	type EjeFormativoFromAPI,
} from "./ejes-formativos";
import { sedeSchema, type SedeFromAPI } from "./sede";
import {
	tituloObtenidoSchema,
	type TituloObtenidoFromAPI,
} from "./titulos-obtenidos";

export type LugarEjecucionFromAPI = ReplaceDateToString<
	LugarEjecucion & {
		sede: SedeFromAPI;
	}
>;

export type NivelMallaFromAPI = ReplaceDateToString<NivelMalla>;

export type AsignaturaEnNivelMallaFromAPI = ReplaceDateToString<
	AsignaturaEnNivelMalla & {
		ejeFormativo: EjeFormativoFromAPI;
		areaConocimiento: AreaConocimientoFromAPI;
		campoFormacion: CampoFormacionFromAPI | null;
		asignatura: AsignaturaFromAPI;
	}
>;

export type AsignaturaModuloEnMallaFromAPI = ReplaceDateToString<
	AsignaturaModuloEnMalla & {
		asignatura: AsignaturaFromAPI;
		areaConocimiento: AreaConocimientoFromAPI;
		campoFormacion: CampoFormacionFromAPI;
	}
>;

export type PracticaPreProfesionalEnMallaFromAPI =
	ReplaceDateToString<PracticaPreProfesionalEnMalla>;
export type PracticaComunitariaEnMallaFromAPI =
	ReplaceDateToString<PracticaComunitariaEnMalla>;

export type MallaCurricularFromAPI = ReplaceDateToString<
	MallaCurricular & {
		enUso: boolean;
		practicaPreProfesional: PracticaPreProfesionalEnMallaFromAPI | null;
		practicaComunitaria: PracticaComunitariaEnMallaFromAPI | null;
		tituloObtenido: TituloObtenidoFromAPI | null;
		niveles: (NivelMallaFromAPI & {
			asignaturas: AsignaturaEnNivelMallaFromAPI[];
		})[];
		modulos: Omit<
			AsignaturaModuloEnMallaFromAPI,
			"areaConocimiento" | "campoFormacion"
		>[];
	}
>;

export type CreateAsignaturaModuloEnMalla = Omit<
	AsignaturaModuloEnMalla,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "asignatura"
	| "areaConocimiento"
	| "campoFormacion"
>;

export type MallaCurricularWithLugaresEjecucionFromAPI =
	MallaCurricularFromAPI & {
		lugaresEjecucion: LugarEjecucionFromAPI[];
	};

export type CreatePracticaPreProfesionalEnMalla = Omit<
	PracticaPreProfesionalEnMallaFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "registroDesdeNivelId"
	| "mallaCurricularId"
> & {
	registroDesdeNivel: number | null;
};

export type CreatePracticaComunitariaEnMalla = Omit<
	PracticaComunitariaEnMallaFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "registroDesdeNivelId"
	| "mallaCurricularId"
> & {
	registroDesdeNivel: number | null;
};

export type CreateMallaCurricular = Omit<
	MallaCurricularFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "enUso"
	| "estado"
	| "practicaPreProfesional"
	| "practicaComunitaria"
	| "tituloObtenido"
	| "niveles"
	| "modulos"
> & {
	niveles: number;
	practicasPreProfesionales: CreatePracticaPreProfesionalEnMalla | null;
	practicasComunitarias: CreatePracticaComunitariaEnMalla | null;
};

export type UpdateMallaData = Partial<
	Omit<
		MallaCurricularFromAPI,
		| "id"
		| "createdAt"
		| "updatedAt"
		| "enUso"
		| "programaId"
		| "modalidadId"
		| "niveles"
		| "practicaPreProfesional"
		| "practicaComunitaria"
		| "tituloObtenido"
		| "niveles"
		| "modulos"
		| "fechaAprobacion"
		| "fechaLimiteVigencia"
	> & {
		fechaAprobacion?: string;
		fechaLimiteVigencia?: string;
	}
>;

export type MallaCurricularQueryFilter = Partial<
	NonNullableObject<
		Omit<
			MallaCurricular,
			| "fechaAprobacion"
			| "fechaLimiteVigencia"
			| "cantidadOtrasMateriasMatricula"
			| "createdAt"
			| "updatedAt"
			| "id"
		>
	>
>;

const moduloSchema = z
	.object<ZodInferSchema<MallaCurricularFromAPI["modulos"][number]>>({
		id: z.string().uuid(),
		tipoAsignatura: z.enum([
			"PRACTICA",
			"TEORICA",
			"TEORICA_PRACTICA",
		] as const),
		identificacion: z.string(),
		permiteMatriculacion: z.boolean(),
		validaParaCredito: z.boolean(),
		validaParaPromedio: z.boolean(),
		costoEnMatricula: z.boolean(),
		requeridaParaGraduar: z.boolean(),
		cantidadMatriculas: z.number(),
		cantidadMatriculasAutorizadas: z.number().nullable(),
		minimoCreditosRequeridos: z.number().nullable(),
		maximaCantidadHorasSemanalas: z.number(),
		horasColaborativas: z.number(),
		horasAsistidasDocente: z.number(),
		horasAutonomas: z.number(),
		horasPracticas: z.number(),
		sumaHoras: z.boolean(),
		creditos: z.number(),
		noValidaAsistencia: z.boolean(),
		materiaGeneral: z.boolean(),
		guiaPracticaMetodologiaObligatoria: z.boolean(),
		aprobarGuiaPracticaMetodologica: z.boolean(),
		competencia: z.string().nullable(),
		objetivosEspecificos: z.string().nullable(),
		descripcion: z.string().nullable(),
		resultados: z.string().nullable(),
		aporteAsignaturaAlPerfil: z.string().nullable(),
		objetivoGeneral: z.string().nullable(),
		asignatura: asignaturaSchema,

		asignaturaId: z.string().uuid(),
		areaConocimientoId: z.string().uuid(),
		campoFormacionId: z.string().uuid(),
		mallaId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const asignaturaEnNivelMallaSchema = z
	.object<
		ZodInferSchema<
			MallaCurricularFromAPI["niveles"][number]["asignaturas"][number]
		>
	>({
		id: z.string().uuid(),
		tipoAsignatura: z.enum([
			"PRACTICA",
			"TEORICA",
			"TEORICA_PRACTICA",
		] as const),
		identificacion: z.string(),
		permiteMatriculacion: z.boolean(),
		calculoNivel: z.boolean(),
		validaParaCredito: z.boolean(),
		validaParaPromedio: z.boolean(),
		costoEnMatricula: z.boolean(),
		requeridaParaEgresar: z.boolean(),
		cantidadMatriculas: z.number(),
		cantidadMatriculasAutorizadas: z.number().nullable(),
		minimoCreditosRequeridos: z.number().nullable(),
		maximaCantidadHorasSemanalas: z.number(),
		horasColaborativas: z.number(),
		horasAsistidasDocente: z.number(),
		horasAutonomas: z.number(),
		horasPracticas: z.number(),
		sumaHoras: z.boolean(),
		creditos: z.number(),
		horasProyectoIntegrador: z.number(),
		noValidaAsistencia: z.boolean(),
		materiaComun: z.boolean(),
		guiaPracticaMetodologiaObligatoria: z.boolean(),
		aprobarGuiaPracticaMetodologica: z.boolean(),
		descripcion: z.string().nullable(),
		objetivoGeneral: z.string().nullable(),
		resultadosAprendizaje: z.string().nullable(),
		aporteAsignaturaAlPerfil: z.string().nullable(),
		competenciaGenerica: z.string().nullable(),
		objetivosEspecificos: z.string().nullable(),
		observaciones: z.string().nullable(),

		asignatura: asignaturaSchema,
		ejeFormativo: ejeFormativoSchema,
		areaConocimiento: areaConocimientoSchema,
		campoFormacion: campoFormacionSchema.nullable(),

		ejeFormativoId: z.string().uuid(),
		nivelMallaId: z.string().uuid(),
		asignaturaId: z.string().uuid(),
		areaConocimientoId: z.string().uuid(),
		campoFormacionId: z.string().uuid().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const nivelMallaSchema = z
	.object<ZodInferSchema<MallaCurricularFromAPI["niveles"][number]>>({
		id: z.string().uuid(),
		nivel: z.number(),
		mallaId: z.string().uuid(),
		tituloObtenidoId: z.string().uuid().nullable(),

		asignaturas: asignaturaEnNivelMallaSchema.array(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const mallaSchema = z
	.object<ZodInferSchema<MallaCurricularFromAPI>>({
		id: z.string().uuid(),
		tipoDuracion: z
			.enum(["ANOS", "CREDITOS", "HORAS", "SEMESTRES"] as const)
			.nullable(),
		codigo: z.string().nullable(),
		fechaAprobacion: z.string().uuid(),
		fechaLimiteVigencia: z.string().uuid(),
		cantidadOtrasMateriasMatricula: z.number(),
		limiteSeleccionMateriaPorAdministrativo: z.boolean(),
		cantidadArrastres: z.number().nullable(),
		porcentajeMinimoPasarNivel: z.number().nullable(),
		maximoMateriasAdelantar: z.number().nullable(),
		automatriculaModulos: z.boolean(),
		plantillasSilabo: z.boolean(),
		modeloPlanificacion: z.boolean(),
		perfilEgreso: z.string().nullable(),
		observaciones: z.string().nullable(),
		tituloObtenidoId: z.string().uuid().nullable(),
		modalidadId: z.string().uuid(),
		programaId: z.string().uuid(),
		enUso: z.boolean(),
		estado: z.boolean(),

		modulos: moduloSchema.array(),
		niveles: nivelMallaSchema.array(),
		tituloObtenido: tituloObtenidoSchema.nullable(),
		practicaComunitaria: z
			.object({
				id: z.string(),
				requiereAutorizacion: z.boolean(),
				horas: z.number().nullable(),
				creditos: z.number().nullable(),
				registroDesdeNivelId: z.string().nullable(),
				registroPracticasAdelantadas: z.boolean(),
				registroMultiple: z.boolean(),
				mallaCurricularId: z.string(),

				createdAt: z.string().datetime(),
				updatedAt: z.string().datetime(),
			})
			.nullable(),
		practicaPreProfesional: z
			.object({
				id: z.string(),
				requiereAutorizacion: z.boolean(),
				horas: z.number().nullable(),
				creditos: z.number().nullable(),
				registroDesdeNivelId: z.string().nullable(),
				registroPracticasAdelantadas: z.boolean(),
				mallaCurricularId: z.string(),

				createdAt: z.string().datetime(),
				updatedAt: z.string().datetime(),
			})
			.nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const lugarEjecucionSchema = z
	.object<ZodInferSchema<LugarEjecucionFromAPI>>({
		id: z.string().uuid(),
		mallaId: z.string(),
		codigo: z.string().nullable(),
		sedeId: z.string().uuid(),
		sede: sedeSchema,

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const mallaWithLugaresEjecucion: z.ZodType<MallaCurricularWithLugaresEjecucionFromAPI> =
	mallaSchema
		.extend({
			lugaresEjecucion: lugarEjecucionSchema.array(),
		})
		.strict();

export class MallaCurricularClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: UpdateMallaData;
	}): Promise<APIResponse<MallaCurricularFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: mallaSchema,
				message: z.string(),
			}),
			`/api/mallas-curriculares/${params.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.data),
			},
		);

		return res;
	}

	async getMany(
		filters?: MallaCurricularQueryFilter,
	): Promise<APIResponse<MallaCurricularFromAPI[]>> {
		const searchParams = new URLSearchParams();

		Object.entries(filters ?? {}).forEach(([key, value]) => {
			if (value === undefined) return;

			searchParams.append(key, `${value}`);
		});

		const res = this.fetcher(
			z.object({
				data: mallaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/mallas-curriculares",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<MallaCurricularFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: mallaSchema.nullable(),
				message: z.string(),
			}),
			`/api/mallas-curriculares/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	// async createAsignaturaEnMalla({
	// 	asignaturaId,
	// 	data,
	// 	mallaId,
	// }: CreateAsignaturaEnMallaParams): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(
	// 		this.apiUrl +
	// 			`/api/mallas-curriculares/${mallaId}/asignaturas/${asignaturaId}`,
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				"Context-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(data),
	// 		},
	// 	);

	// 	if (!res.ok) {
	// 		const json = (await res.json()) as APIResponse<undefined>;

	// 		throw new APIError(json.message);
	// 	}

	// 	return res.json();
	// }

	async createAsignaturaEnNivelMalla({
		data,
		mallaCurricularId,
		nivelMallaId,
	}: CreateAsignaturaEnNivelMallaParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/mallas-curriculares/${mallaCurricularId}/asignaturas/${nivelMallaId}`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async getMallaWithAsignaturasByMallaId(
		id: string,
		filters?: {
			asignaturas_esAnexo?: boolean;
		},
	): Promise<APIResponse<MallaCurricularFromAPI | null>> {
		const searchParams = new URLSearchParams();

		Object.entries(filters || {}).forEach(([f, v]) => {
			searchParams.set(f, `${v}`);
		});

		const res = this.fetcher(
			z.object({
				data: mallaSchema.nullable(),
				message: z.string(),
			}),
			`/api/mallas-curriculares/${id}/asignaturas?${searchParams.toString()}`,
		);

		return res;
	}

	async createLugarEjecucion({
		data,
		mallaId,
	}: CreateLugarEjecucionParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/mallas-curriculares/${mallaId}/lugares-ejecucion`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async getMallaWithLugaresEjecucionByMallaId(
		id: string,
	): Promise<APIResponse<MallaCurricularWithLugaresEjecucionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: mallaWithLugaresEjecucion.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/mallas-curriculares/${id}/lugares-ejecucion`,
		);

		return res;
	}
}

export type CreateAsignaturaEnNivelMallaParams = {
	mallaCurricularId: string;
	nivelMallaId: string;
	data: Omit<
		AsignaturaEnNivelMallaFromAPI,
		| "id"
		| "createdAt"
		| "updatedAt"
		| "ejeFormativo"
		| "areaConocimiento"
		| "campoFormacion"
		| "asignatura"
		| "nivelMallaId"
	>;
};

// export type CreateAsignaturaEnMallaParams = {
// 	mallaId: string;
// 	asignaturaId: string;
// 	data: {
// 		esAnexo: boolean;
// 		nivel: number;
// 		tipoAsignatura: $Enums.TipoAsignatura;
// 		identificacion: string;
// 		permiteMatriculacion: boolean;
// 		validaCredito: boolean;
// 		validaPromedio: boolean;
// 		costoEnMatricula: boolean;
// 		practicasPreProfesionales: boolean;
// 		requeridaEgreso: boolean;
// 		cantidadMatriculas: number;
// 		horasSemanales: number;
// 		horasColaborativas: number;
// 		horasAsistidasDocente: number;
// 		horasAutonomas: number;
// 		horasPracticas: number;
// 		sumaHoras: boolean;
// 		creditos: number;
// 		noValidaAsistencia: boolean;
// 		materiaComun: boolean;
// 		objetivos: string | null;
// 		descripcion: string | null;
// 		resultadosAprendizaje: string | null;

// 		competenciaGenerica: string | null;
// 		ejeFormativoId: string | null;
// 		areaConocimientoId: string;
// 		campoFormacionId: string;
// 	};
// };

export type CreateLugarEjecucionParams = {
	mallaId: string;
	data: Omit<
		LugarEjecucionFromAPI,
		"id" | "mallaId" | "createdAt" | "updatedAt" | "sede"
	>;
};
