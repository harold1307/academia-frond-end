import { env } from "@/env.mjs";
import { APIClass } from "./api";

export const APIserver = new APIClass(env.API_URL);
