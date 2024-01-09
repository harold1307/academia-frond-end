import type { Institucion } from "@prisma/client";

import type { ReplaceDateToString } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type InstitucionFromAPI = ReplaceDateToString<
	Institucion & {
		enUso: boolean;
	}
>;

export class InstitucionClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		institucion: Partial<
			Omit<InstitucionFromAPI, "id" | "createdAt" | "enUso">
		>;
	}): Promise<APIResponse<InstitucionFromAPI>> {
		const res = await fetch(this.apiUrl + `/api/instituciones/${params.id}`, {
			method: "PATCH",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(params.institucion),
		});

		if (!res.ok) {
			console.error("Error al actualizar la institucion.", await res.json());
			throw new APIError("Error al actualizar la institucion.");
		}

		return res.json();
	}

	async create(
		institucion: Omit<InstitucionFromAPI, "id" | "createdAt" | "enUso">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/instituciones`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(institucion),
		});

		if (!res.ok) {
			console.error("Error al crear la institucion.", await res.json());
			throw new APIError("Error al crear la institucion.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<InstitucionFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/instituciones");

		if (!res.ok) {
			console.error("Error al obtener instituciones.", await res.json());
			throw new APIError("Error al obtener instituciones.");
		}

		return res.json();
	}

	async getById(id: string): Promise<APIResponse<InstitucionFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/instituciones/${id}`);

		if (!res.ok) {
			console.error("Error al obtener institucion.", await res.json());
			throw new APIError("Error al obtener institucion.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/instituciones/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar la institucion.", await res.json());
			throw new APIError("Error al eliminar la institucion.");
		}

		return res.json();
	}
}
