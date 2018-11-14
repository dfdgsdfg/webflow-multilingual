import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "index.js",
  output: [
    {
      file: "webflow-multilingual.js",
      format: "umd",
      name: "wm",
      sourcemap: true
    },
    {
      file: "webflow-multilingual.mjs",
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({ include: "node_modules/**" }),
    serve(),
    livereload()
  ]
};
