"use client";
import Link from "next/link";
import React from "react";

import { Button } from "@/app/_components/ui/button";
import {
	CollapsibleContent,
	CollapsibleItem,
	CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import { ROUTES } from "@/core/routes";
import AddCronograma from "./add-cronograma";
import { CronogramaColumns, type CronogramasTableItem } from "./columns";
import { DataTable } from "./data-table";

type ModelosProps = {
	nombre: string;
	cronogramas: {
		nombre: string;
		materias: CronogramasTableItem[];
	}[];
};

interface PeriodosEvaluativoProps {
	data: ModelosProps[];
}

export default function CronogramasTable({ data }: PeriodosEvaluativoProps) {
	// const MateriasDeNivel = React.useMemo(() => {
	// 	return data?.map(
	// 		MateriasDeNivel =>
	// 			({
	// 				...MateriasDeNivel,
	// 			}) satisfies ModelosProps,
	// 	);
	// }, [data]);

	return (
		<section className=''>
			{data.map((modelo, i) => {
				return (
					<Header key={i}>
						<h1>{modelo.nombre}</h1>
						{modelo.cronogramas.map((cronograma, i) => {
							return (
								<div key={i}>
									<CollapsibleItem>
										<Header className='flex justify-between'>
											<h2>{cronograma.nombre}</h2>
											<div>
												<Link href={ROUTES.periodoEvaluacion.materias("0")}>
													<Button variant='success'>Materias</Button>
												</Link>
												<CollapsibleTrigger asChild>
													<Button variant='secondary'>Fechas</Button>
												</CollapsibleTrigger>
											</div>
										</Header>
										<CollapsibleContent>
											<DataTable
												columns={CronogramaColumns}
												data={cronograma.materias}
											/>
										</CollapsibleContent>
									</CollapsibleItem>
									<AddCronograma />
								</div>
							);
						})}
					</Header>
				);
			})}
		</section>
	);
}

interface HeaderProps {
	className?: string;
	children: React.ReactNode;
}

export const Header = ({ className, children }: HeaderProps) => (
	<div
		className={`text-white-500 my-4 w-full justify-start rounded-md px-2 py-4 text-lg shadow-primaryShadow [&_tr]:border-b ${className}`}
	>
		{children}
	</div>
);
