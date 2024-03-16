"use client"
import { useMutateSearchParams } from "@/hooks/use-mutate-search-params";
import { Input } from "../_components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../_components/ui/select";


export default function SelectNivel({ programa, programaId }: { programa: { id: string, nombre: string | null }[]; programaId?: string; }) {
	const { replaceSet } = useMutateSearchParams()
	return (
		<div className='my-4 flex h-full w-full items-center justify-center'>
			<Select
				onValueChange={v => {
					replaceSet("programaId", v);
				}}
				defaultValue={programaId}
			>
				<SelectTrigger>
					<SelectValue placeholder='Selecciona una carrera' />
				</SelectTrigger>
				<SelectContent>
					{programa.map(el => (
						<SelectItem key={el.id} value={el.id}>
							{el.nombre}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
