import { APIResponse } from "@/core/api";
import { APIserver } from "@/core/api-server";
import { MallaCurricular } from "@prisma/client";
import { Button } from "../_components/ui/button";
const niveles = [
	{
		label: "1er Nivel",
	},
	{
		label: "2do Nivel",
	},
	{
		label: "3er Nivel",
	},
	{
		label: "4to Nivel",
	},
];

interface MallaData {
	data: MallaCurricular[]
}

export default async function Niveles({ programaId } : { programaId: string | undefined }) {

	//const mallas = await APIserver.mallasCurriculares.getMany( { programaId } ) 

	
	return (
		<ul className='flex w-full items-center justify-start'>
			
			{niveles.map(el => {
				return (
					<Button key={el.label} className='mx-4'>
						{el.label}
					</Button>
				);
			})}
		</ul>
	);
}
