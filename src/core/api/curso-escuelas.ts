import type { CursoEscuela } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import type { AsignaturaEnCursoEscuelaFromAPI } from "./asignaturas-curso-escuelas";

export type CursoEscuelaFromAPI = ReplaceDateToString<
	CursoEscuela & {
		enUso: boolean;
	}
>;

export type CreateCursoEscuela = Omit<
	CursoEscuelaFromAPI,
	"id" | "createdAt" | "updatedAt" | "enUso" | "estado"
>;

export type UpdateCursoEscuela = Partial<
	Omit<
		CursoEscuelaFromAPI,
		"plantillaId" | "id" | "createdAt" | "updatedAt" | "enUso" | "periodoId"
	>
>;

const schema = z
	.object<ZodInferSchema<CursoEscuelaFromAPI>>({
		id: z.string().uuid(),
		estado: z.boolean(),
		nombre: z.string(),
		enUso: z.boolean(),
		codigo: z.string().nullable(),
		paraleloId: z.string().uuid(),
		sesionId: z.string().uuid(),
		tema: z.string(),
		observaciones: z.string().nullable(),
		departamento: z.string().nullable(),
		fechaInicio: z.string().datetime(),
		fechaFin: z.string().datetime(),
		fechaLimiteRegistro: z.string().datetime(),
		diasLimitePago: z.number(),
		nivel: z.number(),
		cupos: z.number().nullable(),
		evaluaProfesor: z.boolean(),
		matriculaConDeuda: z.boolean(),
		legalizarMatriculas: z.boolean(),
		registroExterno: z.boolean(),
		registroInterno: z.boolean(),
		verificaSesion: z.boolean(),
		registroDesdeOtraSede: z.boolean(),
		edadMinima: z.number().nullable(),
		edadMaxima: z.number().nullable(),
		costoPorMateria: z.boolean(),
		cumpleRequisitosMalla: z.boolean(),
		pasarRecord: z.boolean(),

		plantillaId: z.string().uuid().nullable(),
		periodoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class CursoEscuelaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	// async update(params: {
	// 	id: string;
	// 	data: Partial<
	// 		Omit<CursoEscuelaFromAPI, "id" | "enUso" | "createdAt" | "updatedAt">
	// 	>;
	// }): Promise<APIResponse<CursoEscuelaFromAPI>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data,
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + `/api/curso-escuelas/${params.id}`,
	// 		{
	// 			method: "PATCH",
	// 			headers: {
	// 				"Context-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(params.data),
	// 		},
	// 	);

	// 	return res;
	// }

	async create(data: CreateCursoEscuela): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/curso-escuelas`, {
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

	async getMany(_: void): Promise<APIResponse<CursoEscuelaFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: schema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/curso-escuelas",
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<CursoEscuelaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: schema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/curso-escuelas/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/curso-escuelas/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}

	async createAsignatura(params: {
		data: Omit<
			AsignaturaEnCursoEscuelaFromAPI,
			"cursoEscuelaId" | "asignaturaId" | "id" | "createdAt" | "updatedAt"
		>;
		cursoEscuelaId: string;
		asignaturaId: string;
	}) {
		const res = await fetch(
			this.apiUrl +
				`/api/curso-escuelas/${params.cursoEscuelaId}/asignaturas/${params.asignaturaId}`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}

		return res.json();
	}
}
