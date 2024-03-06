import type {
	Administrativo,
	Alumno,
	AsesorEstudiante,
	EstadoAlumno,
	Grupo,
	Inscripcion,
	Profesor,
	TipoUsuario,
	Usuario,
	UsuarioEnGrupo,
} from "@prisma/client";
import { z } from "zod";
import type { ZodFetcher } from "zod-fetch";

import type {
	NonNullableObject,
	ReplaceDateToString,
	ZodInferSchema,
} from "@/utils/types";
import { APIError, type APIResponse, type SimpleAPIResponse } from ".";
import {
	baseAsesorCrmSchema,
	type AsesorCrmFromAPI,
	type CreateAsesorCrmEnCentroInformacion,
} from "./asesores-crm";
import { coordinacionSchema, type CoordinacionFromAPI } from "./coordinaciones";
import {
	baseMallaSchema,
	type MallaCurricularFromAPI,
} from "./mallas-curriculares";
import { modalidadSchema, type ModalidadFromAPI } from "./modalidades";
import {
	baseNivelAcademicoSchema,
	type NivelAcademicoFromAPI,
} from "./niveles-academicos";
import { programaSchema, type ProgramaFromAPI } from "./programas";
import {
	baseResponsableCrmSchema,
	type ResponsableCrmFromAPI,
} from "./responsables-crm";
import { sedeSchema, type SedeFromAPI } from "./sede";

type UpdateProfesor = Partial<
	Omit<Profesor, "id" | "createdAt" | "updatedAt" | "usuarioId">
>;

type UpdateAdministrativo = Partial<
	Omit<Administrativo, "id" | "createdAt" | "updatedAt" | "usuarioId">
>;

type UpdateInscripcion = Partial<
	Omit<
		InscripcionFromAPI,
		| "id"
		| "createdAt"
		| "updatedAt"
		| "sede"
		| "modalidad"
		| "programa"
		| "coordinacion"
		| "malla"
		| "sesion"
		| "alumnoId"
	>
>;

type UpdateAlumno = Partial<
	Omit<Alumno, "id" | "createdAt" | "updatedAt" | "usuarioId" | "asesorCrmId"> &
		UpdateInscripcion
>;

type CreateInscripcion = Omit<
	InscripcionFromAPI,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "sede"
	| "modalidad"
	| "programa"
	| "coordinacion"
	| "malla"
	| "sesion"
	| "matricula"
	| "matricularseConLimite"
>;

type CreateUsuario = Omit<
	UsuarioFromAPI,
	| "administrativo"
	| "profesor"
	| "alumno"
	| "grupos"
	| "estado"
	| "id"
	| "createdAt"
	| "updatedAt"
>;

type CreateProfesor = Omit<
	Profesor,
	"id" | "createdAt" | "updatedAt" | "estado" | "usuarioId"
>;

type CreateAdministrativo = Omit<
	Administrativo,
	| "estado"
	| "id"
	| "createdAt"
	| "updatedAt"
	| "usuarioId"
	| "parametrosInstitucion"
	| "talentoHumano"
	| "personalAdministrativo"
	| "profesores"
	| "periodosLectivos"
	| "asignaturas"
	| "modelosEvaluativos"
	| "crmPreinscritos"
>;

type CreateAlumno = Omit<
	Alumno,
	"id" | "createdAt" | "updatedAt" | "estado" | "usuarioId"
> &
	Omit<CreateInscripcion, "alumnoId">;

type CreateUsuarioAlumnoBody = Omit<
	CreateUsuario,
	"tipo" | "fechaNacimiento" | "emailVerified"
> & {
	fechaNacimiento: string;
	emailVerified: string | null;
} & {
	tipo: typeof TipoUsuario.ALUMNO;
} & Omit<CreateAlumno, "cedula" | "fechaInscripcion" | "fechaExamenSNNA"> & {
		alumnoCedula: boolean;
		fechaInscripcion: string;
		fechaExamenSNNA: string | null;
	};
type CreateUsuarioAdministrativoBody = Omit<
	CreateUsuario,
	"tipo" | "fechaNacimiento" | "emailVerified"
> & {
	fechaNacimiento: string;
	emailVerified: string | null;
} & {
	tipo: typeof TipoUsuario.ADMINISTRATIVO;
} & CreateAdministrativo;
type CreateUsuarioProfesorBody = Omit<
	CreateUsuario,
	"tipo" | "fechaNacimiento" | "emailVerified"
> & {
	fechaNacimiento: string;
	emailVerified: string | null;
} & {
	tipo: typeof TipoUsuario.PROFESOR;
} & CreateProfesor;

export type InscripcionFromAPI = ReplaceDateToString<
	Inscripcion & {
		sede: Omit<SedeFromAPI, "enUso">;
		modalidad: Omit<ModalidadFromAPI, "enUso">;
		programa: Omit<
			ProgramaFromAPI,
			"enUso" | "nivelTitulacion" | "detalleNivelTitulacion"
		>;
		coordinacion: Omit<
			CoordinacionFromAPI,
			"enUso" | "programas" | "profesores"
		>;
		malla: Omit<
			MallaCurricularFromAPI,
			| "enUso"
			| "modalidad"
			| "practicaPreProfesional"
			| "practicaComunitaria"
			| "tituloObtenido"
			| "niveles"
			| "modulos"
		>;
		sesion: Omit<NivelAcademicoFromAPI, "sesion">;
	}
>;

const baseInscripcionSchema = z
	.object<
		ZodInferSchema<
			Omit<
				InscripcionFromAPI,
				"sede" | "modalidad" | "programa" | "coordinacion" | "malla" | "sesion"
			>
		>
	>({
		id: z.string().uuid(),
		matricula: z.boolean(),
		matricularseConLimite: z.boolean(),
		nivelAcademicoId: z.string().uuid(),
		alumnoId: z.string().uuid(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const inscripcionSchema = baseInscripcionSchema
	.extend<
		ZodInferSchema<
			Pick<
				InscripcionFromAPI,
				"sede" | "modalidad" | "programa" | "coordinacion" | "malla" | "sesion"
			>
		>
	>({
		sede: sedeSchema.omit({ enUso: true }),
		modalidad: modalidadSchema.omit({ enUso: true }),
		programa: programaSchema.omit({
			nivelTitulacion: true,
			detalleNivelTitulacion: true,
			enUso: true,
		}),
		coordinacion: coordinacionSchema.omit({
			profesores: true,
			enUso: true,
			programas: true,
		}),
		malla: baseMallaSchema,
		sesion: baseNivelAcademicoSchema,
	})
	.strict();

export type UsuarioFromAPI = ReplaceDateToString<
	Usuario & {
		administrativo: ReplaceDateToString<
			Administrativo & {
				responsableCrm: Omit<ResponsableCrmFromAPI, "administrativo"> | null;
				asesorCrm: Omit<
					AsesorCrmFromAPI,
					"administrativo" | "centrosInformacion"
				> | null;
				asesorEstudiante: ReplaceDateToString<AsesorEstudiante> | null;
				sede: Omit<SedeFromAPI, "enUso">;
			}
		> | null;
		profesor:
			| (ReplaceDateToString<Profesor> & {
					coordinacion: Omit<
						CoordinacionFromAPI,
						"programas" | "enUso" | "profesores"
					>;
					programa: Omit<
						ProgramaFromAPI,
						"enUso" | "nivelTitulacion" | "detalleNivelTitulacion"
					> | null;
			  })
			| null;

		alumno:
			| (ReplaceDateToString<Alumno> & {
					inscripciones: Omit<
						InscripcionFromAPI,
						| "sede"
						| "modalidad"
						| "coordinacion"
						| "malla"
						| "sesion"
						| "programa"
					>[];
			  })
			| null;
		grupos: (ReplaceDateToString<UsuarioEnGrupo> & {
			grupo: ReplaceDateToString<Grupo>;
		})[];
	}
>;

export type UsuarioWithInscripcionesFromAPI = ReplaceDateToString<
	Usuario & {
		administrativo: ReplaceDateToString<
			Administrativo & {
				responsableCrm: Omit<ResponsableCrmFromAPI, "administrativo"> | null;
				asesorCrm: Omit<
					AsesorCrmFromAPI,
					"administrativo" | "centrosInformacion"
				> | null;
				asesorEstudiante: ReplaceDateToString<AsesorEstudiante> | null;
				sede: Omit<SedeFromAPI, "enUso">;
			}
		> | null;
		profesor:
			| (ReplaceDateToString<Profesor> & {
					coordinacion: Omit<
						CoordinacionFromAPI,
						"programas" | "enUso" | "profesores"
					>;
					programa: Omit<
						ProgramaFromAPI,
						"enUso" | "nivelTitulacion" | "detalleNivelTitulacion"
					> | null;
			  })
			| null;

		alumno:
			| (ReplaceDateToString<Alumno> & {
					inscripciones: InscripcionFromAPI[];
			  })
			| null;
		grupos: (ReplaceDateToString<UsuarioEnGrupo> & {
			grupo: ReplaceDateToString<Grupo>;
		})[];
	}
>;

type UsuarioQueryFilter = Partial<
	NonNullableObject<
		Omit<
			UsuarioFromAPI,
			| "administrativo"
			| "profesor"
			| "alumno"
			| "grupos"
			| "estado"
			| "id"
			| "createdAt"
			| "updatedAt"
			| "tipo"
		> & {
			tipo: TipoUsuario[] | TipoUsuario;
			administrativo_estado: boolean;
			profesor_estado: boolean;
			alumno_estado: EstadoAlumno;
			fullTextSearch: string;

			grupoId: string;
			sedeId: string;
		}
	>
>;

const grupoSchema = z
	.object<ZodInferSchema<UsuarioFromAPI["grupos"][number]["grupo"]>>({
		id: z.string().uuid(),
		nombre: z.string(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const usuarioEnGrupoSchema = z
	.object<ZodInferSchema<UsuarioFromAPI["grupos"][number]>>({
		grupoId: z.string().uuid(),
		usuarioId: z.string().uuid(),
		grupo: grupoSchema,
	})
	.strict();

const asesorEstudianteSchema = z
	.object<
		ZodInferSchema<
			Exclude<
				Exclude<UsuarioFromAPI["administrativo"], null>["asesorEstudiante"],
				null
			>
		>
	>({
		id: z.string().uuid(),
		administrativoId: z.string().uuid(),
		estado: z.boolean(),
		seguimientoBienestar: z.boolean(),
		seguimientoExpediente: z.boolean(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const administrativoSchema = z
	.object<ZodInferSchema<Exclude<UsuarioFromAPI["administrativo"], null>>>({
		id: z.string().uuid(),
		estado: z.boolean(),
		parametrosInstitucion: z.boolean(),
		talentoHumano: z.boolean(),
		personalAdministrativo: z.boolean(),
		profesores: z.boolean(),
		periodosLectivos: z.boolean(),
		asignaturas: z.boolean(),
		modelosEvaluativos: z.boolean(),
		crmPreinscritos: z.boolean(),
		sedeId: z.string().uuid(),
		usuarioId: z.string().uuid(),

		sede: sedeSchema.omit({ enUso: true }),
		asesorCrm: baseAsesorCrmSchema.nullable(),
		asesorEstudiante: asesorEstudianteSchema.nullable(),
		responsableCrm: baseResponsableCrmSchema.nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const profesorSchema = z
	.object<ZodInferSchema<Exclude<UsuarioFromAPI["profesor"], null>>>({
		id: z.string().uuid(),
		estado: z.boolean(),
		tiempoDedicacion: z.enum([
			"TIEMPO_COMPLETO",
			"TIEMPO_PARCIAL",
			"MEDIO_TIEMPO",
		] as const),
		categoria: z.enum([
			"HONORARIO",
			"INVITADO",
			"OCASIONAL",
			"TITULAR_AGREGADO",
			"TITULAR_AUXILIAR",
			"TITULAR_PRINCIPAL",
		] as const),
		coordinacionId: z.string().uuid(),
		programaId: z.string().uuid().nullable(),
		usuarioId: z.string().uuid(),

		coordinacion: coordinacionSchema.omit({
			programas: true,
			enUso: true,
			profesores: true,
		}),
		programa: programaSchema
			.omit({
				enUso: true,
				nivelTitulacion: true,
				detalleNivelTitulacion: true,
			})
			.nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

const alumnoSchema = z
	.object<ZodInferSchema<Exclude<UsuarioFromAPI["alumno"], null>>>({
		id: z.string().uuid(),
		estado: z.enum(["ACTIVO", "EGRESADO", "RETIRADO"] as const),
		colegio: z.string().nullable(),
		especialidad: z.string().nullable(),
		fechaInscripcion: z.string().datetime(),
		codigoPromocion: z.string().nullable(),
		archivador: z.string().nullable(),
		comoNosConocio: z.enum([
			"FACEBOOK",
			"INSTAGRAM",
			"OTROS_MEDIOS",
			"PERIODICO",
			"PUBLICIDAD_FISICA",
			"RADIO",
			"REDES_SOCIALES",
			"TELEVISION",
			"TIKTOK",
			"TWITTER",
			"UN_AMIGO_ESTUDIO_AQUI",
			"UN_FAMILIAR_ESTUDIO_AQUI",
			"VISITAS_A_COLEGIOS",
		] as const),
		razonesParaInscribirse: z.enum([
			"AMIGOS",
			"CARRERAS",
			"HORARIOS",
			"INSTALACIONES",
			"MENCIONES",
		] as const),
		fechaExamenSNNA: z.string().datetime().nullable(),
		puntajeSNNA: z.number().nullable(),
		titulo: z.boolean(),
		papeletaVotacion: z.boolean(),
		copiaLicencia: z.boolean(),
		condicionado: z.boolean(),
		rindioExamenEgresoInstitucion: z.boolean(),
		actaGrado: z.boolean(),
		partidaNacimiento: z.boolean(),
		certificadoAntecedentes: z.boolean(),
		planillaServicioBasico: z.boolean(),
		transferenciaOtraIES: z.boolean(),
		certificadoEstudios: z.boolean(),
		documentosHomologacion: z.boolean(),
		certificadoSanguineo: z.boolean(),
		silabos: z.boolean(),
		cedula: z.boolean(),
		fotos: z.boolean(),
		certificadoSalud: z.boolean(),
		transcript: z.boolean(),
		observaciones: z.string().nullable(),
		usuarioId: z.string().uuid(),
		asesorCrmId: z.string().uuid().nullable(),
		centroInformacionId: z.string().uuid(),

		inscripciones: baseInscripcionSchema.array(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const baseUsuarioSchema = z
	.object<
		ZodInferSchema<
			Omit<UsuarioFromAPI, "administrativo" | "profesor" | "alumno" | "grupos">
		>
	>({
		id: z.string().uuid(),
		estado: z.boolean(),
		tipo: z.enum(["ADMINISTRATIVO", "PROFESOR", "ALUMNO"] as const),
		cedula: z.string().nullable(),
		pasaporte: z.string().nullable(),
		nombres: z.string().toUpperCase().trim(),
		primerApellido: z.string().toUpperCase().trim(),
		segundoApellido: z.string().toUpperCase().trim().nullable(),
		nacionalidad: z.string().nullable(),
		paisNacimiento: z.string().nullable(),
		provinciaNacimiento: z.string().nullable(),
		cantonNacimiento: z.string().nullable(),
		parroquiaNacimiento: z.string().nullable(),
		fechaNacimiento: z.string().datetime(),
		sexo: z.enum(["HOMBRE", "MUJER"] as const),
		genero: z.enum(["FEMENINO", "MASCULINO"] as const).nullable(),
		etnia: z
			.enum([
				"AFROECUATORIANO",
				"BLANCO",
				"INDIGENA",
				"MESTIZO",
				"MONTUVIO",
				"MULATO",
				"NEGRO",
				"OTRO",
			] as const)
			.nullable(),
		estadoCivil: z
			.enum([
				"SOLTERO",
				"CASADO",
				"DIVORCIADO",
				"UNION_LIBRE",
				"UNION_DE_HECHO",
				"VIUDO",
			] as const)
			.nullable(),
		tipoSangre: z.string().nullable(),
		paisResidencia: z.string().nullable(),
		callePrincipal: z.string().nullable(),
		calleSecundaria: z.string().nullable(),
		numeroDomicilio: z.string().nullable(),
		provinciaDondeSufraga: z.string().nullable(),
		telefonoMovil: z.string().nullable(),
		telefonoFijo: z.string().nullable(),
		correoElectronico: z.string().email().nullable(),
		correoInstitucional: z.string().email().nullable(),

		email: z.string().email().nullable(),
		emailVerified: z.string().datetime().nullable(),
		image: z.string().nullable(),
		name: z.string().nullable(),

		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	})
	.strict();

export const usuarioSchema = baseUsuarioSchema
	.extend<
		ZodInferSchema<
			Pick<UsuarioFromAPI, "administrativo" | "profesor" | "alumno" | "grupos">
		>
	>({
		administrativo: administrativoSchema.nullable(),
		profesor: profesorSchema.nullable(),
		alumno: alumnoSchema.nullable(),
		grupos: usuarioEnGrupoSchema.array(),
	})
	.strict();

export const usuarioWithInscripcionesSchema = baseUsuarioSchema.extend<
	ZodInferSchema<
		Pick<
			UsuarioWithInscripcionesFromAPI,
			"administrativo" | "profesor" | "alumno" | "grupos"
		>
	>
>({
	administrativo: administrativoSchema.nullable(),
	profesor: profesorSchema.nullable(),
	alumno: alumnoSchema
		.omit({ inscripciones: true })
		.extend({
			inscripciones: inscripcionSchema.array(),
		})
		.nullable(),
	grupos: usuarioEnGrupoSchema.array(),
});

export class UsuarioClass {
	constructor(
		private apiUrl: string,
		private fetcher: ZodFetcher<typeof fetch>,
	) {}

	async update({
		data,
		id,
	}: UpdateUsuarioParams): Promise<APIResponse<UsuarioFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: usuarioSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/usuarios/${id}`,
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

	/** Create a new user */
	async create(
		data:
			| CreateUsuarioAlumnoBody
			| CreateUsuarioAdministrativoBody
			| CreateUsuarioProfesorBody,
	): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/usuarios`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	async getMany(
		params?: GetManyUsuariosParams,
	): Promise<
		APIResponse<
			GetManyUsuariosParams["withInscripciones"] extends true
				? UsuarioWithInscripcionesFromAPI[]
				: UsuarioFromAPI[]
		>
	> {
		const { filters, withInscripciones } = params || {};

		const searchParams = new URLSearchParams();

		Object.entries(filters || {}).forEach(([k, v]) => {
			if (v !== undefined) {
				searchParams.set(k, `${v}`);
			}
		});

		if (withInscripciones) {
			return this.fetcher(
				z.object({
					data: usuarioWithInscripcionesSchema.array(),
					message: z.string(),
				}),
				this.apiUrl + `/api/usuarios?${searchParams.toString()}`,
			);
		}

		const res = this.fetcher(
			z.object({
				data: usuarioSchema.array(),
				message: z.string(),
			}),
			this.apiUrl + `/api/usuarios?${searchParams.toString()}`,
		);

		return res;
	}

	async getById(id: string): Promise<APIResponse<UsuarioFromAPI | null>> {
		const res = this.fetcher(
			z.object({
				data: usuarioSchema.nullable(),
				message: z.string(),
			}),
			this.apiUrl + `/api/usuarios/${id}`,
		);

		return res;
	}

	/** Create ALUMNO access from existing user */
	async createAlumno({
		userId,
		data,
	}: CreateAlumnoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(this.apiUrl + `/api/usuarios/${userId}/alumnos`, {
			method: "POST",
			headers: {
				"Context-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
	/** Create PROFESOR access from existing user */
	async createProfesor({
		userId,
		data,
	}: CreateProfesorParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/usuarios/${userId}/profesores`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
	/** Create ADMINISTRATIVO access from existing user */
	async createAdministrativo({
		userId,
		data,
	}: CreateAdministrativoParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/usuarios/${userId}/administrativos`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
	/** Inscribe an existing user on a nivel academico */
	async createInscripcion({
		userId,
		data,
	}: CreateInscripcionParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/usuarios/${userId}/inscripciones`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	/** Append user to an existing group */
	async appendToGroup({
		userId,
		groupId,
	}: MutateUserInGroup): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/usuarios/${userId}/grupos/${groupId}`,
			{
				method: "POST",
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
	/** Remove user from an existing group */
	async removeFromGroup({
		userId,
		groupId,
	}: MutateUserInGroup): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/usuarios/${userId}/grupos/${groupId}`,
			{
				method: "DELETE",
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	/** Update Inscripcion and Alumno data from an existing user with ALUMNO access */
	async updateWithInscripcion({
		data,
		inscriptionId,
		userId,
	}: UpdateWithInscripcionParams): Promise<APIResponse<UsuarioFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: usuarioSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/usuarios/${userId}/inscripciones/${inscriptionId}`,
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
	/** Update Administrativo data from an existing user with ADMINISTRATIVO access */
	async updateAdministrativo({
		data,
		userId,
	}: UpdateAdministrativoParams): Promise<APIResponse<UsuarioFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: usuarioSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/usuarios/${userId}/administrativos`,
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
	/** Update Profesor data from an existing user with PROFESOR access */
	async updateProfesor({
		data,
		userId,
	}: UpdateProfesorParams): Promise<APIResponse<UsuarioFromAPI>> {
		const res = this.fetcher(
			z.object({
				data: usuarioSchema,
				message: z.string(),
			}),
			this.apiUrl + `/api/usuarios/${userId}/profesores`,
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

	/** Create asesor crm access from existing user */
	async createAsesorCrm({
		userId,
		data,
	}: CreateAsesorCrmParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/usuarios/${userId}/asesores-crm`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}

	/** Create responsable crm access from existing user */
	async createResponsableCrm({
		userId,
	}: CreateResponsableCrmParams): Promise<SimpleAPIResponse> {
		const res = await fetch(
			this.apiUrl + `/api/usuarios/${userId}/responsables-crm`,
			{
				method: "POST",
				headers: {
					"Context-Type": "application/json",
				},
			},
		);

		if (!res.ok) {
			const json = (await res.json()) as APIResponse<unknown>;
			throw new APIError(json.message);
		}

		return res.json();
	}
}

type GetManyUsuariosParams = {
	filters?: UsuarioQueryFilter;
	/** Set to true when want to include more data on inscripciones */
	withInscripciones?: boolean;
};

type UpdateUsuarioParams = {
	id: string;
	data: Partial<
		Omit<
			UsuarioFromAPI,
			| "administrativo"
			| "profesor"
			| "alumno"
			| "grupos"
			| "id"
			| "createdAt"
			| "updatedAt"
			| "tipo"
		>
	>;
};
type CreateAlumnoParams = {
	userId: string;
	data: Omit<CreateAlumno, "fechaInscripcion" | "fechaExamenSNNA"> & {
		fechaInscripcion: string;
		fechaExamenSNNA: string | null;
	};
};
type CreateProfesorParams = {
	userId: string;
	data: CreateProfesor;
};
type CreateAdministrativoParams = {
	userId: string;
	data: CreateAdministrativo;
};
type CreateInscripcionParams = {
	userId: string;
	data: Omit<CreateInscripcion, "alumnoId">;
};
type MutateUserInGroup = {
	userId: string;
	groupId: string;
};
type UpdateWithInscripcionParams = {
	userId: string;
	inscriptionId: string;
	data: UpdateAlumno;
};
type UpdateAdministrativoParams = {
	userId: string;
	data: UpdateAdministrativo;
};
type UpdateProfesorParams = {
	userId: string;
	data: UpdateProfesor;
};
type CreateAsesorCrmParams = {
	userId: string;
	data: Omit<CreateAsesorCrmEnCentroInformacion, "asesorCrmId">;
};
type CreateResponsableCrmParams = {
	userId: string;
};
