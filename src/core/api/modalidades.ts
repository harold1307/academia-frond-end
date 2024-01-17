import type { Modalidad } from "@prisma/client";

import type { ReplaceDateToString } from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

export type ModalidadFromAPI = ReplaceDateToString<Modalidad>;

type UpdateModalidadParams = {
	id: string;
	data: Partial<Omit<ModalidadFromAPI, "nombre">>;
};

// el ID de las modalidades son el nombre mismo
export class ModalidadClass {
	constructor(private apiUrl: string) {}

	async update({
		data,
		id,
	}: UpdateModalidadParams): Promise<APIResponse<ModalidadFromAPI>> {
		const res = await fetch(this.apiUrl + `/api/modalidades/${id}`, {
			method: "PATCH",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			console.error("Error al actualizar la modalidad.", await res.json());
			throw new APIError("Error al actualizar la modalidad.");
		}

		return res.json();
	}

	async create(data: ModalidadFromAPI): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modalidades`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			console.error("Error al crear la modalidad.", await res.json());
			throw new APIError("Error al crear la modalidad.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<ModalidadFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/modalidades");

		if (!res.ok) {
			console.error("Error al obtener modalidades.", await res.json());
			throw new APIError("Error al obtener modalidades.");
		}

		return res.json();
	}

	async getById(id: string): Promise<APIResponse<ModalidadFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/modalidades/${id}`);

		if (!res.ok) {
			console.error("Error al obtener modalidad.", await res.json());
			throw new APIError("Error al obtener modalidad.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/modalidades/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar la modalidad.", await res.json());
			throw new APIError("Error al eliminar la modalidad.");
		}

		return res.json();
	}
}
