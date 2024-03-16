// import MutateModal from "@/app/_components/modals/mutate-modal";
// import { useMutateModule } from "@/hooks/use-mutate-module";


// export default function addMateria(){

//     const { form, mutation, open, setOpen } = useMutateModule({})
//     return(
//         <section>
//             <MutateModal
//                 dialogProps={{
//                     open,
//                     onOpenChange: setOpen,
//                 }}
//                 disabled={mutation.isPending}
//                 form={form}
//                 onSubmit={form.handleSubmit(data => mutation.mutate(data))}
//                 title='Adicionar Nivel Académico'
//                 withTrigger
//                 triggerLabel='Adicionar'
            
//             />
//         </section>
//     )
// }