import { createColumnHelper } from "@tanstack/react-table";
import { DatePickerDemo } from "@/app/_components/date-picker";
import { Checkbox } from "@/app/_components/ui/checkbox";

export type CarreraTableItem = {
	estado: boolean,
	materia: string,
	inicio: string,
	fin: string,
	profesor: string
}

const helper = createColumnHelper<CarreraTableItem>();

export const CarrerasColumns = [
	helper.accessor("estado", {
		header: '',
		cell: ({ row }) => {
			const id = row.getValue("id") as string
			
			return <StateManager materiaId={id} />
		}
	}),
	helper.accessor("materia", {
		header: 'Materia'
	}),
	helper.accessor("inicio", {
		header: "Inicio",
		cell: ({ row }) => {
			const id = row.getValue("id") as string
			
			return <Date materiaId={id} />
		}
	}),
	helper.accessor("fin", {
		header: "Fin",
		cell: ({ row }) => {
			const id = row.getValue("id") as string
			
			return <Date materiaId={id} />
		}
	}),
	helper.accessor("profesor", {
		header: 'Profesor'
	}),
];


type ActionProps = {
	materiaId: string
}


const Date = (props : ActionProps ) => {

	const setNewDate = () => {}
	return <DatePickerDemo onChangeValue={setNewDate} />
}

const StateManager = (props: ActionProps) => {

	return <Checkbox />	
}