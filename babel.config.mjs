export default {
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current"
            }
          }
        ]
      ]
    },
    build: {
      sourceMaps: true,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              ie: "11",
              browsers: "last 2 versions"
            },
            useBuiltIns: "usage",
            corejs: 3
          }
        ]
      ],
      ignore: ["node_modules"]
    }
  }
};
