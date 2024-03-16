const niveles = [
	{
		label: "1er Nivel",
	},
	{
		label: "2do Nivel",
	},
	{
		label: "3er Nivel",
	},
	{
		label: "4to Nivel",
	},
];

export default function Niveles() {
	return (
		<ul className='flex w-full items-center justify-start'>
			{niveles.map(el => {
				return <li className='mx-4'>{el.label}</li>;
			})}
		</ul>
	);
}
