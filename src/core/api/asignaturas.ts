import type { Asignatura } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type AsignaturaFromAPI = ReplaceDateToString<
	Asignatura & {
		enUso: boolean;
	}
>;

export type CreateAsignatura = Omit<
	AsignaturaFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt"
>;

type UpdateAsignaturaParams = {
	id: string;
	data: Partial<
		Omit<AsignaturaFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
	>;
};

export const asignaturaSchema = z
	.object<ZodInferSchema<AsignaturaFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		codigo: z.string().nullable(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		enUso: z.boolean(),
	})
	.strict();

export class AsignaturaClass {
	constructor(private apiUrl: string) {}

	async update(
		params: UpdateAsignaturaParams,
	): Promise<APIResponse<AsignaturaFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: asignaturaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/asignaturas/${params.id}`,
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

	async create(data: CreateAsignatura): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/asignaturas`, {
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

	async getMany(_: void): Promise<APIResponse<AsignaturaFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: asignaturaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/asignaturas",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<AsignaturaFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: asignaturaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/asignaturas/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/asignaturas/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
