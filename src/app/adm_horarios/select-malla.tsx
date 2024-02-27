import { APIserver } from "@/core/api-server";
import { Input } from "../_components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../_components/ui/select";

const mallas = [
	{
		nombre: "Malla1",
	},
	{
		nombre: "Malla2",
	},
	{
		nombre: "Malla3",
	},
];

export default async function SelectMalla() {
	// const mallas = await APIserver.mallasCurriculares.getMany({
	// 	programaId,
	// });
	// return (
	// 	<div className='my-4 flex h-full w-full items-center justify-center'>
	// 		<Select>
	// 			<SelectTrigger>
	// 				<SelectValue placeholder='select malla' />
	// 			</SelectTrigger>
	// 			<SelectContent>
	// 				{mallas.map(el => (
	// 					<SelectItem key={el.nombre} value={el.nombre}>
	// 						{el.nombre}
	// 					</SelectItem>
	// 				))}
	// 			</SelectContent>
	// 		</Select>
	// 	</div>
	// );
}
