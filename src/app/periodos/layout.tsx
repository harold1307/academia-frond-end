"use client";
import { useEffect, useState } from "react";
import PeriodosPageTabs from "./tabs";

export default function MallaLayout({ children }: React.PropsWithChildren) {
	const [locat, setLocat] = useState<string>();

	useEffect(() => {
		console.log(window.location.pathname);
		setLocat(window.location.pathname);
	}, []);
	return (
		<>
			<PeriodosPageTabs />
			{children}
		</>
	);
}
