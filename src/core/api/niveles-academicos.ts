import type { NivelAcademico } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type {
	NonNullableObject,
	ReplaceDateToString,
	ZodInferSchema,
} from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import type { CreateMateriaEnHorario } from "./materias-horario";
import {
	materiaEnNivelAcademicoSchema,
	type CreateMateriaEnNivelAcademico,
	type MateriaEnNivelAcademicoFromAPI,
} from "./materias-niveles-academicos";
import { baseNivelMallaSchema, type NivelMallaFromAPI } from "./niveles-malla";
import { sesionSchema, type SesionFromAPI } from "./sesiones";
// import type { CreateAsignaturaEnNivelAcademico } from "./asignaturas-niveles-academicos";

export type NivelAcademicoFromAPI = ReplaceDateToString<
	NivelAcademico & {
		sesion: SesionFromAPI;
		nivelMalla: Omit<NivelMallaFromAPI, "enUso" | "malla">;
	}
>;

export type NivelAcademicoWithMateriasFromAPI = NivelAcademicoFromAPI & {
	materias: MateriaEnNivelAcademicoFromAPI[];
};

type UpdateNivelAcademicoParams = {
	id: string;
	data: Partial<
		Omit<
			NivelAcademicoFromAPI,
			| "id"
			| "nivel"
			| "mallaId"
			| "createdAt"
			| "updatedAt"
			| "enUso"
			| "malla"
			| ExtraFields
		>
	>;
};

type NivelAcademicoFilters = Partial<
	NonNullableObject<
		Omit<
			NivelAcademicoFromAPI,
			"sesion" | "id" | "createdAt" | "updatedAt" | ExtraFields
		> & {
			mallaId: string;
			programaId: string;
		}
	>
>;

type GetManyParams = {
	filters?: NivelAcademicoFilters;
};

export type CreateNivelAcademico = Omit<
	NivelAcademicoFromAPI,
	| "profesores"
	| "horarios"
	| "cuposMaterias"
	| "planificacionProfesores"
	| "matriculacion"
	| "estado"
	| "createdAt"
	| "updatedAt"
	| "id"
	| "sesion"
	| ExtraFields
>;

type ExtraFields = "sesion" | "nivelMalla";

export const baseNivelAcademicoSchema = z.object<
	ZodInferSchema<Omit<NivelAcademicoFromAPI, ExtraFields>>
>({
	id: z.string().uuid(),
	nombre: z.string().nullable(),
	estado: z.boolean(),
	horarios: z.boolean(),
	matriculacion: z.boolean(),
	profesores: z.boolean(),
	planificacionProfesores: z.boolean(),
	cuposMaterias: z.boolean(),

	fechaInicio: z.string().datetime(),
	fechaFin: z.string().datetime(),
	inicioAgregaciones: z.string().datetime(),
	limiteAgregaciones: z.string().datetime(),
	validaRequisitosMalla: z.boolean(),
	validaCumplimientoMaterias: z.boolean(),
	horasMinimasPracticasComunitarias: z.number().nullable(),
	horasMinimasPracticasPreprofesionales: z.number().nullable(),
	estudiantesPuedenSeleccionarMaterias: z.boolean(),
	estudiantesPuedenSeleccionarMateriasOtrosHorarios: z.boolean(),
	estudiantesPuedenSeleccionarMateriasOtrasModalidades: z.boolean(),
	estudiantesRegistranProyectosIntegradores: z.boolean(),
	redireccionAPagos: z.boolean(),
	limiteOrdinaria: z.string().datetime(),
	limiteExtraordinaria: z.string().datetime(),
	limiteEspecial: z.string().datetime(),
	diasVencimientoMatricula: z.number(),
	capacidad: z.number().int().min(0),
	mensaje: z.string().nullable(),
	terminosCondiciones: z.string().nullable(),

	paraleloId: z.string(),
	modeloEvaluativoId: z.string().uuid(),
	sesionId: z.string().uuid(),
	nivelMallaId: z.string().uuid(),
	periodoId: z.string().uuid(),

	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const nivelAcademicoSchema = baseNivelAcademicoSchema
	.extend<ZodInferSchema<Pick<NivelAcademicoFromAPI, ExtraFields>>>({
		sesion: sesionSchema,
		nivelMalla: baseNivelMallaSchema,
	})
	.strict();

export const nivelAcademicoWithMateriasSchema = baseNivelAcademicoSchema.extend<
	ZodInferSchema<
		Pick<NivelAcademicoWithMateriasFromAPI, ExtraFields | "materias">
	>
>({
	sesion: sesionSchema,
	nivelMalla: baseNivelMallaSchema,
	materias: materiaEnNivelAcademicoSchema.array(),
});

export class NivelAcademicoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(
		params: UpdateNivelAcademicoParams,
	): Promise<APIResponse<NivelAcademicoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: nivelAcademicoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-academicos/${params.id}`,
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
		params?: GetManyParams,
	): Promise<APIResponse<NivelAcademicoFromAPI[]>> {
		const searchParams = new URLSearchParams();

		Object.entries(params?.filters || {}).forEach(([k, v]) => {
			if (v !== undefined) {
				searchParams.set(k, `${v}`);
			}
		});

		const res = this.fetcher(
			z.object({
				data: nivelAcademicoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-academicos?${searchParams.toString()}`,
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<NivelAcademicoFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: nivelAcademicoSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-academicos/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/niveles-academicos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async createMaterias({
		nivelAcademicoId,
		data,
	}: CreateMateriasParams): Promise<APIResponse<number | undefined>> {
		const res = await fetch(
			this.apiUrl + `/api/niveles-academicos/${nivelAcademicoId}/materias`,
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
	async getByIdWithMaterias(
		id: string,
	): Promise<APIResponse<NivelAcademicoWithMateriasFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: nivelAcademicoWithMateriasSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-academicos/${id}/materias`,
		);

		return res;
	}

	async createMateriaEnHorario({
		nivelAcademicoId,
		materiaId,
		data,
	}: CreateMateriaEnHorarioParams): Promise<APIResponse<number | undefined>> {
		const res = await fetch(
			this.apiUrl +
				`/api/niveles-academicos/${nivelAcademicoId}/materias/${materiaId}`,
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

type CreateMateriaEnHorarioParams = {
	nivelAcademicoId: string;
	materiaId: string;
	data: Omit<CreateMateriaEnHorario, "nivelAcademicoId" | "materiaId">;
};

type CreateMateriasParams = {
	nivelAcademicoId: string;
	data: CreateMateriaEnNivelAcademico;
};
