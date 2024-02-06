import type { ModeloNivelacion } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type ModeloNivelacionFromAPI = ReplaceDateToString<
	ModeloNivelacion & {
		enUso: boolean;
	}
>;

type UpdateModeloNivelacionParams = {
	id: string;
	data: Partial<
		Omit<ModeloNivelacionFromAPI, "enUso" | "id" | "createdAt" | "updatedAt">
	>;
};

type CreateModeloNivelacion = Omit<
	ModeloNivelacionFromAPI,
	"enUso" | "id" | "estado" | "createdAt" | "updatedAt"
>;

export const modeloNivelacionSchema = z
	.object<ZodInferSchema<ModeloNivelacionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		estado: z.boolean(),
		enUso: z.boolean(),
		notaMaxima: z.number(),
		notaAprobatoria: z.number(),
		decimalesNotaFinal: z.number(),
		observaciones: z.string().nullable(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class ModeloNivelacionClass {
	constructor(private apiUrl: string) {}

	async update(
		params: UpdateModeloNivelacionParams,
	): Promise<APIResponse<ModeloNivelacionFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: modeloNivelacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/modelos-nivelacion/${params.id}`,
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

	async create(data: CreateModeloNivelacion): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modelos-nivelacion`, {
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

	async getMany(_: void): Promise<APIResponse<ModeloNivelacionFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: modeloNivelacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/modelos-nivelacion",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<ModeloNivelacionFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: modeloNivelacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/modelos-nivelacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modelos-nivelacion/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
