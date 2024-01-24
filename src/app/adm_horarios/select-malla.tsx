import { Input } from "../_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";

const mallas = [
    {
        nombre: 'Malla1'
    },
    {
        nombre: 'Malla2'
    },
    {
        nombre: 'Malla3'
    }
]

export default function SelectMalla() {

    return(
        <div className='w-full h-full my-4 flex items-center justify-center'>
            <Select >
                <SelectTrigger>
                    <SelectValue placeholder='select malla' />
                </SelectTrigger>
                <SelectContent >
                    {
                        mallas.map(el => <SelectItem key={el.nombre} value={el.nombre} >{el.nombre}</SelectItem>)
                    }
                </SelectContent>
            </Select>
        </div>
    )
}