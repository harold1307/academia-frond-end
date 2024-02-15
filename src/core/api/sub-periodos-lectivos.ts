import type { SubPeriodoLectivo } from "@prisma/client";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { z } from "zod";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type SubPeriodoLectivoFromAPI = ReplaceDateToString<SubPeriodoLectivo>;

export type CreateSubPeriodoLectivo = Omit<
	SubPeriodoLectivoFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt"
>;

type UpdateSubPeriodoLectivoParams = {
	id: string;
	data: Partial<Omit<CreateSubPeriodoLectivo, "periodoId">>;
};

const subPerioSubPeriodoLectivoSchema = z
	.object<ZodInferSchema<SubPeriodoLectivoFromAPI>>({
		id: z.string(),
		nombre: z.string(),
		fechaFin: z.string().datetime(),
		fechaInicio: z.string().datetime(),
		periodoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class SubPeriodoLectivoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateSubPeriodoLectivoParams): Promise<
		APIResponse<SubPeriodoLectivoFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: subPerioSubPeriodoLectivoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/sub-periodos-lectivos/${id}`,
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

	// async create(data: CreateSubPeriodoLectivo): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(this.apiUrl + `/api/sub-periodos-lectivos`, {
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

	async getMany(_: void): Promise<APIResponse<SubPeriodoLectivoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: subPerioSubPeriodoLectivoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/sub-periodos-lectivos`,
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<SubPeriodoLectivoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: subPerioSubPeriodoLectivoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/sub-periodos-lectivos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/sub-periodos-lectivos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
