"use client";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";

export default function SelectSesion({
	sesiones,
	sesionId,
}: {
	sesiones: { id: string; nombre: string }[];
	sesionId?: string;
}) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<Select
			onValueChange={v => {
				replaceSet("sesionId", v);
			}}
			defaultValue={sesionId}
		>
			<SelectTrigger className='mb-2 w-[300px]'>
				<SelectValue placeholder='Selecciona una sesion' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{sesiones.map(p => (
						<SelectItem key={p.id} value={p.id}>
							{p.nombre}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
