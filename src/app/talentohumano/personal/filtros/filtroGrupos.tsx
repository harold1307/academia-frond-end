import * as React from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";

export function FiltroGrupos() {
	return (
		<Select>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Todos los Grupos' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Fruits</SelectLabel>
					<SelectItem value='apple'>Apple</SelectItem>
					<SelectItem value='banana'>Banana</SelectItem>
					<SelectItem value='blueberry'>Blueberry</SelectItem>
					<SelectItem value='grapes'>Grapes</SelectItem>
					<SelectItem value='pineapple'>Pineapple</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}