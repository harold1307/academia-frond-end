import { z } from "zod";
import { ZodInferSchema } from "@/utils/types";
import { useRouter } from "next/router";
import { useMutateModule } from "@/hooks/use-mutate-module";


const schema = z.object<ZodInferSchema<CreateAsignatura>>({
	nombre: z.string(),
});

export default function AddCronograma () {
   const router = useRouter()
   const { form , mutation , open , setOpen } = useMutateModule({
      schema,
      mutationFn: async (data) => {
         return 
      }
   })
}