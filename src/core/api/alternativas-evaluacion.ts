import type { AlternativaEvaluacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type AlternativaEvaluacionFromAPI = ReplaceDateToString<
	AlternativaEvaluacion & {
		enUso: boolean;
	}
>;

const schema = z
	.object<ZodInferSchema<AlternativaEvaluacionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		codigo: z.string(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class AlternativaEvaluacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<
				AlternativaEvaluacionFromAPI,
				"id" | "enUso" | "createdAt" | "updatedAt"
			>
		>;
	}): Promise<APIResponse<AlternativaEvaluacionFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: schema,
				message: z.string(),
			}),
			this.apiUrl + `/api/alternativas-evaluacion/${params.id}`,
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

	async create(
		data: Omit<
			AlternativaEvaluacionFromAPI,
			"id" | "enUso" | "createdAt" | "updatedAt"
		>,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/alternativas-evaluacion`, {
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

	async getMany(_: void): Promise<APIResponse<AlternativaEvaluacionFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/alternativas-evaluacion",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<AlternativaEvaluacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/alternativas-evaluacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/alternativas-evaluacion/${id}`,
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
