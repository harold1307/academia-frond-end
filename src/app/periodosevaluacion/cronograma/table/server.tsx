import CarrerasTable, { type CarrerasServerData } from ".";

export const carrerasData: CarrerasServerData[] = [
	{
		nombre: "ADMINISTRACION FINANCIERA",
		modalidad: [
			{
				nombre: "1B Administracion EN LINEA",
				materias: [
					{
						estado: false,
						materia: "Contabilidad",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
					{
						estado: false,
						materia: "Dibujo",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
					{
						estado: false,
						materia: "Ilustracion",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
				],
			},
			{
				nombre: "2B Administracion EN LINEA",
				materias: [
					{
						estado: false,
						materia: "Danza clasica",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
					{
						estado: false,
						materia: "Administracion",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
					{
						estado: false,
						materia: "Ilustracion",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
				],
			},
			{
				nombre: "3B Administracion EN LINEA",
				materias: [
					{
						estado: false,
						materia: "Contabilidad",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
					{
						estado: false,
						materia: "Administracion",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
					{
						estado: false,
						materia: "Ilustracion",
						inicio: "10-12-2024",
						fin: "10-12-2024",
						profesor: "Mario Araujo",
					},
				],
			},
		],
	},
];
export default function CarrerasDataTableServer() {
	//Fetch...
	return <CarrerasTable data={carrerasData} />;
}
