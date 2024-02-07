import { z } from "zod";
import { zodFetcher, type APIResponse } from ".";

const PeriodoClass = z.object({ data: z.any(), id: z.string() });

export class PeriodosLectivosClass {
	constructor(private apiUrl: string) {}

	async update(params: { periodos: { data: any; id: string } }) {
		const res = zodFetcher(
			z.object({
				periodos: PeriodoClass,
			}),
			`/api/periodos/${params.periodos.id}`,
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
}
