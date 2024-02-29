import React from "react";
import RequisitoTable from "./table";
import AddReq from "./addReq";
import { APIserver } from "@/core/api-server";

export const dynamic = "force-dynamic";

export default async function RequisitoPage({ params }: any) {
	const requisitos = await APIserver.requisitos.getById(params?.periodoId);
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddReq />
					<RequisitoTable requisitos={requisitos} />
				</React.Suspense>
			</div>
		</>
	);
}
