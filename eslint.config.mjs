import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs", 
      globals: { ...globals.node, ...globals.browser }
    }, 
    rules: {
      indent: ["error", 4],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "no-console": "warn",
      "no-unused-vars": ["warn", { "vars": "all", "args": "none" }]
    }
  },
  pluginJs.configs.recommended,
];
