import { z } from "zod";
import { zodFetcher, type APIResponse } from ".";
import { ZodFetcher } from "zod-fetch";

const PeriodoClass = z.object({ data: z.any(), id: z.string() });

export class PeriodosLectivosClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async getMany(filters?: Promise<APIResponse<any>>) {
		const searchParams = new URLSearchParams();

		Object.entries(filters ?? {}).forEach(([key, value]) => {
			if (value === undefined) return;

			searchParams.append(key, `${value}`);
		});

		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			this.apiUrl + "/api/periodos-lectivos",
		);

		return res;
	}
	async update(params: { periodos: { data: any; id: string } }) {
		const res = zodFetcher(
			z.object({
				periodos: PeriodoClass,
			}),
			`/api/periodos-lectivos/${params.periodos.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.periodos.data),
			},
		);

		return res;
	}
	async getById(id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/${id}`,
		);

		return res;
	}
	async actividadesHabilitadas(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/actividades-habilitadas/${id}`,
		);

		return res;
	}
	async costos(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/costos/${id}`,
		);

		return res;
	}
	async habilitar(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/habilitar-matricula/${id}`,
		);

		return res;
	}
	async actualizar(data: any, id: string) {
		const res = this.fetcher(
			z.object({
				data: z.any(),
				message: z.string(),
			}),
			`/api/periodos-lectivos/actualizar-calificaciones/${id}`,
		);

		return res;
	}
}
