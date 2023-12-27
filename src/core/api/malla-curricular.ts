import type { MallaCurricular } from "@prisma/client";

import { APIError, type APIResponse, type SimpleAPIResponse } from ".";

type MallaCurricularFromAPI = Omit<
	MallaCurricular,
	"fechaAprobacion" | "fechaLimiteVigencia" | "createdAt"
> & {
	fechaAprobacion: string;
	fechaLimiteVigencia: string;
	createdAt: string;
};

export class MallaCurricularClass {
	constructor(private apiUrl: string) {}

	async update(params: {
		id: string;
		mallaCurricular: Partial<
			Omit<MallaCurricularFromAPI, "id" | "createdAt"> & {
				fechaAprobacion: string;
				fechaLimiteVigencia: string;
			}
		>;
	}): Promise<APIResponse<MallaCurricularFromAPI>> {
		const res = await fetch(
			this.apiUrl + `/api/mallas-curriculares/${params.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.mallaCurricular),
			},
		);

		if (!res.ok) {
			console.error("Error al actualizar la malla.", await res.json());
			throw new APIError("Error al actualizar la malla.");
		}

		return res.json();
	}

	async create(
		MallaCurricular: Omit<
			MallaCurricularFromAPI,
			"id" | "createdAt" | "fechaAprobacion" | "fechaLimiteVigencia"
		> & { fechaAprobacion: string; fechaLimiteVigencia: string },
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(MallaCurricular),
		});

		if (!res.ok) {
			console.error("Error al crear la malla.", await res.json());
			throw new APIError("Error al crear la malla.");
		}

		return res.json();
	}

	async getMany(_: void): Promise<APIResponse<MallaCurricularFromAPI[]>> {
		const res = await fetch(this.apiUrl + "/api/mallas-curriculares");

		if (!res.ok) {
			console.error("Error al obtener mallas.", await res.json());
			throw new APIError("Error al obtener mallas.");
		}

		return res.json();
	}

	async getById(
		id: string,
	): Promise<APIResponse<MallaCurricularFromAPI | null>> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares/${id}`);

		if (!res.ok) {
			console.error("Error al obtener malla.", await res.json());
			throw new APIError("Error al obtener malla.");
		}

		return res.json();
	}

	async deleteById(id: string): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/mallas-curriculares/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			console.error("Error al eliminar la malla.", await res.json());
			throw new APIError("Error al eliminar la malla.");
		}

		return res.json();
	}
}
