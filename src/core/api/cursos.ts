import type { Curso } from "@prisma/client";

import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export class CursoClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		curso: Partial<Omit<Curso, "id" | "createdAt">>;
	}): Promise<APIResponse<Curso>> {
		const res = await fetch(this.apiUrl + `/api/cursos/${params.id}`, {
			method: "PATCH",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(params.curso),
		});

		if (!res.ok) {
			console.error("Error al actualizar la curso.", await res.json());
			throw new APIError("Error al actualizar la curso.");
		}

		return res.json();
	}

	async create(
		curso: Omit<Curso, "id" | "createdAt">,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/cursos`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(curso),
		});

		if (!res.ok) {
			console.error("Error al crear la curso.", await res.json());
			throw new APIError("Error al crear la curso.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<Curso[]>> {
		const res = await fetch(this.apiUrl + "/api/cursos");

		if (!res.ok) {
			console.error("Error al obtener cursos.", await res.json());
			throw new APIError("Error al obtener cursos.");
		}

		return res.json();
	}

	async getById(id: string): Promise<APIResponse<Curso | null>> {
		const res = await fetch(this.apiUrl + `/api/cursos/${id}`);

		if (!res.ok) {
			console.error("Error al obtener curso.", await res.json());
			throw new APIError("Error al obtener curso.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/cursos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar la curso.", await res.json());
			throw new APIError("Error al eliminar la curso.");
		}

		return res.json();
	}
}
