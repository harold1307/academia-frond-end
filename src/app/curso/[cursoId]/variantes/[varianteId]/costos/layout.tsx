import { fontPlay } from "@/app/_components/ui/fonts" 




export default function CostosLayoute({ children }: React.PropsWithChildren) {
    return(
        <div>
            <h5 className={` ${fontPlay.className} antialiased w-100 text-center text-xl`}>Costos</h5>
            {children}
        </div>
    )
}