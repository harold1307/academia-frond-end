import type { Asignatura } from "@prisma/client";

import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type AsignaturaWithIsUsed = Asignatura & {
	enUso: boolean;
};

export class AsignaturaClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		asignatura: Partial<Omit<Asignatura, "id" | "createdAt">>;
	}): Promise<APIResponse<Asignatura>> {
		const res = await fetch(this.apiUrl + `/api/asignaturas/${params.id}`, {
			method: "PATCH",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(params.asignatura),
		});

		if (!res.ok) {
			console.error("Error al actualizar la asignatura.", await res.json());
			throw new APIError("Error al actualizar la asignatura.");
		}

		return res.json();
	}

	async create(
		asignatura: Omit<Asignatura, "id" | "createdAt">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/asignaturas`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(asignatura),
		});

		if (!res.ok) {
			console.error("Error al crear la asignatura.", await res.json());
			throw new APIError("Error al crear la asignatura.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<AsignaturaWithIsUsed[]>> {
		const res = await fetch(this.apiUrl + "/api/asignaturas");

		if (!res.ok) {
			console.error("Error al obtener asignaturas.", await res.json());
			throw new APIError("Error al obtener asignaturas.");
		}

		return res.json();
	}

	async getById(id: string): Promise<APIResponse<Asignatura | null>> {
		const res = await fetch(this.apiUrl + `/api/asignaturas/${id}`);

		if (!res.ok) {
			console.error("Error al obtener asignatura.", await res.json());
			throw new APIError("Error al obtener asignatura.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/asignaturas/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar la asignatura.", await res.json());
			throw new APIError("Error al eliminar la asignatura.");
		}

		return res.json();
	}
}
