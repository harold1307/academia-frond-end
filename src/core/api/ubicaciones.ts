import type { Ubicacion } from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type {
	NonNullableObject,
	ReplaceDateToString,
	ZodInferSchema,
} from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type UbicacionFromAPI = ReplaceDateToString<
	Ubicacion & {
		enUso: boolean;
	}
>;

export type UbicacionQueryFilter = Partial<
	NonNullableObject<Omit<Ubicacion, "createdAt" | "updatedAt" | "id">>
>;

export type CreateUbicacion = Omit<
	UbicacionFromAPI,
	"id" | "createdAt" | "updatedAt" | "estado" | "enUso"
>;

type UpdateUbicacionParams = {
	id: string;
	data: Partial<
		Omit<CreateUbicacion, "sedeId"> & {
			estado: boolean;
		}
	>;
};

export const ubicacionSchema = z
	.object<ZodInferSchema<UbicacionFromAPI>>({
		id: z.string().uuid(),
		tipo: z.enum(["AULA", "LABORATORIO", "TALLER", "SALON"] as const),
		capacidad: z.number().min(0).int(),
		entornoVirtual: z.boolean(),
		nombre: z.string().min(1),
		sedeId: z.string().uuid(),
		enUso: z.boolean(),
		estado: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export class UbicacionClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		id,
		data,
	}: UpdateUbicacionParams): Promise<APIResponse<UbicacionFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: ubicacionSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/ubicaciones/${id}`,
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
		filters?: UbicacionQueryFilter,
	): Promise<APIResponse<UbicacionFromAPI[]>> {
		const searchParams = new URLSearchParams();

		Object.entries(filters ?? {}).forEach(([key, value]) => {
			if (value === undefined) return;

			searchParams.append(key, `${value}`);
		});

		const res = this.fetcher(
			z.object({
				data: ubicacionSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/ubicaciones?" + searchParams.toString(),
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<UbicacionFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: ubicacionSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/ubicaciones/${id}`,
		);

		return res;
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/ubicaciones/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}
