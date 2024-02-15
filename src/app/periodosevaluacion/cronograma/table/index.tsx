"use client";
import {
	CollapsibleContent,
	CollapsibleItem,
	CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Header } from "../../table";
import { CarrerasColumns, type CarreraTableItem } from "./columns";
import { DataTable } from "./data-table";

export interface CarrerasServerData {
	nombre: string;
	modalidad: {
		nombre: string;
		materias: CarreraTableItem[];
	}[];
}

interface CarrerasProps {
	data: CarrerasServerData[];
}

export default function CarrerasTable({ data }: CarrerasProps) {
	//const [carrera, setCarrera] = useState<number>(0)

	const handleSelect = (e: any) => {
		//Asumo que el endpoint aca trae las materias correspondientes a esa carrera
		console.log(e);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className='text-white-500 w-full justify-start rounded-md py-2 text-lg shadow-primaryShadow [&_tr]:border-b'>
					{data[0]?.nombre ? data[0]?.nombre : "Selecciona la carrera"}
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{data.map(carrera => (
						<DropdownMenuItem
							className='text-white-500 my-1 w-full justify-start rounded-md py-2 text-lg shadow-primaryShadow [&_tr]:border-b'
							onSelect={handleSelect}
							key={carrera.nombre}
						>
							{carrera.nombre}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{data[0]?.modalidad.map(modalidad => {
				return (
					<Header key={modalidad.nombre}>
						<CollapsibleItem>
							<CollapsibleTrigger>{modalidad.nombre}</CollapsibleTrigger>
							<CollapsibleContent>
								<DataTable
									data={modalidad.materias}
									columns={CarrerasColumns}
								/>
							</CollapsibleContent>
						</CollapsibleItem>
					</Header>
				);
			})}
		</>
	);
}
