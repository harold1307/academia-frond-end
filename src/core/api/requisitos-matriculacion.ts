import type { RequisitoMatriculacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import { modalidadSchema, type ModalidadFromAPI } from "./modalidades";
import { programaSchema, type ProgramaFromAPI } from "./programas";
import { sedeSchema, type SedeFromAPI } from "./sede";
import {
	tipoDocumentoSchema,
	type TipoDocumentoFromAPI,
} from "./tipos-documento";

export type RequisitoMatriculacionFromAPI = ReplaceDateToString<
	RequisitoMatriculacion & {
		sede: Omit<SedeFromAPI, "enUso">;
		programa: Omit<
			ProgramaFromAPI,
			"enUso" | "nivelTitulacion" | "detalleNivelTitulacion"
		> | null;
		modalidad: Omit<ModalidadFromAPI, "enUso"> | null;
		tipoDocumento: Omit<TipoDocumentoFromAPI, "enUso">;
	}
>;

export type CreateRequisitoMatriculacion = Omit<
	RequisitoMatriculacionFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "sede"
	| "programa"
	| "modalidad"
	| "tipoDocumento"
>;

type UpdateRequisitoMatriculacionParams = {
	id: string;
	data: Partial<Omit<CreateRequisitoMatriculacion, "periodoId">>;
};

export const baseRequisitoMatriculacionSchema = z
	.object<
		ZodInferSchema<
			Omit<
				RequisitoMatriculacionFromAPI,
				"sede" | "programa" | "modalidad" | "tipoDocumento"
			>
		>
	>({
		id: z.string(),
		obligatorio: z.boolean(),
		transferenciaIES: z.boolean(),
		primeraMatricula: z.boolean(),
		repitenMaterias: z.boolean(),
		descripcion: z.string().nullable(),
		nivel: z.number().nullable(),
		nombre: z.string(),

		modalidadId: z.string().uuid().nullable(),
		periodoId: z.string().uuid(),
		programaId: z.string().uuid().nullable(),
		sedeId: z.string().uuid(),
		tipoDocumentoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const requisitoMatriculacionSchema = baseRequisitoMatriculacionSchema
	.extend<
		ZodInferSchema<
			Pick<
				RequisitoMatriculacionFromAPI,
				"sede" | "programa" | "modalidad" | "tipoDocumento"
			>
		>
	>({
		sede: sedeSchema.omit({ enUso: true }),
		programa: programaSchema
			.omit({
				enUso: true,
				nivelTitulacion: true,
				detalleNivelTitulacion: true,
			})
			.nullable(),
		modalidad: modalidadSchema.omit({ enUso: true }).nullable(),
		tipoDocumento: tipoDocumentoSchema.omit({ enUso: true }),
	})
	.strict();

export class RequisitoMatriculacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateRequisitoMatriculacionParams): Promise<
		APIResponse<RequisitoMatriculacionFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: requisitoMatriculacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/requisitos-matriculacion/${id}`,
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

	// async create(data: CreateRequisitoMatriculacion): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(this.apiUrl + `/api/requisitos-matriculacion`, {
	// 		method: "POST",
	// 		headers: {
	// 			"Context-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(data),
	// 	});

	// 	if (!res.ok) {
	// 		const json = (await res.json()) as APIResponse<undefined>;
	// 		throw new APIError(json.message);
	// 	}

	// 	return res.json();
	// }

	async getMany(
		_: void,
	): Promise<APIResponse<RequisitoMatriculacionFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: requisitoMatriculacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/requisitos-matriculacion`,
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<RequisitoMatriculacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: requisitoMatriculacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/requisitos-matriculacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/requisitos-matriculacion/${id}`,
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
