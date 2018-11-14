import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "index.js",
  output: [
    {
      file: "webflow-multilingual.js",
      format: "umd",
      name: "wm"
    },
    {
      file: "webflow-multilingual.mjs",
      format: "es"
    }
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
  ]
};

