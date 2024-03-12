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

export default function SelectSede({
	sedes,
	sedeId,
}: {
	sedes: { id: string; nombre: string }[];
	sedeId?: string;
}) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<Select
			onValueChange={v => {
				replaceSet("sedeId", v);
			}}
			defaultValue={sedeId}
		>
			<SelectTrigger className='mb-2 w-[300px]'>
				<SelectValue placeholder='Selecciona una sede' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{sedes.map(p => (
						<SelectItem key={p.id} value={p.id}>
							{p.nombre}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
