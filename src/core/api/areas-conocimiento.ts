import type { AreaConocimiento } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type AreaConocimientoFromAPI = ReplaceDateToString<
	AreaConocimiento & {
		enUso: boolean;
	}
>;

const schema = z
	.object<ZodInferSchema<AreaConocimientoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		codigo: z.string().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class AreaConocimientoClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<AreaConocimientoFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
		>;
	}): Promise<APIResponse<AreaConocimientoFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: schema,
				message: z.string(),
			}),
			this.apiUrl + `/api/areas-conocimiento/${params.id}`,
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

	async create(
		data: Omit<
			AreaConocimientoFromAPI,
			"id" | "enUso" | "createdAt" | "updatedAt"
		>,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/areas-conocimiento`, {
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

	async getMany(_: void): Promise<APIResponse<AreaConocimientoFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/areas-conocimiento",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<AreaConocimientoFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/areas-conocimiento/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/areas-conocimiento/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
