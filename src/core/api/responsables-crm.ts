import type { Administrativo, ResponsableCrm } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	administrativoSchema,
	baseUsuarioSchema,
	type UsuarioFromAPI,
} from "./usuarios";

export type ResponsableCrmFromAPI = ReplaceDateToString<
	ResponsableCrm & {
		administrativo: Administrativo & {
			usuario: Omit<
				UsuarioFromAPI,
				"administrativo" | "profesor" | "alumno" | "grupos"
			>;
		};
	}
>;

type ExtraFields = "administrativo";

type UpdateResponsableCrmParams = {
	id: string;
	data: Partial<
		Omit<
			ResponsableCrmFromAPI,
			"id" | "createdAt" | "updatedAt" | "administrativo" | "administrativoId"
		>
	>;
};

export type CreateResponsableCrm = Omit<
	ResponsableCrmFromAPI,
	"id" | "createdAt" | "updatedAt" | "administrativo" | "estado"
>;

export const baseResponsableCrmSchema = z
	.object<ZodInferSchema<Omit<ResponsableCrmFromAPI, ExtraFields>>>({
		id: z.string().uuid(),
		administrativoId: z.string().uuid(),
		estado: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const responsableCrmSchema = baseResponsableCrmSchema
	.extend<ZodInferSchema<Pick<ResponsableCrmFromAPI, ExtraFields>>>({
		administrativo: administrativoSchema
			.omit({
				sede: true,
				asesorCrm: true,
				asesorEstudiante: true,
				responsableCrm: true,
			})
			.extend({
				usuario: baseUsuarioSchema,
			}),
	})
	.strict();

export class ResponsableCrmClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateResponsableCrmParams): Promise<APIResponse<ResponsableCrmFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: responsableCrmSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/responsables-crm/${id}`,
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

	// async create(
	// 	data: Omit<
	// 		ResponsableCrmFromAPI,
	// 		"enUso" | "createdAt" | "updatedAt" | "id"
	// 	>,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(this.apiUrl + `/api/responsables-crm`, {
	// 		method: "POST",
	// 		headers: {
	// 			"Context-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(data),
	// 	});

	// 	if (!res.ok) {
	// 		const json = (await res.json()) as APIResponse<unknown>;
	// 		throw new APIError(json.message);
	// 	}

	// 	return res.json();
	// }

	async getMany(_: void): Promise<APIResponse<ResponsableCrmFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: responsableCrmSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/responsables-crm",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<ResponsableCrmFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: responsableCrmSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/responsables-crm/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/responsables-crm/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
