import React from "react";

import AddSede from "./add-sede";
import SedeTableServer from "./table/server";

type Context = {
	params: {
		mallaId: string;
	};
};

export const dynamic = "force-dynamic";

export default function SedesPage({ params }: Context) {
	return (
		<>
			<div className='mt-4'>
				<AddSede mallaId={params.mallaId} />
				<React.Suspense fallback={"Cargando tabla..."}>
					<SedeTableServer mallaId={params.mallaId} />
				</React.Suspense>
			</div>
		</>
	);
}
