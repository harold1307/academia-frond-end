"use client";
import React from "react";

import type { MallaCurricularFromAPI } from "@/core/api/mallas-curriculares";
import { formatDate } from "@/utils";

export default function MallaName({
	malla,
}: {
	malla: MallaCurricularFromAPI;
}) {
	const mallaName = React.useMemo(
		() =>
			[
				malla.modalidad.nombre,
				formatDate(malla.fechaAprobacion, {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}),
				formatDate(malla.fechaLimiteVigencia, {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}),
				malla.codigo,
			]
				.filter(v => !!v)
				.join(" - "),
		[malla],
	);

	return <h2 className='text-lg font-medium'>Malla: {mallaName}</h2>;
}
