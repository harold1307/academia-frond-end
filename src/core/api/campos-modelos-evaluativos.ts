import type { CampoModeloEvaluativo } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type CampoModeloEvaluativoFromAPI =
	ReplaceDateToString<CampoModeloEvaluativo>;

const schema = z
	.object<ZodInferSchema<CampoModeloEvaluativoFromAPI>>({
		id: z.string().uuid(),
		codigo: z.string(),
		ordenActa: z.number(),
		notaMaxima: z.number(),
		notaMinima: z.number(),
		decimales: z.number(),
		campoDependiente: z.boolean(),
		actualizaEstado: z.boolean(),
		actualizaEstadoNegativo: z.boolean(),
		determinaEstadoFinal: z.boolean(),
		defineMaximos: z.boolean(),
		alternativaId: z.string().uuid(),
		modeloEvaluativoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class CampoModeloEvaluativoClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<
				CampoModeloEvaluativoFromAPI,
				"id" | "enUso" | "createdAt" | "updatedAt" | "modeloEvaluativoId"
			>
		>;
	}): Promise<APIResponse<CampoModeloEvaluativoFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: schema,
				message: z.string(),
			}),
			this.apiUrl + `/api/campos-modelos-evaluativos/${params.id}`,
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

	async getMany(_: void): Promise<APIResponse<CampoModeloEvaluativoFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/campos-modelos-evaluativos",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<CampoModeloEvaluativoFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/campos-modelos-evaluativos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/campos-modelos-evaluativos/${id}`,
			{
				method: "DELETE",
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
