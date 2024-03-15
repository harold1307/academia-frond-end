import type { LugarEjecucion, MallaCurricular } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type {
	NonNullableObject,
	ReplaceDateToString,
	ZodInferSchema,
} from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	asignaturaEnNivelMallaSchema,
	type AsignaturaEnNivelMallaFromAPI,
} from "./asignaturas-niveles-malla";
import { modalidadSchema, type ModalidadFromAPI } from "./modalidades";
import {
	asignaturaModuloEnMallaSchema,
	type AsignaturaModuloEnMallaFromAPI,
	type CreateAsignaturaModuloEnMalla,
} from "./modulos-malla";
import { baseNivelMallaSchema, type NivelMallaFromAPI } from "./niveles-malla";
import { sedeSchema, type SedeFromAPI } from "./sede";
import {
	tituloObtenidoSchema,
	type TituloObtenidoFromAPI,
} from "./titulos-obtenidos";

export type LugarEjecucionFromAPI = ReplaceDateToString<
	LugarEjecucion & {
		sede: SedeFromAPI;
	}
>;

export type MallaCurricularFromAPI = ReplaceDateToString<
	MallaCurricular & {
		enUso: boolean;
		modalidad: ModalidadFromAPI;
		tituloObtenido: TituloObtenidoFromAPI | null;
		niveles: (Omit<NivelMallaFromAPI, "malla"> & {
			asignaturas: AsignaturaEnNivelMallaFromAPI[];
		})[];
		modulos: Omit<
			AsignaturaModuloEnMallaFromAPI,
			"areaConocimiento" | "campoFormacion"
		>[];
	}
>;

type ExtraFields = "modalidad" | "tituloObtenido" | "niveles" | "modulos";

export type MallaCurricularWithLugaresEjecucionFromAPI =
	MallaCurricularFromAPI & {
		lugaresEjecucion: LugarEjecucionFromAPI[];
	};

export type CreateMallaCurricular = Omit<
	MallaCurricularFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "enUso"
	| "estado"
	| "tituloObtenido"
	| "niveles"
	| "modulos"
	| "modalidad"
	| ExtraFields
> & {
	niveles: number;
};

export type UpdateMallaData = Partial<
	Omit<
		MallaCurricularFromAPI,
		| "id"
		| "createdAt"
		| "updatedAt"
		| "enUso"
		| "programaId"
		| "modalidadId"
		| "niveles"
		| "tituloObtenido"
		| "niveles"
		| "modulos"
		| "fechaAprobacion"
		| "fechaLimiteVigencia"
		| ExtraFields
	> & {
		fechaAprobacion?: string;
		fechaLimiteVigencia?: string;
	}
>;

export type MallaCurricularQueryFilter = Partial<
	NonNullableObject<
		Omit<
			MallaCurricular,
			| "fechaAprobacion"
			| "fechaLimiteVigencia"
			| "cantidadOtrasMateriasMatricula"
			| "createdAt"
			| "updatedAt"
			| "id"
		>
	>
>;

export const baseMallaSchema = z
	.object<
		ZodInferSchema<
			Omit<
				MallaCurricularFromAPI,
				"tituloObtenido" | "niveles" | "modulos" | "modalidad"
			>
		>
	>({
		id: z.string().uuid(),
		tipoDuracion: z
			.enum(["ANOS", "CREDITOS", "HORAS", "SEMESTRES"] as const)
			.nullable(),
		codigo: z.string().nullable(),
		fechaAprobacion: z.string().datetime(),
		fechaLimiteVigencia: z.string().datetime(),
		cantidadOtrasMateriasMatricula: z.number(),
		limiteSeleccionMateriaPorAdministrativo: z.boolean(),
		cantidadArrastres: z.number().nullable(),
		porcentajeMinimoPasarNivel: z.number().nullable(),
		maximoMateriasAdelantar: z.number().nullable(),
		automatriculaModulos: z.boolean(),
		plantillasSilabo: z.boolean(),
		modeloPlanificacion: z.boolean(),
		perfilEgreso: z.string().nullable(),
		observaciones: z.string().nullable(),
		tituloObtenidoId: z.string().uuid().nullable(),
		modalidadId: z.string().uuid(),
		programaId: z.string().uuid(),
		enUso: z.boolean(),
		estado: z.boolean(),

		practicaComunitariaRequiereAutorizacion: z.boolean().nullable(),
		practicaComunitariaHoras: z.number().nullable(),
		practicaComunitariaCreditos: z.number().nullable(),
		practicaComunitariaRegistroDesdeNivel: z.number().int().nullable(),
		practicaComunitariaRegistroPracticasAdelantadas: z.boolean().nullable(),
		practicaComunitariaRegistroMultiple: z.boolean().nullable(),

		practicaPreProfesionalRequiereAutorizacion: z.boolean().nullable(),
		practicaPreProfesionalHoras: z.number().nullable(),
		practicaPreProfesionalCreditos: z.number().nullable(),
		practicaPreProfesionalRegistroDesdeNivel: z.number().int().nullable(),
		practicaPreProfesionalRegistroPracticasAdelantadas: z.boolean().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const mallaSchema = baseMallaSchema
	.extend<
		ZodInferSchema<
			Pick<
				MallaCurricularFromAPI,
				"niveles" | "modulos" | "tituloObtenido" | "modalidad"
			>
		>
	>({
		modulos: asignaturaModuloEnMallaSchema
			.omit({ areaConocimiento: true, campoFormacion: true })
			.array(),
		niveles: baseNivelMallaSchema
			.extend({
				asignaturas: asignaturaEnNivelMallaSchema.array(),
				enUso: z.boolean(),
			})
			.array(),
		// niveles: nivelMallaSchema.omit({}),
		tituloObtenido: tituloObtenidoSchema.nullable(),
		modalidad: modalidadSchema,
	})
	.strict();

const lugarEjecucionSchema = z
	.object<ZodInferSchema<LugarEjecucionFromAPI>>({
		id: z.string().uuid(),
		mallaId: z.string(),
		codigo: z.string().nullable(),
		sedeId: z.string().uuid(),
		sede: sedeSchema,

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const mallaWithLugaresEjecucion: z.ZodType<MallaCurricularWithLugaresEjecucionFromAPI> =
	mallaSchema
		.extend({
			lugaresEjecucion: lugarEjecucionSchema.array(),
		})
		.strict();

export class MallaCurricularClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: {
		id: string;
		data: UpdateMallaData;
	}): Promise<APIResponse<MallaCurricularFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: mallaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/mallas-curriculares/${params.id}`,
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
		filters?: MallaCurricularQueryFilter,
	): Promise<APIResponse<MallaCurricularFromAPI[]>> {
		const searchParams = new URLSearchParams();

		Object.entries(filters ?? {}).forEach(([key, value]) => {
			if (value === undefined) return;

			searchParams.append(key, `${value}`);
		});

		const res = this.fetcher(
			z.object({
				data: mallaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/mallas-curriculares?" + searchParams.toString(),
		);

		return res;
	}

	async getById(
		id: string,
	): Promise<APIResponse<MallaCurricularFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: mallaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/mallas-curriculares/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async getMallaWithAsignaturasByMallaId(
		id: string,
		filters?: {
			asignaturas_esAnexo?: boolean;
		},
	): Promise<APIResponse<MallaCurricularFromAPI | null>> {
		const searchParams = new URLSearchParams();

		Object.entries(filters || {}).forEach(([f, v]) => {
			searchParams.set(f, `${v}`);
		});

		const res = this.fetcher(
			z.object({
				data: mallaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl +
				`/api/mallas-curriculares/${id}/asignaturas?${searchParams.toString()}`,
		);

		return res;
	}

	async createLugarEjecucion({
		data,
		mallaId,
	}: CreateLugarEjecucionParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/mallas-curriculares/${mallaId}/lugares-ejecucion`,
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

	async getMallaWithLugaresEjecucionByMallaId(
		id: string,
	): Promise<APIResponse<MallaCurricularWithLugaresEjecucionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: mallaWithLugaresEjecucion.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/mallas-curriculares/${id}/lugares-ejecucion`,
		);

		return res;
	}

	async createModulo({
		data,
		asignaturaId,
		mallaCurricularId,
	}: CreateModuloParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/mallas-curriculares/${mallaCurricularId}/asignaturas/${asignaturaId}`,
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

export type CreateModuloParams = {
	data: Omit<CreateAsignaturaModuloEnMalla, "mallaId" | "asignaturaId">;
	mallaCurricularId: string;
	asignaturaId: string;
};

export type CreateAsignaturaEnNivelMallaParams = {
	mallaCurricularId: string;
	nivelMallaId: string;
	data: Omit<
		AsignaturaEnNivelMallaFromAPI,
		| "id"
		| "createdAt"
		| "updatedAt"
		| "ejeFormativo"
		| "areaConocimiento"
		| "campoFormacion"
		| "asignatura"
		| "nivelMallaId"
	>;
};

export type CreateLugarEjecucionParams = {
	mallaId: string;
	data: Omit<
		LugarEjecucionFromAPI,
		"id" | "mallaId" | "createdAt" | "updatedAt" | "sede"
	>;
};
