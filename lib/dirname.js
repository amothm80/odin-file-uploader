import path from "node:path";
import { fileURLToPath } from "url";
const { dirname } = path;
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);