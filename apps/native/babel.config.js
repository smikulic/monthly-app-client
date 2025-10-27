module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // ...any other plugins
      "react-native-reanimated/plugin", // MUST be last
    ],
    // plugins: [
    //   ["module-resolver", {
    //     extensions: [".tsx", ".ts", ".js", ".json"],
    //     alias: {
    //       "@": "./app",
    //       "@monthly/api-client": "../../packages/api-client/src",
    //       "@monthly/ui": "../../packages/ui/src"
    //     }
    //   }]
    // ]
  };
};
