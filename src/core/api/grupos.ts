import type { Grupo } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type GrupoFromAPI = ReplaceDateToString<
	Grupo & {
		enUso: boolean;
		usuarios: number;
		activos: number;
		inactivos: number;
	}
>;

type UpdateGrupoParams = {
	id: string;
	data: Partial<CreateGrupo>;
};

export type CreateGrupo = Omit<
	GrupoFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "usuarios"
	| "activos"
	| "inactivos"
	| "enUso"
>;

export const baseGrupoSchema = z
	.object<ZodInferSchema<GrupoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		activos: z.number(),
		inactivos: z.number(),
		usuarios: z.number(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class GrupoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateGrupoParams): Promise<APIResponse<GrupoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: baseGrupoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/grupos/${id}`,
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
		data: Omit<GrupoFromAPI, "enUso" | "createdAt" | "updatedAt" | "id">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/grupos`, {
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

	async getMany(_: void): Promise<APIResponse<GrupoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: baseGrupoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/grupos",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<GrupoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: baseGrupoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/grupos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/grupos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
