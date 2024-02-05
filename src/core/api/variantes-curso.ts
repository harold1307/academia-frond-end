import type { AsignaturaEnVarianteCurso, VarianteCurso } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type VarianteCursoFromAPI = ReplaceDateToString<VarianteCurso>;

export type AsignaturaEnVarianteCursoFromAPI =
	ReplaceDateToString<AsignaturaEnVarianteCurso>;

export type VarianteCursoWithAsignaturas = VarianteCursoFromAPI & {
	asignaturas: AsignaturaEnVarianteCursoFromAPI[];
};

export type CreateAsignaturaEnVarianteCurso = Omit<
	AsignaturaEnVarianteCursoFromAPI,
	"id" | "createdAt" | "updatedAt"
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
		verificarSesion: z.boolean(),
		edadMinima: z.number().nullable(),
		edadMaxima: z.number().nullable(),
		fechaAprobacion: z.string().uuid(),
		registroDesdeOtraSede: z.boolean(),
		costoPorMateria: z.boolean(),
		cumpleRequisitosMalla: z.boolean(),
		pasarRecord: z.boolean(),
		aprobarCursoPrevio: z.boolean(),
		cursoId: z.string().uuid(),

		createdAt: z.string().uuid(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class VarianteCursoClass {
	constructor(private apiUrl: string) {}

	async update({
		varianteCursoId,
		data,
	}: UpdateVarianteCursoParams): Promise<APIResponse<VarianteCursoFromAPI>> {
		const res = zodFetcher(
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
	): Promise<APIResponse<VarianteCursoWithAsignaturas>> {
		const res = await fetch(
			this.apiUrl + `/api/variantes-curso/${id}/asignaturas`,
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
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
