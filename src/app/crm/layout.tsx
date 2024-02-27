"use client";
import { useEffect, useState } from "react";
import CrmPageTabs from "./tabs";

export default function CrmLayout({ children }: React.PropsWithChildren) {
	const [locat, setLocat] = useState<string>();

	useEffect(() => {
		console.log(window.location.pathname);
		setLocat(window.location.pathname);
	}, []);
	return (
		<>
			<CrmPageTabs />
			{children}
		</>
	);
}
