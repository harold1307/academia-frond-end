import { z } from "zod";
import {
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
	APIError,
} from ".";
import { type ZodFetcher } from "zod-fetch";
import {
	type CronogramaMatriculacionFromAPI,
	type CreateCronogramaMatriculacion,
} from "./cronogramas-matriculacion";
import { type ReplaceDateToString, type ZodInferSchema } from "@/utils/types";
import { type CalculoCosto, type PeriodoLectivo } from "@prisma/client";

export type PeriodoLectivoFromAPI = ReplaceDateToString<
	PeriodoLectivo & {
		enUso: boolean;
		fechasEnMatricula: boolean;
		estructuraParalelosAgrupadosPorNivel: boolean;
		planificacionProfesoresObligatoria: boolean;
		legalizarMatriculas: boolean;
		secuenciaDesdeNumeroEspecifico: boolean;
		numeroMatricula: boolean;
		calculoCosto: CalculoCostoFromAPI;
	}
>;

export type PeriodoLectivoWithCronogramasMatriculacion =
	PeriodoLectivoFromAPI & {
		cronogramasMatriculacion: CronogramaMatriculacionFromAPI[];
	};

export type CalculoCostoFromAPI = ReplaceDateToString<
	CalculoCosto & {
		planCostos: boolean;
	}
>;
export type UpdateCalculoCosto = Partial<
	Omit<CalculoCostoFromAPI, "id" | "createdAt" | "updatedAt">
>;

export const calculoCostoSchema = z.object<ZodInferSchema<CalculoCostoFromAPI>>(
	{
		id: z.string().uuid(),
		tipo: z.enum([
			"COSTO_POR_NIVEL_Y_MATERIAS",
			"COSTO_POR_PLAN_CUOTA",
		] as const),
		costoPorSesion: z.boolean().nullable(),
		planCostos: z.boolean(),
		cronogramaFechasOpcionPago: z.boolean().nullable(),
		estudiantesEligenOpcionPago: z.boolean().nullable(),
	},
);

export class PeriodosLectivosClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async create(data: any): Promise<SimpleAPIResponse> {
		console.log(data);
		const res = await fetch(this.apiUrl + `/api/periodos-lectivos`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}
		return res.json();
	}
	async getMany(_: void): Promise<APIResponse<PeriodoLectivoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			this.apiUrl + "/api/periodos-lectivos",
		);

		return res;
	}
	async update({ id, data }: any): Promise<APIResponse<PeriodoLectivoFromAPI>> {
		console.log(data);
		const res = zodFetcher(
			z.object({
				data: z.any(),
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
	async getById({ id }: { id: string }) {
		console.log(id);
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/${id}`,
		);

		return res;
	}
	async actividadesHabilitadas(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/actividades-habilitadas/${id}`,
		);

		return res;
	}
	async costos(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/costos/${id}`,
		);

		return res;
	}
	async habilitar(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/habilitar-matricula/${id}`,
		);

		return res;
	}
	async actualizar(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/actualizar-calificaciones/${id}`,
		);

		return res;
	}
}

export class CronogramaMatriculas {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: { cronograma: { data: any; id: string } }) {
		const res = zodFetcher(
			z.object({
				cronograma: PeriodoSchema,
			}),
			`/api/periodos-lectivos/cronograma/${params.cronograma.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.cronograma.data),
			},
		);

		return res;
	}
}

export class TraduccionPeriodosClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: { cronograma: { data: any; id: string } }) {
		const res = zodFetcher(
			z.object({
				cronograma: PeriodoSchema,
			}),
			`/api/periodos-lectivos/cronograma/${params.cronograma.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.cronograma.data),
			},
		);

		return res;
	}
}

type CreateCronogramaMatriculacionParams = {
	periodoLectivoId: string;
	nivelMallaId: string;
	data: CreateCronogramaMatriculacion;
};
