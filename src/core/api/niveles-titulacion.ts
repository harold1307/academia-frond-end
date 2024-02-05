import type { NivelTitulacion } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";
import type { DetalleNivelTitulacionFromAPI } from "./detalles-nivel-titulacion";

export type NivelTitulacionFromAPI = ReplaceDateToString<
	NivelTitulacion & {
		enUso: boolean;
	}
>;

type UpdateNivelTitulacionParams = {
	id: string;
	data: Partial<
		Omit<NivelTitulacionFromAPI, "enUso" | "id" | "createdAt" | "updatedAt">
	>;
};

type CreateNivelTitulacion = Omit<
	NivelTitulacionFromAPI,
	"enUso" | "createdAt" | "updatedAt" | "id"
>;

export const nivelTitulacionSchema = z
	.object<ZodInferSchema<NivelTitulacionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class NivelTitulacionClass {
	constructor(private apiUrl: string) {}

	async update(
		params: UpdateNivelTitulacionParams,
	): Promise<APIResponse<NivelTitulacionFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: nivelTitulacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-titulacion/${params.id}`,
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

	async create(data: CreateNivelTitulacion): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/niveles-titulacion`, {
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

	async getMany(_: void): Promise<APIResponse<NivelTitulacionFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: nivelTitulacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/niveles-titulacion",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<NivelTitulacionFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: nivelTitulacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-titulacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/niveles-titulacion/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async createDetalle({ data, id }: CreateDetalleParams) {
		const res = await fetch(
			this.apiUrl + `/api/niveles-titulacion/${id}/detalles`,
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

type CreateDetalleParams = {
	id: string;
	data: Omit<
		DetalleNivelTitulacionFromAPI,
		"id" | "createdAt" | "updatedAt" | "enUso" | "nivelTitulacionId"
	>;
};
