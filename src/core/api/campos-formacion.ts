import type { CampoFormacion } from "@prisma/client";

import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type CampoFormacionFromAPI = CampoFormacion & {
	enUso: boolean;
};

export class CampoFormacionClass {
	constructor(private apiUrl: string) {}

	async create(
		campoFormacion: Omit<CampoFormacionFromAPI, "id" | "enUso">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/campos-formacion`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(campoFormacion),
		});

		if (!res.ok) {
			console.error("Error al crear la campo de formacion.", await res.json());
			throw new APIError("Error al crear la campo de formacion.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<CampoFormacionFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/campos-formacion");

		if (!res.ok) {
			console.error("Error al obtener campos de formacion.", await res.json());
			throw new APIError("Error al obtener campos de formacion.");
		}

		return res.json();
	}

	async getById(
		id: string,
	): Promise<APIResponse<CampoFormacionFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/campos-formacion/${id}`);

		if (!res.ok) {
			console.error("Error al obtener campo de formacion.", await res.json());
			throw new APIError("Error al obtener campo de formacion.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/campos-formacion/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error(
				"Error al eliminar la campo de formacion.",
				await res.json(),
			);
			throw new APIError("Error al eliminar la campo de formacion.");
		}

		return res.json();
	}
}
