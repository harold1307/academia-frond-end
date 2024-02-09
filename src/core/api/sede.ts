import type { Sede } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import type { CreateCoordinacion } from "./coordinaciones";

export type SedeFromAPI = ReplaceDateToString<
	Sede & {
		enUso: boolean;
	}
>;

export type CreateSede = Omit<
	SedeFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt"
>;

export const sedeSchema = z
	.object<ZodInferSchema<SedeFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		canton: z.string(),
		provincia: z.string(),
		pais: z.string(),
		alias: z.string(),
	})
	.strict();

export class SedeClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<SedeFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
		>;
	}): Promise<APIResponse<SedeFromAPI>> {
		const res = this.fetcher(
			z.object<ZodInferSchema<APIResponse<SedeFromAPI>>>({
				data: sedeSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/sedes/${params.id}`,
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

	async create(data: CreateSede): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/sedes`, {
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

	async getMany(_: void): Promise<APIResponse<SedeFromAPI[]>> {
		const res = this.fetcher(
			z.object<ZodInferSchema<APIResponse<SedeFromAPI[]>>>({
				data: sedeSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/sedes",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<SedeFromAPI | null>> {
		const res = this.fetcher(
			z.object<ZodInferSchema<APIResponse<SedeFromAPI | null>>>({
				data: sedeSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/sedes/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/sedes/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async createCoordinacion({
		sedeId,
		data,
	}: CreateCoordinacionParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/sedes/${sedeId}/coordinaciones`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}

type CreateCoordinacionParams = {
	sedeId: string;
	data: CreateCoordinacion;
};
