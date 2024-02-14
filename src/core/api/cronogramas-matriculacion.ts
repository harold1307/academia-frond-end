import type { CronogramaMatriculacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type CronogramaMatriculacionFromAPI =
	ReplaceDateToString<CronogramaMatriculacion>;

export type CreateCronogramaMatriculacion = Omit<
	CronogramaMatriculacionFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt"
>;

type UpdateCronogramaMatriculacionParams = {
	id: string;
	data: Omit<CreateCronogramaMatriculacion, "periodoId" | "nivelId">;
};

export const cronogramaMatriculacionSchema = z
	.object<ZodInferSchema<CronogramaMatriculacionFromAPI>>({
		id: z.string(),
		fechaFin: z.string().datetime(),
		fechaInicio: z.string().datetime(),
		nivelId: z.string().uuid(),
		periodoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
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
