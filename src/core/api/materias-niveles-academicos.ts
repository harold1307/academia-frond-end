import type { MateriaEnNivelAcademico } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type MateriaEnNivelAcademicoFromAPI =
	ReplaceDateToString<MateriaEnNivelAcademico>;

type UpdateMateriaEnNivelAcademicoParams = {
	id: string;
	data: Partial<
		Pick<
			MateriaEnNivelAcademicoFromAPI,
			| "alias"
			| "fechaFin"
			| "fechaInicio"
			| "materiaExterna"
			| "practicasPermitidas"
			| "validaParaCreditos"
			| "validaParaPromedio"
			| "sumaHorasProfesor"
		>
	>;
};

export type CreateMateriaEnNivelAcademico = Pick<
	MateriaEnNivelAcademicoFromAPI,
	"modeloEvaluativoId" | "nivelAcademicoId"
> & {
	asignaturasMalla: string[];
	modulosMalla: string[];
};

export const materiaEnNivelMateriaEnNivelAcademicoSchema = z
	.object<ZodInferSchema<MateriaEnNivelAcademicoFromAPI>>({
		id: z.string().uuid(),
		alias: z.string().nullable(),
		asignaturaEnNivelMallaId: z.string().uuid().nullable(),
		asignaturaModuloId: z.string().uuid().nullable(),
		materiaExterna: z.boolean(),
		fechaFin: z.string().datetime(),
		fechaInicio: z.string().datetime(),
		practicasPermitidas: z.boolean(),
		validaParaCreditos: z.boolean(),
		validaParaPromedio: z.boolean(),
		sumaHorasProfesor: z.boolean(),
		modeloEvaluativoId: z.string().uuid(),
		nivelAcademicoId: z.string().uuid(),
		numero: z.number(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class MateriaEnNivelAcademicoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateMateriaEnNivelAcademicoParams): Promise<
		APIResponse<MateriaEnNivelAcademicoFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: materiaEnNivelMateriaEnNivelAcademicoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/materias-niveles-academicos/${id}`,
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
	): Promise<APIResponse<MateriaEnNivelAcademicoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: materiaEnNivelMateriaEnNivelAcademicoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/materias-niveles-academicos",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<MateriaEnNivelAcademicoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: materiaEnNivelMateriaEnNivelAcademicoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/materias-niveles-academicos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/materias-niveles-academicos/${id}`,
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
