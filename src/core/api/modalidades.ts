import type { Modalidad } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type ModalidadFromAPI = ReplaceDateToString<
	Modalidad & {
		enUso: boolean;
	}
>;

type UpdateModalidadParams = {
	id: string;
	data: Partial<
		Omit<
			ModalidadFromAPI,
			"nombre" | "enUso" | "id" | "createdAt" | "updatedAt"
		>
	>;
};

const modalidadSchema = z
	.object<ZodInferSchema<ModalidadFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		alias: z.string().nullable(),
		enUso: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

// el ID de las modalidades son el nombre mismo
export class ModalidadClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateModalidadParams): Promise<APIResponse<ModalidadFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: modalidadSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/modalidades/${id}`,
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
		data: Omit<ModalidadFromAPI, "enUso" | "createdAt" | "updatedAt" | "id">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modalidades`, {
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

	async getMany(_: void): Promise<APIResponse<ModalidadFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: modalidadSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/modalidades",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<ModalidadFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: modalidadSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/modalidades/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modalidades/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
