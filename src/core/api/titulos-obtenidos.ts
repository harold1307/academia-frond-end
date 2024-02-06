import type { TituloObtenido } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type TituloObtenidoFromAPI = ReplaceDateToString<
	TituloObtenido & {
		enUso: boolean;
	}
>;

export type CreateTituloObtenido = Omit<
	TituloObtenidoFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt" | "programaId"
>;

type UpdateTituloObtenidoParams = {
	id: string;
	data: Partial<Omit<CreateTituloObtenido, "programaId">>;
};

export const tituloObtenidoSchema = z
	.object<ZodInferSchema<TituloObtenidoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		programaId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class TituloObtenidoClass {
	constructor(private apiUrl: string) {}

	async update(
		params: UpdateTituloObtenidoParams,
	): Promise<APIResponse<TituloObtenidoFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: tituloObtenidoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/titulos-obtenidos/${params.id}`,
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

	async getMany(_: void): Promise<APIResponse<TituloObtenidoFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: tituloObtenidoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/titulos-obtenidos",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<TituloObtenidoFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: tituloObtenidoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/titulos-obtenidos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/titulos-obtenidos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
