import type { AsignaturaEnNivelMalla } from "@prisma/client";
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
import {
	ejeFormativoSchema,
	type EjeFormativoFromAPI,
} from "./ejes-formativos";

export type AsignaturaEnNivelMallaFromAPI = ReplaceDateToString<
	AsignaturaEnNivelMalla & {
		ejeFormativo: EjeFormativoFromAPI;
		areaConocimiento: AreaConocimientoFromAPI;
		campoFormacion: CampoFormacionFromAPI | null;
		asignatura: AsignaturaFromAPI;
	}
>;

type UpdateAsignaturaEnNivelMallaParams = {
	id: string;
	data: Partial<
		Omit<CreateAsignaturaEnNivelMalla, "nivelMallaId" | "asignaturaId">
	>;
};

export type CreateAsignaturaEnNivelMalla = Omit<
	AsignaturaEnNivelMallaFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "enUso"
	| "ejeFormativo"
	| "areaConocimiento"
	| "campoFormacion"
	| "asignatura"
>;

export const baseAsignaturaEnNivelMallaSchema = z.object<
	ZodInferSchema<
		Omit<
			AsignaturaEnNivelMallaFromAPI,
			"ejeFormativo" | "areaConocimiento" | "campoFormacion" | "asignatura"
		>
	>
>({
	id: z.string().uuid(),
	tipoAsignatura: z.enum(["PRACTICA", "TEORICA", "TEORICA_PRACTICA"] as const),
	identificacion: z.string(),
	permiteMatriculacion: z.boolean(),
	calculoNivel: z.boolean(),
	validaParaCredito: z.boolean(),
	validaParaPromedio: z.boolean(),
	costoEnMatricula: z.boolean(),
	requeridaParaEgresar: z.boolean(),
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
	horasProyectoIntegrador: z.number(),
	noValidaAsistencia: z.boolean(),
	materiaComun: z.boolean(),
	guiaPracticaMetodologiaObligatoria: z.boolean(),
	aprobarGuiaPracticaMetodologica: z.boolean(),
	descripcion: z.string().nullable(),
	objetivoGeneral: z.string().nullable(),
	resultadosAprendizaje: z.string().nullable(),
	aporteAsignaturaAlPerfil: z.string().nullable(),
	competenciaGenerica: z.string().nullable(),
	objetivosEspecificos: z.string().nullable(),
	observaciones: z.string().nullable(),

	ejeFormativoId: z.string().uuid(),
	nivelMallaId: z.string().uuid(),
	asignaturaId: z.string().uuid(),
	areaConocimientoId: z.string().uuid(),
	campoFormacionId: z.string().uuid().nullable(),

	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const asignaturaEnNivelMallaSchema = baseAsignaturaEnNivelMallaSchema
	.extend<
		ZodInferSchema<
			Pick<
				AsignaturaEnNivelMallaFromAPI,
				"asignatura" | "ejeFormativo" | "areaConocimiento" | "campoFormacion"
			>
		>
	>({
		asignatura: asignaturaSchema,
		ejeFormativo: ejeFormativoSchema,
		areaConocimiento: areaConocimientoSchema,
		campoFormacion: campoFormacionSchema.nullable(),
	})
	.strict();

export class AsignaturaEnNivelMallaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(
		params: UpdateAsignaturaEnNivelMallaParams,
	): Promise<APIResponse<AsignaturaEnNivelMallaFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: asignaturaEnNivelMallaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/asignaturas-niveles-malla/${params.id}`,
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

	// async getMany(
	// 	_: void,
	// ): Promise<APIResponse<AsignaturaEnNivelMallaFromAPI[]>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: asignaturaEnNivelMallaSchema.array(),
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + "/api/asignaturas-niveles-malla",
	// 	);

	// 	return res;
	// }

	async getById(
		id: string,
	): Promise<APIResponse<AsignaturaEnNivelMallaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: asignaturaEnNivelMallaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/asignaturas-niveles-malla/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/asignaturas-niveles-malla/${id}`,
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
