import { Button } from "@/app/_components/ui/button";

export default function HorariosTableHandler () {
    return (
        <div className=' w-full bg-red-500 px-8 flex items-center justify-start gap-4'>
            <Button >{`<`}</Button>
            <Button >{`>`}</Button>
        </div>
    )
}