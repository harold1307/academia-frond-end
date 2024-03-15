"use client";
import React from "react";
import Link from "next/link";
import { ROUTES } from "@/core/routes";
import { useSearchParams } from "next/navigation";

const SECTIONS = [
	{
		label: "Departamentos",
		href: ROUTES.talentoHumano.path + "?section=2?subsection=0",
		section: "2?subsection=0",
	},
	{
		label: "Cargos",
		href: ROUTES.talentoHumano.path + "?section=2?subsection=1",
		section: "2?subsection=1",
	},
	{
		label: "Funciones",
		href: ROUTES.talentoHumano.path + "?section=2?subsection=2",
		section: "2?subsection=2",
	},
];
export default function EstructuraOrganicaNavLinks() {
	const params = useSearchParams();

	return (
		<div>
			<ul className='500 flex items-center justify-start gap-4 border-b-2'>
				{SECTIONS.map(t => (
					<li
						key={t.label}
						className={`rounded-t border-2 p-2 ${
							params.get("section") === t.section ? "border-b-0" : ""
						}`}
					>
						<Link href={t.href}>{t.label}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
