import InscritosTable from "./tableInscritos";
import InteresadosTable from "./tableInteresados";

function SeguimientoPage() {
	return (
		<>
			<InteresadosTable mallas={MUInteresados} />
			<InscritosTable mallas={MUInscritos} />
		</>
	);
}

const MUInscritos = [{}];

const MUInteresados = [{}];

export default SeguimientoPage;
