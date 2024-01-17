import type { CursoEscuela } from "@prisma/client";

import type { ReplaceDateToString } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type CursoEscuelaFromAPI = ReplaceDateToString<CursoEscuela>;

// type UpdateCursoEscuelaParams = {
// 	id: string;
// 	data: Partial<Omit<CursoEscuelaFromAPI, "nombre">>;
// };

export class CursoEscuelaClass {
	constructor(private apiUrl: string) {}

	// async update({
	// 	data,
	// 	id,
	// }: UpdateCursoEscuelaParams): Promise<APIResponse<CursoEscuelaFromAPI>> {
	// 	const res = await fetch(this.apiUrl + `/api/curso-escuelas/${id}`, {
	// 		method: "PATCH",
	// 		headers: {
	// 			"Context-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(data),
	// 	});

	// 	if (!res.ok) {
	// 		console.error("Error al actualizar la curso escuela.", await res.json());
	// 		throw new APIError("Error al actualizar la curso escuela.");
	// 	}

	// 	return res.json();
	// }

	async create(data: CursoEscuelaFromAPI): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/curso-escuelas`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			console.error("Error al crear la curso escuela.", await res.json());
			throw new APIError("Error al crear la curso escuela.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<CursoEscuelaFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/curso-escuelas");

		if (!res.ok) {
			console.error("Error al obtener curso-escuelas.", await res.json());
			throw new APIError("Error al obtener curso-escuelas.");
		}

		return res.json();
	}

	async getById(id: string): Promise<APIResponse<CursoEscuelaFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/curso-escuelas/${id}`);

		if (!res.ok) {
			console.error("Error al obtener curso escuela.", await res.json());
			throw new APIError("Error al obtener curso escuela.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/curso-escuelas/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar la curso escuela.", await res.json());
			throw new APIError("Error al eliminar la curso escuela.");
		}

		return res.json();
	}
}
