import AddInstitucion from "./add-institucion";
import InstitucionTable from "./table";

export default function InstitucionPage() {
	return (
		<>
			<div className='mt-4'>
				<AddInstitucion />
				<InstitucionTable />
			</div>
		</>
	);
}
