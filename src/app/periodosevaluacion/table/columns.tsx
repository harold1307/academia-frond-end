import { DatePickerDemo } from "@/app/_components/date-picker";
import { createColumnHelper } from "@tanstack/react-table";

export type CronogramasTableItem = {
	id: string;
	campo: string;
	inicio: string;
	fin: string;
	tipo: string;
};

const helper = createColumnHelper<CronogramasTableItem>();

export const CronogramaColumns = [
	helper.accessor("id", {}),
	helper.accessor("campo", {
		header: "Campo",
	}),
	helper.accessor("inicio", {
		header: "Inicio",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Date materiaId={id} />;
		},
	}),
	helper.accessor("fin", {
		header: "Fin",
		cell: ({ row }) => {
			const id = row.getValue("id") as string;

			return <Date materiaId={id} />;
		},
	}),
	helper.accessor("tipo", {
		header: "Tipo",
	}),
];

type ActionsProps = {
	materiaId: string;
};

const Date = (props: ActionsProps) => {
	const setNewDate = () => {};
	return <DatePickerDemo onChangeValue={setNewDate} />;
};
