const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Dodaj aliasy do konfiguracji webpack
  config.resolve.alias = {
    ...config.resolve.alias,
    "react-native$": "react-native-web",
    "../Utilities/Platform": "react-native-web/dist/exports/Platform",
    "../../Utilities/Platform": "react-native-web/dist/exports/Platform",
    "./Platform": "react-native-web/dist/exports/Platform",
    "my-app/assets/hamburger_icon.png": path.resolve(
      __dirname,
      "./assets/hamburger_icon.png"
    ),
    "my-app/assets/homeicon.png": path.resolve(
      __dirname,
      "./assets/homeicon.png"
    ),
    "../Utilities/BackHandler": "react-native-web/dist/exports/BackHandler",
    "../../Image/Image": "react-native-web/dist/exports/Image",

    "../Blob/BlobManager": "react-native-web/dist/exports/BlobManager",
    "../Core/RawEventEmitter": "react-native-web/dist/exports/RawEventEmitter",
  };

  return config;
};
