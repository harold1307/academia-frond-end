import { z } from "zod";
import {
	zodFetcher,
	type APIResponse,
	type SimpleAPIResponse,
	APIError,
} from ".";
import { type ZodFetcher } from "zod-fetch";
import { type CreateCronogramaMatriculacion } from "./cronogramas-matriculacion";
import { type ZodInferSchema } from "@/utils/types";

export type PeriodoAPI = {
	id: string;
	matriculas: boolean;
	estado: boolean;
	abierto: boolean;
	nombre: string;
	inicio: Date;
	fin: Date;
	tipo: string;
	limiteMatriculaOrdinaria: Date | null;
	limiteMatriculaExtraordinaria: Date | null;
	limiteMatriculaEspecial: Date | null;
	automatriculaAlumnosFechaExtraordinaria: boolean | null;
	estudianteSeleccionaParaleloAutomatricula: boolean | null;
	seImpartioNivelacion: boolean | null;
	planificacionCargaHoraria: boolean | null;
	planificacionProfesoresFormaTotal: boolean | null;
	aprobacionPlanificacionProfesores: boolean | null;
	legalizacionAutomaticaContraPagos: boolean | null;
	corteId: boolean | null;
	numeroSecuencia: boolean | null;
	cronogramaNotasCoordinacion: boolean | null;
	puedenAutomatricularseSegundasOMasMatriculas: boolean |null;
	puedenMatricularseArrastre: boolean | null;
	numeroMatriculaAutomatico: boolean | null;
	numeroMatricularAlLegalizar: boolean | null;
	actividadesDocencia: boolean;
	actividadesInvestigacion: boolean;
	actividadesGestion: boolean;
	actividadesPracticasComunitarias: boolean;
	actividadesPracticasPreprofesionales: boolean;
	otrasActividades: boolean;
	calculoCostoId: string;
	createdAt: Date;
	updatedAt: Date;
	enUso: boolean;
	fechasEnMatricula: boolean;
	estructuraParalelosAgrupadosPorNivel: boolean;
	planificacionProfesoresObligatoria: boolean;
	legalizarMatriculas: boolean;
	secuenciaDesdeNumeroEspecifico: boolean;
	numeroMatricula: boolean;
};

type OmitPeriodo =
	| "id"
	| "matriculas"
	| "estado"
	| "abierto"
	| "fechaMatriculas"
	| "actividadesDocencia"
	| "actividadesInvestigacion"
	| "actividadesGestion"
	| "actividadesPracticasComunitarias"
	| "actividadesPracticasPreprofesionales"
	| "numeroMatricula"
	| "secuenciaDesdeNumeroEspecifico"
	| "otrasActividades"
	| "calculoCostoId"
	| "createdAt"
	| "updatedAt"
	| "enUso"
	| "fechasEnMatricula"
	| "estructuraParalelosAgrupadosPorNivel"
	| "planificacionProfesoresObligatoria"
	| "legalizarMatriculas"
	| "secuenciaDesdeNumeroEspecifico";

export type CreatePeriodo = Omit<PeriodoAPI, OmitPeriodo>;

type UpdatePeriodo = {
	id: string;
	data: Partial<CreatePeriodo>;
};

const PeriodoSchema = z.object<ZodInferSchema<PeriodoAPI>>({
	id: z.string(),
    matriculas: z.boolean(),
    estado: z.boolean(),
    abierto: z.boolean(),
    nombre: z.string(),
    inicio: z.coerce.date(),
    fin: z.coerce.date(),
    limiteMatriculaOrdinaria: z.coerce.date().nullable(),
    limiteMatriculaExtraordinaria: z.coerce.date().nullable(),
    limiteMatriculaEspecial: z.coerce.date().nullable(),
    automatriculaAlumnosFechaExtraordinaria: z.null().nullable(),
    tipo: z.string(),
    estudianteSeleccionaParaleloAutomatricula: z.null().nullable(),
    seImpartioNivelacion: z.boolean(),
    planificacionCargaHoraria: z.boolean(),
    planificacionProfesoresFormaTotal: z.null().nullable(),
    aprobacionPlanificacionProfesores: z.null().nullable(),
    cronogramaNotasCoordinacion: z.boolean(),
    legalizacionAutomaticaContraPagos: z.null().nullable(),
    puedenMatricularseArrastre: z.boolean(),
    puedenAutomatricularseSegundasOMasMatriculas: z.boolean(),
    numeroSecuencia: z.null().nullable(),
    numeroMatriculaAutomatico: z.null().nullable(),
    numeroMatricularAlLegalizar: z.null().nullable(),
    actividadesDocencia: z.boolean(),
    actividadesInvestigacion: z.boolean(),
    actividadesGestion: z.boolean(),
    actividadesPracticasComunitarias: z.boolean(),
    actividadesPracticasPreprofesionales: z.boolean(),
    otrasActividades: z.boolean(),
    corteId: z.null().nullable(),
    calculoCostoId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    enUso: z.boolean(),
    fechasEnMatricula: z.boolean(),
    estructuraParalelosAgrupadosPorNivel: z.boolean(),
    planificacionProfesoresObligatoria: z.boolean(),
    legalizarMatriculas: z.boolean(),
    secuenciaDesdeNumeroEspecifico: z.boolean(),
    numeroMatricula: z.boolean(),
});

export class PeriodosLectivosClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async create(data: CreatePeriodo): Promise<SimpleAPIResponse> {
		console.log(data);
		const res = await fetch(this.apiUrl + `/api/periodos-lectivos`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<undefined>;

			throw new APIError(json.message);
		}
		return res.json();
	}
	async getMany(_: void): Promise<APIResponse<PeriodoAPI[]>> {
		const res = this.fetcher(
			z.object({
				data: PeriodoSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + "/api/periodos-lectivos",
		);

		return res;
	}
	async update({ id, data }: UpdatePeriodo): Promise<APIResponse<PeriodoAPI>> {
		console.log(data);
		const res = zodFetcher(
			z.object({
				data: PeriodoSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/periodos-lectivos/${id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		return res;
	}
	async getById({ id }: { id: string }) {
		console.log(id);
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

export class CronogramaMatriculas {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: { cronograma: { data: any; id: string } }) {
		const res = zodFetcher(
			z.object({
				cronograma: PeriodoSchema,
			}),
			`/api/periodos-lectivos/cronograma/${params.cronograma.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.cronograma.data),
			},
		);

		return res;
	}
}

export class TraduccionPeriodosClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update(params: { cronograma: { data: any; id: string } }) {
		const res = zodFetcher(
			z.object({
				cronograma: PeriodoSchema,
			}),
			`/api/periodos-lectivos/cronograma/${params.cronograma.id}`,
			{
				method: "PATCH",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(params.cronograma.data),
			},
		);

		return res;
	}
}

type CreateCronogramaMatriculacionParams = {
	periodoLectivoId: string;
	nivelMallaId: string;
	data: CreateCronogramaMatriculacion;
};
