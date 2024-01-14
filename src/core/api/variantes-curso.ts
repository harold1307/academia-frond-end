import type { AsignaturaEnVarianteCurso as PrismaAsignaturaEnVarianteCurso } from "@prisma/client";

import { APIError, type APIResponse } from ".";
import type { VarianteCurso } from "./cursos";

export type AsignaturaEnVarianteCurso = PrismaAsignaturaEnVarianteCurso;

export type VarianteCursoWithAsignaturas = VarianteCurso & {
	asignaturasEnVarianteCurso: AsignaturaEnVarianteCurso[];
};

export type CreateAsignaturaEnVarianteCursoParams = {
	asignaturaId: string;
	varianteCursoId: string;
	data: Omit<
		AsignaturaEnVarianteCurso,
		"id" | "asignaturaId" | "varianteCursoId"
	>;
};

export class VarianteCursoClass {
	constructor(private apiUrl: string) {}

	async createAsignaturaEnVarianteCurso({
		asignaturaId,
		data,
		varianteCursoId,
	}: CreateAsignaturaEnVarianteCursoParams) {
		const res = await fetch(
			this.apiUrl +
				`/api/variantes-curso/${varianteCursoId}/asignaturas/${asignaturaId}`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			console.error(
				"Error al crear la asignatura en variante de curso.",
				await res.json(),
			);
			throw new APIError("Error al crear la asignatura en variante de curso.");
		}

		return res.json();
	}

	async getByIdWithAsignaturas(
		id: string,
	): Promise<APIResponse<VarianteCursoWithAsignaturas>> {
		const res = await fetch(
			this.apiUrl + `/api/variantes-curso/${id}/asignaturas`,
		);

		if (!res.ok) {
			console.error(
				"Error al obtener las asignaturas en variante de curso.",
				await res.json(),
			);
			throw new APIError(
				"Error al obtener las asignaturas en variante de curso.",
			);
		}

		return res.json();
	}
}
