import type { AsignaturaModuloEnMalla } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	areaConocimientoSchema,
	type AreaConocimientoFromAPI,
} from "./areas-conocimiento";
import { asignaturaSchema, type AsignaturaFromAPI } from "./asignaturas";
import {
	campoFormacionSchema,
	type CampoFormacionFromAPI,
} from "./campos-formacion";

export type AsignaturaModuloEnMallaFromAPI = ReplaceDateToString<
	AsignaturaModuloEnMalla & {
		asignatura: AsignaturaFromAPI;
		areaConocimiento: AreaConocimientoFromAPI;
		campoFormacion: CampoFormacionFromAPI;
	}
>;

type UpdateAsignaturaModuloEnMallaParams = {
	id: string;
	data: Partial<
		Omit<CreateAsignaturaModuloEnMalla, "asignaturaId" | "mallaId">
	>;
};

export type CreateAsignaturaModuloEnMalla = Omit<
	AsignaturaModuloEnMallaFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "asignatura"
	| "areaConocimiento"
	| "campoFormacion"
>;

const baseAsignaturaModuloEnMallaSchema = z.object<
	ZodInferSchema<
		Omit<
			AsignaturaModuloEnMallaFromAPI,
			"asignatura" | "areaConocimiento" | "campoFormacion"
		>
	>
>({
	id: z.string().uuid(),
	tipoAsignatura: z.enum(["PRACTICA", "TEORICA", "TEORICA_PRACTICA"] as const),
	identificacion: z.string(),
	permiteMatriculacion: z.boolean(),
	validaParaCredito: z.boolean(),
	validaParaPromedio: z.boolean(),
	costoEnMatricula: z.boolean(),
	requeridaParaGraduar: z.boolean(),
	cantidadMatriculas: z.number(),
	cantidadMatriculasAutorizadas: z.number().nullable(),
	minimoCreditosRequeridos: z.number().nullable(),
	maximaCantidadHorasSemanalas: z.number(),
	horasColaborativas: z.number(),
	horasAsistidasDocente: z.number(),
	horasAutonomas: z.number(),
	horasPracticas: z.number(),
	sumaHoras: z.boolean(),
	creditos: z.number(),
	noValidaAsistencia: z.boolean(),
	materiaGeneral: z.boolean(),
	guiaPracticaMetodologiaObligatoria: z.boolean(),
	aprobarGuiaPracticaMetodologica: z.boolean(),
	competencia: z.string().nullable(),
	objetivosEspecificos: z.string().nullable(),
	descripcion: z.string().nullable(),
	resultados: z.string().nullable(),
	aporteAsignaturaAlPerfil: z.string().nullable(),
	objetivoGeneral: z.string().nullable(),

	asignaturaId: z.string().uuid(),
	areaConocimientoId: z.string().uuid(),
	campoFormacionId: z.string().uuid(),
	mallaId: z.string().uuid(),

	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const asignaturaModuloEnMallaSchema = baseAsignaturaModuloEnMallaSchema
	.extend<
		ZodInferSchema<
			Pick<
				AsignaturaModuloEnMallaFromAPI,
				"asignatura" | "areaConocimiento" | "campoFormacion"
			>
		>
	>({
		areaConocimiento: areaConocimientoSchema,
		asignatura: asignaturaSchema,
		campoFormacion: campoFormacionSchema,
	})
	.strict();

export class AsignaturaModuloEnMallaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateAsignaturaModuloEnMallaParams): Promise<
		APIResponse<AsignaturaModuloEnMallaFromAPI>
	> {
		const res = this.fetcher(
			z.object({
				data: asignaturaModuloEnMallaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/modulos-malla/${id}`,
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

	async getMany(
		_: void,
	): Promise<APIResponse<AsignaturaModuloEnMallaFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: asignaturaModuloEnMallaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/modulos-malla",
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<AsignaturaModuloEnMallaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: asignaturaModuloEnMallaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/modulos-malla/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modulos-malla/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
