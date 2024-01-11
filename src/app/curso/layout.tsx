import { fontPlay } from "../_components/ui/fonts";




export default function CursoLayout({ children }: React.PropsWithChildren) {
    return(
        <div>
            <h1 className={` ${fontPlay.className} antialiased w-100 text-center text-4xl`}>Configuración de Cursos</h1>
            {children}
        </div>
    )
}