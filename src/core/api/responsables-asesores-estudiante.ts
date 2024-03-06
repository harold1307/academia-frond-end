import type {
	Administrativo,
	ResponsableAsesorEstudiante,
	ResponsableEnAsesorEstudiante,
} from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	asesorEstudianteSchema,
	type AsesorEstudianteFromAPI,
} from "./asesores-estudiante";
import {
	administrativoSchema,
	baseUsuarioSchema,
	type UsuarioFromAPI,
} from "./usuarios";

export type ResponsableEnAsesorEstudianteFromAPI =
	ReplaceDateToString<ResponsableEnAsesorEstudiante>;

const baseResponsableEnAsesorEstudianteSchema = z.object<
	ZodInferSchema<ResponsableEnAsesorEstudianteFromAPI>
>({
	id: z.string().uuid(),
	asesorEstudianteId: z.string().uuid(),
	responsableId: z.string().uuid(),

	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export type ResponsableAsesorEstudianteFromAPI = ReplaceDateToString<
	ResponsableAsesorEstudiante & {
		administrativo: ReplaceDateToString<Administrativo> & {
			usuario: Omit<
				UsuarioFromAPI,
				"administrativo" | "profesor" | "alumno" | "grupos"
			>;
		};
		asesoresCount: number;
	}
>;
export type ResponsableAsesorEstudianteWithAsesoresFromAPI =
	ReplaceDateToString<
		ResponsableAsesorEstudiante & {
			administrativo: ReplaceDateToString<Administrativo> & {
				usuario: Omit<
					UsuarioFromAPI,
					"administrativo" | "profesor" | "alumno" | "grupos"
				>;
			};
			asesoresCount: number;
			asesores: (ResponsableEnAsesorEstudianteFromAPI & {
				asesorEstudiante: AsesorEstudianteFromAPI;
			})[];
		}
	>;

type ExtraFields = "administrativo" | "asesoresCount" | "asesores";

type UpdateResponsableAsesorEstudianteParams = {
	id: string;
	data: Partial<CreateResponsableAsesorEstudiante>;
};

export type CreateResponsableAsesorEstudiante = Omit<
	ResponsableAsesorEstudianteFromAPI,
	"enUso" | "createdAt" | "updatedAt" | "id"
>;

export const baseResponsableAsesorEstudianteSchema = z
	.object<
		ZodInferSchema<Omit<ResponsableAsesorEstudianteFromAPI, ExtraFields>>
	>({
		id: z.string().uuid(),
		administrativoId: z.string().uuid(),
		seguimientoBienestar: z.boolean(),
		seguimientoExpediente: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const responsableAsesorEstudianteSchema =
	baseResponsableAsesorEstudianteSchema.extend<
		ZodInferSchema<
			Pick<ResponsableAsesorEstudianteFromAPI, Exclude<ExtraFields, "asesores">>
		>
	>({
		asesoresCount: z.number(),
		administrativo: z.lazy(() =>
			administrativoSchema
				.omit({
					sede: true,
					asesorCrm: true,
					asesorEstudiante: true,
					responsableCrm: true,
					responsableAsesorEstudiante: true,
				})
				.extend({
					usuario: baseUsuarioSchema,
				}),
		),
	});

export const responsableAsesorEstudianteWithAsesoresSchema =
	baseResponsableAsesorEstudianteSchema
		.extend<
			ZodInferSchema<
				Pick<ResponsableAsesorEstudianteWithAsesoresFromAPI, ExtraFields>
			>
		>({
			asesoresCount: z.number(),
			administrativo: z.lazy(() =>
				administrativoSchema
					.omit({
						sede: true,
						asesorCrm: true,
						asesorEstudiante: true,
						responsableCrm: true,
						responsableAsesorEstudiante: true,
					})
					.extend({
						usuario: baseUsuarioSchema,
					}),
			),
			asesores: baseResponsableEnAsesorEstudianteSchema
				.extend({
					asesorEstudiante: asesorEstudianteSchema,
				})
				.array(),
		})
		.strict();

export class ResponsableAsesorEstudianteClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	// async update({
	// 	data,
	// 	id,
	// }: UpdateResponsableAsesorEstudianteParams): Promise<
	// 	APIResponse<ResponsableAsesorEstudianteFromAPI>
	// > {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: responsableAsesorEstudianteSchema,
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + `/api/responsables-asesores-estudiante/${id}`,
	// 		{
	// 			method: "PATCH",
	// 			headers: {
	// 				"Context-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(data),
	// 		},
	// 	);

	// 	return res;
	// }

	// async create(
	// 	data: Omit<
	// 		ResponsableAsesorEstudianteFromAPI,
	// 		"enUso" | "createdAt" | "updatedAt" | "id"
	// 	>,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(
	// 		this.apiUrl + `/api/responsables-asesores-estudiante`,
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

	async getMany(
		_: void,
	): Promise<APIResponse<ResponsableAsesorEstudianteFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: responsableAsesorEstudianteSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/responsables-asesores-estudiante",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<ResponsableAsesorEstudianteFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: responsableAsesorEstudianteSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/responsables-asesores-estudiante/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/responsables-asesores-estudiante/${id}`,
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

	async createAsesorRelation({
		asesorEstudianteId,
		responsableAsesorEstudianteId,
	}: CreateAsesorRelationParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/responsables-asesores-estudiante/${responsableAsesorEstudianteId}/asesores/${asesorEstudianteId}`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async deleteAsesorRelation({
		responsableEnAsesorEstudianteId,
	}: DeleteAsesorRelationParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/responsables-en-asesores-estudiantes/${responsableEnAsesorEstudianteId}`,
			{
				method: "DELETE",
				headers: {
					"Context-Type": "application/json",
				},
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async getByIdWithAsesores(
		id: string,
	): Promise<
		APIResponse<ResponsableAsesorEstudianteWithAsesoresFromAPI | null>
	> {
		const res = this.fetcher(
			z.object({
				data: responsableAsesorEstudianteWithAsesoresSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/responsables-asesores-estudiante/${id}/asesores`,
		);

		return res;
	}
}

type CreateAsesorRelationParams = {
	responsableAsesorEstudianteId: string;
	asesorEstudianteId: string;
};
type DeleteAsesorRelationParams = {
	responsableEnAsesorEstudianteId: string;
};
