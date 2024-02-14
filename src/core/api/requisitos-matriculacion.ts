import type { RequisitoMatriculacion } from "@prisma/client";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { z } from "zod";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type RequisitoMatriculacionFromAPI =
	ReplaceDateToString<RequisitoMatriculacion>;

export type CreateRequisitoMatriculacion = Omit<
	RequisitoMatriculacionFromAPI,
	"id" | "createdAt" | "updatedAt"
>;

type UpdateRequisitoMatriculacionParams = {
	id: string;
	data: Partial<Omit<CreateRequisitoMatriculacion, "periodoId">>;
};

const requisitoMatriculacionSchema = z
	.object<ZodInferSchema<RequisitoMatriculacionFromAPI>>({
		id: z.string(),
		obligatorio: z.boolean(),
		transferenciaIES: z.boolean(),
		primeraMatricula: z.boolean(),
		repitenMaterias: z.boolean(),
		descripcion: z.string().nullable(),

		nivelId: z.string().uuid(),
		periodoId: z.string().uuid(),
		tipoDocumentoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class RequisitoMatriculacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateRequisitoMatriculacionParams): Promise<
		APIResponse<RequisitoMatriculacionFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: requisitoMatriculacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/requisitos-matriculacion/${id}`,
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

	// async create(data: CreateRequisitoMatriculacion): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(this.apiUrl + `/api/requisitos-matriculacion`, {
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

	async getMany(
		_: void,
	): Promise<APIResponse<RequisitoMatriculacionFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: requisitoMatriculacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/requisitos-matriculacion`,
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<RequisitoMatriculacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: requisitoMatriculacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/requisitos-matriculacion/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/requisitos-matriculacion/${id}`,
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
