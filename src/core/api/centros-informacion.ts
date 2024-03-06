import type { CentroInformacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type CentroInformacionFromAPI = ReplaceDateToString<
	CentroInformacion & {
		enUso: boolean;
	}
>;

type UpdateCentroInformacionParams = {
	id: string;
	data: Partial<
		Omit<CentroInformacionFromAPI, "id" | "createdAt" | "updatedAt" | "enUso">
	>;
};

export type CreateCentroInformacion = Omit<
	CentroInformacionFromAPI,
	"id" | "createdAt" | "updatedAt" | "estado" | "enUso"
>;

export const baseCentroInformacionSchema = z
	.object<ZodInferSchema<CentroInformacionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		estado: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class CentroInformacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateCentroInformacionParams): Promise<
		APIResponse<CentroInformacionFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: baseCentroInformacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/centros-informacion/${id}`,
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

	async create(data: CreateCentroInformacion): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/centros-informacion`, {
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

	async getMany(_: void): Promise<APIResponse<CentroInformacionFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: baseCentroInformacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/centros-informacion",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<CentroInformacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: baseCentroInformacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/centros-informacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/centros-informacion/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
