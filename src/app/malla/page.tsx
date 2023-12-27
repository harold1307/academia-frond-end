import AddMalla from "./add-malla";
import MallaCurricularTable from "./table";

export default function MallaPage() {
	return (
		<>
			<div className='mt-4'>
				<AddMalla />
				<MallaCurricularTable />
			</div>
		</>
	);
}
