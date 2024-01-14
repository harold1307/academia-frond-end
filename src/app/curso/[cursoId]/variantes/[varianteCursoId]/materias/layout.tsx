import { fontPlay } from "@/app/_components/ui/fonts" 




export default function materiasLayout({ children }: React.PropsWithChildren) {
    return(
        <div>
            <h5 className={` ${fontPlay.className} antialiased w-100 text-center text-xl`}>Materias</h5>
            {children}
        </div>
    )
}