import type { Paralelo } from "@prisma/client";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { z } from "zod";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type ParaleloFromAPI = ReplaceDateToString<
	Paralelo & {
		enUso: boolean;
	}
>;

export type CreateParalelo = Omit<
	ParaleloFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt"
>;

type UpdateParaleloParams = {
	id: string;
	data: Partial<CreateParalelo>;
};

const paraleloSchema = z
	.object<ZodInferSchema<ParaleloFromAPI>>({
		id: z.string(),
		nombre: z.string(),
		orden: z.number(),
		enUso: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class ParaleloClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateParaleloParams): Promise<APIResponse<ParaleloFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: paraleloSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/paralelos/${id}`,
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

	async create(data: CreateParalelo): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/paralelos`, {
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

	async getMany(_: void): Promise<APIResponse<ParaleloFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: paraleloSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/paralelos`,
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<ParaleloFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: paraleloSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/paralelos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/paralelos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
