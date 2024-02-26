"use client";
import React from "react";
import Link from "next/link";
import { ROUTES } from "@/core/routes";
import { useSearchParams } from "next/navigation";

const SECTIONS = [
	{
		label: "Personal",
		href: ROUTES.talentoHumano.path + "?section=0",
		section: "0",
	},
	{
		label: "Asesores",
		href: ROUTES.talentoHumano.path + "?section=1",
		section: "1",
	},
	{
		label: "Estructura Orgánica",
		href: ROUTES.talentoHumano.path + "?section=2",
		section: "2",
	},
	{
		label: "Modelos de contrato",
		href: ROUTES.talentoHumano.path + "?section=3",
		section: "3",
	},
];
export default function TalentoHumanoNavLinks() {
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