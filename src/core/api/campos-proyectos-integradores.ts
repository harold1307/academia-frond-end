import type { CampoProyectoIntegrador } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type CampoProyectoIntegradorFromAPI =
	ReplaceDateToString<CampoProyectoIntegrador>;

export type CreateCampoProyectoIntegrador = Omit<
	CampoProyectoIntegradorFromAPI,
	"id" | "createdAt" | "updatedAt"
>;

const schema = z
	.object<ZodInferSchema<CampoProyectoIntegradorFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		codigo: z.string(),
		ordenActa: z.number(),
		notaMaxima: z.number(),
		notaMinima: z.number(),
		decimales: z.number(),
		campoDependiente: z.boolean(),
		actualizaEstado: z.boolean(),
		determinaEstadoFinal: z.boolean(),
		observaciones: z.string().nullable(),
		proyectoIntegradorId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class CampoProyectoIntegradorClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<
				CampoProyectoIntegradorFromAPI,
				"id" | "enUso" | "createdAt" | "updatedAt" | "modeloEvaluativoId"
			>
		>;
	}): Promise<APIResponse<CampoProyectoIntegradorFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: schema,
				message: z.string(),
			}),
			this.apiUrl + `/api/campos-proyectos-integradores/${params.id}`,
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

	async getMany(
		_: void,
	): Promise<APIResponse<CampoProyectoIntegradorFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/campos-proyectos-integradores",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<CampoProyectoIntegradorFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/campos-proyectos-integradores/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/campos-proyectos-integradores/${id}`,
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
