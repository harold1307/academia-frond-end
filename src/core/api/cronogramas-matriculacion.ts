import type { CronogramaMatriculacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import { modalidadSchema, type ModalidadFromAPI } from "./modalidades";
import { programaSchema, type ProgramaFromAPI } from "./programas";
import { sedeSchema, type SedeFromAPI } from "./sede";

export type CronogramaMatriculacionFromAPI = ReplaceDateToString<
	CronogramaMatriculacion & {
		sede: Omit<SedeFromAPI, "enUso">;
		programa: Omit<
			ProgramaFromAPI,
			"enUso" | "nivelTitulacion" | "detalleNivelTitulacion"
		>;
		modalidad: Omit<ModalidadFromAPI, "enUso"> | null;
	}
>;

export type CreateCronogramaMatriculacion = Omit<
	CronogramaMatriculacionFromAPI,
	"id" | "createdAt" | "updatedAt" | "sede" | "programa" | "modalidad"
>;

type UpdateCronogramaMatriculacionParams = {
	id: string;
	data: Omit<
		CreateCronogramaMatriculacion,
		"periodoId" | "modalidadId" | "programaId" | "sedeId" | "nivel"
	>;
};

export const baseCronogramaMatriculacionSchema = z
	.object<
		ZodInferSchema<
			Omit<CronogramaMatriculacionFromAPI, "sede" | "programa" | "modalidad">
		>
	>({
		id: z.string(),
		fechaFin: z.string().datetime(),
		fechaInicio: z.string().datetime(),
		periodoId: z.string().uuid(),
		modalidadId: z.string().uuid().nullable(),
		programaId: z.string().uuid(),
		sedeId: z.string().uuid(),
		nivel: z.number().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const cronogramaMatriculacionSchema = baseCronogramaMatriculacionSchema
	.extend<
		ZodInferSchema<
			Pick<CronogramaMatriculacionFromAPI, "sede" | "programa" | "modalidad">
		>
	>({
		sede: sedeSchema.omit({ enUso: true }),
		programa: programaSchema.omit({
			enUso: true,
			nivelTitulacion: true,
			detalleNivelTitulacion: true,
		}),
		modalidad: modalidadSchema.omit({ enUso: true }).nullable(),
	})
	.strict();

export class CronogramaMatriculacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateCronogramaMatriculacionParams): Promise<
		APIResponse<CronogramaMatriculacionFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: cronogramaMatriculacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/cronogramas-matriculacion/${id}`,
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
	// 	data: CreateCronogramaMatriculacion,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(this.apiUrl + `/api/cronogramas-matriculacion`, {
	// 		method: "POST",
	// 		headers: {
	// 			"Context-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(data),
	// 	});

	// 	if (!res.ok) {
	// 		const json = (await res.json()) as APIResponse<undefined>;
	// 		throw new APIError(json.message);
	// 	}

	// 	return res.json();
	// }

	// async getMany(
	// 	_: void,
	// ): Promise<APIResponse<CronogramaMatriculacionFromAPI[]>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: cronogramaMatriculacionSchema.array(),
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + `/api/cronogramas-matriculacion`,
	// 	);

	// 	return res;
	// }

	async getById(
		id: string,
	): Promise<APIResponse<CronogramaMatriculacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: cronogramaMatriculacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/cronogramas-matriculacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/cronogramas-matriculacion/${id}`,
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
