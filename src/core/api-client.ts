import { env } from "@/env.mjs";
import { APIClass } from "./api";

export const API = new APIClass(env.NEXT_PUBLIC_API_URL);
