import type { Paralelo } from "@prisma/client";

import type { ReplaceDateToString } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type ParaleloFromAPI = ReplaceDateToString<Paralelo>;

// type UpdateParaleloParams = {
// 	id: string;
// 	data: Partial<Omit<ParaleloFromAPI, "nombre">>;
// };

// el ID de los paralelos son el nombre mismo
export class ParaleloClass {
	constructor(private apiUrl: string) {}

	// async update({
	// 	data,
	// 	id,
	// }: UpdateParaleloParams): Promise<APIResponse<ParaleloFromAPI>> {
	// 	const res = await fetch(this.apiUrl + `/api/paralelos/${id}`, {
	// 		method: "PATCH",
	// 		headers: {
	// 			"Context-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(data),
	// 	});

	// 	if (!res.ok) {
	// 		console.error("Error al actualizar el paralelo.", await res.json());
	// 		throw new APIError("Error al actualizar el paralelo.");
	// 	}

	// 	return res.json();
	// }

	async create(data: ParaleloFromAPI): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/paralelos`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			console.error("Error al crear el paralelo.", await res.json());
			throw new APIError("Error al crear el paralelo.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<ParaleloFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/paralelos");

		if (!res.ok) {
			console.error("Error al obtener paralelos.", await res.json());
			throw new APIError("Error al obtener paralelos.");
		}

		return res.json();
	}

	async getById(id: string): Promise<APIResponse<ParaleloFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/paralelos/${id}`);

		if (!res.ok) {
			console.error("Error al obtener paralelo.", await res.json());
			throw new APIError("Error al obtener paralelo.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/paralelos/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar el paralelo.", await res.json());
			throw new APIError("Error al eliminar el paralelo.");
		}

		return res.json();
	}
}
