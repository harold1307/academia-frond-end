import type { AsignaturaEnVarianteCurso, VarianteCurso } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import { asignaturaSchema, type AsignaturaFromAPI } from "./asignaturas";
import type { CreateCursoEscuela } from "./curso-escuelas";
import {
	baseMallaSchema,
	type MallaCurricularFromAPI,
} from "./mallas-curriculares";
import { modalidadSchema, type ModalidadFromAPI } from "./modalidades";
import { programaSchema, type ProgramaFromAPI } from "./programas";
import {
	programaEnVarianteCursoSchema,
	type CreateProgramaEnVarianteCurso,
	type ProgramaEnVarianteCursoFromAPI,
} from "./programas-variantes-curso";

export type VarianteCursoFromAPI = ReplaceDateToString<VarianteCurso>;

export type VarianteCursoWithProgramasFromAPI = VarianteCursoFromAPI & {
	programas: (ProgramaEnVarianteCursoFromAPI & {
		programa: Omit<
			ProgramaFromAPI,
			"enUso" | "nivelTitulacion" | "detalleNivelTitulacion"
		>;
		modalidad: Omit<ModalidadFromAPI, "enUso"> | null;
		malla: Omit<
			MallaCurricularFromAPI,
			| "enUso"
			| "modalidad"
			| "practicaPreProfesional"
			| "practicaComunitaria"
			| "tituloObtenido"
			| "niveles"
			| "modulos"
		> | null;
	})[];
};

export type AsignaturaEnVarianteCursoFromAPI = ReplaceDateToString<
	AsignaturaEnVarianteCurso & {
		asignatura: AsignaturaFromAPI;
	}
>;

export type VarianteCursoWithAsignaturasFromAPI = VarianteCursoFromAPI & {
	asignaturas: AsignaturaEnVarianteCursoFromAPI[];
};

export type CreateAsignaturaEnVarianteCurso = Omit<
	AsignaturaEnVarianteCursoFromAPI,
	"id" | "createdAt" | "updatedAt" | "asignatura"
>;

type UpdateVarianteCursoParams = {
	varianteCursoId: string;
	data: Partial<
		Omit<
			VarianteCursoFromAPI,
			"id" | "createdAt" | "updatedAt" | "cursoId" | "varianteCursoId"
		>
	>;
};

export type CreateAsignaturaEnVarianteCursoParams = {
	asignaturaId: string;
	varianteCursoId: string;
	data: Omit<
		CreateAsignaturaEnVarianteCurso,
		"asignaturaId" | "varianteCursoId"
	>;
};

export const varianteCursoSchema = z
	.object<ZodInferSchema<VarianteCursoFromAPI>>({
		id: z.string().uuid(),
		nombre: z.string(),
		estado: z.boolean(),
		codigoBase: z.string(),
		descripcion: z.string(),
		registroExterno: z.boolean(),
		registroInterno: z.boolean(),
		verificaSesion: z.boolean(),
		edadMinima: z.number().nullable(),
		edadMaxima: z.number().nullable(),
		fechaAprobacion: z.string().datetime(),
		registroDesdeOtraSede: z.boolean(),
		costoPorMateria: z.boolean(),
		cumpleRequisitosMalla: z.boolean(),
		pasarRecord: z.boolean(),
		costoPorCantidadMateria: z.boolean(),

		cursoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const asignaturaVarianteCursoSchema = z.object<
	ZodInferSchema<AsignaturaEnVarianteCursoFromAPI>
>({
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
	cantidadDecimales: z.number().nullable(),
	notaMaxima: z.number().nullable(),
	notaMinima: z.number().nullable(),

	asignaturaId: z.string(),
	varianteCursoId: z.string(),
	modeloEvaluativoId: z.string().uuid().nullable(),
	asignatura: asignaturaSchema,

	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

const varianteCursoWithAsignaturasSchema = varianteCursoSchema
	.extend({
		asignaturas: asignaturaVarianteCursoSchema.array(),
	})
	.strict();

const varianteCursoWithProgramasSchema = varianteCursoSchema.extend<
	ZodInferSchema<Pick<VarianteCursoWithProgramasFromAPI, "programas">>
>({
	programas: programaEnVarianteCursoSchema
		.extend({
			programa: programaSchema.omit({
				nivelTitulacion: true,
				detalleNivelTitulacion: true,
				enUso: true,
			}),
			modalidad: modalidadSchema.omit({ enUso: true }).nullable(),
			malla: baseMallaSchema
				.omit({
					practicaComunitaria: true,
					practicaPreProfesional: true,
					enUso: true,
				})
				.nullable(),
		})
		.array(),
});

export class VarianteCursoClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		varianteCursoId,
		data,
	}: UpdateVarianteCursoParams): Promise<APIResponse<VarianteCursoFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: varianteCursoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/variantes-curso/${varianteCursoId}`,
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

	async getMany(_: void): Promise<APIResponse<VarianteCursoFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: varianteCursoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/variantes-curso",
		);

		return res;
	}

	async createAsignaturaEnVarianteCurso({
		asignaturaId,
		data,
		varianteCursoId,
	}: CreateAsignaturaEnVarianteCursoParams) {
		const res = await fetch(
			this.apiUrl +
				`/api/variantes-curso/${varianteCursoId}/asignaturas/${asignaturaId}`,
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

	async getByIdWithAsignaturas(
		id: string,
	): Promise<APIResponse<VarianteCursoWithAsignaturasFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: varianteCursoWithAsignaturasSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/variantes-curso/${id}/asignaturas`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/variantes-curso/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async createCursoEscuela({
		data,
		varianteCursoId,
	}: CreateCursoEscuelaParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/variantes-curso/${varianteCursoId}/curso-escuelas`,
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

	async getByIdWithProgramas(
		id: string,
	): Promise<APIResponse<VarianteCursoWithProgramasFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: varianteCursoWithProgramasSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/variantes-curso/${id}/programas`,
		);

		return res;
	}
	async createProgramaEnVariante({
		data,
		varianteCursoId,
	}: CreateProgramaEnVarianteParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/variantes-curso/${varianteCursoId}/programas`,
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

type CreateCursoEscuelaParams = {
	varianteCursoId: string;
	data: Omit<
		CreateCursoEscuela,
		| "plantillaId"
		| "registroExterno"
		| "registroInterno"
		| "verificarSesion"
		| "registroDesdeOtraSede"
		| "edadMinima"
		| "edadMaxima"
		| "costoPorMateria"
		| "cumpleRequisitosMalla"
		| "pasarRecord"
		| "aprobarCursoPrevio"
	>;
};
type CreateProgramaEnVarianteParams = {
	varianteCursoId: string;
	data: Omit<CreateProgramaEnVarianteCurso, "varianteCursoId">;
};
