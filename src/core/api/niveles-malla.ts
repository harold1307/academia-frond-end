import type { NivelMalla } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import type { CreateAsignaturaEnNivelMalla } from "./asignaturas-niveles-malla";
import {
	baseMallaSchema,
	type MallaCurricularFromAPI,
} from "./mallas-curriculares";
import type { CreateNivelAcademico } from "./niveles-academicos";

export type NivelMallaFromAPI = ReplaceDateToString<
	NivelMalla & {
		enUso: boolean;
		malla: Omit<
			MallaCurricularFromAPI,
			| "practicaPreProfesional"
			| "practicaComunitaria"
			| "tituloObtenido"
			| "niveles"
			| "asignaturas"
			| "modulos"
		>;
	}
>;

type UpdateNivelMallaParams = {
	id: string;
	data: Partial<
		Omit<
			NivelMallaFromAPI,
			"id" | "nivel" | "mallaId" | "createdAt" | "updatedAt" | "enUso" | "malla"
		>
	>;
};

export const baseNivelMallaSchema = z.object<
	ZodInferSchema<Omit<NivelMallaFromAPI, "malla">>
>({
	id: z.string().uuid(),
	enUso: z.boolean(),
	mallaId: z.string().uuid(),
	nivel: z.number(),
	tituloObtenidoId: z.string().uuid().nullable(),

	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const nivelMallaSchema = baseNivelMallaSchema
	.extend<
		ZodInferSchema<
			Omit<
				NivelMallaFromAPI,
				| "id"
				| "enUso"
				| "mallaId"
				| "nivel"
				| "tituloObtenidoId"
				| "createdAt"
				| "updatedAt"
			>
		>
	>({
		malla: z.lazy(() =>
			baseMallaSchema.omit({
				practicaPreProfesional: true,
				practicaComunitaria: true,
			}),
		),
	})
	.strict();

export class NivelMallaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(
		params: UpdateNivelMallaParams,
	): Promise<APIResponse<NivelMallaFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: nivelMallaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-malla/${params.id}`,
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

	async getMany(_: void): Promise<APIResponse<NivelMallaFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: nivelMallaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/niveles-malla",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<NivelMallaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: nivelMallaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/niveles-malla/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/niveles-malla/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async createAsignatura({
		asignaturaId,
		nivelMallaId,
		data,
	}: CreateAsignaturaParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/niveles-malla/${nivelMallaId}/asignaturas/${asignaturaId}`,
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

	async createNivelAcademico({
		nivelMallaId,
		sesionId,
		data,
	}: CreateNivelAcademicoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/niveles-malla/${nivelMallaId}/sesiones/${sesionId}`,
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

type CreateAsignaturaParams = {
	nivelMallaId: string;
	asignaturaId: string;
	data: Omit<CreateAsignaturaEnNivelMalla, "nivelMallaId" | "asignaturaId">;
};

type CreateNivelAcademicoParams = {
	nivelMallaId: string;
	sesionId: string;
	data: Omit<
		CreateNivelAcademico,
		| "nivelMallaId"
		| "sesionId"
		| "fechaInicio"
		| "fechaFin"
		| "inicioAgregaciones"
		| "limiteAgregaciones"
		| "limiteOrdinaria"
		| "limiteExtraordinaria"
		| "limiteEspecial"
	> & {
		fechaInicio: string;
		fechaFin: string;
		inicioAgregaciones: string;
		limiteAgregaciones: string;
		limiteOrdinaria: string;
		limiteExtraordinaria: string;
		limiteEspecial: string;
	};
};
