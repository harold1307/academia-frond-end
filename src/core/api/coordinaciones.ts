import type { Coordinacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type CoordinacionFromAPI = ReplaceDateToString<
	Coordinacion & {
		enUso: boolean;
	}
>;

export type CreateCoordinacion = Omit<
	CoordinacionFromAPI,
	"sedeId" | "id" | "enUso" | "createdAt" | "updatedAt"
>;

const schema = z
	.object<ZodInferSchema<CoordinacionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		alias: z.string(),
		sedeId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class CoordinacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<CoordinacionFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
		>;
	}): Promise<APIResponse<CoordinacionFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: schema,
				message: z.string(),
			}),
			this.apiUrl + `/api/coordinaciones/${params.id}`,
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

	async getMany(_: void): Promise<APIResponse<CoordinacionFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/coordinaciones",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<CoordinacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/coordinaciones/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/coordinaciones/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
