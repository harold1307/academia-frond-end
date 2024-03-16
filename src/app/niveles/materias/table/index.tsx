"use client";
import React from "react";
import {
    MateriasSchema,
    MateriasTableItem,
    materiasColumns,
    horariosParams,
} from "./columns";
import { DataTable } from "./data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutateModule } from "@/hooks/use-mutate-module";
import ModalFallback from "@/app/_components/modals/modal-fallback";
import MutateModal from "@/app/_components/modals/mutate-modal";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";
import DeleteModal from "@/app/_components/modals/delete-modal";
import { Field } from "@/utils/forms";

interface MateriasTableProps {
    data: MateriasSchema[];
}

export default function MateriasTable({ data }: MateriasTableProps) {
    const horarios = React.useMemo(() => {
        return data?.map(
            horario =>
                ({
                    ...horario,
                }) satisfies MateriasTableItem,
        );
    }, [data]);

    return (
        <section className=''>
            <DataTable columns={materiasColumns} data={horarios} />
        </section>
    );
}