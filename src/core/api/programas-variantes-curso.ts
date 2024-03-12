import type { ProgramaEnVarianteCurso } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type ProgramaEnVarianteCursoFromAPI =
	ReplaceDateToString<ProgramaEnVarianteCurso>;

type UpdateProgramaEnVarianteCursoParams = {
	id: string;
	data: Partial<Omit<CreateProgramaEnVarianteCurso, "varianteCursoId">>;
};

export type CreateProgramaEnVarianteCurso = Omit<
	ProgramaEnVarianteCursoFromAPI,
	"id" | "createdAt" | "updatedAt"
>;

export const programaEnVarianteCursoSchema = z
	.object<ZodInferSchema<ProgramaEnVarianteCursoFromAPI>>({
		id: z.string().uuid(),
		programaId: z.string().uuid(),
		varianteCursoId: z.string().uuid(),
		mallaId: z.string().uuid().nullable(),
		modalidadId: z.string().uuid().nullable(),
		registroExterno: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class ProgramaEnVarianteCursoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateProgramaEnVarianteCursoParams): Promise<
		APIResponse<ProgramaEnVarianteCursoFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: programaEnVarianteCursoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/programas-variantes-curso/${id}`,
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
	// 		ProgramaEnVarianteCursoFromAPI,
	// 		"enUso" | "createdAt" | "updatedAt" | "id"
	// 	>,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(
	// 		this.apiUrl + `/api/programas-variantes-curso`,
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				"Context-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(data),
	// 		},
	// 	);

	// 	if (!res.ok) {
	// 		const json = (await res.json()) as APIResponse<unknown>;
	// 		throw new APIError(json.message);
	// 	}

	// 	return res.json();
	// }

	// async getMany(
	// 	_: void,
	// ): Promise<APIResponse<ProgramaEnVarianteCursoFromAPI[]>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: programaEnVProgramaEnVarianteCursoSchema.array(),
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + "/api/programas-variantes-curso",
	// 	);

	// 	return res;
	// }

	async getById(
		id: string,
	): Promise<APIResponse<ProgramaEnVarianteCursoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: programaEnVarianteCursoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/programas-variantes-curso/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/programas-variantes-curso/${id}`,
			{
				method: "DELETE",
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
