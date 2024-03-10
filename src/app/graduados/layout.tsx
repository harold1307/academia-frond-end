"use client";

import GraduadosTabs from "./tabs";

export default function GraduadosLayout({ children }: React.PropsWithChildren) {
	return (
		<>
			<GraduadosTabs />
			{children}
		</>
	);
}
