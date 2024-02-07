import type { Turno } from "@prisma/client";
import { z } from "zod";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import {
	APIError,
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
} from ".";

export type TurnoFromAPI = ReplaceDateToString<
	Turno & {
		enUso: boolean;
	}
>;

export type CreateTurno = Omit<
	TurnoFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt" | "estado"
>;

type UpdateTurnoParams = {
	id: string;
	data: Partial<
		Omit<CreateTurno, "sesionId"> & {
			estado: boolean;
		}
	>;
};

export const turnoSchema = z
	.object<ZodInferSchema<TurnoFromAPI>>({
		id: z.string().uuid(),
		horas: z.number().int(),
		comienza: z.string().datetime(),
		termina: z.string().datetime(),
		sesionId: z.string().uuid(),
		enUso: z.boolean(),
		estado: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class TurnoClass {
	constructor(private apiUrl: string) {}

	async update(params: UpdateTurnoParams): Promise<APIResponse<TurnoFromAPI>> {
		const res = zodFetcher(
			z.object({
				data: turnoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/turnos/${params.id}`,
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

	async getMany(_: void): Promise<APIResponse<TurnoFromAPI[]>> {
		const res = zodFetcher(
			z.object({
				data: turnoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/turnos",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<TurnoFromAPI | null>> {
		const res = zodFetcher(
			z.object({
				data: turnoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/turnos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/turnos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
