import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([".next/**", "out/**", "build/**", "dist/**", "coverage/**", "next-env.d.ts"]),
]);