import type { ProgramaEnCursoEscuela } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type ProgramaEnCursoEscuelaFromAPI =
	ReplaceDateToString<ProgramaEnCursoEscuela>;

type UpdateProgramaEnCursoEscuelaParams = {
	id: string;
	data: Partial<Omit<CreateProgramaEnCursoEscuela, "cursoEscuelaId">>;
};

export type CreateProgramaEnCursoEscuela = Omit<
	ProgramaEnCursoEscuelaFromAPI,
	"id" | "createdAt" | "updatedAt"
>;

export const programaEnCursoEscuelaSchema = z
	.object<ZodInferSchema<ProgramaEnCursoEscuelaFromAPI>>({
		id: z.string().uuid(),
		programaId: z.string().uuid(),
		cursoEscuelaId: z.string().uuid(),
		mallaId: z.string().uuid().nullable(),
		modalidadId: z.string().uuid().nullable(),
		registroExterno: z.boolean(),
		nivelDesde: z.number().nullable(),
		nivelHasta: z.number().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class ProgramaEnCursoEscuelaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateProgramaEnCursoEscuelaParams): Promise<
		APIResponse<ProgramaEnCursoEscuelaFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: programaEnCursoEscuelaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/programas-cursos-escuela/${id}`,
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
	// 		ProgramaEnCursoEscuelaFromAPI,
	// 		"enUso" | "createdAt" | "updatedAt" | "id"
	// 	>,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(
	// 		this.apiUrl + `/api/programas-cursos-escuela`,
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
	// ): Promise<APIResponse<ProgramaEnCursoEscuelaFromAPI[]>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: programacProgramaEnCursoEscuelaSchema.array(),
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + "/api/programas-cursos-escuela",
	// 	);

	// 	return res;
	// }

	async getById(
		id: string,
	): Promise<APIResponse<ProgramaEnCursoEscuelaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: programaEnCursoEscuelaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/programas-cursos-escuela/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/programas-cursos-escuela/${id}`,
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
