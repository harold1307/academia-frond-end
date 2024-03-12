import type { Turno } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import { sedeSchema } from "./sede";
import { baseSesionSchema, type SesionFromAPI } from "./sesiones";

export type TurnoFromAPI = ReplaceDateToString<
	Turno & {
		enUso: boolean;
		sesion: Omit<SesionFromAPI, "turnos">;
	}
>;

export type CreateTurno = Omit<
	TurnoFromAPI,
	"id" | "enUso" | "createdAt" | "updatedAt" | "estado" | "sesion"
>;

type UpdateTurnoParams = {
	id: string;
	data: Partial<
		Omit<CreateTurno, "sesionId" | "sesion"> & {
			estado: boolean;
		}
	>;
};

export const baseTurnoSchema = z
	.object<ZodInferSchema<Omit<TurnoFromAPI, "sesion">>>({
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

export const turnoSchema = baseTurnoSchema.extend<
	ZodInferSchema<Pick<TurnoFromAPI, "sesion">>
>({
	sesion: z.lazy(() =>
		baseSesionSchema.extend({
			sede: sedeSchema,
		}),
	),
});

export class TurnoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: UpdateTurnoParams): Promise<APIResponse<TurnoFromAPI>> {
		const res = this.fetcher(
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
		const res = this.fetcher(
			z.object({
				data: turnoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/turnos",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<TurnoFromAPI | null>> {
		const res = this.fetcher(
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
