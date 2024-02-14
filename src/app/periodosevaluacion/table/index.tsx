"use client"
import React from "react";
import { DataTable } from "./data-table";
import { CronogramaColumns, CronogramasTableItem } from "./columns";
import AddCronograma from "./add-cronograma";
import { CollapsibleContent , CollapsibleTrigger , CollapsibleItem } from "@/app/_components/ui/collapsible";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { ROUTES } from "@/core/routes";

type ModelosProps = {
	nombre: string,
	cronogramas: 
		{
			nombre: string,
			materias: CronogramasTableItem[]
		}[]
}

interface PeriodosEvaluativoProps {
	data: ModelosProps[]
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
			{data.map((modelo,i) => {
				return(
					<Header key={i}>
						<h1>{modelo.nombre}</h1>
						{modelo.cronogramas.map((cronograma,i) => {
							return(
								<div key={i}>
									<CollapsibleItem>
										<Header className="flex justify-between">
										<h2>{cronograma.nombre}</h2>
											<div>
												<Link href={ROUTES.periodoEvaluacion.materias('0')}>
													<Button variant='success'>Materias</Button>
												</Link>
												<CollapsibleTrigger asChild>
													<Button variant='secondary'>Fechas</Button>
												</CollapsibleTrigger>
											</div>
										</Header>
										<CollapsibleContent>
											<DataTable columns={CronogramaColumns} data={cronograma.materias} />
										</CollapsibleContent>
									</CollapsibleItem>
									<AddCronograma />
								</div>
							)
						})}
					</Header>
				)
			})}
		</section>
	);
}


interface HeaderProps {
	className?: string;
	key?: number
	children: React.ReactNode;
 }

 
export const Header =({className, key, children}: HeaderProps) => <div key={key} className={`w-full text-white-500 rounded-md text-lg shadow-primaryShadow [&_tr]:border-b justify-start px-2 py-4 my-4 ${className}`}>{children}</div>