import type { PerfilPractica } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type PerfilPracticaFromAPI = ReplaceDateToString<
	PerfilPractica & {
		enUso: boolean;
	}
>;

type CreatePerfilPractica = Omit<
	PerfilPracticaFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt" | "programaId"
>;

type UpdatePerfilPracticaParams = {
	id: string;
	data: Partial<CreatePerfilPractica>;
};

export const perfilPracticaSchema = z
	.object<ZodInferSchema<PerfilPracticaFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		actividades: z.string().nullable(),
		capacidades: z.string().nullable(),
		resultados: z.string().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class PerfilPracticaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		id,
		data,
	}: UpdatePerfilPracticaParams): Promise<APIResponse<PerfilPracticaFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: perfilPracticaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/perfiles-practica/${id}`,
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

	async create(data: CreatePerfilPractica): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/perfiles-practica`, {
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

	async getMany(_: void): Promise<APIResponse<PerfilPracticaFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: perfilPracticaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/perfiles-practica",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<PerfilPracticaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: perfilPracticaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/perfiles-practica/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/perfiles-practica/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
