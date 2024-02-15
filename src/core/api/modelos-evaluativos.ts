import type { ModeloEvaluativo } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import type { CampoModeloEvaluativoFromAPI } from "./campos-modelos-evaluativos";

export type ModeloEvaluativoFromAPI = ReplaceDateToString<
	ModeloEvaluativo & {
		enUso: boolean;
	}
>;

type UpdateModeloEvaluativoParams = {
	id: string;
	data: Partial<
		Omit<ModeloEvaluativoFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
	>;
};

type CreateModeloEvaluativo = Omit<
	ModeloEvaluativoFromAPI,
	"id" | "enUso" | "estado" | "createdAt" | "updatedAt"
>;

type CreateCampoParams = {
	modeloEvaluativoId: string;
	alternativaEvaluacionId: string;
	data: Omit<
		CampoModeloEvaluativoFromAPI,
		"id" | "createdAt" | "updatedAt" | "alternativaId" | "modeloEvaluativoId"
	>;
};

export const modeloEvaluativoSchema = z
	.object<ZodInferSchema<ModeloEvaluativoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		estado: z.boolean(),
		notaMaxima: z.number(),
		notaAprobatoria: z.number(),
		notaRecuperacion: z.number(),
		porcentajeAsistenciaAprobatoria: z.number(),
		decimalesNotaFinal: z.number(),
		defineMaximos: z.boolean(),
		camposActualizanEstado: z.boolean(),
		observaciones: z.string().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class ModeloEvaluativoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateModeloEvaluativoParams): Promise<
		APIResponse<ModeloEvaluativoFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: modeloEvaluativoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/modelos-evaluativos/${id}`,
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

	async create(data: CreateModeloEvaluativo): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modelos-evaluativos`, {
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

	async getMany(_: void): Promise<APIResponse<ModeloEvaluativoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: modeloEvaluativoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/modelos-evaluativos",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<ModeloEvaluativoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: modeloEvaluativoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/modelos-evaluativos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modelos-evaluativos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async createCampo({
		alternativaEvaluacionId,
		modeloEvaluativoId,
		data,
	}: CreateCampoParams) {
		const res = await fetch(
			this.apiUrl +
				`/api/modelos-evaluativos/${modeloEvaluativoId}/alternativas-evaluacion/${alternativaEvaluacionId}`,
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
}
