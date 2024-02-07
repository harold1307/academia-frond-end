import type { TipoDocumento } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type TipoDocumentoFromAPI = ReplaceDateToString<
	TipoDocumento & {
		enUso: boolean;
	}
>;

export type CreateTipoDocumento = Omit<
	TipoDocumentoFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt"
>;

export type UpdateTipoDocumentoParams = {
	id: string;
	data: Partial<CreateTipoDocumento>;
};

export const tipoDocumentoSchema = z
	.object<ZodInferSchema<TipoDocumentoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		titulo: z.boolean(),
		actaGrado: z.boolean(),
		cedula: z.boolean(),
		papeletaVotacion: z.boolean(),
		carnetConadis: z.boolean(),
		convalidacion: z.boolean(),
		partidaNacimiento: z.boolean(),
		preNivelacion: z.boolean(),
		serviciosBasicos: z.boolean(),
		examenIngreso: z.boolean(),
		paraPasantia: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		enUso: z.boolean(),
	})
	.strict();

export class TipoDocumentoClass {
	constructor(private apiUrl: string) {}

	async update({
		id,
		data,
	}: UpdateTipoDocumentoParams): Promise<APIResponse<TipoDocumentoFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: tipoDocumentoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/tipos-documento/${id}`,
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

	async create(data: CreateTipoDocumento): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/tipos-documento`, {
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

	async getMany(_: void): Promise<APIResponse<TipoDocumentoFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: tipoDocumentoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/tipos-documento",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<TipoDocumentoFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: tipoDocumentoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/tipos-documento/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/tipos-documento/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
