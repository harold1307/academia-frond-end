import React from "react";
import CortesTable from "./table";
import AddCortes from "./addCortes";
import { APIserver } from "@/core/api-server";

async function CortesPage() {
	const cortes = await APIserver.cortes.getMany()
	return (
		<>
			<div className='mt-4'>
				<React.Suspense fallback={"Cargando tabla..."}>
					<AddCortes />
					<CortesTable cortes={cortes.data} />
				</React.Suspense>
			</div>
		</>
	);
}

export default CortesPage;
