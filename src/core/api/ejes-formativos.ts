import type { EjeFormativo } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type EjeFormativoFromAPI = ReplaceDateToString<
	EjeFormativo & {
		enUso: boolean;
	}
>;

const schema = z
	.object<ZodInferSchema<EjeFormativoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class EjeFormativoClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<EjeFormativoFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
		>;
	}): Promise<APIResponse<EjeFormativoFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: schema,
				message: z.string(),
			}),
			this.apiUrl + `/api/ejes-formativos/${params.id}`,
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
		data: Omit<EjeFormativoFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/ejes-formativos`, {
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

	async getMany(_: void): Promise<APIResponse<EjeFormativoFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/ejes-formativos",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<EjeFormativoFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/ejes-formativos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/ejes-formativos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
