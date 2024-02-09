import type { Sesion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import type { CreateTurno } from "./turnos";

export type SesionFromAPI = ReplaceDateToString<
	Sesion & {
		enUso: boolean;
	}
>;

export type CreateSesion = Omit<
	SesionFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt" | "estado"
>;

type UpdateSesionParams = {
	id: string;
	data: Partial<
		Omit<SesionFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
	>;
};

export const sesionSchema = z
	.object<ZodInferSchema<SesionFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		enUso: z.boolean(),
		sedeId: z.string().uuid(),
		alias: z.string(),
		lunes: z.boolean(),
		martes: z.boolean(),
		miercoles: z.boolean(),
		jueves: z.boolean(),
		viernes: z.boolean(),
		sabado: z.boolean(),
		domingo: z.boolean(),
		estado: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class SesionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(
		params: UpdateSesionParams,
	): Promise<APIResponse<SesionFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: sesionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/sesiones/${params.id}`,
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

	async create(data: CreateSesion): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/sesiones`, {
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

	async getMany(_: void): Promise<APIResponse<SesionFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: sesionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/sesiones",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<SesionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: sesionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/sesiones/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/sesiones/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async createTurno({
		sesionId,
		data,
	}: CreateTurnoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/sesiones/${sesionId}/turnos`, {
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
}

type CreateTurnoParams = {
	sesionId: string;
	data: Omit<CreateTurno, "sesionId">;
};
