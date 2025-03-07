module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel", // ✅ Ensure Tailwind works correctly
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./components",
            "@ui": "./components/ui",
            "@stores": "./stores",
            "@scripts": "./scripts",
            "@app": "./app",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      "react-native-reanimated/plugin", // ✅ Required for animations if using Reanimated
    ],
  };
};
