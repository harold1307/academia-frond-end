import type { AsignaturaEnVarianteCurso } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import { asignaturaSchema, type AsignaturaFromAPI } from "./asignaturas";

export type AsignaturaEnVarianteCursoFromAPI = ReplaceDateToString<
	AsignaturaEnVarianteCurso & {
		asignatura: AsignaturaFromAPI;
	}
>;

export type CreateAsignaturaEnVarianteCurso = Omit<
	AsignaturaEnVarianteCursoFromAPI,
	"id" | "createdAt" | "updatedAt" | "asignatura"
>;

type UpdateAsignaturaEnVarianteCursoParams = {
	id: string;
	data: Partial<Omit<CreateAsignaturaEnVarianteCurso, "varianteCursoId">>;
};

export const baseAsignaturaEnVarianteCursoSchema = z
	.object<ZodInferSchema<Omit<AsignaturaEnVarianteCursoFromAPI, "asignatura">>>(
		{
			id: z.string().uuid(),

			validaCredito: z.boolean(),
			validaPromedio: z.boolean(),
			horasColaborativas: z.number(),
			horasAsistidasDocente: z.number(),
			horasAutonomas: z.number(),
			horasPracticas: z.number(),
			sumaHoras: z.boolean(),
			creditos: z.number(),
			requeridoAprobar: z.boolean(),
			asignaturaId: z.string(),
			varianteCursoId: z.string(),

			modeloEvaluativoId: z.string().nullable(),
			asistenciaAprobar: z.number().nullable(),
			cantidadDecimales: z.number().int().nullable(),
			notaMaxima: z.number().nullable(),
			notaMinima: z.number().nullable(),
			createdAt: z.string().datetime(),
			updatedAt: z.string().datetime(),
		},
	)
	.strict();

export const asignaturaEnVarianteCursoSchema =
	baseAsignaturaEnVarianteCursoSchema.extend<
		ZodInferSchema<Pick<AsignaturaEnVarianteCursoFromAPI, "asignatura">>
	>({
		asignatura: asignaturaSchema,
	});

export class AsignaturaEnVarianteCursoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(
		params: UpdateAsignaturaEnVarianteCursoParams,
	): Promise<APIResponse<AsignaturaEnVarianteCursoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: asignaturaEnVarianteCursoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/asignaturas-variantes-curso/${params.id}`,
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

	// async create(
	// 	data: CreateAsignaturaEnVarianteCurso,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(
	// 		this.apiUrl + `/api/asignaturas-variantes-curso`,
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				"Context-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(data),
	// 		},
	// 	);

	// 	if (!res.ok) {
	// 		const json = (await res.json()) as APIResponse<undefined>;

	// 		throw new APIError(json.message);
	// 	}

	// 	return res.json();
	// }

	// async getMany(
	// 	_: void,
	// ): Promise<APIResponse<AsignaturaEnVarianteCursoFromAPI[]>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: asignaturaEnVarianteCursoSchema.array(),
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + "/api/asignaturas-variantes-curso",
	// 	);

	// 	return res;
	// }

	// async getById(
	// 	id: string,
	// ): Promise<APIResponse<AsignaturaEnVarianteCursoFromAPI | null>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: asignaturaEnVarianteCursoSchema.nullable(),
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + `/api/asignaturas-variantes-curso/${id}`,
	// 	);

	// 	return res;
	// }

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/asignaturas-variantes-curso/${id}`,
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
