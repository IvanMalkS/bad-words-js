import terser from '@rollup/plugin-terser';
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/index.ts",
    output: [
        { dir: "dist/cjs", format: "cjs" },
        { dir: "dist/esm", format: "esm" },
        { file: "dist/index.umd.js", format: "umd", name: "RussianBadWordCensor" },
        { file: "dist/index.umd.min.js", format: "umd", name: "RussianBadWordCensor", plugins: [terser()] },
    ],
    plugins: [
        typescript({ useTsconfigDeclarationDir: true, tsconfig: "tsconfig.json" }),
        commonjs(),
    ],
};