import type { ProyectoIntegrador } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";
import type { CreateCampoProyectoIntegrador } from "./campos-proyectos-integradores";

export type ProyectoIntegradorFromAPI = ReplaceDateToString<
	ProyectoIntegrador & {
		enUso: boolean;
	}
>;

export type CreateProyectoIntegrador = Omit<
	ProyectoIntegradorFromAPI,
	"id" | "enUso" | "estado" | "createdAt" | "updatedAt"
>;

type UpdateProyectoIntegradorParams = {
	proyectoIntegradorId: string;
	data: Partial<
		Omit<ProyectoIntegradorFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
	>;
};

export const proyectoProyectoIntegradorSchema = z
	.object<ZodInferSchema<ProyectoIntegradorFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		notaMaxima: z.number(),
		notaAprobatoria: z.number(),
		decimalesNotaFinal: z.number(),
		estado: z.boolean(),
		observaciones: z.string().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class ProyectoIntegradorClass {
	constructor(private apiUrl: string) {}

	async update({
		proyectoIntegradorId,
		data,
	}: UpdateProyectoIntegradorParams): Promise<
		APIResponse<ProyectoIntegradorFromAPI>
	> {
		const res = zodFetcher(
			z.object({
				data: proyectoProyectoIntegradorSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/proyectos-integradores/${proyectoIntegradorId}`,
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

	async create(data: CreateProyectoIntegrador): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/proyectos-integradores`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<ProyectoIntegradorFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: proyectoProyectoIntegradorSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/proyectos-integradores",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<ProyectoIntegradorFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: proyectoProyectoIntegradorSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/proyectos-integradores/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/proyectos-integradores/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async createCampo({
		proyectoIntegradorId,
		data,
	}: CreateCampoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/proyectos-integradores/${proyectoIntegradorId}/campos`,
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
}

type CreateCampoParams = {
	proyectoIntegradorId: string;
	data: Omit<CreateCampoProyectoIntegrador, "proyectoIntegradorId">;
};
