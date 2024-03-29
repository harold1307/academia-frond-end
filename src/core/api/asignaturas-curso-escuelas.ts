import type { AsignaturaEnCursoEscuela } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type AsignaturaEnCursoEscuelaFromAPI =
	ReplaceDateToString<AsignaturaEnCursoEscuela>;

const schema = z
	.object<ZodInferSchema<AsignaturaEnCursoEscuelaFromAPI>>({
		id: z.string().uuid(),
		validaCredito: z.boolean(),
		validaPromedio: z.boolean(),
		horasColaborativas: z.number(),
		horasAsistidasDocente: z.number(),
		horasAutonomas: z.number(),
		horasPracticas: z.number(),
		sumaHoras: z.boolean(),
		creditos: z.number(),
		requeridoAprobar: z.boolean(),
		asistenciaAprobar: z.number().nullable(),
		asignaturaId: z.string(),
		cursoEscuelaId: z.string(),
		profesorId: z.string().nullable(),
		modeloEvaluativoId: z.string().nullable(),
		cantidadDecimales: z.number().nullable(),
		notaMaxima: z.number().nullable(),
		notaMinima: z.number().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class AsignaturaEnCursoEscuelaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: Partial<
			Omit<
				AsignaturaEnCursoEscuelaFromAPI,
				"id" | "enUso" | "createdAt" | "updatedAt"
			>
		>;
	}): Promise<APIResponse<AsignaturaEnCursoEscuelaFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: schema,
				message: z.string(),
			}),
			this.apiUrl + `/api/asignaturas-curso-escuelas/${params.id}`,
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
	): Promise<APIResponse<AsignaturaEnCursoEscuelaFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/asignaturas-curso-escuelas",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<AsignaturaEnCursoEscuelaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/asignaturas-curso-escuelas/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/asignaturas-curso-escuelas/${id}`,
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
