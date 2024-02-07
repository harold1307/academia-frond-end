import type { Curso } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	varianteCursoSchema,
	type VarianteCursoFromAPI,
} from "./variantes-curso";

export type CursoFromAPI = ReplaceDateToString<
	Curso & {
		variantesCount: number;
	}
>;

export type CursoWithVariantes = CursoFromAPI & {
	variantes: VarianteCursoFromAPI[];
};

export type CreateVarianteCurso = Omit<
	VarianteCursoFromAPI,
	"cursoId" | "id" | "fechaAprobacion" | "estado" | "createdAt" | "updatedAt"
> & {
	fechaAprobacion: string | Date;
};
export type CreateCurso = Omit<
	CursoFromAPI,
	"id" | "estado" | "createdAt" | "updatedAt" | "variantesCount"
>;

const cursoSchema = z
	.object<ZodInferSchema<CursoFromAPI>>({
		id: z.string().uuid(),
		estado: z.boolean(),
		nombre: z.string(),
		variantesCount: z.number(),

		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.strict();

const schemaWithVariantes = cursoSchema
	.extend({
		variantes: varianteCursoSchema.array(),
	})
	.strict();

export class CursoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<CursoFromAPI, "id" | "createdAt" | "updatedAt" | "variantesCount">
		>;
	}): Promise<APIResponse<CursoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: cursoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/cursos/${params.id}`,
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

	async create(data: CreateCurso): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/cursos`, {
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

	async getMany(_: void): Promise<APIResponse<CursoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: cursoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/cursos`,
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<CursoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: cursoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/cursos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/cursos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async getCursoWithVariantesByCursoId(
		cursoId: string,
	): Promise<APIResponse<CursoWithVariantes>> {
		const res = this.fetcher(
			z.object({
				data: schemaWithVariantes,
				message: z.string(),
			}),
			this.apiUrl + `/api/cursos/${cursoId}/variantes`,
		);

		return res;
	}

	async createVarianteCurso(
		cursoId: string,
		variante: CreateVarianteCurso,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/cursos/${cursoId}/variantes`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(variante),
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
