// import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from 'rollup-plugin-babel'

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
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs({ include: "node_modules/**" }),
      babel()
    ]
  },
  {
    input: "index.js",
    output: [
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
      commonjs({ include: "node_modules/**" }),
    ]
  }
]
