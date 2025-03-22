import terser from '@rollup/plugin-terser';
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
 
export default {
    input: "src/index.ts",
    output: [
        { dir: "dist/cjs", format: "cjs" },
        { dir: "dist/min", format: "cjs", plugins:      [terser()] },
        { dir: "dist", format: "esm" },
    ],
    plugins: [
        typescript({ useTsconfigDeclarationDir: true, tsconfig: "tsconfig.json" }),
        commonjs(),
    ],
};