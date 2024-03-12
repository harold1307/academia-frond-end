import type { MateriaEnHorario } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	nivelAcademicoSchema,
	type NivelAcademicoFromAPI,
} from "./niveles-academicos";
import { turnoSchema, type TurnoFromAPI } from "./turnos";
import { ubicacionSchema, type UbicacionFromAPI } from "./ubicaciones";

export type MateriaEnHorarioFromAPI = ReplaceDateToString<
	MateriaEnHorario & {
		ubicacion: UbicacionFromAPI;
		turno: TurnoFromAPI;
		nivelAcademico: NivelAcademicoFromAPI;
	}
>;

type UpdateMateriaEnHorarioParams = {
	id: string;
	data: Partial<Omit<CreateMateriaEnHorario, "nivelAcademicoId" | "materiaId">>;
};

export type CreateMateriaEnHorario = Omit<
	MateriaEnHorarioFromAPI,
	"id" | "createdAt" | "updatedAt" | "ubicacion" | "turno" | "nivelAcademico"
>;

export const baseMateriaEnHorarioSchema = z
	.object<
		ZodInferSchema<
			Omit<MateriaEnHorarioFromAPI, "ubicacion" | "turno" | "nivelAcademico">
		>
	>({
		id: z.string().uuid(),
		dia: z.enum([
			"LUNES",
			"MARTES",
			"MIERCOLES",
			"JUEVES",
			"VIERNES",
			"SABADO",
			"DOMINGO",
		] as const),
		materiaId: z.string().uuid(),
		nivelAcademicoId: z.string().uuid(),
		turnoId: z.string().uuid(),
		ubicacionId: z.string().uuid(),
		fechaInicio: z.string().datetime(),
		fechaFin: z.string().datetime(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const materiaEnHorarioSchema = baseMateriaEnHorarioSchema.extend<
	ZodInferSchema<
		Pick<MateriaEnHorarioFromAPI, "ubicacion" | "turno" | "nivelAcademico">
	>
>({
	ubicacion: ubicacionSchema,
	turno: turnoSchema,
	nivelAcademico: nivelAcademicoSchema,
});

export class MateriaEnHorarioClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateMateriaEnHorarioParams): Promise<
		APIResponse<MateriaEnHorarioFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: materiaEnHorarioSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/materias-horario/${id}`,
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

	async getMany(_: void): Promise<APIResponse<MateriaEnHorarioFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: materiaEnHorarioSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/materias-horario",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<MateriaEnHorarioFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: materiaEnHorarioSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/materias-horario/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/materias-horario/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
