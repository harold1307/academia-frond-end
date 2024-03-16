import React from "react";
import EstructuraOrganicaNavLinks from "./navLinks";

export default function EstructuraOrganica({
	children,
}: React.PropsWithChildren) {
	return (
		<div>
			<div>
				<EstructuraOrganicaNavLinks />
			</div>
			{children}
		</div>
	);
}
