import type { Corte } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type CorteFromAPI = ReplaceDateToString<
	Corte & {
		enUso: boolean;
	}
>;

type UpdateCorteParams = {
	id: string;
	data: Partial<CreateCorte>;
};

export type CreateCorte = Omit<
	CorteFromAPI,
	"enUso" | "createdAt" | "updatedAt" | "id"
>;

export const corteSchema = z
	.object<ZodInferSchema<CorteFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class CorteClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateCorteParams): Promise<APIResponse<CorteFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: corteSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/cortes/${id}`,
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

	async create(
		data: Omit<CorteFromAPI, "enUso" | "createdAt" | "updatedAt" | "id">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/cortes`, {
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

	async getMany(_: void): Promise<APIResponse<CorteFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: corteSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/cortes",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<CorteFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: corteSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/cortes/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/cortes/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
