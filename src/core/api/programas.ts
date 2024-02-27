import type { Programa } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	detalleNivelTitulacionSchema,
	type DetalleNivelTitulacionFromAPI,
} from "./detalles-nivel-titulacion";
import type { CreateMallaCurricular } from "./mallas-curriculares";
import {
	nivelTitulacionSchema,
	type NivelTitulacionFromAPI,
} from "./niveles-titulacion";
import type { CreateTipoDocumentoEnPrograma } from "./tipos-documento-programas";
import type { CreateTituloObtenido } from "./titulos-obtenidos";

export type ProgramaFromAPI = ReplaceDateToString<
	Programa & {
		enUso: boolean;
		nivelTitulacion: Omit<NivelTitulacionFromAPI, "enUso">;
		detalleNivelTitulacion: Omit<DetalleNivelTitulacionFromAPI, "enUso">;
	}
>;

type CreatePrograma = Omit<
	ProgramaFromAPI,
	"enUso" | "createdAt" | "updatedAt"
>;

type UpdateProgramaParams = {
	id: string;
	data: Partial<Omit<CreatePrograma, "nombre">>;
};

export const programaSchema = z
	.object<ZodInferSchema<ProgramaFromAPI>>({
		nombre: z.string(),
		enUso: z.boolean(),
		alias: z.string(),
		coordinacionId: z.string().uuid(),
		detalleNivelTitulacionId: z.string().uuid(),
		estado: z.boolean(),
		id: z.string().uuid(),
		mencion: z.string().nullable(),
		detalleNivelTitulacion: detalleNivelTitulacionSchema.omit({ enUso: true }),
		nivelTitulacion: nivelTitulacionSchema.omit({ enUso: true }),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

// el ID de los programas son el nombre mismo
export class ProgramaClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateProgramaParams): Promise<APIResponse<ProgramaFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: programaSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/programas/${id}`,
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

	async create(data: CreatePrograma): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/programas`, {
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

	async getMany(_: void): Promise<APIResponse<ProgramaFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: programaSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/programas`,
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<ProgramaFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: programaSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/programas/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/programas/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async createTipoDocumento({
		programaId,
		tipoDocumentoId,
		data,
	}: CreateTipoDocumentoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl +
				`/api/programas/${programaId}/tipos-documento/${tipoDocumentoId}`,
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

	async createTituloObtenido({
		programaId,
		data,
	}: CreateTituloObtenidoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/programas/${programaId}/titulos-obtenidos`,
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

	async createMalla({ programaId, data }: CreateMallaParams) {
		const res = await fetch(
			this.apiUrl + `/api/programas/${programaId}/mallas-curriculares`,
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

type CreateTipoDocumentoParams = {
	programaId: string;
	tipoDocumentoId: string;
	data: Omit<CreateTipoDocumentoEnPrograma, "programaId" | "tipoDocumentoId">;
};

type CreateTituloObtenidoParams = {
	programaId: string;
	data: CreateTituloObtenido;
};

type CreateMallaParams = {
	programaId: string;
	data: Omit<CreateMallaCurricular, "programaId">;
};
