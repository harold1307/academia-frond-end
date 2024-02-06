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

export default function SelectPrograma({
	programas,
	programaId,
}: {
	programas: { id: string; nombre: string }[];
	programaId?: string;
}) {
	const { replaceSet } = useMutateSearchParams();

	return (
		<Select
			onValueChange={v => {
				replaceSet("programaId", v);
			}}
		>
			<SelectTrigger className='w-[180px]' defaultValue={programaId}>
				<SelectValue placeholder='Selecciona un programa' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{programas.map(p => (
						<SelectItem key={p.id} value={p.id}>
							{p.nombre}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
