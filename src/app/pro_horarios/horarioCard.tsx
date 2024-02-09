import { ROUTES } from "@/core/routes";
import Link from "next/link";

export type HorarioCardT = {
	id: string;
	horaInicio: string;
	horaFin: string;
	nombre: string;
	aula: string;
};

export type HorarioCardProps = {
	data: HorarioCardT;
};

export default function HorarioCard({ data }: HorarioCardProps) {
	return (
		<div className='flex flex-col items-center justify-center rounded-md border-2 p-4'>
			<span>
				{data.horaInicio} a {data.horaFin}
			</span>
			<br />
			<span>{data.nombre}</span>
			<br />
			<span>{data.aula}</span>
			<br />
			<Link
				className='rounded-md border-2 p-2'
				href={ROUTES.proHorarios.detalleHorario(data.id)}
			>
				Ir a la clase
			</Link>
		</div>
	);
}
