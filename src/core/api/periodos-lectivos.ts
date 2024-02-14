import type { CalculoCosto, PeriodoLectivo } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	cronogramaMatriculacionSchema,
	type CreateCronogramaMatriculacion,
	type CronogramaMatriculacionFromAPI,
} from "./cronogramas-matriculacion";
import type { CreateRequisitoMatriculacion } from "./requisitos-matriculacion";
import type { CreateSubPeriodoLectivo } from "./sub-periodos-lectivos";

export type PeriodoLectivoFromAPI = ReplaceDateToString<
	PeriodoLectivo & {
		enUso: boolean;
		fechasEnMatricula: boolean;
		estructuraParalelosAgrupadosPorNivel: boolean;
		planificacionProfesoresObligatoria: boolean;
		legalizarMatriculas: boolean;
		secuenciaDesdeNumeroEspecifico: boolean;
		numeroMatricula: boolean;
	}
>;

export type PeriodoLectivoWithCronogramasMatriculacion =
	PeriodoLectivoFromAPI & {
		cronogramasMatriculacion: CronogramaMatriculacionFromAPI[];
	};

export type CalculoCostoFromAPI = ReplaceDateToString<CalculoCosto>;
export type UpdateCalculoCosto = Partial<
	Omit<CalculoCostoFromAPI, "id" | "createdAt" | "updatedAt">
>;

type UpdatePeriodoLectivoParams = {
	id: string;
	data: Partial<
		Omit<
			PeriodoLectivoFromAPI,
			| "calculoCostoId"
			| "id"
			| "createdAt"
			| "updatedAt"
			| "enUso"
			| "fechasEnMatricula"
			| "estructuraParalelosAgrupadosPorNivel"
			| "planificacionProfesoresObligatoria"
			| "legalizarMatriculas"
			| "secuenciaDesdeNumeroEspecifico"
			| "numeroMatricula"
		>
	>;
};

export type CreatePeriodoLectivo = Omit<
	PeriodoLectivoFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "enUso"
	| "matriculas"
	| "estado"
	| "abierto"
	| "actividadesDocencia"
	| "actividadesInvestigacion"
	| "actividadesGestion"
	| "actividadesPracticasComunitarias"
	| "actividadesPracticasPreprofesionales"
	| "otrasActividades"
	| "calculoCostoId"
	| "fechasEnMatricula"
	| "estructuraParalelosAgrupadosPorNivel"
	| "planificacionProfesoresObligatoria"
	| "legalizarMatriculas"
	| "secuenciaDesdeNumeroEspecifico"
	| "numeroMatricula"
>;

export const calculoCostoSchema = z.object<ZodInferSchema<CalculoCostoFromAPI>>(
	{
		id: z.string().uuid(),
		tipo: z.enum([
			"COSTO_POR_NIVEL_Y_MATERIAS",
			"COSTO_POR_PLAN_CUOTA",
		] as const),
		costoPorSesion: z.boolean().nullable(),
		cronogramaFechasOpcionPago: z.boolean().nullable(),
		estudiantesEligenOpcionPago: z.boolean().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	},
);

export const periodoLectivoSchema = z
	.object<ZodInferSchema<PeriodoLectivoFromAPI>>({
		id: z.string().uuid(),
		enUso: z.boolean(),
		matriculas: z.boolean(),
		estado: z.boolean(),
		abierto: z.boolean(),
		nombre: z.string(),
		tipo: z.enum(["GRADO", "POSGRADO"] as const),
		fechasEnMatricula: z.boolean(),
		estructuraParalelosAgrupadosPorNivel: z.boolean(),
		planificacionProfesoresObligatoria: z.boolean(),
		legalizarMatriculas: z.boolean(),
		secuenciaDesdeNumeroEspecifico: z.boolean(),
		numeroMatricula: z.boolean(),

		inicio: z.string().datetime(),
		fin: z.string().datetime(),

		limiteMatriculaOrdinaria: z.string().datetime().nullable(),
		limiteMatriculaExtraordinaria: z.string().datetime().nullable(),
		limiteMatriculaEspecial: z.string().datetime().nullable(),
		automatriculaAlumnosFechaExtraordinaria: z.boolean().nullable(),

		estudianteSeleccionaParaleloAutomatricula: z.boolean().nullable(),
		seImpartioNivelacion: z.boolean(),
		planificacionCargaHoraria: z.boolean(),

		planificacionProfesoresFormaTotal: z.boolean().nullable(),
		aprobacionPlanificacionProfesores: z.boolean().nullable(),

		legalizacionAutomaticaContraPagos: z.boolean().nullable(),
		numeroSecuencia: z.number().nullable(),
		corteId: z.string().uuid().nullable(),

		cronogramaNotasCoordinacion: z.boolean(),
		puedenAutomatricularseSegundasOMasMatriculas: z.boolean(),
		puedenMatricularseArrastre: z.boolean(),

		numeroMatriculaAutomatico: z.boolean().nullable(),
		numeroMatricularAlLegalizar: z.boolean().nullable(),
		actividadesDocencia: z.boolean(),
		actividadesInvestigacion: z.boolean(),
		actividadesGestion: z.boolean(),
		actividadesPracticasComunitarias: z.boolean(),
		actividadesPracticasPreprofesionales: z.boolean(),
		otrasActividades: z.boolean(),

		calculoCostoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const periodoLectivoWithCronogramasMatriculacion =
	periodoLectivoSchema.extend<
		ZodInferSchema<
			Pick<
				PeriodoLectivoWithCronogramasMatriculacion,
				"cronogramasMatriculacion"
			>
		>
	>({
		cronogramasMatriculacion: cronogramaMatriculacionSchema.array(),
	});

export class PeriodoLectivoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdatePeriodoLectivoParams): Promise<APIResponse<PeriodoLectivoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: periodoLectivoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/periodos-lectivos/${id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		return res;
	}

	async create(data: CreatePeriodoLectivo): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/periodos-lectivos`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<PeriodoLectivoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: periodoLectivoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/periodos-lectivos",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<PeriodoLectivoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: periodoLectivoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/periodos-lectivos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/periodos-lectivos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	// calculos de costo
	async updateCalculoCosto({
		periodoLectivoId,
		data,
	}: UpdateCalculoCostoParams): Promise<APIResponse<CalculoCostoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: calculoCostoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/periodos-lectivos/${periodoLectivoId}/calculos-costo`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		return res;
	}

	// requisitos de matriculacion
	async createRequisitoMatriculacion({
		periodoLectivoId,
		data,
	}: CreateRequisitoMatriculacionParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/periodos-lectivos/${periodoLectivoId}/requisitos-matriculacion`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	// sub periodos lectivos
	async createSubPeriodoLectivo({
		periodoLectivoId,
		data,
	}: CreateSubPeriodoLectivoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/periodos-lectivos/${periodoLectivoId}/sub-periodos-lectivos`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	// cronogramas de matriculacion
	async createCronogramaMatriculacion({
		periodoLectivoId,
		nivelMallaId,
		data,
	}: CreateCronogramaMatriculacionParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/periodos-lectivos/${periodoLectivoId}/niveles-malla/${nivelMallaId}`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
	async getByIdWithCronogramasMatriculacion(
		id: string,
	): Promise<APIResponse<PeriodoLectivoWithCronogramasMatriculacion | null>> {
		const res = this.fetcher(
			z.object({
				data: periodoLectivoWithCronogramasMatriculacion.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/periodos-lectivos/${id}/cronogramas-matriculacion`,
		);

		return res;
	}
}

type UpdateCalculoCostoParams = {
	periodoLectivoId: string;
	data: UpdateCalculoCosto;
};

type CreateRequisitoMatriculacionParams = {
	periodoLectivoId: string;
	data: CreateRequisitoMatriculacion;
};

type CreateSubPeriodoLectivoParams = {
	periodoLectivoId: string;
	data: CreateSubPeriodoLectivo;
};

type CreateCronogramaMatriculacionParams = {
	periodoLectivoId: string;
	nivelMallaId: string;
	data: CreateCronogramaMatriculacion;
};
