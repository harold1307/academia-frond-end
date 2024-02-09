import { DatePickerDemo } from "@/app/_components/date-picker";
import { createColumnHelper } from "@tanstack/react-table";

export type MateriasDeNivelTableItem = {
   id:string, 
	campo: string,
   inicio: string,
   fin: string,
   tipo: string
}

const helper = createColumnHelper<MateriasDeNivelTableItem>();

export const MateriasDeNivelColumns = [
	helper.accessor("id",{}),
	helper.accessor("campo", {
		header: "Campo",
	}),
	helper.accessor("inicio", {
		header: "Inicio",
		cell: ({ row }) => {
			const id = row.getValue("id") as string
			
			return <Actions materiaId={id} />
		}
	}),
	helper.accessor("fin", {
		header: "Fin",
		cell: ({ row }) => {
			const id = row.getValue("id") as string
			
			return <Actions materiaId={id} />
		}
	}),
	helper.accessor("tipo", {
		header: "Tipo",
	})
];

type ActionsProps = {
	materiaId: string
}


const Actions = (props : ActionsProps ) => {

	const setNewDate = () => {}
	return <DatePickerDemo onChangeValue={setNewDate} />
}