"use client"

import { useState } from "react";
import { CarreraTableItem, CarrerasColumns } from "./columns";
import { DataTable } from "./data-table";
import { DropdownMenu , DropdownMenuTrigger , DropdownMenuContent , DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { CollapsibleItem } from "@/app/_components/ui/collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Header } from "../../table";

export interface CarrerasServerData {
   nombre: string,
   modalidad: {
      nombre: string,
      materias: CarreraTableItem[]
   }[]
}

interface CarrerasProps {
   data: CarrerasServerData[]
}

export default function CarrerasTable ({data}: CarrerasProps) {
   
   //const [carrera, setCarrera] = useState<number>(0)

   const handleSelect = (e: any) => {
      //Asumo que el endpoint aca trae las materias correspondientes a esa carrera
      console.log(e)
   }

   return(
      <>
      <DropdownMenu>
			<DropdownMenuTrigger className="w-full text-white-500 rounded-md text-lg shadow-primaryShadow [&_tr]:border-b justify-start py-2">	
			{data[0]?.nombre ? data[0]?.nombre : 'Selecciona la carrera'}
			</DropdownMenuTrigger>
				<DropdownMenuContent>
				{data.map(carrera => 
					<DropdownMenuItem 
               className="text-white-500 rounded-md text-lg shadow-primaryShadow [&_tr]:border-b justify-start py-2 my-1 w-full"
               onSelect={handleSelect}
               >
                     {carrera.nombre}
					</DropdownMenuItem>
					)}
				</DropdownMenuContent>
		</DropdownMenu>
         {data[0]?.modalidad.map(modalidad => {
            return(
               <Header>
                  <CollapsibleItem>
                     <CollapsibleTrigger>
                        {modalidad.nombre}
                     </CollapsibleTrigger>
                     <CollapsibleContent>
                        <DataTable data={modalidad.materias} columns={CarrerasColumns} />
                     </CollapsibleContent>
                  </CollapsibleItem>
               </Header>
            )
         })}
      </>
   )
}