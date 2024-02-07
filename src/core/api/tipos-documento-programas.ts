import type { TipoDocumentoEnPrograma } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";
import {
	tipoDocumentoSchema,
	type TipoDocumentoFromAPI,
} from "./tipos-documento";

export type TipoDocumentoEnProgramaFromAPI = ReplaceDateToString<
	TipoDocumentoEnPrograma & {
		enUso: boolean;
		tipoDocumento: TipoDocumentoFromAPI;
	}
>;

export type CreateTipoDocumentoEnPrograma = Omit<
	TipoDocumentoEnProgramaFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt" | "tipoDocumento"
>;

export type UpdateTipoDocumentoEnProgramaParams = {
	id: string;
	data: Partial<CreateTipoDocumentoEnPrograma>;
};

export const tipoDocumentoEnProgTipoDocumentoEnProgramaSchema = z
	.object<ZodInferSchema<TipoDocumentoEnProgramaFromAPI>>({
		id: z.string().uuid(),
		programaId: z.string().uuid(),
		tipoDocumentoId: z.string().uuid(),
		requeridoDigital: z.boolean(),
		requeridoFisico: z.boolean(),
		tipoDocumento: tipoDocumentoSchema,

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
		enUso: z.boolean(),
	})
	.strict();

export class TipoDocumentoEnProgramaClass {
	constructor(private apiUrl: string) {}

	async update({
		id,
		data,
	}: UpdateTipoDocumentoEnProgramaParams): Promise<
		APIResponse<TipoDocumentoEnProgramaFromAPI>
	> {
		const res = zodFetcher(
			z.object({
				data: tipoDocumentoEnProgTipoDocumentoEnProgramaSchema,
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

	async getMany(
		_: void,
	): Promise<APIResponse<TipoDocumentoEnProgramaFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: tipoDocumentoEnProgTipoDocumentoEnProgramaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/tipos-documento",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<TipoDocumentoEnProgramaFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: tipoDocumentoEnProgTipoDocumentoEnProgramaSchema.nullable(),
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
