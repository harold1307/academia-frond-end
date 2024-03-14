import type {
	Administrativo,
	AsesorCrm,
	AsesorCrmEnCentroInformacion,
} from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type { ReplaceDateToString, ZodInferSchema } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	baseCentroInformacionSchema,
	type CentroInformacionFromAPI,
} from "./centros-informacion";
import {
	administrativoSchema,
	baseUsuarioSchema,
	type UsuarioFromAPI,
} from "./usuarios";

export type CreateAsesorCrmEnCentroInformacion = {
	asesorCrmId: string;
	centroInformacionIds: string[];
};

export type UpdateAsesorCrmEnCentroInformacion = {
	asesorCrmId: string;
	centroInformacionIds: string[];
};

export type AsesorCrmFromAPI = ReplaceDateToString<
	AsesorCrm & {
		administrativo: Administrativo & {
			usuario: Omit<
				UsuarioFromAPI,
				"administrativo" | "profesor" | "alumno" | "grupos"
			>;
		};
		centrosInformacion: (AsesorCrmEnCentroInformacion & {
			centroInformacion: Omit<CentroInformacionFromAPI, "enUso">;
		})[];
	}
>;

type UpdateAsesorCrmParams = {
	id: string;
	data: Omit<UpdateAsesorCrmEnCentroInformacion, "asesorCrmId">;
};

type ExtraFields = "administrativo" | "centrosInformacion";

export type CreateAsesorCrm = Omit<
	AsesorCrmFromAPI,
	"enUso" | "createdAt" | "updatedAt" | "id" | ExtraFields
>;

const asesorCrmEnCentroInformacionSchema = z.object<
	ZodInferSchema<AsesorCrmEnCentroInformacion>
>({
	id: z.string().uuid(),
	asesorId: z.string().uuid(),
	centroInformacionId: z.string().uuid(),
});

export const baseAsesorCrmSchema = z
	.object<ZodInferSchema<Omit<AsesorCrmFromAPI, ExtraFields>>>({
		id: z.string().uuid(),
		administrativoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const asesorCrmSchema = baseAsesorCrmSchema
	.extend<ZodInferSchema<Pick<AsesorCrmFromAPI, ExtraFields>>>({
		administrativo: z.lazy(() =>
			administrativoSchema
				.omit({
					sede: true,
					asesorCrm: true,
					asesorEstudiante: true,
					responsableCrm: true,
					responsableAsesorEstudiante: true,
				})
				.extend({
					usuario: baseUsuarioSchema,
				}),
		),
		centrosInformacion: asesorCrmEnCentroInformacionSchema
			.extend({
				centroInformacion: baseCentroInformacionSchema.omit({
					enUso: true,
				}),
			})
			.array(),
	})
	.strict();

export class AsesorCrmClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateAsesorCrmParams): Promise<APIResponse<AsesorCrmFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: asesorCrmSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/asesores-crm/${id}`,
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

	// async create(
	// 	data: Omit<AsesorCrmFromAPI, "enUso" | "createdAt" | "updatedAt" | "id">,
	// ): Promise<SimpleAPIResponse> {
	// 	const res = await fetch(this.apiUrl + `/api/asesores-crm`, {
	// 		method: "POST",
	// 		headers: {
	// 			"Context-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(data),
	// 	});

	// 	if (!res.ok) {
	// 		const json = (await res.json()) as APIResponse<unknown>;
	// 		throw new APIError(json.message);
	// 	}

	// 	return res.json();
	// }

	async getMany(_: void): Promise<APIResponse<AsesorCrmFromAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: asesorCrmSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/asesores-crm",
		);

		return res;
	}

	// async getById(id: string): Promise<APIResponse<AsesorCrmFromAPI | null>> {
	// 	const res = this.fetcher(
	// 		z.object({
	// 			data: asesorCrmSchema.nullable(),
	// 			message: z.string(),
	// 		}),
	// 		this.apiUrl + `/api/asesores-crm/${id}`,
	// 	);

	// 	return res;
	// }

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/asesores-crm/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
