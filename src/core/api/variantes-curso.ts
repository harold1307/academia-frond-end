import type { AsignaturaEnVarianteCurso, VarianteCurso } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import { asignaturaSchema, type AsignaturaFromAPI } from "./asignaturas";

export type VarianteCursoFromAPI = ReplaceDateToString<VarianteCurso>;

export type AsignaturaEnVarianteCursoFromAPI = ReplaceDateToString<
	AsignaturaEnVarianteCurso & {
		asignatura: AsignaturaFromAPI;
	}
>;

export type VarianteCursoWithAsignaturasFromAPI = VarianteCursoFromAPI & {
	asignaturas: AsignaturaEnVarianteCursoFromAPI[];
};

export type CreateAsignaturaEnVarianteCurso = Omit<
	AsignaturaEnVarianteCursoFromAPI,
	"id" | "createdAt" | "updatedAt" | "asignatura"
>;

type UpdateVarianteCursoParams = {
	varianteCursoId: string;
	data: Partial<
		Omit<
			VarianteCursoFromAPI,
			"id" | "createdAt" | "updatedAt" | "cursoId" | "varianteCursoId"
		>
	>;
};

export type CreateAsignaturaEnVarianteCursoParams = {
	asignaturaId: string;
	varianteCursoId: string;
	data: Omit<
		CreateAsignaturaEnVarianteCurso,
		"asignaturaId" | "varianteCursoId"
	>;
};

export const varianteCursoSchema = z
	.object<ZodInferSchema<VarianteCursoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		estado: z.boolean(),
		codigoBase: z.string(),
		descripcion: z.string(),
		registroExterno: z.boolean(),
		registroInterno: z.boolean(),
		verificaSesion: z.boolean(),
		edadMinima: z.number().nullable(),
		edadMaxima: z.number().nullable(),
		fechaAprobacion: z.string().datetime(),
		registroDesdeOtraSede: z.boolean(),
		costoPorMateria: z.boolean(),
		cumpleRequisitosMalla: z.boolean(),
		pasarRecord: z.boolean(),
		costoPorCantidadMateria: z.boolean(),

		cursoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const asignaturaVarianteCursoSchema = z.object<
	ZodInferSchema<AsignaturaEnVarianteCursoFromAPI>
>({
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
	asistenciaAprobar: z.number().nullable(),
	cantidadDecimales: z.number().nullable(),
	notaMaxima: z.number().nullable(),
	notaMinima: z.number().nullable(),

	asignaturaId: z.string(),
	varianteCursoId: z.string(),
	modeloEvaluativoId: z.string().uuid().nullable(),
	asignatura: asignaturaSchema,

	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

const varianteCursoWithAsignaturasSchema = varianteCursoSchema
	.extend({
		asignaturas: asignaturaVarianteCursoSchema.array(),
	})
	.strict();

export class VarianteCursoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		varianteCursoId,
		data,
	}: UpdateVarianteCursoParams): Promise<APIResponse<VarianteCursoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: varianteCursoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/variantes-curso/${varianteCursoId}`,
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

	async createAsignaturaEnVarianteCurso({
		asignaturaId,
		data,
		varianteCursoId,
	}: CreateAsignaturaEnVarianteCursoParams) {
		const res = await fetch(
			this.apiUrl +
				`/api/variantes-curso/${varianteCursoId}/asignaturas/${asignaturaId}`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async getByIdWithAsignaturas(
		id: string,
	): Promise<APIResponse<VarianteCursoWithAsignaturasFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: varianteCursoWithAsignaturasSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/variantes-curso/${id}/asignaturas`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/variantes-curso/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
