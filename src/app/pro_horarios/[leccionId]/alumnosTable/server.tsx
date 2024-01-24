import AlumnosEnClaseTable from ".";
import HorariosTable from ".";
import { AlumnosEnClase } from "./columns";

//MockUp data
const alumnos:AlumnosEnClase[] = [
    {
        id: '1',
        foto: 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg',
        asistencia: false,
        porcentajeAsistencia: 0,
        estudiante: 'NombreEstudiante1',
        evaluaciones: ''
    },
    {
        id: '12',
        foto: 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg',
        asistencia: false,
        porcentajeAsistencia: 0,
        estudiante: 'NombreEstudiante12',
        evaluaciones: ''
    },
    {
        id: '123',
        foto: 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg',
        asistencia: false,
        porcentajeAsistencia: 0,
        estudiante: 'NombreEstudiante123',
        evaluaciones: ''
    }
]

export default async function AlumnosEnClaseTableServer() {
	//Fetch alumnos

	return <AlumnosEnClaseTable data={alumnos} />;
}
