import type { DetalleNivelTitulacion } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type DetalleNivelTitulacionFromAPI = ReplaceDateToString<
	DetalleNivelTitulacion & {
		enUso: boolean;
	}
>;

export const detalleNivelTitulacionSchema = z
	.object<ZodInferSchema<DetalleNivelTitulacionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		nivelTitulacionId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class DetalleNivelTitulacionClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<
				DetalleNivelTitulacionFromAPI,
				"id" | "enUso" | "createdAt" | "updatedAt" | "nivelTitulacionId"
			>
		>;
	}): Promise<APIResponse<DetalleNivelTitulacionFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: detalleNivelTitulacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/detalles-nivel-titulacion/${params.id}`,
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

	async getMany(
		_: void,
	): Promise<APIResponse<DetalleNivelTitulacionFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: detalleNivelTitulacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/detalles-nivel-titulacion",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<DetalleNivelTitulacionFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: detalleNivelTitulacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/detalles-nivel-titulacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/detalles-nivel-titulacion/${id}`,
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
