import type { Administrativo, AsesorEstudiante } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	administrativoSchema,
	baseUsuarioSchema,
	type UsuarioFromAPI,
} from "./usuarios";

export type AsesorEstudianteFromAPI = ReplaceDateToString<
	AsesorEstudiante & {
		administrativo: Administrativo & {
			usuario: Omit<
				UsuarioFromAPI,
				"administrativo" | "profesor" | "alumno" | "grupos"
			>;
		};
		estudiantesCount: number;
	}
>;

type ExtraFields = "administrativo" | "estudiantesCount";

type UpdateAsesorEstudianteParams = {
	id: string;
	data: Partial<Omit<CreateAsesorEstudiante, "administrativoId">>;
};

export type CreateAsesorEstudiante = Omit<
	AsesorEstudianteFromAPI,
	| "id"
	| "administrativo"
	| "estudiantesCount"
	| "createdAt"
	| "updatedAt"
	| "estado"
>;

export const baseAsesorEstudianteSchema = z
	.object<ZodInferSchema<Omit<AsesorEstudianteFromAPI, ExtraFields>>>({
		id: z.string().uuid(),
		administrativoId: z.string().uuid(),
		estado: z.boolean(),
		seguimientoBienestar: z.boolean(),
		seguimientoExpediente: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const asesorEstudianteSchema = baseAsesorEstudianteSchema
	.extend<ZodInferSchema<Pick<AsesorEstudianteFromAPI, ExtraFields>>>({
		administrativo: z.lazy(() =>
			administrativoSchema
				.omit({
					sede: true,
					asesorCrm: true,
					asesorEstudiante: true,
					responsableCrm: true,
				})
				.extend({
					usuario: baseUsuarioSchema,
				}),
		),
		estudiantesCount: z.number(),
	})
	.strict();

export class AsesorEstudianteClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateAsesorEstudianteParams): Promise<
		APIResponse<AsesorEstudianteFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: asesorEstudianteSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/asesores-estudiante/${id}`,
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
	// 		AsesorEstudianteFromAPI,
	// 		"enUso" | "createdAt" | "updatedAt" | "id"
	// 	>,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(this.apiUrl + `/api/asesores-estudiante`, {
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

	async getMany(_: void): Promise<APIResponse<AsesorEstudianteFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: asesorEstudianteSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/asesores-estudiante",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<AsesorEstudianteFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: asesorEstudianteSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/asesores-estudiante/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/asesores-estudiante/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
