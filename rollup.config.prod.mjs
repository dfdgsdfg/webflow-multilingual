import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

export default [
  {
    input: "index.js",
    output: [
      {
        file: "webflow-multilingual.js",
        format: "umd",
        name: "wm"
      }
    ],
    plugins: [babel(), resolve(), commonjs()]
  },
  {
    input: "index.js",
    output: [
      {
        file: "webflow-multilingual.min.js",
        format: "umd",
        name: "wm"
      }
    ],
    plugins: [babel(), resolve(), commonjs(), terser()]
  },
  {
    input: "index.js",
    output: [
      {
        file: "webflow-multilingual.mjs",
        format: "es"
      }
    ],
    plugins: [resolve(), commonjs()]
  },
  {
    input: "index.js",
    output: [
      {
        file: "webflow-multilingual.min.mjs",
        format: "es"
      }
    ],
    plugins: [resolve(), commonjs(), terser()]
  }
];
