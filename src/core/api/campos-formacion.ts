import type { CampoFormacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type CampoFormacionFromAPI = ReplaceDateToString<
	CampoFormacion & {
		enUso: boolean;
	}
>;

export const campoFormacionSchema = z
	.object<ZodInferSchema<CampoFormacionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class CampoFormacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<CampoFormacionFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
		>;
	}): Promise<APIResponse<CampoFormacionFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: campoFormacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/campos-formacion/${params.id}`,
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
			CampoFormacionFromAPI,
			"id" | "enUso" | "createdAt" | "updatedAt"
		>,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/campos-formacion`, {
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

	async getMany(_: void): Promise<APIResponse<CampoFormacionFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: campoFormacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/campos-formacion",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<CampoFormacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: campoFormacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/campos-formacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/campos-formacion/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
