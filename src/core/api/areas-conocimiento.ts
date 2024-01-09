import type { AreaConocimiento } from "@prisma/client";

import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type AreaConocimientoFromAPI = AreaConocimiento & {
	enUso: boolean;
};

export class AreaConocimientoClass {
	constructor(private apiUrl: string) {}

	async create(
		areaConocimiento: Omit<AreaConocimientoFromAPI, "id" | "enUso">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/areas-conocimiento`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(areaConocimiento),
		});

		if (!res.ok) {
			console.error(
				"Error al crear el area de conocimiento.",
				await res.json(),
			);
			throw new APIError("Error al crear el area de conocimiento.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<AreaConocimientoFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/areas-conocimiento");

		if (!res.ok) {
			console.error(
				"Error al obtener areas de conocimiento.",
				await res.json(),
			);
			throw new APIError("Error al obtener areas de conocimiento.");
		}

		return res.json();
	}

	async getById(
		id: string,
	): Promise<APIResponse<AreaConocimientoFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/areas-conocimiento/${id}`);

		if (!res.ok) {
			console.error("Error al obtener area de conocimiento.", await res.json());
			throw new APIError("Error al obtener area de conocimiento.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/areas-conocimiento/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error(
				"Error al eliminar el area de conocimiento.",
				await res.json(),
			);
			throw new APIError("Error al eliminar el area de conocimiento.");
		}

		return res.json();
	}

	async update(params: {
		id: string;
		areaConocimiento: Partial<Omit<AreaConocimientoFromAPI, "id" | "enUso">>;
	}): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/areas-conocimiento/${params.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.areaConocimiento),
			},
		);

		if (!res.ok) {
			console.error(
				"Error al actualizar el area de conocimiento.",
				await res.json(),
			);
			throw new APIError("Error al actualizar el area de conocimiento.");
		}

		return res.json();
	}
}
