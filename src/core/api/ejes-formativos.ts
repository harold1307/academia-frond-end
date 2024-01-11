import type { EjeFormativo } from "@prisma/client";

import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type EjeFormativoFromAPI = EjeFormativo & {
	enUso: boolean;
};

export class EjeFormativoClass {
	constructor(private apiUrl: string) {}

	async create(
		ejeFormativo: Omit<EjeFormativoFromAPI, "id" | "enUso">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/ejes-formativos`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(ejeFormativo),
		});

		if (!res.ok) {
			console.error("Error al crear el eje formativo.", await res.json());
			throw new APIError("Error al crear el eje formativo.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<EjeFormativoFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/ejes-formativos");

		if (!res.ok) {
			console.error("Error al obtener ejes formativos.", await res.json());
			throw new APIError("Error al obtener ejes formativos.");
		}

		return res.json();
	}

	async getById(id: string): Promise<APIResponse<EjeFormativoFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/ejes-formativos/${id}`);

		if (!res.ok) {
			console.error("Error al obtener eje formativo.", await res.json());
			throw new APIError("Error al obtener eje formativo.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/ejes-formativos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar el eje formativo.", await res.json());
			throw new APIError("Error al eliminar el eje formativo.");
		}

		return res.json();
	}

	async update(params: {
		id: string;
		ejeFormativo: Partial<Omit<EjeFormativoFromAPI, "id" | "enUso">>;
	}): Promise<APIResponse<EjeFormativo>> {
		const res = await fetch(this.apiUrl + `/api/ejes-formativos/${params.id}`, {
			method: "PATCH",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(params.ejeFormativo),
		});

		if (!res.ok) {
			console.error("Error al actualizar la eje formativo.", await res.json());
			throw new APIError("Error al actualizar la eje formativo.");
		}

		return res.json();
	}
}
